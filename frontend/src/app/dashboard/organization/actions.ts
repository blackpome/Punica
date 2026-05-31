"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { setInvitationFirmAccess } from "@/app/actions/access";

export type ActionState = { error?: string; ok?: boolean } | null;

async function activeOrgId() {
  const org = await auth.api
    .getFullOrganization({ headers: await headers() })
    .catch(() => null);
  return org?.id ?? null;
}

export async function updateOrganizationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const orgId = await activeOrgId();
  if (!orgId) return { error: "No active organization." };

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!name || !slug) return { error: "Name and slug are required." };

  try {
    await auth.api.updateOrganization({
      headers: await headers(),
      body: { organizationId: orgId, data: { name, slug } },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed." };
  }

  revalidatePath("/dashboard/organization/general");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateAccountAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed." };
  }

  revalidatePath("/dashboard/account");
  return { ok: true };
}

export async function inviteMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "member");
  const clientIds = formData.getAll("clientIds").map(String).filter(Boolean);
  if (!email) return { error: "Email is required." };

  let invitationId: string;
  try {
    const result = await auth.api.createInvitation({
      headers: await headers(),
      body: { email, role: role as "owner" | "admin" | "member" },
    });
    invitationId = (result as { id: string }).id;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invite failed." };
  }

  if (clientIds.length) {
    await setInvitationFirmAccess(invitationId, clientIds).catch(() => null);
  }

  revalidatePath("/dashboard/organization/invitations");
  revalidatePath("/dashboard/organization/members");
  return { ok: true };
}

export async function cancelInvitationAction(formData: FormData) {
  const invitationId = String(formData.get("invitationId") ?? "");
  if (!invitationId) return;

  await auth.api
    .cancelInvitation({
      headers: await headers(),
      body: { invitationId },
    })
    .catch(() => null);

  revalidatePath("/dashboard/organization/invitations");
}

export async function removeMemberAction(formData: FormData) {
  const memberIdOrEmail = String(formData.get("memberIdOrEmail") ?? "");
  if (!memberIdOrEmail) return;

  await auth.api
    .removeMember({
      headers: await headers(),
      body: { memberIdOrEmail },
    })
    .catch(() => null);

  revalidatePath("/dashboard/organization/members");
}
