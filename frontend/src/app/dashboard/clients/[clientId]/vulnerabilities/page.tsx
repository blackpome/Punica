"use client";

import Link from "next/link";
import { Bug, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEVERITIES, SEVERITY_COLOR, VULN_STATUSES } from "@/lib/mock-security";
import { cn } from "@/lib/utils";
import { useVulns } from "@/components/dashboard/vuln/vuln-store";
import {
  SeverityBadge,
  StatusBadge,
} from "@/components/dashboard/vuln/vuln-badges";

export default function VulnDashboardPage() {
  const { firmId, firmName, vulns, hydrated } = useVulns();
  const base = `/dashboard/clients/${firmId}/vulnerabilities`;

  const open = vulns.filter(
    (v) => v.status === "open" || v.status === "confirmed",
  ).length;
  const sevCounts = SEVERITIES.map((s) => ({
    s,
    n: vulns.filter((v) => v.severity === s).length,
  }));
  const statusCounts = VULN_STATUSES.map((s) => ({
    s,
    n: vulns.filter((v) => v.status === s).length,
  }));
  const max = Math.max(1, ...sevCounts.map((c) => c.n));
  const recent = vulns.slice(0, 5);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {firmName} · Vulnerability Management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Posture across all findings for {firmName}.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`${base}/new`}>
            <Plus data-icon="inline-start" />
            Add vulnerability
          </Link>
        </Button>
      </div>

      {!hydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Total findings" value={vulns.length} />
            <Stat label="Open / confirmed" value={open} />
            <Stat
              label="Critical"
              value={vulns.filter((v) => v.severity === "critical").length}
              danger
            />
            <Stat
              label="Remediated"
              value={vulns.filter((v) => v.status === "remediated").length}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <h2 className="text-lg font-semibold">By severity</h2>
              </CardHeader>
              <div className="flex flex-col gap-3 px-6 pb-6">
                {sevCounts.map(({ s, n }) => (
                  <div key={s} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
                      <SeverityBadge severity={s} />
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(n / max) * 100}%`,
                          backgroundColor: SEVERITY_COLOR[s].bg,
                        }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm tabular-nums">
                      {n}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <h2 className="text-lg font-semibold">By status</h2>
              </CardHeader>
              <div className="flex flex-col gap-2 px-6 pb-6">
                {statusCounts.map(({ s, n }) => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2"
                  >
                    <StatusBadge status={s} />
                    <span className="text-sm tabular-nums">{n}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Recent findings</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`${base}/list`}>View all</Link>
              </Button>
            </CardHeader>
            <div className="flex flex-col gap-2 px-6 pb-6">
              {recent.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No findings yet.
                </p>
              ) : (
                recent.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Bug className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{v.name}</span>
                    </div>
                    <SeverityBadge severity={v.severity} />
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className={cn(
            "text-3xl font-semibold tabular-nums",
            danger && value > 0 && "text-destructive",
          )}
        >
          {value}
        </div>
      </CardHeader>
    </Card>
  );
}
