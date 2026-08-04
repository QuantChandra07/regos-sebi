from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import List

from loguru import logger

from backend.app.core.settings import settings
from backend.app.models.document_models import DocumentText, PageText
from backend.app.utils.pdf_utils import ensure_parent_dir


HEADER_FOOTER_PATTERNS = [
    r"Securities and Exchange Board of India Act, 1992",
    r"CHAPTER\s+[IVXLCD]+\s+",
]

PAGE_NUMBER_PATTERNS = [
    r"^\s*\d+\s*\.\.\.",
    r"^\s*pagenumber\s*\d+",
    r"^\s*\d+\s*$",  # Standalone page numbers
]


class CleaningService:
    """
    Phase 1 – Step 2: Cleaning Service.
    
    Reads raw DocumentText JSON from data/parsed/raw_text/{document_id}.json,
    cleans each page's raw_text, and writes cleaned JSON to 
    data/parsed/clean_text/{document_id}.json.
    """

    def __init__(self) -> None:
        self.raw_text_dir = settings.RAW_TEXT_DIR
        self.clean_text_dir = settings.PROJECT_ROOT / "data" / "parsed" / "clean_text"
        ensure_parent_dir(self.clean_text_dir)
        logger.info(f"CleaningService initialized: clean_text_dir={self.clean_text_dir}")

    # ========== Public API ==========

    def load_document_text(self, document_id: str) -> DocumentText:
        """
        Load raw DocumentText from data/parsed/raw_text/{document_id}.json.
        """
        input_path = self.raw_text_dir / f"{document_id}.json"
        if not input_path.exists():
            raise FileNotFoundError(f"Raw text JSON not found: {input_path}")

        with input_path.open("r", encoding="utf-8") as f:
            data = json.load(f)

        document = DocumentText.model_validate(data)
        logger.info(
            f"Loaded raw DocumentText: document_id={document_id}, "
            f"pages={len(document.pages)}"
        )
        return document

    def save_document_text(self, document: DocumentText) -> Path:
        """
        Save cleaned DocumentText to data/parsed/clean_text/{document_id}.json.
        """
        output_path = self.clean_text_dir / f"{document.document_id}.json"
        ensure_parent_dir(output_path)

        data = document.model_dump()
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        logger.info(f"Saved cleaned DocumentText to: {output_path}")
        return output_path

    def clean_document_text(self, document: DocumentText) -> DocumentText:
        """
        Apply cleaning operations to each page of a DocumentText.
        """
        cleaned_pages: List[PageText] = []

        # Precompute boilerplate patterns for this document
        header_candidates = self._collect_header_candidates(document)
        footer_candidates = self._collect_footer_candidates(document)

        for page in document.pages:
            text = page.raw_text

            # 1. Remove boilerplate (headers, footers, page numbers)
            text = self.remove_boilerplate(
                text, 
                header_candidates=header_candidates, 
                footer_candidates=footer_candidates
            )

            # 2. Normalize encoding and control characters
            text = self.normalize_encoding(text)

            # 3. Normalize whitespace and line breaks
            text = self.normalize_whitespace(text)

            # 4. Standardize section titles / headings
            text = self.standardize_section_titles(text)

            cleaned_pages.append(
                PageText(page_number=page.page_number, raw_text=text)
            )

        cleaned_document = DocumentText(
            document_id=document.document_id,
            pages=cleaned_pages,
        )

        logger.info(
            f"Cleaned DocumentText: document_id={document.document_id}, "
            f"pages={len(cleaned_pages)}"
        )
        return cleaned_document

    def clean_and_save(self, document_id: str) -> Path:
        """
        High-level operation: Load → Clean → Save.
        
        Args:
            document_id: The document ID (filename without .json extension)
            
        Returns:
            Path to the cleaned JSON file
        """
        document = self.load_document_text(document_id)
        cleaned = self.clean_document_text(document)
        return self.save_document_text(cleaned)

    # ========== Boilerplate Removal ==========

    def _collect_header_candidates(self, document: DocumentText) -> List[str]:
        """
        Collect lines that frequently appear at the top of pages (potential headers).
        
        Heuristic: first line of each page; candidates appear on > 50% of pages.
        """
        counter = {}
        for page in document.pages:
            lines = page.raw_text.splitlines()
            first_line = lines[0].strip() if lines else ""
            if first_line:
                counter[first_line] = counter.get(first_line, 0) + 1

        threshold = max(1, len(document.pages) // 2)
        candidates = [line for line, count in counter.items() if count >= threshold]
        logger.debug(f"Header candidates: {candidates}")
        return candidates

    def _collect_footer_candidates(self, document: DocumentText) -> List[str]:
        """
        Collect lines that frequently appear at the bottom of pages (potential footers).
        
        Heuristic: last line of each page; candidates appear on > 50% of pages.
        """
        counter = {}
        for page in document.pages:
            lines = page.raw_text.splitlines()
            last_line = lines[-1].strip() if lines else ""
            if last_line:
                counter[last_line] = counter.get(last_line, 0) + 1

        threshold = max(1, len(document.pages) // 2)
        candidates = [line for line, count in counter.items() if count >= threshold]
        logger.debug(f"Footer candidates: {candidates}")
        return candidates

    def remove_boilerplate(
        self,
        text: str,
        header_candidates: List[str] | None = None,
        footer_candidates: List[str] | None = None,
    ) -> str:
        """
        Remove common headers, footers, and page-number noise from a page's text.
        """
        lines = text.splitlines()
        cleaned_lines = []

        for idx, line in enumerate(lines):
            stripped = line.strip()

            # Skip candidate headers (only on first line)
            if header_candidates and stripped in header_candidates and idx == 0:
                continue
                
            # Skip candidate footers (only on last line)
            if footer_candidates and stripped in footer_candidates and idx == len(lines) - 1:
                continue

            # Skip page-number patterns
            if any(re.search(pattern, stripped, re.IGNORECASE) for pattern in PAGE_NUMBER_PATTERNS):
                continue

            # Skip known header/footer patterns via regex
            if any(re.search(pattern, stripped, re.IGNORECASE) for pattern in HEADER_FOOTER_PATTERNS):
                continue

            # Skip lines that are just "rawtext" or similar extraction labels
            if stripped.lower().startswith("rawtext"):
                continue

            # Skip very short lines that are likely noise (1-2 chars, not alphanumeric)
            if len(stripped) <= 2 and not stripped.isalnum():
                continue

            cleaned_lines.append(line)

        return "\n".join(cleaned_lines)

    # ========== Encoding Normalization ==========

    def normalize_encoding(self, text: str) -> str:
        """
        Normalize Unicode and strip control characters.
        
        - Use NFKC normalization for consistent characters
        - Remove non-printable control chars (except newline and tab)
        """
        # Unicode normalization (NFKC for compatibility)
        text = unicodedata.normalize("NFKC", text)

        # Strip control characters except newline and tab
        cleaned_chars = []
        for ch in text:
            if ch in ("\n", "\t"):
                cleaned_chars.append(ch)
            else:
                cat = unicodedata.category(ch)
                # Keep letters, digits, punctuation, symbols, and separators
                if not cat.startswith("C"):  # C = Other (includes control chars)
                    cleaned_chars.append(ch)

        return "".join(cleaned_chars)

    # ========== Whitespace Normalization ==========

    def normalize_whitespace(self, text: str) -> str:
        """
        Normalize whitespace and line breaks.
        
        - Collapse multiple spaces and tabs
        - Remove trailing spaces
        - Merge short lines that belong to the same sentence
        - Preserve paragraph boundaries with double newlines
        """
        # Collapse spaces and tabs within lines
        text = re.sub(r"[ \t]+", " ", text)

        # Process lines and merge continuations
        lines = text.splitlines()
        merged_lines = []

        buffer = ""
        for line in lines:
            stripped = line.strip()
            if not stripped:
                # Blank line: flush buffer as a paragraph
                if buffer:
                    merged_lines.append(buffer.strip())
                    buffer = ""
                merged_lines.append("")  # Keep blank line to separate sections
                continue

            # Check if current line is a continuation of the buffer
            if buffer and self._looks_like_continuation(buffer, stripped):
                buffer += " " + stripped
            else:
                if buffer:
                    merged_lines.append(buffer.strip())
                buffer = stripped

        if buffer:
            merged_lines.append(buffer.strip())

        # Join paragraphs with double newlines
        normalized = "\n\n".join([line for line in merged_lines if line])
        return normalized

    def _looks_like_continuation(self, prev: str, current: str) -> bool:
        """
        Decide if 'current' line is a continuation of 'prev'.
        
        Simple heuristics:
        - prev does not end with sentence-ending punctuation (. ? ! :)
        - current starts with lowercase letter or comma
        """
        if prev.endswith((".", "?", "!", ":")):
            return False
        if not current:
            return False
        first_char = current[0]
        return first_char.islower() or first_char in (",", ";")

    # ========== Section Title Standardization ==========

    def standardize_section_titles(self, text: str) -> str:
        """
        Normalize section headings to a consistent format.
        
        Example:
            '11A. Matters to be disclosed by the companies.-'
            → 'Section 11A: Matters to be disclosed by the companies.'
        """
        def _replace_heading(match: re.Match) -> str:
            section_code = match.group("code")
            title = match.group("title").strip(" .-")
            return f"Section {section_code}: {title}"

        # Pattern: digit(s) + optional letter, dot, space, title text
        pattern = re.compile(
            r"^(?P<code>\d+[A-Z]?)\.\s*(?P<title>[A-Z][^\n]+)",
            flags=re.MULTILINE,
        )
        return pattern.sub(_replace_heading, text)


# ========== Main Entry Point (OUTSIDE the class) ==========

if __name__ == "__main__":
    cleaner = CleaningService()
    
    # Option 1: Clean a specific document (pass document_id as argument)
    if len(sys.argv) > 1:
        document_id = sys.argv[1]
        output_path = cleaner.clean_and_save(document_id)
        print(f"✓ Cleaned: {output_path}")
    
    # Option 2: Clean all documents in raw_text directory
    else:
        raw_files = list(cleaner.raw_text_dir.glob("*.json"))
        print(f"Found {len(raw_files)} raw text files to clean")
        
        for file_path in raw_files:
            document_id = file_path.stem  # filename without .json
            try:
                output_path = cleaner.clean_and_save(document_id)
                print(f"✓ Cleaned: {document_id}")
            except Exception as e:
                print(f"✗ Failed {document_id}: {e}")


