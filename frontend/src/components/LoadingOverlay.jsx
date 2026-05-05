export default function LoadingOverlay({ message = "Analyzing resume" }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm">
      <div className="dark-glass w-full max-w-sm rounded-2xl p-8 text-center text-white">
        <div className="relative mx-auto mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div className="absolute inset-3 animate-pulseRing rounded-full border border-blueGlow/70" />
          <div className="absolute inset-6 rounded-full bg-white/12" />
          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blueGlow shadow-[0_0_32px_rgba(56,189,248,0.85)]" />
        </div>
        <h2 className="text-xl font-semibold">{message}</h2>
        <div className="mx-auto mt-5 h-2 w-56 overflow-hidden rounded-full bg-white/10">
          <div className="shimmer-line h-full w-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
