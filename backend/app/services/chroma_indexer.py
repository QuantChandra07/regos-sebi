from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize


# Your existing data path (do not change)
CHUNKS_DIR = Path(r"D:\regos-sebi\data\parsed\chunks")

# Local Chroma DB folder (inside your backend)
CHROMA_PERSIST_DIR = Path(r"D:\regos-sebi\backend\data\chroma")

COLLECTION_NAME = "regos_chunks"
EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"


class ChromaIndexer:
    def __init__(self) -> None:
        self.client = PersistentClient(path=str(CHROMA_PERSIST_DIR))
        self.model = SentenceTransformer(EMBEDDING_MODEL)

    def get_or_create_collection(self):
        return self.client.get_or_create_collection(name=COLLECTION_NAME)

    def load_chunk_files(self) -> List[Dict[str, Any]]:
        """
        Load all chunks from JSON files under CHUNKS_DIR.

        Supports:
        - Top-level dict with a "chunks" list (your current structure).
        - Top-level list of chunk dicts.
        - Single chunk dict with "chunk_id".
        """
        chunks: List[Dict[str, Any]] = []
        for path in CHUNKS_DIR.glob("*.json"):
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

                if isinstance(data, dict) and "chunks" in data and isinstance(data["chunks"], list):
                    chunks.extend(data["chunks"])
                elif isinstance(data, list):
                    chunks.extend(data)
                elif isinstance(data, dict) and "chunk_id" in data:
                    chunks.append(data)

        return chunks

    def build_text(self, chunk: Dict[str, Any]) -> str:
        """
        Build the text to embed for each chunk.
        Prefer full semantic content; include title + text.
        """
        parts: List[str] = []

        if "title" in chunk:
            parts.append(str(chunk["title"]))

        if "chapter" in chunk:
            parts.append(f"Chapter: {chunk['chapter']}")

        if "section" in chunk:
            parts.append(f"Section: {chunk['section']}")

        if "clauses" in chunk and isinstance(chunk["clauses"], list):
            parts.extend([str(c) for c in chunk["clauses"]])

        if "text" in chunk:
            parts.append(str(chunk["text"]))

        return "\n".join(parts)

    def embed_chunks(self, chunks: List[Dict[str, Any]]) -> List[List[float]]:
        """
        Encode chunks with BGE model and L2-normalize embeddings
        (good for cosine similarity).
        """
        texts = [self.build_text(chunk) for chunk in chunks]
        embeddings = self.model.encode(texts, batch_size=32, show_progress_bar=True)
        embeddings = normalize(embeddings)
        return embeddings.tolist()

    def upsert_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> None:
        """
        Upsert chunks into Chroma collection.
        Filters out any chunk that does not have a chunk_id.
        Skips empty-list metadata fields (Chroma rejects empty lists).
        """
        collection = self.get_or_create_collection()

        # Pair chunks with embeddings, skip those without chunk_id
        valid_pairs: List[tuple[Dict[str, Any], List[float]]] = []
        for chunk, emb in zip(chunks, embeddings):
            chunk_id = chunk.get("chunk_id")
            if not chunk_id:
                continue
            valid_pairs.append((chunk, emb))

        if not valid_pairs:
            raise ValueError("No valid chunks with chunk_id found.")

        ids = [chunk["chunk_id"] for chunk, _ in valid_pairs]

        metadatas: List[Dict[str, Any]] = []
        for chunk, _ in valid_pairs:
            meta: Dict[str, Any] = {
                "chunk_id": chunk.get("chunk_id"),
                "document_id": chunk.get("document_id"),
                "document_name": chunk.get("document_name"),
                "document_type": chunk.get("document_type"),
                "intermediary": chunk.get("intermediary"),
                "chapter": chunk.get("chapter"),
                "section": chunk.get("section"),
                "subsection": chunk.get("subsection"),
                "page_start": chunk.get("page_start"),
                "page_end": chunk.get("page_end"),
                "issue_date": chunk.get("issue_date"),
                "effective_date": chunk.get("effective_date"),
                "category": chunk.get("category"),
                "risk": chunk.get("risk"),
            }

            # Only add clauses if it's a non-empty list
            clauses = chunk.get("clauses")
            if clauses and isinstance(clauses, list) and len(clauses) > 0:
                meta["clauses"] = clauses

            metadatas.append(meta)

        documents = [chunk.get("text", "") for chunk, _ in valid_pairs]
        final_embeddings = [emb for _, emb in valid_pairs]

        collection.upsert(
            ids=ids,
            embeddings=final_embeddings,
            metadatas=metadatas,  # type: ignore
            documents=documents,
        )

    def run(self) -> None:
        chunks = self.load_chunk_files()
        if not chunks:
            raise ValueError(f"No chunk files found in {CHUNKS_DIR}")

        embeddings = self.embed_chunks(chunks)
        self.upsert_chunks(chunks, embeddings)


if __name__ == "__main__":
    ChromaIndexer().run()


