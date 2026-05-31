import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getActiveOrganization() {
  return auth.api.getFullOrganization({ headers: await headers() });
}

export async function listUserOrganizations() {
  return auth.api.listOrganizations({ headers: await headers() });
}
