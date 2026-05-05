from __future__ import annotations

from collections import Counter
import re


SKILL_LEXICON = [
    "accessibility",
    "agile",
    "airflow",
    "analytics",
    "api",
    "aws",
    "azure",
    "ci/cd",
    "cloud",
    "communication",
    "css",
    "data analysis",
    "data engineering",
    "data visualization",
    "docker",
    "etl",
    "excel",
    "fastapi",
    "figma",
    "flask",
    "git",
    "go",
    "graphql",
    "html",
    "java",
    "javascript",
    "kafka",
    "kubernetes",
    "leadership",
    "machine learning",
    "microservices",
    "mongodb",
    "mysql",
    "next.js",
    "node.js",
    "numpy",
    "pandas",
    "postgresql",
    "power bi",
    "problem solving",
    "product management",
    "python",
    "pytorch",
    "react",
    "redis",
    "rest api",
    "scikit-learn",
    "scrum",
    "sql",
    "sqlite",
    "stakeholder management",
    "statistics",
    "tableau",
    "tailwind",
    "tensorflow",
    "testing",
    "typescript",
    "ui/ux",
    "vue",
]

STOP_WORDS = {
    "about",
    "across",
    "after",
    "also",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "can",
    "for",
    "from",
    "has",
    "have",
    "in",
    "into",
    "is",
    "it",
    "of",
    "on",
    "or",
    "our",
    "that",
    "the",
    "their",
    "this",
    "to",
    "with",
    "you",
    "your",
}

ACTION_VERBS = {
    "achieved",
    "architected",
    "automated",
    "built",
    "delivered",
    "designed",
    "improved",
    "launched",
    "led",
    "managed",
    "migrated",
    "optimized",
    "owned",
    "reduced",
    "shipped",
    "scaled",
}


def build_fallback_analysis(resume_text: str, job_description: str) -> dict:
    resume_normalized = normalize_text(resume_text)
    job_terms = extract_job_terms(job_description)
    matched = [term for term in job_terms if contains_term(resume_normalized, term)]
    missing = [term for term in job_terms if term not in matched]

    keyword_match_percentage = _percentage(len(matched), len(job_terms))
    section_feedback = build_section_feedback(resume_text)
    score = calculate_score(
        resume_text=resume_text,
        keyword_match_percentage=keyword_match_percentage,
        section_feedback=section_feedback,
    )

    return {
        "score": score,
        "matched_skills": _title_list(matched[:16]),
        "missing_skills": _title_list(missing[:14]),
        "keyword_match_percentage": keyword_match_percentage,
        "suggestions": build_suggestions(missing, resume_text, job_description),
        "section_feedback": section_feedback,
    }


def extract_job_terms(job_description: str, limit: int = 34) -> list[str]:
    normalized_job = normalize_text(job_description)
    explicit_skills = [skill for skill in SKILL_LEXICON if contains_term(normalized_job, skill)]
    keyword_terms = extract_tfidf_keywords(job_description, limit=limit)
    return _dedupe([*explicit_skills, *keyword_terms])[:limit]


def extract_tfidf_keywords(text: str, limit: int = 24) -> list[str]:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer

        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=80,
            token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9+#.\-]{1,}\b",
        )
        matrix = vectorizer.fit_transform([text])
        names = vectorizer.get_feature_names_out()
        scores = matrix.toarray()[0]
        ranked = sorted(zip(names, scores), key=lambda item: item[1], reverse=True)
        return [
            normalize_text(name)
            for name, _score in ranked
            if _is_useful_keyword(name)
        ][:limit]
    except Exception:
        return extract_regex_keywords(text, limit=limit)


def extract_regex_keywords(text: str, limit: int = 24) -> list[str]:
    words = [
        word
        for word in re.findall(r"[a-zA-Z][a-zA-Z0-9+#.\-]{1,}", text.lower())
        if word not in STOP_WORDS and len(word) > 2
    ]
    bigrams = [" ".join(pair) for pair in zip(words, words[1:])]
    counts = Counter([*words, *bigrams])
    return [term for term, _count in counts.most_common(limit) if _is_useful_keyword(term)]


def build_section_feedback(resume_text: str) -> dict[str, str]:
    sections = extract_sections(resume_text)
    experience_text = sections.get("experience", "")
    skills_text = sections.get("skills", "")
    education_text = sections.get("education", "")

    if not experience_text:
        experience = "Add a clear Experience section with role titles, company names, dates, and measurable outcomes."
    elif not re.search(r"\d+%|\$\d+|\b\d+x\b|\b\d+\+?\b", experience_text.lower()):
        experience = "Experience is present, but the bullets would be stronger with quantified impact and business outcomes."
    elif not any(verb in experience_text.lower() for verb in ACTION_VERBS):
        experience = "Experience has metrics; start more bullets with strong action verbs to make impact easier to scan."
    else:
        experience = "Experience is well structured with impact signals. Keep the most relevant achievements near the top."

    if not skills_text:
        skills = "Add a dedicated Skills section grouped by tools, languages, frameworks, and domain strengths."
    elif len(extract_regex_keywords(skills_text, limit=20)) < 6:
        skills = "Skills section is present but light. Add more role-specific tools and technologies from the job description."
    else:
        skills = "Skills section is easy to scan. Prioritize the technologies that appear in the target job description."

    if not education_text:
        education = "Add Education with degree, institution, graduation year, and relevant certifications if applicable."
    elif not re.search(r"bachelor|master|degree|university|college|certification|certified", education_text.lower()):
        education = "Education is present. Include degree, school, and relevant certifications to improve ATS clarity."
    else:
        education = "Education is clear. Keep it concise unless coursework or certifications directly match the role."

    return {
        "experience": experience,
        "skills": skills,
        "education": education,
    }


def build_suggestions(
    missing: list[str],
    resume_text: str,
    job_description: str,
) -> list[str]:
    suggestions = []
    resume_lower = resume_text.lower()
    job_lower = job_description.lower()

    if missing:
        top_missing = ", ".join(_title_list(missing[:5]))
        suggestions.append(f"Add evidence for these high-value job terms where accurate: {top_missing}.")

    if not re.search(r"\d+%|\$\d+|\b\d+x\b|\b\d+\+?\b", resume_lower):
        suggestions.append("Quantify impact with metrics such as revenue, latency, cost, volume, or time saved.")

    if "summary" not in resume_lower and ("senior" in job_lower or "lead" in job_lower):
        suggestions.append("Add a short summary that mirrors the seniority, domain, and top requirements of the role.")

    if "skills" not in resume_lower:
        suggestions.append("Create a dedicated Skills section so ATS systems can find tools and technologies quickly.")

    if not any(verb in resume_lower for verb in ACTION_VERBS):
        suggestions.append("Start bullets with action verbs such as built, optimized, led, shipped, or automated.")

    suggestions.append("Reorder bullets so the most job-relevant projects and outcomes appear first.")
    suggestions.append("Use the job description's exact terminology when it truthfully matches your background.")
    return _dedupe(suggestions)[:7]


def calculate_score(
    resume_text: str,
    keyword_match_percentage: int,
    section_feedback: dict[str, str],
) -> int:
    resume_lower = resume_text.lower()
    section_score = 0
    for heading in ("experience", "skills", "education"):
        if heading in resume_lower:
            section_score += 6

    length_score = 8 if len(resume_text.split()) >= 250 else 4
    impact_score = 10 if re.search(r"\d+%|\$\d+|\b\d+x\b|\b\d+\+?\b", resume_lower) else 3

    feedback_penalty = sum(
        2
        for value in section_feedback.values()
        if value.lower().startswith(("add", "experience is present, but", "skills section is present but"))
    )

    score = round((keyword_match_percentage * 0.68) + section_score + length_score + impact_score - feedback_penalty)
    return max(0, min(100, score))


def extract_sections(text: str) -> dict[str, str]:
    headings = {
        "experience": r"(experience|work experience|professional experience|employment)",
        "skills": r"(skills|technical skills|core skills|technologies)",
        "education": r"(education|academic background|certifications)",
    }
    lines = text.splitlines()
    current = None
    sections = {"experience": "", "skills": "", "education": ""}

    for line in lines:
        clean = line.strip()
        if not clean:
            continue

        matched_heading = None
        for section, pattern in headings.items():
            if re.fullmatch(pattern, clean.lower()):
                matched_heading = section
                break

        if matched_heading:
            current = matched_heading
            continue

        if current:
            sections[current] += clean + "\n"

    if not any(sections.values()):
        lower = text.lower()
        if "experience" in lower:
            sections["experience"] = text
        if "skill" in lower:
            sections["skills"] = text
        if "education" in lower or "university" in lower:
            sections["education"] = text

    return sections


def normalize_text(value: str) -> str:
    value = value.lower()
    value = value.replace("nodejs", "node.js").replace("reactjs", "react")
    value = value.replace("postgres", "postgresql")
    value = value.replace("ci cd", "ci/cd")
    value = re.sub(r"[^a-z0-9+#./\s-]", " ", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def contains_term(normalized_text: str, term: str) -> bool:
    normalized_term = normalize_text(term)
    if not normalized_term:
        return False
    if any(char in normalized_term for char in " +#./-"):
        return normalized_term in normalized_text
    pattern = rf"(?<![a-z0-9]){re.escape(normalized_term)}(?![a-z0-9])"
    return re.search(pattern, normalized_text) is not None


def _is_useful_keyword(term: str) -> bool:
    normalized = normalize_text(term)
    if len(normalized) < 3:
        return False
    parts = normalized.split()
    if any(part in STOP_WORDS for part in parts):
        return False
    if normalized.isdigit():
        return False
    return True


def _dedupe(items: list[str]) -> list[str]:
    seen = set()
    output = []
    for item in items:
        normalized = normalize_text(str(item))
        if normalized and normalized not in seen:
            seen.add(normalized)
            output.append(normalized)
    return output


def _title_list(items: list[str]) -> list[str]:
    special = {
        "api": "API",
        "aws": "AWS",
        "azure": "Azure",
        "ci/cd": "CI/CD",
        "css": "CSS",
        "etl": "ETL",
        "fastapi": "FastAPI",
        "html": "HTML",
        "javascript": "JavaScript",
        "mysql": "MySQL",
        "next.js": "Next.js",
        "node.js": "Node.js",
        "postgresql": "PostgreSQL",
        "rest api": "REST API",
        "scikit-learn": "scikit-learn",
        "sql": "SQL",
        "sqlite": "SQLite",
        "ui/ux": "UI/UX",
    }
    return [special.get(item, item.title()) for item in items]


def _percentage(part: int, total: int) -> int:
    if total == 0:
        return 0
    return round((part / total) * 100)
