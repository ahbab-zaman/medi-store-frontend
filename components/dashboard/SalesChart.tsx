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

type ChartPoint = {
  name: string;
  [key: string]: string | number;
};

interface SalesChartProps {
  data: ChartPoint[];
  dataKey?: keyof ChartPoint;
  valueFormatter?: (value: number) => string;
}

export function SalesChart({
  data,
  dataKey = "daily",
  valueFormatter = (value) => `$${value}`,
}: SalesChartProps) {
  const formatValue = (value: string | number) =>
    valueFormatter(Number(value || 0));

  return (
    <div className="h-75 w-full">
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
            tickFormatter={(value) => formatValue(value)}
          />
          <Tooltip
            formatter={(value: string | number) => formatValue(value)}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
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
