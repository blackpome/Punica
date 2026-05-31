import { Badge } from "@/components/ui/badge";
import {
  SEVERITY_COLOR,
  type Severity,
  type VulnStatus,
} from "@/lib/mock-security";

const STATUS_LABEL: Record<VulnStatus, string> = {
  open: "Open",
  confirmed: "Confirmed",
  remediated: "Remediated",
  "risk-accepted": "Risk accepted",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const c = SEVERITY_COLOR[severity];
  return (
    <Badge
      variant="outline"
      className="rounded-full border-transparent capitalize"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {severity}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: VulnStatus }) {
  return (
    <Badge variant="secondary" className="rounded-full">
      {STATUS_LABEL[status]}
    </Badge>
  );
}
