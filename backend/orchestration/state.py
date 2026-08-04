from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class CircularMetadata(BaseModel):
    regulator: str = "SEBI"
    category: Optional[str] = None
    reference_id: Optional[str] = None
    title: Optional[str] = None
    entity_type: Optional[str] = None
    effective_from: Optional[str] = None


class Clause(BaseModel):
    chunk_id: str
    section_label: Optional[str] = None
    heading: Optional[str] = None
    page_start: Optional[str] = None
    page_end: Optional[str] = None
    category: Optional[str] = None
    text: str


class Obligation(BaseModel):
    id: Optional[str] = None
    clause_chunk_id: Optional[str] = None
    actor: str
    section: Optional[str] = None
    obligation: str
    frequency: Optional[str] = None
    deadline: Optional[str] = None
    category: Optional[str] = None
    applicable_entities: List[str] = Field(default_factory=list)


class RiskScore(BaseModel):
    obligation_id: str
    risk_level: str
    impact_score: Optional[int] = None
    likelihood_score: Optional[int] = None
    overall_score: Optional[int] = None
    rationale: Optional[str] = None


class WorkflowTask(BaseModel):
    obligation_id: str
    order_index: int
    title: str
    description: Optional[str] = None
    department_hint: Optional[str] = None


class EvidenceSuggestion(BaseModel):
    obligation_id: str
    evidence_names: List[str] = Field(default_factory=list)


class GapResult(BaseModel):
    obligation_id: str
    status: str
    notes: Optional[str] = None


class DocumentState(BaseModel):
    document_id: str
    pdf_path: Optional[str] = None
    raw_text: Optional[str] = None
    clean_text: Optional[str] = None
    circular: Optional[CircularMetadata] = None
    clauses: List[Clause] = Field(default_factory=list)
    obligations: List[Obligation] = Field(default_factory=list)
    risk_scores: List[RiskScore] = Field(default_factory=list)
    workflows: List[WorkflowTask] = Field(default_factory=list)
    evidence_suggestions: List[EvidenceSuggestion] = Field(default_factory=list)
    gap_results: List[GapResult] = Field(default_factory=list)
    status: str = "PENDING"
    error: Optional[str] = None