# backend/schemas/evidence.py
from typing import List
from uuid import UUID

from pydantic import BaseModel


class EvidenceResult(BaseModel):
    obligation_id: UUID
    evidence: List[str]