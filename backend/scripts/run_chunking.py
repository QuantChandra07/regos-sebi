from __future__ import annotations

import json
from pathlib import Path
import sys

# This file is at: D:\regos-sebi\backend\scripts\run_chunking.py
THIS_DIR = Path(__file__).resolve().parent          # ...\backend\scripts
BACKEND_ROOT = THIS_DIR.parent                      # ...\backend
PROJECT_ROOT = BACKEND_ROOT.parent                  # ...\regos-sebi

# Make sure backend (where `app` lives) is importable
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.models.document_models import DocumentText
from app.services.chunking_service import chunk_document


def main() -> None:
    # Data lives outside backend: D:\regos-sebi\data\...
    data_root = PROJECT_ROOT / "data"

    clean_dir = data_root / "parsed" / "clean_text"
    out_dir = data_root / "parsed" / "chunks"
    out_dir.mkdir(parents=True, exist_ok=True)

    json_files = list(clean_dir.glob("*.json"))
    if not json_files:
        print(f"No cleaned JSON files found in {clean_dir}")
        return

    print(f"Found {len(json_files)} cleaned documents in {clean_dir}")

    for path in json_files:
        print(f"Processing {path.name} ...")

        with path.open("r", encoding="utf-8") as f:
            raw = json.load(f)

        # Expecting: {"document_id": "...", "pages": [...]}
        doc = DocumentText.model_validate(raw)
        full_title = raw.get("title", doc.document_id)

        chunks = chunk_document(doc, full_title=full_title)
        if not chunks:
            print(f"  [WARN] No chunks produced for {path.name}")
            continue

        output = {
            "document_id": doc.document_id,
            "full_title": full_title,
            "chunk_count": len(chunks),
            "chunks": [c.model_dump() for c in chunks],
        }

        out_path = out_dir / f"{doc.document_id}.json"
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

        print(f"  [OK] Wrote {len(chunks)} chunks -> {out_path.name}")

    print(f"Chunking complete. Output directory: {out_dir}")


if __name__ == "__main__":
    main()