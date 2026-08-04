# schemas/obligation_extraction.py
from pydantic import BaseModel, Field
from typing import Optional, List, Any

class ChunkObligationRequest(BaseModel):
    """Request schema for extracting obligations from a single chunk."""
    chunk_id: str = Field(..., description="ID of the chunk to process")


class ChunkObligationResponse(BaseModel):
    """Response schema for obligations extracted from a single chunk."""
    chunk_id: str
    section_label: Optional[str] = None
    document_title: Optional[str] = None
    regulator: Optional[str] = None
    page_start: Optional[str] = None
    page_end: Optional[str] = None
    obligations: Any = Field(..., description="List of extracted obligations")


class MultiChunkObligationRequest(BaseModel):
    """Request schema for extracting obligations from multiple chunks."""
    chunk_ids: List[str] = Field(..., description="List of chunk IDs to process")


class MultiChunkObligationResponse(BaseModel):
    """Response schema for obligations extracted from multiple chunks."""
    results: List[ChunkObligationResponse] = Field(
        default_factory=list,
        description="Successful extractions"
    )
    errors: List[dict] = Field(
        default_factory=list,
        description="Failed extractions with error messages"
    )


class PDFObligationResponse(BaseModel):
    """Response schema for PDF upload and obligation extraction."""
    document_title: Optional[str] = None
    regulator: Optional[str] = None
    total_chunks: int
    total_obligations: int
    chunks: List[ChunkObligationResponse]