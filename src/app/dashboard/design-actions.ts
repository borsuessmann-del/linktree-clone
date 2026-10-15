"use server";

import { z } from "zod";

import { requireUser } from "@/lib/auth/dal";
import { refreshPublicProfile } from "@/lib/data/public-profile";
import { createClient } from "@/lib/supabase/server";
import { HEX_COLOR_PATTERN, normalizeHex } from "@/lib/theme/color";

export type AccentActionResult =
  | { ok: true; data: { accent_color: string } }
  | { ok: false; error: string };

// Ablehnen statt korrigieren: kein trim, keine Kurzformen, nur exakt #rrggbb.
const accentSchema = z
  .string()
  .regex(HEX_COLOR_PATTERN, "Bitte wähle eine gültige Farbe im Format #rrggbb.")
  .transform(normalizeHex);

export async function updateAccentColor(value: string): Promise<AccentActionResult> {
  const parsed = accentSchema.safeParse(value);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ accent_color: parsed.data })
    .eq("id", user.id)
    .select("username, accent_color")
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };
  }

  refreshPublicProfile(data.username);
  return { ok: true, data: { accent_color: data.accent_color } };
}
