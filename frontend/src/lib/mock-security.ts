export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type VulnStatus = "open" | "confirmed" | "remediated" | "risk-accepted";

export type Vulnerability = {
  id: string;
  name: string;
  severity: Severity;
  host: string;
  service: string;
  status: VulnStatus;
  cve?: string;
  description?: string;
  // Mapped asset (Asset.id) this finding affects.
  assetId?: string;
  // Internal notes — organization-only (Tiptap JSON).
  notes?: string;
  // Proof of concept — shared with the firm/client (Tiptap JSON).
  poc?: string;
};

export const SEVERITIES: Severity[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

// Industry-standard severity palette (aligned with NVD/CVSS rating colors;
// Info uses the common scanner convention of blue).
export const SEVERITY_COLOR: Record<Severity, { bg: string; fg: string }> = {
  critical: { bg: "#cc0500", fg: "#ffffff" },
  high: { bg: "#df3d03", fg: "#ffffff" },
  medium: { bg: "#f9a009", fg: "#1a1a1a" },
  low: { bg: "#ffcb0d", fg: "#1a1a1a" },
  info: { bg: "#3b82f6", fg: "#ffffff" },
};

export const VULN_STATUSES: VulnStatus[] = [
  "open",
  "confirmed",
  "remediated",
  "risk-accepted",
];

export type TaskStatus = "todo" | "in-progress" | "done";
export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "high" | "medium" | "low";
  linkedVuln?: string;
  assignee?: string;
};

// Deterministic-ish demo data. Frontend-only; no persistence.
export const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: "v1",
    name: "Outdated OpenSSL (RCE)",
    severity: "critical",
    host: "10.0.2.14",
    service: "443/tcp",
    status: "open",
    cve: "CVE-2024-3094",
    assetId: "a1",
  },
  {
    id: "v2",
    name: "SQL Injection in /login",
    severity: "high",
    host: "app-web-01",
    service: "https",
    status: "confirmed",
    assetId: "a2",
  },
  {
    id: "v3",
    name: "Exposed .git directory",
    severity: "high",
    host: "app-web-01",
    service: "https",
    status: "open",
    assetId: "a2",
  },
  {
    id: "v4",
    name: "Weak TLS ciphers enabled",
    severity: "medium",
    host: "10.0.2.20",
    service: "443/tcp",
    status: "open",
    assetId: "a2",
  },
  {
    id: "v5",
    name: "Missing security headers",
    severity: "low",
    host: "app-web-01",
    service: "https",
    status: "remediated",
  },
  {
    id: "v6",
    name: "Default SNMP community string",
    severity: "medium",
    host: "10.0.2.1",
    service: "161/udp",
    status: "risk-accepted",
  },
  {
    id: "v7",
    name: "Verbose server banner",
    severity: "info",
    host: "10.0.2.20",
    service: "80/tcp",
    status: "open",
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Patch OpenSSL on 10.0.2.14",
    description: "Upgrade to patched build and reboot during maintenance window.",
    status: "todo",
    priority: "high",
    linkedVuln: "Outdated OpenSSL (RCE)",
    assignee: "A. Khan",
  },
  {
    id: "t2",
    title: "Parameterize /login queries",
    description: "Remediate SQLi by moving to prepared statements.",
    status: "in-progress",
    priority: "high",
    linkedVuln: "SQL Injection in /login",
    assignee: "M. Reyes",
  },
  {
    id: "t3",
    title: "Block public access to .git",
    description: "Add deny rule at the reverse proxy.",
    status: "in-progress",
    priority: "medium",
    linkedVuln: "Exposed .git directory",
  },
  {
    id: "t4",
    title: "Harden TLS configuration",
    description: "Disable weak ciphers, enforce TLS 1.2+.",
    status: "todo",
    priority: "medium",
    linkedVuln: "Weak TLS ciphers enabled",
  },
  {
    id: "t5",
    title: "Add security headers",
    description: "CSP, HSTS, X-Frame-Options deployed.",
    status: "done",
    priority: "low",
    linkedVuln: "Missing security headers",
    assignee: "M. Reyes",
  },
];
