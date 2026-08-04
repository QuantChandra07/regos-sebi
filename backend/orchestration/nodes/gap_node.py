from backend.orchestration.state import DocumentState, GapResult

def gap_node(state: DocumentState) -> dict:
    results = []

    try:
        from backend.agents.gap_agent import run_gap_analysis

        obligations_payload = [{"id": ob.id, "text": ob.obligation} for ob in state.obligations]
        result = run_gap_analysis([], obligations_payload)

        for item in getattr(result, "items", []):
            results.append(
                GapResult(
                    obligation_id=item.obligation_id,
                    status=getattr(item, "status", "Missing"),
                )
            )
    except Exception:
        for ob in state.obligations:
            results.append(GapResult(obligation_id=ob.id, status="Missing"))

    return {"gap_results": results, "status": "GAP_ANALYZED"}