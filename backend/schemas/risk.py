# backend/schemas/risk.py
from uuid import UUID

from pydantic import BaseModel
from .obligation import RiskLevelType


class RiskResult(BaseModel):
    obligation_id: UUID
    risk_level: RiskLevelType