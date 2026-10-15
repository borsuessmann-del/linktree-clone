import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
};

/**
 * Liest den eingeloggten User aus dem JWT (Signatur geprüft per getClaims()).
 * Nie getSession() zur Autorisierung verwenden – der Cookie ist fälschbar.
 * cache() dedupliziert den Aufruf innerhalb eines Requests.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // getClaims() prüft den Token-Ablauf mit Date.now() → Auth immer zur Request-Zeit,
  // nie beim (Runtime-)Prerendering (cacheComponents + partialPrefetching).
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return {
    id: data.claims.sub,
    email: data.claims.email ?? null,
  };
});

/** Wie getCurrentUser(), leitet ausgeloggte User aber nach /login um. */
export const requireUser = cache(async (): Promise<CurrentUser> => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
});

export type CurrentProfile = Pick<
  Tables<"profiles">,
  "username" | "display_name" | "bio" | "avatar_url" | "accent_color"
> & {
  email: string | null;
};

/** Profil des eingeloggten Users (legt der Sign-up-Trigger immer an). */
export const requireProfile = cache(async (): Promise<CurrentProfile> => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url, accent_color")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Profil konnte nicht geladen werden.");
  }
  return { ...data, email: user.email };
});
