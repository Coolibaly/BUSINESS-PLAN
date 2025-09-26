from datetime import datetime

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.deps import get_db, require_role
from app.services.finance.models import AuditLog

router = APIRouter()


@router.get("/metrics")
def metrics():
    # Basique, compatible supervision
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/audit")
def get_audit_logs(
    db: Session = Depends(get_db),
    _: str = Depends(require_role("admin"))
):
    return db.exec(
        select(AuditLog).order_by(AuditLog.at.desc()).limit(100)
    ).all()


@router.get("/config")
def get_config(_: str = Depends(require_role("admin"))):
    from app.core.config import settings
    return {
        "USE_OPENAI": settings.USE_OPENAI,
        "ENABLE_REDIS": settings.ENABLE_REDIS,
        "ENABLE_SSE": settings.ENABLE_SSE
    }
