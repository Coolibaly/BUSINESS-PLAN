# app/schemas/export.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExportJobStatus(BaseModel):
    id: int
    type: str
    status: str
    file_path: Optional[str]
    created_at: datetime
