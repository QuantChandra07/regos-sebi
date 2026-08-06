import re
from orchestration.state import DocumentState, CircularMetadata

def regulatory_parser_node(state: DocumentState) -> dict:
    text = state.clean_text or ""
    head = text[:3000]

    ref_match = re.search(r"(SEBI/[A-Z0-9/\-]+/\d{4}/\d+)", head)
    title_match = re.search(r"(Circular on [^\n]+|Master Circular for [^\n]+)", head, re.IGNORECASE)

    entity_type = None
    for candidate in ["Stock Broker", "Investment Adviser", "Clearing Member", "Trading Member"]:
        if candidate.lower() in head.lower():
            entity_type = candidate
            break

    circular = CircularMetadata(
        regulator="SEBI",
        category="circular",
        reference_id=ref_match.group(1) if ref_match else None,
        title=title_match.group(1) if title_match else f"Document {state.document_id}",
        entity_type=entity_type,
    )

    return {"circular": circular, "status": "PARSED"}
