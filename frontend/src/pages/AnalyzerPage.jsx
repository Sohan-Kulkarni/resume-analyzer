import { useState } from "react";
import { AlertCircle, ClipboardCheck, FileSearch, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { analyzeResume, uploadResume } from "../api/client.js";
import Button from "../components/Button.jsx";
import FileDropzone from "../components/FileDropzone.jsx";
import GlassPanel from "../components/GlassPanel.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME } from "../data/sample.js";

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileMeta, setFileMeta] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    setError("");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Upload a valid PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadResume(file);
      setResumeText(data.resume_text);
      setFileMeta(data);
    } catch (uploadError) {
      setError(uploadError.message);
      setResumeText("");
      setFileMeta(null);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");

    if (resumeText.trim().length < 20) {
      setError("Upload a resume PDF or load the sample resume.");
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError("Paste a job description before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume({
        resume_text: resumeText,
        job_description: jobDescription,
      });
      localStorage.setItem("latestAnalysis", JSON.stringify(result));
      navigate("/results", { state: { result } });
    } catch (analysisError) {
      setError(analysisError.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function loadSample() {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setFileMeta({
      filename: "sample_resume.txt",
      page_count: 1,
      character_count: SAMPLE_RESUME.length,
    });
    setError("");
  }

  return (
    <form onSubmit={handleAnalyze} className="space-y-6 pb-10">
      {isAnalyzing && <LoadingOverlay message="Reading resume signal" />}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-violetGlow">Analyzer</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Match resume to role</h1>
        </div>
        <Button type="button" variant="secondary" icon={ClipboardCheck} onClick={loadSample}>
          Use Sample
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-medium text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="p-4 sm:p-5">
          <FileDropzone fileMeta={fileMeta} isUploading={isUploading} onFile={handleFile} />
        </GlassPanel>

        <GlassPanel className="flex min-h-[26rem] flex-col p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
                <FileSearch className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-ink">Job Description</h2>
                <p className="text-sm text-slate-500">{jobDescription.length.toLocaleString()} characters</p>
              </div>
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the target role description here..."
            className="min-h-72 flex-1 rounded-2xl border border-white/70 bg-white/62 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blueGlow focus:ring-4 focus:ring-blueGlow/15"
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {resumeText ? `${resumeText.length.toLocaleString()} resume characters ready` : "Resume required"}
            </p>
            <Button type="submit" icon={Wand2} isLoading={isAnalyzing} disabled={isUploading || isAnalyzing}>
              Analyze Resume
            </Button>
          </div>
        </GlassPanel>
      </div>
    </form>
  );
}
