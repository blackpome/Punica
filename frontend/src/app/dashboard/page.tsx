import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Building2, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostureBadge } from "@/components/dashboard/posture-badge";
import { getActiveOrganization, getSession } from "@/lib/session";
import { db } from "@/db";
import { clientCompany } from "@/db/app-schema";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);

  if (!org) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          No active workspace
        </h1>
        <p className="text-muted-foreground">
          You are not in an organization yet. Create one to start managing
          client companies.
        </p>
        <Button asChild>
          <Link href="/signup">Create workspace</Link>
        </Button>
      </div>
    );
  }

  const clients = await db
    .select()
    .from(clientCompany)
    .where(eq(clientCompany.organizationId, org.id));

  const totalEmployees = clients.reduce((a, c) => a + c.employees, 0);
  const openIncidents = clients.reduce((a, c) => a + c.openIncidents, 0);
  const atRisk = clients.filter((c) => c.posture === "at-risk").length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome back, {org.name}
        </h1>
        <p className="text-muted-foreground">
          You manage {clients.length} client{" "}
          {clients.length === 1 ? "firm" : "firms"}. Here is the current
          portfolio overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          icon={<Building2 className="size-4 text-primary" />}
          label="Client firms"
          value={String(clients.length)}
        />
        <StatCard
          icon={<Users className="size-4 text-primary" />}
          label="Total protected employees"
          value={totalEmployees.toLocaleString()}
        />
        <StatCard
          icon={<ShieldAlert className="size-4 text-primary" />}
          label="Open incidents"
          value={String(openIncidents)}
        />
        <StatCard
          icon={<ShieldCheck className="size-4 text-primary" />}
          label="At-risk firms"
          value={String(atRisk)}
        />
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Client portfolio</CardTitle>
          <CardDescription>
            Multi-tenant view across every B2B client {org.name} protects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building2 />
                </EmptyMedia>
                <EmptyTitle>No client firms yet</EmptyTitle>
                <EmptyDescription>
                  Use{" "}
                  <span className="font-medium text-foreground">Add firm</span>{" "}
                  in the top bar to add your first client firm and start
                  tracking its security posture.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Open incidents</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Posture</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.industry}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.region}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {client.employees.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {client.openIncidents}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.complianceFrameworks.map((f) => (
                          <Badge
                            key={f}
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <PostureBadge posture={client.posture} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/clients/${client.id}`}>
                          Open
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          {icon}
          {label}
        </div>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
