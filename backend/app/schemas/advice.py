# app/schemas/advice.py
from typing import List
from pydantic import BaseModel, ConfigDict

class AdviceOut(BaseModel):
    category: str
    message: str
    priority: int
    model_config = ConfigDict(from_attributes=True)
