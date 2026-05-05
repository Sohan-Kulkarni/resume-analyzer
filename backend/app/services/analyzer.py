from __future__ import annotations

from typing import Any

from .llm import get_llm_analysis
from .nlp import build_fallback_analysis


def analyze_resume(resume_text: str, job_description: str) -> dict[str, Any]:
    """Run deterministic matching first, then use an LLM if configured."""

    fallback = build_fallback_analysis(resume_text, job_description)
    llm_analysis = get_llm_analysis(resume_text, job_description, fallback)

    if not llm_analysis:
        return fallback

    suggestions = llm_analysis.get("suggestions") or fallback["suggestions"]
    section_feedback = llm_analysis.get("section_feedback") or fallback["section_feedback"]
    llm_score = _safe_int(llm_analysis.get("score"), fallback["score"])

    merged_missing = _merge_unique(
        fallback["missing_skills"],
        llm_analysis.get("missing_skills", []),
    )

    return {
        "score": _clamp(round((fallback["score"] * 0.65) + (llm_score * 0.35))),
        "matched_skills": fallback["matched_skills"],
        "missing_skills": merged_missing[:14],
        "keyword_match_percentage": fallback["keyword_match_percentage"],
        "suggestions": suggestions[:7],
        "section_feedback": {
            "experience": section_feedback.get(
                "experience",
                fallback["section_feedback"]["experience"],
            ),
            "skills": section_feedback.get("skills", fallback["section_feedback"]["skills"]),
            "education": section_feedback.get(
                "education",
                fallback["section_feedback"]["education"],
            ),
        },
    }


def _merge_unique(primary: list[str], secondary: list[str]) -> list[str]:
    seen = set()
    merged = []
    for item in [*primary, *secondary]:
        normalized = item.strip().lower()
        if normalized and normalized not in seen:
            seen.add(normalized)
            merged.append(item.strip())
    return merged


def _safe_int(value: Any, fallback: int) -> int:
    try:
        return _clamp(int(value))
    except (TypeError, ValueError):
        return fallback


def _clamp(value: int, minimum: int = 0, maximum: int = 100) -> int:
    return max(minimum, min(maximum, value))
