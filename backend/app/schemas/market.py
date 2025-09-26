# app/schemas/market.py
from pydantic import BaseModel
from typing import List
from datetime import date


class MarketDataOut(BaseModel):
    source: str
    region: str
    metric: str
    value: float
    as_of: date
    reliability_score: float
