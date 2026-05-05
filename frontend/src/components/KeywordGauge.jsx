import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

export default function KeywordGauge({ percentage }) {
  const value = Number.isFinite(percentage) ? percentage : 0;
  const data = [{ name: "Keyword match", value, fill: "#38bdf8" }];

  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="58%"
          innerRadius="62%"
          outerRadius="92%"
          barSize={18}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={16} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
        <div className="text-4xl font-bold text-ink">{value}%</div>
        <div className="mt-1 text-sm font-medium text-slate-500">Keyword Match</div>
      </div>
    </div>
  );
}
