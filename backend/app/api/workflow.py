# backend/app/api/workflow.py
"""
Workflow API Router
"""

from uuid import UUID

from fastapi import APIRouter

from backend.schemas.workflow import WorkflowResult
from agents.workflow_agent import generate_workflow_simple

router = APIRouter(prefix="/workflow", tags=["workflow"])


@router.get("/{obligation_id}", response_model=WorkflowResult)
def get_workflow_for_obligation(obligation_id: UUID):
    obligation_text = "Conduct annual cyber audit"
    
    return generate_workflow_simple(
        obligation_text=obligation_text,
        obligation_id=str(obligation_id)
    )


