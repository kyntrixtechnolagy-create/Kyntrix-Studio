import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { PaymentCard } from "@/components/founder/PaymentCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { currency, type Payment } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments — FounderOS" },
      { name: "description", content: "Invoice tracking with paid, pending and overdue amounts per client and due date." },
      { property: "og:title", content: "Payments — FounderOS" },
      { property: "og:description", content: "Track what's paid, what's pending and what's overdue." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [selected, setSelected] = useState<Payment | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadPayments = () => {
    fetchFromAPI('/payments')
      .then(res => {
        if (!res?.data) return;
        const mapped = res.data.map((p: any) => {
          const paid = p.advancePaid;
          const total = p.amount;
          const derivedStatus = paid >= total ? 'paid' : paid > 0 ? 'partial' : p.status.toLowerCase();
          const mapped = {
            id: p.id,
            client: p.project?.client?.name || "Unknown",
            project: p.project?.name || "Unknown",
            total,
            paid,
            dueDate: p.dueDate ? p.dueDate.substring(0, 10) : "-",
            status: derivedStatus,
          };
          return mapped;
        });
        setData(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleMarkAsPaid = async () => {
    if (!selected) return;
    try {
      setIsUpdating(true);
      await fetchFromAPI(`/payments/${selected.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'PAID',
          advancePaid: selected.total
        })
      });
      toast.success("Payment marked as paid");
      setSelected(null);
      loadPayments();
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment");
    } finally {
      setIsUpdating(false);
    }
  };

  const overdue = data.filter((p) => p.status === "overdue");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Payments"
        description={`${currency(data.reduce((s, p) => s + p.total - p.paid, 0))} outstanding across ${data.length} invoices`}
        actions={
          <Button variant="outline" onClick={() => toast.success("Reminders sent (demo)")}>
            Send reminders
          </Button>
        }
      />

      {overdue.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium">{overdue.length} invoices are overdue</p>
            <p className="text-xs text-muted-foreground">
              {currency(overdue.reduce((s, p) => s + p.total - p.paid, 0))} needs collection.
            </p>
          </div>
        </div>
      )}

      <SectionCard title="All invoices">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={cn(
                    "cursor-pointer",
                    p.status === "overdue" && "bg-destructive/5 hover:bg-destructive/10",
                  )}
                >
                  <TableCell className="font-medium">{p.client}</TableCell>
                  <TableCell className="text-muted-foreground">{p.project}</TableCell>
                  <TableCell className="text-right">{currency(p.total)}</TableCell>
                  <TableCell className="text-right text-success">{currency(p.paid)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {currency(p.total - p.paid)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.dueDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Needs attention">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data
            .filter((p) => p.status !== "paid")
            .slice(0, 6)
            .map((p) => (
              <PaymentCard key={p.id} payment={p} />
            ))}
        </div>
      </SectionCard>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selected?.project}</DrawerTitle>
            <DrawerDescription>
              {selected?.client} · due {selected?.dueDate}
            </DrawerDescription>
          </DrawerHeader>
          {selected && (
            <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-4 px-4">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold">{currency(selected.total)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="font-semibold text-success">{currency(selected.paid)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="font-semibold">{currency(selected.total - selected.paid)}</p>
              </div>
            </div>
          )}
          <DrawerFooter className="mx-auto w-full max-w-md">
            <Button onClick={handleMarkAsPaid} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Mark as paid"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
