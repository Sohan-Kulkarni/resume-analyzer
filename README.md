# AI Resume Analyzer

A full-stack resume analysis app built with React, Vite, Tailwind CSS, Framer Motion, Recharts, Python FastAPI, SQLite, and optional OpenAI analysis.

## Features

- Upload a PDF resume and extract text with PyMuPDF
- Paste a target job description
- Get a resume score from 0-100
- See matched skills, missing skills, and keyword match percentage
- Review improvement suggestions and section-wise feedback
- Use deterministic sklearn TF-IDF keyword matching when no LLM key is configured
- Save analysis history in SQLite
- Test quickly with included sample resume and job description

## Project Structure

```text
resume-analyzer/
  backend/
    app/
    samples/
    scripts/
    requirements.txt
  frontend/
    src/
    package.json
```

## Backend Setup

```powershell
cd resume-analyzer\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
# Run this in 1st powershell
```powershell
cd "C:\Important files\AI_Resume_Analyzer\resume-analyzer\backend"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

OpenAPI docs will be available at:

```text
http://127.0.0.1:8000/docs
```

The OpenAI key is optional. Without it, the app uses the local TF-IDF fallback.

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

## Frontend Setup

In a second terminal:

```powershell
cd resume-analyzer\frontend
npm.cmd install
copy .env.example .env
npm.cmd run dev
```
# Run this in 2nd Powershell
```Powershell
cd "C:\Important files\AI_Resume_Analyzer\resume-analyzer\frontend"
npm.cmd run dev
```

The app will run at:

```text
http://127.0.0.1:5173
```

## Sample Data

Text samples are included in:

```text
backend/samples/sample_resume.txt
backend/samples/sample_job_description.txt
```

After installing backend dependencies, you can generate a test PDF:

```powershell
cd resume-analyzer\backend
python scripts\create_sample_pdf.py
```

You can also click `Use Sample` in the analyzer page to load test content immediately.

## API Endpoints

- `POST /upload-resume` - Accepts a PDF and returns extracted resume text
- `POST /analyze` - Accepts `resume_text` and `job_description`, returns scoring and feedback
- `GET /history` - Lists saved analyses
- `GET /history/{analysis_id}` - Returns a saved analysis
- `GET /health` - Health check

## Notes

- SQLite data is stored under `backend/data/`.
- Configure allowed frontend origins with `CORS_ORIGINS` in `backend/.env`.
- If PowerShell blocks `npm`, use `npm.cmd` as shown above.
