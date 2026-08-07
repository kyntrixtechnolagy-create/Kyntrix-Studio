export type Status = "active" | "completed" | "on-hold" | "planning";
export type PaymentStatus = "paid" | "partial" | "pending" | "overdue";
export type Priority = "high" | "medium" | "low";
export type TaskColumn = "todo" | "in-progress" | "review" | "completed";

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  activeProjects: number;
  pendingAmount: number;
  status: "active" | "inactive" | "lead";
  since: string;
}

export interface ProjectModule {
  name: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  client: string;
  price: number;
  advance: number;
  progress: number;
  status: Status;
  deadline: string;
  startedAt: string;
  description: string;
  modules: ProjectModule[];
  requirements: string[];
  notes: string[];
  attachments: { name: string; size: string; type: string }[];
  timeline: { label: string; date: string; done: boolean }[];
}

export interface Payment {
  id: string;
  client: string;
  project: string;
  total: number;
  paid: number;
  dueDate: string;
  status: PaymentStatus;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  time: string;
  dueDate: string;
  column: TaskColumn;
  done: boolean;
  today: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "deadline" | "payment" | "task";
  time: string;
}

export interface Expense {
  id: string;
  category: "Hosting" | "AI APIs" | "Domains" | "Office" | "Food" | "Travel" | "Other";
  label: string;
  amount: number;
  date: string;
}

export interface Doc {
  id: string;
  name: string;
  category: "Quotations" | "Invoices" | "Agreements" | "Requirement Docs" | "PDFs" | "Images";
  size: string;
  updated: string;
}

export interface Idea {
  id: string;
  title: string;
  body: string;
  category: "SaaS Ideas" | "Client Requests" | "Feature Ideas" | "Future Plans";
  createdAt: string;
}

const clientSeed: [string, string, Client["status"]][] = [
  ["Aarav Mehta", "Northwind Labs", "active"],
  ["Sofia Almeida", "Camber Studio", "active"],
  ["Liam Novak", "Orbit Freight", "active"],
  ["Priya Raghavan", "Kalpa Health", "active"],
  ["Daniel Okafor", "Lumen Retail", "active"],
  ["Hana Sato", "Kiri Ceramics", "inactive"],
  ["Marcus Feld", "Feld & Sons", "active"],
  ["Elena Rossi", "Verde Hospitality", "lead"],
  ["Noah Bergman", "Tidewater Legal", "active"],
  ["Zara Haddad", "Souk Commerce", "active"],
  ["Tom Whitfield", "Halcyon Fitness", "inactive"],
  ["Ines Duarte", "Marea Travel", "lead"],
  ["Kenji Mori", "Mori Robotics", "active"],
  ["Amara Diallo", "Baobab Learning", "active"],
  ["Owen Clarke", "Clarke Property", "lead"],
];

export const clients: Client[] = clientSeed.map(([name, company, status], i) => ({
  id: `c${i + 1}`,
  name,
  company,
  phone: `+1 (415) 555-0${(120 + i * 7).toString().padStart(3, "0")}`,
  email: `${name.split(" ")[0]!.toLowerCase()}@${company.split(" ")[0]!.toLowerCase()}.com`,
  activeProjects: status === "active" ? ((i % 3) + 1) : 0,
  pendingAmount: status === "lead" ? 0 : (i % 5) * 1450 + 900,
  status,
  since: `20${22 + (i % 4)}-0${(i % 9) + 1}-1${i % 9}`,
}));

const projectNames = [
  "Northwind CRM Revamp",
  "Camber Portfolio Site",
  "Orbit Fleet Dashboard",
  "Kalpa Patient Portal",
  "Lumen POS Integration",
  "Kiri Storefront",
  "Feld Invoicing Suite",
  "Verde Booking Engine",
  "Tidewater Case Tracker",
  "Souk Marketplace v2",
  "Halcyon Coach App",
  "Marea Trip Planner",
  "Mori Telemetry Console",
  "Baobab Course Player",
  "Clarke Listings Portal",
  "Northwind Analytics Add-on",
  "Camber Brand Microsite",
  "Orbit Driver Mobile UI",
  "Kalpa Billing Module",
  "Souk Vendor Payouts",
];

const statuses: Status[] = ["active", "completed", "on-hold", "planning"];

export const projects: Project[] = projectNames.map((name, i) => {
  const client = clients[i % clients.length]!;
  const status = statuses[i % 4 === 3 && i % 7 !== 0 ? 0 : i % 4]!;
  const price = 4500 + ((i * 1730) % 22000);
  const advance = status === "completed" ? price : Math.round(price * (0.3 + (i % 4) * 0.15));
  const progress = status === "completed" ? 100 : 15 + ((i * 17) % 80);
  return {
    id: `p${i + 1}`,
    name,
    clientId: client.id,
    client: client.company,
    price,
    advance,
    progress,
    status,
    deadline: `2026-${String(((i % 5) + 8)).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
    startedAt: `2026-0${(i % 5) + 1}-1${i % 9}`,
    description:
      "End-to-end product build covering discovery, UI design, implementation, and launch support.",
    modules: [
      { name: "Discovery & scoping", done: true },
      { name: "Design system", done: progress > 25 },
      { name: "Core application", done: progress > 55 },
      { name: "Integrations", done: progress > 75 },
      { name: "QA & launch", done: progress === 100 },
    ],
    requirements: [
      "Responsive web app with role-based views",
      "Automated email + invoice generation",
      "Export to CSV and PDF",
      "Analytics dashboard with monthly rollups",
    ],
    notes: [
      "Client prefers weekly Thursday check-ins.",
      "Reuse the shared component library from previous engagement.",
      "Hosting billed separately at cost.",
    ],
    attachments: [
      { name: "requirements-v3.pdf", size: "1.4 MB", type: "PDF" },
      { name: "wireframes.fig", size: "8.2 MB", type: "Figma" },
      { name: "contract-signed.pdf", size: "620 KB", type: "PDF" },
    ],
    timeline: [
      { label: "Kickoff call", date: "Mar 04", done: true },
      { label: "Design sign-off", date: "Mar 22", done: progress > 30 },
      { label: "Beta release", date: "Apr 18", done: progress > 60 },
      { label: "Final handover", date: "May 09", done: progress === 100 },
    ],
  };
});

export const payments: Payment[] = projects.slice(0, 14).map((p, i) => {
  const paid = p.advance;
  const pending = p.price - paid;
  const status: PaymentStatus =
    pending === 0 ? "paid" : i % 5 === 0 ? "overdue" : paid > 0 ? "partial" : "pending";
  return {
    id: `pay${i + 1}`,
    client: p.client,
    project: p.name,
    total: p.price,
    paid,
    dueDate: `2026-0${(i % 8) + 1}-${String(((i * 5) % 27) + 1).padStart(2, "0")}`,
    status,
  };
});

const taskTitles = [
  "Fix invoice PDF line spacing",
  "Wire up payout webhook",
  "Review Kalpa billing spec",
  "Ship analytics empty states",
  "Refactor auth guard helpers",
  "Compress hero imagery",
  "Draft Q3 retainer proposal",
  "Migrate staging database",
  "Write onboarding docs",
  "Audit Lighthouse scores",
  "Set up error alerting",
  "Prep Orbit demo build",
  "Update pricing page copy",
  "Clean unused API keys",
  "Plan Souk vendor rollout",
  "Record product walkthrough",
];

const columns: TaskColumn[] = ["todo", "in-progress", "review", "completed"];
const priorities: Priority[] = ["high", "medium", "low"];

export const tasks: Task[] = taskTitles.map((title, i) => ({
  id: `t${i + 1}`,
  title,
  project: projects[i % projects.length]!.name,
  priority: priorities[i % 3]!,
  time: `${9 + (i % 8)}:${i % 2 === 0 ? "00" : "30"} ${9 + (i % 8) >= 12 ? "PM" : "AM"}`,
  dueDate: `2026-08-${String((i % 27) + 1).padStart(2, "0")}`,
  column: columns[i % 4]!,
  done: columns[i % 4] === "completed",
  today: i < 6,
}));

export const revenueSeries = [
  { month: "Jan", revenue: 18400, expenses: 6200, profit: 12200 },
  { month: "Feb", revenue: 22100, expenses: 7100, profit: 15000 },
  { month: "Mar", revenue: 19800, expenses: 6800, profit: 13000 },
  { month: "Apr", revenue: 26400, expenses: 8200, profit: 18200 },
  { month: "May", revenue: 31200, expenses: 9100, profit: 22100 },
  { month: "Jun", revenue: 28700, expenses: 8600, profit: 20100 },
  { month: "Jul", revenue: 34500, expenses: 10200, profit: 24300 },
  { month: "Aug", revenue: 38900, expenses: 11400, profit: 27500 },
];

export const expenseCategories = [
  { name: "Hosting", value: 4200 },
  { name: "AI APIs", value: 6800 },
  { name: "Domains", value: 980 },
  { name: "Office", value: 3100 },
  { name: "Food", value: 1750 },
  { name: "Travel", value: 2400 },
  { name: "Other", value: 1300 },
];

export const expenses: Expense[] = [
  { id: "e1", category: "Hosting", label: "Fly.io + object storage", amount: 412, date: "2026-08-02" },
  { id: "e2", category: "AI APIs", label: "Model inference credits", amount: 1290, date: "2026-08-03" },
  { id: "e3", category: "Domains", label: "3 domain renewals", amount: 64, date: "2026-08-04" },
  { id: "e4", category: "Office", label: "Desk chair upgrade", amount: 480, date: "2026-07-28" },
  { id: "e5", category: "Travel", label: "Client visit — Lisbon", amount: 720, date: "2026-07-21" },
  { id: "e6", category: "Food", label: "Team lunches", amount: 210, date: "2026-07-19" },
  { id: "e7", category: "Other", label: "Accounting software", amount: 96, date: "2026-07-15" },
];

export const clientGrowth = [
  { month: "Jan", clients: 6 },
  { month: "Feb", clients: 7 },
  { month: "Mar", clients: 9 },
  { month: "Apr", clients: 10 },
  { month: "May", clients: 12 },
  { month: "Jun", clients: 13 },
  { month: "Jul", clients: 14 },
  { month: "Aug", clients: 15 },
];

export const productivity = [
  { day: "Mon", hours: 6.5, tasks: 7 },
  { day: "Tue", hours: 7.2, tasks: 9 },
  { day: "Wed", hours: 5.8, tasks: 6 },
  { day: "Thu", hours: 8.1, tasks: 11 },
  { day: "Fri", hours: 6.9, tasks: 8 },
  { day: "Sat", hours: 3.2, tasks: 3 },
  { day: "Sun", hours: 1.4, tasks: 1 },
];

export const completionRate = [
  { name: "Completed", value: 8 },
  { name: "In progress", value: 9 },
  { name: "Planning", value: 3 },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Northwind kickoff call", date: "2026-08-05", type: "meeting", time: "10:00 AM" },
  { id: "ev2", title: "Camber site deadline", date: "2026-08-07", type: "deadline", time: "All day" },
  { id: "ev3", title: "Orbit invoice due", date: "2026-08-09", type: "payment", time: "All day" },
  { id: "ev4", title: "Ship analytics empty states", date: "2026-08-11", type: "task", time: "2:00 PM" },
  { id: "ev5", title: "Kalpa design review", date: "2026-08-12", type: "meeting", time: "3:30 PM" },
  { id: "ev6", title: "Souk payout rollout", date: "2026-08-14", type: "deadline", time: "All day" },
  { id: "ev7", title: "Lumen retainer due", date: "2026-08-18", type: "payment", time: "All day" },
  { id: "ev8", title: "Mori telemetry demo", date: "2026-08-20", type: "meeting", time: "11:00 AM" },
  { id: "ev9", title: "Quarterly tax filing", date: "2026-08-24", type: "task", time: "9:00 AM" },
  { id: "ev10", title: "Baobab handover", date: "2026-08-27", type: "deadline", time: "All day" },
];

export const documents: Doc[] = [
  { id: "d1", name: "Northwind Quotation.pdf", category: "Quotations", size: "240 KB", updated: "2 days ago" },
  { id: "d2", name: "Camber Invoice #1042.pdf", category: "Invoices", size: "180 KB", updated: "4 days ago" },
  { id: "d3", name: "Orbit MSA Signed.pdf", category: "Agreements", size: "1.1 MB", updated: "1 week ago" },
  { id: "d4", name: "Kalpa Requirements v3.docx", category: "Requirement Docs", size: "520 KB", updated: "1 week ago" },
  { id: "d5", name: "Lumen Scope.pdf", category: "PDFs", size: "760 KB", updated: "2 weeks ago" },
  { id: "d6", name: "Souk Wireframes.png", category: "Images", size: "3.4 MB", updated: "2 weeks ago" },
  { id: "d7", name: "Feld Quotation.pdf", category: "Quotations", size: "210 KB", updated: "3 weeks ago" },
  { id: "d8", name: "Tidewater Invoice #1039.pdf", category: "Invoices", size: "165 KB", updated: "3 weeks ago" },
  { id: "d9", name: "Mori NDA.pdf", category: "Agreements", size: "410 KB", updated: "1 month ago" },
  { id: "d10", name: "Baobab Brief.docx", category: "Requirement Docs", size: "300 KB", updated: "1 month ago" },
  { id: "d11", name: "Brand Assets.png", category: "Images", size: "5.2 MB", updated: "1 month ago" },
  { id: "d12", name: "Retainer Template.pdf", category: "PDFs", size: "120 KB", updated: "2 months ago" },
];

export const ideas: Idea[] = [
  { id: "i1", title: "Invoice autopilot", body: "Detect completed milestones and draft the invoice automatically.", category: "SaaS Ideas", createdAt: "Aug 1" },
  { id: "i2", title: "Client portal", body: "Read-only progress view per client with comment threads.", category: "SaaS Ideas", createdAt: "Jul 27" },
  { id: "i3", title: "Souk: bulk vendor import", body: "Zara asked for CSV vendor onboarding before Q4.", category: "Client Requests", createdAt: "Jul 25" },
  { id: "i4", title: "Kalpa: SMS reminders", body: "Appointment reminders over SMS, opt-in only.", category: "Client Requests", createdAt: "Jul 22" },
  { id: "i5", title: "Command palette everywhere", body: "Cmd+K to jump to any client, project, or invoice.", category: "Feature Ideas", createdAt: "Jul 20" },
  { id: "i6", title: "Time tracking inline", body: "Start a timer directly from a task card.", category: "Feature Ideas", createdAt: "Jul 18" },
  { id: "i7", title: "Productized website sprints", body: "Fixed 2-week scope, fixed price, 4 slots per quarter.", category: "Future Plans", createdAt: "Jul 12" },
  { id: "i8", title: "Hire a part-time designer", body: "Offload UI polish once MRR passes a stable threshold.", category: "Future Plans", createdAt: "Jul 09" },
];

export const currency = (n: number) =>
  `Rs. ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const totals = {
  revenue: revenueSeries.reduce((s, r) => s + r.revenue, 0),
  expenses: revenueSeries.reduce((s, r) => s + r.expenses, 0),
  profit: revenueSeries.reduce((s, r) => s + r.profit, 0),
  pending: payments.reduce((s, p) => s + (p.total - p.paid), 0),
  savings: 68400,
  activeProjects: projects.filter((p) => p.status === "active").length,
  completedProjects: projects.filter((p) => p.status === "completed").length,
  pendingTasks: tasks.filter((t) => !t.done).length,
  newLeads: clients.filter((c) => c.status === "lead").length,
};
