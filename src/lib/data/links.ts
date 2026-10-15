import "server-only";

import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { LinkItem } from "@/lib/validation/link";

export const LINK_COLUMNS = "id, title, url, is_visible, position";

/** Alle Links des eingeloggten Users (inkl. ausgeblendeter), sortiert wie auf der Public-Page. */
export async function getOwnLinks(): Promise<LinkItem[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select(LINK_COLUMNS)
    .eq("user_id", user.id)
    .order("position")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Links konnten nicht geladen werden.");
  }
  return data;
}
