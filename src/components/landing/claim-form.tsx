"use client";

import { ArrowRightIcon } from "lucide-react";
import Form from "next/form";
import { useRef, useState } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  usernameSchema,
} from "@/lib/validation/auth";

/** Claim-Feld „/u/[name] Loslegen →“ – übergibt den Wunschnamen an /signup?username=… */
export function ClaimForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [showEmptyError, setShowEmptyError] = useState(false);

  const parsed = username ? usernameSchema.safeParse(username) : null;
  const error =
    parsed && !parsed.success
      ? parsed.error.issues[0].message
      : showEmptyError
        ? "Bitte gib deinen Wunschnamen ein."
        : undefined;

  return (
    <Form
      action="/signup"
      noValidate
      onSubmit={(event) => {
        // Nur gültige Namen weitergeben – die endgültige Prüfung macht der Sign-up.
        if (!username || error) {
          event.preventDefault();
          setShowEmptyError(!username);
          inputRef.current?.focus();
        }
      }}
      className="w-full max-w-md"
    >
      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor="claim-username" className="sr-only">
          Wunsch-Username
        </FieldLabel>
        <InputGroup className="h-12 rounded-2xl bg-card shadow-md">
          <InputGroupAddon className="pl-4">
            <InputGroupText className="text-base">/u/</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            ref={inputRef}
            id="claim-username"
            name="username"
            value={username}
            onChange={(event) => {
              setUsername(normalizeUsername(event.target.value));
              setShowEmptyError(false);
            }}
            maxLength={USERNAME_MAX_LENGTH}
            placeholder="dein-name"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="text-base"
            aria-invalid={Boolean(error)}
            aria-describedby="claim-hint"
          />
          <InputGroupAddon align="inline-end" className="pr-1.5">
            <InputGroupButton type="submit" variant="default" size="sm" className="h-9 rounded-xl px-4">
              Loslegen
              <ArrowRightIcon data-icon="inline-end" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div id="claim-hint" aria-live="polite" className="min-h-5 pl-1">
          {error ? (
            <FieldError>{error}</FieldError>
          ) : (
            <FieldDescription>Kostenlos · in einer Minute fertig</FieldDescription>
          )}
        </div>
      </Field>
    </Form>
  );
}
