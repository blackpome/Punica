"use server";

import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { vulnerability, clientCompany } from "@/db/app-schema";
import { auth } from "@/lib/auth";
import type { Vulnerability } from "@/lib/mock-security";

async function verifyClientAccess(clientId: string) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) throw new Error("Unauthorized");

  const org = await auth.api.getFullOrganization({ headers: h });
  if (!org) throw new Error("No active organization");

  const [client] = await db
    .select({ id: clientCompany.id })
    .from(clientCompany)
    .where(
      and(
        eq(clientCompany.id, clientId),
        eq(clientCompany.organizationId, org.id),
      ),
    )
    .limit(1);

  if (!client) throw new Error("Access denied");
}

export async function createVuln(clientId: string, v: Vulnerability) {
  await verifyClientAccess(clientId);
  await db.insert(vulnerability).values({
    id: v.id,
    clientId,
    name: v.name,
    severity: v.severity,
    host: v.host,
    service: v.service,
    status: v.status,
    cve: v.cve ?? null,
    description: v.description ?? null,
    assetId: v.assetId ?? null,
    notes: v.notes ?? null,
    poc: v.poc ?? null,
  });
}

export async function patchVuln(
  clientId: string,
  id: string,
  patch: Partial<Vulnerability>,
) {
  await verifyClientAccess(clientId);

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if ("name" in patch) set.name = patch.name;
  if ("severity" in patch) set.severity = patch.severity;
  if ("host" in patch) set.host = patch.host;
  if ("service" in patch) set.service = patch.service;
  if ("status" in patch) set.status = patch.status;
  if ("cve" in patch) set.cve = patch.cve ?? null;
  if ("description" in patch) set.description = patch.description ?? null;
  if ("assetId" in patch) set.assetId = patch.assetId ?? null;
  if ("notes" in patch) set.notes = patch.notes ?? null;
  if ("poc" in patch) set.poc = patch.poc ?? null;

  await db
    .update(vulnerability)
    .set(set)
    .where(
      and(eq(vulnerability.id, id), eq(vulnerability.clientId, clientId)),
    );
}

export async function destroyVuln(clientId: string, id: string) {
  await verifyClientAccess(clientId);
  await db
    .delete(vulnerability)
    .where(
      and(eq(vulnerability.id, id), eq(vulnerability.clientId, clientId)),
    );
}
