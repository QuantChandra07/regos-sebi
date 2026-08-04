from typing import List


class EmbeddingService:
    """
    Phase 1 – Step 5 (later):

    Responsible for generating vector embeddings for chunks.
    """

    def embed_chunks(self, chunks: List[str]) -> List[list[float]]:
        """
        Placeholder implementation.

        For now, returns empty embeddings.
        """
        return [[] for _ in chunks]


