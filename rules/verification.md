# Verifikation — Disziplin nach jedem Arbeitspaket

Ein Arbeitspaket ist erst fertig, wenn ALLE Punkte erledigt sind:

1. Akzeptanzkriterien der Spec einzeln abhaken.
2. Validation-Schritte der Spec durchlaufen (siehe Beispiele unten).
3. Typecheck grün: `npm run typecheck` (bzw. `npx tsc --noEmit`) und `npm run lint`.
4. Spec-Status auf ✅ setzen, Debrief-Sektion ausfüllen, Status in `implementierungsplan.md` nachziehen.
5. Eintrag in `changelog.md` (was) und `learning.md` (was gelernt).
6. Commit (erst ab Sub 5.13.7 — vorher entfällt dieser Schritt).

## Beispiele pro Arbeitspaket-Typ
| Typ | Verifikation |
|---|---|
| Supabase-Schema | Migration über Supabase MCP angewendet; RLS ist auf jeder Tabelle aktiv (`list_tables`); Policies mit zweitem Test-User geprüft (fremde Daten nicht les-/schreibbar); `supabase gen types typescript` neu erzeugt. |
| Auth-Flow | Sign-Up, Sign-In, Sign-Out im Browser durchgespielt; geschützte Route leitet ausgeloggt auf Login um; Session überlebt Reload; falsches Passwort zeigt verständliche Fehlermeldung. |
| UI-Komponente | Visual Verification via `browser-use --headed` in Light + Dark, Desktop + Mobile-Breite; Hover/Focus per Tastatur geprüft; Regeln aus `design-system.md` erfüllt; 3–4 Iterationen sind normal. |
| API-Route / Server Action | Gültige Eingabe → Erfolg; ungültige Eingabe (z. B. Accent `red;}` statt Hex) → abgelehnt; ohne Login → abgelehnt; Fremd-Ressource → abgelehnt. |
| Deployment | `npm run build` lokal grün; Vercel-Deploy erfolgreich; Env-Variablen gesetzt; Sign-Up + Public-Page `/u/<username>` auf der Live-URL getestet. |
