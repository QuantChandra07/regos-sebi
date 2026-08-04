# backend/schemas/workflow.py
from typing import List
from uuid import UUID

from pydantic import BaseModel


class WorkflowTask(BaseModel):
    order: int
    title: str
    description: str


class WorkflowResult(BaseModel):
    obligation_id: UUID
    tasks: List[WorkflowTask]