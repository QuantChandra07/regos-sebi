from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from loguru import logger

from backend.app.core.settings import settings
from backend.app.services.ingestion_service import IngestionService
from backend.app.schemas.response_models import DocumentIngestionResponse


app = FastAPI(
    title="regos-sebi Backend",
    description="AI backend for SEBI document ingestion and analysis.",
    version="0.1.0",
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ingestion_service = IngestionService()


class IngestTextRequest(BaseModel):
    """
    Request body for /ingest-text.

    pdf_path: relative or absolute path to the PDF file.
    document_id: stable identifier for the document.
    """

    pdf_path: str
    document_id: str


@app.post("/ingest-text", response_model=DocumentIngestionResponse)
def ingest_text(request: IngestTextRequest) -> DocumentIngestionResponse:
    """
    Ingest a PDF and return raw text per page.

    This is the core Phase 1 endpoint. It:
    - Extracts text via PyMuPDF or OCR.
    - Persists DocumentText to data/parsed/raw_text/.
    - Returns DocumentText wrapped in a response object.
    """
    try:
        document = ingestion_service.ingest_document(
            pdf_path_str=request.pdf_path,
            document_id=request.document_id,
        )
        logger.info(
            f"Document ingested successfully: document_id={request.document_id}, "
            f"pages={len(document.pages)}"
        )
        return DocumentIngestionResponse(
            success=True,
            message="Text ingestion successful.",
            document=document,
        )
    except FileNotFoundError as e:
        logger.error(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error during text ingestion.")
        raise HTTPException(status_code=500, detail=str(e))


