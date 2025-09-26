# app/api/routes/generate.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.base import get_session
from app.db.models import BusinessPlan
from app.services.generator_extras import generate_prompt_preview

router = APIRouter()

@router.post("/generate/by-name/{plan_id}/{prompt_name}")
def generate_by_name(plan_id: int, prompt_name: str, extra_ctx: dict | None = None, db: Session = Depends(get_session)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan introuvable")
    text = generate_prompt_preview(db, plan, prompt_name, extra_ctx)
    return {"prompt": prompt_name, "result": text}
