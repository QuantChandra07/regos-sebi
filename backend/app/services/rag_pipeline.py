from __future__ import annotations

from typing import Any, Dict, Optional

from backend.app.services.retrieval_pipeline import RetrievalPipeline
from backend.app.services.rag_llm import chat_with_context


SYSTEM_PROMPT = (
    "You are a compliance assistant for SEBI regulations. "
    "Answer questions using only the provided regulatory context. "
    "Be precise, cite the section/regulation name where possible, and avoid speculation."
)


class RAGPipeline:
    def __init__(self) -> None:
        self.retrieval = RetrievalPipeline()

    async def ask(
        self,
        question: str,
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5,
    ) -> Dict[str, Any]:
        chunks = self.retrieval.search(
            query=question,
            filters=filters,
            top_k=top_k,
        )

        if not chunks:
            return {
                "question": question,
                "answer": "No relevant regulatory chunks found for this question.",
                "sources": [],
            }

        answer = await chat_with_context(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=question,
            context_chunks=chunks,
        )

        return {
            "question": question,
            "answer": answer,
            "sources": chunks,
        }


