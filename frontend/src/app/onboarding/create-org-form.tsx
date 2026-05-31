"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { organization } from "@/lib/auth-client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function CreateOrgForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-derive slug from name unless the user has manually edited it.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await organization.create({ name: name.trim(), slug: slug.trim() });
    if (result.error) {
      setError(result.error.message ?? "Failed to create workspace.");
      setPending(false);
      return;
    }

    const orgId = result.data?.id;
    if (orgId) await organization.setActive({ organizationId: orgId });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="org-name">Workspace name</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`${userName}'s workspace`}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="org-slug">
          URL slug
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (auto-generated)
          </span>
        </Label>
        <div className="flex items-center gap-0">
          <span className="flex h-8 items-center rounded-l-lg border border-r-0 border-input bg-muted px-2.5 text-sm text-muted-foreground select-none">
            punica.security/
          </span>
          <Input
            id="org-slug"
            className="rounded-l-none"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers and hyphens"
            required
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending || !name.trim() || !slug.trim()} className="w-full">
        <Building2 data-icon="inline-start" />
        {pending ? "Creating workspace…" : "Create workspace"}
      </Button>
    </form>
  );
}
