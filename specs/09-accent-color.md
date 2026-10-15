# 09 — Accent-Color

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
User wählen ihre Seitenfarbe aus 10 Presets oder per eigenem Farbwähler; die Farbe wird dreifach validiert gespeichert und über eine wiederverwendbare `UserTheme`-Komponente sicher als CSS-Variable `--brand` gerendert.

## Abhängigkeiten
- 05 — Dashboard-Slot „Design"

## Out of Scope
- Weitere Theme-Optionen (Fonts, Hintergründe, Hell/Dunkel pro Seite) — Backlog

## Akzeptanzkriterien
- [x] `src/lib/theme/color.ts`: `isHexColor()` (Regex `/^#[0-9a-f]{6}$/i`), `normalizeHex()` (lowercase), `getContrastForeground(hex)` (WCAG-Luminanz → `#ffffff` bei Kontrast ≥ 4.5, sonst `#0a0a0a`), `safeAccent(value)` (ungültig → Default `#4f46e5`)
- [x] Unit-artige Prüfung der Funktionen (kleines Testskript oder `node --test`) inkl. `red;} body{}`, `url(x)`, `#FFF`, `#12345g`
- [x] `UserTheme`-Komponente: `<div className="user-theme" style={{ '--brand': c, '--brand-foreground': fg }}>`; in `globals.css` leitet `.user-theme` `--primary`, `--primary-foreground`, `--ring` ab
- [x] Nie `<style>`-Tag oder `dangerouslySetInnerHTML` mit User-Wert
- [x] Picker: 10 Preset-Swatches (Indigo `#4f46e5`, Blau `#2563eb`, Cyan `#0891b2`, Smaragd `#059669`, Limette `#65a30d`, Amber `#d97706`, Orange `#ea580c`, Rose `#e11d48`, Pink `#db2777`, Violett `#7c3aed`) als Radio-Gruppe (Pfeiltasten, sichtbarer Fokus, Häkchen bei Auswahl) + „Eigene Farbe" (`<input type="color">` + Hex-Feld)
- [x] Server Action `updateAccentColor`: Zod mit derselben Regex, normalisiert, ablehnen statt korrigieren; DB-CHECK als dritte Schicht
- [x] Sofortige Vorschau (Swatch-Muster-Button im Picker) vor dem Speichern
- [x] Kontrast-Hinweis, wenn eine eigene Farbe auf hellem bzw. dunklem Seitenhintergrund schwach ist (Warnung, kein Block)

## Tasks
1. `color.ts` + Tests
2. `UserTheme` + CSS in `globals.css`
3. `AccentPicker` (Client) + Server Action
4. Einbau in Dashboard-Section „Design"

## Validation
- Sicherheits-Checkliste aus `references/discovery.md` §3 vollständig abhaken
- Manuell: Action mit `red;} body{background:url(x)}` und `url(x)` aufrufen → abgelehnt
- DB: `update profiles set accent_color='red'` → Fehler
- Alle 10 Presets: Button-Text lesbar (Kontrast ≥ 4.5) in Light + Dark

## Relevante Rules / Skills
- `rules/design-system.md` (Accent-Color-Sicherheit) · `guidelines.md` 002 · `references/discovery.md` §3

## Debrief
- Dateien: `src/lib/theme/color.ts` (+ `color.test.mjs`, `npm test`), `src/components/user-theme.tsx`, `src/app/dashboard/design-actions.ts`, `src/components/dashboard/accent-picker.tsx`, `.user-theme` in `globals.css`, `src/app/dashboard/page.tsx`.
- Tests mit `node --test` (Node 24 lädt `.ts` direkt): 6/6 grün, inkl. `red;} body{}`, `url(x)`, `#FFF`, `#12345g`, Leerzeichen; alle 10 Presets mit Button-Text-Kontrast 4.60–6.41.
- Kontrast-Hinweis (< 3:1 gegenüber `#f4f4f5` bzw. `#09090b`) nur für eigene Farben – Limette/Amber liegen auf hellem Grund bei ~2.8–2.9, sind als Presets aber gewollt.
- Picker: Radix-RadioGroup-Primitive (Pfeiltasten, Roving Focus) mit Swatches; Häkchen in Kontrastfarbe; Farbwähler + Hex-Feld (kein Auto-Korrigieren); Vorschau über `UserTheme`.
- Sicherheits-Checkliste `discovery.md` §3: Regex client ✓ · Server-Regex lehnt ab ✓ · DB-CHECK (`'red'` → check_violation) ✓ · RLS ✓ · nur `style`-Objekt, kein `<style>`/`dangerouslySetInnerHTML` (grep) ✓ · ungültiger Wert → Default (`safeAccent`, Unit-Test) ✓ · Payloads `red;} body{background:url(x)}` und `url(x)` per manipuliertem Request → abgelehnt ✓.
- Validation (browser-use): Pfeiltasten wechseln Preset mit Fokus-Ring · Vorschau sofort (Limette → dunkle Schrift) · Speichern → Toast, Reload zeigt Auswahl · ungültige Hex → Meldung · Kontrast-Hinweise hell/dunkel · Light/Dark × 1440/390 ohne Overflow. Testdaten gelöscht.
- Stolperstein: `.user-theme` kam im Browser erst an, nachdem `globals.css` über den Editor statt per Git-Bash-Append geändert wurde (Turbopack-Watcher, siehe learning.md).
