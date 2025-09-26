# app/api/export.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan, PlanSection, ExportJob
from app.services.export.pdf import generate_pdf
from app.services.export.pptx import generate_pptx
from app.services.finance.models import AuditLog
from app.schemas.export import ExportJobStatus
from datetime import datetime
import os

router = APIRouter()

@router.post("/{plan_id}/pdf", response_model=ExportJobStatus)
def export_pdf(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    sections = db.exec(select(PlanSection).where(PlanSection.plan_id == plan_id)).all()
    texts = [s.content_md for s in sections]
    filename = f"{plan_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    path = generate_pdf(plan.title, texts, filename)

    job = ExportJob(plan_id=plan_id, type="pdf", status="done", file_path=path)
    db.add(job)
    db.commit()
    return job


@router.post("/{plan_id}/pptx", response_model=ExportJobStatus)
def export_pptx(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    sections = db.exec(select(PlanSection).where(PlanSection.plan_id == plan_id)).all()
    texts = [s.content_md for s in sections]
    filename = f"{plan_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pptx"
    path = generate_pptx(plan.title, texts, filename)

    job = ExportJob(plan_id=plan_id, type="pptx", status="done", file_path=path)
    db.add(job)
    db.commit()
    return job


@router.get("/jobs/{job_id}", response_model=ExportJobStatus)
def get_export_status(job_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    job = db.get(ExportJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Export non trouvé")
    return job