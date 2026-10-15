# Learning — Debriefs

Nach jedem Arbeitspaket ein kurzer Debrief: Was lief gut, was nicht, was nehmen wir mit? Neueste Einträge oben.

## Format
```
## YYYY-MM-DD — <Spec NN: Feature>
- **Lief gut:** …
- **Problem:** … → **Lösung:** …
- **Merken:** … (ggf. als Regel in rules/ übernehmen)
```

## Einträge

## 2026-10-15 — Spec 12: Landing-Page
- **Lief gut:** Bausteine aus früheren Specs (Zod-Schema aus 04, `PublicProfile` aus 10, `PhoneFrame` aus 11) machten die Landing zur reinen Komposition.
- **Merken:** `next/form` mit `action="/pfad"` = Such-/Claim-Formular mit Client-Navigation und Fallback ohne JS; `event.preventDefault()` in `onSubmit` stoppt die Navigation bei ungültiger Eingabe.
- **Merken:** Nur den personalisierten Teil (Login-Status) hinter `<Suspense>` – die restliche Seite bleibt statisch vorgerendert.

## 2026-10-15 — Spec 11: Live-Preview
- **Lief gut:** State per Context „anheben“ war ein kleiner Umbau, weil die Editoren ihren Zustand schon an einer Stelle (`useState`) hielten – Speicher-/Rollback-Logik blieb unverändert. Darstellungskomponente aus Spec 10 mit `preview`-Prop wiederverwendet.
- **Problem:** Erster Reorder-Test verschob einen Link unter einen ausgeblendeten → sichtbare Reihenfolge blieb gleich, Test bewies nichts → **Merken:** Testfälle so wählen, dass das erwartete Ergebnis sichtbar anders ist; Live-Verhalten mitten in der Interaktion messen.
- **Problem:** Login im Test hing bei langsamer Supabase-Antwort (6 s) → Helfer wartet jetzt aktiv auf `/dashboard` statt fix 5 s.

## 2026-10-15 — Spec 10: Public-Page
- **Lief gut:** Profil über das Dashboard statt per SQL aufbauen → testet gleichzeitig, dass Cache-Invalidierung (`updateTag`) sofort greift.
- **Merken:** `'use cache'` darf keine Cookies lesen → eigener cookie-freier Supabase-Client für öffentliche Daten. Auch „nicht gefunden“ wird gecacht – an der Stelle, die den Zustand ändert (Sign-up), das Tag mit leeren.
- **Merken:** `notFound()` hinter `<Suspense>` liefert Status 200 + `noindex` (dokumentiertes Streaming-Verhalten), nicht 404.
- **Merken:** Screenshot direkt nach `scrollTo` kann Zwischenzustände zeigen – vor einem Befund Werte (z. B. `opacity`) per JS nachmessen.

## 2026-10-15 — Spec 09: Accent-Color
- **Lief gut:** Reine Logik (Farbe, Kontrast) ohne Imports schreiben → mit `node --test` direkt testbar, ohne zusätzliches Test-Framework.
- **Problem:** CSS-Änderung kam nicht im Browser an (wie in Spec 04) → **Ursache:** Änderungen an `globals.css` per Git Bash (`sed -i`, `cat >>`) bemerkt der Turbopack-Watcher unter Windows nicht; über den Editor geändert sofort sichtbar. **Merken:** Quelldateien bei laufendem Dev-Server mit dem Editor ändern – dann muss `.next` nicht gelöscht werden. (Die Spec-04-Erklärung „Build parallel zu Dev“ war vermutlich nur ein Teil der Ursache.)
- **Problem:** Test-Selektor `[role=radiogroup]` traf den versteckten Mobile-Umschalter → **Merken:** Gruppen über `aria-label` eindeutig ansprechen; `blur()` feuert nur auf fokussierten Elementen.

## 2026-10-15 — Spec 06: Profil-Editor
- **Lief gut:** Wiederverwendete Test-Helfer (UTF-8-Dateien, fetch-Manipulation) – Server-Validierung in einem Schritt mitgeprüft.
- **Merken:** Vorschau-Bilder nur für bereits validierte URLs laden (kein Request an `http:`/`javascript:`), `referrerPolicy="no-referrer"` bei fremden Bild-Hosts.
- **Merken:** Wiederkehrende Nebenbefunde (hier: gelöschter Account mit gültigem JWT) in `backlog.md` parken statt außerhalb des Scopes mitzubauen.

## 2026-10-15 — Spec 08: Link-Reorder
- **Lief gut:** Drag per CDP testbar: `Input.dispatchMouseEvent` (pressed → mehrere moved mit `buttons=1` → released) bzw. `Input.dispatchTouchEvent` mit Touch-Emulation; Zwischenstand über `li.style.transform` auslesen.
- **Problem:** Enter auf Buttons tat im Test nichts → **Ursache:** `rawKeyDown` erzeugt kein Zeichen-Event → **Lösung:** `type="keyDown"` mit `text="\r"`.
- **Problem:** Drag auf Item außerhalb des Viewports schlug fehl → vorher `scrollIntoView`.
- **Merken:** Erst Gegenprobe machen, bevor ein Messwert als Fehler gilt (Scroll-Geste wirkte nirgends → Werkzeug-, kein App-Problem). Reduced Motion bei Drag-UIs immer prüfen: Ziehen muss weiter gehen.

## 2026-10-15 — Spec 07: Link-CRUD
- **Lief gut:** Fremd-ID-Test ohne Extra-Tooling: im Browser `window.fetch` umhüllen und UUIDs im Action-Body austauschen → zeigt, dass Server + RLS ablehnen, nicht nur die UI.
- **Problem:** Eigene „Extra-Absicherung“ aus Spec 02 (`position >= 0`) kollidierte mit Spec 07 → **Lösung:** Migration zum Entfernen. **Merken:** Zusätzliche Constraints gegen spätere Specs gegenlesen.
- **Problem:** browser-use: Umlaute im Heredoc kommen falsch kodiert an, Backslashes in `js()`-Strings werden zu echten Zeilenumbrüchen → **Lösung:** Testszenarien als UTF-8-Dateien ablegen und per `exec(open(..., encoding="utf-8").read())` laden; JS-Strings mit `json.dumps`; `String.fromCharCode(10)` statt `\n`.
- **Problem:** Gelöschter Test-User war im Browser noch „eingeloggt“ (JWT gültig) → **Lösung:** vor Tests nur die `localhost:3000`-Cookies per CDP löschen.
- **Merken:** Race-Conditions (UI-Stand ≠ DB-Stand) lassen sich mit Skript im Hintergrund + Flag-Datei + SQL dazwischen nachstellen.

## 2026-10-15 — Spec 05: Dashboard-Shell
- **Lief gut:** Server-Komponenten als Props (`editor`, `preview`) an eine kleine Client-Komponente geben – nur der Umschalter braucht JS, der Rest bleibt Server-gerendert.
- **Problem:** „unstable value `Date.now()` while prerendering“ auf `/dashboard`, obwohl alles hinter `<Suspense>` stand → **Ursache:** `partialPrefetching` rendert auch mit Cookies vor, `getClaims()` nutzt `Date.now()` → **Lösung:** `await connection()` vor der Auth-Prüfung.
- **Merken:** Dev-Log nach jedem Browser-Test auf `Error:` durchsuchen, nicht nur auf das Overlay-Badge schauen. Zum Bauen den Dev-Server vorher stoppen.

## 2026-10-15 — Spec 04: Sign-Up / Login / Logout
- **Lief gut:** Einstellungen von Supabase Auth lassen sich ohne Dashboard prüfen: `GET <URL>/auth/v1/settings` mit `apikey`-Header zeigt z. B. `mailer_autoconfirm`.
- **Problem:** CSS-Token kam im Browser nicht an, obwohl es in `globals.css` stand → **Ursache:** `npm run build` lief parallel zu `next dev`, beide nutzen `.next` → **Lösung:** Dev-Server stoppen, `.next` löschen, neu starten. Künftig nie bei laufendem Dev-Server bauen.
- **Problem:** `TaskStop` auf `npm run dev` beendet nur npm, der Next-Prozess hält Port 3000 → **Lösung:** Prozess über den Port finden und beenden.
- **Problem:** Typecheck meldet unbekannte Route bei `PageProps<"/neu">` → Route-Typen entstehen erst durch `next dev`/`next build`; danach erneut prüfen.
- **Merken:** browser-use: nach Reload nicht sofort `js()` aufrufen („Inspected target navigated“) – lieber neu navigieren und kurz warten.

## 2026-10-15 — Spec 03: Auth-Infrastruktur
- **Lief gut:** Cache-Header-Test ohne echten Login: kaputten `sb-…-auth-token`-Cookie mitschicken → Supabase löscht ihn per `setAll`, die Antwort muss `Cache-Control: private, no-store …` tragen.
- **Problem:** Eingeloggte Pfade lassen sich mit curl allein nicht testen → **Lösung:** Test-User per SQL (Token-Spalten als `''`), Login mit `@supabase/ssr` in einem Node-Skript, Cookies als Header an curl.
- **Merken:** Im Proxy jeder eigene Redirect muss Cookies UND Cache-Header der Session-Response übernehmen, sonst endet die Session bzw. ein CDN könnte sie cachen.

## 2026-10-15 — Spec 02: Datenbank-Schema
- **Lief gut:** Alle RLS-/CHECK-Tests in einem einzigen `DO`-Block: Rolle per `set_config('role', …, true)` + `request.jwt.claims` wechseln, jeden Fall in `begin … exception … end` kapseln, Ergebnisse sammeln → eine Tabelle mit Soll/Ist.
- **Problem:** Neue Tabellen sind seit 2026 nicht mehr automatisch über die Data API erreichbar → **Lösung:** immer `revoke all` + gezielte GRANTs pro Rolle in der Migration.
- **Merken:** Spalten-Grants (`grant update (spalte, …)`) sind die einfachste Art, „nicht änderbare“ Felder wie Username oder `user_id` hart abzusichern — RLS schützt Zeilen, Grants schützen Spalten.

## 2026-10-15 — Spec 01: UI-Fundament
- **Lief gut:** shadcn-Init + Komponenten ohne Rückfragen (`-y`, `-b radix`); typecheck/lint/build auf Anhieb grün.
- **Problem:** shadcn-Init schreibt `--font-sans: var(--font-sans)` (Selbstreferenz) und reine Weiß-Tokens → **Lösung:** nach jedem Init `globals.css` gegen `rules/design-system.md` prüfen.
- **Problem:** browser-use: Nach `Emulation.setEmulatedMedia` hinkte die Theme-Klasse einen Schritt hinterher; Tastatur-Events kamen nicht an → **Lösung:** nach Media-Emulation neu laden; vor Tastatur-Tests `Page.bringToFront` + `Emulation.setFocusEmulationEnabled`; Screenshot-Pfade mit `/` (sonst wird `\f` zum Steuerzeichen).
- **Merken:** Hydration-Warnungen im Dev-Overlay zuerst auf Browser-Extensions prüfen (Grammarly setzt `data-gr-*` auf `<body>`). `python3` ist unter Windows nur ein Store-Platzhalter und hängt — Node oder uv-Python nutzen.
