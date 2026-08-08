import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchFromAPI } from "@/lib/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet, Plus, Loader2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/founder/StatCard";
import { currency } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance — FounderOS" },
      { name: "description", content: "Income, expenses, savings and profit with monthly charts and expense category breakdown." },
      { property: "og:title", content: "Finance — FounderOS" },
      { property: "og:description", content: "Where the money comes from and where it goes each month." },
    ],
  }),
  component: FinancePage,
});

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  fontSize: 12,
};

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--info)",
  "var(--muted-foreground)",
];

function FinancePage() {
  const [data, setData] = useState<any>({
    totals: { revenue: 0, expenses: 0, savings: 0, profit: 0 },
    revenueSeries: [],
    expenseCategories: [],
    expenses: []
  });

  // --- Savings dialog state ---
  const [savingsOpen, setSavingsOpen] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState<number | "">("");
  const [savingsSubmitting, setSavingsSubmitting] = useState(false);

  // --- Expense dialog state ---
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "" as number | "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [expenseSubmitting, setExpenseSubmitting] = useState(false);

  const loadFinance = () => {
    fetchFromAPI('/finance?limit=100')
      .then(res => {
        const transactions = res.data;
        if (!transactions) return;
        let revenue = 0;
        let expensesTotal = 0;
        let savingsTotal = 0;

        const monthlyStats: Record<string, { revenue: number, expenses: number, profit: number }> = {};
        const categoryMap: Record<string, number> = {};
        const recentExpenses: any[] = [];

        transactions.forEach((t: any) => {
           if (t.type === 'INCOME') {
              revenue += t.amount;
           } else if (t.type === 'EXPENSE') {
              expensesTotal += t.amount;
              const catName = t.category?.name || 'Uncategorized';
              categoryMap[catName] = (categoryMap[catName] || 0) + t.amount;
              recentExpenses.push({
                id: t.id,
                category: catName,
                label: t.title,
                date: t.date ? t.date.substring(0, 10) : '-',
                amount: t.amount
              });
           } else if (t.type === 'SAVINGS') {
              savingsTotal += t.amount;
           }

           if (t.date) {
             const month = new Date(t.date).toLocaleString('default', { month: 'short' });
             if (!monthlyStats[month]) monthlyStats[month] = { revenue: 0, expenses: 0, profit: 0 };
             if (t.type === 'INCOME') monthlyStats[month].revenue += t.amount;
             if (t.type === 'EXPENSE') monthlyStats[month].expenses += t.amount;
             monthlyStats[month].profit = monthlyStats[month].revenue - monthlyStats[month].expenses;
           }
        });

        const revSeries = Object.keys(monthlyStats).map(month => ({
           month,
           ...monthlyStats[month]
        }));

        const expCats = Object.keys(categoryMap).map(name => ({
           name,
           value: categoryMap[name]
        }));

        setData({
          totals: { revenue, expenses: expensesTotal, savings: savingsTotal, profit: revenue - expensesTotal - savingsTotal },
          revenueSeries: revSeries,
          expenseCategories: expCats,
          expenses: recentExpenses.slice(0, 10)
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadFinance();
  }, []);

  // --- Handlers ---
  const handleAddSavings = async () => {
    if (!savingsAmount || savingsAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      setSavingsSubmitting(true);
      await fetchFromAPI('/finance', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Transfer to Savings',
          amount: Number(savingsAmount),
          type: 'SAVINGS'
        })
      });
      toast.success("Transferred to savings");
      setSavingsOpen(false);
      setSavingsAmount("");
      loadFinance();
    } catch (err: any) {
      toast.error(err.message || "Failed to add savings");
    } finally {
      setSavingsSubmitting(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseForm.title.trim()) {
      toast.error("Enter an expense title");
      return;
    }
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      setExpenseSubmitting(true);
      await fetchFromAPI('/finance', {
        method: 'POST',
        body: JSON.stringify({
          title: expenseForm.title.trim(),
          amount: Number(expenseForm.amount),
          type: 'EXPENSE',
          date: expenseForm.date ? new Date(expenseForm.date).toISOString() : undefined,
          ...(expenseForm.category.trim()
            ? { notes: expenseForm.category.trim() }
            : {}),
        })
      });
      toast.success("Expense recorded");
      setExpenseOpen(false);
      setExpenseForm({ title: "", amount: "", category: "", date: new Date().toISOString().slice(0, 10) });
      loadFinance();
    } catch (err: any) {
      toast.error(err.message || "Failed to record expense");
    } finally {
      setExpenseSubmitting(false);
    }
  };

  const { totals, revenueSeries, expenseCategories, expenses } = data;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Finance"
        description="Cash in, cash out, and what's left."
        actions={
          <div className="flex gap-2">
            {/* ── Add Expense ── */}
            <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" id="add-expense-btn">
                  <Plus className="mr-1 h-4 w-4" /> Add expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record an expense</DialogTitle>
                  <DialogDescription>
                    Log a business expense to keep your profit accurate.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="exp-title">Title / description</Label>
                    <Input
                      id="exp-title"
                      placeholder="e.g. Adobe subscription"
                      value={expenseForm.title}
                      onChange={e => setExpenseForm(f => ({ ...f, title: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="exp-amount">Amount (Rs.)</Label>
                      <Input
                        id="exp-amount"
                        type="number"
                        min="1"
                        placeholder="0"
                        value={expenseForm.amount}
                        onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value ? Number(e.target.value) : "" }))}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="exp-date">Date</Label>
                      <Input
                        id="exp-date"
                        type="date"
                        value={expenseForm.date}
                        onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="exp-category">Category <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="exp-category"
                      placeholder="e.g. Software, Marketing, Tools"
                      value={expenseForm.category}
                      onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExpenseOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleAddExpense} disabled={expenseSubmitting} id="save-expense-btn">
                    {expenseSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                    ) : (
                      "Record expense"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ── Add Savings ── */}
            <Dialog open={savingsOpen} onOpenChange={setSavingsOpen}>
              <DialogTrigger asChild>
                <Button id="add-savings-btn">
                  <Plus className="mr-1 h-4 w-4" /> Add savings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transfer to savings</DialogTitle>
                  <DialogDescription>
                    Move a portion of your profits into your reserve account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="samount">Amount to transfer (Rs.)</Label>
                    <Input
                      id="samount"
                      type="number"
                      min="1"
                      value={savingsAmount}
                      onChange={e => setSavingsAmount(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSavingsOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSavings} disabled={savingsSubmitting} id="save-savings-btn">
                    {savingsSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transferring…</>
                    ) : (
                      "Transfer"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total income" value={currency(totals.revenue)} subtitle="Year to date" icon={ArrowUpRight} trend={12.4} />
        <StatCard label="Expenses" value={currency(totals.expenses)} subtitle="Year to date" icon={ArrowDownRight} trend={4.8} tone="destructive" />
        <StatCard label="Savings" value={currency(totals.savings)} subtitle="Reserve account" icon={PiggyBank} trend={8.2} tone="success" />
        <StatCard label="Profit" value={currency(totals.profit)} subtitle="After expenses" icon={Wallet} trend={14.1} tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Income vs expense">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueSeries} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Income" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Monthly profit">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueSeries} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="profit" name="Profit" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Expense categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                dataKey="value"
                nameKey="name"
                innerRadius={64}
                outerRadius={104}
                paddingAngle={3}
              >
                {expenseCategories.map((c, i) => (
                  <Cell key={c.name} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Recent expenses">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                    No expenses recorded yet. Click <strong>Add expense</strong> to get started.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.category}</TableCell>
                    <TableCell className="text-muted-foreground">{e.label}</TableCell>
                    <TableCell className="text-muted-foreground">{e.date}</TableCell>
                    <TableCell className="text-right">{currency(e.amount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
