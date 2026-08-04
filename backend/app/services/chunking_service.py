from __future__ import annotations

import re
from typing import List, Tuple

from backend.app.models.document_models import DocumentText, PageText
from backend.app.models.chunk import Chunk


# ---------- Heading detection patterns (Regulation / Chapter / Clause / etc.) ----------

REG_PATTERN = re.compile(
    r"^(?P<prefix>REGULATION|CHAPTER|SCHEDULE|ANNEXURE|ANNEX)\s*"
    r"(?P<num>[IVX0-9A-Za-z\(\)\.\-]+)"
    r"(?:\s*[\-\.:]\s*(?P<title>.*))?$",
    flags=re.IGNORECASE,
)

CLAUSE_PATTERN = re.compile(
    r"^(?P<prefix>CLAUSE|SECTION|ARTICLE|RULE|SUB-?REGULATION)\s*"
    r"(?P<num>[0-9A-Za-z\(\)\.\-]+)"
    r"(?:\s*[\-\.:]\s*(?P<title>.*))?$",
    flags=re.IGNORECASE,
)


def _classify_heading(line: str) -> Tuple[str | None, str | None, str | None]:
    line = line.strip()
    if not line:
        return None, None, None

    m = REG_PATTERN.match(line)
    if m:
        prefix = m.group("prefix").upper()
        if "REGULATION" in prefix:
            cat = "Regulation"
        elif "CHAPTER" in prefix:
            cat = "Chapter"
        elif "SCHEDULE" in prefix:
            cat = "Schedule"
        elif "ANNEXURE" in prefix or "ANNEX" in prefix:
            cat = "Annexure"
        else:
            cat = "Other"
        return cat, m.group("num"), (m.group("title") or "").strip()

    m2 = CLAUSE_PATTERN.match(line)
    if m2:
        prefix = m2.group("prefix").upper()
        if "CLAUSE" in prefix:
            cat = "Clause"
        elif "SECTION" in prefix:
            cat = "Section"
        elif "ARTICLE" in prefix:
            cat = "Article"
        elif "RULE" in prefix:
            cat = "Rule"
        elif "SUB" in prefix:
            cat = "SubRegulation"
        else:
            cat = "Other"
        return cat, m2.group("num"), (m2.group("title") or "").strip()

    return None, None, None


def _merge_pages(pages: List[PageText]) -> List[Tuple[int, str]]:
    merged: List[Tuple[int, str]] = []
    for p in pages:
        text = p.raw_text or ""
        if not text.strip():
            continue

        text = re.sub(r"-\n\s*", "", text)      # de-hyphenate
        text = re.sub(r"\n{3,}", "\n\n", text)  # compress blank lines

        merged.append((p.page_number, text))
    return merged


def chunk_document(doc: DocumentText, full_title: str | None = None) -> List[Chunk]:
    if full_title is None:
        full_title = doc.document_id

    page_texts = _merge_pages(doc.pages)
    if not page_texts:
        return []

    lines_with_page: List[Tuple[int, str]] = []
    for pg_num, text in page_texts:
        for line in text.splitlines():
            lines_with_page.append((pg_num, line))

    chunks: List[Chunk] = []

    current_lines: List[str] = []
    current_start_page: int | None = None
    current_end_page: int | None = None
    current_category: str = "Other"
    current_number: str | None = None
    current_heading_title: str | None = None
    chunk_counter: int = 0

    def finish_chunk() -> None:
        nonlocal current_lines, current_start_page, current_end_page
        nonlocal current_category, current_number, current_heading_title, chunk_counter

        if not current_lines:
            return

        text = "\n".join(current_lines).strip()
        if not text:
            current_lines = []
            return

        chunk_counter += 1

        if current_category and current_number:
            base_title = f"{current_category} {current_number}"
            if current_heading_title:
                base_title = f"{base_title} – {current_heading_title}"
        else:
            base_title = current_heading_title or f"Section {chunk_counter}"

        chunk_id = f"{doc.document_id}__{current_category.lower()}__{chunk_counter}"

        start = current_start_page if current_start_page is not None else 1
        end = current_end_page if current_end_page is not None else start

        chunk = Chunk(
            chunk_id=chunk_id,
            document_id=doc.document_id,
            full_title=full_title,
            title=base_title,
            category=current_category or "Other",
            text=text,
            page_start=start,
            page_end=end,
            metadata={
                "reg_number": current_number,
                "reg_title": current_heading_title,
            },
        )
        chunks.append(chunk)

        current_lines = []
        current_start_page = None
        current_end_page = None
        current_category = "Other"
        current_number = None
        current_heading_title = None

    for pg_num, line in lines_with_page:
        cat, num, title = _classify_heading(line)

        if cat is not None:
            finish_chunk()

            current_category = cat
            current_number = num
            current_heading_title = title or None
            current_start_page = pg_num
            current_end_page = pg_num

            current_lines.append(line)
        else:
            if not current_lines:
                current_category = "Other"
                current_start_page = pg_num
                current_end_page = pg_num
            else:
                current_end_page = pg_num

            current_lines.append(line)

    finish_chunk()

    return chunks


