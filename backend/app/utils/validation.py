# app/utils/validation.py
import re
from pydantic import BaseModel, validator

def is_valid_siret(s: str) -> bool:
    return re.fullmatch(r"\d{14}", s) is not None

def format_fcfa(value: float) -> str:
    return f"{int(value):,}".replace(",", " ") + " FCFA"
