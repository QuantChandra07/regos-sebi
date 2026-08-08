# backend/data/parsed/chunks.py
from typing import Tuple, Dict, Any, List
from data.models.chunk import Chunk
import os
import json

# Try to import Chroma if you're using it
try:
    from chromadb import Client

    chroma_client = Client()
    collection = chroma_client.get_collection("reg_chunks")
    CHROMA_AVAILABLE = True
except Exception:
    CHROMA_AVAILABLE = False
    collection = None

# Base paths
# BASE_DIR -> D:\regos-sebi\backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHUNKS_DIR = os.path.join(BASE_DIR, "data", "parsed", "chunks")


def get_chunk_by_id(chunk_id: str) -> Chunk:
    """
    Fetch a single chunk by its ID from your storage.
    Adaptable to Chroma, JSON files, or database.
    """
    if CHROMA_AVAILABLE and collection:
        return _get_chunk_from_chroma(chunk_id)
    else:
        return _get_chunk_from_json(chunk_id)


def _get_chunk_from_chroma(chunk_id: str) -> Chunk:
    """
    Fetch chunk from ChromaDB.
    """
    try:
        result = collection.get(
            ids=[chunk_id],
            include=["documents", "metadatas"],
        )

        if not result["ids"]:
            raise ValueError(f"Chunk {chunk_id} not found in ChromaDB")

        doc_text = result["documents"][0]
        meta = result["metadatas"][0]

        return Chunk(
            id=chunk_id,
            text=doc_text,
            section=meta.get("section"),
            document_title=meta.get("document_title"),
            regulator=meta.get("regulator"),
            document_id=meta.get("document_id"),
            page_start=meta.get("page_start"),
            page_end=meta.get("page_end"),
            category=meta.get("category"),
        )
    except Exception as e:
        raise ValueError(f"Error fetching chunk {chunk_id} from ChromaDB: {str(e)}")


# backend/data/parsed/chunks.py
def _get_chunk_from_json(chunk_id: str) -> Chunk:
    """
    Fetch chunk from JSON files (fallback if Chroma not available).

    We treat chunk_id as a filename-like identifier and search for a matching file
    in CHUNKS_DIR.
    """
    if not os.path.exists(CHUNKS_DIR):
        raise ValueError(f"Chunks directory not found: {CHUNKS_DIR}")

    # Try exact match first
    exact_path = os.path.join(CHUNKS_DIR, chunk_id)
    if os.path.exists(exact_path):
        target_file = exact_path
    else:
        # Fallback: search by filename
        target_file = None
        for filename in os.listdir(CHUNKS_DIR):
            if filename == chunk_id:
                target_file = os.path.join(CHUNKS_DIR, filename)
                break

        if target_file is None:
            raise ValueError(f"Chunk {chunk_id} not found in {CHUNKS_DIR}")

    with open(target_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # If data is a single object, construct Chunk from it
    if isinstance(data, dict):
        return Chunk(
            id=chunk_id,
            text=data.get("text", ""),
            section=data.get("section"),
            document_title=data.get("document_title"),
            regulator=data.get("regulator"),
            document_id=data.get("document_id"),
            page_start=data.get("page_start"),
            page_end=data.get("page_end"),
            category=data.get("category"),
        )

    # If data is a list, take the first element
    if isinstance(data, list) and data:
        first = data[0]
        return Chunk(
            id=chunk_id,
            text=first.get("text", ""),
            section=first.get("section"),
            document_title=first.get("document_title"),
            regulator=first.get("regulator"),
            document_id=first.get("document_id"),
            page_start=first.get("page_start"),
            page_end=first.get("page_end"),
            category=first.get("category"),
        )

    raise ValueError(f"Unsupported JSON structure in {target_file}")


def list_all_chunk_ids() -> List[str]:
    """
    List all available chunk IDs.

    Here we treat each JSON filename in CHUNKS_DIR as a chunk ID.
    This matches your current storage structure where each file
    represents a single document's chunks.
    """
    if CHROMA_AVAILABLE and collection:
        try:
            result = collection.get(include=[])
            return result["ids"]
        except Exception:
            pass

    chunk_ids: List[str] = []

    if not os.path.exists(CHUNKS_DIR):
        return chunk_ids

    for filename in os.listdir(CHUNKS_DIR):
        if filename.endswith(".json"):
            # Use the filename itself as the ID
            chunk_ids.append(filename)

    return chunk_ids
