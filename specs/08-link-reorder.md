# 08 — Link-Reorder

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
User sortieren ihre Links per Drag-and-Drop am Griff (Maus und Touch) oder per ↑/↓-Buttons (Tastatur); die Reihenfolge wird atomar gespeichert und auf der Public-Page übernommen.

## Abhängigkeiten
- 07 — Link-Liste und Link-Cards

## Out of Scope
- Tastatur-Drag mit Screenreader-Ansagen (Backlog: dnd-kit) · Sektionen/Gruppen

## Akzeptanzkriterien
- [x] `Reorder.Group axis="y"` / `Reorder.Item` aus `motion/react`, `key={link.id}`
- [x] Ziehen nur am Griff (`GripVertical`, `dragListener={false}` + `useDragControls`, Griff mit `touch-none`, `cursor-grab`/`grabbing`)
- [x] Gezogenes Item angehoben: stärkerer Schatten, leichte Skalierung, `relative` für z-index
- [x] ↑/↓-Buttons pro Link mit `aria-label` („<Titel> nach oben"); erster ↑ / letzter ↓ disabled
- [x] Speichern einmal in `onDragEnd` bzw. pro Button-Klick (nicht in `onReorder`); aktuelle Liste per `useRef`, falls `onDragEnd` veralteten State sieht
- [x] Server Action `reorderLinks(ids)` → Zod (`uuid[]`, max. 100) → RPC `reorder_links`
- [x] Optimistisch via `useState` + `useTransition`; Fehler → Rollback + Toast
- [x] Scrollt die Liste nicht von selbst / kein Scroll-Konflikt auf dem Handy
- [x] `prefers-reduced-motion` reduziert Animationen

## Tasks
1. Next/Motion-Docs via Context7 (`/websites/motion_dev`, Reorder + useDragControls)
2. `ReorderableLinkList` (Client Component) um die Cards aus 07
3. Server Action + RPC-Aufruf
4. Move-Buttons + Fokus bleibt nach Verschieben auf dem Button

## Validation
- browser-use Desktop: Drag per Maus → Reload zeigt neue Reihenfolge
- Mobile-Emulation (390px, Touch): Seite scrollt beim Wischen außerhalb des Griffs; Drag am Griff funktioniert
- Tastatur: Tab zu ↑/↓, Enter verschiebt, Fokus bleibt sinnvoll
- Public-Page zeigt dieselbe Reihenfolge

## Relevante Rules / Skills
- `guidelines.md` 003 · `references/discovery.md` §4 · Context7: motion

## Debrief
- Dateien: `src/components/dashboard/links/{links-editor,link-editor-card}.tsx`, `src/app/dashboard/link-actions.ts` (`reorderLinks`), `src/lib/validation/link.ts` (`linkOrderSchema`). Quellen: Context7 `/websites/motion_dev` (Reorder, useDragControls, MotionConfig).
- Jede Karte ist ein `Reorder.Item` (auch im Bearbeiten-Modus, ohne Griff). Gespeichert wird in `onDragEnd` mit der Liste aus `useRef` (vor Drag-Start als Rollback-Stand gemerkt) bzw. pro ↑/↓-Klick. Speichervorgänge laufen über eine Promise-Warteschlange nacheinander; lokale Positionen werden auf den Index gesetzt (wie die RPC).
- Fokus nach ↑/↓: bleibt auf dem Pfeil desselben Links, wechselt auf den anderen Pfeil, wenn der Link oben/unten ankommt.
- `MotionConfig reducedMotion="user"`: Skalierung/Layout-Animation entfallen, Ziehen selbst funktioniert weiter (getestet).
- Validation (browser-use): Maus-Drag mit `scale(1.02)` → Reload bestätigt · ↑ erster / ↓ letzter disabled · Enter auf ↓ verschiebt, Fokus wie oben · reduced motion: nur `translateY`, Reorder klappt · Touch (390px, Touch-Emulation): Griff `touch-action: none`, Karte `auto`; Touch-Drag am Griff sortiert um, Geste auf der Karte nicht · DB-Reihenfolge = UI nach Reload. Testdaten gelöscht.
- Nicht automatisiert prüfbar: echtes Seiten-Scrollen per Touch (`Input.synthesizeScrollGesture` scrollte in der Testumgebung gar nicht, auch nicht auf der Kontroll-Card) → einmal manuell am Handy prüfen. Public-Page-Reihenfolge wird mit Spec 10 geprüft (gleiche Sortierung per `position`).
