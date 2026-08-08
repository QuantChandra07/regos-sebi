from __future__ import annotations

import json
from typing import List

import fitz  # PyMuPDF
from pdf2image import convert_from_path
import pytesseract
from loguru import logger
from pathlib import Path

from app.core.settings import settings
from app.models.document_models import PageText, DocumentText
from app.utils.pdf_utils import (
    resolve_pdf_path,
    validate_pdf_exists,
    build_raw_text_output_path,
    ensure_parent_dir,
)


def is_text_pdf(pdf_path: Path, sample_pages: int = 3) -> bool:
    """
    Heuristic to decide whether a PDF is text-based or scanned.

    Logic:
    - Sample up to `sample_pages` pages.
    - For each page, get plain text with PyMuPDF.
    - If a sampled page has very little text but images, treat it as scanned.

    Returns:
        True if all sampled pages look like text pages, False otherwise.
    """
    logger.info(f"Detecting PDF type (text vs scanned) for: {pdf_path}")
    with fitz.open(pdf_path) as doc:
        num_pages = len(doc)
        check_pages = min(sample_pages, num_pages)
        empty_pages = 0

        for i in range(check_pages):
            page = doc[i]
            text = page.get_text("text").strip()
            images = page.get_images(full=True)
            logger.debug(
                f"Page {i + 1}: text_len={len(text)}, images_count={len(images)}"
            )

            # Heuristic: low text + some images -> scanned
            if len(text) < 50 and len(images) > 0:
                empty_pages += 1

        is_text = empty_pages == 0
        logger.info(f"is_text_pdf={is_text} (empty_pages={empty_pages})")
        return is_text


class IngestionService:
    """
    Service responsible for text extraction from PDFs.

    - Uses PyMuPDF for text PDFs.
    - Uses pdf2image + Tesseract OCR for scanned PDFs.
    """

    def __init__(self) -> None:
        self.settings = settings

    # ---------- PyMuPDF path (text PDFs) ----------

    def extract_text_pymupdf(self, pdf_path: Path) -> List[PageText]:
        """
        Extract text from a text-based PDF using PyMuPDF.

        Uses `page.get_text("text", sort=True)` to get plain text in
        reading order (top-left to bottom-right).[web:8]
        """
        logger.info(f"Extracting text via PyMuPDF from: {pdf_path}")

        pages: List[PageText] = []
        with fitz.open(pdf_path) as doc:
            for i, page in enumerate(doc):
                # sort=True establishes natural reading sequence in most cases.[web:8]
                text = page.get_text("text", sort=True)
                logger.debug(f"Page {i + 1}: extracted {len(text)} characters")
                pages.append(PageText(page_number=i + 1, raw_text=text))

        logger.info(f"PyMuPDF extraction complete, pages={len(pages)}")
        return pages

    # ---------- OCR path (scanned PDFs) ----------

    def extract_text_ocr(self, pdf_path: Path) -> List[PageText]:
        """
        Extract text from a scanned PDF using pdf2image + Tesseract.

        Steps:
        - Convert each page to a PIL image at 300 DPI.
        - Run `pytesseract.image_to_string` on each image to get text.[web:9][web:15]
        """
        logger.info(f"Extracting text via OCR from: {pdf_path}")

        # pdf2image uses Poppler; POPPLER_PATH can be supplied via settings on Windows.[web:9][web:15]
        poppler_path = self.settings.POPPLER_PATH
        if poppler_path:
            pages_img = convert_from_path(
                pdf_path,
                dpi=300,
                poppler_path=poppler_path,
            )
        else:
            pages_img = convert_from_path(
                pdf_path,
                dpi=300,
            )

        pages: List[PageText] = []
        for i, img in enumerate(pages_img):
            text = pytesseract.image_to_string(img)
            logger.debug(f"OCR Page {i + 1}: extracted {len(text)} characters")
            pages.append(PageText(page_number=i + 1, raw_text=text))

        logger.info(f"OCR extraction complete, pages={len(pages)}")
        return pages

    # ---------- Unified entrypoint ----------

    def extract_text(self, pdf_path_str: str, document_id: str) -> DocumentText:
        """
        Unified entrypoint for text extraction.

        - Resolves and validates the PDF path.
        - Detects text vs scanned.
        - Routes to PyMuPDF or OCR pipeline.
        - Returns a DocumentText instance.
        """
        logger.info(
            f"Starting text extraction for document_id={document_id}, "
            f"pdf_path={pdf_path_str}"
        )

        pdf_path = resolve_pdf_path(pdf_path_str, self.settings.PROJECT_ROOT)
        validate_pdf_exists(pdf_path)

        if is_text_pdf(pdf_path):
            pages = self.extract_text_pymupdf(pdf_path)
        else:
            pages = self.extract_text_ocr(pdf_path)

        document_text = DocumentText(document_id=document_id, pages=pages)
        logger.info(
            f"Text extraction finished for document_id={document_id}, "
            f"pages={len(pages)}"
        )
        return document_text

    # ---------- Persistence ----------

    def save_document_text(self, document_text: DocumentText) -> Path:
        """
        Persist DocumentText as JSON to data/parsed/raw_text/{document_id}.json.
        """
        output_path = build_raw_text_output_path(
            document_id=document_text.document_id,
            raw_text_dir=self.settings.RAW_TEXT_DIR,
        )

        ensure_parent_dir(output_path)

        # Use model_dump() for Pydantic v2
        data = document_text.model_dump()
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        logger.info(f"Saved DocumentText JSON to: {output_path}")
        return output_path

    # ---------- High-level operation ----------

    def ingest_document(self, pdf_path_str: str, document_id: str) -> DocumentText:
        """
        High-level operation for Phase 1:

        1. Extract text from PDF (PyMuPDF or OCR).
        2. Save JSON to data/parsed/raw_text/.
        3. Return DocumentText for FastAPI response.
        """
        document_text = self.extract_text(pdf_path_str, document_id)
        self.save_document_text(document_text)
        return document_text


