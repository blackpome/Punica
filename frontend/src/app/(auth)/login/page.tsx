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
import { getSession } from "@/lib/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

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
            <CardTitle className="text-2xl">Sign in to Punica</CardTitle>
            <CardDescription>
              Welcome back. Access your customer workspace and manage your
              client companies.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <LoginForm />

            <p className="text-center text-sm text-muted-foreground">
              New to Punica?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
