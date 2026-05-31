import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/site/logo";
import { getSession, listUserOrganizations } from "@/lib/session";
import { auth } from "@/lib/auth";
import { CreateOrgForm } from "./create-org-form";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // If the user already belongs to an org (invited member), set it active
  // and send them straight to the dashboard — no need to create one.
  const orgs = await listUserOrganizations().catch(() => [] as { id: string }[]);
  const firstOrg = Array.isArray(orgs) ? (orgs as { id: string }[])[0] : null;
  if (firstOrg) {
    await auth.api
      .setActiveOrganization({
        headers: await headers(),
        body: { organizationId: firstOrg.id },
      })
      .catch(() => null);
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh flex-1 items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, oklch(1 0 0 / 0.08), transparent 70%)",
        }}
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Create your workspace</CardTitle>
            <CardDescription>
              Your workspace is where you manage client firms, vulnerabilities,
              and assets. You can rename it any time from settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrgForm userName={session.user.name} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
