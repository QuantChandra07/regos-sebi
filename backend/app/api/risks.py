# backend/app/api/risks.py
"""
Risk API Router
"""

from uuid import UUID

from fastapi import APIRouter

from backend.schemas.risk import RiskResult
from agents.risk_agent import assess_risk_simple

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/{obligation_id}", response_model=RiskResult)
def get_risk_for_obligation(obligation_id: UUID):
    obligation_text = "Conduct annual cyber audit"
    
    return assess_risk_simple(
        obligation_text=obligation_text,
        obligation_id=str(obligation_id)
    )


