# 03 — Auth-Infrastruktur (Supabase-Clients, proxy.ts, DAL)

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Die App kann serverseitig und im Browser sicher mit Supabase sprechen; Sessions werden in `src/proxy.ts` automatisch erneuert, und eine zentrale `requireUser()`-Funktion schützt Server-Code.

## Abhängigkeiten
- 02 — Typen aus `database.types.ts`

## Out of Scope
- Login-/Sign-Up-UI und Actions (Spec 04)

## Akzeptanzkriterien
- [x] `src/lib/supabase/client.ts` — `createBrowserClient<Database>` mit `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [x] `src/lib/supabase/server.ts` — `async createClient()` mit `await cookies()`, `getAll` / `setAll` (try/catch für Server Components), pro Aufruf neu
- [x] `src/lib/supabase/proxy.ts` — `updateSession(request)`: `createServerClient` → direkt danach `getClaims()`; `setAll` setzt Cookies UND Cache-Header (`headers`-Parameter) auf die Response
- [x] Redirect-Logik: ausgeloggt + `/dashboard*` → `/login`; eingeloggt + `/login` | `/signup` → `/dashboard`; `/`, `/u/*` bleiben öffentlich. Bei Redirects werden Cookies + Header übernommen
- [x] `src/proxy.ts` mit `export async function proxy` + Matcher ohne statische Dateien (laut Next-16-Docs)
- [x] `src/lib/auth/dal.ts` — `getCurrentUser()` / `requireUser()` mit React `cache()` und `getClaims()`; `requireUser` redirected nach `/login`
- [x] Nirgends `getSession()` für Autorisierung
- [x] Env-Variablen typsicher gelesen (Fehler mit klarer Meldung, wenn sie fehlen)

## Tasks
1. Next-16-Docs lesen: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`, `…/03-file-conventions/proxy.md`, `…/02-guides/authentication.md`
2. Context7: aktuellen `@supabase/ssr`-Guide gegenprüfen
3. Dateien anlegen wie oben
4. Mini-Testseite `/dashboard` (Platzhalter mit `requireUser()` in `<Suspense>`)

## Validation
- `npm run typecheck`, `npm run build` grün (kein „blocking route"-Fehler durch `cacheComponents`)
- Ausgeloggt `/dashboard` aufrufen → Redirect `/login`
- `/u/test` und `/` ausgeloggt erreichbar (kein Redirect)
- Response-Header der Proxy-Antwort enthalten Cache-Control bei Cookie-Updates

## Relevante Rules / Skills
- `guidelines.md` 005 · `references/discovery.md` §2 (Fallstricke 1–8) · Skill: supabase · Context7: `/supabase/ssr`

## Debrief
- Dateien: `src/lib/env.ts`, `src/lib/supabase/{client,server,proxy}.ts`, `src/proxy.ts`, `src/lib/auth/dal.ts`, Platzhalter `src/app/dashboard/page.tsx`.
- Quellen: Next-16-Docs aus `node_modules` (proxy, authentication-with-cache-components, data-security) + Context7 `/supabase/ssr` (`setAll(cookies, headers)` seit 0.10).
- Redirects übernehmen Cookies **und** Cache-Header (`redirectWithSession`). `server-only` ist in Next eingebaut, kein Paket nötig.
- Validation: typecheck/lint/build grün (`/dashboard` als Partial Prerender, Proxy registriert). curl ausgeloggt: `/dashboard`, `/dashboard/links` → 307 `/login`; `/`, `/u/test` ohne Redirect. Kaputter Session-Cookie → 307 mit `Cache-Control: private, no-cache, no-store …`, `Expires: 0`, `Pragma: no-cache`, Cookie gelöscht.
- Zusätzlich eingeloggt getestet (Test-User per SQL, Login per `@supabase/ssr`-Skript): `/login`, `/signup` → 307 `/dashboard`; `/dashboard` 200 mit E-Mail aus `requireUser()`. Test-User danach gelöscht.
- Hinweis: Server-Client in `server.ts` ignoriert den `headers`-Parameter (Server Components können keine Header setzen); Cookie-Updates mit Cache-Headern laufen über den Proxy.
