"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { clientCompany } from "@/db/app-schema";
import { getActiveOrganization, getSession } from "@/lib/session";

const VALID_POSTURES = ["strong", "moderate", "at-risk"] as const;
type Posture = (typeof VALID_POSTURES)[number];

export type AddClientState = { error?: string; ok?: boolean } | null;

export async function addClientAction(
  _prev: AddClientState,
  formData: FormData,
): Promise<AddClientState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const org = await getActiveOrganization().catch(() => null);
  if (!org) return { error: "No active workspace." };

  const name = String(formData.get("name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const employees = Number(formData.get("employees") ?? 0);
  const postureRaw = String(formData.get("posture") ?? "moderate");
  const posture: Posture = VALID_POSTURES.includes(postureRaw as Posture)
    ? (postureRaw as Posture)
    : "moderate";
  const frameworksRaw = String(formData.get("frameworks") ?? "");
  const complianceFrameworks = frameworksRaw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  if (!name || !industry || !region) {
    return { error: "Name, industry, and region are required." };
  }

  await db.insert(clientCompany).values({
    id: randomUUID(),
    organizationId: org.id,
    name,
    industry,
    region,
    employees: Number.isFinite(employees) ? employees : 0,
    openIncidents: 0,
    posture,
    complianceFrameworks,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
