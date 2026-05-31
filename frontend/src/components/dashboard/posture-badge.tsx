import { Badge } from "@/components/ui/badge";
import type { ClientCompany } from "@/db/app-schema";

const POSTURE_STYLES: Record<ClientCompany["posture"], string> = {
  strong: "border-foreground/40 bg-foreground/10 text-foreground",
  moderate: "border-border bg-muted text-muted-foreground",
  "at-risk":
    "border-destructive/40 bg-destructive/10 text-destructive",
};

const POSTURE_LABEL: Record<ClientCompany["posture"], string> = {
  strong: "Strong",
  moderate: "Moderate",
  "at-risk": "At risk",
};

export function PostureBadge({
  posture,
}: {
  posture: ClientCompany["posture"];
}) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full ${POSTURE_STYLES[posture]}`}
    >
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
      {POSTURE_LABEL[posture]}
    </Badge>
  );
}
