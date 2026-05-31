"use client";

import { useState, useTransition } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { grantFirmAccess, revokeFirmAccess } from "@/app/actions/access";

type Firm = { id: string; name: string };

export function MemberFirmAccess({
  userId,
  allFirms,
  grantedIds,
  readonly,
}: {
  userId: string;
  allFirms: Firm[];
  grantedIds: string[];
  readonly: boolean;
}) {
  const [granted, setGranted] = useState<Set<string>>(new Set(grantedIds));
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const grantedFirms = allFirms.filter((f) => granted.has(f.id));

  function toggle(firmId: string) {
    const next = new Set(granted);
    if (next.has(firmId)) {
      next.delete(firmId);
      setGranted(next);
      startTransition(() => revokeFirmAccess(userId, firmId));
    } else {
      next.add(firmId);
      setGranted(next);
      startTransition(() => grantFirmAccess(userId, firmId));
    }
  }

  if (readonly) {
    return grantedFirms.length === 0 ? (
      <span className="text-xs text-muted-foreground">No access</span>
    ) : (
      <div className="flex flex-wrap gap-1">
        {grantedFirms.map((f) => (
          <Badge key={f.id} variant="secondary" className="rounded-full text-xs">
            {f.name}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {grantedFirms.map((f) => (
        <Badge
          key={f.id}
          variant="secondary"
          className="flex items-center gap-1 rounded-full text-xs"
        >
          {f.name}
          <button
            type="button"
            disabled={pending}
            onClick={() => toggle(f.id)}
            className="ml-0.5 rounded-full opacity-60 hover:opacity-100 disabled:opacity-30"
          >
            <X className="size-2.5" />
          </button>
        </Badge>
      ))}

      {allFirms.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              className="h-6 gap-1 rounded-full px-2 text-xs"
            >
              Edit
              <ChevronsUpDown className="size-3 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-52 p-1">
            {allFirms.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id)}
                disabled={pending}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
              >
                <Check
                  className={cn(
                    "size-4 shrink-0",
                    granted.has(f.id) ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}

      {grantedFirms.length === 0 && allFirms.length === 0 && (
        <span className="text-xs text-muted-foreground">No firms yet</span>
      )}
      {grantedFirms.length === 0 && allFirms.length > 0 && !open && (
        <span className="text-xs text-muted-foreground">No access —</span>
      )}
    </div>
  );
}
