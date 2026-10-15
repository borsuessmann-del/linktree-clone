import { z } from "zod";

import type { Tables } from "@/lib/database.types";

export type LinkItem = Pick<
  Tables<"links">,
  "id" | "title" | "url" | "is_visible" | "position"
>;

export const LINK_TITLE_MAX = 80;
export const LINK_URL_MAX = 2048;
/** Gleiches Limit wie Trigger `links_enforce_limit`. */
export const MAX_LINKS = 100;

/** Nur echte http(s)-Adressen – passt zu CHECK `links_url_format` (`^https?://`). */
export function isHttpUrl(value: string) {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
  } catch {
    return false;
  }
}

/**
 * Schlägt „https://…“ vor, wenn eine Adresse ohne Schema eingegeben wurde (z. B. „example.com“).
 * Eingaben mit anderem Schema (javascript:, ftp:) bekommen bewusst keinen Vorschlag.
 */
export function suggestHttps(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || /^[a-z][a-z0-9+.-]*:/i.test(trimmed) || !trimmed.includes(".")) {
    return null;
  }
  const candidate = `https://${trimmed}`;
  return isHttpUrl(candidate) ? candidate : null;
}

export const linkInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Bitte gib einen Titel ein.")
    .max(LINK_TITLE_MAX, `Höchstens ${LINK_TITLE_MAX} Zeichen.`),
  url: z
    .string()
    .trim()
    .min(1, "Bitte gib eine URL ein.")
    .max(LINK_URL_MAX, "Die URL ist zu lang.")
    .refine(isHttpUrl, "Nur Adressen mit http:// oder https:// sind erlaubt."),
});

export type LinkInput = z.input<typeof linkInputSchema>;
export type LinkField = keyof LinkInput;

export const linkIdSchema = z.uuid("Ungültige Link-ID.");

/** Neue Reihenfolge: eindeutige Link-IDs, höchstens so viele wie das Limit. */
export const linkOrderSchema = z
  .array(linkIdSchema)
  .min(1)
  .max(MAX_LINKS)
  .refine((ids) => new Set(ids).size === ids.length, "Doppelte Link-IDs.");

/** Snapshot zum Wiederherstellen nach „Rückgängig“. */
export const linkSnapshotSchema = linkInputSchema.extend({
  id: linkIdSchema,
  is_visible: z.boolean(),
  position: z.number().int(),
});
