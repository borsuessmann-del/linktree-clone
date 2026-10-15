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
2. **Per-User-Accent** — nur `--accent` wird auf der Public-Page dynamisch gesetzt (Layout-Wrapper), alles andere bleibt statisch.

## Accent-Color-Sicherheit
- Nur 6-stelliger Hex: `/^#[0-9a-f]{6}$/i` — Validierung im Formular UND in der Server Action.
- Rendern ausschließlich als CSS-Variable `--accent: #rrggbb` über das React-`style`-Objekt.
- Nie raw CSS, Style-Strings oder Ausdrücke vom User übernehmen (Schutz vor CSS-Injection/XSS).
