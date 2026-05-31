import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Building2, Globe2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostureBadge } from "@/components/dashboard/posture-badge";
import { getActiveOrganization, getSession } from "@/lib/session";
import { db } from "@/db";
import { clientCompany } from "@/db/app-schema";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);
  if (!org) redirect("/dashboard");

  const { clientId } = await params;

  const [client] = await db
    .select()
    .from(clientCompany)
    .where(
      and(
        eq(clientCompany.id, clientId),
        eq(clientCompany.organizationId, org.id),
      ),
    )
    .limit(1);

  if (!client) notFound();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft data-icon="inline-start" />
            Back to portfolio
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {org.name} · Client firm
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {client.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              {client.industry}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {client.region}
            </Badge>
            <PostureBadge posture={client.posture} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Run scan</Button>
          <Button>New incident</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="size-4 text-primary" />}
          label="Employees"
          value={client.employees.toLocaleString()}
        />
        <StatCard
          icon={<Building2 className="size-4 text-primary" />}
          label="Open incidents"
          value={String(client.openIncidents)}
        />
        <StatCard
          icon={<Globe2 className="size-4 text-primary" />}
          label="Region"
          value={client.region}
        />
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Compliance scope</CardTitle>
          <CardDescription>
            Frameworks {org.name} actively manages for {client.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {client.complianceFrameworks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {client.complianceFrameworks.map((f) => (
                <Badge key={f} variant="secondary" className="rounded-full">
                  {f}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No frameworks configured yet.
            </p>
          )}
          <Separator className="my-6" />
          <p className="text-sm text-muted-foreground">
            Detailed control mapping, evidence collection, and audit trails
            will appear here as backend services come online.
          </p>
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
