"""
Batch ingest all PDFs under backend/data/documents into data/parsed/raw_text.

Usage:
    cd D:\regos-sebi\backend
    python -m scripts.batch_ingest

This script:
- Recursively finds all *.pdf under data/documents
- Calls IngestionService.extract_text for each
- Saves one JSON per PDF to data/parsed/raw_text using your existing naming convention
"""

import sys
from pathlib import Path
from loguru import logger

# Adjust import path so `app` is discoverable when run as `python -m scripts.batch_ingest`
BASE_DIR = Path(__file__).resolve().parent.parent  # D:\regos-sebi\backend
sys.path.insert(0, str(BASE_DIR))

from app.services.ingestion_service import IngestionService
from app.utils.pdf_utils import build_raw_text_output_path


def find_all_pdfs(root_dir: Path) -> list[str]:
    """Recursively find all PDF files under root_dir."""
    return [str(p) for p in root_dir.rglob("*.pdf")]


def generate_document_id(pdf_path: str, base_dir: Path) -> str:
    """
    Generate a document_id from the PDF path.

    Strategy:
    - Use relative path from base_dir to encode category.
    - Replace OS separators with '__' to keep it filesystem-safe.
    - Use stem (filename without .pdf) as final component.

    Example:
        base_dir = D:/regos-sebi/backend/data/documents
        pdf_path = D:/regos-sebi/backend/data/documents/regulations/investment_adviser/file.pdf
        -> "regulations__investment_adviser__file"
    """
    pdf = Path(pdf_path)
    try:
        rel = pdf.relative_to(base_dir)
    except ValueError:
        # Fallback: just use filename stem if not under base_dir
        return pdf.stem

    parts = list(rel.parts[:-1]) + [pdf.stem]
    return "__".join(parts)


def main():
    # Configure logging
    logger.remove()
    logger.add(
        sys.stderr,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} - {message}",
        level="INFO",
    )

    # Root directories (adjust if your layout differs)
    base_dir = BASE_DIR / "data" / "documents"
    raw_text_dir = BASE_DIR / "data" / "parsed" / "raw_text"
    raw_text_dir.mkdir(parents=True, exist_ok=True)

    if not base_dir.exists():
        logger.error(f"Documents directory not found: {base_dir}")
        logger.error("Please ensure PDFs are placed under backend/data/documents/")
        sys.exit(1)

    service = IngestionService()
    pdf_files = find_all_pdfs(base_dir)

    logger.info(f"Found {len(pdf_files)} PDFs under {base_dir}")

    if len(pdf_files) == 0:
        logger.warning("No PDF files found. Place your SEBI PDFs under backend/data/documents/")
        return

    for i, pdf_path in enumerate(pdf_files, start=1):
        try:
            document_id = generate_document_id(pdf_path, base_dir)
            logger.info(
                f"[{i}/{len(pdf_files)}] Processing: {pdf_path} (id={document_id})"
            )

            # Your existing single-file ingestion flow
            doc_text = service.extract_text(pdf_path, document_id=document_id)
            output_path = build_raw_text_output_path(document_id, raw_text_dir)
            service.save_document_text(doc_text)

            logger.info(f"[{i}/{len(pdf_files)}] Saved: {output_path}")
        except Exception as e:
            logger.exception(f"[{i}/{len(pdf_files)}] Error processing {pdf_path}: {e}")

    logger.info("Batch ingestion complete.")


if __name__ == "__main__":
    main()