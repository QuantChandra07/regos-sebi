# backend/agents/agent_router.py
"""
Agent Router - High-level orchestrator for the RegOS agent pipeline.

Chains multiple agents together:
Section Text → Obligations → Risk/Evidence/Workflow for each obligation
"""

from typing import List, Dict, Any

from agents.obligation_agent import extract_obligations_from_section
from agents.workflow_agent import generate_workflow_for_obligation, generate_workflow_simple
from agents.evidence_agent import suggest_evidence_for_obligation, suggest_evidence_simple
from agents.risk_agent import assess_risk_for_obligation, assess_risk_simple
from agents.gap_agent import run_gap_analysis, run_gap_analysis_with_deadlines

from schemas.obligation import ObligationCreate
from schemas.workflow import WorkflowResult
from schemas.evidence import EvidenceResult
from schemas.risk import RiskResult


class AgentRouter:
    """
    High-level orchestrator for the RegOS agent pipeline.
    
    Chains multiple agents together:
    Section Text → Obligations → Risk/Evidence/Workflow for each obligation
    
    Usage:
        router = AgentRouter()
        result = router.process_section(section_text, metadata)
    """

    def __init__(self, use_llm: bool = False):
        """
        Initialize the agent router.
        
        Args:
            use_llm: If True, use LLM-based agents. If False, use simple heuristics.
        """
        self.use_llm = use_llm

    def process_section(
        self,
        section_text: str,
        metadata: dict
    ) -> Dict[str, Any]:
        """
        Process a regulatory text section through the full agent pipeline.
        
        Args:
            section_text: The regulatory text to analyze
            metadata: Dict with document_title, regulator, chunk_id, section_label, document_id
        
        Returns:
            Dict with:
                - obligations: List[ObligationCreate]
                - workflows: List[WorkflowResult]
                - evidences: List[EvidenceResult]
                - risks: List[RiskResult]
        """
        # Step 1: Extract obligations
        obligations: List[ObligationCreate] = extract_obligations_from_section(
            section_text,
            metadata,
            use_llm=self.use_llm
        )

        # Step 2: Generate workflows, evidence, and risk for each obligation
        workflows: List[WorkflowResult] = []
        evidences: List[EvidenceResult] = []
        risks: List[RiskResult] = []

        for ob in obligations:
            # Use obligation text as ID if document_id is not available
            ob_id = str(ob.document_id) if ob.document_id else ob.obligation[:50]
            
            if self.use_llm:
                # Use LLM-based agents
                workflows.append(
                    generate_workflow_for_obligation(
                        obligation_text=ob.obligation,
                        obligation_id=ob_id,
                        actor=ob.actor,
                        frequency=ob.frequency,
                        deadline=ob.deadline,
                        use_llm=True
                    )
                )
                evidences.append(
                    suggest_evidence_for_obligation(
                        obligation_text=ob.obligation,
                        obligation_id=ob_id,
                        actor=ob.actor,
                        use_llm=True
                    )
                )
                risks.append(
                    assess_risk_for_obligation(
                        obligation_text=ob.obligation,
                        obligation_id=ob_id,
                        actor=ob.actor,
                        frequency=ob.frequency,
                        deadline=ob.deadline,
                        use_llm=True
                    )
                )
            else:
                # Use simple heuristics (no LLM)
                workflows.append(
                    generate_workflow_simple(
                        obligation_text=ob.obligation,
                        obligation_id=ob_id,
                    )
                )
                evidences.append(
                    suggest_evidence_simple(
                        obligation_text=ob.obligation,
                        obligation_id=ob_id,
                    )
                )
                risks.append(
                    assess_risk_simple(
                        obligation_text=ob.obligation,
                        obligation_id=ob_id,
                    )
                )

        return {
            "obligations": obligations,
            "workflows": workflows,
            "evidences": evidences,
            "risks": risks,
        }

    def process_section_with_gap_analysis(
        self,
        section_text: str,
        metadata: dict,
        existing_records: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Process a section and perform gap analysis against existing records.
        
        Args:
            section_text: The regulatory text to analyze
            metadata: Dict with document_title, regulator, chunk_id, section_label, document_id
            existing_records: List of existing compliance records from DB
        
        Returns:
            Dict with all fields from process_section plus:
                - gap_analysis: GapAnalysisResult
        """
        # Get base results
        result = self.process_section(section_text, metadata)
        
        # Convert obligations to dict format for gap analysis
        obligations_dict = [
            {
                "id": str(ob.document_id) if ob.document_id else ob.obligation[:50],
                "deadline": ob.deadline,
            }
            for ob in result["obligations"]
        ]
        
        # Run gap analysis
        gap_result = run_gap_analysis_with_deadlines(
            existing_records=existing_records,
            obligations=obligations_dict,
        )
        
        result["gap_analysis"] = gap_result
        return result


# Convenience function for simple usage
def process_regulatory_section(
    section_text: str,
    metadata: dict,
    use_llm: bool = False
) -> Dict[str, Any]:
    """
    Convenience function to process a regulatory section.
    
    Args:
        section_text: The regulatory text to analyze
        metadata: Dict with document metadata
        use_llm: If True, use LLM-based agents (default False for prototyping)
    
    Returns:
        Dict with obligations, workflows, evidences, risks
    """
    router = AgentRouter(use_llm=use_llm)
    return router.process_section(section_text, metadata)