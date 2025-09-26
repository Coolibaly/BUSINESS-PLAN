# app/db/models.py
from sqlmodel import SQLModel, Field, Relationship, JSON
from sqlalchemy import Column
from typing import Optional, List
from datetime import datetime, timezone
from enum import Enum


class Role(str, Enum):
    admin = "admin"
    analyst = "analyst"
    owner = "owner"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: Role = Field(default=Role.owner)
    full_name: Optional[str]
    phone: Optional[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    plans: List["BusinessPlan"] = Relationship(back_populates="owner")


class BusinessPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    title: str
    sector: str
    city: str
    country: str = "CI"
    currency: str = "XOF"
    requested_amount_fcfa: float
    status: str = "draft"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    owner: User = Relationship(back_populates="plans")
    sections: List["PlanSection"] = Relationship(back_populates="plan")
    export_jobs: List["ExportJob"] = Relationship(back_populates="plan")


class PlanSectionType(str, Enum):
    exec_summary = "exec_summary"
    activity     = "activity"
    market       = "market"
    marketing    = "marketing"
    ops          = "ops"
    hr           = "hr"
    finance      = "finance"

class PlanSection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int      = Field(foreign_key="businessplan.id", index=True)

    # Renommé pour plus de clarté
    section_type: PlanSectionType

    content_md: str
    score_quality: Optional[float]

    # JSON stocké dans la colonne SQL, sans imbrication de Field
    sources: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, nullable=False),
        description="Liste d'URLs ou de références"
    )

    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    plan: BusinessPlan = Relationship(back_populates="sections")


class ExportJob(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)
    type: str        # "pdf" ou "pptx"
    status: str      # ex. "pending", "done", "failed"
    file_path: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relation inverse vers BusinessPlan
    plan: BusinessPlan = Relationship(back_populates="export_jobs")
