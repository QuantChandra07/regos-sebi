from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize


CHROMA_PERSIST_DIR = Path(r"D:\regos-sebi\backend\data\chroma")
COLLECTION_NAME = "regos_chunks"
EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"


class Retriever:
    def __init__(self) -> None:
        self.client = PersistentClient(path=str(CHROMA_PERSIST_DIR))
        self.model = SentenceTransformer(EMBEDDING_MODEL)
        self.collection = self.client.get_or_create_collection(name=COLLECTION_NAME)

    def search(
        self,
        query: str,
        top_k: int = 30,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        embedding = self.model.encode([query])
        embedding = normalize(embedding).tolist()[0]

        where: Optional[Dict[str, Any]] = None
        if filters:
            # Example: {"intermediary": "Investment Adviser"}
            # Chroma supports simple where filters
            where = filters

        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
            where=where,
            include=["embeddings", "metadatas", "documents", "distances"],
        )

        ids = results["ids"][0]
        metadatas = results["metadatas"][0]
        documents = results["documents"][0]
        distances = results["distances"][0]

        return [
            {
                "id": doc_id,
                "score": float(dist),
                "payload": meta,
                "text": doc,
            }
            for doc_id, meta, doc, dist in zip(ids, metadatas, documents, distances)
        ]


