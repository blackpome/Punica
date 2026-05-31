"use server";

import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { asset, clientCompany } from "@/db/app-schema";
import { auth } from "@/lib/auth";
import type { Asset } from "@/lib/assets";

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

export async function createAsset(clientId: string, a: Asset) {
  await verifyClientAccess(clientId);
  await db.insert(asset).values({
    id: a.id,
    clientId,
    name: a.name,
    category: a.category,
    identifier: a.identifier,
    owner: a.owner,
    classification: a.classification,
    value: a.value,
    status: a.status,
    handling: a.handling ?? null,
  });
}

export async function patchAsset(
  clientId: string,
  id: string,
  patch: Partial<Asset>,
) {
  await verifyClientAccess(clientId);

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if ("name" in patch) set.name = patch.name;
  if ("category" in patch) set.category = patch.category;
  if ("identifier" in patch) set.identifier = patch.identifier;
  if ("owner" in patch) set.owner = patch.owner;
  if ("classification" in patch) set.classification = patch.classification;
  if ("value" in patch) set.value = patch.value;
  if ("status" in patch) set.status = patch.status;
  if ("handling" in patch) set.handling = patch.handling ?? null;

  await db
    .update(asset)
    .set(set)
    .where(and(eq(asset.id, id), eq(asset.clientId, clientId)));
}

export async function destroyAsset(clientId: string, id: string) {
  await verifyClientAccess(clientId);
  await db
    .delete(asset)
    .where(and(eq(asset.id, id), eq(asset.clientId, clientId)));
}
