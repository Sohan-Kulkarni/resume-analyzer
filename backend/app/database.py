from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
import json
import sqlite3
from typing import Any

from .config import settings


def init_db() -> None:
    settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resume_preview TEXT NOT NULL,
                job_description_preview TEXT NOT NULL,
                result_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


@contextmanager
def get_connection():
    settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def save_analysis(
    resume_text: str,
    job_description: str,
    result: dict[str, Any],
) -> int:
    init_db()
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO analyses (
                resume_preview,
                job_description_preview,
                result_json,
                created_at
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                _preview(resume_text),
                _preview(job_description),
                json.dumps(result),
                created_at,
            ),
        )
        conn.commit()
        return int(cursor.lastrowid)


def list_analyses(limit: int = 25) -> list[dict[str, Any]]:
    init_db()
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, resume_preview, job_description_preview, result_json, created_at
            FROM analyses
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    return [_history_row(row) for row in rows]


def get_analysis(analysis_id: int) -> dict[str, Any] | None:
    init_db()
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT id, resume_preview, job_description_preview, result_json, created_at
            FROM analyses
            WHERE id = ?
            """,
            (analysis_id,),
        ).fetchone()

    if row is None:
        return None
    return _history_row(row)


def _history_row(row: sqlite3.Row) -> dict[str, Any]:
    result = json.loads(row["result_json"])
    return {
        "id": row["id"],
        "resume_preview": row["resume_preview"],
        "job_description_preview": row["job_description_preview"],
        "score": result.get("score", 0),
        "keyword_match_percentage": result.get("keyword_match_percentage", 0),
        "created_at": row["created_at"],
        "result": result,
    }


def _preview(value: str, limit: int = 240) -> str:
    compact = " ".join(value.split())
    return compact[:limit]
