"use server";

import { headers } from "next/headers";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  memberFirmAccess,
  invitationFirmAccess,
  clientCompany,
} from "@/db/app-schema";
import { invitation } from "@/db/auth-schema";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const h = await headers();
  const org = await auth.api.getFullOrganization({ headers: h }).catch(() => null);
  if (!org) throw new Error("No active organization");

  const session = await auth.api.getSession({ headers: h });
  if (!session) throw new Error("Unauthorized");

  const me = (org as { members?: { userId: string; role: string }[] })
    .members
    ?.find((m) => m.userId === session.user.id);
  if (!me || (me.role !== "owner" && me.role !== "admin"))
    throw new Error("Admin required");

  return { orgId: org.id, session };
}

export async function grantFirmAccess(userId: string, clientId: string) {
  const { orgId } = await requireAdmin();

  // Verify the client belongs to this org
  const [client] = await db
    .select({ id: clientCompany.id })
    .from(clientCompany)
    .where(and(eq(clientCompany.id, clientId), eq(clientCompany.organizationId, orgId)))
    .limit(1);
  if (!client) throw new Error("Client not found");

  await db
    .insert(memberFirmAccess)
    .values({ id: crypto.randomUUID(), userId, clientId, organizationId: orgId })
    .onConflictDoNothing();

  revalidatePath("/dashboard/organization/members");
}

export async function revokeFirmAccess(userId: string, clientId: string) {
  const { orgId } = await requireAdmin();
  await db
    .delete(memberFirmAccess)
    .where(
      and(
        eq(memberFirmAccess.userId, userId),
        eq(memberFirmAccess.clientId, clientId),
        eq(memberFirmAccess.organizationId, orgId),
      ),
    );
  revalidatePath("/dashboard/organization/members");
}

// Called by inviteMemberAction after better-auth creates the invitation.
export async function setInvitationFirmAccess(
  invitationId: string,
  clientIds: string[],
) {
  if (!clientIds.length) return;
  await db
    .insert(invitationFirmAccess)
    .values(
      clientIds.map((clientId) => ({
        id: crypto.randomUUID(),
        invitationId,
        clientId,
      })),
    )
    .onConflictDoNothing();
}

// Migrate pending invitation firm access → member firm access.
// Called on dashboard load for the current user after they accept an invitation.
export async function migratePendingFirmAccess() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return;

  const org = await auth.api.getFullOrganization({ headers: h }).catch(() => null);
  if (!org) return;

  const email = session.user.email;

  // Find accepted invitations for this email in this org
  const invitations = await db
    .select({ id: invitation.id })
    .from(invitation)
    .where(
      and(
        eq(invitation.email, email),
        eq(invitation.organizationId, org.id),
        eq(invitation.status, "accepted"),
      ),
    );

  if (!invitations.length) return;

  const invitationIds = invitations.map((i) => i.id);
  const pending = await db
    .select({ id: invitationFirmAccess.id, clientId: invitationFirmAccess.clientId })
    .from(invitationFirmAccess)
    .where(inArray(invitationFirmAccess.invitationId, invitationIds));

  if (!pending.length) return;

  // Check which ones already exist as member access
  const existing = await db
    .select({ clientId: memberFirmAccess.clientId })
    .from(memberFirmAccess)
    .where(
      and(
        eq(memberFirmAccess.userId, session.user.id),
        eq(memberFirmAccess.organizationId, org.id),
      ),
    );
  const existingSet = new Set(existing.map((r) => r.clientId));

  const toGrant = pending.filter((p) => !existingSet.has(p.clientId));
  if (!toGrant.length) return;

  await db.insert(memberFirmAccess).values(
    toGrant.map((p) => ({
      id: crypto.randomUUID(),
      userId: session.user.id,
      clientId: p.clientId,
      organizationId: org.id,
    })),
  );

  // Clean up migrated records
  await db
    .delete(invitationFirmAccess)
    .where(
      inArray(
        invitationFirmAccess.id,
        pending.map((p) => p.id),
      ),
    );
}
