# app/api/intake.py
from fastapi import APIRouter
from app.services.intake import IntakePayload, extract_fields

router = APIRouter()

@router.post("")
def normalize_intake(payload: IntakePayload):
    fields = extract_fields(payload.raw_text)
    return fields
