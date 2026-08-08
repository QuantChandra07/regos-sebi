from orchestration.state import DocumentState

def applicability_node(state: DocumentState) -> dict:
    updated = []

    try:
        from agents.applicability_agent import get_applicability

        for ob in state.obligations:
            result = get_applicability(ob.obligation, {"document_title": state.circular.title if state.circular else ""})
            ob.applicable_entities = getattr(result, "actors", []) or []
            updated.append(ob)
    except Exception:
        for ob in state.obligations:
            ob.applicable_entities = [state.circular.entity_type] if state.circular and state.circular.entity_type else []
            updated.append(ob)

    return {"obligations": updated, "status": "APPLICABILITY_ENRICHED"}
