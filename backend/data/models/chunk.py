# data/models/chunk.py
from pydantic import BaseModel
from typing import Optional, List

class Chunk(BaseModel):
    """
    Represents a single chunk of text from a parsed document.
    """
    id: str
    text: str
    section: Optional[str] = None
    document_title: Optional[str] = None
    regulator: Optional[str] = None
    document_id: Optional[str] = None
    page_start: Optional[str] = None
    page_end: Optional[str] = None
    category: Optional[str] = None
    chunk_index: Optional[int] = None