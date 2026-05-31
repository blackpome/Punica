"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateOrganizationAction,
  type ActionState,
} from "@/app/dashboard/organization/actions";

export function OrgProfileForm({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateOrganizationAction,
    null,
  );

  return (
    <Card className="border-border/60 bg-card/50">
      <form action={formAction}>
        <CardHeader>
          <CardTitle>Organization profile</CardTitle>
          <CardDescription>
            Update your organization&apos;s name and URL slug.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Organization name</Label>
            <Input id="name" name="name" defaultValue={name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={slug} required />
          </div>

          {state?.error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state?.ok && (
            <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
              Saved.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}
