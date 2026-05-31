"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Mail, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard/account", label: "Profile", icon: User },
  {
    href: "/dashboard/organization/general",
    label: "Organization profile",
    icon: Building2,
  },
  { href: "/dashboard/organization/members", label: "Members", icon: Users },
  {
    href: "/dashboard/organization/invitations",
    label: "Invitations",
    icon: Mail,
  },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto md:w-56 md:flex-col">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
