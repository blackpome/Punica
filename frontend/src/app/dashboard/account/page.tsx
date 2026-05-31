import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SettingsNav } from "@/components/dashboard/settings-nav";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Your profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal account details.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <SettingsNav />
        <div className="flex-1">
          <AccountForm name={session.user.name} email={session.user.email} />
        </div>
      </div>
    </div>
  );
}
