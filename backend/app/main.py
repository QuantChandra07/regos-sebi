"""
FastAPI Application Entry Point

Combines:
- Document ingestion
- RAG + Retrieval
- Obligations CRUD + extraction
- Workflow, Risk, Evidence endpoints
- Dashboard/Circulars/Documents endpoints
- CORS for Next.js frontend
"""

from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
from pydantic import BaseModel

load_dotenv()

from app.models import regulatory  # noqa: F401

from app.api.retrieval import router as retrieval_router
from app.api.rag import router as rag_router
from app.api.obligations import router as obligations_router
from api.risks import router as risks_router
from app.api.workflow import router as workflow_router

from api.documents import router as documents_router
from api.dashboard import router as dashboard_router
from api.circulars import router as circulars_router
from api.evidence import router as evidence_router

from app.services.ingestion_service import IngestionService
from app.schemas.response_models import DocumentIngestionResponse


app = FastAPI(
    title="RegOS SEBI Backend",
    description="AI backend for SEBI document ingestion, RAG, and obligation analysis.",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(retrieval_router)
app.include_router(rag_router)
app.include_router(obligations_router)
app.include_router(risks_router)
app.include_router(workflow_router)
app.include_router(documents_router)
app.include_router(dashboard_router)
app.include_router(circulars_router)
app.include_router(evidence_router)

ingestion_service = IngestionService()


@app.get("/")
async def root():
    return JSONResponse(
        content={
            "service": "RegOS SEBI Backend",
            "status": "running",
            "version": "1.0.0",
            "endpoints": {
                "search": "/retrieval/search",
                "ask": "/rag/ask",
                "ingest": "/ingest-text",
                "documents": "/documents/process",
                "dashboard_summary": "/dashboard/summary",
                "circulars": "/circulars",
                "obligations": "/obligations",
                "workflow": "/workflow",
                "risks": "/risks",
                "evidence": "/evidence",
                "health": "/health",
            },
        }
    )


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "RegOS API"}


class IngestTextRequest(BaseModel):
    pdf_path: str
    document_id: str


@app.post("/ingest-text", response_model=DocumentIngestionResponse)
def ingest_text(request: IngestTextRequest) -> DocumentIngestionResponse:
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
