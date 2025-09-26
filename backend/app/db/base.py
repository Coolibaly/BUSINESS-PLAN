# app/db/base.py
from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
import os

# Fallback local SQLite si non-PostgreSQL
DB_URL = settings.DATABASE_URL or settings.POSTGRES_URL
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}

engine = create_engine(DB_URL, echo=False, connect_args=connect_args)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    import app.db.models  # Important : importe tous les modèles
    import app.services.finance.models
    SQLModel.metadata.create_all(engine)
