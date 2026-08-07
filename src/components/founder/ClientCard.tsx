import { Mail, Phone, MoreHorizontal, Building2, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { currency, type Client } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ClientCard({ client, onEdit, onDelete }: { client: Client, onEdit?: (client: Client) => void, onDelete?: (client: Client) => void }) {
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="card-surface p-5 transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{client.name}</p>
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" /> {client.company}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(client)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(client)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.success(`Opened ${client.name}`)}>
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Archived (demo)")}>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-2 truncate">
          <Mail className="h-3.5 w-3.5" /> {client.email}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" /> {client.phone}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between border-t pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Active projects</p>
          <p className="text-lg font-semibold">{client.activeProjects}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-lg font-semibold">{currency(client.pendingAmount)}</p>
        </div>
        <StatusBadge status={client.status} />
      </div>
    </div>
  );
}
