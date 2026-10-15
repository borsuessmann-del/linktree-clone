import { z } from "zod";

/** Gleiche Liste wie CHECK `profiles_username_not_reserved` (Migration create_profiles). */
export const RESERVED_USERNAMES = [
  "admin", "api", "app", "auth", "login", "logout", "signup", "register",
  "settings", "dashboard", "edit", "account", "profile", "u", "help",
  "support", "about", "terms", "privacy", "static", "_next", "assets",
  "public", "null", "undefined", "root", "www", "mail", "me", "new",
] as const;

/** Gleiche Regex wie CHECK `profiles_username_format`. */
export const USERNAME_PATTERN = /^[a-z0-9]([a-z0-9_-]{1,28}[a-z0-9])?$/;

export const USERNAME_MAX_LENGTH = 30;

/** Vereinheitlicht Eingaben: ohne Leerzeichen am Rand, kleingeschrieben. */
export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

// Mehrere Regeln statt einer Regex, damit die Fehlermeldung sagt, was genau falsch ist.
export const usernameSchema = z
  .string()
  .min(1, "Bitte gib einen Username ein.")
  .max(USERNAME_MAX_LENGTH, `Höchstens ${USERNAME_MAX_LENGTH} Zeichen.`)
  .regex(/^[a-z0-9_-]*$/, "Nur Kleinbuchstaben, Ziffern, _ und - erlaubt.")
  .regex(/^([a-z0-9].*)?$/, "Muss mit einem Buchstaben oder einer Ziffer beginnen.")
  .regex(/^(.*[a-z0-9])?$/, "Muss mit einem Buchstaben oder einer Ziffer enden.")
  .regex(USERNAME_PATTERN, "Mindestens 3 Zeichen.")
  .refine(
    (value) => !(RESERVED_USERNAMES as readonly string[]).includes(value),
    "Dieser Username ist reserviert.",
  );

export const emailSchema = z.email("Bitte gib eine gültige E-Mail-Adresse ein.");

// bcrypt (Supabase Auth) verarbeitet maximal 72 Bytes.
export const passwordSchema = z
  .string()
  .min(8, "Mindestens 8 Zeichen.")
  .max(72, "Höchstens 72 Zeichen.");

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

export type SignupField = keyof z.infer<typeof signupSchema>;
export type LoginField = keyof z.infer<typeof loginSchema>;

/** Erste Fehlermeldung pro Feld – das Formular zeigt immer nur eine an. */
export function firstFieldErrors<F extends string>(
  error: z.ZodError,
): Partial<Record<F, string>> {
  const result: Partial<Record<F, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as F | undefined;
    if (field && !result[field]) {
      result[field] = issue.message;
    }
  }
  return result;
}
