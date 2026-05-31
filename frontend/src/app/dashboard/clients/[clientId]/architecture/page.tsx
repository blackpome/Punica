import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getFirm } from "@/lib/firm";
import { ArchitectureFlow } from "./architecture-flow";

export default async function ArchitecturePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { clientId } = await params;
  const firm = await getFirm(clientId);
  if (!firm) notFound();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {firm.name} · Planning &amp; Security Architecture
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Security Architecture
        </h1>
        <p className="text-muted-foreground">
          Visualize and plan {firm.name}&apos;s architecture. Drag nodes,
          connect components, and map trust boundaries.
        </p>
      </div>

      <ArchitectureFlow />
    </div>
  );
}
