"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
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
import { addClientAction, type AddClientState } from "@/app/dashboard/actions";

export function AddClientDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AddClientState, FormData>(
    addClientAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus data-icon="inline-start" />
            Add firm
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a client firm</DialogTitle>
          <DialogDescription>
            Add a B2B client firm your organization will protect. You can edit
            details later.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Firm name</Label>
            <Input id="name" name="name" required placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                required
                placeholder="Manufacturing"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                name="region"
                required
                placeholder="EU-West"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="employees">Employees</Label>
              <Input
                id="employees"
                name="employees"
                type="number"
                min={0}
                defaultValue={0}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="posture">Posture</Label>
              <Select name="posture" defaultValue="moderate">
                <SelectTrigger id="posture">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="at-risk">At risk</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="frameworks">Compliance frameworks</Label>
            <Input
              id="frameworks"
              name="frameworks"
              placeholder="SOC 2, ISO 27001, NIS2"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated.
            </p>
          </div>

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
      {pending ? "Adding…" : "Add firm"}
    </Button>
  );
}
