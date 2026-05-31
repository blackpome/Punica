"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, organization } from "@/lib/auth-client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function SignupForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const orgName = String(form.get("organization") ?? "").trim();
    const slug = slugify(orgName) || slugify(email.split("@")[1] ?? "workspace");

    const signupResult = await signUp.email({ name, email, password });
    if (signupResult.error) {
      setError(signupResult.error.message ?? "Sign up failed.");
      setPending(false);
      return;
    }

    const orgResult = await organization.create({ name: orgName, slug });
    if (orgResult.error) {
      setError(
        orgResult.error.message ??
          "Account created but workspace setup failed.",
      );
      setPending(false);
      return;
    }

    const orgId = orgResult.data?.id;
    if (orgId) {
      await organization.setActive({ organizationId: orgId });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="organization">Company / workspace name</Label>
        <Input
          id="organization"
          name="organization"
          placeholder="blackPome"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        <UserPlus data-icon="inline-start" />
        {pending ? "Creating workspace…" : "Create workspace"}
      </Button>
    </form>
  );
}
