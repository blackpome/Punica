import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveOrganization, getSession } from "@/lib/session";
import { getAccessibleFirms } from "@/lib/firm";
import { migratePendingFirmAccess } from "@/app/actions/access";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { HeaderAddFirm } from "@/components/dashboard/header-add-firm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);

  // Silently migrate any pending invitation firm access for this user.
  if (org) await migratePendingFirmAccess().catch(() => null);

  const firms = org ? await getAccessibleFirms(org.id) : [];

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          userName={session.user.name}
          userEmail={session.user.email}
          organizationName={org?.name ?? "No organization"}
          firms={firms}
        />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <Badge variant="outline" className="rounded-full">
              {org?.name ?? "No organization"}
            </Badge>
            {org && (
              <div className="ml-auto">
                <HeaderAddFirm />
              </div>
            )}
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
