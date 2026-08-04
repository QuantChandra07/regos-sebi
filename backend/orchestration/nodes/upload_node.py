import os
import uuid
from backend.orchestration.state import DocumentState

UPLOAD_DIR = os.getenv("REGOS_UPLOAD_DIR", "backend/data/documents/uploads")


def upload_node(state: DocumentState) -> dict:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    document_id = state.document_id or str(uuid.uuid4())
    final_path = os.path.join(UPLOAD_DIR, f"{document_id}.pdf")

    if state.pdf_path and state.pdf_path != final_path and os.path.exists(state.pdf_path):
        os.replace(state.pdf_path, final_path)

    return {
        "document_id": document_id,
        "pdf_path": final_path,
        "status": "UPLOADED",
    }