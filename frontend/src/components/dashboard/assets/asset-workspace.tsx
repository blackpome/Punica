"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AssetWorkspace({
  firmId,
  children,
}: {
  firmId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/dashboard/clients/${firmId}/assets`;

  const items = [
    { href: base, label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: `${base}/inventory`, label: "Inventory", icon: Boxes },
  ];

  return (
    <div className="flex flex-1">
        <nav className="sticky top-14 flex h-[calc(100dvh-3.5rem)] w-16 shrink-0 flex-col items-center gap-2 bg-transparent py-3 pl-3 pr-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    data-active={isActive}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card/80 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-foreground",
                      "data-[active=true]:border-foreground data-[active=true]:bg-foreground data-[active=true]:text-background",
                    )}
                  >
                    <Icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
