# Discovery — Phase 1

Stand: 2026-10-15 · Konsolidiert aus 4 parallelen Research-Agents.
Legende: **[B]** belegt (Docs, Quelle oder eigener Test) · **[A]** abgeleitet/Empfehlung.

---

## 1. UX-Patterns bei Linktree-Alternativen

### Kern-Erkenntnisse
- **Bento.me ist tot** [B]: Am 13.02.2026 abgeschaltet, `bento.me/<x>` leitet per 301 auf `linktr.ee/` weiter. Bento-Layouts leben in Linktree weiter. → Nur noch historische Referenz.
- **linko.bio ist kein vergleichbares Produkt** [B]: Kleine spanische WordPress-Visitenkarten-Seite. → Aus der Analyse gestrichen.
- **URL-Struktur**: Alle Anbieter nutzen Pfade statt Subdomains (`linktr.ee/name`, `beacons.ai/name`) [B].
- **Linktree-Username-Regel**: `/^[a-zA-Z0-9._-]{3,30}$/`, alle 7 Tage änderbar [B]. Eine Reserved-Words-Liste ist nicht öffentlich.
- **Username-Claim früh**: Linktree hat ein Claim-Feld auf der Startseite plus einen eigenen „Choose your username"-Schritt in der Registrierung [B].
- **Editor**: Links bearbeitet man auf der linken Seite, rechts liegt eine Live-Preview. Bei Linktree steckt sie in einem Phone-Frame, auf Mobile steht sie über den Einstellungen [B].
- **Link-Verwaltung**:
  - Sichtbarkeits-Schalter pro Link (Linktree, Beacons) [B].
  - Linktree bietet „Archive" (wiederherstellbar) und „Delete" (endgültig) [B].
  - Beacons hat ein ⋯-Menü mit Hoch/Runter [B].
- **Farben**: Zuerst Presets bzw. Themes, die freie Farbwahl ist nachrangig. Die Live-Preview gehört dazu [B].
- **Unbekannter Username**: Linktree zeigt eine schlichte 404 ohne Claim-Aufruf [B].

### Empfehlungen
1. **Username-Regex** `/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/` (3–30 Zeichen, nur Kleinbuchstaben, ohne Punkte, Anfang und Ende alphanumerisch). Zusätzlich `unique` in der DB [A]. Das verhindert Groß/Klein-Dubletten und unschöne URLs.
2. **Reserved Words** prüfen wir client- und serverseitig [A]. Vorschlag: `admin, api, app, auth, login, logout, signup, register, settings, dashboard, edit, account, profile, u, help, support, about, terms, privacy, static, _next, assets, public, null, undefined, root, www, mail, me, new`.
3. **Limits**: Display-Name 50 Zeichen, Bio 160 Zeichen, jeweils mit Zeichenzähler [A].
4. **Editor**: zweispaltig, rechts eine sticky Phone-Preview. Auf Mobile ein Umschalter „Bearbeiten / Vorschau" [A].
5. **Reorder** nur über einen sichtbaren Griff (Lucide `GripVertical`), nicht über die ganze Card [A].
6. **Löschen** mit Undo-Toast (~5 s) oder Bestätigungsdialog [A].
7. **Empty States** [A]:
   - CTA „Füge deinen ersten Link hinzu".
   - Initialen-Fallback für den Avatar.
   - Banner „Deine Seite ist live: /u/name [Kopieren]".
8. **Unbekannter Username**: freundliche 404, optional mit „Eigene Seite erstellen" [A].

---

## 2. Supabase Email+Passwort-Auth in Next.js 16

Quellen: Context7 `/supabase/supabase` und `/supabase/ssr`, Supabase-MCP `search_docs`, lokale Docs `node_modules/next/dist/docs/`.

### Kern-Erkenntnisse
- **Pakete** [B]: `@supabase/ssr@0.12.7` und `@supabase/supabase-js@2.117.3`, Versionen festpinnen. `auth-helpers-nextjs` ist veraltet.
- **`proxy.ts` statt `middleware.ts`** [B]: Ab Next 16 heißt die Datei `src/proxy.ts` (Funktion `proxy`) und läuft in der Node-Runtime. `export const runtime` ist dort verboten. Der Supabase-Code bleibt identisch.
- **`getClaims()` ist Standard** [B]:
  - `getClaims()` prüft die JWT-Signatur lokal über JWKS (die öffentlichen Schlüssel des Projekts) und frischt die Session auf.
  - `getUser()` braucht eine Netzwerkabfrage und ist nur nötig, wenn widerrufene Sessions erkannt werden sollen.
  - **`getSession()` nie zur Autorisierung auf dem Server**: Der Cookie ist fälschbar.
- **`setAll(cookies, headers)`** [B]: Der neue zweite Parameter enthält Cache-Header. Im Proxy müssen sie auf die Response, sonst kann ein CDN Sessions cachen.
- **`cacheComponents: true`** (aktiv in `next.config.ts`) [B]:
  - Wer `cookies()` liest, muss in einer `<Suspense>`-Grenze stehen oder `loading.tsx` haben, sonst gibt es einen Build-Fehler.
  - `'use cache'` lässt sich nicht mit Cookies kombinieren, dafür gibt es `'use cache: private'`.
  - `force-dynamic` entfällt.

### Empfohlene Architektur
| Datei | Verantwortung |
|---|---|
| `src/lib/supabase/client.ts` | `createBrowserClient` für Client Components |
| `src/lib/supabase/server.ts` | `async createClient()` mit `await cookies()`, `getAll`/`setAll` in try/catch, pro Request neu |
| `src/lib/supabase/proxy.ts` | `updateSession(request)`: Token-Refresh + Redirects |
| `src/proxy.ts` | ruft `updateSession` auf, Matcher schließt statische Dateien aus |
| `src/lib/auth/dal.ts` | `requireUser = cache(...)` mit `getClaims()`, sonst `redirect('/login')` [A] |
| `src/app/(auth)/…/actions.ts` | Server Actions `signup`, `login`, `logout` mit `useActionState` |

**Anpassung am offiziellen Beispiel** [A]: Das Beispiel leitet *jeden* ausgeloggten Request auf `/login` um. Bei uns sind `/` und `/u/*` öffentlich. Deshalb leiten wir nur `/dashboard*` um und schicken eingeloggte User von `/login` und `/signup` weg.

**Profil per DB-Trigger** [B]: Beim Sign-Up werden die Zusatzdaten über `options.data` übergeben und landen in `raw_user_meta_data`. Ein Trigger `on auth.users after insert` legt daraus die Zeile in `public.profiles` an. Die Trigger-Funktion braucht `security definer set search_path = ''` und voll qualifizierte Tabellennamen.

### Fallstricke
1. Code zwischen `createServerClient` und `getClaims()` im Proxy führt zu „zufälligen" Logouts.
2. Eine eigene Response oder ein Redirect im Proxy ohne übernommene Cookies und Cache-Header beendet die Session.
3. Der Proxy ist nur ein optimistischer Check. Die echte Prüfung passiert in der DAL (Data Access Layer, der zentralen Stelle für Datenzugriff mit Auth-Prüfung), in jeder Server Action und in RLS.
4. **Ein Trigger-Fehler blockiert den Sign-Up** und erzeugt die Meldung „Database error saving new user" (z. B. bei einer Username-Kollision). Deshalb den Username vorher in der Action validieren und auf Verfügbarkeit prüfen.
5. `raw_user_meta_data` kann der User selbst ändern, also nie für Autorisierung oder RLS nutzen. Maßgeblich ist `profiles.username`.
6. Eine `security definer`-Funktion in `public` ist per RPC aufrufbar. Deshalb `revoke execute … from public, anon, authenticated` und danach `get_advisors` laufen lassen.
7. `redirect()` nie innerhalb von `try/catch` aufrufen, weil es intern einen Fehler wirft.
8. Den Supabase-Server-Client nie als globales Singleton anlegen.

### Passwort
- Default-Mindestlänge 6 Zeichen. Supabase rät von weniger als 8 ab [B].
- Empfehlung [A]: Im Dashboard 8 einstellen und dieselbe Regel client- und serverseitig prüfen.
- Der Leaked-Password-Schutz ist nur im Pro-Plan verfügbar.

---

## 3. Theming für user-customizable Pages

### Kern-Erkenntnisse
- **Speicherung**: `text`-Spalte mit CHECK-Constraint statt JSON-Theme. Die DB ist damit die dritte Schutzschicht, auch gegen Zugriffe an der App vorbei [A].
- **Injection-Risiko**:
  - `<style>` per `dangerouslySetInnerHTML` mit User-Wert erlaubt CSS-Injection (`red;} body{…}`) und mit `</style><script>` sogar XSS [B, OWASP]. Realer Vorfall: XSS über „Custom Profile CSS" in BuddyPress [B].
  - Das React-`style`-Objekt ist gegen HTML-Ausbruch sicher. Aber CSS-Variablen akzeptieren auch `url(...)`, was Tracking erlaubt. **Erst Variable plus strikte Hex-Regex zusammen ist sicher.**
- **⚠️ Namenskonflikt `--accent`** [B, shadcn-Docs]:
  - In shadcn ist `--accent` die *dezente Hover- und Auswahl-Fläche*, keine Markenfarbe. Eine User-Farbe dort würde jeden Hover färben.
  - Empfehlung: eine eigene Variable `--brand` mit `--brand-foreground`.
  - Am Wrapper der Public-Page werden dann `--primary` und `--ring` daraus abgeleitet.
- **CSS-Variablen-Falle**: `:root { --primary: var(--brand) }` sieht ein erst am Wrapper gesetztes `--brand` nicht. Die abgeleiteten Tokens müssen am Wrapper selbst stehen (Klasse `.user-theme`) [B].
- **Abgeleitete Farben**:
  - `color-mix()` und `oklch()` sind breit unterstützt (Baseline 2023), die Relative Color Syntax seit 2024 [B]. → Hover-Töne und Verläufe in reinem CSS.
  - `contrast-color()` ist erst seit 04/2026 Baseline. → Textkontrast lieber **serverseitig per WCAG-Luminanz** berechnen [A].
- **Wo setzen**: Inline-Style am Wrapper in `/u/[username]`, nicht auf `<html>`. Das Root-Layout bleibt so statisch und cachebar, `.dark` auf `<html>` kollidiert nicht [A].

### Empfehlungen
1. `profiles.accent_color text not null default '#4f46e5'` mit `check (accent_color ~* '^#[0-9a-f]{6}$')`, Wert auf Kleinbuchstaben normalisieren.
2. **Eine** gemeinsame Validierungsfunktion (`isHexColor` bzw. ein Zod-Schema) für Formular und Server Action.
3. Wrapper: `<main className="user-theme" style={{ '--brand': c, '--brand-foreground': fg }}>` und in CSS `.user-theme { --primary: var(--brand); --primary-foreground: var(--brand-foreground); --ring: var(--brand); }`.
4. `--brand-foreground` immer berechnen: Weiß, wenn der Kontrast mindestens 4,5:1 ist, sonst `#0a0a0a`. Der User kann den Wert nie selbst wählen.
5. Presets: Indigo `#4f46e5`, Blau `#2563eb`, Cyan `#0891b2`, Smaragd `#059669`, Limette `#65a30d`, Amber `#d97706`, Orange `#ea580c`, Rose `#e11d48`, Pink `#db2777`, Violett `#7c3aed`. Optional zusätzlich `<input type="color">`.
6. Die Editor-Preview nutzt denselben Wrapper wie die Public-Page.

### Sicherheits-Checkliste Accent-Color
- [ ] Regex client-seitig
- [ ] Regex in der Server Action, bei Fehler ablehnen statt still korrigieren
- [ ] CHECK-Constraint (Test: `set accent_color = 'red'` schlägt fehl)
- [ ] RLS: nur der Owner darf schreiben, Lesen ist öffentlich
- [ ] Nur das `style`-Objekt verwenden, nie `<style>` oder `dangerouslySetInnerHTML`
- [ ] Ungültiger Wert aus der DB führt zur Default-Farbe
- [ ] Manueller Test: `red;} body{background:url(x)}` und `url(x)` werden abgelehnt

---

## 4. Drag-and-Drop für React 19

### Vergleich (npm-Stand 15.10.2026)
| | Motion `Reorder` (motion 14.2.0) | `@dnd-kit/react` 0.5.0 | `@dnd-kit/core` 6.3.1 |
|---|---|---|---|
| React 19 | ✅ offiziell | ✅ offiziell | funktioniert |
| Wartung | sehr aktiv | aktiv, aber **0.x** (API ändert sich noch) | **kein Release seit 12/2024** |
| Touch | Drag-Handle + `touch-none` nötig | Sensor mit Delay | Sensor mit Delay |
| Tastatur/Screenreader | **nichts eingebaut** | eingebaut | eingebaut |
| Code-Menge | am geringsten | mittel | am höchsten |
| Neue Abhängigkeit | nein (Motion ist ohnehin im Stack) | ja | ja |

### Empfehlung
**Motion `Reorder`**, wie im Kickoff vorgesehen [A], mit zwei Pflicht-Ergänzungen:
1. **Drag-Handle** mit `dragListener={false}` und `useDragControls`. Am Handle `touch-none`, sonst gibt es den Scroll-Konflikt auf dem Handy.
2. **↑/↓-Buttons** pro Link als Tastatur- und Screenreader-Fallback (etwa 15 Zeilen).

dnd-kit würde nur bei strenger Barrierefreiheits-Pflicht (Tastatur-Drag mit Ansagen) oder bei mehreren Listen nötig.

### Persistenz
- **Datenmodell**: `links.position integer not null` plus Index `(user_id, position)`. Bei unter 100 Links pro User komplett neu durchnummerieren. Fractional Indexing gehört ins Backlog.
- **Kein** einfacher `unique (user_id, position)`, sonst scheitert schon das Vertauschen zweier Links. Entweder `deferrable` oder ganz weglassen.
- **Atomar speichern** per RPC `reorder_links(link_ids uuid[])` (`security invoker`, `update … from unnest(...) with ordinality`). Die RLS bleibt damit aktiv.
- **Wann speichern**: in `onDragEnd` und beim ↑/↓-Klick, **nicht** in `onReorder`, das bei jedem Platzwechsel feuert.
- **Optimistic UI**: `useState` plus `useTransition`. Bei einem Fehler zurücksetzen und einen Toast zeigen. `useOptimistic` passt hier schlecht.

### Fallstricke
- `key={link.id}`, nie den Index verwenden.
- Jeder `value` muss eine Referenz aus `values` sein.
- Items brauchen `relative` für den richtigen z-index beim Ziehen.
- Ein Scroll-Container braucht `layoutScroll`.
- `axis="y"` explizit setzen.
- Ob `onDragEnd` schon den letzten Stand sieht, ist noch ungetestet. Falls nicht, die aktuelle Liste per `useRef` mitführen.

---

## Konsequenzen für die nächsten Phasen
- **Phase 3**: Bento.me ist nicht mehr erreichbar, linko.bio irrelevant. Ersatz-Kandidaten mit hohem Design-Niveau festlegen (Sparring).
- **Sparring**: Entscheidung zu `--accent` vs. `--brand`. Das weicht von der Kickoff-Architektur ab.
- **Vor den Build-Loops**: UI-Setup (shadcn-Init, tweakcn-Theme) muss erledigt sein.
