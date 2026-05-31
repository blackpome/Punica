import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { getFirm } from "@/lib/firm";
import { db } from "@/db";
import { vulnerability, asset } from "@/db/app-schema";
import { AssetProvider } from "@/components/dashboard/assets/asset-store";
import { VulnProvider } from "@/components/dashboard/vuln/vuln-store";
import type { Vulnerability } from "@/lib/mock-security";
import type { Asset } from "@/lib/assets";

function toVuln(row: typeof vulnerability.$inferSelect): Vulnerability {
  return {
    id: row.id,
    name: row.name,
    severity: row.severity,
    host: row.host,
    service: row.service,
    status: row.status,
    cve: row.cve ?? undefined,
    description: row.description ?? undefined,
    assetId: row.assetId ?? undefined,
    notes: row.notes ?? undefined,
    poc: row.poc ?? undefined,
  };
}

function toAsset(row: typeof asset.$inferSelect): Asset {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    identifier: row.identifier,
    owner: row.owner,
    classification: row.classification,
    value: row.value,
    status: row.status,
    handling: row.handling ?? undefined,
  };
}

export default async function FirmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { clientId } = await params;
  const firm = await getFirm(clientId);
  if (!firm) notFound();

  const [vulnRows, assetRows] = await Promise.all([
    db
      .select()
      .from(vulnerability)
      .where(eq(vulnerability.clientId, firm.id))
      .orderBy(vulnerability.createdAt),
    db
      .select()
      .from(asset)
      .where(eq(asset.clientId, firm.id))
      .orderBy(asset.createdAt),
  ]);

  const vulns = vulnRows.map(toVuln);
  const assets = assetRows.map(toAsset);

  return (
    <AssetProvider firmId={firm.id} firmName={firm.name} initialData={assets}>
      <VulnProvider firmId={firm.id} firmName={firm.name} initialData={vulns}>
        {children}
      </VulnProvider>
    </AssetProvider>
  );
}
