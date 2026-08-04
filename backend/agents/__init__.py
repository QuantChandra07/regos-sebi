# backend/agents/__init__.py
"""
Agent layer for RegOS - wraps LLM calls for structured outputs.
"""

from agents.obligation_agent import extract_obligations_from_section
from agents.applicability_agent import get_applicability
from agents.risk_agent import assess_risk_for_obligation, assess_risk_simple
from agents.evidence_agent import suggest_evidence_for_obligation, suggest_evidence_simple
from agents.workflow_agent import generate_workflow_for_obligation, generate_workflow_simple
from agents.gap_agent import run_gap_analysis, run_gap_analysis_with_deadlines, get_gap_summary
from agents.agent_router import AgentRouter, process_regulatory_section


__all__ = [
    "extract_obligations_from_section",
    "get_applicability",
    "assess_risk_for_obligation",
    "assess_risk_simple",
    "suggest_evidence_for_obligation",
    "suggest_evidence_simple",
    "generate_workflow_for_obligation",
    "generate_workflow_simple",
    "run_gap_analysis",
    "run_gap_analysis_with_deadlines",
    "get_gap_summary",
    "AgentRouter",
    "process_regulatory_section",
]