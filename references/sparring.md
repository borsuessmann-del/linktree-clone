# Sparring — Entscheidungen

Stand: 2026-10-15 · Phase 2, drei Runden. Grundlage: `discovery.md`.
Legende: ✅ vom User entschieden · 🔧 Default von Claude gesetzt (widersprechbar)

## Runde 1 — Produkt-Fundament
| Thema | Entscheidung |
|---|---|
| URL-Struktur | ✅ `/u/<username>` |
| Username-Claim | ✅ Drittes Feld im Sign-Up-Form mit Live-Verfügbarkeitsprüfung |
| Login ohne Username | ✅ entfällt — jeder User hat ab Sign-Up einen Username; nach Sign-Up direkt ins Dashboard, kein Onboarding-Wizard |
| Link-Typen | ✅ Nur `http(s)://`-URLs (blockt `javascript:` u. ä.) |
| Unbekannter Username | ✅ Freundliche 404 im App-Design + CTA „Eigene Seite erstellen" |

## Runde 2 — UX-Details
| Thema | Entscheidung |
|---|---|
| Editor-Layout | ✅ Split-View: links Editor (Profil, Farbe, Links), rechts sticky Phone-Preview; Mobile: Toggle „Bearbeiten / Vorschau" |
| Accent-Color-Auswahl | ✅ 10 Presets + „Eigene Farbe" (`<input type="color">`); Textfarbe auf Buttons automatisch per WCAG-Kontrast |
| CSS-Variable | ✅ `--brand` + `--brand-foreground` statt `--accent` (shadcn-Konflikt) → siehe guidelines 002 |
| Drag-and-Drop | ✅ Motion `Reorder` mit Drag-Griff + ↑/↓-Buttons → guidelines 003 |
| Löschen | ✅ Sofort + Undo-Toast (5 s) |
| Sichtbarkeit | ✅ Switch pro Link (`is_visible`) im MVP |
| Username-Regeln | ✅ `/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/`, lowercase, unique; Reserved Words laut discovery.md §1 |
| Feld-Limits | ✅ Display-Name 50, Bio 160 Zeichen |
| Username ändern | ✅ Nein → Backlog |

## Runde 3 — Rest
| Thema | Entscheidung |
|---|---|
| Dark Mode Public-Page | ✅ Folgt Besucher-System; Dashboard mit Theme-Umschalter |
| Passwort | ✅ Min. 8 Zeichen (Supabase-Dashboard + Formular + Server Action) |
| Startseite `/` | ✅ Kleine Landing-Page (Hero, Beispiel-Profil, Registrieren/Login) |
| Phase-3-Quellen | ✅ Linktree, Beacons + Cal.com / Linear / Vercel + aktuelle Link-in-Bio-Tools mit Design-Anspruch (Bento.me ist abgeschaltet) |

## Defaults (🔧, widersprechbar)
| Thema | Default | Warum |
|---|---|---|
| Link-Felder | 🔧 Titel (Pflicht, max. 80) + URL (Pflicht) | Ohne Titel sieht die Seite nach URL-Liste aus |
| Neuer Link | 🔧 wird oben eingefügt | Frisch hinzugefügtes ist meist das Wichtigste (Linktree-Verhalten) |
| Default-Farbe | 🔧 Indigo `#4f46e5` | Erstes Preset, guter Kontrast in Hell und Dunkel |
| Avatar | 🔧 optionale `https://`-URL, bei Fehler/leer → Initialen-Fallback | Kein Upload im Scope; kaputte Bilder dürfen das Layout nicht brechen |
| Login-Fehler | 🔧 generische Meldung „E-Mail oder Passwort falsch" | Verrät nicht, welche E-Mails registriert sind |
| Login/Sign-Up-Seiten | 🔧 getrennt: `/login`, `/signup` | Klare URLs, einfacher zu verlinken |
| Max. Links pro User | 🔧 100 | Schützt Reorder-RPC und Free-Tier |
