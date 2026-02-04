"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: any[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="daily"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#2563EB",
              strokeWidth: 2,
              stroke: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
