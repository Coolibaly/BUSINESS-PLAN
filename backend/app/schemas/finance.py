from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


class FinancialAssumptionsIn(BaseModel):
    pricing: float
    variable_costs: float
    fixed_costs: float
    salaries: float
    taxes: float
    capex: float
    loan_rate: float = Field(ge=0, le=1)
    loan_duration: int = Field(gt=0)
    seasonality: list[float] = Field(min_items=12, max_items=12)
    growth_rates: list[float] = Field(min_items=12, max_items=12)
    
    start_date: date | None = None


class FinancialKPI(BaseModel):
    break_even_units: float
    break_even_revenue: float
    gross_margin_pct: float
    opex_to_revenue: float
    dscr: Optional[float]
    npv: Optional[float]
    irr: Optional[float]
