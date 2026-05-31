"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Boxes } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVulns } from "@/components/dashboard/vuln/vuln-store";
import { useAssets } from "@/components/dashboard/assets/asset-store";
import {
  SeverityBadge,
  StatusBadge,
} from "@/components/dashboard/vuln/vuln-badges";
import { InlineEnum, InlineText } from "@/components/dashboard/inline-edit";
import { NotesDialog } from "@/components/dashboard/notes-dialog";
import { CATEGORY_LABEL } from "@/lib/assets";
import { SEVERITIES, VULN_STATUSES } from "@/lib/mock-security";

const NONE = "__none__";

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

export default function VulnDetailPage() {
  const router = useRouter();
  const params = useParams<{ clientId: string; vulnId: string }>();
  const base = `/dashboard/clients/${params.clientId}`;
  const { vulns, setVulnAsset, updateVuln, hydrated } = useVulns();
  const { assets } = useAssets();

  if (!hydrated) return null;

  const vuln = vulns.find((v) => v.id === params.vulnId);
  if (!vuln) notFound();

  const mappedAsset = vuln.assetId
    ? assets.find((a) => a.id === vuln.assetId)
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`${base}/vulnerabilities/list`)}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to findings
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <InlineText
          value={vuln.name}
          onChange={(name) => name && updateVuln(vuln.id, { name })}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <div className="flex flex-wrap items-center gap-2">
          <InlineEnum
            value={vuln.severity}
            options={SEVERITY_OPTIONS}
            onChange={(severity) => updateVuln(vuln.id, { severity })}
          >
            <SeverityBadge severity={vuln.severity} />
          </InlineEnum>
          <InlineEnum
            value={vuln.status}
            options={STATUS_OPTIONS}
            onChange={(status) => updateVuln(vuln.id, { status })}
          >
            <StatusBadge status={vuln.status} />
          </InlineEnum>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DetailField label="Host">
          <InlineText
            value={vuln.host}
            onChange={(host) => updateVuln(vuln.id, { host })}
            mono
          />
        </DetailField>
        <DetailField label="Service">
          <InlineText
            value={vuln.service}
            onChange={(service) => updateVuln(vuln.id, { service })}
          />
        </DetailField>
        <DetailField label="CVE">
          <InlineText
            value={vuln.cve ?? ""}
            onChange={(cve) => updateVuln(vuln.id, { cve: cve || undefined })}
            placeholder="—"
            mono
          />
        </DetailField>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <InlineText
            value={vuln.description ?? ""}
            onChange={(description) =>
              updateVuln(vuln.id, { description: description || undefined })
            }
            placeholder="Add a short description…"
            className="text-sm text-muted-foreground"
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Notes</CardTitle>
            <Badge variant="outline" className="rounded-full">
              Organization only
            </Badge>
          </div>
          <CardDescription>
            Internal working notes. Not shared with the client firm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotesDialog
            title="Notes"
            description="Internal working notes — organization only."
            triggerLabel={vuln.notes ? "Edit notes" : "Add notes"}
            value={vuln.notes ?? ""}
            onSave={(notes) => updateVuln(vuln.id, { notes })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Proof of Concept</CardTitle>
            <Badge variant="outline" className="rounded-full">
              Shared with firm
            </Badge>
          </div>
          <CardDescription>
            Reproduction steps and evidence — visible to the firm. Embed images
            and videos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotesDialog
            title="Proof of Concept"
            description="Reproduction steps & evidence — shared with the firm."
            triggerLabel={vuln.poc ? "Edit PoC" : "Add PoC"}
            value={vuln.poc ?? ""}
            onSave={(poc) => updateVuln(vuln.id, { poc })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="size-5 text-primary" />
            Mapped asset
          </CardTitle>
          <CardDescription>
            Link this finding to the asset it affects.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:max-w-sm">
            <Select
              value={vuln.assetId ?? NONE}
              onValueChange={(val) =>
                setVulnAsset(vuln.id, val === NONE ? undefined : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={NONE}>Unmapped</SelectItem>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {mappedAsset ? (
            <>
              <Separator />
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
                <div className="flex flex-col">
                  <span className="font-medium">{mappedAsset.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABEL[mappedAsset.category]} ·{" "}
                    {mappedAsset.identifier}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`${base}/assets/${mappedAsset.id}`}>
                    View asset
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not mapped to any asset yet.
            </p>
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
