"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inviteMemberAction,
  type ActionState,
} from "@/app/dashboard/organization/actions";

type Firm = { id: string; name: string };

export function InviteMemberDialog({ firms = [] }: { firms?: Firm[] }) {
  const [open, setOpen] = useState(false);
  const [selectedFirms, setSelectedFirms] = useState<Set<string>>(new Set());
  const [state, formAction] = useActionState<ActionState, FormData>(
    inviteMemberAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      setOpen(false);
      setSelectedFirms(new Set());
    }
  }, [state]);

  function toggle(id: string) {
    setSelectedFirms((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus data-icon="inline-start" />
          Invite people
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite people</DialogTitle>
          <DialogDescription>
            Invite a teammate to your organization. Select which client firms
            they can access — admins and owners have full access by default.
          </DialogDescription>
        </DialogHeader>

        <form
          action={(fd) => {
            selectedFirms.forEach((id) => fd.append("clientIds", id));
            formAction(fd);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              required
              placeholder="teammate@company.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select name="role" defaultValue="member">
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {firms.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Client access</Label>
              <p className="text-xs text-muted-foreground">
                Admins and owners can see all firms. For members, select which
                firms they can access.
              </p>
              <div className="flex max-h-48 flex-col gap-2 overflow-y-auto rounded-md border border-border/60 bg-muted/30 p-3">
                {firms.map((f) => (
                  <label
                    key={f.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-0.5 hover:bg-accent"
                  >
                    <Checkbox
                      checked={selectedFirms.has(f.id)}
                      onCheckedChange={() => toggle(f.id)}
                    />
                    <span className="text-sm">{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {state?.error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send invite"}
    </Button>
  );
}
