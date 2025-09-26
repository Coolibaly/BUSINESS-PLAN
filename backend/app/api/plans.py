# app/api/plans.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.db.models import BusinessPlan, User
from app.core.deps import get_db, get_current_user
from app.schemas.plans import BusinessPlanCreate, BusinessPlanOut
from typing import List

router = APIRouter()


@router.post("/", response_model=BusinessPlanOut)
def create_plan(data: BusinessPlanCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = BusinessPlan(**data.dict(), owner_id=user.id)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/", response_model=List[BusinessPlanOut])
def list_plans(
    query: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    stmt = select(BusinessPlan).where(BusinessPlan.owner_id == user.id)
    if query:
        stmt = stmt.where(BusinessPlan.title.contains(query))
    if status:
        stmt = stmt.where(BusinessPlan.status == status)
    return db.exec(stmt).all()


@router.get("/{id}", response_model=BusinessPlanOut)
def get_plan(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = db.get(BusinessPlan, id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    return plan


@router.patch("/{id}", response_model=BusinessPlanOut)
def update_plan(id: int, data: BusinessPlanCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = db.get(BusinessPlan, id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(plan, key, value)
    db.add(plan)
    db.commit()
    return plan


@router.delete("/{id}")
def delete_plan(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = db.get(BusinessPlan, id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    db.delete(plan)
    db.commit()
    return {"detail": "Supprimé"}
