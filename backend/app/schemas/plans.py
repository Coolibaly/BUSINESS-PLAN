# app/schemas/plans.py
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class BusinessPlanCreate(BaseModel):
    title: str
    sector: str
    city: str
    requested_amount_fcfa: float


class BusinessPlanOut(BusinessPlanCreate):
    id: int
    status: Literal["draft", "final"]
    created_at: datetime
    updated_at: datetime
    currency: str = "XOF"
    country: str = "CI"

    class Config:
        from_attributes = True
