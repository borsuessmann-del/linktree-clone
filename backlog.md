# Backlog — Ideen-Parkplatz

Alles, was außerhalb des MVP-Scopes liegt, landet hier statt im Code. So bleibt der Fokus beim MVP, ohne dass Ideen verloren gehen.

## Format
```
- [YYYY-MM-DD] **<Idee>** — <1 Satz warum interessant> (Quelle: <Spec/Session>)
```

## Einträge
- [2026-10-15] **Username ändern** — inkl. Regeln für alte URLs (Redirect, Sperrfrist wie Linktree: 7 Tage) (Quelle: Sparring Runde 2)
- [2026-10-15] **User wählt Hell/Dunkel pro Public-Page** — zusätzliches Feld `theme_mode` (Quelle: Sparring Runde 3)
- [2026-10-15] **Tastatur-Drag mit Screenreader-Ansagen** — Wechsel auf `@dnd-kit/react`, sobald 1.0 stabil ist (Quelle: Discovery §4)
- [2026-10-15] **Fractional Indexing für Link-Positionen** — erst bei sehr großen Listen oder parallelem Editieren nötig (Quelle: Discovery §4)
- [2026-10-15] **Erweitertes Theming** — mehrere Farben/JSON-Theme, Hintergründe, Fonts, Button-Formen; `contrast-color()` statt Server-Berechnung (Quelle: Discovery §3)
- [2026-10-15] **Weitere Link-Typen** — `mailto:`, `tel:`, Embeds (Quelle: Sparring Runde 1)
- [2026-10-15] **Passwort vergessen / zurücksetzen** — braucht E-Mail-Versand (Quelle: Spec 04)
- [2026-10-15] **Link-Sektionen mit Überschriften** — wie bei Linktree-Profilen (Quelle: Design-Analyse §6)
- [2026-10-15] **Social-Icon-Zeile unter dem Namen** — hoo.be-Muster (Quelle: Design-Analyse §3)
- [2026-10-15] **Leaked-Password-Schutz** — nur im Supabase Pro-Plan (Quelle: Discovery §2)
- [2026-10-15] **Sauberer Logout bei gelöschtem Account** — JWT bleibt bis Ablauf gültig, Dashboard wirft dann „Profil konnte nicht geladen werden“; Lösung: Route Handler `/auth/signout` (darf Cookies löschen) + Redirect aus der DAL, wenn das Profil fehlt (Quelle: Spec 07/08/06 Tests)
