import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Who is Punica for?",
    a: "Punica is built for security service providers — MSSPs, consultancies, and internal security teams that defend multiple companies. blackPome is our first customer; the platform is designed so any provider can onboard with the same multi-tenant model.",
  },
  {
    q: "How does the multi-customer, multi-company model work?",
    a: "Each Punica customer (e.g. blackPome) operates a workspace. Inside that workspace, the customer manages an unbounded set of client companies, with strict data isolation. Punica handles the hierarchy, RBAC, and audit trails so the boundaries stay clean.",
  },
  {
    q: "What backend stack does Punica use?",
    a: "Punica is intentionally polyglot. The frontend is Next.js. The backend will be composed of microservices in the languages best suited to each domain — threat ingestion, compliance evidence, identity, reporting. We pick the right tool per problem.",
  },
  {
    q: "Is there a database?",
    a: "Not in this build. The current release focuses on the frontend and product surface. Persistence will be introduced when the first backend services come online.",
  },
  {
    q: "How do I get started?",
    a: "Book a demo and we will provision a Starter workspace for your team. You can connect up to 3 client companies during the trial.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-3xl px-6 py-24 md:py-32"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="outline" className="rounded-full">
          FAQ
        </Badge>
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Questions, answered.
        </h2>
      </div>

      <Accordion type="single" collapsible className="mt-12 w-full">
        {FAQS.map((item, index) => (
          <AccordionItem key={item.q} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
