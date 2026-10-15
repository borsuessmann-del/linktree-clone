# 07 — Link-CRUD

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
User legen Links (Titel + URL) an, bearbeiten sie inline, blenden sie per Schalter aus und löschen sie mit Rückgängig-Option.

## Abhängigkeiten
- 05 — Dashboard-Slot „Links"

## Out of Scope
- Sortieren per Drag-and-Drop (Spec 08) · Link-Typen außer `http(s)` · Thumbnails/Icons pro Link

## Akzeptanzkriterien
- [x] „+ Link hinzufügen" öffnet Inline-Formular (Titel max. 80, URL `http(s)://`, Hinweis bei fehlendem Schema: „https:// ergänzen?")
- [x] Neuer Link erscheint **oben** (`position = min(position) − 1`)
- [x] Bearbeiten inline in der Link-Card (Stift-Icon → Felder → Speichern/Abbrechen, Escape bricht ab)
- [x] Sichtbarkeits-`Switch` pro Link; ausgeblendete Links im Editor gedimmt mit Label „Ausgeblendet"
- [x] Löschen: Link verschwindet sofort, Sonner-Toast „Link gelöscht · Rückgängig" (5 s); Rückgängig stellt Link mit gleicher ID, Position, Sichtbarkeit wieder her
- [x] Server Actions `createLink`, `updateLink`, `toggleLinkVisibility`, `deleteLink`, `restoreLink` — alle mit Zod + `requireUser`; Fremd-IDs scheitern an RLS
- [x] Limit 100 Links mit verständlicher Meldung
- [x] Empty State: Illustration/Icon + „Füge deinen ersten Link hinzu" + großer CTA
- [x] `revalidatePath` der Public-Page nach jeder Änderung

## Tasks
1. Zod-Schema `linkSchema` (URL-Check: `new URL()` + Protokoll-Whitelist)
2. Server Actions
3. `LinkEditorCard` (Anzeige / Bearbeiten), `AddLinkForm`, `EmptyLinks`
4. Undo-Logik mit Snapshot im Client

## Validation
- CRUD-Durchlauf im Browser inkl. Undo; Reload bestätigt Zustand
- Negativ: `javascript:alert(1)`, `ftp://x`, leerer Titel, 81 Zeichen → abgelehnt
- Zweiter Test-User kann fremde Link-ID nicht ändern/löschen (Action liefert Fehler)
- Screenshots Light + Dark, 390px + Desktop

## Relevante Rules / Skills
- `rules/verification.md` · `references/sparring.md` · Skill: shadcn

## Debrief
- Dateien: `src/lib/validation/link.ts`, `src/lib/data/links.ts`, `src/app/dashboard/link-actions.ts`, `src/components/dashboard/links/{links-editor,link-editor-card,link-form,empty-links}.tsx`, `src/app/dashboard/page.tsx`. Neue shadcn-Komponenten: empty, badge.
- Migration `allow_negative_link_position`: Die in Spec 02 zusätzlich eingebaute Regel `position >= 0` widersprach „neu oben = min(position) − 1“ und wurde entfernt.
- Optimistische UI per `useState` (sofort sichtbar, Rollback + Toast bei Fehler). Actions geben die gespeicherte Zeile zurück; das Dashboard wird nicht neu gerendert, nur `/u/<username>` per `revalidatePath`.
- URL-Prüfung: Regex `^https?://` + `new URL()` + Protokoll-Whitelist; Vorschlag „https:// ergänzen?“ nur für Eingaben ohne Schema (nicht für `javascript:`/`ftp:`).
- Validation (browser-use): Empty State → 3 Links (neu oben) · leer/`javascript:alert(1)`/`ftp://x`/81 Zeichen → Meldung · Bearbeiten mit Escape (Fokus zurück auf Stift) und Speichern · Ausblenden (gedimmt + Badge) · Löschen → Toast → Rückgängig (DB: gleiche Position, Sichtbarkeit) · Reload bestätigt Zustand · Light/Dark × 1440/390 ohne Overflow.
- Fremd-ID-Test: User B mit manipulierten Action-Requests (UUID → Link von A) → Toggle/Edit/Delete jeweils „Link nicht gefunden“, UI rollt zurück, A's Daten unverändert.
- Limit: UI zeigt 99, DB hat 100 → Server-Meldung „Maximum von 100 Links erreicht“; nach Reload Button gesperrt + Hinweis. Testdaten gelöscht.
- Offen (nicht Spec 07): Wird ein eingeloggter Account gelöscht, ist das JWT bis zum Ablauf noch gültig → Dashboard wirft „Profil konnte nicht geladen werden“. Sauber wäre `signOut` + Redirect im Fehlerfall.
