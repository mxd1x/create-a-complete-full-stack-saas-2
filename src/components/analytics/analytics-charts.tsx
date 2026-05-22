"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const tooltipStyle = {
  background: "#111113",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  fontSize: 12
};

export function SalesGrowthChart({ data }: { data: { week: string; won: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="week" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ stroke: "rgba(255,255,255,0.1)" }} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="won" stroke="#fafafa" strokeWidth={2} dot={{ fill: "#fafafa", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EmployeePerformanceChart({
  data
}: {
  data: { name: string; won: number; open: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={90} />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={tooltipStyle} />
          <Bar dataKey="won" fill="#fafafa" radius={[0, 4, 4, 0]} name="Won" />
          <Bar dataKey="open" fill="rgba(255,255,255,0.25)" radius={[0, 4, 4, 0]} name="Open" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
