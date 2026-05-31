import { AssetWorkspace } from "@/components/dashboard/assets/asset-workspace";

export default async function AssetsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <AssetWorkspace firmId={clientId}>{children}</AssetWorkspace>;
}
