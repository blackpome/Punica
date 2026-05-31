import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveOrganization, getSession, listUserOrganizations } from "@/lib/session";
import { getAccessibleFirms } from "@/lib/firm";
import { migratePendingFirmAccess } from "@/app/actions/access";
import { auth } from "@/lib/auth";
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

  let org = await getActiveOrganization().catch(() => null);

  if (!org) {
    // No active org. Check if the user belongs to one (e.g. accepted an invite).
    const orgs = await listUserOrganizations().catch(() => [] as { id: string }[]);
    const firstOrg = Array.isArray(orgs) ? (orgs as { id: string }[])[0] : null;

    if (firstOrg) {
      // Silently set the first membership as active using the server API.
      // nextCookies() in auth.ts allows setting cookies from server context.
      await auth.api
        .setActiveOrganization({
          headers: await headers(),
          body: { organizationId: firstOrg.id },
        })
        .catch(() => null);
      org = await getActiveOrganization().catch(() => null);
    }

    if (!org) redirect("/onboarding");
  }

  // Silently migrate any pending invitation firm access for this user.
  await migratePendingFirmAccess().catch(() => null);

  const firms = await getAccessibleFirms(org.id);

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          userName={session.user.name}
          userEmail={session.user.email}
          organizationName={org.name}
          firms={firms}
        />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <Badge variant="outline" className="rounded-full">
              {org.name}
            </Badge>
            <div className="ml-auto">
              <HeaderAddFirm />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
