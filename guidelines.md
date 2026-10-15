# Architektur-Entscheidungen

Format pro Entscheidung: **Kontext / Entscheidung / Warum / Alternativen**. Fortlaufend nummeriert, nie löschen — überholte Entscheidungen als "ersetzt durch NNN" markieren.

---

## 001 — Stack: Next.js + Supabase + Vercel + npm

**Kontext:** Kurs-Projekt für Einsteiger; eine Link-in-Bio-App braucht Auth, eine kleine relationale DB und öffentliche Seiten. Muss komplett kostenlos laufen.

**Entscheidung:** Next.js (App Router, Server Actions) als Full-Stack-Framework, Supabase für Postgres + Auth + Row Level Security, Deployment auf Vercel, npm als Package Manager. Installiert wurde Next.js 16.4.1 (aktuelles `create-next-app@latest`), nicht 15.

**Warum:**
- Ein Repo, eine Sprache (TypeScript) — kein separater Backend-Service, den Einsteiger zusätzlich verstehen müssen.
- Supabase liefert Auth und DB fertig; RLS sichert Daten direkt in der Datenbank ab, statt sich nur auf App-Code zu verlassen.
- Vercel ist vom Next.js-Hersteller → Deploy ohne Konfiguration.
- Alle drei haben ausreichende Free-Tiers ohne Kreditkarte.
- npm ist bei Node.js dabei — kein zusätzliches Tool.

**Alternativen:**
- Firebase — kein SQL, Security-Rules schwerer zu lesen als RLS-Policies.
- Eigenes Backend (Express + Prisma + Postgres) — mehr bewegliche Teile, eigene Auth nötig.
- Remix / SvelteKit — weniger Kursmaterial und Ökosystem (shadcn, Supabase-Guides).
- pnpm / bun — schneller, aber zusätzliche Installation und Fehlerquelle für Einsteiger.

---

## 002 — User-Farbe als `--brand` statt `--accent`

**Kontext:** Der Kickoff sah vor, pro User `--accent` zu überschreiben. In shadcn ist `--accent` aber die dezente Hover-/Auswahl-Fläche (Ghost-Buttons, Menü-Highlights), keine Markenfarbe.

**Entscheidung:** Die User-Farbe heißt `--brand`, dazu ein serverseitig per WCAG-Kontrast berechnetes `--brand-foreground`. Beide werden als React-`style`-Objekt am Wrapper der Public-Page (und der Editor-Preview) gesetzt; die Klasse `.user-theme` leitet dort `--primary`, `--primary-foreground` und `--ring` ab. Speicherung: `profiles.accent_color text` mit CHECK `~* '^#[0-9a-f]{6}$'`.

**Warum:** Überschriebenes `--accent` würde jeden Hover in der vollen User-Farbe einfärben. Das Prinzip „nur eine Variable ist dynamisch" bleibt erhalten. Ableitung am Wrapper ist nötig, weil `:root { --primary: var(--brand) }` einen erst am Wrapper gesetzten Wert nicht sieht.

**Alternativen:** `--accent` überschreiben (kaputte Hover-States) · Farbe auf `<html>` setzen (macht Root-Layout dynamisch, schlechteres Caching) · `<style>`-Tag mit User-Wert (CSS-Injection-Risiko).

---

## 003 — Drag-and-Drop mit Motion `Reorder`

**Kontext:** Links sollen per Drag-and-Drop sortierbar sein, auch auf Touch-Geräten und per Tastatur.

**Entscheidung:** Motion `Reorder` (Paket `motion`, Import `motion/react`) mit Drag-Griff (`dragListener={false}` + `useDragControls`, `touch-none`) und ↑/↓-Buttons pro Link. Position als `integer`, Speichern atomar per RPC `reorder_links(uuid[])` (security invoker) in `onDragEnd` bzw. beim Button-Klick.

**Warum:** Motion ist ohnehin im Stack, die API ist die einfachste. Die fehlende Tastatur-Unterstützung schließen die Buttons. Der Griff verhindert den Scroll-Konflikt auf dem Handy.

**Alternativen:** `@dnd-kit/react` (Tastatur-Drag eingebaut, aber noch 0.x) · `@dnd-kit/core` (seit 12/2024 kein Release) · pragmatic-drag-and-drop (zu low-level für Einsteiger) · Fractional Indexing (erst bei sehr großen Listen sinnvoll).

---

## 004 — Username im Sign-Up, Profil per DB-Trigger

**Kontext:** Jeder User braucht einen Username für `/u/<username>`. Supabase-Auth kennt nur E-Mail + Passwort.

**Entscheidung:** Username ist drittes Feld im Sign-Up-Form. Die Server Action validiert Format, Reserved Words und Verfügbarkeit, übergibt ihn via `options.data` an `signUp`. Ein Trigger `on auth.users after insert` (security definer, `search_path = ''`) legt die Zeile in `public.profiles` an. Autorisierung läuft nur über `profiles`, nie über `raw_user_meta_data`.

**Warum:** Kein User existiert ohne Username → kein Onboarding-Schritt, keine Sonderfälle im Dashboard. Trigger garantiert, dass Auth-User und Profil immer zusammen entstehen.

**Alternativen:** Separater Onboarding-Screen (ein Schritt + eine Route mehr, User ohne Profil möglich) · Profil in der Server Action nach `signUp` anlegen (nicht atomar — Abbruch hinterlässt User ohne Profil).

---

## 005 — Auth-Absicherung in Next.js 16

**Kontext:** Next 16 nutzt `proxy.ts` statt `middleware.ts`; `cacheComponents: true` ist aktiv.

**Entscheidung:** `src/proxy.ts` refresht die Session (`getClaims()`) und leitet nur `/dashboard*` (ausgeloggt) bzw. `/login`, `/signup` (eingeloggt) um. Die echte Prüfung passiert in einer DAL (`requireUser()` mit `getClaims()`), in jeder Server Action und per RLS. Cookie-lesende Komponenten stehen in `<Suspense>`.

**Warum:** Proxy ist laut Next-Docs nur ein optimistischer Check. `getClaims()` prüft die JWT-Signatur, `getSession()` ist serverseitig fälschbar.

**Alternativen:** Offizielles Beispiel 1:1 (leitet alle ausgeloggten Requests um → `/u/*` wäre nicht öffentlich) · `getUser()` überall (zusätzlicher Netzwerk-Call pro Request).
