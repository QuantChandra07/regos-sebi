from __future__ import annotations
from pathlib import Path
from typing import Any, Dict, List, Optional
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize

# Cross-platform path resolution (works on Windows + Linux/Railway)
BASE_DIR = Path(__file__).resolve().parents[2]  # Goes back to backend/
CHROMA_PERSIST_DIR = BASE_DIR / "data" / "chroma"
COLLECTION_NAME = "regos_chunks"
EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"


class Retriever:
    def __init__(self) -> None:
        # Initialize Chroma client (lightweight)
        self.client = PersistentClient(path=str(CHROMA_PERSIST_DIR))
        self.collection = self.client.get_or_create_collection(name=COLLECTION_NAME)
        # Lazy-load the embedding model (heavy, downloads from HF)
        self._model: Optional[SentenceTransformer] = None

    def get_model(self) -> SentenceTransformer:
        """Lazy-load the embedding model only when first needed."""
        if self._model is None:
            self._model = SentenceTransformer(EMBEDDING_MODEL)
        return self._model

    def search(
        self,
        query: str,
        top_k: int = 30,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        # Load model on first search request, not at startup
        model = self.get_model()
        embedding = model.encode([query])
        embedding = normalize(embedding).tolist()[0]

        where: Optional[Dict[str, Any]] = None
        if filters:
            # Example: {"intermediary": "Investment Adviser"}
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
