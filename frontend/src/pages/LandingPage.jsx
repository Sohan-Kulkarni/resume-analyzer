import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, Gauge, Sparkles } from "lucide-react";

import Button from "../components/Button.jsx";
import GlassPanel from "../components/GlassPanel.jsx";
import ScoreRing from "../components/ScoreRing.jsx";

const metrics = [
  { label: "Resume Score", value: "84", icon: Gauge },
  { label: "Keyword Match", value: "76%", icon: BarChart3 },
  { label: "Skills Found", value: "18", icon: CheckCircle2 },
];

export default function LandingPage() {
  return (
    <div className="pb-10">
      <section className="grid min-h-[calc(100vh-8rem)] items-center gap-8 py-6 lg:grid-cols-[1fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-sm font-semibold text-violetGlow shadow-soft">
            <Sparkles className="h-4 w-4" />
            Resume intelligence for focused job searches
          </p>
          <h1 className="mt-6 text-5xl font-bold leading-tight text-ink sm:text-6xl lg:text-7xl">
            AI Resume Analyzer
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-600">
            Optimize your resume for your dream job
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/analyzer" icon={ArrowRight} className="w-full sm:w-auto">
              Start Analysis
            </Button>
            <Button as={Link} to="/history" variant="secondary" className="w-full sm:w-auto">
              View History
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
          className="relative"
        >
          <GlassPanel className="p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase text-slate-500">Live Preview</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Full-stack role fit</h2>
              </div>
              <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-emerald-700">
                Ready
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-[0.85fr_1fr]">
              <div className="grid place-items-center rounded-2xl bg-white/48 p-4">
                <ScoreRing score={84} size={168} />
              </div>
              <div className="space-y-3">
                {["React", "FastAPI", "PostgreSQL", "AWS"].map((skill, index) => (
                  <div key={skill} className="rounded-2xl bg-white/54 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                      <span>{skill}</span>
                      <span className="text-slate-500">{92 - index * 9}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${92 - index * 9}%` }}
                        transition={{ delay: 0.35 + index * 0.08, duration: 0.7 }}
                        className="h-full rounded-full bg-gradient-to-r from-violetGlow via-blueGlow to-success"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <GlassPanel key={label} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </GlassPanel>
        ))}
      </section>
    </div>
  );
}
