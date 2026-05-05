import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lightbulb, PlusCircle, ShieldAlert } from "lucide-react";

import Button from "../components/Button.jsx";
import GlassPanel from "../components/GlassPanel.jsx";
import KeywordGauge from "../components/KeywordGauge.jsx";
import ScoreRing from "../components/ScoreRing.jsx";
import SkillBarChart from "../components/SkillBarChart.jsx";

export default function ResultsPage() {
  const location = useLocation();
  const result = useMemo(() => {
    if (location.state?.result) return location.state.result;
    const stored = localStorage.getItem("latestAnalysis");
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  if (!result) {
    return (
      <div className="grid min-h-[60vh] place-items-center pb-10">
        <GlassPanel className="max-w-lg p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-slate-400" />
          <h1 className="mt-4 text-3xl font-bold text-ink">No result loaded</h1>
          <p className="mt-3 text-slate-500">Run an analysis to see resume scoring and feedback.</p>
          <Link to="/analyzer" className="mt-6 inline-block">
            <Button icon={ArrowRight}>Open Analyzer</Button>
          </Link>
        </GlassPanel>
      </div>
    );
  }

  const matchedCount = result.matched_skills?.length || 0;
  const missingCount = result.missing_skills?.length || 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-violetGlow">Results</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Resume fit report</h1>
        </div>
        <Link to="/analyzer">
          <Button icon={PlusCircle}>New Analysis</Button>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="grid place-items-center p-6">
          <ScoreRing score={result.score} />
        </GlassPanel>

        <div className="grid gap-6 md:grid-cols-2">
          <GlassPanel className="p-5">
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-ink">Skill Match</h2>
              <p className="text-sm text-slate-500">
                {matchedCount} matched, {missingCount} missing
              </p>
            </div>
            <SkillBarChart matchedCount={matchedCount} missingCount={missingCount} />
          </GlassPanel>

          <GlassPanel className="p-5">
            <h2 className="text-xl font-semibold text-ink">Keyword Match</h2>
            <KeywordGauge percentage={result.keyword_match_percentage} />
          </GlassPanel>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <GlassPanel className="p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-ink">Missing Skills</h2>
            <span className="rounded-full bg-coral/12 px-3 py-1 text-sm font-semibold text-rose-700">
              {missingCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills?.length ? (
              result.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-coral/30 bg-coral/12 px-3 py-2 text-sm font-semibold text-rose-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-success/15 px-3 py-2 text-sm font-semibold text-emerald-700">
                No major skill gaps found
              </span>
            )}
          </div>

          <h3 className="mt-8 text-lg font-bold text-ink">Matched Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.matched_skills?.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-emerald-300/50 bg-success/14 px-3 py-2 text-sm font-semibold text-emerald-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
              <Lightbulb className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-bold text-ink">Suggestions</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.suggestions?.map((suggestion, index) => (
              <div key={suggestion} className="rounded-2xl bg-white/56 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-violetGlow/12 text-sm font-bold text-violetGlow">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-5">
        <h2 className="text-2xl font-bold text-ink">Section Feedback</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {Object.entries(result.section_feedback || {}).map(([section, feedback]) => (
            <div key={section} className="rounded-2xl bg-white/56 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-blueGlow" />
                {section}
              </div>
              <p className="text-sm leading-6 text-slate-700">{feedback}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
