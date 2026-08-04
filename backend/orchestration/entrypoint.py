import os
import uuid
from backend.orchestration.graph import document_graph
from backend.orchestration.state import DocumentState

TEMP_DIR = os.getenv("REGOS_TEMP_DIR", "backend/data/documents/tmp")


def process_document(pdf_bytes: bytes):
    os.makedirs(TEMP_DIR, exist_ok=True)

    document_id = str(uuid.uuid4())
    temp_path = os.path.join(TEMP_DIR, f"{document_id}.pdf")

    with open(temp_path, "wb") as f:
        f.write(pdf_bytes)

    initial_state = DocumentState(
        document_id=document_id,
        pdf_path=temp_path,
        status="PENDING",
    )

    return document_graph.invoke(initial_state)