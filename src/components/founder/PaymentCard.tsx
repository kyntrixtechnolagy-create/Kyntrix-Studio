import { cn } from "@/lib/utils";
import { currency, type Payment } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";
import { Progress } from "@/components/ui/progress";

export function PaymentCard({ payment }: { payment: Payment }) {
  const pending = payment.total - payment.paid;
  const pct = Math.round((payment.paid / payment.total) * 100);
  return (
    <div
      className={cn(
        "card-surface p-5",
        payment.status === "overdue" && "border-destructive/40 bg-destructive/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{payment.client}</p>
          <p className="truncate text-xs text-muted-foreground">{payment.project}</p>
        </div>
        <StatusBadge status={payment.status} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-medium">{currency(payment.total)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="font-medium text-success">{currency(payment.paid)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="font-medium">{currency(pending)}</p>
        </div>
      </div>
      <Progress value={pct} className="mt-4 h-1.5" />
      <p className="mt-2 text-xs text-muted-foreground">Due {payment.dueDate}</p>
    </div>
  );
}
