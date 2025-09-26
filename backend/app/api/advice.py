# app/api/advice.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan
from app.services.finance.models import FinancialAssumptions, Advice
from app.schemas.advice import AdviceOut
from app.services.advice import generate_advice

router = APIRouter()


@router.post("/{plan_id}/generate")
def generate(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    assumptions = db.exec(
        select(FinancialAssumptions).where(FinancialAssumptions.plan_id == plan_id)
    ).first()
    if not assumptions:
        raise HTTPException(status_code=400, detail="Aucune hypothèse disponible")

    generate_advice(db, plan, assumptions)
    return {"detail": "Conseils générés"}


@router.get("/{plan_id}", response_model=list[AdviceOut])
def list_advice(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    return db.exec(select(Advice).where(Advice.plan_id == plan_id)).all()
