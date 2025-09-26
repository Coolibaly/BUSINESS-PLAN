# app/services/finance/simulator.py
from typing import Dict, List
from app.services.finance.models import FinancialAssumptions
import copy


def apply_delta(value: float, delta_str: str) -> float:
    if delta_str.endswith("%"):
        pct = float(delta_str.strip("%")) / 100
        return value * (1 + pct)
    elif delta_str.startswith("+") or delta_str.startswith("-"):
        return value + float(delta_str)
    else:
        return float(delta_str)


def simulate_financials(
    assumptions: FinancialAssumptions,
    deltas: Dict[str, str]
) -> FinancialAssumptions:
    modified = copy.deepcopy(assumptions)

    if "pricing" in deltas:
        modified.pricing = apply_delta(modified.pricing, deltas["pricing"])
    if "variable_costs" in deltas:
        modified.variable_costs = apply_delta(modified.variable_costs, deltas["variable_costs"])
    if "fixed_costs" in deltas:
        modified.fixed_costs = apply_delta(modified.fixed_costs, deltas["fixed_costs"])
    if "salaries" in deltas:
        modified.salaries = apply_delta(modified.salaries, deltas["salaries"])
    if "taxes" in deltas:
        modified.taxes = apply_delta(modified.taxes, deltas["taxes"])
    if "capex" in deltas:
        modified.capex = apply_delta(modified.capex, deltas["capex"])

    return modified
