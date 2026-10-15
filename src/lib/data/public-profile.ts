import "server-only";

import { cacheLife, cacheTag, revalidatePath, updateTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import { normalizeUsername, USERNAME_PATTERN } from "@/lib/validation/auth";

export type PublicLink = { id: string; title: string; url: string };

export type PublicProfileData = {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  accent_color: string;
  links: PublicLink[];
};

export function publicProfileTag(username: string) {
  return `public-profile:${username}`;
}

/**
 * Öffentliches Profil inkl. sichtbarer Links, gecacht pro Username.
 * `null` = gibt es nicht. Fehler werden geworfen (und damit nicht gecacht).
 */
export async function getPublicProfile(rawUsername: string): Promise<PublicProfileData | null> {
  "use cache";
  const username = normalizeUsername(rawUsername);
  cacheLife("hours");
  cacheTag(publicProfileTag(username));

  if (!USERNAME_PATTERN.test(username)) return null;

  const supabase = createPublicClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, accent_color")
    .eq("username", username)
    .maybeSingle();
  if (error) throw new Error("Profil konnte nicht geladen werden.");
  if (!profile) return null;

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, url")
    .eq("user_id", profile.id)
    .eq("is_visible", true)
    .order("position")
    .order("created_at", { ascending: false });
  if (linksError) throw new Error("Links konnten nicht geladen werden.");

  return {
    username: profile.username,
    display_name: profile.display_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    accent_color: profile.accent_color,
    links,
  };
}

/** Nach Änderungen (nur in Server Actions): Cache sofort verwerfen, Seite neu rendern. */
export function refreshPublicProfile(username: string) {
  updateTag(publicProfileTag(username));
  revalidatePath(`/u/${username}`);
}
