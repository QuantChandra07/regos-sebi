from typing import List
from pydantic import BaseModel


class PageText(BaseModel):
    """
    Text extracted from a single PDF page.
    """

    page_number: int
    raw_text: str


class DocumentText(BaseModel):
    """
    Text extracted from an entire document.

    - document_id: stable identifier (e.g., SEBI circular ID).
    - pages: list of per-page text.
    """

    document_id: str
    pages: List[PageText]


