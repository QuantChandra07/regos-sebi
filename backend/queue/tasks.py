# backend/queue/tasks.py
from backend.orchestration.entrypoint import process_document


def run_document_pipeline(pdf_bytes: bytes) -> dict:
    """
    RQ task wrapper around process_document.
    Returns the final DocumentState as a dict (JSON serializable).
    """
    result = process_document(pdf_bytes)
    # Ensure JSON-serializable output
    if hasattr(result, "model_dump"):
        return result.model_dump()
    return dict(result)