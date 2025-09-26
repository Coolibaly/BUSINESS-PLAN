# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.schemas.auth import RegisterRequest, LoginRequest, Token
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.deps import get_db, get_current_user
from app.db.models import User

router = APIRouter()


@router.post("/register", response_model=Token)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.exec(select(User).where(User.email == data.email)).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        phone=data.phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    payload = {"sub": str(user.id)}
    return Token(
        access_token=create_access_token(payload),
        refresh_token=create_refresh_token(payload)
    )


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    payload = {"sub": str(user.id)}
    return Token(
        access_token=create_access_token(payload),
        refresh_token=create_refresh_token(payload)
    )


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
        "phone": user.phone,
    }
