# backend/app/core/settings.py
"""
Application configuration.

Reads from environment variables and `.env`.
"""

from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict
from loguru import logger
import pytesseract


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    # Project root (regos-sebi/)
    PROJECT_ROOT: Optional[Path] = None

    # Data directories (relative to PROJECT_ROOT if not absolute)
    RAW_TEXT_DIR: Path = Path("data/parsed/raw_text")

    # Tesseract configuration
    TESSERACT_CMD: Optional[str] = None

    # Poppler path for pdf2image (Windows)
    POPPLER_PATH: Optional[str] = None

    # FastAPI config
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True

    # API Keys
    groq_api_key: Optional[str] = None
    database_url: Optional[str] = None
    hf_token: Optional[str] = None
    openai_api_key: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Allow extra env vars without errors
    )

    def configure_paths(self) -> None:
        """
        Resolve PROJECT_ROOT and RAW_TEXT_DIR to absolute paths.
        """
        if self.PROJECT_ROOT is None:
            # Infer project root from this file path:
            # backend/app/core/settings.py -> regos-sebi/
            self.PROJECT_ROOT = Path(__file__).resolve().parents[3]
            logger.info(f"Inferred PROJECT_ROOT = {self.PROJECT_ROOT}")
        else:
            self.PROJECT_ROOT = Path(self.PROJECT_ROOT)

        # Make RAW_TEXT_DIR absolute (under PROJECT_ROOT if relative)
        if not self.RAW_TEXT_DIR.is_absolute():
            self.RAW_TEXT_DIR = self.PROJECT_ROOT / self.RAW_TEXT_DIR

        self.RAW_TEXT_DIR.mkdir(parents=True, exist_ok=True)
        logger.info(f"RAW_TEXT_DIR = {self.RAW_TEXT_DIR}")

    def configure_tesseract(self) -> None:
        """
        Configure the Tesseract command path if provided.
        """
        if self.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = self.TESSERACT_CMD
            logger.info(f"Configured Tesseract CMD = {self.TESSERACT_CMD}")
        else:
            logger.warning(
                "TESSERACT_CMD not set – OCR will fail unless Tesseract is on PATH."
            )


# Create and initialize settings
settings = Settings()
settings.configure_paths()
settings.configure_tesseract()


