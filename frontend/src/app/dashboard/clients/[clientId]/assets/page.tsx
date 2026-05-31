"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ASSET_CATEGORIES,
  ASSET_VALUES,
  CLASSIFICATIONS,
  CLASSIFICATION_LABEL,
  VALUE_COLOR,
} from "@/lib/assets";
import { useAssets } from "@/components/dashboard/assets/asset-store";
import {
  ClassificationBadge,
  ValueBadge,
} from "@/components/dashboard/assets/asset-badges";

export default function AssetDashboardPage() {
  const { firmId, firmName, assets, hydrated } = useAssets();
  const base = `/dashboard/clients/${firmId}/assets`;

  const active = assets.filter((a) => a.status === "active").length;
  const restricted = assets.filter(
    (a) => a.classification === "restricted",
  ).length;
  const critical = assets.filter((a) => a.value === "critical").length;

  const byCategory = ASSET_CATEGORIES.map((c) => ({
    ...c,
    n: assets.filter((a) => a.category === c.value).length,
  }));
  const byValue = ASSET_VALUES.map((v) => ({
    v,
    n: assets.filter((a) => a.value === v).length,
  }));
  const maxVal = Math.max(1, ...byValue.map((b) => b.n));
  const byClass = CLASSIFICATIONS.map((c) => ({
    c,
    n: assets.filter((a) => a.classification === c).length,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {firmName} · Asset Management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Asset inventory
          </h1>
          <p className="text-muted-foreground">
            ISO 27001 asset inventory for {firmName} — owners, classification,
            and value at a glance.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`${base}/new`}>
            <Plus data-icon="inline-start" />
            Add asset
          </Link>
        </Button>
      </div>

      {!hydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Total assets" value={assets.length} />
            <Stat label="Active" value={active} />
            <Stat label="Restricted" value={restricted} />
            <Stat label="Critical value" value={critical} danger />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <h2 className="text-lg font-semibold">By value</h2>
              </CardHeader>
              <div className="flex flex-col gap-3 px-6 pb-6">
                {byValue.map(({ v, n }) => (
                  <div key={v} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
                      <ValueBadge value={v} />
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(n / maxVal) * 100}%`,
                          backgroundColor: VALUE_COLOR[v].bg,
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
                <h2 className="text-lg font-semibold">By classification</h2>
              </CardHeader>
              <div className="flex flex-col gap-2 px-6 pb-6">
                {byClass.map(({ c, n }) => (
                  <div
                    key={c}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2"
                  >
                    <ClassificationBadge classification={c} />
                    <span className="text-sm tabular-nums">{n}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <h2 className="text-lg font-semibold">By category</h2>
              <p className="text-sm text-muted-foreground">
                ISO 27001 asset types.
              </p>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3 px-6 pb-6 md:grid-cols-4">
              {byCategory.map((c) => (
                <div
                  key={c.value}
                  className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background/40 p-3"
                >
                  <span className="text-2xl font-semibold tabular-nums">
                    {c.n}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c.label}
                  </span>
                </div>
              ))}
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
