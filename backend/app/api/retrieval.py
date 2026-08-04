from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from backend.app.services.retrieval_pipeline import RetrievalPipeline


router = APIRouter(prefix="/retrieval", tags=["retrieval"])
pipeline = RetrievalPipeline()


class SearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    top_k: int = 5


@router.post("/search")
def search_chunks(req: SearchRequest):
    return {
        "query": req.query,
        "results": pipeline.search(
            query=req.query,
            filters=req.filters,
            top_k=req.top_k,
        ),
    }