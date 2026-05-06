from pathlib import Path
import os

PROJECT_BASE_DIR = Path(__file__).resolve().parents[1]

try:
    from dotenv import load_dotenv

    load_dotenv(PROJECT_BASE_DIR / ".env")
except ImportError:
    pass


class Settings:
    """Runtime settings loaded from environment variables."""

    BASE_DIR = PROJECT_BASE_DIR
    DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))
    DATABASE_PATH = Path(os.getenv("DATABASE_PATH", DATA_DIR / "resume_analyzer.db"))
    MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "8"))
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    CORS_ORIGINS = ['*']


settings = Settings()
