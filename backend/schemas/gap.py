# backend/schemas/gap.py
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field
from typing import Literal


# Constrained status values
GapStatusType = Literal["Missing", "Overdue", "Completed", "Not Applicable"]


class GapStatus(BaseModel):
    obligation_id: UUID
    status: GapStatusType


class GapAnalysisResult(BaseModel):
    items: List[GapStatus]