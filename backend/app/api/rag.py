from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from backend.app.services.rag_pipeline import RAGPipeline


router = APIRouter(prefix="/rag", tags=["rag"])
pipeline = RAGPipeline()


class AskRequest(BaseModel):
    question: str
    filters: Optional[Dict[str, Any]] = None
    top_k: int = 5


@router.post("/ask")
async def ask_question(req: AskRequest):
    return await pipeline.ask(
        question=req.question,
        filters=req.filters,
        top_k=req.top_k,
    )


