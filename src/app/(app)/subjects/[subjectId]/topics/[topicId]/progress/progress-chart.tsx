"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Point = { date: string; known: number; unknown: number };

export function ProgressChart({ data }: { data: Point[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip />
          <Bar dataKey="known" stackId="a" fill="#10b981" name="Sabidas" radius={[4, 4, 0, 0]} />
          <Bar dataKey="unknown" stackId="a" fill="#f43f5e" name="Falladas" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
