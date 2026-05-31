"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm({
  token,
  urlError,
}: {
  token?: string;
  urlError?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === "invalid_token"
      ? "This reset link is invalid or has expired. Please request a new one."
      : null,
  );

  if (!token && !urlError) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-5 text-sm">
        <p className="font-medium text-destructive">Invalid reset link</p>
        <p className="text-muted-foreground">
          This link is missing a reset token.{" "}
          <Link
            href="/forgot-password"
            className="text-foreground underline hover:no-underline"
          >
            Request a new one.
          </Link>
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-6 py-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-5 text-primary" />
        </div>
        <p className="font-medium">Password updated</p>
        <p className="text-sm text-muted-foreground">
          Your password has been reset. You can now sign in.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={() => router.push("/login")}
        >
          Sign in
        </Button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (newPassword !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);

    const { error } = await authClient.$fetch<{ error?: string }>(
      "/reset-password",
      {
        method: "POST",
        body: { newPassword, token: token! },
      },
    );

    if (error) {
      setError(
        "This reset link has expired or is invalid. Please request a new one.",
      );
      setPending(false);
      return;
    }

    setDone(true);
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      {error && (
        <div className="flex flex-col gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <p>{error}</p>
          {error.includes("expired") && (
            <Link
              href="/forgot-password"
              className="font-medium underline hover:no-underline"
            >
              Request a new reset link →
            </Link>
          )}
        </div>
      )}

      <Button type="submit" disabled={pending || !token} className="w-full">
        <KeyRound data-icon="inline-start" />
        {pending ? "Updating…" : "Set new password"}
      </Button>
    </form>
  );
}
