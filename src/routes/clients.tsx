import { useEffect, useMemo, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { ClientCard } from "@/components/founder/ClientCard";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients — FounderOS" },
      { name: "description", content: "Browse, search and filter every client relationship with pending amounts and active project counts." },
      { property: "og:title", content: "Clients — FounderOS" },
      { property: "og:description", content: "All client relationships, contacts and pending balances in one place." },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClients = () => {
    setLoading(true);
    fetchFromAPI('/clients')
      .then(res => {
        const mapped = res.data.map((c: any) => {
          let totalPending = 0;
          if (c.projects) {
            c.projects.forEach((p: any) => {
              if (p.payments) {
                p.payments.forEach((pay: any) => {
                  totalPending += (pay.amount - pay.advancePaid);
                });
              }
            });
          }
          return {
            id: c.id,
            name: c.name,
            company: c.company || "No Company",
            phone: c.phone || "-",
            email: c.email,
            activeProjects: c._count?.projects || 0,
            pendingAmount: totalPending,
            status: c.projects?.length > 0 ? "active" : "lead",
            since: c.createdAt ? c.createdAt.substring(0, 10) : "-",
          };
        });
        setData(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddClient = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingId) {
        await fetchFromAPI(`/clients/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        });
        toast.success("Client updated successfully");
      } else {
        await fetchFromAPI('/clients', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success("Client added successfully");
      }
      setDialogOpen(false);
      setFormData({ name: "", company: "", email: "", phone: "" });
      setEditingId(null);
      loadClients();
    } catch (err: any) {
      toast.error(err.message || "Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client: any) => {
    setFormData({
      name: client.name,
      company: client.company === "No Company" ? "" : client.company,
      email: client.email,
      phone: client.phone === "-" ? "" : client.phone,
    });
    setEditingId(client.id);
    setDialogOpen(true);
  };

  const handleDelete = async (client: any) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await fetchFromAPI(`/clients/${client.id}`, { method: 'DELETE' });
      toast.success("Client deleted successfully");
      loadClients();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete client");
    }
  };

  const filtered = useMemo(
    () =>
      data.filter(
        (c) =>
          (status === "all" || c.status === status) &&
          (c.name + c.company + c.email).toLowerCase().includes(query.toLowerCase()),
      ),
    [query, status, data],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Clients"
        description={`${data.length} relationships · ${data.filter((c) => c.status === "active").length} active`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            if (!open) {
              setEditingId(null);
              setFormData({ name: "", company: "", email: "", phone: "" });
            }
            setDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" /> Add client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit client" : "Add client"}</DialogTitle>
                <DialogDescription>{editingId ? "Update the client's information." : "Create a new client record."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="cname">Name</Label>
                  <Input id="cname" placeholder="Jane Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="ccompany">Company</Label>
                  <Input id="ccompany" placeholder="Acme Inc." value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cemail">Email</Label>
                  <Input id="cemail" type="email" placeholder="jane@acme.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cphone">Mobile Number</Label>
                  <Input id="cphone" type="tel" placeholder="+1 234 567 890" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddClient} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save client"}
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No clients match"
          description="Try a different search term or clear the status filter."
          action={
            <Button variant="outline" onClick={() => { setQuery(""); setStatus("all"); }}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
