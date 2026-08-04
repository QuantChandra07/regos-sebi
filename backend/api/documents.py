from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.orchestration.entrypoint import process_document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/process")
async def process_document_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    pdf_bytes = await file.read()
    result = process_document(pdf_bytes)

    if hasattr(result, "model_dump"):
        return result.model_dump()
    return result


@router.get("/health")
def documents_health():
    return {"status": "ok", "service": "documents"}