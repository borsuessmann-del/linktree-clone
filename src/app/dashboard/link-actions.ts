"use server";

import type { PostgrestError } from "@supabase/supabase-js";
import type { z } from "zod";

import { requireUser } from "@/lib/auth/dal";
import { LINK_COLUMNS } from "@/lib/data/links";
import { refreshPublicProfile } from "@/lib/data/public-profile";
import { createClient } from "@/lib/supabase/server";
import {
  linkIdSchema,
  linkInputSchema,
  linkOrderSchema,
  linkSnapshotSchema,
  MAX_LINKS,
  type LinkField,
  type LinkInput,
  type LinkItem,
} from "@/lib/validation/link";

export type LinkActionResult<T = LinkItem> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Partial<Record<LinkField, string>> };

const NOT_FOUND = "Link nicht gefunden – bitte lade die Seite neu.";

function invalid(error: z.ZodError): LinkActionResult<never> {
  const fieldErrors: Partial<Record<LinkField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as LinkField | undefined;
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return { ok: false, error: "Bitte prüfe deine Eingaben.", fieldErrors };
}

function databaseError(error: PostgrestError): LinkActionResult<never> {
  if (error.message.includes("Maximal 100 Links")) {
    return { ok: false, error: `Du hast das Maximum von ${MAX_LINKS} Links erreicht.` };
  }
  if (error.code === "23505") {
    return { ok: false, error: "Dieser Link existiert bereits." };
  }
  return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };
}

async function getContext() {
  const user = await requireUser();
  const supabase = await createClient();
  return { user, supabase };
}

/** Public-Page neu rendern, damit Besucher die Änderung sehen. */
async function revalidatePublicPage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();
  if (data) refreshPublicProfile(data.username);
}

export async function createLink(input: LinkInput): Promise<LinkActionResult> {
  const parsed = linkInputSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const { user, supabase } = await getContext();

  // Neuer Link kommt nach oben: kleinste Position − 1.
  const { data: first } = await supabase
    .from("links")
    .select("position")
    .eq("user_id", user.id)
    .order("position")
    .limit(1)
    .maybeSingle();
  const position = first ? first.position - 1 : 0;

  const { data, error } = await supabase
    .from("links")
    .insert({ ...parsed.data, user_id: user.id, position })
    .select(LINK_COLUMNS)
    .single();
  if (error) return databaseError(error);

  await revalidatePublicPage(supabase, user.id);
  return { ok: true, data };
}

export async function updateLink(id: string, input: LinkInput): Promise<LinkActionResult> {
  const parsedId = linkIdSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };
  const parsed = linkInputSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const { user, supabase } = await getContext();
  const { data, error } = await supabase
    .from("links")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select(LINK_COLUMNS)
    .maybeSingle();
  if (error) return databaseError(error);
  if (!data) return { ok: false, error: NOT_FOUND };

  await revalidatePublicPage(supabase, user.id);
  return { ok: true, data };
}

export async function toggleLinkVisibility(
  id: string,
  isVisible: boolean,
): Promise<LinkActionResult> {
  const parsedId = linkIdSchema.safeParse(id);
  if (!parsedId.success || typeof isVisible !== "boolean") {
    return { ok: false, error: NOT_FOUND };
  }

  const { user, supabase } = await getContext();
  const { data, error } = await supabase
    .from("links")
    .update({ is_visible: isVisible })
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select(LINK_COLUMNS)
    .maybeSingle();
  if (error) return databaseError(error);
  if (!data) return { ok: false, error: NOT_FOUND };

  await revalidatePublicPage(supabase, user.id);
  return { ok: true, data };
}

export async function deleteLink(id: string): Promise<LinkActionResult> {
  const parsedId = linkIdSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const { user, supabase } = await getContext();
  const { data, error } = await supabase
    .from("links")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select(LINK_COLUMNS)
    .maybeSingle();
  if (error) return databaseError(error);
  if (!data) return { ok: false, error: NOT_FOUND };

  await revalidatePublicPage(supabase, user.id);
  return { ok: true, data };
}

/** Speichert die komplette Reihenfolge atomar per RPC (security invoker → RLS greift). */
export async function reorderLinks(ids: string[]): Promise<LinkActionResult<null>> {
  const parsed = linkOrderSchema.safeParse(ids);
  if (!parsed.success) return { ok: false, error: "Reihenfolge konnte nicht gespeichert werden." };

  const { user, supabase } = await getContext();
  const { error } = await supabase.rpc("reorder_links", { link_ids: parsed.data });
  if (error) return { ok: false, error: "Reihenfolge konnte nicht gespeichert werden." };

  await revalidatePublicPage(supabase, user.id);
  return { ok: true, data: null };
}

/** „Rückgängig“ nach dem Löschen: gleiche ID, Position und Sichtbarkeit. */
export async function restoreLink(snapshot: LinkItem): Promise<LinkActionResult> {
  const parsed = linkSnapshotSchema.safeParse(snapshot);
  if (!parsed.success) return { ok: false, error: "Wiederherstellen fehlgeschlagen." };

  const { user, supabase } = await getContext();
  const { data, error } = await supabase
    .from("links")
    .insert({ ...parsed.data, user_id: user.id })
    .select(LINK_COLUMNS)
    .single();
  if (error) return databaseError(error);

  await revalidatePublicPage(supabase, user.id);
  return { ok: true, data };
}
