# app/services/generator.py
import asyncio
import json
from datetime import datetime
from typing import AsyncGenerator, Dict, List

from sqlmodel import Session, select

from app.db.models import BusinessPlan, PlanSection, PlanSectionType
from app.llm.chains import get_llm_chain

try:
    from app.services.finance.models import FinancialAssumptions, MarketData
except Exception:
    FinancialAssumptions = None
    MarketData = None

SECTIONS_ORDER = [
    PlanSectionType.exec_summary,
    PlanSectionType.activity,
    PlanSectionType.market,
    PlanSectionType.marketing,
    PlanSectionType.ops,
    PlanSectionType.hr,
    PlanSectionType.finance,
]

def _sanitize_var(var: str) -> str:
    return var.strip().strip('"').strip("'").replace("\n", "").replace("\r", "").strip()

def _existing_sections(db: Session, plan_id: int) -> List[PlanSection]:
    """Retourne les sections déjà générées pour un plan, triées par generated_at asc."""
    rows = db.exec(select(PlanSection).where(PlanSection.plan_id == plan_id)).all() or []
    rows.sort(key=lambda r: (r.generated_at or datetime.min))
    return rows

def _existing_sections_md(db: Session, plan_id: int) -> str:
    """Concatène toutes les sections déjà générées en un seul Markdown (pour raw_md)."""
    parts: List[str] = []
    for s in _existing_sections(db, plan_id):
        title = getattr(s.section_type, "value", str(s.section_type)).replace("_", " ").title()
        content = s.content_md or ""
        parts.append(f"# {title}\n\n{content}\n")
    return "\n".join(parts).strip()

def _build_context(db: Session, plan: BusinessPlan) -> Dict[str, str]:
    ctx: Dict[str, str] = {
        # communs
        "sector": plan.sector or "",
        "city": plan.city or "",
        "project_name": plan.title or "",
        "requested_amount_fcfa": str(getattr(plan, "requested_amount_fcfa", "")),

        # marketing / ops / hr
        "target_customers": "Clients locaux autour du point de vente",
        "positioning": "Proximité, prix accessibles, service rapide",
        "marketing_budget_fcfa": "0",
        "known_constraints": "Non renseigné",

        # finance simple
        "pricing_and_volume": "Non renseigné",
        "financial_assumptions": "Non renseigné",
        "known_costs": "Non renseigné",

        # market
        "local_sources": "",

        # finance structuré (par défaut valeurs sûres)
        "known_costs_json": json.dumps([]),
        "known_prices_json": json.dumps([]),
        "historical_tx_json": json.dumps([]),
        "loan_params_json": json.dumps({}),
    }

    # Enrichissement via FinancialAssumptions si présent
    if FinancialAssumptions is not None:
        try:
            fa = db.exec(select(FinancialAssumptions).where(FinancialAssumptions.plan_id == plan.id)).first()
        except Exception:
            fa = None

        if fa:
            fixed_costs = float(getattr(fa, "fixed_costs", 0) or 0)
            variable_costs = float(getattr(fa, "variable_costs", 0) or 0)
            pricing = float(getattr(fa, "pricing", 0) or 0)
            salaries = float(getattr(fa, "salaries", 0) or 0)
            taxes = float(getattr(fa, "taxes", 0) or 0)
            capex = float(getattr(fa, "capex", 0) or 0)
            loan_rate = getattr(fa, "loan_rate", "")
            loan_duration = getattr(fa, "loan_duration", "")

            ctx.update({
                "marketing_budget_fcfa": str(int(fixed_costs * 0.1)),
                "pricing_and_volume": (
                    f"Prix unitaire: {pricing} FCFA; "
                    f"Coût variable: {variable_costs} FCFA; "
                    f"Charges fixes mensuelles: {fixed_costs} FCFA."
                ),
                "financial_assumptions": (
                    f"Taux d'intérêt: {loan_rate}; "
                    f"Durée du prêt: {loan_duration} mois; "
                    f"CAPEX: {capex} FCFA."
                ),
                "known_costs": (
                    f"Salaire: {salaries} FCFA/mois; "
                    f"Taxes: {taxes} FCFA/mois."
                ),
            })

            # JSON pour prompts structurés
            costs_json = []
            if fixed_costs:
                costs_json.append({"name": "Charges fixes mensuelles", "amount_fcfa": fixed_costs})
            if variable_costs:
                costs_json.append({"name": "Coûts variables (unité)", "amount_fcfa": variable_costs})
            if salaries:
                costs_json.append({"name": "Masse salariale mensuelle", "amount_fcfa": salaries})
            if taxes:
                costs_json.append({"name": "Taxes mensuelles", "amount_fcfa": taxes})

            prices_json = []
            if pricing:
                prices_json.append({"item": "Produit/Service principal", "price_fcfa": pricing})

            # Montant prêté supposé = requested_amount si présent
            try:
                principal = int(getattr(plan, "requested_amount_fcfa", 0) or 0)
            except Exception:
                principal = 0

            loan_params = {}
            if principal:
                loan_params["principal_fcfa"] = principal
            if loan_rate:
                loan_params["annual_rate"] = loan_rate
            if loan_duration:
                loan_params["duration_months"] = loan_duration

            ctx.update({
                "known_costs_json": json.dumps(costs_json, ensure_ascii=False),
                "known_prices_json": json.dumps(prices_json, ensure_ascii=False),
                "historical_tx_json": json.dumps([], ensure_ascii=False),  # si tu as de l'historique, remplace ici
                "loan_params_json": json.dumps(loan_params, ensure_ascii=False),
            })

    # Enrichissement via MarketData si présent
    if MarketData is not None:
        try:
            rows = db.exec(select(MarketData).where(MarketData.plan_id == plan.id)).all() or []
        except Exception:
            rows = []
        if rows:
            bullets = []
            for r in rows:
                try:
                    bullets.append(
                        f"- {r.source} ({getattr(r, 'region', 'N/A')}) — "
                        f"{getattr(r, 'metric', 'indicateur')}: {getattr(r, 'value', '')} "
                        f"(fiabilité {getattr(r, 'reliability_score', 'N/A')})"
                    )
                except Exception:
                    continue
            ctx["local_sources"] = "\n".join(bullets)

    return ctx

def _hydrate_inputs(chain, db: Session, plan: BusinessPlan, ctx: Dict[str, str]) -> Dict[str, str]:
    """Hydrate uniquement ce que le prompt réclame. Génère raw_md à la volée si demandé."""
    required = getattr(chain.prompt, "input_variables", []) or []
    # raw_md est demandé par ex. style_refiner.txt
    if "raw_md" in required and "raw_md" not in ctx:
        ctx = dict(ctx)
        ctx["raw_md"] = _existing_sections_md(db, plan.id)
    return {raw: str(ctx.get(_sanitize_var(raw), "")) for raw in required}

def _missing_vars(required: List[str], hydrated: Dict[str, str]) -> List[str]:
    return [k for k in required if not hydrated.get(k, "").strip()]

async def generate_all_sections(db: Session, plan: BusinessPlan) -> AsyncGenerator[str, None]:
    """
    Génère toutes les sections dans un ordre déterministe et les enregistre.
    Stream des messages de progression (à utiliser avec SSE ou collecte).
    """
    for section_type in SECTIONS_ORDER:
        chain = get_llm_chain(section_type)
        base_ctx = _build_context(db, plan)
        inputs = _hydrate_inputs(chain, db, plan, base_ctx)

        # feedback utile si un prompt devient vide à cause d'inputs manquants
        required = getattr(chain.prompt, "input_variables", []) or []
        missing = _missing_vars(required, inputs)
        if missing:
            # on n'interrompt pas, mais on log dans le stream
            yield f"⚠️ {section_type.value}: variables manquantes -> {', '.join(missing)}"

        try:
            result = chain.invoke(inputs)
        except Exception as e:
            yield f"❌ Erreur sur {section_type.value}: {e}"
            continue

        content = result.get("text", "").strip() if isinstance(result, dict) else str(result).strip()
        if not content:
            yield f"❌ Erreur sur {section_type.value}: génération vide"
            continue

        section = PlanSection(
            plan_id=plan.id,
            section_type=section_type,
            content_md=content,
            generated_at=datetime.utcnow()
        )

        db.add(section)
        db.commit()
        yield f"✅ {section_type.value} générée"
        await asyncio.sleep(0.05)

def generate_section(plan_id: int, section_name: str, context: Dict | None = None) -> str:
    """
    Génère le contenu d'une section de business plan.
    Args:
        plan_id (int): ID du business plan
        section_name (str): Nom de la section (ex: "Résumé", "Analyse de marché")
        context (dict): Contexte additionnel (facultatif)

    Returns:
        str: Contenu généré
    """
    # Pour l’instant, on renvoie juste un texte de test
    return f"Section '{section_name}' du plan {plan_id} générée avec succès."