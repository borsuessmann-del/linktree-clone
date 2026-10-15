import { z } from "zod";

export const DISPLAY_NAME_MAX = 50;
export const BIO_MAX = 160;
export const AVATAR_URL_MAX = 2048;

/** Nur https – passt zu CHECK `profiles_avatar_url_format` (`^https://`). */
export function isHttpsUrl(value: string) {
  if (!/^https:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "";
  } catch {
    return false;
  }
}

/** Leere Eingabe = Feld nicht gesetzt (null in der DB). */
const emptyToNull = (value: string) => (value === "" ? null : value);

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .max(DISPLAY_NAME_MAX, `Höchstens ${DISPLAY_NAME_MAX} Zeichen.`)
    .transform(emptyToNull),
  bio: z
    .string()
    .trim()
    .max(BIO_MAX, `Höchstens ${BIO_MAX} Zeichen.`)
    .transform(emptyToNull),
  avatar_url: z
    .string()
    .trim()
    .max(AVATAR_URL_MAX, "Die URL ist zu lang.")
    .refine((value) => value === "" || isHttpsUrl(value), "Nur Adressen mit https:// sind erlaubt.")
    .transform(emptyToNull),
});

export type ProfileInput = z.input<typeof profileSchema>;
export type ProfileField = keyof ProfileInput;
