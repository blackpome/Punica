"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { createAsset, patchAsset, destroyAsset } from "@/app/actions/assets";
import type { Asset, AssetStatus } from "@/lib/assets";

type NewAsset = Omit<Asset, "id">;

type AssetContextValue = {
  firmId: string;
  firmName: string;
  assets: Asset[];
  addAsset: (a: NewAsset) => void;
  updateStatus: (id: string, status: AssetStatus) => void;
  updateAsset: (id: string, patch: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  hydrated: true;
};

const AssetContext = createContext<AssetContextValue | null>(null);

export function AssetProvider({
  firmId,
  firmName,
  initialData,
  children,
}: {
  firmId: string;
  firmName: string;
  initialData: Asset[];
  children: React.ReactNode;
}) {
  const [assets, setAssets] = useState<Asset[]>(initialData);

  const addAsset = useCallback(
    (a: NewAsset) => {
      const id = crypto.randomUUID();
      const newAsset: Asset = { id, ...a };
      setAssets((prev) => [newAsset, ...prev]);
      createAsset(firmId, newAsset).catch(() => {
        toast.error("Failed to save asset.");
        setAssets((prev) => prev.filter((x) => x.id !== id));
      });
    },
    [firmId],
  );

  const updateStatus = useCallback(
    (id: string, status: AssetStatus) => {
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      patchAsset(firmId, id, { status }).catch(() =>
        toast.error("Failed to update status."),
      );
    },
    [firmId],
  );

  const updateAsset = useCallback(
    (id: string, patch: Partial<Asset>) => {
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      );
      patchAsset(firmId, id, patch).catch(() =>
        toast.error("Failed to save changes."),
      );
    },
    [firmId],
  );

  const removeAsset = useCallback(
    (id: string) => {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      destroyAsset(firmId, id).catch(() => {
        toast.error("Failed to delete asset.");
      });
    },
    [firmId],
  );

  const value = useMemo<AssetContextValue>(
    () => ({
      firmId,
      firmName,
      assets,
      addAsset,
      updateStatus,
      updateAsset,
      removeAsset,
      hydrated: true,
    }),
    [firmId, firmName, assets, addAsset, updateStatus, updateAsset, removeAsset],
  );

  return (
    <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
  );
}

export function useAssets() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error("useAssets must be used within AssetProvider");
  return ctx;
}
