# backend/app/api/obligations.py
"""
Obligations API Router

Combined endpoints:
- RAG-based extraction (query → chunks → obligations)
- Direct extraction (section text → obligations)
- Chunk-based extraction (chunk_id → obligations)
- PDF upload → chunks → obligations
- Save obligations to DB
- List obligations from DB
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
import tempfile
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Existing RAG pipeline
from backend.app.services.retrieval_pipeline import RetrievalPipeline
from backend.app.services.obligation_extractor import extract_obligations as extract_obligations_from_chunks

# New chunk-based extraction pipeline
from backend.services.obligations_service import (
    run_obligation_pipeline_for_chunk,
    run_obligation_pipeline_for_multiple_chunks,
    ObligationExtractionError,
)
from data.parsed.chunks import list_all_chunk_ids

# Database layer
from backend.database.session import get_db
from backend.database.crud import create_obligations, list_obligations
from backend.schemas.obligation import ObligationCreate, ObligationResponse

# New schemas for chunk-based extraction
from backend.schemas.obligation_extraction import (
    ChunkObligationRequest,
    ChunkObligationResponse,
    MultiChunkObligationRequest,
    MultiChunkObligationResponse,
    PDFObligationResponse,
)

# Agent-based extractor
from agents.obligation_agent import extract_obligations_from_section


router = APIRouter(prefix="/obligations", tags=["Obligations"])


# Initialize RAG retrieval pipeline
retrieval = RetrievalPipeline()


# ─────────────────────────────────────────────────────────────
# RAG-Based Extraction (Query → Chunks → Obligations)
# ─────────────────────────────────────────────────────────────
class ExtractRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    top_k: int = 10


@router.post("/extract")
async def extract(req: ExtractRequest):
    """
    RAG-based extraction:
    1. Search for relevant chunks using the query
    2. Extract obligations from each chunk
    3. Return all extracted obligations
    """
    chunks = retrieval.search(query=req.query, filters=req.filters, top_k=req.top_k)

    all_obligations: List[Dict[str, Any]] = []
    for chunk in chunks:
        text = chunk.get("text", "")
        metadata = chunk.get("payload", {})
        obs = await extract_obligations_from_chunks(text, metadata)
        all_obligations.extend(obs)

    return {
        "query": req.query,
        "obligation_count": len(all_obligations),
        "obligations": all_obligations,
    }


# ─────────────────────────────────────────────────────────────
# Direct Extraction (Section Text → Obligations)
# ─────────────────────────────────────────────────────────────
class ExtractionRequestBody(BaseModel):
    section_text: str
    metadata: dict
    use_llm: bool = False  # Set True to enable LLM


@router.post("/extract-direct", response_model=List[ObligationCreate])
def extract_obligations_endpoint(payload: ExtractionRequestBody):
    """
    Direct extraction from a given section text (no RAG search).
    Uses the new agent-based extractor.
    """
    obligations = extract_obligations_from_section(
        payload.section_text,
        payload.metadata,
        use_llm=payload.use_llm
    )
    return obligations


# ─────────────────────────────────────────────────────────────
# Save Obligations to Database
# ─────────────────────────────────────────────────────────────
@router.post("/save", response_model=List[ObligationResponse])
def save_obligations_endpoint(
    obligations: List[ObligationCreate],
    document_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Persists obligations to Postgres.
    """
    db_objs = create_obligations(db, obligations, document_id=document_id)
    return db_objs


# ─────────────────────────────────────────────────────────────
# List Obligations from Database
# ─────────────────────────────────────────────────────────────
@router.get("", response_model=List[ObligationResponse])
def list_obligations_endpoint(
    document_id: Optional[str] = None,
    actor: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Returns obligations for the dashboard cards.
    """
    db_objs = list_obligations(db, document_id=document_id, actor=actor)
    return db_objs


# ─────────────────────────────────────────────────────────────
# Chunk-Based Extraction (Chunk ID → Obligations)
# ─────────────────────────────────────────────────────────────
@router.post("/extract-from-chunk", response_model=ChunkObligationResponse)
def extract_obligations_from_chunk(request: ChunkObligationRequest):
    """
    Extract obligations from a single chunk by its ID.
    
    This is the main endpoint for testing the obligations pipeline.
    """
    try:
        result = run_obligation_pipeline_for_chunk(request.chunk_id)
        return ChunkObligationResponse(**result)
    except ValueError as e:
        # Chunk not found
        raise HTTPException(status_code=404, detail=str(e))
    except ObligationExtractionError as e:
        # Agent processing failed
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        # Unexpected error
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.post("/extract-from-chunks", response_model=MultiChunkObligationResponse)
def extract_obligations_from_chunks(request: MultiChunkObligationRequest):
    """
    Extract obligations from multiple chunks at once.
    
    Useful for batch processing.
    """
    try:
        result = run_obligation_pipeline_for_multiple_chunks(request.chunk_ids)
        
        # Convert results to response models
        response_results = [
            ChunkObligationResponse(**r) for r in result["results"]
        ]
        
        return MultiChunkObligationResponse(
            results=response_results,
            errors=result["errors"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch extraction failed: {str(e)}"
        )


@router.get("/available-chunks")
def list_available_chunks():
    """
    List all available chunk IDs for testing.
    
    Useful for finding chunk IDs to test with.
    """
    try:
        chunk_ids = list_all_chunk_ids()
        return {
            "total": len(chunk_ids),
            "chunk_ids": chunk_ids[:100],  # Limit to first 100
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list chunks: {str(e)}"
        )


@router.post("/extract-from-pdf", response_model=PDFObligationResponse)
async def extract_obligations_from_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF and extract obligations from all chunks.
    
    This is the full demo endpoint - upload a PDF and get back all obligation cards.
    
    Note: You need to implement parse_pdf_to_chunks based on your existing pipeline.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    try:
        # Step 1: Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        # Step 2: Parse PDF to chunks
        # TODO: Implement this based on your existing parsing pipeline
        from backend.app.services.parsing_service import parse_pdf_to_chunks
        chunks = parse_pdf_to_chunks(tmp_path)
        
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No chunks extracted from PDF"
            )
        
        # Step 3: Extract obligations from each chunk
        all_results = []
        for chunk in chunks:
            try:
                result = run_obligation_pipeline_for_chunk(chunk.id)
                all_results.append(ChunkObligationResponse(**result))
            except Exception as e:
                # Skip failed chunks, log error
                print(f"Failed to process chunk {chunk.id}: {e}")
                continue
        
        # Step 4: Clean up temp file
        os.unlink(tmp_path)
        
        # Step 5: Calculate totals
        total_obligations = sum(
            len(r.obligations) if isinstance(r.obligations, list) else 1
            for r in all_results
        )
        
        return PDFObligationResponse(
            document_title=chunks[0].document_title if chunks else None,
            regulator=chunks[0].regulator if chunks else None,
            total_chunks=len(all_results),
            total_obligations=total_obligations,
            chunks=all_results,
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )


