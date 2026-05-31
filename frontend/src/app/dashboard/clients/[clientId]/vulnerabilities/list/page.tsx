"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bug } from "lucide-react";
import { useVulns } from "@/components/dashboard/vuln/vuln-store";
import { useAssets } from "@/components/dashboard/assets/asset-store";
import {
  SeverityBadge,
  StatusBadge,
} from "@/components/dashboard/vuln/vuln-badges";
import { InlineEnum } from "@/components/dashboard/inline-edit";
import { SEVERITIES, VULN_STATUSES, type VulnStatus } from "@/lib/mock-security";

const SEVERITY_OPTIONS = SEVERITIES.map((s) => ({
  value: s,
  label: s.charAt(0).toUpperCase() + s.slice(1),
}));
const STATUS_OPTIONS = VULN_STATUSES.map((s) => ({
  value: s,
  label: s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
}));

const STATUS_ACTION_LABEL: Record<VulnStatus, string> = {
  open: "Reopen",
  confirmed: "Mark confirmed",
  remediated: "Mark remediated",
  "risk-accepted": "Accept risk",
};

export default function VulnListPage() {
  const router = useRouter();
  const { firmId, firmName, vulns, updateStatus, updateVuln, removeVuln } =
    useVulns();
  const { assets } = useAssets();
  const base = `/dashboard/clients/${firmId}/vulnerabilities`;
  const assetName = (id?: string) =>
    id ? (assets.find((a) => a.id === id)?.name ?? null) : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {firmName} · Findings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Findings
          </h1>
          <p className="text-muted-foreground">
            Right-click a finding to change its status or delete it.
          </p>
        </div>
        <Button size="sm" onClick={() => router.push(`${base}/new`)}>
          <Plus data-icon="inline-start" />
          Add vulnerability
        </Button>
      </div>

      {vulns.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bug />
            </EmptyMedia>
            <EmptyTitle>No findings yet</EmptyTitle>
            <EmptyDescription>
              Manually add a vulnerability to start tracking it.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => router.push(`${base}/new`)}>
              <Plus data-icon="inline-start" />
              Add vulnerability
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  {vulns.length} finding{vulns.length === 1 ? "" : "s"}
                </h2>
              </CardHeader>
              <div className="px-6 pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vulnerability</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vulns.map((v) => (
                      <ContextMenu key={v.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow className="cursor-context-menu">
                            <TableCell className="font-medium">
                              <HoverCard openDelay={150} closeDelay={80}>
                                <HoverCardTrigger asChild>
                                  <Link
                                    href={`${base}/${v.id}`}
                                    className="flex w-fit flex-col"
                                  >
                                    <span className="underline decoration-dotted decoration-muted-foreground/40 underline-offset-4">
                                      {v.name}
                                    </span>
                                    {v.cve && (
                                      <span className="font-mono text-xs text-muted-foreground">
                                        {v.cve}
                                      </span>
                                    )}
                                  </Link>
                                </HoverCardTrigger>
                                <HoverCardContent
                                  align="start"
                                  className="w-80"
                                >
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-sm font-semibold">
                                        {v.name}
                                      </span>
                                      <SeverityBadge severity={v.severity} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <Detail label="Host" value={v.host} mono />
                                      <Detail label="Service" value={v.service} />
                                      <Detail
                                        label="CVE"
                                        value={v.cve ?? "—"}
                                        mono
                                      />
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-muted-foreground">
                                          Status
                                        </span>
                                        <StatusBadge status={v.status} />
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-xs text-muted-foreground">
                                        Description
                                      </span>
                                      <p className="text-sm leading-relaxed">
                                        {v.description ??
                                          "No description provided."}
                                      </p>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </TableCell>
                            <TableCell>
                              <InlineEnum
                                value={v.severity}
                                options={SEVERITY_OPTIONS}
                                onChange={(severity) =>
                                  updateVuln(v.id, { severity })
                                }
                              >
                                <SeverityBadge severity={v.severity} />
                              </InlineEnum>
                            </TableCell>
                            <TableCell>
                              {assetName(v.assetId) ? (
                                <Link
                                  href={`${base.replace(
                                    "/vulnerabilities",
                                    "/assets",
                                  )}/${v.assetId}`}
                                  className="text-sm underline-offset-4 hover:underline"
                                >
                                  {assetName(v.assetId)}
                                </Link>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Unmapped
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {v.host}
                            </TableCell>
                            <TableCell>
                              <InlineEnum
                                value={v.status}
                                options={STATUS_OPTIONS}
                                onChange={(status) => updateStatus(v.id, status)}
                              >
                                <StatusBadge status={v.status} />
                              </InlineEnum>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-52">
                          <ContextMenuLabel className="truncate">
                            {v.name}
                          </ContextMenuLabel>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onSelect={() => router.push(`${base}/${v.id}`)}
                          >
                            Open details
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuGroup>
                            {VULN_STATUSES.filter((s) => s !== v.status).map(
                              (s) => (
                                <ContextMenuItem
                                  key={s}
                                  onSelect={() => updateStatus(v.id, s)}
                                >
                                  {STATUS_ACTION_LABEL[s]}
                                </ContextMenuItem>
                              ),
                            )}
                          </ContextMenuGroup>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            variant="destructive"
                            onSelect={() => removeVuln(v.id)}
                          >
                            Delete finding
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem onSelect={() => router.push(`${base}/new`)}>
              <Plus />
              Add vulnerability
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : undefined}>{value}</span>
    </div>
  );
}
