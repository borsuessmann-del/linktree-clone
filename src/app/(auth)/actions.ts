"use server";

import type { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { refreshPublicProfile } from "@/lib/data/public-profile";
import { createClient } from "@/lib/supabase/server";
import {
  firstFieldErrors,
  loginSchema,
  normalizeUsername,
  signupSchema,
  usernameSchema,
  type LoginField,
  type SignupField,
} from "@/lib/validation/auth";

export type FormState<F extends string> = {
  fieldErrors?: Partial<Record<F, string>>;
  formError?: string;
  /** Eingaben zum Wiederbefüllen (nie das Passwort). */
  values?: Partial<Record<F, string>>;
};

export type SignupState = FormState<SignupField>;
export type LoginState = FormState<LoginField>;
export type UsernameStatus = "available" | "taken" | "invalid" | "error";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function isUsernameTaken(username: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("username", username);
  if (error) {
    throw error;
  }
  return (count ?? 0) > 0;
}

/** Live-Prüfung im Sign-Up-Formular. */
export async function checkUsername(value: string): Promise<UsernameStatus> {
  const parsed = usernameSchema.safeParse(normalizeUsername(value));
  if (!parsed.success) {
    return "invalid";
  }
  try {
    return (await isUsernameTaken(parsed.data)) ? "taken" : "available";
  } catch {
    return "error";
  }
}

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = {
    email: readString(formData, "email").trim(),
    password: readString(formData, "password"),
    username: normalizeUsername(readString(formData, "username")),
  };
  const values = { email: raw.email, username: raw.username };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors<SignupField>(parsed.error), values };
  }
  const { email, password, username } = parsed.data;

  try {
    if (await isUsernameTaken(username)) {
      return { fieldErrors: { username: "Dieser Username ist bereits vergeben." }, values };
    }
  } catch {
    return { formError: "Der Server ist gerade nicht erreichbar. Bitte versuche es gleich noch einmal.", values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    return { ...signupErrorState(error), values };
  }
  if (!data.session) {
    // Tritt nur auf, wenn im Supabase-Dashboard „Confirm email“ aktiv ist.
    return {
      formError: "Konto angelegt, aber noch nicht aktiv: Bitte bestätige zuerst deine E-Mail-Adresse.",
      values,
    };
  }

  // Ein vorher gecachtes „gibt es nicht“ für diesen Namen verwerfen.
  refreshPublicProfile(username);

  // redirect() wirft intern – deshalb außerhalb von try/catch.
  redirect("/dashboard");
}

function signupErrorState(error: AuthError): SignupState {
  switch (error.code) {
    case "user_already_exists":
    case "email_exists":
      return { fieldErrors: { email: "Für diese E-Mail-Adresse gibt es schon ein Konto." } };
    case "weak_password":
      return { fieldErrors: { password: "Dieses Passwort ist zu schwach." } };
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return { formError: "Zu viele Versuche. Bitte warte einen Moment." };
  }
  // Trigger-Fehler (z. B. Username parallel vergeben) meldet Supabase als „Database error saving new user“.
  if (error.code === "unexpected_failure" || error.message.includes("Database error saving new user")) {
    return { fieldErrors: { username: "Dieser Username ist bereits vergeben." } };
  }
  return { formError: "Registrierung fehlgeschlagen. Bitte versuche es erneut." };
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const raw = {
    email: readString(formData, "email").trim(),
    password: readString(formData, "password"),
  };
  const values = { email: raw.email };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors<LoginField>(parsed.error), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // Bewusst generisch: verrät nicht, ob die E-Mail existiert.
    return { formError: "E-Mail oder Passwort falsch.", values };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
