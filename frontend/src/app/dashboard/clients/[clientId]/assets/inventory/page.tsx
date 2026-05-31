"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Boxes, Plus } from "lucide-react";
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
import { useAssets } from "@/components/dashboard/assets/asset-store";
import {
  AssetStatusBadge,
  ClassificationBadge,
  ValueBadge,
} from "@/components/dashboard/assets/asset-badges";
import { InlineEnum } from "@/components/dashboard/inline-edit";
import {
  ASSET_STATUSES,
  ASSET_VALUES,
  CATEGORY_LABEL,
  CLASSIFICATIONS,
  CLASSIFICATION_LABEL,
  STATUS_LABEL,
  type AssetStatus,
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

export default function AssetInventoryPage() {
  const router = useRouter();
  const { firmId, firmName, assets, updateStatus, updateAsset, removeAsset } =
    useAssets();
  const base = `/dashboard/clients/${firmId}/assets`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{firmName} · Inventory</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Inventory
          </h1>
          <p className="text-muted-foreground">
            Right-click an asset to change its status or remove it.
          </p>
        </div>
        <Button size="sm" onClick={() => router.push(`${base}/new`)}>
          <Plus data-icon="inline-start" />
          Add asset
        </Button>
      </div>

      {assets.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Boxes />
            </EmptyMedia>
            <EmptyTitle>No assets yet</EmptyTitle>
            <EmptyDescription>
              Build your ISO 27001 asset inventory by adding your first asset.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => router.push(`${base}/new`)}>
              <Plus data-icon="inline-start" />
              Add asset
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  {assets.length} asset{assets.length === 1 ? "" : "s"}
                </h2>
              </CardHeader>
              <div className="px-6 pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((a) => (
                      <ContextMenu key={a.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow className="cursor-context-menu">
                            <TableCell className="font-medium">
                              <HoverCard openDelay={150} closeDelay={80}>
                                <HoverCardTrigger asChild>
                                  <Link
                                    href={`${base}/${a.id}`}
                                    className="flex w-fit flex-col"
                                  >
                                    <span className="underline decoration-dotted decoration-muted-foreground/40 underline-offset-4">
                                      {a.name}
                                    </span>
                                    <span className="font-mono text-xs text-muted-foreground">
                                      {a.identifier}
                                    </span>
                                  </Link>
                                </HoverCardTrigger>
                                <HoverCardContent
                                  align="start"
                                  className="w-80"
                                >
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-sm font-semibold">
                                        {a.name}
                                      </span>
                                      <ValueBadge value={a.value} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <Detail
                                        label="Category"
                                        value={CATEGORY_LABEL[a.category]}
                                      />
                                      <Detail label="Owner" value={a.owner} />
                                      <Detail
                                        label="Identifier"
                                        value={a.identifier}
                                        mono
                                      />
                                      <Detail
                                        label="Status"
                                        value={STATUS_LABEL[a.status]}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-xs text-muted-foreground">
                                        Handling &amp; protection
                                      </span>
                                      <p className="text-sm leading-relaxed">
                                        {a.handling ??
                                          "No handling requirements recorded."}
                                      </p>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {CATEGORY_LABEL[a.category]}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {a.owner}
                            </TableCell>
                            <TableCell>
                              <InlineEnum
                                value={a.classification}
                                options={CLASSIFICATION_OPTIONS}
                                onChange={(classification) =>
                                  updateAsset(a.id, { classification })
                                }
                              >
                                <ClassificationBadge
                                  classification={a.classification}
                                />
                              </InlineEnum>
                            </TableCell>
                            <TableCell>
                              <InlineEnum
                                value={a.value}
                                options={VALUE_OPTIONS}
                                onChange={(value) =>
                                  updateAsset(a.id, { value })
                                }
                              >
                                <ValueBadge value={a.value} />
                              </InlineEnum>
                            </TableCell>
                            <TableCell>
                              <InlineEnum
                                value={a.status}
                                options={STATUS_OPTIONS}
                                onChange={(status) => updateStatus(a.id, status)}
                              >
                                <AssetStatusBadge status={a.status} />
                              </InlineEnum>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-52">
                          <ContextMenuLabel className="truncate">
                            {a.name}
                          </ContextMenuLabel>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onSelect={() => router.push(`${base}/${a.id}`)}
                          >
                            Open details
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuGroup>
                            {ASSET_STATUSES.filter((s) => s !== a.status).map(
                              (s) => (
                                <ContextMenuItem
                                  key={s}
                                  onSelect={() => updateStatus(a.id, s)}
                                >
                                  Mark {STATUS_LABEL[s as AssetStatus]}
                                </ContextMenuItem>
                              ),
                            )}
                          </ContextMenuGroup>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            variant="destructive"
                            onSelect={() => removeAsset(a.id)}
                          >
                            Remove asset
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
              Add asset
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
