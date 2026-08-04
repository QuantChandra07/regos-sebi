from __future__ import annotations

from typing import Dict, List

from sentence_transformers import CrossEncoder


RERANK_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"


class Reranker:
    def __init__(self) -> None:
        self.model = CrossEncoder(RERANK_MODEL)

    def rerank(self, query: str, results: List[Dict], top_k: int = 5) -> List[Dict]:
        pairs = [(query, r.get("text", "")) for r in results]

        print("DEBUG - number of pairs:", len(pairs))
        for i, p in enumerate(pairs):
            print(f"DEBUG - pair {i} text length:", len(p[1]))

        scores = self.model.predict(pairs)
        print("DEBUG - raw scores:", scores)

        ranked = []
        for result, score in zip(results, scores):
            item = dict(result)
            item["rerank_score"] = float(score)
            ranked.append(item)

        ranked.sort(key=lambda x: x["rerank_score"], reverse=True)
        return ranked[:top_k]


