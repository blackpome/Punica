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
import { useAssets } from "@/components/dashboard/assets/asset-store";
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  ASSET_VALUES,
  CLASSIFICATIONS,
  CLASSIFICATION_LABEL,
  STATUS_LABEL,
  type AssetCategory,
  type AssetStatus,
  type AssetValue,
  type Classification,
} from "@/lib/assets";

export default function NewAssetPage() {
  const router = useRouter();
  const { firmId, firmName, addAsset } = useAssets();
  const base = `/dashboard/clients/${firmId}/assets`;
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const owner = String(form.get("owner") ?? "").trim();
    if (!name) return setError("An asset name is required.");
    if (!owner) return setError("ISO 27001 requires every asset to have an owner.");

    addAsset({
      name,
      owner,
      category: String(form.get("category") ?? "hardware") as AssetCategory,
      identifier: String(form.get("identifier") ?? "").trim() || "—",
      classification: String(
        form.get("classification") ?? "internal",
      ) as Classification,
      value: String(form.get("value") ?? "medium") as AssetValue,
      status: String(form.get("status") ?? "active") as AssetStatus,
      handling: String(form.get("handling") ?? "").trim() || undefined,
    });
    router.push(`${base}/inventory`);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`${base}/inventory`)}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to inventory
        </Button>
      </div>

      <Card className="border-border/60 bg-card/50">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Add asset</CardTitle>
            <CardDescription>
              Record an asset in {firmName}&apos;s ISO 27001 inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="name">Asset name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Customer PII database"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="hardware">
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ASSET_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                name="owner"
                required
                placeholder="Data Protection Officer"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="identifier">Identifier / location</Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="hostname · IP · URL · room · ARN"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="classification">Classification</Label>
              <Select name="classification" defaultValue="internal">
                <SelectTrigger id="classification" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CLASSIFICATIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASSIFICATION_LABEL[c]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="value">Value</Label>
              <Select name="value" defaultValue="medium">
                <SelectTrigger id="value" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ASSET_VALUES.map((v) => (
                      <SelectItem key={v} value={v} className="capitalize">
                        {v}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="active">
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ASSET_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-3">
              <Label htmlFor="handling">Handling &amp; protection (optional)</Label>
              <Textarea
                id="handling"
                name="handling"
                rows={3}
                placeholder="Access restrictions, encryption, retention, destruction…"
              />
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive md:col-span-3">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`${base}/inventory`)}
            >
              Cancel
            </Button>
            <Button type="submit">Add asset</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
