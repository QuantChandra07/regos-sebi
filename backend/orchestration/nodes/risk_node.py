import uuid
from orchestration.state import DocumentState, RiskScore

def risk_node(state: DocumentState) -> dict:
    scores = []

    try:
        from backend.agents.risk_agent import assess_risk_for_obligation

        for ob in state.obligations:
            ob_id = ob.id or str(uuid.uuid4())
            ob.id = ob_id
            result = assess_risk_for_obligation(ob.obligation, obligation_id=ob_id)
            scores.append(
                RiskScore(
                    obligation_id=ob_id,
                    risk_level=getattr(result, "risk_level", "Medium"),
                )
            )
    except Exception:
        for ob in state.obligations:
            ob_id = ob.id or str(uuid.uuid4())
            ob.id = ob_id
            scores.append(RiskScore(obligation_id=ob_id, risk_level="Medium"))

    return {"obligations": state.obligations, "risk_scores": scores, "status": "RISK_SCORED"}
