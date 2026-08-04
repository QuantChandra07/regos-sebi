from pydantic import BaseModel

from backend.app.models.document_models import DocumentText


class DocumentIngestionResponse(BaseModel):
    """
    Standard API response for text ingestion.
    """

    success: bool
    message: str
    document: DocumentText


