from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    admin,
    advice,
    auth,
    export,
    files,
    finance,
    intake,
    knowledge,
    market,
    plans,
    sections,
    simulate,
    users,
)
from app.core.config import settings
from app.core.logging import setup_logging, CorrelationIdMiddleware
from app.db.base import init_db


def on_startup():
    init_db()


setup_logging()

app = FastAPI(
    title="OBA Business Plan API",
    description="Backend de génération de business plans bancaires pour jeunes entrepreneurs ivoiriens",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=True,  # <- décommente si tu veux éviter les 307 automatiques
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(CorrelationIdMiddleware)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(plans.router, prefix="/business-plans", tags=["plans"])
app.include_router(sections.router, prefix="/generate", tags=["generation"])
app.include_router(finance.router, prefix="/finance", tags=["finance"])
app.include_router(simulate.router, prefix="/simulate", tags=["simulations"])
app.include_router(market.router, prefix="/market", tags=["market"])
app.include_router(advice.router, prefix="/advice", tags=["advice"])
app.include_router(export.router, prefix="/export", tags=["export"])
app.include_router(files.router, prefix="/files", tags=["files"])
app.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
app.include_router(intake.router, prefix="/intake", tags=["intake"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
