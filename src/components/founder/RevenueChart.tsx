import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueSeries } from "@/lib/mock-data";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--foreground)",
  fontSize: 12,
  boxShadow: "var(--shadow-soft)",
};

export function RevenueChart({ height = 320 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={revenueSeries} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#revGrad)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="var(--chart-4)"
          strokeWidth={2}
          fill="url(#expGrad)"
        />
        <Line
          type="monotone"
          dataKey="profit"
          name="Profit"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
