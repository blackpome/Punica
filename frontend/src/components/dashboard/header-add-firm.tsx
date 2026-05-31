"use client";

import { usePathname } from "next/navigation";
import { AddClientDialog } from "@/components/dashboard/add-client-dialog";

export function HeaderAddFirm() {
  const pathname = usePathname();

  // Only show in the main organization area — not inside a specific firm.
  if (/^\/dashboard\/clients\/[^/]+/.test(pathname)) return null;

  return <AddClientDialog />;
}
