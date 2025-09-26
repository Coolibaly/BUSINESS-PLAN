from datetime import datetime
from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan, PlanSection, PlanSectionType
from app.llm.chains import get_llm_chain
from app.services.generator import generate_all_sections
from app.utils.sse import sse_stream
from fastapi.responses import StreamingResponse
from app.services.generator import generate_section

# Optionnels : pour hydrater certains champs si présents
try:
    from app.services.finance.models import FinancialAssumptions, MarketData
except Exception:  # pragma: no cover
    FinancialAssumptions = None
    MarketData = None

router = APIRouter()

def sse_stream(producer):
    def _gen():
        for chunk in producer():
            yield f"data: {chunk}\n\n"
        yield "event: end\ndata: done\n\n"
    return StreamingResponse(_gen(), media_type="text/event-stream")

def generate_all_sections(db, plan):
    # Pseudo: enchaine les sections et yield au fur et à mesure
    for section in ["exec_summary","activity","market","marketing","ops","hr","finance"]:
        text = generate_section(db, plan, section)  # ta logique existante
        yield f'{{"section":"{section}","ok":true}}'

def _sanitize_var(var: str) -> str:
    # nettoie les noms de variables mal formés dans certains prompts : {"hypotheses"}, { "x" }, ou avec sauts de ligne
    return var.strip().strip('"').strip("'").replace("\n", "").replace("\r", "").strip()

def _build_context_from_plan(db: Session, plan: BusinessPlan) -> Dict[str, str]:
    ctx: Dict[str, str] = {
        "sector": plan.sector or "",
        "city": plan.city or "",
        "requested_amount_fcfa": str(getattr(plan, "requested_amount_fcfa", "")),
        "project_name": plan.title or "",
        "target_customers": "Clients locaux autour du point de vente",
        "positioning": "Proximité, prix accessibles, service rapide",
        "marketing_budget_fcfa": "0",
        "known_constraints": "Non renseigné",
        "pricing_and_volume": "Non renseigné",
        "financial_assumptions": "Non renseigné",
        "known_costs": "Non renseigné",
        "hypotheses": "Non renseigné",
        "local_sources": "",
    }
    # Hypothèses financières si disponibles
    if FinancialAssumptions is not None:
        try:
            fa = db.exec(select(FinancialAssumptions).where(FinancialAssumptions.plan_id == plan.id)).first()
        except Exception:
            fa = None
        if fa:
            ctx.update({
                "marketing_budget_fcfa": str(int(getattr(fa, "fixed_costs", 0) * 0.1)),
                "pricing_and_volume": f"Prix unitaire: {getattr(fa,'pricing', '')} FCFA; "
                                      f"Coût variable: {getattr(fa,'variable_costs','')} FCFA; "
                                      f"Charges fixes mensuelles: {getattr(fa,'fixed_costs','')} FCFA.",
                "financial_assumptions": (
                    f"Taux d'intérêt: {getattr(fa,'loan_rate','')} ; "
                    f"Durée du prêt: {getattr(fa,'loan_duration','')} mois ; "
                    f"CAPEX: {getattr(fa,'capex','')} FCFA."
                ),
                "known_costs": f"Salaire: {getattr(fa,'salaries','')} FCFA/mois ; "
                               f"Taxes: {getattr(fa,'taxes','')} FCFA/mois."
            })
    # Sources marché si collectées
    if MarketData is not None:
        try:
            rows = db.exec(select(MarketData).where(MarketData.plan_id == plan.id)).all()
        except Exception:
            rows = []
        if rows:
            bullets = []
            for r in rows:
                try:
                    bullets.append(f"- {r.source} ({r.region}) — {r.metric}: {r.value} (fiabilité {r.reliability_score})")
                except Exception:
                    continue
            ctx["local_sources"] = "\n".join(bullets)
    return ctx

def _hydrate_inputs(chain, base_ctx: Dict[str, str]) -> Dict[str, str]:
    # Récupère les variables attendues par le prompt et les remplit depuis base_ctx, sinon par défaut ""
    required = getattr(chain.prompt, "input_variables", []) or []
    inputs: Dict[str, str] = {}
    for raw in required:
        clean = _sanitize_var(raw)
        inputs[raw] = str(base_ctx.get(clean, ""))  # on mappe sur le nom nettoyé
    return inputs

@router.api_route("/{plan_id}/all", methods=["POST", "GET"])
def generate_all(
    plan_id: int,
    sse: bool = Query(False),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    if sse:
        return sse_stream(lambda: generate_all_sections(db, plan))

    messages = []
    # version non-SSE : on consomme l'async generator et on renvoie un simple statut
    import asyncio
    async def _collect():
        async for msg in generate_all_sections(db, plan):
            messages.append(msg)
    asyncio.run(_collect())
    return JSONResponse({"detail": "Génération terminée", "steps": messages})

@router.api_route("/{plan_id}/all", methods=["POST", "GET"])
def stream_all(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    return sse_stream(lambda: generate_all_sections(db, plan))


@router.post("/{plan_id}/{section}")
def generate_section(
    plan_id: int,
    section: PlanSectionType = Path(..., description="Nom de section: exec_summary, activity, market, marketing, ops, hr, finance"),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    chain = get_llm_chain(section)

    # Construit un contexte commun depuis le plan + données associées
    base_ctx = _build_context_from_plan(db, plan)
    # Hydrate uniquement les variables attendues par le prompt
    inputs = _hydrate_inputs(chain, base_ctx)

    try:
        result = chain.invoke(inputs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur LLM: {e}")

    # LLMChain.invoke renvoie souvent {"text": "..."} ; fallback str sinon
    content = result.get("text", "").strip() if isinstance(result, dict) else str(result).strip()
    if not content:
        raise HTTPException(status_code=500, detail="Génération vide")

    new_section = PlanSection(
        plan_id=plan.id,
        section_type=section,
        content_md=content,
        generated_at=datetime.utcnow(),
    )
    db.add(new_section)
    db.commit()
    return {"section": section, "content": content}


@router.get("/{plan_id}/all")
def gen_all_get(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    return sse_stream(lambda: generate_all_sections(db, plan))
