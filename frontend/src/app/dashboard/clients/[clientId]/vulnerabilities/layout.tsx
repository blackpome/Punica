import { VulnWorkspace } from "@/components/dashboard/vuln/vuln-workspace";

export default async function VulnerabilitiesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <VulnWorkspace firmId={clientId}>{children}</VulnWorkspace>;
}
