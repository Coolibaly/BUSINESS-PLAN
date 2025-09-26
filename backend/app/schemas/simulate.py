from pydantic import BaseModel
from typing import Dict, Any


class SimulationRequest(BaseModel):
    delta: Dict[str, str]  # exemple : { "sales": "+10%" }


class SimulationResponse(BaseModel):
    original_values: Dict[str, float]    # valeurs initiales avant simulation
    simulated_values: Dict[str, float]   # valeurs calculées après application des deltas
    deltas_applied: Dict[str, str]       # mêmes deltas reçus dans la requête
    summary: Dict[str, Any] = {}         # résumé ou indicateurs clés de la simulation (optionnel)
