from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def dashboard_summary():
    return {
        "summary": {
            "new_circulars_this_month": 4,
            "obligations_found": 18,
            "high_critical_obligations": 6,
            "tasks_open": 11,
            "tasks_completed": 7,
            "compliance_scores": [
                {"department": "Compliance", "score": 92},
                {"department": "Legal", "score": 88},
                {"department": "Operations", "score": 81},
                {"department": "Risk", "score": 85},
            ],
        }
    }