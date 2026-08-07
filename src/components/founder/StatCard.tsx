import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: number;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
}

const tones: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  tone = "primary",
}: StatCardProps) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className="card-surface group p-5 transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            tones[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
