import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SkillBarChart({ matchedCount, missingCount }) {
  const data = [
    { name: "Matched", value: matchedCount, fill: "#34d399" },
    { name: "Missing", value: missingCount, fill: "#fb7185" },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 12, bottom: 8, left: -18 }}>
          <CartesianGrid stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
            contentStyle={{
              border: "1px solid rgba(255,255,255,0.7)",
              borderRadius: "16px",
              boxShadow: "0 16px 45px rgba(15,23,42,0.14)",
            }}
          />
          <Bar dataKey="value" radius={[14, 14, 8, 8]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
