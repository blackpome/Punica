import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CLASSIFICATION_LABEL,
  CLASSIFICATION_STYLE,
  STATUS_LABEL,
  VALUE_COLOR,
  type AssetStatus,
  type AssetValue,
  type Classification,
} from "@/lib/assets";

export function ValueBadge({ value }: { value: AssetValue }) {
  const c = VALUE_COLOR[value];
  return (
    <Badge
      variant="outline"
      className="rounded-full border-transparent capitalize"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {value}
    </Badge>
  );
}

export function ClassificationBadge({
  classification,
}: {
  classification: Classification;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full", CLASSIFICATION_STYLE[classification])}
    >
      {CLASSIFICATION_LABEL[classification]}
    </Badge>
  );
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return (
    <Badge variant="secondary" className="rounded-full">
      {STATUS_LABEL[status]}
    </Badge>
  );
}
