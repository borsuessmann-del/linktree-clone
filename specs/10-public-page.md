# 10 — Public-Page `/u/<username>`

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Jeder Besucher sieht unter `/u/<username>` eine hochwertige, mobile-first Seite mit Avatar, Name, Bio und den sichtbaren Links in der gewählten Reihenfolge und Farbe; unbekannte Usernames zeigen eine freundliche 404.

## Abhängigkeiten
- 02 — Daten + RLS · 03 — Server-Client · 09 — `UserTheme`, `safeAccent`

## Out of Scope
- Klick-Analytics jeder Art · Social-Icon-Zeile · Sektionen

## Akzeptanzkriterien
- [x] Route `src/app/u/[username]/page.tsx` (Server Component); Username wird lowercase gesucht; unbekannt → `notFound()`
- [x] Nur `is_visible = true`-Links, sortiert nach `position`
- [x] Komponenten wiederverwendbar für die Preview (Spec 11): `PublicProfile` (reine Darstellung, Props statt Datenabruf)
- [x] Layout nach design-analysis §6/§7: eine Spalte, max. ~560px, Gutter 16px; Avatar 96px mit Brand-Ring; Name 24px w600; Bio muted; Link-Cards min. 56px, `rounded-2xl`, Gradient + Lichtkante + weicher Mehrfachschatten; Hover lift + Brand-Rand, Active `scale-[.98]`, 150ms ease-out
- [x] Hintergrund: Canvas + dezenter Radial-Glow aus `--brand` (keine flache Fläche)
- [x] Links öffnen im neuen Tab mit `rel="noopener noreferrer"`; Focus-Ring sichtbar
- [x] Einblenden mit Stagger (Motion, 30–50ms), `prefers-reduced-motion` respektiert
- [x] Dark Mode folgt Besucher-System
- [x] Empty State: „Hier gibt's noch keine Links."
- [x] Footer-Pill „Erstellt mit <App> · Eigene Seite erstellen" → `/signup`
- [x] `generateMetadata`: Titel „<Display-Name> (@username)", Description = Bio
- [x] 404 (`not-found.tsx`): im App-Design, „Diese Seite gibt es nicht" + CTA „Eigene Seite erstellen"
- [x] Mit `cacheComponents`: Datenabruf in passender Suspense-/Cache-Struktur; Änderungen aus dem Dashboard erscheinen nach `revalidatePath` sofort

## Tasks
1. Next-16-Docs: Dynamic Routes, `params` (async), `notFound`, Caching mit `cacheComponents`
2. Datenabruf-Funktion `getPublicProfile(username)`
3. `PublicProfile`, `PublicLinkCard`, `ProfileHeader`, Footer-Pill
4. `not-found.tsx`
5. Visual Verification Loop (3–4 Iterationen)

## Validation
- browser-use: Profil mit 0, 3 und 12 Links; 390px + 1440px; Light + Dark; 3 verschiedene Presets
- Ausgeblendeter Link erscheint nicht; Reihenfolge = Dashboard
- `/u/gibtsnicht` → 404-Seite mit CTA
- Lighthouse-Check Accessibility ≥ 95 (optional)

## Relevante Rules / Skills
- `rules/design-system.md` · `references/design-analysis.md` · Skill: shadcn

## Debrief
- Dateien: `src/app/u/[username]/{page,not-found}.tsx`, `src/app/not-found.tsx`, `src/components/public/{public-profile,public-link-list,not-found-view}.tsx`, `src/lib/data/public-profile.ts`, `src/lib/supabase/public.ts`; Actions (Links, Profil, Farbe, Sign-up) nutzen jetzt `refreshPublicProfile()`.
- Caching (Next-16-Docs Caching/Revalidating/Dynamic Routes): `getPublicProfile()` mit `'use cache'`, `cacheLife('hours')`, `cacheTag('public-profile:<username>')` und cookie-freiem Supabase-Client (Rolle `anon`, RLS). Actions rufen `updateTag()` (sofort, read-your-own-writes) + `revalidatePath()`. Sign-up leert das Tag, damit ein vorher gecachtes „gibt es nicht“ verschwindet. `params` sind Laufzeit-Daten → Inhalt hinter `<Suspense>` mit Skeleton; Build: Partial Prerender.
- 404: Weil gestreamt wird, bleibt der HTTP-Status laut Next-Docs 200; Next setzt `<meta name="robots" content="noindex">`, Titel „Seite nicht gefunden“, 404-Ansicht mit CTA. Echter 404-Status bräuchte eine DB-Abfrage im Proxy – bewusst nicht gemacht.
- Validation (browser-use): leeres Profil → Empty State · Änderungen im Dashboard (Name, Bio, Farbe Rose, 3 Links, 1 ausgeblendet) sofort öffentlich sichtbar, ausgeblendeter Link fehlt, Reihenfolge = Dashboard · 12 Links · `target=_blank` + `rel="noopener noreferrer"` · Fokus-Ring per Tab · Hover: `translate -1px` + Brand-Ring · Presets Rose/Limette/Indigo × 390/1440 × Light/Dark ohne Overflow · `/u/PubTest` → gleiche Seite · `/u/gibtsnicht` → 404-Ansicht. Testdaten gelöscht.
- Hinweis Dark Mode: Die Seite folgt dem Besucher-System; wer im Dashboard per Toggle „Hell“/„Dunkel“ fest gewählt hat, sieht diese Wahl (next-themes, gleiche Origin) auch auf Public-Pages.
- Lighthouse (optional) nicht ausgeführt.
