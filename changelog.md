# Changelog

Chronologisches Protokoll abgeschlossener Arbeitspakete — neueste Einträge oben.

## Format
```
## YYYY-MM-DD — <Spec NN: Feature>
- Was wurde gebaut/geändert (Stichpunkte)
- Betroffene Dateien/Bereiche
```

## Einträge

## 2026-10-15 — Spec 13: Deployment
- Git-Identität, Branch `main`, 7 gebündelte Commits; Repo https://github.com/borsuessmann-del/linktree-clone
- Vercel-Deploy live unter https://linktree-clone-ebon.vercel.app (Env-Variablen gesetzt, Deployment Protection aus)
- Migrationen als `supabase/migrations/*.sql` im Repo; `.claude/settings.local.json` ignoriert
- Live-Smoke-Test bestanden; Advisors bis auf Pro-Plan-Feature (Leaked Password Protection) sauber

## 2026-10-15 — Spec 12: Landing-Page
- Landing `/` mit schwebendem Header (Login/Registrieren bzw. „Zum Dashboard“), Hero „Deine Links. Eine Seite.“, Claim-Feld `/u/[name] Loslegen →` → `/signup?username=…`
- Demo-Profil im Handy-Rahmen mit wechselnder Akzentfarbe, Feature-Kacheln, minimaler Footer, Glow-Hintergrund
- Dateien: `src/app/page.tsx`, `src/components/landing/*`, `src/components/dashboard/phone-frame.tsx`

## 2026-10-15 — Spec 11: Live-Preview
- `EditorProvider` (React Context) als gemeinsamer Zustand für Profil, Accent und Links; Editoren aus 06–09 angebunden
- `LivePreview` rendert `PublicProfile` im Preview-Modus (nicht klickbar, Tooltip) in einem sticky `PhoneFrame` (375×760), auf Mobile im Tab „Vorschau“ ohne Rahmen
- Änderungen erscheinen beim Tippen, Farbwechsel, Ausblenden und während des Drags – vor dem Speichern
- Dateien: `src/components/dashboard/{editor-context,live-preview,phone-frame,profile-form,accent-picker,workspace}.tsx`, `src/components/dashboard/links/links-editor.tsx`, `src/components/public/*`, `src/app/dashboard/page.tsx`

## 2026-10-15 — Spec 10: Public-Page `/u/<username>`
- Öffentliche Profilseite: Avatar mit Brand-Ring, Name, @username, Bio, sichtbare Links in Dashboard-Reihenfolge, Brand-Glow, gestaffeltes Einblenden (reduced motion beachtet), Footer-Pill → `/signup`
- `PublicProfile` als reine Darstellungskomponente (für Live-Preview in Spec 11)
- Gecachter Datenabruf (`'use cache'` + `cacheTag`) mit cookie-freiem Supabase-Client; Dashboard-Actions und Sign-up invalidieren per `updateTag` + `revalidatePath`
- `generateMetadata` (Titel „Name (@username)“, Bio als Description); 404-Seite im App-Design (Route + global)
- Dateien: `src/app/u/[username]/*`, `src/app/not-found.tsx`, `src/components/public/*`, `src/lib/data/public-profile.ts`, `src/lib/supabase/public.ts`, Actions in `src/app/dashboard/*` und `src/app/(auth)/actions.ts`

## 2026-10-15 — Spec 09: Accent-Color
- Farb-Helfer `isHexColor`, `normalizeHex`, `getContrastForeground` (WCAG), `safeAccent` + Unit-Tests (`npm test`)
- `UserTheme`-Komponente setzt `--brand`/`--brand-foreground` sicher per `style`-Objekt; `.user-theme` leitet `--primary`, `--primary-foreground`, `--ring` ab
- Accent-Picker: 10 Presets als Radio-Gruppe, eigene Farbe (Farbwähler + Hex), Live-Vorschau, Kontrast-Hinweis
- Server Action `updateAccentColor` (Regex, ablehnen statt korrigieren, `revalidatePath`)
- Dateien: `src/lib/theme/*`, `src/components/user-theme.tsx`, `src/components/dashboard/accent-picker.tsx`, `src/app/dashboard/{design-actions.ts,page.tsx}`, `src/app/globals.css`, `package.json` (Script `test`)

## 2026-10-15 — Spec 06: Profil-Editor
- Profil-Formular im Dashboard: Anzeigename (50), Bio (160) mit Zeichenzählern, Avatar-URL (nur https)
- Live-Avatar-Vorschau mit Initialen-Fallback auf Brand-Verlauf; wiederverwendbare `ProfileAvatar`-Komponente
- Server Action `updateProfile` mit geteiltem Zod-Schema, `requireUser`, `revalidatePath('/u/<username>')`; Toast „Profil gespeichert“
- Backlog: sauberer Logout bei gelöschtem Account
- Dateien: `src/lib/validation/profile.ts`, `src/components/profile-avatar.tsx`, `src/app/dashboard/{profile-actions.ts,page.tsx}`, `src/components/dashboard/profile-form.tsx`, `src/components/ui/avatar.tsx`

## 2026-10-15 — Spec 08: Link-Reorder
- Drag-and-Drop am Griff mit Motion `Reorder` (Maus + Touch), angehobenes Item mit Schatten und leichter Skalierung
- ↑/↓-Buttons pro Link für Tastatur, Fokus bleibt sinnvoll
- Server Action `reorderLinks(ids)` → RPC `reorder_links`; optimistisch mit Rollback, Speichern in Warteschlange
- `prefers-reduced-motion` via `MotionConfig reducedMotion="user"`
- Dateien: `src/components/dashboard/links/{links-editor,link-editor-card}.tsx`, `src/app/dashboard/link-actions.ts`, `src/lib/validation/link.ts`

## 2026-10-15 — Spec 07: Link-CRUD
- Links anlegen (neu oben), inline bearbeiten (Escape bricht ab), per Switch ausblenden, löschen mit „Rückgängig“-Toast (5 s)
- Server Actions `createLink`, `updateLink`, `toggleLinkVisibility`, `deleteLink`, `restoreLink` mit Zod + `requireUser`, Fremd-IDs scheitern an RLS
- URL-Validierung (nur http/https) mit Vorschlag „https:// ergänzen?“; Limit 100 mit verständlicher Meldung; Empty State mit CTA
- Migration `allow_negative_link_position` (CHECK `position >= 0` entfernt)
- Dateien: `src/lib/validation/link.ts`, `src/lib/data/links.ts`, `src/app/dashboard/{link-actions.ts,page.tsx}`, `src/components/dashboard/links/*`, `src/components/ui/{empty,badge}.tsx`

## 2026-10-15 — Spec 05: Dashboard-Shell
- Dashboard-Layout mit sticky Header: Logo, „Meine Seite ansehen ↗“, Theme-Toggle, User-Menü (E-Mail, Abmelden)
- Live-Banner „Deine Seite ist live: /u/<username>“ mit Kopieren-Button und Toast
- Zweispaltiger Arbeitsbereich: Editor-Cards Profil/Design/Links (Platzhalter) + sticky Phone-Preview-Slot; Mobile-Umschalter „Bearbeiten / Vorschau“
- Skeletons für alle Suspense-Fallbacks; DAL `requireProfile()`; Auth-Prüfung per `connection()` immer zur Request-Zeit
- Dateien: `src/app/dashboard/*`, `src/components/dashboard/*`, `src/lib/auth/dal.ts`, `src/components/ui/{skeleton,toggle,toggle-group}.tsx`

## 2026-10-15 — Spec 04: Sign-Up / Login / Logout
- Gemeinsame Zod-Validierung (E-Mail, Passwort 8–72, Username inkl. Reserved Words) für Formular und Server Actions
- `/signup` mit `/u/`-Präfix, Live-Verfügbarkeitsprüfung und `?username=`-Vorbelegung; `/login`; Logout-Button im Dashboard-Platzhalter
- Server Actions `signup`, `login`, `logout`, `checkUsername` mit deutschen Fehlermeldungen; Formulare mit `useActionState`, Spinner, Feldfehlern und Fokus aufs erste fehlerhafte Feld
- Auth-Layout mit Brand-Glow und Theme-Umschalter; neues Token `--success`
- Dateien: `src/lib/validation/auth.ts`, `src/app/(auth)/*`, `src/components/auth/*`, `src/components/ui/{field,input-group,spinner,separator}.tsx`, `src/app/globals.css`, `src/app/dashboard/page.tsx`

## 2026-10-15 — Spec 03: Auth-Infrastruktur
- Supabase-Clients für Browser (`createBrowserClient`) und Server (`createServerClient` mit `await cookies()`), typisiert mit `Database`
- `src/proxy.ts` + `updateSession()`: Session-Refresh per `getClaims()`, Cache-Header aus `setAll`, Redirects `/dashboard*` ↔ `/login`/`/signup` mit übernommenen Cookies
- DAL `getCurrentUser()` / `requireUser()` mit React `cache()` und `getClaims()`
- Typsichere Env-Variablen mit klarer Fehlermeldung; Platzhalter-Seite `/dashboard`
- Dateien: `src/lib/env.ts`, `src/lib/supabase/*`, `src/proxy.ts`, `src/lib/auth/dal.ts`, `src/app/dashboard/page.tsx`

## 2026-10-15 — Spec 02: Datenbank-Schema
- Tabellen `profiles` und `links` mit CHECKs (Username-Regex + Reserved Words, Längen, https-URLs, Hex-Accent), Index `(user_id, position)`
- RLS auf beiden Tabellen, Policies mit `(select auth.uid())`, explizite GRANTs inkl. Spalten-Grants für UPDATE
- Trigger: `on_auth_user_created` → `handle_new_user()` (security definer), 100-Links-Limit, `updated_at`
- RPC `reorder_links(uuid[])` (security invoker), nur für `authenticated`
- Migrationen: `create_profiles`, `create_links`, `handle_new_user_trigger`, `reorder_links_rpc_and_updated_at`
- Dateien: `src/lib/database.types.ts`

## 2026-10-15 — Spec 01: UI-Fundament
- shadcn/ui initialisiert (Radix, `components.json`), Basiskomponenten: button, input, label, card, switch, dropdown-menu, sonner, textarea, tooltip
- Design-Tokens Light/Dark (Hex, ohne #000/#fff), Radius 1rem, mehrschichtige Schatten, Platzhalter `--brand` / `--brand-foreground`
- Dark Mode via next-themes (System-Default), `ThemeToggle` (Hell/Dunkel/System), Toaster + TooltipProvider im Root-Layout
- Pakete gepinnt: motion, lucide-react, zod, sonner, next-themes, @supabase/ssr 0.12.7, @supabase/supabase-js 2.117.3; Script `typecheck`
- Startseite durch Token-Platzhalter ersetzt
- Dateien: `src/app/{globals.css,layout.tsx,page.tsx}`, `src/components/{theme-provider,theme-toggle}.tsx`, `src/components/ui/*`, `src/lib/utils.ts`, `components.json`, `package.json`
