import {
  Radar,
  FileCheck2,
  GitBranch,
  Bell,
  Users,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Radar,
    title: "Threat & Vulnerability Management",
    description:
      "Continuously scan client environments, dedupe findings across tools, and triage what actually matters.",
  },
  {
    icon: FileCheck2,
    title: "Compliance Automation",
    description:
      "Map controls to SOC 2, ISO 27001, NIS2, and GDPR. Collect evidence on autopilot per client.",
  },
  {
    icon: GitBranch,
    title: "Incident Response Workflows",
    description:
      "Playbooks, runbooks, and case management — built for teams that respond on behalf of others.",
  },
  {
    icon: Bell,
    title: "Unified Alerting",
    description:
      "Aggregate signals from EDR, SIEM, cloud, and identity. Route alerts to the right responder, fast.",
  },
  {
    icon: Users,
    title: "Multi-Tenant by Design",
    description:
      "Strict isolation between client companies, with shared policies, templates, and reporting.",
  },
  {
    icon: Lock,
    title: "Zero-Trust Access",
    description:
      "Granular RBAC, SSO, and audit trails. Customers see only what they should — nothing more.",
  },
];

export function Features() {
  return (
    <section
      id="platform"
      className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge variant="outline" className="rounded-full">
          The Platform
        </Badge>
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Built for the teams who defend other companies.
        </h2>
        <p className="text-balance text-lg text-muted-foreground">
          Every module is designed around the multi-tenant reality of modern
          security work — your customers, their companies, all the controls in
          between.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/60 bg-card/50 transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
                  <Icon className="size-5 text-primary" />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
