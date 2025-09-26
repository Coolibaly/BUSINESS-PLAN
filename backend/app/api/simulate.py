# app/api/simulate.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan
from app.services.finance.models import FinancialAssumptions, Scenario
from app.schemas.simulate import SimulationRequest
from app.services.finance.simulator import simulate_financials
from uuid import uuid4

router = APIRouter()


@router.post("/{plan_id}")
def create_scenario(
    plan_id: int,
    body: SimulationRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    base = db.exec(select(FinancialAssumptions).where(FinancialAssumptions.plan_id == plan_id)).first()
    if not base:
        raise HTTPException(status_code=400, detail="Aucune hypothèse existante")

    simulated = simulate_financials(base, body.delta)

    name = f"Scénario {datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
    scenario = Scenario(plan_id=plan.id, name=name, deltas_json=body.delta)
    db.add(scenario)
    db.commit()

    return {
        "detail": "Scénario enregistré",
        "name": name,
        "modified_pricing": simulated.pricing,
        "modified_costs": {
            "variable": simulated.variable_costs,
            "fixed": simulated.fixed_costs + simulated.salaries + simulated.taxes
        }
    }
