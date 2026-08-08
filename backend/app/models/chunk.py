from typing import Optional, Dict, Any
from pydantic import BaseModel


class Chunk(BaseModel):
    chunk_id: str
    document_id: str
    full_title: str
    title: str
    category: str
    text: str
    page_start: int
    page_end: int

    # Allow None and non-string values in metadata
    metadata: Optional[Dict[str, Any]] = None


