import { Building2, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function CustomerModel() {
  return (
    <section
      id="customers"
      className="border-y border-border/60 bg-card/30"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="rounded-full">
            How Punica is structured
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Customers manage companies. Punica manages the hierarchy.
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Punica is multi-tenant from the data model up. Each Punica
            customer — like blackPome — operates a portfolio of client
            companies. We keep the boundaries clean so your customers stay
            isolated, and your operations stay unified.
          </p>
        </div>

        <Card className="mx-auto mt-14 max-w-5xl overflow-hidden border-border/60 bg-background/60">
          <CardContent className="p-6 md:p-10">
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <HierarchyNode
                icon={<ShieldCheck className="size-5 text-primary" />}
                badge="Platform"
                title="Punica"
                description="The cybersecurity management platform."
              />
              <Connector />
              <HierarchyNode
                icon={<Briefcase className="size-5 text-primary" />}
                badge="Customer"
                title="blackPome"
                description="A security consultancy. One of many Punica customers."
                highlighted
              />
              <Connector />
              <HierarchyNode
                icon={<Building2 className="size-5 text-primary" />}
                badge="Companies (B2B)"
                title="Client portfolio"
                description="Acme Corp, Northwind, Initech — each managed in isolation."
              />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <ModelPoint
                title="Multi-customer"
                body="blackPome is the first Punica customer. The platform is built so any consultancy or MSSP can onboard the same way."
              />
              <ModelPoint
                title="Multi-tenant per customer"
                body="Each customer manages an unbounded number of client companies, with strict data isolation between them."
              />
              <ModelPoint
                title="Shared operations"
                body="Policies, playbooks, and dashboards are reusable across the portfolio without leaking data between tenants."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function HierarchyNode({
  icon,
  badge,
  title,
  description,
  highlighted = false,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-5 ${
        highlighted
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
          : "border-border/60 bg-card/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {badge}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center justify-center text-muted-foreground">
      <ArrowRight className="size-5 rotate-90 md:rotate-0" />
    </div>
  );
}

function ModelPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card/40 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
