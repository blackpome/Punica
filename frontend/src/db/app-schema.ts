import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ── Client companies ──────────────────────────────────────────────────────────

export const postureEnum = pgEnum("client_posture", [
  "strong",
  "moderate",
  "at-risk",
]);

export const clientCompany = pgTable("client_company", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  region: text("region").notNull(),
  employees: integer("employees").notNull().default(0),
  openIncidents: integer("open_incidents").notNull().default(0),
  posture: postureEnum("posture").notNull().default("moderate"),
  complianceFrameworks: text("compliance_frameworks")
    .array()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ClientCompany = typeof clientCompany.$inferSelect;
export type NewClientCompany = typeof clientCompany.$inferInsert;

// ── Vulnerabilities ───────────────────────────────────────────────────────────

export const vulnSeverityEnum = pgEnum("vuln_severity", [
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);

export const vulnStatusEnum = pgEnum("vuln_status", [
  "open",
  "confirmed",
  "remediated",
  "risk-accepted",
]);

export const vulnerability = pgTable("vulnerability", {
  id: text("id").primaryKey(),
  clientId: text("client_id")
    .notNull()
    .references(() => clientCompany.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  severity: vulnSeverityEnum("severity").notNull().default("medium"),
  host: text("host").notNull().default("—"),
  service: text("service").notNull().default("—"),
  status: vulnStatusEnum("status").notNull().default("open"),
  cve: text("cve"),
  description: text("description"),
  assetId: text("asset_id"),
  notes: text("notes"),
  poc: text("poc"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type VulnerabilityRow = typeof vulnerability.$inferSelect;

// ── Assets ────────────────────────────────────────────────────────────────────

export const assetCategoryEnum = pgEnum("asset_category", [
  "information",
  "software",
  "hardware",
  "services",
  "people",
  "physical",
  "intangible",
]);

export const assetValueEnum = pgEnum("asset_value", [
  "critical",
  "high",
  "medium",
  "low",
]);

export const assetClassificationEnum = pgEnum("asset_classification", [
  "restricted",
  "confidential",
  "internal",
  "public",
]);

export const assetStatusEnum = pgEnum("asset_status", [
  "active",
  "inactive",
  "retired",
]);

export const asset = pgTable("asset", {
  id: text("id").primaryKey(),
  clientId: text("client_id")
    .notNull()
    .references(() => clientCompany.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: assetCategoryEnum("category").notNull().default("hardware"),
  identifier: text("identifier").notNull().default("—"),
  owner: text("owner").notNull(),
  classification: assetClassificationEnum("classification")
    .notNull()
    .default("internal"),
  value: assetValueEnum("value").notNull().default("medium"),
  status: assetStatusEnum("status").notNull().default("active"),
  handling: text("handling"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AssetRow = typeof asset.$inferSelect;

// ── Firm-level access control ─────────────────────────────────────────────────

// Firm access pre-selected at invite time (before the user accepts).
// Keyed by better-auth invitation ID so it survives until acceptance.
export const invitationFirmAccess = pgTable("invitation_firm_access", {
  id: text("id").primaryKey(),
  invitationId: text("invitation_id").notNull(),
  clientId: text("client_id")
    .notNull()
    .references(() => clientCompany.id, { onDelete: "cascade" }),
});

// Granted firm access for active org members. Owners/admins bypass this table.
export const memberFirmAccess = pgTable(
  "member_firm_access",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    clientId: text("client_id")
      .notNull()
      .references(() => clientCompany.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").notNull(),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("mfa_user_client_uidx").on(t.userId, t.clientId)],
);
