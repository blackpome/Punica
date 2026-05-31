import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getActiveOrganization, getSession } from "@/lib/session";
import { db } from "@/db";
import { clientCompany, memberFirmAccess } from "@/db/app-schema";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { MemberFirmAccess } from "@/components/dashboard/member-firm-access";
import { removeMemberAction } from "@/app/dashboard/organization/actions";

type OrgMember = {
  id: string;
  role: string;
  userId: string;
  user?: { name?: string | null; email?: string | null } | null;
};

export default async function MembersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);
  if (!org) redirect("/dashboard");

  const members = ((org as { members?: OrgMember[] }).members ?? []) as OrgMember[];

  // Fetch all firms and each member's firm access in one go
  const [allFirms, accessRows] = await Promise.all([
    db
      .select({ id: clientCompany.id, name: clientCompany.name })
      .from(clientCompany)
      .where(eq(clientCompany.organizationId, org.id)),
    members.length
      ? db
          .select({
            userId: memberFirmAccess.userId,
            clientId: memberFirmAccess.clientId,
          })
          .from(memberFirmAccess)
          .where(
            and(
              eq(memberFirmAccess.organizationId, org.id),
              inArray(
                memberFirmAccess.userId,
                members.map((m) => m.userId),
              ),
            ),
          )
      : Promise.resolve([]),
  ]);

  // Group access by userId
  const accessByUser = new Map<string, Set<string>>();
  for (const row of accessRows) {
    if (!accessByUser.has(row.userId)) accessByUser.set(row.userId, new Set());
    accessByUser.get(row.userId)!.add(row.clientId);
  }

  // Determine current user's role (for showing admin controls)
  const myRole =
    members.find((m) => m.userId === session.user.id)?.role ?? "member";
  const isAdmin = myRole === "owner" || myRole === "admin";

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Members</CardTitle>
          <CardDescription>People with access to {org.name}.</CardDescription>
        </div>
        {isAdmin && <InviteMemberDialog firms={allFirms} />}
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No members yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Firm access</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => {
                const isOwnerOrAdmin =
                  m.role === "owner" || m.role === "admin";
                const grantedIds = accessByUser.get(m.userId) ?? new Set();
                const isMe = m.userId === session.user.id;

                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {m.user?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.user?.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full capitalize"
                      >
                        {m.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isOwnerOrAdmin ? (
                        <span className="text-xs text-muted-foreground">
                          All firms
                        </span>
                      ) : (
                        <MemberFirmAccess
                          userId={m.userId}
                          allFirms={allFirms}
                          grantedIds={[...grantedIds]}
                          readonly={!isAdmin || isMe}
                        />
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        {isMe ? (
                          <span className="text-xs text-muted-foreground">
                            You
                          </span>
                        ) : (
                          <form action={removeMemberAction}>
                            <input
                              type="hidden"
                              name="memberIdOrEmail"
                              value={m.id}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </form>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
