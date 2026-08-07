import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, FileText, Image as ImageIcon, FileSignature, Receipt, Upload, File, MoreVertical, Download, Trash2, ExternalLink } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Doc } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — FounderOS" },
      { name: "description", content: "Quotations, invoices, agreements, requirement docs, PDFs and images organised in one grid." },
      { property: "og:title", content: "Documents — FounderOS" },
      { property: "og:description", content: "Every quotation, invoice and agreement in one library." },
    ],
  }),
  component: DocumentsPage,
});

const categories = ["All", "Quotations", "Invoices", "Agreements", "Requirement Docs", "PDFs", "Images"] as const;

const icons: Record<string, typeof FileText> = {
  Quotations: Receipt,
  Invoices: Receipt,
  Agreements: FileSignature,
  "Requirement Docs": FileText,
  PDFs: File,
  Images: ImageIcon,
};

function DocumentsPage() {
  const [tab, setTab] = useState<string>("All");
  const [data, setData] = useState<any[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "PDFs", mimeType: "application/pdf" });

  const loadDocuments = () => {
    fetchFromAPI('/documents')
      .then(res => {
        if (!res?.documents) return;
        const mapped = res.documents.map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.folder || "PDFs",
          size: d.size ? Math.round(d.size / 1024) + " KB" : "Unknown",
          updated: d.updatedAt ? d.updatedAt.substring(0, 10) : "-",
        }));
        setData(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUploadDocument = async () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    try {
      setIsSubmitting(true);
      await fetchFromAPI('/documents', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          folder: formData.category,
          size: Math.floor(Math.random() * 5000000) + 10000, // mock size
          originalName: formData.name,
          mimeType: formData.mimeType,
          path: "/mock-path/" + formData.name
        })
      });
      toast.success("Document uploaded successfully");
      setDialogOpen(false);
      setFormData({ name: "", category: "PDFs", mimeType: "application/pdf" });
      loadDocuments();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await fetchFromAPI(`/documents/${id}`, { method: 'DELETE' });
      toast.success("Document deleted");
      loadDocuments();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document");
    }
  };

  const list = tab === "All" ? data : data.filter((d) => d.category === tab);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Documents"
        description={`${data.length} files across ${categories.length - 1} categories`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>Save a file to your knowledge base.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="dfile">Select File</Label>
                  <Input id="dfile" type="file" onChange={e => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      setFormData({ ...formData, name: file.name, mimeType: file.type || "application/octet-stream" });
                    }
                  }} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dname">File Name</Label>
                  <Input id="dname" placeholder="contract.pdf" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Folder</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All').map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUploadDocument} disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload"}
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

      {list.length === 0 ? (
        <EmptyState title="No documents here yet" description="Upload a file to start this category." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {list.map((d) => {
            const Icon = icons[d.category] || File;
            return (
              <div
                key={d.id}
                className="card-surface group relative flex flex-col items-start p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="absolute right-2 top-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast(`Opening ${d.name}`)}>
                        <ExternalLink className="mr-2 h-4 w-4" /> Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast(`Downloading ${d.name}`)}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteDocument(d.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <button
                  onClick={() => toast(`Opening ${d.name}`)}
                  className="flex flex-col text-left w-full h-full focus-visible:outline-none"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 line-clamp-2 text-sm font-medium pr-6">{d.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.category} · {d.size}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">Updated {d.updated}</p>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
