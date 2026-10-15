# 04 — Sign-Up / Login / Logout

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Besucher können sich mit E-Mail, Passwort und Wunsch-Username registrieren und landen direkt im Dashboard; bestehende User können sich ein- und ausloggen.

## Abhängigkeiten
- 01 — UI-Komponenten · 02 — Trigger legt Profil an · 03 — Clients, Proxy, DAL

## Out of Scope
- Passwort vergessen / zurücksetzen (Backlog)
- OAuth, Magic Link, E-Mail-Bestätigung

## Akzeptanzkriterien
- [x] Gemeinsame Validierung in `src/lib/validation/` (Zod): E-Mail, Passwort ≥ 8, Username (Regex, lowercase, Reserved Words) — genutzt von Formular UND Server Action
- [x] `/signup`: Felder E-Mail, Passwort, Username; Username-Feld zeigt Präfix `/u/`, Live-Verfügbarkeitsprüfung (debounced ~400ms, Status „verfügbar ✓" / „vergeben" / „ungültig"); `?username=` aus Query vorausgefüllt (Landing-Claim, Spec 12)
- [x] Server Action `signup`: validiert, prüft Verfügbarkeit, `signUp` mit `options.data.username`; bekannte Fehler verständlich auf Deutsch („Username ist bereits vergeben", auch bei „Database error saving new user")
- [x] `/login`: E-Mail + Passwort; bei Fehler generisch „E-Mail oder Passwort falsch"
- [x] Logout-Action: `signOut` → `/login`
- [x] Formulare mit `useActionState`: Pending-State am Button (Spinner, disabled), Feldfehler unter dem Feld, Fokus auf erstes fehlerhaftes Feld
- [x] `redirect()` außerhalb von try/catch
- [x] Design: zentrierte Card auf Canvas mit Brand-Glow, `rounded-2xl`, Light + Dark, Links zwischen Login ↔ Sign-Up
- [x] Nach Sign-Up existiert `profiles`-Zeile mit korrektem Username

## Tasks
1. Zod-Schemas + Reserved-Words-Liste (eine Quelle, auch für Spec 02 als Referenz)
2. Server Action `checkUsername` (oder Route Handler) für Live-Prüfung
3. `src/app/(auth)/signup/page.tsx`, `login/page.tsx`, `actions.ts`
4. Formular-Komponenten (Client) mit `useActionState`
5. Logout-Action

## Validation
- browser-use: Sign-Up neuer User → Dashboard; Logout → Login; Login → Dashboard; Reload behält Session
- Negativ: vergebener Username, `admin`, `Ab`, Passwort `1234567`, falsches Passwort → jeweils verständliche Meldung
- Supabase MCP: Profil-Zeile vorhanden, Username lowercase
- Screenshots Light + Dark, 390px + Desktop

## Relevante Rules / Skills
- `rules/verification.md` (Typ Auth-Flow) · `guidelines.md` 004, 005 · Skill: supabase, shadcn

## Debrief
- Dateien: `src/lib/validation/auth.ts`, `src/app/(auth)/{actions.ts,layout.tsx,login/page.tsx,signup/page.tsx}`, `src/components/auth/{login,signup}-form.tsx`; Logout-Button im Platzhalter-`/dashboard`. Neue shadcn-Komponenten: field, input-group, spinner (+ separator).
- Neues Token `--success` (Light `#047857`, Dark `#34d399`) für „verfügbar ✓“.
- Username-Validierung in mehreren Regeln statt einer Regex → konkrete Meldungen. Eingabe wird beim Tippen kleingeschrieben. Live-Check: lokal sofort, Server nach 400 ms, veraltete Antworten werden verworfen.
- Supabase-Einstellung „Confirm email“ ist aus (`mailer_autoconfirm: true` über `/auth/v1/settings` geprüft); falls doch an, zeigt die Action eine verständliche Meldung statt zu hängen.
- Validation (browser-use): Sign-up → Dashboard; Reload behält Session; eingeloggt `/login` → `/dashboard`; Logout → `/login`; Login → Dashboard; Negativ: `admin`, `Ab`, `-abc`, vergebener Username, doppelte E-Mail, Passwort `1234567`, ungültige E-Mail, falsches Passwort → jeweils deutsche Meldung + Fokus aufs Feld. `?username=MeinName` → `meinname`. Profil-Zeile per MCP: `signuptest` (lowercase). Testdaten gelöscht.
- Offene Frage: Regex aus Spec 02 erlaubt 1 Zeichen oder 3–30, aber nicht 2 → Meldung „Mindestens 3 Zeichen“. Ob 1-Zeichen-Namen gewollt sind, ist offen.
- Stolperstein: `npm run build` bei laufendem `next dev` hat den Turbopack-Cache in `.next` vergiftet (CSS-Änderungen kamen nicht an) → Dev-Server stoppen, `.next` löschen, neu starten.
