"use server";

import { requireUser } from "@/lib/auth/dal";
import { refreshPublicProfile } from "@/lib/data/public-profile";
import { createClient } from "@/lib/supabase/server";
import {
  profileSchema,
  type ProfileField,
  type ProfileInput,
} from "@/lib/validation/profile";

export type SavedProfile = {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export type ProfileActionResult =
  | { ok: true; data: SavedProfile }
  | { ok: false; error: string; fieldErrors?: Partial<Record<ProfileField, string>> };

export async function updateProfile(input: ProfileInput): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ProfileField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ProfileField | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, error: "Bitte prüfe deine Eingaben.", fieldErrors };
  }

  const user = await requireUser();
  const supabase = await createClient();
  // Nur das eigene Profil; RLS + Spalten-Grants + CHECKs sichern zusätzlich ab.
  const { data, error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id)
    .select("username, display_name, bio, avatar_url")
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };
  }

  refreshPublicProfile(data.username);
  return {
    ok: true,
    data: { display_name: data.display_name, bio: data.bio, avatar_url: data.avatar_url },
  };
}
