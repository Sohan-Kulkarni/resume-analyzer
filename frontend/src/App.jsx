import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { BarChart3, Clock3, FileSearch, Sparkles } from "lucide-react";

import AnalyzerPage from "./pages/AnalyzerPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";

const navItems = [
  { to: "/", label: "Home", icon: Sparkles },
  { to: "/analyzer", label: "Analyzer", icon: FileSearch },
  { to: "/results", label: "Results", icon: BarChart3 },
  { to: "/history", label: "History", icon: Clock3 },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="app-background relative min-h-screen overflow-hidden text-ink">
      <div className="surface-grid pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <nav className="glass-panel mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white shadow-soft">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold uppercase text-slate-700 sm:text-base">
              AI Resume Analyzer
            </span>
          </NavLink>

          <div className="flex items-center gap-1 rounded-2xl bg-white/45 p-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "group flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition",
                    isActive
                      ? "bg-ink text-white shadow-soft"
                      : "text-slate-600 hover:bg-white/70 hover:text-ink",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex-1"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyzer" element={<AnalyzerPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
