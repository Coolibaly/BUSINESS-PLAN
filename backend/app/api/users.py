# app/api/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.models import User
from app.core.deps import get_db, require_role
from app.schemas.users import UserOut
from typing import List

router = APIRouter()


@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_role("admin"))):
    return db.exec(select(User)).all()
