from __future__ import annotations
from typing import Any, Dict, List, Optional
from app.services.retriever import Retriever
from app.services.reranker import Reranker


class RetrievalPipeline:
    def __init__(self) -> None:
        # These are now lazy-loaded internally
        self.retriever = Retriever()
        self.reranker = Reranker()

    def search(
        self,
        query: str,
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5,
        min_rerank_score: float = 3.0,
    ) -> List[Dict[str, Any]]:
        # Initial retrieval (model loads here on first call)
        initial = self.retriever.search(query=query, top_k=30, filters=filters)
        
        # Reranking
        ranked = self.reranker.rerank(query=query, results=initial, top_k=top_k)
        
        # Filter by minimum rerank score
        ranked = [r for r in ranked if r.get("rerank_score", 0) >= min_rerank_score]
        
        return ranked
