from pathlib import Path
from typing import Optional

from loguru import logger


def resolve_pdf_path(pdf_path: str, project_root: Path) -> Path:
    """
    Resolve a PDF path relative to the project root if it is not absolute.

    Args:
        pdf_path: Path string passed in the API request.
        project_root: Project root directory (regos-sebi/).

    Returns:
        Absolute Path to the PDF file.
    """
    path = Path(pdf_path)
    if not path.is_absolute():
        path = project_root / path

    logger.info(f"Resolved PDF path: {path}")
    return path


def validate_pdf_exists(pdf_path: Path) -> None:
    """
    Ensure that the PDF exists; raise FileNotFoundError otherwise.
    """
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found at path: {pdf_path}")


def build_raw_text_output_path(document_id: str, raw_text_dir: Path) -> Path:
    """
    Build the output JSON path for a DocumentText instance in data/parsed/raw_text/.
    """
    filename = f"{document_id}.json"
    output_path = raw_text_dir / filename
    logger.info(f"Raw text JSON output path: {output_path}")
    return output_path


def ensure_parent_dir(path: Path) -> None:
    """
    Make sure the parent directory of a path exists.
    """
    path.parent.mkdir(parents=True, exist_ok=True)


