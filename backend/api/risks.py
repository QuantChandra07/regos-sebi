from fastapi import APIRouter

router = APIRouter(prefix="/risks", tags=["risks"])


@router.get("")
def list_risks():
    return {
        "items": [
            {
                "id": "risk-001",
                "obligation_id": "ob-001",
                "risk_level": "Critical",
                "impact_score": 5,
                "likelihood_score": 4,
                "overall_score": 9,
                "rationale": "Missed regulatory reporting could trigger severe supervisory action."
            },
            {
                "id": "risk-002",
                "obligation_id": "ob-002",
                "risk_level": "High",
                "impact_score": 4,
                "likelihood_score": 4,
                "overall_score": 8,
                "rationale": "Weak evidence trail may fail internal audit review."
            },
            {
                "id": "risk-003",
                "obligation_id": "ob-003",
                "risk_level": "Medium",
                "impact_score": 3,
                "likelihood_score": 2,
                "overall_score": 5,
                "rationale": "Process exists but timing control is inconsistent."
            }
        ]
    }