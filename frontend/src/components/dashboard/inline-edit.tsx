"use client";

import { useState } from "react";
import { Check, ChevronDown, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Inline editor for fields with a fixed set of values. Renders the current
 * value (e.g. a badge) as a dropdown trigger; selecting an option commits it.
 */
export function InlineEnum<T extends string>({
  value,
  options,
  onChange,
  children,
  align = "start",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {children}
          <ChevronDown className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=open]:opacity-100" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)}>
            <span className="flex-1">{o.label}</span>
            {o.value === value && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Click-to-edit text field. Shows the value; click (or the pencil) to edit,
 * commits on blur / Enter, cancels on Escape.
 */
export function InlineText({
  value,
  onChange,
  placeholder = "—",
  className,
  mono,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  mono?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft.trim() !== value) onChange(draft.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn("h-8", mono && "font-mono", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md text-left outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        mono && "font-mono",
        className,
      )}
    >
      <span className={value ? undefined : "text-muted-foreground"}>
        {value || placeholder}
      </span>
      <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
