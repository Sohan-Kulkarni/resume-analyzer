from __future__ import annotations

from pydantic import BaseModel, Field


class UploadResumeResponse(BaseModel):
    filename: str
    resume_text: str
    page_count: int
    character_count: int


class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_description: str = Field(..., min_length=20)


class SectionFeedback(BaseModel):
    experience: str
    skills: str
    education: str


class AnalysisResult(BaseModel):
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    keyword_match_percentage: int
    suggestions: list[str]
    section_feedback: SectionFeedback


class AnalyzeResponse(AnalysisResult):
    analysis_id: int


class HistoryItem(BaseModel):
    id: int
    resume_preview: str
    job_description_preview: str
    score: int
    keyword_match_percentage: int
    created_at: str
    result: AnalysisResult
