from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO


class PdfExtractionError(Exception):
    pass


@dataclass
class PdfExtractionResult:
    text: str
    page_count: int


def extract_text_from_pdf(contents: bytes) -> PdfExtractionResult:
    if not contents.startswith(b"%PDF"):
        raise PdfExtractionError("The uploaded file does not look like a valid PDF.")

    try:
        return _extract_with_pymupdf(contents)
    except ImportError as exc:
        try:
            return _extract_with_pdfplumber(contents)
        except ImportError as fallback_exc:
            raise PdfExtractionError(
                "PDF parsing dependencies are not installed. Install PyMuPDF or pdfplumber."
            ) from fallback_exc
    except Exception as exc:
        raise PdfExtractionError("Could not extract text from this PDF.") from exc


def _extract_with_pymupdf(contents: bytes) -> PdfExtractionResult:
    import fitz

    doc = fitz.open(stream=contents, filetype="pdf")
    try:
        pages = [page.get_text("text") for page in doc]
    finally:
        doc.close()

    text = "\n".join(page.strip() for page in pages if page.strip()).strip()
    if not text:
        raise PdfExtractionError("No selectable text was found in the PDF.")
    return PdfExtractionResult(text=text, page_count=len(pages))


def _extract_with_pdfplumber(contents: bytes) -> PdfExtractionResult:
    import pdfplumber

    with pdfplumber.open(BytesIO(contents)) as pdf:
        pages = [(page.extract_text() or "").strip() for page in pdf.pages]

    text = "\n".join(page for page in pages if page).strip()
    if not text:
        raise PdfExtractionError("No selectable text was found in the PDF.")
    return PdfExtractionResult(text=text, page_count=len(pages))
