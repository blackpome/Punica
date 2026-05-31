"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  Bug,
  Building2,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  Mail,
  Settings,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";

type Firm = { id: string; name: string };

const ORG_NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/payment", label: "Payment", icon: CreditCard },
];

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || name.slice(0, 2).toUpperCase()
  );
}

export function AppSidebar({
  userName,
  userEmail,
  organizationName,
  firms,
}: {
  userName: string;
  userEmail: string;
  organizationName: string;
  firms: Firm[];
}) {
  const pathname = usePathname();

  const firmMatch = pathname.match(/^\/dashboard\/clients\/([^/]+)/);
  const activeFirmId = firmMatch?.[1] ?? null;
  const activeFirm = activeFirmId
    ? firms.find((f) => f.id === activeFirmId) ?? null
    : null;

  return (
    <Sidebar collapsible="icon">
      {activeFirm ? (
        <FirmSidebarBody firm={activeFirm} pathname={pathname} />
      ) : (
        <OrgSidebarBody
          organizationName={organizationName}
          pathname={pathname}
        />
      )}

      <UserFooter
        userName={userName}
        userEmail={userEmail}
        organizationName={organizationName}
      />

      <SidebarRail />
    </Sidebar>
  );
}

function OrgSidebarBody({
  organizationName,
  pathname,
}: {
  organizationName: string;
  pathname: string;
}) {
  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={organizationName}
              className="cursor-default hover:bg-transparent active:bg-transparent"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-xs font-semibold">
                {initials(organizationName)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {organizationName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Organization
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ORG_NAV.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

function FirmSidebarBody({
  firm,
  pathname,
}: {
  firm: Firm;
  pathname: string;
}) {
  const base = `/dashboard/clients/${firm.id}`;
  const firmNav = [
    { href: base, label: "Overview", icon: LayoutDashboard, exact: true },
    {
      href: `${base}/assets`,
      label: "Asset Management",
      icon: Boxes,
    },
    {
      href: `${base}/vulnerabilities`,
      label: "Vulnerability Management",
      icon: Bug,
    },
    { href: `${base}/tasks`, label: "Task Manager", icon: ListChecks },
    {
      href: `${base}/architecture`,
      label: "Security Architecture",
      icon: Workflow,
    },
  ];

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={firm.name}
              className="cursor-default hover:bg-transparent active:bg-transparent"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-xs font-semibold">
                {initials(firm.name)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{firm.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  Client firm
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to organization">
              <Link href="/dashboard">
                <ArrowLeft />
                <span>Back to organization</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Firm</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {firmNav.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

function UserFooter({
  userName,
  userEmail,
  organizationName,
}: {
  userName: string;
  userEmail: string;
  organizationName: string;
}) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Help & support" asChild>
            <a
              href="mailto:hello@punica.security"
              className="text-muted-foreground"
            >
              <LifeBuoy />
              <span>Help &amp; support</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                tooltip={userName || userEmail}
                className="data-[state=open]:bg-sidebar-accent"
              >
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold">
                  {initials(userName || userEmail)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span>{userName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account">
                    <Settings />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {organizationName}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/organization/general">
                    <Building2 />
                    Organization profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/organization/members">
                    <Users />
                    Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/organization/invitations">
                    <Mail />
                    Invitations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/organization/members">
                    <UserPlus />
                    Invite people
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut} variant="destructive">
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
