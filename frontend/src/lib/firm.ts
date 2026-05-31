import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { clientCompany, memberFirmAccess } from "@/db/app-schema";
import { auth } from "@/lib/auth";

export async function getFirm(clientId: string) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h }).catch(() => null);
  if (!session) return null;

  const org = await auth.api.getFullOrganization({ headers: h }).catch(() => null);
  if (!org) return null;

  // Verify the client belongs to this org
  const [firm] = await db
    .select()
    .from(clientCompany)
    .where(
      and(
        eq(clientCompany.id, clientId),
        eq(clientCompany.organizationId, org.id),
      ),
    )
    .limit(1);
  if (!firm) return null;

  // Owners and admins have unrestricted access to all firms
  const me = (org as { members?: { userId: string; role: string }[] })
    .members
    ?.find((m) => m.userId === session.user.id);
  const role = me?.role ?? "member";
  if (role === "owner" || role === "admin") return firm;

  // Regular members: check firm-level access grant
  const [access] = await db
    .select({ id: memberFirmAccess.id })
    .from(memberFirmAccess)
    .where(
      and(
        eq(memberFirmAccess.userId, session.user.id),
        eq(memberFirmAccess.clientId, clientId),
      ),
    )
    .limit(1);

  return access ? firm : null;
}

// Returns only the firms the current user is allowed to see in the sidebar.
export async function getAccessibleFirms(orgId: string) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h }).catch(() => null);
  if (!session) return [];

  const org = await auth.api.getFullOrganization({ headers: h }).catch(() => null);
  if (!org) return [];

  const allFirms = await db
    .select({ id: clientCompany.id, name: clientCompany.name })
    .from(clientCompany)
    .where(eq(clientCompany.organizationId, orgId));

  const me = (org as { members?: { userId: string; role: string }[] })
    .members
    ?.find((m) => m.userId === session.user.id);
  const role = me?.role ?? "member";
  if (role === "owner" || role === "admin") return allFirms;

  const rows = await db
    .select({ clientId: memberFirmAccess.clientId })
    .from(memberFirmAccess)
    .where(
      and(
        eq(memberFirmAccess.userId, session.user.id),
        eq(memberFirmAccess.organizationId, orgId),
      ),
    );

  const allowed = new Set(rows.map((r) => r.clientId));
  return allFirms.filter((f) => allowed.has(f.id));
}
