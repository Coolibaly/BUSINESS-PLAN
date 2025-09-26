# app/services/intake.py
from pydantic import BaseModel, field_validator
from typing import Optional
import re


class IntakePayload(BaseModel):
    raw_text: str

    @field_validator("raw_text")
    @classmethod
    def normalize_text(cls, v):
        return v.strip().replace("\n", " ")


def extract_fields(text: str) -> dict:
    """
    Très simple parseur basé sur règles / regex. 
    À améliorer avec modèle NLP local si besoin.
    """
    secteur = None
    ville = None
    montant = None

    # Extractions simples
    if "couture" in text.lower():
        secteur = "artisanat"
    if "livraison" in text.lower():
        secteur = "logistique"
    if "cacao" in text.lower():
        secteur = "agriculture"

    villes = ["Abidjan", "Bouaké", "San Pedro", "Yamoussoukro"]
    for v in villes:
        if v.lower() in text.lower():
            ville = v

    montant_match = re.search(r"\b(\d{3,7})\s?FCFA", text)
    if montant_match:
        montant = float(montant_match.group(1))

    return {
        "sector": secteur or "inconnu",
        "city": ville or "Abidjan",
        "requested_amount_fcfa": montant or 100000
    }
