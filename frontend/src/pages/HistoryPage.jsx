import { useEffect, useState } from "react";
import { ArrowRight, Clock3, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getHistory } from "../api/client.js";
import Button from "../components/Button.jsx";
import GlassPanel from "../components/GlassPanel.jsx";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setIsLoading(true);
    setError("");
    try {
      setItems(await getHistory());
    } catch (historyError) {
      setError(historyError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function openResult(item) {
    localStorage.setItem("latestAnalysis", JSON.stringify(item.result));
    navigate("/results", { state: { result: item.result } });
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-violetGlow">History</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Past analyses</h1>
        </div>
        <Button type="button" variant="secondary" icon={RefreshCw} onClick={loadHistory}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <GlassPanel className="p-8 text-center text-slate-500">Loading history...</GlassPanel>
        ) : items.length === 0 ? (
          <GlassPanel className="p-8 text-center">
            <Clock3 className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-3 text-xl font-semibold text-ink">No history yet</h2>
            <p className="mt-2 text-sm text-slate-500">Run an analysis and it will appear here.</p>
          </GlassPanel>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openResult(item)}
              className="glass-panel rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white">
                      Score {item.score}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      Keyword match {item.keyword_match_percentage}%
                    </span>
                    <span className="text-sm text-slate-400">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {item.job_description_preview}
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-ink">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
