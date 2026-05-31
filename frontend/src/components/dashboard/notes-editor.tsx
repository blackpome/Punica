"use client";

import { Editor } from "@/components/editor";

export function NotesEditor({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  return <Editor value={value} onChange={onSave} />;
}
