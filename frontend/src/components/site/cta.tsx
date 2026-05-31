import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section id="contact" className="mx-auto w-full max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 px-6 py-16 text-center md:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, oklch(1 0 0 / 0.08), transparent 70%)",
          }}
        />
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to manage your entire portfolio from one platform?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
          Book a 30-minute walkthrough with our team. We will set up a workspace
          and show you Punica with two sample client companies.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="mailto:hello@punica.security">
              Book a demo
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#platform">See the platform</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
