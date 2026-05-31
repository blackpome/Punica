"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  SEVERITIES,
  VULN_STATUSES,
  type Severity,
  type VulnStatus,
} from "@/lib/mock-security";

const STATUS_LABEL: Record<VulnStatus, string> = {
  open: "Open",
  confirmed: "Confirmed",
  remediated: "Remediated",
  "risk-accepted": "Risk accepted",
};

const NONE = "__none__";

export default function NewVulnPage() {
  const router = useRouter();
  const { firmId, firmName, addVuln } = useVulns();
  const { assets } = useAssets();
  const base = `/dashboard/clients/${firmId}/vulnerabilities`;
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) {
      setError("A vulnerability name is required.");
      return;
    }
    const assetId = String(form.get("assetId") ?? NONE);
    addVuln({
      name,
      severity: String(form.get("severity") ?? "medium") as Severity,
      status: String(form.get("status") ?? "open") as VulnStatus,
      host: String(form.get("host") ?? "").trim() || "—",
      service: String(form.get("service") ?? "").trim() || "—",
      cve: String(form.get("cve") ?? "").trim() || undefined,
      description: String(form.get("description") ?? "").trim() || undefined,
      assetId: assetId === NONE ? undefined : assetId,
    });
    router.push(`${base}/list`);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.push(`${base}/list`)}>
          <ArrowLeft data-icon="inline-start" />
          Back to findings
        </Button>
      </div>

      <Card className="border-border/60 bg-card/50">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Add vulnerability</CardTitle>
            <CardDescription>
              Manually record a finding for {firmName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2 md:col-span-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="SQL Injection in /login"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="severity">Severity</Label>
                <Select name="severity" defaultValue="medium">
                  <SelectTrigger id="severity" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SEVERITIES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="open">
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {VULN_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cve">CVE (optional)</Label>
                <Input id="cve" name="cve" placeholder="CVE-2024-3094" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="host">Host / Asset</Label>
                <Input id="host" name="host" placeholder="10.0.2.14" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="service">Service / Port</Label>
                <Input id="service" name="service" placeholder="443/tcp" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="assetId">Mapped asset</Label>
                <Select name="assetId" defaultValue={NONE}>
                  <SelectTrigger id="assetId" className="w-full">
                    <SelectValue />
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

              <div className="flex flex-col gap-2 md:col-span-3">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Impact, evidence, and remediation notes…"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`${base}/list`)}
            >
              Cancel
            </Button>
            <Button type="submit">Add finding</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
