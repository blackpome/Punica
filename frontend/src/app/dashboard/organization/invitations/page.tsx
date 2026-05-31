import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Mail } from "lucide-react";
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getActiveOrganization, getSession } from "@/lib/session";
import { db } from "@/db";
import { clientCompany, invitationFirmAccess } from "@/db/app-schema";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { cancelInvitationAction } from "@/app/dashboard/organization/actions";

type Invitation = {
  id: string;
  email: string;
  role?: string | null;
  status: string;
};

export default async function InvitationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);
  if (!org) redirect("/dashboard");

  const all = ((org as { invitations?: Invitation[] }).invitations ??
    []) as Invitation[];
  const pending = all.filter((i) => i.status === "pending");

  // Fetch firms and pending firm access for each invitation
  const [allFirms, accessRows] = await Promise.all([
    db
      .select({ id: clientCompany.id, name: clientCompany.name })
      .from(clientCompany)
      .where(eq(clientCompany.organizationId, org.id)),
    pending.length
      ? db
          .select({
            invitationId: invitationFirmAccess.invitationId,
            clientId: invitationFirmAccess.clientId,
          })
          .from(invitationFirmAccess)
      : Promise.resolve([]),
  ]);

  const firmById = new Map(allFirms.map((f) => [f.id, f.name]));
  const accessByInvite = new Map<string, string[]>();
  for (const row of accessRows) {
    if (!accessByInvite.has(row.invitationId))
      accessByInvite.set(row.invitationId, []);
    accessByInvite.get(row.invitationId)!.push(row.clientId);
  }

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Invitations</CardTitle>
          <CardDescription>Pending invitations to {org.name}.</CardDescription>
        </div>
        <InviteMemberDialog firms={allFirms} />
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Mail />
              </EmptyMedia>
              <EmptyTitle>No pending invitations</EmptyTitle>
              <EmptyDescription>
                Invite teammates to collaborate in {org.name}.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <InviteMemberDialog firms={allFirms} />
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Firm access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((inv) => {
                const clientIds = accessByInvite.get(inv.id) ?? [];
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full capitalize"
                      >
                        {inv.role ?? "member"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {clientIds.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {clientIds.map((id) => (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="rounded-full text-xs"
                            >
                              {firmById.get(id) ?? id}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="rounded-full capitalize"
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={cancelInvitationAction}>
                        <input
                          type="hidden"
                          name="invitationId"
                          value={inv.id}
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Cancel
                        </Button>
                      </form>
                    </TableCell>
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
