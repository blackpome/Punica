import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getActiveOrganization, getSession } from "@/lib/session";
import { db } from "@/db";
import { clientCompany } from "@/db/app-schema";

// Frontend-only mock billing derived deterministically from each firm.
const PLAN_BY_INDEX = ["Starter", "Growth", "Enterprise"] as const;
const RATE_BY_PLAN: Record<string, number> = {
  Starter: 0,
  Growth: 890,
  Enterprise: 2400,
};

function billingFor(index: number, employees: number) {
  const plan = PLAN_BY_INDEX[index % PLAN_BY_INDEX.length];
  const amount = RATE_BY_PLAN[plan] + Math.round(employees / 100) * 10;
  const status = index % 4 === 0 ? "Overdue" : index % 3 === 0 ? "Pending" : "Paid";
  return { plan, amount, status };
}

export default async function PaymentPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);
  if (!org) redirect("/dashboard");

  const firms = await db
    .select()
    .from(clientCompany)
    .where(eq(clientCompany.organizationId, org.id));

  const rows = firms.map((f, i) => ({ firm: f, ...billingFor(i, f.employees) }));
  const monthlyTotal = rows
    .filter((r) => r.status !== "Overdue")
    .reduce((a, r) => a + r.amount, 0);
  const overdue = rows.filter((r) => r.status === "Overdue").length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Organization</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Payment
        </h1>
        <p className="text-muted-foreground">
          Billing across every client firm {org.name} manages.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Monthly recurring" value={`€${monthlyTotal.toLocaleString()}`} />
        <StatCard label="Billable firms" value={String(rows.length)} />
        <StatCard label="Overdue" value={String(overdue)} />
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <h2 className="text-lg font-semibold">Firm billing</h2>
          <p className="text-sm text-muted-foreground">
            Plan and payment status per firm.
          </p>
        </CardHeader>
        <div className="px-6 pb-6">
          {rows.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CreditCard />
                </EmptyMedia>
                <EmptyTitle>No billable firms yet</EmptyTitle>
                <EmptyDescription>
                  Add a client firm to start tracking billing.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firm</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Monthly</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.firm.id}>
                    <TableCell className="font-medium">{r.firm.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.plan}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      €{r.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          r.status === "Overdue"
                            ? "rounded-full border-destructive/40 bg-destructive/10 text-destructive"
                            : r.status === "Pending"
                              ? "rounded-full border-border bg-muted text-muted-foreground"
                              : "rounded-full border-foreground/30 bg-foreground/10 text-foreground"
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
      </CardHeader>
    </Card>
  );
}
