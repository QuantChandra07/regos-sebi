# regos-sebi Backend

Python AI backend for the regos-sebi project.

## Structure

- `backend/app/api/` – FastAPI entrypoint (`main.py`)
- `backend/app/core/` – settings and configuration
- `backend/app/models/` – core data models (`PageText`, `DocumentText`)
- `backend/app/schemas/` – API response schemas (wrappers around models)
- `backend/app/services/` – business logic (DocumentIngestionService, etc.)
- `backend/app/utils/` – shared helpers (PDF utilities)

## Phase 1 – Text Extraction

The `IngestionService` in `backend/app/services/ingestion_service.py`:

1. Detects whether a PDF is text-based or scanned using PyMuPDF.
2. For text PDFs, uses `page.get_text("text", sort=True)` to get plain text in reading order.[web:8]
3. For scanned PDFs, converts each page to an image with `pdf2image.convert_from_path(..., dpi=300)` and runs `pytesseract.image_to_string` on each image.[web:9][web:15]
4. Returns a `DocumentText` instance and persists it as JSON to `data/parsed/raw_text/`.

The FastAPI endpoint `/ingest-text` wraps this logic and returns `DocumentText` to the frontend.