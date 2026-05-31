"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { createVuln, patchVuln, destroyVuln } from "@/app/actions/vulns";
import type { Vulnerability, VulnStatus } from "@/lib/mock-security";

type NewVuln = Omit<Vulnerability, "id">;

type VulnContextValue = {
  firmId: string;
  firmName: string;
  vulns: Vulnerability[];
  addVuln: (v: NewVuln) => void;
  updateStatus: (id: string, status: VulnStatus) => void;
  setVulnAsset: (id: string, assetId: string | undefined) => void;
  updateVuln: (id: string, patch: Partial<Vulnerability>) => void;
  removeVuln: (id: string) => void;
  hydrated: true;
};

const VulnContext = createContext<VulnContextValue | null>(null);

export function VulnProvider({
  firmId,
  firmName,
  initialData,
  children,
}: {
  firmId: string;
  firmName: string;
  initialData: Vulnerability[];
  children: React.ReactNode;
}) {
  const [vulns, setVulns] = useState<Vulnerability[]>(initialData);

  const addVuln = useCallback(
    (v: NewVuln) => {
      const id = crypto.randomUUID();
      const newVuln: Vulnerability = { id, ...v };
      setVulns((prev) => [newVuln, ...prev]);
      createVuln(firmId, newVuln).catch(() => {
        toast.error("Failed to save vulnerability.");
        setVulns((prev) => prev.filter((x) => x.id !== id));
      });
    },
    [firmId],
  );

  const updateStatus = useCallback(
    (id: string, status: VulnStatus) => {
      setVulns((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      patchVuln(firmId, id, { status }).catch(() =>
        toast.error("Failed to update status."),
      );
    },
    [firmId],
  );

  const setVulnAsset = useCallback(
    (id: string, assetId: string | undefined) => {
      setVulns((prev) =>
        prev.map((v) => (v.id === id ? { ...v, assetId } : v)),
      );
      patchVuln(firmId, id, { assetId }).catch(() =>
        toast.error("Failed to update asset mapping."),
      );
    },
    [firmId],
  );

  const updateVuln = useCallback(
    (id: string, patch: Partial<Vulnerability>) => {
      setVulns((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...patch } : v)),
      );
      patchVuln(firmId, id, patch).catch(() =>
        toast.error("Failed to save changes."),
      );
    },
    [firmId],
  );

  const removeVuln = useCallback(
    (id: string) => {
      setVulns((prev) => prev.filter((v) => v.id !== id));
      destroyVuln(firmId, id).catch(() => {
        toast.error("Failed to delete vulnerability.");
      });
    },
    [firmId],
  );

  const value = useMemo<VulnContextValue>(
    () => ({
      firmId,
      firmName,
      vulns,
      addVuln,
      updateStatus,
      setVulnAsset,
      updateVuln,
      removeVuln,
      hydrated: true,
    }),
    [firmId, firmName, vulns, addVuln, updateStatus, setVulnAsset, updateVuln, removeVuln],
  );

  return <VulnContext.Provider value={value}>{children}</VulnContext.Provider>;
}

export function useVulns() {
  const ctx = useContext(VulnContext);
  if (!ctx) throw new Error("useVulns must be used within VulnProvider");
  return ctx;
}
