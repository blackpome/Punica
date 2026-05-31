"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bug } from "lucide-react";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAssets } from "@/components/dashboard/assets/asset-store";
import { useVulns } from "@/components/dashboard/vuln/vuln-store";
import {
  AssetStatusBadge,
  ClassificationBadge,
  ValueBadge,
} from "@/components/dashboard/assets/asset-badges";
import {
  SeverityBadge,
  StatusBadge,
} from "@/components/dashboard/vuln/vuln-badges";
import { InlineEnum, InlineText } from "@/components/dashboard/inline-edit";
import {
  ASSET_STATUSES,
  ASSET_VALUES,
  CATEGORY_LABEL,
  CLASSIFICATIONS,
  CLASSIFICATION_LABEL,
  STATUS_LABEL,
} from "@/lib/assets";

const CLASSIFICATION_OPTIONS = CLASSIFICATIONS.map((c) => ({
  value: c,
  label: CLASSIFICATION_LABEL[c],
}));
const VALUE_OPTIONS = ASSET_VALUES.map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));
const STATUS_OPTIONS = ASSET_STATUSES.map((s) => ({
  value: s,
  label: STATUS_LABEL[s],
}));

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams<{ clientId: string; assetId: string }>();
  const base = `/dashboard/clients/${params.clientId}`;
  const { assets, updateAsset, hydrated } = useAssets();
  const { vulns } = useVulns();

  if (!hydrated) return null;

  const asset = assets.find((a) => a.id === params.assetId);
  if (!asset) notFound();

  const mapped = vulns.filter((v) => v.assetId === asset.id);
  const openCount = mapped.filter(
    (v) => v.status === "open" || v.status === "confirmed",
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`${base}/assets/inventory`)}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to inventory
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <InlineText
          value={asset.name}
          onChange={(name) => name && updateAsset(asset.id, { name })}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {CATEGORY_LABEL[asset.category]}
          </span>
          <InlineEnum
            value={asset.classification}
            options={CLASSIFICATION_OPTIONS}
            onChange={(classification) =>
              updateAsset(asset.id, { classification })
            }
          >
            <ClassificationBadge classification={asset.classification} />
          </InlineEnum>
          <InlineEnum
            value={asset.value}
            options={VALUE_OPTIONS}
            onChange={(value) => updateAsset(asset.id, { value })}
          >
            <ValueBadge value={asset.value} />
          </InlineEnum>
          <InlineEnum
            value={asset.status}
            options={STATUS_OPTIONS}
            onChange={(status) => updateAsset(asset.id, { status })}
          >
            <AssetStatusBadge status={asset.status} />
          </InlineEnum>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DetailField label="Identifier">
          <InlineText
            value={asset.identifier}
            onChange={(identifier) => updateAsset(asset.id, { identifier })}
            mono
          />
        </DetailField>
        <DetailField label="Owner">
          <InlineText
            value={asset.owner}
            onChange={(owner) => owner && updateAsset(asset.id, { owner })}
          />
        </DetailField>
        <DetailField label="Open findings">
          <span>{openCount}</span>
        </DetailField>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Handling &amp; protection</CardTitle>
        </CardHeader>
        <CardContent>
          <InlineText
            value={asset.handling ?? ""}
            onChange={(handling) =>
              updateAsset(asset.id, { handling: handling || undefined })
            }
            placeholder="Add handling & protection requirements…"
            className="text-sm text-muted-foreground"
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="size-5 text-primary" />
            Mapped vulnerabilities
          </CardTitle>
          <CardDescription>
            Findings affecting this asset ({mapped.length}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mapped.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bug />
                </EmptyMedia>
                <EmptyTitle>No mapped findings</EmptyTitle>
                <EmptyDescription>
                  Map a vulnerability to this asset from the vulnerability
                  detail page.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vulnerability</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mapped.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={v.severity} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`${base}/vulnerabilities/${v.id}`}>
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

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card/50 p-4">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
