import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              The cybersecurity management platform for teams who defend other
              companies.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            <FooterColumn title="Platform">
              <FooterLink href="#platform">Modules</FooterLink>
              <FooterLink href="#customers">Tenant model</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
            </FooterColumn>
            <FooterColumn title="Company">
              <FooterLink href="#contact">Contact</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
            </FooterColumn>
            <FooterColumn title="Legal">
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </FooterColumn>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Punica. All rights reserved.</p>
          <p>Operated for blackPome and partner customers.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-2 text-sm">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-foreground/80 transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}
