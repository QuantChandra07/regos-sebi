# backend/schemas/__init__.py
"""
Re-export all schema classes for clean imports elsewhere in the codebase.
Example: from backend.schemas import ObligationResponse, RiskResult
"""

from .obligation import (
    ObligationBase,
    ObligationCreate,
    ObligationUpdate,
    ObligationResponse,  # Changed from ObligationRead
    FrequencyType,
    RiskLevelType,
)

from .applicability import ApplicabilityResult

from .risk import RiskResult

from .evidence import EvidenceResult

from .workflow import WorkflowTask, WorkflowResult

from .gap import GapStatus, GapAnalysisResult, GapStatusType

__all__ = [
    # Obligation
    "ObligationBase",
    "ObligationCreate",
    "ObligationUpdate",
    "ObligationResponse",  # Changed from ObligationRead
    "FrequencyType",
    "RiskLevelType",
    # Applicability
    "ApplicabilityResult",
    # Risk
    "RiskResult",
    # Evidence
    "EvidenceResult",
    # Workflow
    "WorkflowTask",
    "WorkflowResult",
    # Gap
    "GapStatus",
    "GapAnalysisResult",
    "GapStatusType",
]