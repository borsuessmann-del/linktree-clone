# 01 — UI-Fundament

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Das Projekt hat ein hochwertiges, statisches Design-System: shadcn/ui ist initialisiert, die tweakcn-Tokens liegen in `src/app/globals.css`, Dark Mode funktioniert per System-Einstellung und Umschalter, und alle Basis-Pakete sind installiert.

## Abhängigkeiten
- keine (kann parallel zu 02 laufen)

## Out of Scope
- Feature-Komponenten (Link-Card, Profil usw.) — kommen in den jeweiligen Specs
- Per-User-Farbe `--brand` (Spec 09)

## Akzeptanzkriterien
- [x] `components.json` existiert; `npx shadcn@latest add button` funktioniert
- [x] `globals.css` enthält Light- UND Dark-Tokens aus tweakcn, orientiert an `references/design-analysis.md` §7 (Canvas `#f4f4f5`/`#09090b`, Card, Foreground `#18181b`/`#f7f8f8`, `--radius: 1rem`, mehrschichtige `--shadow-*`)
- [x] Kein `#000`/`#fff` als Token-Wert
- [x] Platzhalter-Tokens `--brand` / `--brand-foreground` (Default Indigo `#4f46e5` / berechnet) existieren und sind via `@theme inline` als `bg-brand`, `text-brand-foreground` nutzbar
- [x] Dark Mode via `next-themes` (`attribute="class"`, `defaultTheme="system"`), kein Aufblitzen beim Laden
- [x] `ThemeToggle`-Komponente (Hell / Dunkel / System) mit Hover- und Focus-State
- [x] Font bleibt Geist (bereits eingebunden)
- [x] Pakete installiert und gepinnt: `motion`, `lucide-react`, `zod`, `sonner` (Toasts), `next-themes`, `@supabase/ssr@0.12.7`, `@supabase/supabase-js@2.117.3`
- [x] Script `"typecheck": "tsc --noEmit"` in `package.json`
- [x] Startseite der Create-Next-App ist durch einen schlichten Platzhalter ersetzt, der Tokens in Light + Dark demonstriert (Card, Button, Muted-Text)

## Tasks
1. Prüfen, ob Kurs-Sub 5.13.3 bereits erledigt ist (`components.json`, Theme in `globals.css`) — sonst `npx shadcn@latest init`
2. Theme in tweakcn bauen (User) bzw. Token-Vorschlag aus design-analysis.md als Startpunkt übernehmen
3. `--brand`-Tokens + `@theme inline`-Mapping ergänzen
4. `next-themes` Provider im Root-Layout (`suppressHydrationWarning` auf `<html>`)
5. `ThemeToggle` (shadcn `dropdown-menu` + Lucide `Sun`/`Moon`/`Monitor`)
6. Pakete installieren, Versionen pinnen, `typecheck`-Script
7. shadcn-Basiskomponenten: `button`, `input`, `label`, `card`, `switch`, `dropdown-menu`, `sonner`, `textarea`, `tooltip`

## Validation
- `npm run typecheck` + `npm run lint` + `npm run build` grün
- browser-use: Platzhalter-Seite in Light + Dark, Desktop + 390px → Screenshots prüfen gegen `rules/design-system.md`
- Tab-Navigation: Toggle per Tastatur bedienbar, Focus-Ring sichtbar

## Relevante Rules / Skills
- `rules/design-system.md`, `rules/tech-stack.md` · Skill: shadcn · Context7: shadcn, next-themes, Tailwind v4

## Debrief
- shadcn mit **Radix**-Basis initialisiert (Style `radix-nova`), weil die Spec `sonner` + `dropdown-menu` vorsieht.
- Tokens aus design-analysis §7 als Hex übernommen; Light-Card `#fcfcfd` statt `#ffffff` (Regel „kein #fff“).
- Radius-Skala umgebaut: `rounded-2xl` = `--radius` = 16px, übrige Stufen relativ dazu. Card-Komponente auf `rounded-2xl` + Gradient + `shadow-md` angepasst.
- Schatten: Rohwerte `--elevation-*` je Theme → `--shadow-*` in `@theme inline` (vermeidet Selbstreferenz).
- shadcn-Init hatte `--font-sans: var(--font-sans)` (Selbstreferenz) erzeugt → auf `--font-geist-sans` korrigiert.
- Verifikation: typecheck/lint/build grün; browser-use Light + Dark × 1440/390px ohne Overflow; Toggle per Tab/Enter/Pfeiltasten bedienbar, Focus-Ring sichtbar, Auswahl bleibt gespeichert.
- Bekannt: Hydration-Warnung im Dev-Overlay stammt von der Grammarly-Extension (`data-gr-ext-installed` auf `<body>`), nicht vom App-Code.
- Offen: `rules/design-system.md` nennt die Per-User-Farbe noch `--accent`; Spec/Plan nutzen `--brand` (shadcn belegt `--accent` für Hover-Flächen).
