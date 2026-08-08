import { Mail, Phone, MoreHorizontal, Building2, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { currency, type Client } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Strips spaces, dashes, brackets from phone and prepends country code if missing
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If it's a 10-digit Indian number, prepend 91
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function openWhatsApp(phone: string, name: string) {
  const num = toWhatsAppNumber(phone);
  const msg = encodeURIComponent(`Hi ${name},`);
  window.open(`https://wa.me/${num}?text=${msg}`, "_blank", "noopener,noreferrer");
}

export function ClientCard({ client, onEdit, onDelete }: { client: Client, onEdit?: (client: Client) => void, onDelete?: (client: Client) => void }) {
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const hasPhone = client.phone && client.phone !== "-";

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
              {hasPhone && (
                <>
                  <DropdownMenuItem
                    onClick={() => openWhatsApp(client.phone, client.name)}
                    className="gap-2"
                  >
                    {/* WhatsApp logo SVG */}
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => window.open(`mailto:${client.email}`, "_blank")}
                className="gap-2"
              >
                <Mail className="h-4 w-4" /> Send email
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
        {hasPhone ? (
          <button
            onClick={() => openWhatsApp(client.phone, client.name)}
            className="flex items-center gap-2 rounded-md px-1 -ml-1 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-[#25D366]/10 hover:text-[#25D366] w-full text-left"
            title={`WhatsApp ${client.name}`}
          >
            {/* WhatsApp logo SVG */}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {client.phone}
          </button>
        ) : (
          <p className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" /> —
          </p>
        )}
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
