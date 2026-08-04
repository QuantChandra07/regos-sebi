# backend/schemas/obligation.py
from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


# ─────────────────────────────────────────────────────────────
# Constrained string types for validation (runtime-checked enums)
# ─────────────────────────────────────────────────────────────
FrequencyType = Literal["Daily", "Weekly", "Monthly", "Quarterly", "Annually", "One-time", "As needed"]
RiskLevelType = Literal["Low", "Medium", "High", "Critical"]


# ─────────────────────────────────────────────────────────────
# Base schema (shared fields)
# ─────────────────────────────────────────────────────────────
class ObligationBase(BaseModel):
    """
    Shared fields for create/update/read operations.
    Optional fields default to None unless explicitly set.
    """
    source_chunk_id: Optional[str] = None
    document_id: Optional[UUID] = None
    actor: str = Field(..., min_length=1, max_length=200, description="Responsible party (e.g., 'Landlord', 'Vendor')")
    section: Optional[str] = Field(None, max_length=500, description="Document/contract section reference")
    obligation: str = Field(..., min_length=1, max_length=5000, description="Obligation description text")
    frequency: Optional[FrequencyType] = Field(None, description="How often the obligation recurs")
    deadline: Optional[str] = Field(None, max_length=500, description="Deadline (absolute or relative, e.g., 'within 30 days')")
    risk_level: Optional[RiskLevelType] = Field(None, description="Risk classification")
    evidence: List[str] = Field(default_factory=list, description="Supporting evidence snippets")


# ─────────────────────────────────────────────────────────────
# Create schema (for POST /obligations)
# ─────────────────────────────────────────────────────────────
class ObligationCreate(ObligationBase):
    """
    Schema for creating a new obligation.
    All fields from ObligationBase are available; server generates id and created_at.
    """
    pass


# ─────────────────────────────────────────────────────────────
# Update schema (for PATCH /obligations/{id})
# ─────────────────────────────────────────────────────────────
class ObligationUpdate(BaseModel):
    """
    Schema for partially updating an obligation.
    All fields are optional — only provided fields are updated.
    """
    actor: Optional[str] = Field(None, min_length=1, max_length=200)
    section: Optional[str] = Field(None, max_length=500)
    obligation: Optional[str] = Field(None, min_length=1, max_length=5000)
    frequency: Optional[FrequencyType] = None
    deadline: Optional[str] = Field(None, max_length=500)
    risk_level: Optional[RiskLevelType] = None
    evidence: Optional[List[str]] = None


# ─────────────────────────────────────────────────────────────
# Read/Response schema (for GET /obligations and GET /obligations/{id})
# ─────────────────────────────────────────────────────────────
class ObligationResponse(ObligationBase):
    """
    Full obligation object returned by the API.
    Includes server-generated fields (id, created_at).
    """
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)  # Pydantic v2: enables ORM mode