# 12 — Landing-Page `/`

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Nicht eingeloggte Besucher sehen eine kleine, hochwertige Landing-Page, die das Produkt zeigt und den Wunsch-Username direkt ins Sign-Up übergibt; eingeloggte User werden zum Dashboard geführt.

## Abhängigkeiten
- 04 — Sign-Up mit `?username=` · 10 — `PublicProfile` als Beispiel-Vorschau

## Out of Scope
- Marketing-Unterseiten, Pricing, Blog, i18n

## Akzeptanzkriterien
- [x] Header als schwebender, abgerundeter Container: Logo, `ThemeToggle`, „Login", „Registrieren" (eingeloggt: „Zum Dashboard")
- [x] Hero: Headline (Display, enges Tracking, z. B. „Deine Links. Eine Seite."), Subline, **Claim-Feld** `/u/ [username] [Loslegen →]` mit derselben Username-Validierung (Live-Hinweis bei ungültig) → `/signup?username=…`
- [x] Rechts / darunter: Beispiel-Profil in `PhoneFrame` mit Demo-Daten und wechselnder Accent-Color
- [x] Hintergrund mit Gradient/Glow, keine flachen Flächen; Einblend-Motion dezent
- [x] Footer minimal
- [x] Light + Dark, mobile-first

## Tasks
1. `src/app/page.tsx` (Placeholder aus 01 ersetzen)
2. `ClaimForm` (Client, nutzt Zod-Schema aus 04)
3. Demo-Profil mit statischen Daten

## Validation
- browser-use: Claim „meinname" → Sign-Up mit vorausgefülltem Feld; Claim „admin" → Hinweis
- 390px + 1440px, Light + Dark; Visual Verification Loop

## Relevante Rules / Skills
- `references/design-analysis.md` §6 (Landing) · `rules/design-system.md`

## Debrief
- Dateien: `src/app/page.tsx` (Platzhalter aus 01 ersetzt), `src/components/landing/{landing-header,claim-form,demo-phone}.tsx`; `PhoneFrame` mit `variant="always"`, Scrollbar im Rahmen ausgeblendet.
- Claim-Feld mit `next/form` (`action="/signup"`, Progressive Enhancement); `onSubmit` + `preventDefault()` blockt ungültige/leere Namen; Eingabe wird beim Tippen kleingeschrieben; Validierung = `usernameSchema` aus Spec 04.
- Header-Login-Status hinter `<Suspense>` (Gast-Buttons als Fallback) → `/` bleibt Partial Prerender. Demo-Profil nutzt `PublicProfile` (Preview-Modus), Farbwechsel alle 2,8 s, aus bei „Bewegung reduzieren“. Einblenden per tw-animate-css mit `motion-reduce:animate-none`.
- Inspiration: Cal.com-Layering (Headline links, Produktbeispiel rechts), hoo.be/Linktree-Claim-Feld.
- Visual-Iteration: Scrollbar im Demo-Handy ausgeblendet; auf Mobile nur Logo-Zeichen im Header (Name `sr-only`), damit er einzeilig bleibt.
- Validation (browser-use): Gast-Header Login/Registrieren, eingeloggt „Zum Dashboard“ · Demo-Farbe wechselt · Claim `admin`/`Ab`/`-abc`/leer → Hinweis, bleibt auf `/`, Fokus im Feld · Claim `MeinName` → `/signup?username=meinname`, Feld vorausgefüllt + „verfügbar ✓“ · 390/1440 × Light/Dark ohne Overflow. Testdaten gelöscht.
