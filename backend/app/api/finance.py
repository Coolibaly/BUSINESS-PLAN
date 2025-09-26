from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan
from app.services.finance.models import FinancialAssumptions, FinancialForecast
from app.schemas.finance import FinancialAssumptionsIn, FinancialKPI
from app.services.finance.calculators import (
    break_even_units, break_even_revenue,
    gross_margin_pct, opex_to_revenue, dscr, npv, irr
)

router = APIRouter()


@router.post("/{plan_id}/assumptions")
def save_assumptions(
    plan_id: int,
    data: FinancialAssumptionsIn,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    existing = db.exec(
        select(FinancialAssumptions).where(FinancialAssumptions.plan_id == plan_id)
    ).first()

    payload = data.dict()
    if existing:
        for key, value in payload.items():
            setattr(existing, key, value)
        db.add(existing)
    else:
        new = FinancialAssumptions(plan_id=plan_id, **payload)
        db.add(new)
    db.commit()
    return {"detail": "Hypothèses enregistrées"}


@router.get("/{plan_id}/kpi", response_model=FinancialKPI)
def compute_kpis(
    plan_id: int,
    rate: float = Query(default=0.1),  # taux d'actualisation annuel pour NPV
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    assumptions = db.exec(
        select(FinancialAssumptions).where(FinancialAssumptions.plan_id == plan_id)
    ).first()
    if not assumptions:
        raise HTTPException(status_code=400, detail="Aucune hypothèse trouvée")

    prix = assumptions.pricing
    cv = assumptions.variable_costs
    cf = assumptions.fixed_costs + assumptions.salaries + assumptions.taxes
    capex = assumptions.capex

    # Projection simple: 100 unités / mois
    monthly_units = 100.0
    monthly_revenue = prix * monthly_units
    monthly_cogs = cv * monthly_units
    monthly_opex = cf
    monthly_ebitda = monthly_revenue - monthly_cogs - monthly_opex

    # DSCR avec service de la dette mensuel
    r_annual = float(assumptions.loan_rate or 0.0)
    n_months = max(int(assumptions.loan_duration or 0), 1)
    r_month = r_annual / 12.0

    if r_month > 0:
        # Annuité (PMT)
        debt_service = capex * (r_month * (1 + r_month) ** n_months) / ((1 + r_month) ** n_months - 1)
    else:
        debt_service = capex / n_months

    dscr_value = dscr(monthly_ebitda, debt_service)

    # Flux mensuels après service de la dette pour NPV/IRR (sur 12 mois)
    duration = 12
    monthly_cashflow_after_debt = monthly_ebitda - debt_service
    flows = [-capex] + [monthly_cashflow_after_debt] * duration

    return FinancialKPI(
        break_even_units=break_even_units(prix, cv, cf),
        break_even_revenue=break_even_revenue(prix, cv, cf),
        gross_margin_pct=gross_margin_pct(monthly_revenue, monthly_cogs),
        opex_to_revenue=opex_to_revenue(monthly_opex, monthly_revenue),
        dscr=dscr_value,
        npv=npv(rate, flows),
        irr=irr(flows),
    )
