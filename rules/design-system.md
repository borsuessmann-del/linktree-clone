# Design-System

Ziel-Niveau: Bento.me, Cal.com, Linear, Raycast, Vercel, Arc, Framer.
Nicht: Default-Bootstrap, Default-shadcn-Demo, generische Link-Listen.

## Harte Regeln
| Regel | Konkret |
|---|---|
| Dark Mode von Start | Jede Komponente wird in Light UND Dark gebaut und geprüft (`.dark`-Klasse, Tokens aus `globals.css`). |
| Keine flachen Farben | Flächen mit Gradients, Abstufungen, Layering (z. B. `bg-gradient-to-b from-card to-muted/40`). |
| Keine harten #000 / #fff | Nur abgestufte Neutrals über Tokens (`--background`, `--foreground`, `--muted` …). |
| Hover + Focus Pflicht | Jedes interaktive Element hat `hover:` und `focus-visible:` (sichtbarer Ring). |
| Smooth Transitions | Mindestens `duration-150 ease-out`; Framer Motion für Layout-Animationen. |
| Rundungen | `rounded-2xl` als Default — keine rechteckigen Cards. |
| Shadows | Weich und mehrschichtig über `--shadow-*`-Tokens, keine einzelnen harten Schatten. |

## Theming-Architektur (zweistufig)
1. **Globale Tokens** — mit tweakcn.com visuell gebaut, als CSS-Variablen in `src/app/globals.css` exportiert. Single Source of Truth; keine Farbwerte direkt in Komponenten.
2. **Per-User-Accent** — nur `--brand` (+ berechnetes `--brand-foreground`) wird dynamisch gesetzt, über die Komponente `<UserTheme>` (`src/components/user-theme.tsx`) am Wrapper von Public-Page und Live-Preview; die Klasse `.user-theme` leitet daraus `--primary`, `--primary-foreground` und `--ring` ab. Alles andere bleibt statisch. Nicht `--accent` verwenden – das ist in shadcn die dezente Hover-Fläche (siehe `guidelines.md` 002).

## Accent-Color-Sicherheit
- Nur 6-stelliger Hex: `/^#[0-9a-f]{6}$/i` — Validierung im Formular, in der Server Action UND per DB-CHECK.
- Rendern ausschließlich über `<UserTheme>` als CSS-Variable `--brand: #rrggbb` im React-`style`-Objekt; ungültige Werte fallen per `safeAccent()` auf den Default zurück.
- Nie raw CSS, Style-Strings, `<style>` oder `dangerouslySetInnerHTML` mit User-Werten (Schutz vor CSS-Injection/XSS).
