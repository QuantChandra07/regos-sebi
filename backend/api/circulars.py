from fastapi import APIRouter

router = APIRouter(prefix="/circulars", tags=["circulars"])


@router.get("")
def list_circulars():
    return {
        "items": [
            {
                "id": "cir-001",
                "regulator": "SEBI",
                "category": "circular",
                "reference_id": "SEBI/HO/CFD/2026/001",
                "title": "Cybersecurity and Resilience Controls for Intermediaries",
                "entity_type": "Stock Broker",
                "effective_from": "2026-07-01",
                "uploaded_at": "2026-08-01T10:00:00",
            },
            {
                "id": "cir-002",
                "regulator": "SEBI",
                "category": "master_circular",
                "reference_id": "SEBI/HO/MIRSD/2026/014",
                "title": "Internal Audit and Reporting Requirements",
                "entity_type": "Investment Adviser",
                "effective_from": "2026-06-15",
                "uploaded_at": "2026-08-01T11:00:00",
            },
        ]
    }


@router.get("/{circular_id}")
def get_circular_detail(circular_id: str):
    return {
        "circular": {
            "id": circular_id,
            "regulator": "SEBI",
            "category": "circular",
            "reference_id": f"REF-{circular_id}",
            "title": f"Circular {circular_id}",
            "entity_type": "Stock Broker",
            "effective_from": "2026-07-01",
            "uploaded_at": "2026-08-01T10:00:00",
        },
        "clauses": [
            {
                "chunk_id": f"{circular_id}-clause-1",
                "section_label": "3.1",
                "heading": "Quarterly review",
                "page_start": "2",
                "page_end": "2",
                "category": "governance",
                "text": "The entity shall conduct a quarterly review of controls and document findings.",
            },
            {
                "chunk_id": f"{circular_id}-clause-2",
                "section_label": "4.2",
                "heading": "Incident reporting",
                "page_start": "3",
                "page_end": "3",
                "category": "reporting",
                "text": "Material incidents shall be reported to SEBI within the prescribed timeline.",
            },
        ],
        "obligations": [
            {
                "id": f"{circular_id}-ob-1",
                "circular_id": circular_id,
                "clause_id": None,
                "actor": "Compliance Officer",
                "section": "3.1",
                "obligation": "Conduct quarterly review of internal controls.",
                "frequency": "Quarterly",
                "deadline": "Within 15 days of quarter end",
                "category": "governance",
                "risk_level": "High",
                "status": "NOT_STARTED",
            },
            {
                "id": f"{circular_id}-ob-2",
                "circular_id": circular_id,
                "clause_id": None,
                "actor": "Operations Team",
                "section": "4.2",
                "obligation": "Report material incidents to SEBI.",
                "frequency": "Event-based",
                "deadline": "Immediate",
                "category": "reporting",
                "risk_level": "Critical",
                "status": "ACTIVE",
            },
        ],
    }