import { useEffect, useMemo, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { currency } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — FounderOS" },
      { name: "description", content: "Track every client project: pricing, advance, pending balance, progress, status and deadline." },
      { property: "og:title", content: "Projects — FounderOS" },
      { property: "og:description", content: "A modern project ledger with pricing, progress and deadlines." },
    ],
  }),
  component: ProjectsPage,
});

const PER_PAGE = 10;

function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", clientId: "", price: 0, advance: 0, progress: 0, status: "PLANNING", deadline: "" });
  const [clientsList, setClientsList] = useState<any[]>([]);

  const loadProjects = () => {
    setLoading(true);
    fetchFromAPI('/projects')
      .then(res => {
        if (!res.data || !Array.isArray(res.data)) return;
        const mapped = res.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          clientId: p.clientId,
          client: p.client?.name || "Unknown",
          price: p.payments?.reduce((s: number, pay: any) => s + pay.amount, 0) || 0,
          advance: p.payments?.reduce((s: number, pay: any) => s + pay.advancePaid, 0) || 0,
          progress: p.progress,
          status: p.status.toLowerCase().replace('_', '-'),
          deadline: p.endDate ? p.endDate.substring(0, 10) : "-",
        }));
        setData(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
    fetchFromAPI('/clients').then(res => setClientsList(res.data)).catch(console.error);
  }, []);

  const handleSaveProject = async () => {
    if (!formData.name || !formData.clientId) {
      toast.error("Name and Client are required");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingProjectId) {
        await fetchFromAPI(`/projects/${editingProjectId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: formData.name,
            clientId: formData.clientId,
            status: formData.status,
            endDate: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            progress: formData.progress,
            payments: [{ amount: formData.price, advancePaid: formData.advance, status: 'PENDING' }]
          })
        });
        toast.success("Project updated successfully");
      } else {
        await fetchFromAPI('/projects', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            clientId: formData.clientId,
            status: formData.status,
            endDate: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            progress: formData.progress,
            payments: [{ amount: formData.price, advancePaid: formData.advance, status: 'PENDING' }]
          })
        });
        toast.success("Project created successfully");
      }
      setDialogOpen(false);
      setEditingProjectId(null);
      setFormData({ name: "", clientId: "", price: 0, advance: 0, progress: 0, status: "PLANNING", deadline: "" });
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditingProjectId(p.id);
    setFormData({
      name: p.name,
      clientId: p.clientId || "",
      price: p.price,
      advance: p.advance,
      progress: p.progress,
      status: p.status.toUpperCase().replace("-", "_"),
      deadline: p.deadline === "-" ? "" : p.deadline,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetchFromAPI(`/projects/${id}`, { method: 'DELETE' });
      toast.success("Project deleted");
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  const filtered = useMemo(
    () =>
      data.filter(
        (p) =>
          (status === "all" || p.status === status) &&
          (p.name + p.client).toLowerCase().includes(query.toLowerCase()),
      ),
    [query, status, data],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Projects"
        description={`${data.length} projects · ${currency(data.reduce((s, p) => s + p.price - p.advance, 0))} outstanding`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProjectId(null);
                setFormData({ name: "", clientId: "", price: 0, advance: 0, progress: 0, status: "PLANNING", deadline: "" });
              }}>
                <Plus className="mr-1 h-4 w-4" /> New project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProjectId ? "Edit project" : "Create project"}</DialogTitle>
                <DialogDescription>
                  {editingProjectId ? "Update the details for this project." : "Add a new project for a client."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="pname">Project Name</Label>
                  <Input id="pname" placeholder="Website Redesign" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Client</Label>
                  <Select value={formData.clientId} onValueChange={v => setFormData({ ...formData, clientId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsList.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="pprice">Price (Rs.)</Label>
                    <Input id="pprice" type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="padvance">Advance (Rs.)</Label>
                    <Input id="padvance" type="number" min="0" max={formData.price} value={formData.advance} onChange={e => setFormData({ ...formData, advance: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="pprogress">Progress (%)</Label>
                    <Input id="pprogress" type="number" placeholder="0" min="0" max="100" value={formData.progress || ''} onChange={e => setFormData({ ...formData, progress: Number(e.target.value) })} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANNING">Planning</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ON_HOLD">On hold</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="pdeadline">Deadline</Label>
                  <Input id="pdeadline" type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveProject} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingProjectId ? "Save changes" : "Create project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search projects"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On hold</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Advance</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="w-[150px]">Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="hover:text-primary"
                    >
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.client}</TableCell>
                  <TableCell className="text-right">{currency(p.price)}</TableCell>
                  <TableCell className="text-right text-success">{currency(p.advance)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {currency(p.price - p.advance)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.progress} className="h-1.5" />
                      <span className="w-8 text-xs text-muted-foreground">{p.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.deadline}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(p)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => { e.preventDefault(); setPage(Math.max(1, current - 1)); }}
            />
          </PaginationItem>
          {Array.from({ length: pages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={current === i + 1}
                onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => { e.preventDefault(); setPage(Math.min(pages, current + 1)); }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
