from datetime import date, datetime, timezone
from enum import Enum
from typing import Optional, List, Dict

from sqlalchemy import Column
from sqlmodel import SQLModel, Field, JSON


class FinancialAssumptions(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)

    pricing: float                          # Prix de vente unitaire
    variable_costs: float                   # Coût variable unitaire
    fixed_costs: float                      # Charges fixes mensuelles
    salaries: float                         # Masse salariale mensuelle
    taxes: float                            # Charges fiscales mensuelles
    capex: float                            # Investissements initiaux
    loan_rate: float                        # Taux d'intérêt annuel (ex: 0.1 pour 10%)
    loan_duration: int                      # Durée en mois

    seasonality: List[float] = Field(
        default_factory=lambda: [1.0] * 12,
        sa_column=Column(JSON, nullable=False),
        description="Facteur de saisonnalité mensuel"
    )
    growth_rates: List[float] = Field(
        default_factory=lambda: [0.0] * 12,
        sa_column=Column(JSON, nullable=False),
        description="Taux de croissance mensuel"
    )
    start_date: date = Field(default_factory=date.today)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ForecastGranularity(str, Enum):
    monthly = "monthly"
    quarterly = "quarterly"
    yearly = "yearly"


class FinancialForecast(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)
    period: str  # Format YYYY-MM or YYYY-Qn or YYYY

    revenue: float
    cogs: float
    gross_margin: float
    opex: float
    ebitda: float
    cashflow: float
    cum_cashflow: float


class Scenario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)
    name: str
    deltas_json: Dict[str, float] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
        description="Modifications de scénario sous forme de dict"
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MarketData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)
    source: str
    region: str
    metric: str
    value: float
    as_of: date
    reliability_score: float


class Advice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)
    category: str
    message: str
    priority: int


class FileKind(str, Enum):
    logo = "logo"
    annexe = "annexe"


class FileAsset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="businessplan.id", index=True)
    kind: FileKind
    path: str
    meta: Dict[str, str] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
        description="Métadonnées du fichier"
    )


class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    actor_id: int = Field(foreign_key="user.id", index=True)
    action: str
    entity: str
    entity_id: Optional[int]
    meta: Dict[str, str] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
        description="Informations complémentaires"
    )
    at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
