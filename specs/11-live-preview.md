# 11 — Live-Preview im Dashboard

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Rechts im Dashboard (Mobile: Tab „Vorschau") sieht der User seine Public-Page in einem Handy-Rahmen — und jede Änderung an Profil, Links, Reihenfolge, Sichtbarkeit und Farbe sofort, noch während er tippt bzw. zieht.

## Abhängigkeiten
- 06, 07, 08 — Editor-Zustände · 10 — `PublicProfile`-Komponente

## Out of Scope
- Desktop-Ansicht der Public-Page in der Preview · iframe-Lösung

## Akzeptanzkriterien
- [x] `PhoneFrame`-Komponente: `rounded-[2.5rem]`, Rahmen mit Gradient + mehrschichtigem Schatten, ~375×760, sticky
- [x] Rendert `PublicProfile` mit `UserTheme` aus **Client-State** (nicht erst nach Speichern)
- [x] Gemeinsamer Editor-State (z. B. React Context `EditorProvider`) für Profil, Links, Accent — Editoren aus 06/07/08/09 schreiben hinein, Preview liest
- [x] Ausgeblendete Links fehlen in der Preview, Reihenfolge folgt live dem Drag
- [x] Links in der Preview nicht klickbar (Hinweis-Tooltip „Vorschau")
- [x] Mobile: Preview im Tab „Vorschau" in voller Breite ohne Rahmen

## Tasks
1. `EditorProvider` (Client) mit initialen Server-Daten
2. Editoren aus 06–09 an Provider anbinden (minimale Umbauten)
3. `PhoneFrame` + Einbau in Preview-Slot aus 05

## Validation
- browser-use: Name tippen → Preview ändert sich ohne Speichern; Farbe wechseln → Preview sofort; Link ausblenden → verschwindet
- Nach Reload: gespeicherter Stand = Preview
- Light + Dark, 1440px + 390px (Tab)

## Relevante Rules / Skills
- `references/design-analysis.md` §7 (Dashboard) · `rules/design-system.md`

## Debrief
- Dateien: `src/components/dashboard/{editor-context,live-preview,phone-frame}.tsx` (neu), `preview-slot.tsx` entfernt; angebunden: `profile-form.tsx`, `accent-picker.tsx`, `links/links-editor.tsx`; `PublicProfile`/`PublicLinkList` mit `preview`-Prop; `src/app/dashboard/page.tsx` lädt Profil + Links gemeinsam; Arbeitsbereich rechts 395px.
- `EditorProvider` (React Context) hält Profil-Entwurf, Accent und Link-Liste; die Editoren ersetzen nur ihren eigenen `useState` durch den Context, Speicher-Logik unverändert.
- Preview-Modus: Links/Footer als `<span>` mit Tooltip „Vorschau – auf deiner Seite klickbar“, `<div>`/`<p>` statt `<main>`/`<h1>`, Umsortieren per Motion `layout` weich animiert. Avatar-Vorschau lädt nur gültige https-URLs.
- Visual-Iteration: Deko-Notch entfernt (im Dark Mode hell, kollidierte mit Avatar-Ring); Avatar im Profil-Formular nutzt jetzt ebenfalls die aktuelle Accent-Farbe.
- Validation (browser-use): Name/Bio tippen → Preview ohne Speichern · Farbe Rose → sofort · Link ausblenden → verschwindet · ↑ und **mitten im Drag** folgt die Preview · 0 Anker in der Preview, Tooltip sichtbar · nach Speichern + Reload: Preview = gespeicherter Stand = Public-Page · 1440 mit Rahmen, 390 im Tab „Vorschau“ ohne Rahmen, Light + Dark, kein Overflow. Testdaten gelöscht.
