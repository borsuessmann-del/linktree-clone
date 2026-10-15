"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  checkUsername,
  signup,
  type SignupState,
  type UsernameStatus,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  normalizeUsername,
  usernameSchema,
  USERNAME_MAX_LENGTH,
  type SignupField,
} from "@/lib/validation/auth";

const FIELDS: SignupField[] = ["email", "password", "username"];
const CHECK_DELAY_MS = 400;

type LiveStatus =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "checking" }
  | { kind: Exclude<UsernameStatus, "invalid"> };

function localStatus(value: string): LiveStatus {
  if (!value) return { kind: "idle" };
  const parsed = usernameSchema.safeParse(value);
  return parsed.success
    ? { kind: "checking" }
    : { kind: "invalid", message: parsed.error.issues[0].message };
}

export function SignupForm({ initialUsername }: { initialUsername: string }) {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signup,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [username, setUsername] = useState(initialUsername);
  const [status, setStatus] = useState<LiveStatus>(() => localStatus(initialUsername));
  const latestUsername = useRef(initialUsername);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function scheduleCheck(value: string) {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const result = await checkUsername(value);
      // Nur die Antwort zur aktuellen Eingabe übernehmen.
      if (latestUsername.current === value) {
        setStatus(
          result === "invalid" ? localStatus(value) : { kind: result },
        );
      }
    }, CHECK_DELAY_MS);
  }

  function handleUsernameChange(raw: string) {
    const value = normalizeUsername(raw);
    setUsername(value);
    latestUsername.current = value;
    const next = localStatus(value);
    setStatus(next);
    if (next.kind === "checking") {
      scheduleCheck(value);
    } else {
      clearTimeout(timer.current);
    }
  }

  // Vorausgefüllten Username (?username=) einmal prüfen; Timer beim Verlassen aufräumen.
  useEffect(() => {
    if (localStatus(initialUsername).kind === "checking") {
      scheduleCheck(initialUsername);
    }
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim ersten Rendern
  }, []);

  // Nach dem Absenden: Fokus auf das erste fehlerhafte Feld.
  useEffect(() => {
    const firstInvalid = FIELDS.find((field) => state.fieldErrors?.[field]);
    if (firstInvalid) {
      const element = formRef.current?.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
    }
  }, [state]);

  const errors = state.fieldErrors ?? {};
  // Server-Fehler zum Username gilt nur, solange die Eingabe unverändert ist.
  const usernameServerError =
    errors.username && state.values?.username === username ? errors.username : undefined;
  const usernameError =
    usernameServerError ??
    (status.kind === "invalid"
      ? status.message
      : status.kind === "taken"
        ? "Dieser Username ist bereits vergeben."
        : undefined);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">E-Mail</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.values?.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          <FieldError id="email-error">{errors.email}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="password">Passwort</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : "password-hint"}
            required
          />
          {errors.password ? (
            <FieldError id="password-error">{errors.password}</FieldError>
          ) : (
            <FieldDescription id="password-hint">Mindestens 8 Zeichen.</FieldDescription>
          )}
        </Field>

        <Field data-invalid={Boolean(usernameError)}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>/u/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="username"
              name="username"
              value={username}
              onChange={(event) => handleUsernameChange(event.target.value)}
              maxLength={USERNAME_MAX_LENGTH}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={Boolean(usernameError)}
              aria-describedby="username-status"
              required
            />
            {status.kind === "checking" && (
              <InputGroupAddon align="inline-end">
                <Spinner aria-hidden />
              </InputGroupAddon>
            )}
            {status.kind === "available" && !usernameServerError && (
              <InputGroupAddon align="inline-end">
                <CheckIcon className="text-success" aria-hidden />
              </InputGroupAddon>
            )}
          </InputGroup>
          <div id="username-status" aria-live="polite">
            {usernameError ? (
              <FieldError>{usernameError}</FieldError>
            ) : status.kind === "available" ? (
              <FieldDescription className="text-success">
                /u/{username} ist verfügbar ✓
              </FieldDescription>
            ) : status.kind === "checking" ? (
              <FieldDescription>Prüfe Verfügbarkeit …</FieldDescription>
            ) : status.kind === "error" ? (
              <FieldDescription>
                Verfügbarkeit konnte nicht geprüft werden – wird beim Absenden erneut geprüft.
              </FieldDescription>
            ) : (
              <FieldDescription>Deine Seite: /u/dein-name</FieldDescription>
            )}
          </div>
        </Field>

        {state.formError && <FieldError>{state.formError}</FieldError>}

        <Field>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Konto erstellen
          </Button>
          <FieldDescription className="text-center">
            Schon ein Konto? <Link href="/login">Anmelden</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
