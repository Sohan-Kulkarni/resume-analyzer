from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import get_analysis, init_db, list_analyses, save_analysis
from .models import AnalyzeRequest, AnalyzeResponse, HistoryItem, UploadResumeResponse
from .services.analyzer import analyze_resume
from .services.pdf_parser import PdfExtractionError, extract_text_from_pdf

app = FastAPI(
    title="AI Resume Analyzer API",
    version="1.0.0",
    description="FastAPI backend for resume parsing, keyword analysis, and LLM feedback.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/upload-resume", response_model=UploadResumeResponse)
async def upload_resume(file: UploadFile = File(...)) -> UploadResumeResponse:
    filename = file.filename or "resume.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF resume.")

    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"PDF is too large. Max size is {settings.MAX_UPLOAD_MB} MB.",
        )

    try:
        parsed = extract_text_from_pdf(contents)
    except PdfExtractionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return UploadResumeResponse(
        filename=filename,
        resume_text=parsed.text,
        page_count=parsed.page_count,
        character_count=len(parsed.text),
    )


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    result = analyze_resume(payload.resume_text, payload.job_description)
    analysis_id = save_analysis(
        payload.resume_text,
        payload.job_description,
        result,
    )
    return AnalyzeResponse(analysis_id=analysis_id, **result)


@app.get("/history", response_model=list[HistoryItem])
def history() -> list[HistoryItem]:
    return list_analyses()


@app.get("/history/{analysis_id}", response_model=HistoryItem)
def history_item(analysis_id: int) -> HistoryItem:
    item = get_analysis(analysis_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return item
