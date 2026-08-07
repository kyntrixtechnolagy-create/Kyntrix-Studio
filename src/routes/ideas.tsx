import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Idea } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: [
      { title: "Ideas — FounderOS" },
      { name: "description", content: "Sticky-note board for SaaS ideas, client requests, feature ideas and future plans." },
      { property: "og:title", content: "Ideas — FounderOS" },
      { property: "og:description", content: "Capture SaaS ideas, client requests and future plans on a sticky board." },
    ],
  }),
  component: IdeasPage,
});

const categories = ["All", "SaaS Ideas", "Client Requests", "Feature Ideas", "Future Plans"] as const;

const noteTone: Record<Idea["category"], string> = {
  "SaaS Ideas": "bg-primary/10 border-primary/20",
  "Client Requests": "bg-warning/15 border-warning/25",
  "Feature Ideas": "bg-success/10 border-success/20",
  "Future Plans": "bg-chart-5/10 border-chart-5/20",
  "Unknown": "bg-muted/10 border-muted/20",
};

function IdeasPage() {
  const [tab, setTab] = useState<string>("All");
  const [data, setData] = useState<any[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", category: "SaaS Ideas", priority: "MEDIUM", tags: "" });

  const loadIdeas = () => {
    fetchFromAPI('/ideas')
      .then(res => {
        if (!res?.ideas) return;
        const mapped = res.ideas.map((i: any) => ({
          id: i.id,
          title: i.title,
          body: i.description || "",
          category: i.category?.name || "Unknown",
          priority: i.priority || "MEDIUM",
          tags: i.tags || "",
          createdAt: i.createdAt ? i.createdAt.substring(0, 10) : "-",
        }));
        setData(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const handleSaveIdea = async () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingIdeaId) {
        await fetchFromAPI(`/ideas/${editingIdeaId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        toast.success("Idea updated successfully");
      } else {
        await fetchFromAPI('/ideas', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success("Idea created successfully");
      }
      setDialogOpen(false);
      setEditingIdeaId(null);
      setFormData({ title: "", description: "", category: "SaaS Ideas", priority: "MEDIUM", tags: "" });
      loadIdeas();
    } catch (err: any) {
      toast.error(err.message || "Failed to save idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (idea: any) => {
    setEditingIdeaId(idea.id);
    setFormData({
      title: idea.title,
      description: idea.body,
      category: idea.category === "Unknown" ? "SaaS Ideas" : idea.category,
      priority: idea.priority || "MEDIUM",
      tags: idea.tags || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      await fetchFromAPI(`/ideas/${id}`, { method: 'DELETE' });
      toast.success("Idea deleted");
      loadIdeas();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete idea");
    }
  };

  const list = tab === "All" ? data : data.filter((i) => i.category === tab);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Ideas"
        description="Everything worth building later, parked in one place."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingIdeaId(null);
                setFormData({ title: "", description: "", category: "SaaS Ideas", priority: "MEDIUM", tags: "" });
              }}>
                <Plus className="mr-1 h-4 w-4" /> New note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIdeaId ? "Edit note" : "New note"}</DialogTitle>
                <DialogDescription>{editingIdeaId ? "Update your idea details." : "Jot down a new idea or client request."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="ititle">Title</Label>
                  <Input id="ititle" placeholder="A great new feature" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All').map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="itags">Tags</Label>
                    <Input id="itags" placeholder="e.g. urgent, ui" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="idesc">Description</Label>
                  <Textarea id="idesc" placeholder="More details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveIdea} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save note"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((idea, i) => (
          <article
            key={idea.id}
            className={cn(
              "relative rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0",
              noteTone[idea.category],
              i % 3 === 0 ? "rotate-[-1deg]" : i % 3 === 1 ? "rotate-[0.6deg]" : "",
            )}
          >
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-black/5 dark:hover:bg-white/10">
                    <MoreHorizontal className="h-4 w-4 opacity-50 transition-opacity hover:opacity-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(idea)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => handleDelete(idea.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="pr-6 text-sm font-semibold">{idea.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{idea.body}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              {idea.category} · {idea.createdAt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
