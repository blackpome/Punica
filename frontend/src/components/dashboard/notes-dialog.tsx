"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NotesEditor } from "@/components/dashboard/notes-editor";

export function NotesDialog({
  title,
  description,
  value,
  onSave,
  triggerLabel = "Open editor",
}: {
  title: string;
  description?: string;
  value: string;
  onSave: (next: string) => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  // Remount the editor each time the dialog opens so it seeds from the latest
  // saved value.
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil data-icon="inline-start" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex h-[calc(100vh-2rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        {/* Notion-style page header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border/40 bg-background px-8 py-3">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-base font-medium">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-xs">{description}</DialogDescription>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden bg-background">
          {open && <NotesEditor value={value} onSave={onSave} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
