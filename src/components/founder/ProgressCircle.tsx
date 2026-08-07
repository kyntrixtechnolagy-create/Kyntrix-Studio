import { cn } from "@/lib/utils";

export function ProgressCircle({
  value,
  size = 132,
  stroke = 10,
  label,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-muted"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
          fill="none"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold tracking-tight">{value}%</div>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
}
