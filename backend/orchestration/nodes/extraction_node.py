from orchestration.state import DocumentState, Clause

def extraction_node(state: DocumentState) -> dict:
    raw_text = ""
    clean_text = ""

    try:
        from app.services.ocr_service import extract_raw_text
        from app.services.chunking_service import clean_text as clean_text_fn
        from app.services.chunking_service import legal_chunk_text

        raw_text = extract_raw_text(state.pdf_path)
        clean_text = clean_text_fn(raw_text)
        raw_chunks = legal_chunk_text(clean_text, document_id=state.document_id)

        clauses = [
            Clause(
                chunk_id=c["chunk_id"],
                section_label=c.get("section_label"),
                heading=c.get("heading"),
                page_start=c.get("page_start"),
                page_end=c.get("page_end"),
                category=c.get("category"),
                text=c["text"],
            )
            for c in raw_chunks
        ]
    except Exception:
        clauses = [
            Clause(
                chunk_id=f"{state.document_id}-chunk-1",
                text="Fallback extracted text. Replace extraction services with your real OCR/chunking pipeline.",
            )
        ]

    return {
        "raw_text": raw_text,
        "clean_text": clean_text or "Fallback clean text",
        "clauses": clauses,
        "status": "EXTRACTED",
    }
