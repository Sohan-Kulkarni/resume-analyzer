from __future__ import annotations

import json
from typing import Any

from ..config import settings


def get_llm_analysis(
    resume_text: str,
    job_description: str,
    fallback: dict[str, Any],
) -> dict[str, Any] | None:
    """Return LLM feedback when OPENAI_API_KEY is configured.

    The app remains fully usable without an API key because the caller merges this
    optional response with deterministic NLP output.
    """

    if not settings.OPENAI_API_KEY:
        return None

    try:
        from openai import OpenAI
    except ImportError:
        return None

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    prompt = {
        "resume_text": _truncate(resume_text, 12000),
        "job_description": _truncate(job_description, 6000),
        "fallback_metrics": fallback,
    }

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a concise senior recruiter and ATS optimization expert. "
                        "Return only valid JSON with keys: score, missing_skills, "
                        "suggestions, section_feedback. section_feedback must contain "
                        "experience, skills, and education strings."
                    ),
                },
                {
                    "role": "user",
                    "content": json.dumps(prompt),
                },
            ],
        )
        content = response.choices[0].message.content or "{}"
        return _sanitize_payload(json.loads(content))
    except Exception:
        return None


def _sanitize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    section_feedback = payload.get("section_feedback") or {}
    return {
        "score": _clamp(payload.get("score", 0)),
        "missing_skills": _string_list(payload.get("missing_skills", []), limit=14),
        "suggestions": _string_list(payload.get("suggestions", []), limit=7),
        "section_feedback": {
            "experience": str(section_feedback.get("experience", "")).strip(),
            "skills": str(section_feedback.get("skills", "")).strip(),
            "education": str(section_feedback.get("education", "")).strip(),
        },
    }


def _string_list(value: Any, limit: int) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()][:limit]


def _clamp(value: Any) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, number))


def _truncate(value: str, limit: int) -> str:
    return value[:limit]
