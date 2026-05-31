import { redirect } from "next/navigation";
import { getActiveOrganization, getSession } from "@/lib/session";
import { OrgProfileForm } from "./org-profile-form";

export default async function OrgGeneralPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getActiveOrganization().catch(() => null);
  if (!org) redirect("/dashboard");

  return <OrgProfileForm name={org.name} slug={org.slug} />;
}
