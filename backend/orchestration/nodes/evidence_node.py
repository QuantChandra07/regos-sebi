from orchestration.state import DocumentState, EvidenceSuggestion

def evidence_node(state: DocumentState) -> dict:
    suggestions = []

    try:
        from backend.agents.evidence_agent import suggest_evidence_for_obligation

        for ob in state.obligations:
            result = suggest_evidence_for_obligation(ob.obligation, obligation_id=ob.id)
            suggestions.append(
                EvidenceSuggestion(
                    obligation_id=ob.id,
                    evidence_names=getattr(result, "evidence", []) or [],
                )
            )
    except Exception:
        for ob in state.obligations:
            suggestions.append(
                EvidenceSuggestion(
                    obligation_id=ob.id,
                    evidence_names=["Policy Document", "Audit Report", "Compliance Register"],
                )
            )

    return {"evidence_suggestions": suggestions, "status": "EVIDENCE_SUGGESTED"}
