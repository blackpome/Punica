import { ShieldCheck } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="relative flex items-center justify-center size-8 rounded-md bg-primary/15 ring-1 ring-primary/30">
        <ShieldCheck className="size-4 text-primary" />
      </div>
      <span className="text-lg font-semibold tracking-tight">Punica</span>
    </div>
  );
}
