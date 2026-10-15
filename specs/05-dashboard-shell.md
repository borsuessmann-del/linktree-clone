# 05 — Dashboard-Shell

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Eingeloggte User sehen ein Dashboard mit dem finalen Layout: Header (Logo, Link zur eigenen Seite, Theme-Toggle, User-Menü mit Logout) und zweispaltigem Arbeitsbereich — links Editor-Bereiche, rechts Platz für die Phone-Preview; auf Mobile ein Umschalter „Bearbeiten / Vorschau".

## Abhängigkeiten
- 01 — Design-System · 04 — Login + Logout

## Out of Scope
- Inhalte der Editor-Bereiche (06, 07, 09) und der Preview (11) — hier nur Platzhalter-Slots

## Akzeptanzkriterien
- [x] `src/app/dashboard/layout.tsx` + `page.tsx`, geschützt via `requireUser()` (in `<Suspense>` mit Skeleton)
- [x] Header: App-Logo, Button „Meine Seite ansehen ↗" (`/u/<username>`, neuer Tab), `ThemeToggle`, User-Menü (E-Mail, Logout)
- [x] Banner „Deine Seite ist live: /u/<username>" mit Kopieren-Button (Toast „Link kopiert")
- [x] Desktop (≥ lg): Grid links Editor (Sections „Profil", „Design", „Links" als Cards), rechts sticky Preview-Slot
- [x] Mobile: Segmented Control „Bearbeiten / Vorschau" schaltet zwischen den Spalten
- [x] Layering nach design-analysis §7: Canvas-Hintergrund, Panels als Cards mit Schatten
- [x] Alle interaktiven Elemente mit Hover + Focus, 150ms ease-out

## Tasks
1. Layout + Header-Komponenten
2. `LiveBanner` mit Clipboard + Sonner-Toast
3. Responsive Grid + Mobile-Toggle (Client Component, nur der Toggle)
4. Skeletons für Suspense-Fallbacks

## Validation
- browser-use: Light + Dark, 390px + 1440px; Toggle auf Mobile; Tastatur-Navigation durch Header
- `npm run typecheck`, `npm run build`

## Relevante Rules / Skills
- `rules/design-system.md` · `references/design-analysis.md` §6, §7 · Skill: shadcn

## Debrief
- Dateien: `src/app/dashboard/{layout,page}.tsx`, `src/components/dashboard/{header,user-menu,live-banner,workspace,preview-slot}.tsx`; DAL um `requireProfile()` erweitert. Neue shadcn-Komponenten: skeleton, toggle-group (+ toggle).
- Header-Aktionen (Meine Seite, Theme, User-Menü) und Banner laden hinter `<Suspense>` mit Skeleton; Logo + Rahmen sind statisch vorgerendert (`/dashboard` = Partial Prerender).
- Mobile-Umschalter ist die einzige Client-Komponente des Layouts; beide Spalten bleiben gemountet (nur per CSS `max-lg:hidden` versteckt), damit Eingaben beim Umschalten erhalten bleiben.
- **Fix:** Dev-Overlay meldete „unstable value `Date.now()` while prerendering“ – `getClaims()` prüft den Token-Ablauf per `Date.now()`, und mit `cacheComponents` + `partialPrefetching` rendert Next auch mit Cookies vor. Lösung laut Next-Docs (Caching → Random values and timestamps): `await connection()` am Anfang von `getCurrentUser()`.
- Validation (browser-use): Light + Dark × 1440/390px ohne Overflow; Mobile-Toggle blendet Editor/Vorschau korrekt; Tab-Reihenfolge Logo → Meine Seite → Theme → User-Menü → Banner-Link, jeweils mit Focus-Ring; „Link kopieren“ → Toast + korrekte URL in der Zwischenablage; User-Menü per Tastatur → Abmelden → `/login`. typecheck/lint/build grün (Build bei gestopptem Dev-Server). Test-User gelöscht.
