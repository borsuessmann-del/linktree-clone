"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateProfile, type SavedProfile } from "@/app/dashboard/profile-actions";
import { useEditor } from "@/components/dashboard/editor-context";
import { ProfileAvatar } from "@/components/profile-avatar";
import { UserTheme } from "@/components/user-theme";
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
import { Textarea } from "@/components/ui/textarea";
import {
  AVATAR_URL_MAX,
  BIO_MAX,
  DISPLAY_NAME_MAX,
  isHttpsUrl,
  profileSchema,
  type ProfileField,
  type ProfileInput,
} from "@/lib/validation/profile";

type FieldErrors = Partial<Record<ProfileField, string>>;
const FIELDS: ProfileField[] = ["display_name", "bio", "avatar_url"];

function toInput(profile: SavedProfile): ProfileInput {
  return {
    display_name: profile.display_name ?? "",
    bio: profile.bio ?? "",
    avatar_url: profile.avatar_url ?? "",
  };
}

export function ProfileForm() {
  const formRef = useRef<HTMLFormElement>(null);
  // Entwurf liegt im Editor-Context, damit die Live-Preview beim Tippen mitläuft.
  const { username, profile: values, setProfile: setValues, accent } = useEditor();
  const [saved, setSaved] = useState(values);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const isDirty = FIELDS.some((field) => values[field].trim() !== saved[field].trim());
  const avatarUrl = values.avatar_url.trim();
  // Vorschau nur für gültige https-Adressen laden – nie javascript:, http: o. Ä.
  const previewSrc = isHttpsUrl(avatarUrl) ? avatarUrl : null;
  const previewName = values.display_name.trim() || username;

  function setField(field: ProfileField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function focusFirstError(errors: FieldErrors) {
    const first = FIELDS.find((field) => errors[field]);
    const element = first ? formRef.current?.elements.namedItem(first) : null;
    if (element instanceof HTMLElement) element.focus();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);

    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as ProfileField] ??= issue.message;
      }
      setFieldErrors(errors);
      focusFirstError(errors);
      return;
    }

    startTransition(async () => {
      const result = await updateProfile(values);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.fieldErrors ? undefined : result.error);
        focusFirstError(result.fieldErrors ?? {});
        return;
      }
      const next = toInput(result.data);
      setSaved(next);
      setValues(next);
      toast.success("Profil gespeichert");
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <UserTheme accent={accent} className="flex items-center gap-4">
          <ProfileAvatar src={previewSrc} name={previewName} className="size-16 text-xl" />
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-medium">{previewName}</p>
            <p className="truncate text-sm text-muted-foreground">/u/{username}</p>
          </div>
        </UserTheme>

        <Field data-invalid={Boolean(fieldErrors.display_name)}>
          <FieldLabel htmlFor="display_name">Anzeigename</FieldLabel>
          <Input
            id="display_name"
            name="display_name"
            value={values.display_name}
            onChange={(event) => setField("display_name", event.target.value)}
            maxLength={DISPLAY_NAME_MAX}
            placeholder={username}
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.display_name)}
            aria-describedby="display_name-hint"
          />
          <div id="display_name-hint">
            {fieldErrors.display_name ? (
              <FieldError>{fieldErrors.display_name}</FieldError>
            ) : (
              <FieldDescription>
                {values.display_name.trim().length}/{DISPLAY_NAME_MAX} Zeichen
              </FieldDescription>
            )}
          </div>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.bio)}>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea
            id="bio"
            name="bio"
            value={values.bio}
            onChange={(event) => setField("bio", event.target.value)}
            maxLength={BIO_MAX}
            rows={3}
            placeholder="Ein Satz über dich"
            aria-invalid={Boolean(fieldErrors.bio)}
            aria-describedby="bio-hint"
          />
          <div id="bio-hint">
            {fieldErrors.bio ? (
              <FieldError>{fieldErrors.bio}</FieldError>
            ) : (
              <FieldDescription>
                {values.bio.trim().length}/{BIO_MAX} Zeichen
              </FieldDescription>
            )}
          </div>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.avatar_url)}>
          <FieldLabel htmlFor="avatar_url">Avatar-URL</FieldLabel>
          <Input
            id="avatar_url"
            name="avatar_url"
            type="url"
            inputMode="url"
            value={values.avatar_url}
            onChange={(event) => setField("avatar_url", event.target.value)}
            maxLength={AVATAR_URL_MAX}
            placeholder="https://…"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(fieldErrors.avatar_url)}
            aria-describedby="avatar_url-hint"
          />
          <div id="avatar_url-hint">
            {fieldErrors.avatar_url ? (
              <FieldError>{fieldErrors.avatar_url}</FieldError>
            ) : (
              <FieldDescription>
                Optional. Link zu einem Bild (nur https://). Ohne Bild zeigen wir deine
                Initialen.
              </FieldDescription>
            )}
          </div>
        </Field>

        {formError && <FieldError>{formError}</FieldError>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending && <Spinner data-icon="inline-start" />}
            Speichern
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
