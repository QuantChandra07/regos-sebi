# backend/schemas/applicability.py
from typing import List
from uuid import UUID

from pydantic import BaseModel


class ApplicabilityResult(BaseModel):
    actors: List[str]