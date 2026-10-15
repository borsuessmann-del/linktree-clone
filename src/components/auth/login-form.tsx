"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

import { login, type LoginState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { LoginField } from "@/lib/validation/auth";

const FIELDS: LoginField[] = ["email", "password"];

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Nach dem Absenden: Fokus auf das erste fehlerhafte Feld bzw. bei falschem Login aufs Passwort.
  useEffect(() => {
    const firstInvalid =
      FIELDS.find((field) => state.fieldErrors?.[field]) ??
      (state.formError ? "password" : undefined);
    if (firstInvalid) {
      const element = formRef.current?.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
    }
  }, [state]);

  const errors = state.fieldErrors ?? {};

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
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            required
          />
          <FieldError id="password-error">{errors.password}</FieldError>
        </Field>

        {state.formError && <FieldError>{state.formError}</FieldError>}

        <Field>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Anmelden
          </Button>
          <FieldDescription className="text-center">
            Noch kein Konto? <Link href="/signup">Registrieren</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
