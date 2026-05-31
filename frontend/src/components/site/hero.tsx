import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(1 0 0 / 0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-6 py-24 text-center md:py-32">
        <Badge
          variant="outline"
          className="rounded-full border-border/80 px-4 py-1 text-muted-foreground"
        >
          <span className="mr-2 inline-block size-1.5 rounded-full bg-foreground" />
          Now onboarding security partners
        </Badge>

        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          One control plane to manage cybersecurity across every company you
          protect.
        </h1>

        <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          Punica is the B2B platform for MSSPs, consultancies, and security
          teams. Centralize threats, compliance, and posture for your entire
          portfolio of client companies — without the spreadsheet sprawl.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">
              Create your workspace
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#platform">Explore the platform</Link>
          </Button>
        </div>

        <div className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-3 md:grid-cols-3">
          <HeroStat
            icon={<Building2 className="size-4 text-primary" />}
            label="Multi-tenant"
            value="Manage 100s of client companies from one workspace"
          />
          <HeroStat
            icon={<ShieldCheck className="size-4 text-primary" />}
            label="Unified posture"
            value="SOC 2, ISO 27001, NIS2 controls in one view"
          />
          <HeroStat
            icon={<Activity className="size-4 text-primary" />}
            label="Live telemetry"
            value="Threats, incidents, and remediation in real time"
          />
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 p-4 text-left backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
