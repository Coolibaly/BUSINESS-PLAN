# app/utils/formatting.py
from babel.numbers import format_currency
from datetime import datetime
import pytz

TZ = pytz.timezone("Africa/Abidjan")

def format_xof(amount: float) -> str:
    return format_currency(amount, "XOF", locale="fr_FR")

def format_datetime(dt: datetime) -> str:
    return dt.astimezone(TZ).strftime("%d/%m/%Y %H:%M")
