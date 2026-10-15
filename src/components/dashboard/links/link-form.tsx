"use client";

import { useId, useState, useTransition, type KeyboardEvent } from "react";

import type { LinkActionResult } from "@/app/dashboard/link-actions";
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
import {
  LINK_TITLE_MAX,
  LINK_URL_MAX,
  linkInputSchema,
  suggestHttps,
  type LinkField,
  type LinkInput,
} from "@/lib/validation/link";

type FieldErrors = Partial<Record<LinkField, string>>;

/** Inline-Formular für neue und bestehende Links. Escape bricht ab. */
export function LinkForm({
  initial = { title: "", url: "" },
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: LinkInput;
  submitLabel: string;
  onSubmit: (values: LinkInput) => Promise<LinkActionResult<unknown>>;
  onCancel: () => void;
}) {
  const id = useId();
  const [title, setTitle] = useState(initial.title);
  const [url, setUrl] = useState(initial.url);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const httpsSuggestion = suggestHttps(url);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError(undefined);

    const parsed = linkInputSchema.safeParse({ title, url });
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as LinkField;
        errors[field] ??= issue.message;
      }
      setFieldErrors(errors);
      focusFirstError(form, errors);
      return;
    }

    setFieldErrors({});
    startTransition(async () => {
      const result = await onSubmit(parsed.data);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.fieldErrors ? undefined : result.error);
        focusFirstError(form, result.fieldErrors ?? {});
      }
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(fieldErrors.title)}>
          <FieldLabel htmlFor={`${id}-title`}>Titel</FieldLabel>
          <Input
            id={`${id}-title`}
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={LINK_TITLE_MAX}
            placeholder="z. B. Mein Portfolio"
            autoComplete="off"
            autoFocus
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={`${id}-title-hint`}
          />
          <div id={`${id}-title-hint`}>
            {fieldErrors.title ? (
              <FieldError>{fieldErrors.title}</FieldError>
            ) : (
              <FieldDescription>
                {title.trim().length}/{LINK_TITLE_MAX} Zeichen
              </FieldDescription>
            )}
          </div>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.url)}>
          <FieldLabel htmlFor={`${id}-url`}>URL</FieldLabel>
          <Input
            id={`${id}-url`}
            name="url"
            type="url"
            inputMode="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            maxLength={LINK_URL_MAX}
            placeholder="https://…"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(fieldErrors.url)}
            aria-describedby={`${id}-url-hint`}
          />
          <div id={`${id}-url-hint`} aria-live="polite" className="flex flex-col gap-1">
            {fieldErrors.url && <FieldError>{fieldErrors.url}</FieldError>}
            {httpsSuggestion && (
              <FieldDescription>
                Fehlt das Schema?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => {
                    setUrl(httpsSuggestion);
                    setFieldErrors((errors) => ({ ...errors, url: undefined }));
                  }}
                >
                  https:// ergänzen?
                </Button>
              </FieldDescription>
            )}
          </div>
        </Field>

        {formError && <FieldError>{formError}</FieldError>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
  const first = (["title", "url"] as const).find((field) => errors[field]);
  const element = first ? form.elements.namedItem(first) : null;
  if (element instanceof HTMLElement) element.focus();
}
