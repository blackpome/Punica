import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PLANS = [
  {
    name: "Starter",
    price: "€0",
    cadence: "for 30 days",
    description:
      "Evaluate Punica with up to 3 client companies. All core modules included.",
    features: [
      "Up to 3 client companies",
      "Threat & vulnerability dashboard",
      "Compliance templates (SOC 2, ISO 27001)",
      "Email support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "€890",
    cadence: "per customer / month",
    description:
      "For consultancies managing a growing portfolio of client companies.",
    features: [
      "Up to 25 client companies",
      "Incident response workflows",
      "Custom playbooks & runbooks",
      "SSO + RBAC",
      "Priority support",
    ],
    cta: "Book a demo",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "tailored",
    description:
      "For MSSPs and large security teams with bespoke compliance scope.",
    features: [
      "Unlimited client companies",
      "Dedicated tenant region",
      "Custom integrations",
      "24/7 incident assistance",
      "Named CSM",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge variant="outline" className="rounded-full">
          Pricing
        </Badge>
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Pricing that scales with your portfolio.
        </h2>
        <p className="text-balance text-lg text-muted-foreground">
          Pay per Punica customer account. Your client companies inside that
          account are bundled — never priced per seat surprise.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col border-border/60 ${
              plan.highlighted
                ? "border-primary/50 bg-card ring-1 ring-primary/20"
                : "bg-card/50"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="rounded-full">Most popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.cadence}
                </span>
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href="#contact">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
