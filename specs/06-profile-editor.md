# 06 — Profil-Editor

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
User bearbeiten im Dashboard Display-Name, Bio und Avatar-URL; die Änderungen werden validiert gespeichert und erscheinen auf der Public-Page.

## Abhängigkeiten
- 05 — Dashboard-Slot „Profil"

## Out of Scope
- Avatar-Upload (nur URL) · Username ändern (Backlog)

## Akzeptanzkriterien
- [x] Felder: Display-Name (max. 50, Zeichenzähler), Bio (Textarea, max. 160, Zeichenzähler), Avatar-URL (optional, nur `https://`)
- [x] Avatar-Vorschau neben dem Feld; leer oder Ladefehler → Initialen-Fallback auf Brand-Verlauf
- [x] Zod-Schema geteilt zwischen Formular und Server Action `updateProfile`
- [x] Action prüft Login (`requireUser`) und schreibt nur eigenes Profil; DB-CHECKs als dritte Schicht
- [x] Speichern-Button mit Pending-State; Erfolg → Toast „Profil gespeichert"; Fehler → Meldung am Feld
- [x] `revalidatePath('/u/<username>')` nach dem Speichern
- [x] `Avatar`-Komponente wiederverwendbar (Public-Page + Preview), nutzt `<img>` statt `next/image` (beliebige Hosts ohne Config)

## Tasks
1. Zod-Schema `profileSchema`
2. `Avatar`-Komponente mit Fallback (`onError`)
3. Formular-Komponente + Server Action
4. Einbau in Dashboard-Section „Profil"

## Validation
- Gültige Daten speichern → Reload zeigt neue Werte; Public-Page aktualisiert
- Negativ: Bio 161 Zeichen, `http://`-Avatar, `javascript:`-URL → abgelehnt
- Kaputte Bild-URL → Initialen
- Screenshots Light + Dark

## Relevante Rules / Skills
- `rules/verification.md` (UI-Komponente, Server Action) · Skill: shadcn

## Debrief
- Dateien: `src/lib/validation/profile.ts`, `src/components/profile-avatar.tsx`, `src/app/dashboard/profile-actions.ts`, `src/components/dashboard/profile-form.tsx`, `src/app/dashboard/page.tsx`. Neue shadcn-Komponente: avatar.
- `ProfileAvatar` baut auf shadcn `Avatar` (Radix) auf: rendert ein normales `<img>` (beliebige Hosts, `referrerPolicy="no-referrer"`), bei leerer URL oder Ladefehler Initialen auf Brand-Verlauf. Wiederverwendbar für Public-Page (10) und Preview (11).
- Schema wandelt leere Felder in `null` um; Avatar nur `https://` (Regex + `new URL()`). Live-Vorschau lädt nur gültige https-URLs. „Speichern“ ist nur bei Änderungen aktiv.
- Validation (browser-use): Initialen aus Username bzw. Anzeigename · echte Bild-URL lädt in der Vorschau · Speichern → Toast, Reload zeigt Werte (DB geprüft) · Bio 161, `http://`, `javascript:` → Meldung am Feld + Fokus · manipulierter Request mit `javascript:alert(1)` → Server lehnt ab · kaputte Bild-URL → Initialen · Light/Dark × 1440/390 ohne Overflow. Testdaten gelöscht.
- Public-Page-Aktualisierung (`revalidatePath`) wird mit Spec 10 sichtbar geprüft – die Seite existiert noch nicht.
