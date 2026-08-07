import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FounderOS" },
      { name: "description", content: "Studio profile, billing defaults, appearance and notification preferences for FounderOS." },
      { property: "og:title", content: "Settings — FounderOS" },
      { property: "og:description", content: "Configure your studio profile, currency and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);

  const [formData, setFormData] = useState(profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  if (!mounted) {
    return null; // Or a loading skeleton
  }

  const handleSave = () => {
    setProfile(formData);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Preferences for your studio workspace." />

      <SectionCard title="Studio profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="studio">Studio name</Label>
            <Input id="studio" value={formData.studioName} onChange={e => setFormData({...formData, studioName: e.target.value})} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="currency">Default currency</Label>
            <Input id="currency" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} />
          </div>
        </div>
        <Button className="mt-5" onClick={handleSave}>
          Save changes
        </Button>
      </SectionCard>

      <SectionCard title="Preferences">
        <div className="space-y-1">
          <Row
            title="Dark mode"
            description="Switch the workspace to a low-light theme."
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <Separator />
          <Row title="Overdue payment alerts" description="Notify me when an invoice passes its due date." defaultChecked />
          <Separator />
          <Row title="Weekly summary email" description="A Monday digest of revenue, tasks and deadlines." defaultChecked />
          <Separator />
          <Row title="Deadline reminders" description="Remind me 3 days before a project deadline." />
        </div>
      </SectionCard>
    </div>
  );
}

function Row({
  title,
  description,
  checked,
  defaultChecked,
  onChange,
}: {
  title: string;
  description: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {checked === undefined ? (
        <Switch defaultChecked={defaultChecked ?? false} onCheckedChange={() => { toast("Preference updated"); }} />
      ) : (
        <Switch checked={checked} onCheckedChange={() => onChange?.()} />
      )}
    </div>
  );
}
