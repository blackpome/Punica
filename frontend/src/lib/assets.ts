// Asset inventory modeled on ISO/IEC 27001 (A.5.9 / A.5.12). Categories and
// per-asset fields follow ISO 27001 asset-inventory guidance: every asset has
// an owner, a classification, an assigned value (criticality), and handling
// requirements.

export type AssetCategory =
  | "information"
  | "software"
  | "hardware"
  | "services"
  | "people"
  | "physical"
  | "intangible";

export type Classification =
  | "restricted"
  | "confidential"
  | "internal"
  | "public";

// "Value" to the organization — drives risk-assessment priority.
export type AssetValue = "critical" | "high" | "medium" | "low";

export type AssetStatus = "active" | "inactive" | "retired";

export type Asset = {
  id: string;
  name: string;
  category: AssetCategory;
  // Locator: hostname / IP / URL / repo / room / employee ref, etc.
  identifier: string;
  owner: string;
  classification: Classification;
  value: AssetValue;
  status: AssetStatus;
  // ISO 27001: protection requirements & handling procedures.
  handling?: string;
};

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "information", label: "Information & Data" },
  { value: "software", label: "Software" },
  { value: "hardware", label: "Hardware" },
  { value: "services", label: "Services" },
  { value: "people", label: "People" },
  { value: "physical", label: "Physical & Sites" },
  { value: "intangible", label: "Intangible (IP / Brand)" },
];

export const CATEGORY_LABEL: Record<AssetCategory, string> =
  Object.fromEntries(
    ASSET_CATEGORIES.map((c) => [c.value, c.label]),
  ) as Record<AssetCategory, string>;

export const CLASSIFICATIONS: Classification[] = [
  "restricted",
  "confidential",
  "internal",
  "public",
];

export const ASSET_VALUES: AssetValue[] = ["critical", "high", "medium", "low"];

export const ASSET_STATUSES: AssetStatus[] = [
  "active",
  "inactive",
  "retired",
];

export const CLASSIFICATION_LABEL: Record<Classification, string> = {
  restricted: "Restricted",
  confidential: "Confidential",
  internal: "Internal",
  public: "Public",
};

export const STATUS_LABEL: Record<AssetStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  retired: "Retired",
};

// Value palette aligned with the vulnerability severity scale.
export const VALUE_COLOR: Record<AssetValue, { bg: string; fg: string }> = {
  critical: { bg: "#cc0500", fg: "#ffffff" },
  high: { bg: "#df3d03", fg: "#ffffff" },
  medium: { bg: "#f9a009", fg: "#1a1a1a" },
  low: { bg: "#ffcb0d", fg: "#1a1a1a" },
};

// Classification badge styling (monochrome; restricted gets emphasis).
export const CLASSIFICATION_STYLE: Record<Classification, string> = {
  restricted: "border-destructive/40 bg-destructive/10 text-destructive",
  confidential: "border-foreground/30 bg-foreground/10 text-foreground",
  internal: "border-border bg-muted text-muted-foreground",
  public: "border-border bg-transparent text-muted-foreground",
};

export const MOCK_ASSETS: Asset[] = [
  {
    id: "a1",
    name: "Customer PII database",
    category: "information",
    identifier: "core-db / 10.0.2.14",
    owner: "Data Protection Officer",
    classification: "restricted",
    value: "critical",
    status: "active",
    handling: "Encrypt at rest; access on a need-to-know basis; 7-year retention.",
  },
  {
    id: "a2",
    name: "app-web-01",
    category: "hardware",
    identifier: "10.0.2.20",
    owner: "Platform Team",
    classification: "confidential",
    value: "critical",
    status: "active",
    handling: "Public web server behind WAF; patch within SLA.",
  },
  {
    id: "a3",
    name: "Billing API",
    category: "software",
    identifier: "billing.internal",
    owner: "Payments Team",
    classification: "confidential",
    value: "high",
    status: "active",
  },
  {
    id: "a4",
    name: "Edge firewall",
    category: "hardware",
    identifier: "edge-fw-01 / 10.0.2.1",
    owner: "NetOps",
    classification: "internal",
    value: "high",
    status: "active",
  },
  {
    id: "a5",
    name: "Email & collaboration (M365)",
    category: "services",
    identifier: "tenant: contoso.onmicrosoft.com",
    owner: "IT Operations",
    classification: "confidential",
    value: "high",
    status: "active",
  },
  {
    id: "a6",
    name: "Security operations staff",
    category: "people",
    identifier: "SOC team (6 analysts)",
    owner: "Head of Security",
    classification: "internal",
    value: "high",
    status: "active",
    handling: "Background-checked; security awareness training quarterly.",
  },
  {
    id: "a7",
    name: "Primary data center",
    category: "physical",
    identifier: "DC-EU-West, Frankfurt",
    owner: "Facilities",
    classification: "internal",
    value: "high",
    status: "active",
  },
  {
    id: "a8",
    name: "Brand & trademarks",
    category: "intangible",
    identifier: "Corporate IP portfolio",
    owner: "Legal",
    classification: "public",
    value: "medium",
    status: "active",
  },
];
