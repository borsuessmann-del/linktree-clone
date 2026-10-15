"use client";

import { CheckIcon, TriangleAlertIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAccentColor } from "@/app/dashboard/design-actions";
import { useEditor } from "@/components/dashboard/editor-context";
import { UserTheme } from "@/components/user-theme";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  ACCENT_PRESETS,
  contrastRatio,
  getContrastForeground,
  isHexColor,
  normalizeHex,
  PAGE_BACKGROUNDS,
} from "@/lib/theme/color";
import { cn } from "@/lib/utils";

/** WCAG-Minimum für Bedienelemente/Ränder gegenüber dem Hintergrund. */
const MIN_UI_CONTRAST = 3;

export function AccentPicker() {
  // Auswahl liegt im Editor-Context, damit die Live-Preview sofort mitfärbt.
  const { accent: selected, setAccent: setSelected } = useEditor();
  const [saved, setSaved] = useState(selected);
  const [hexText, setHexText] = useState(selected);
  const [hexError, setHexError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const presetValue = ACCENT_PRESETS.some((preset) => preset.value === selected) ? selected : "";
  const isCustom = presetValue === "";
  const warnings = isCustom
    ? [
        contrastRatio(selected, PAGE_BACKGROUNDS.light) < MIN_UI_CONTRAST &&
          "Auf hellem Hintergrund ist diese Farbe schwach sichtbar.",
        contrastRatio(selected, PAGE_BACKGROUNDS.dark) < MIN_UI_CONTRAST &&
          "Auf dunklem Hintergrund ist diese Farbe schwach sichtbar.",
      ].filter((warning): warning is string => Boolean(warning))
    : [];

  function choose(hex: string) {
    const normalized = normalizeHex(hex);
    setSelected(normalized);
    setHexText(normalized);
    setHexError(undefined);
  }

  function handleHexChange(text: string) {
    setHexText(text);
    if (isHexColor(text)) {
      setSelected(normalizeHex(text));
      setHexError(undefined);
    }
  }

  function handleSave() {
    if (!isHexColor(hexText)) {
      setHexError("Bitte gib einen Hex-Wert im Format #rrggbb ein, z. B. #1a2b3c.");
      return;
    }
    startTransition(async () => {
      const result = await updateAccentColor(selected);
      if (result.ok) {
        setSaved(result.data.accent_color);
        toast.success("Farbe gespeichert");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">Vorlagen</FieldLegend>
        <RadioGroupPrimitive.Root
          value={presetValue}
          onValueChange={choose}
          aria-label="Farbvorlagen"
          className="flex flex-wrap gap-2.5"
        >
          {ACCENT_PRESETS.map((preset) => (
            <RadioGroupPrimitive.Item
              key={preset.value}
              value={preset.value}
              aria-label={preset.name}
              title={preset.name}
              style={{ backgroundColor: preset.value }}
              className="flex size-9 items-center justify-center rounded-full shadow-sm ring-1 ring-foreground/10 transition-transform duration-150 ease-out outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:scale-100"
            >
              <RadioGroupPrimitive.Indicator>
                <CheckIcon
                  className="size-4"
                  strokeWidth={3}
                  style={{ color: getContrastForeground(preset.value) }}
                  aria-hidden
                />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
          ))}
        </RadioGroupPrimitive.Root>
      </FieldSet>

      <Field data-invalid={Boolean(hexError)}>
        <FieldLabel htmlFor="accent-hex">Eigene Farbe</FieldLabel>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selected}
            onChange={(event) => choose(event.target.value)}
            aria-label="Farbwähler"
            className={cn(
              "size-9 shrink-0 cursor-pointer rounded-lg border bg-card p-1 transition-shadow duration-150 ease-out hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isCustom && "ring-2 ring-ring",
            )}
          />
          <Input
            id="accent-hex"
            value={hexText}
            onChange={(event) => handleHexChange(event.target.value)}
            onBlur={() =>
              setHexError(
                isHexColor(hexText)
                  ? undefined
                  : "Bitte gib einen Hex-Wert im Format #rrggbb ein, z. B. #1a2b3c.",
              )
            }
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            className="max-w-32 font-mono"
            aria-invalid={Boolean(hexError)}
            aria-describedby="accent-hex-hint"
          />
        </div>
        <div id="accent-hex-hint" aria-live="polite" className="flex flex-col gap-1">
          {hexError && <FieldError>{hexError}</FieldError>}
          {warnings.map((warning) => (
            <FieldDescription key={warning} className="flex items-center gap-1.5">
              <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
              {warning}
            </FieldDescription>
          ))}
        </div>
      </Field>

      <Field>
        <FieldTitle>Vorschau</FieldTitle>
        <UserTheme
          accent={selected}
          className="rounded-2xl bg-background bg-[radial-gradient(80%_120%_at_50%_0%,color-mix(in_oklch,var(--brand)_14%,transparent),transparent)] p-4 ring-1 ring-foreground/10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              aria-hidden
              className="size-9 rounded-full bg-linear-to-br from-brand/75 to-brand ring-2 ring-brand ring-offset-2 ring-offset-background"
            />
            <Button type="button" tabIndex={-1}>
              Beispiel-Button
            </Button>
            <span className="rounded-xl border border-brand bg-card px-3 py-1.5 text-sm font-medium shadow-sm">
              Link-Card
            </span>
          </div>
        </UserTheme>
      </Field>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending || selected === saved}>
          {isPending && <Spinner data-icon="inline-start" />}
          Farbe speichern
        </Button>
      </div>
    </FieldGroup>
  );
}
