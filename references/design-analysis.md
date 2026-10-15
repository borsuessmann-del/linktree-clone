# Design-Analyse — Phase 3

Stand: 2026-10-15 · Live mit `browser-use` (steuert lokales Chrome). Profile mit 390 px Breite (Handy), Startseiten mit 1440 px (Desktop).
Werte mit **[M]** sind per `getComputedStyle` **gemessen**. Werte mit **[S]** sind aus Screenshots geschätzt.
Screenshots: `inspiration/` (Vorbilder) · `anti-inspiration/` (Gegenbeispiele).

## Quellen
| Seite | Screenshot | Rolle |
|---|---|---|
| linktr.ee (Start) | `linktree-home.png` | Marktführer, Landing |
| linktr.ee/selenagomez | `linktree-profile-selenagomez.png` | Profil: Cards mit Thumbnail, Sektionen |
| linktr.ee/tonyhawk | `linktree-profile-tonyhawk.png` | Profil: Hintergrundbild, Pill-Buttons |
| linktr.ee/mkbhd | `linktree-profile-mkbhd.png`, `…-darkpref.png` | Profil: dunkle Buttons; Dark-Mode-Test |
| linktr.ee/spotify | `anti-inspiration/linktree-profile-spotify-flat.png` | Gegenbeispiel: flache Vollfarbe |
| beacons.ai | `beacons-home.png` | Landing (keine Profil-Links auf der Startseite) |
| hoo.be + hoo.be/chrishemsworth | `hoobe-home.png`, `hoobe-profile.png` | Link-in-Bio mit Design-Anspruch, Bento-artiges Grid |
| komi.io | `komi-home.png` | Dark, Glow-Gradient |
| bio.link | `biolink-home.png` | Claim-Input, Gradient-CTA |
| cal.com | `calcom-home.png` | Ziel-Niveau: Layering, Button-Gradients |
| linear.app | — (Hero ist WebGL und rendert im Hintergrund-Tab nicht, nur Werte gemessen) | Ziel-Niveau: Dark Neutrals, Motion |
| vercel.com | `vercel-home.png` | Ziel-Niveau: Typografie |

**Grenzen:** Bento.me ist abgeschaltet. Beacons-Profile sind von der Startseite aus nicht verlinkt. Hover-Zustände ließen sich im Hintergrund-Tab nicht auslösen, deshalb sind nur die `transition`-Definitionen gemessen.

---

## 1. Farbpaletten

| Quelle | Hintergrund | Text | Akzent / Besonderheit |
|---|---|---|---|
| Linktree Landing | `#ffffff`, Hero Lime `#d2e823` [M] | Navy `#1e2330` [M] | Dunkelgrün `#254f1a`, Weinrot-Banner |
| Linktree Profil (Selena) | Canvas `#eceef1`, Cards weiß [M] | `#000` [M] | Thumbnail-Bilder bringen die Farbe |
| Linktree Profil (MKBHD) | weiß | weiß auf Slate `≈#2c3135` [S] | Avatar-Rot als einziger Akzent |
| hoo.be | `lab(100 0 0)` = weiß, Text `lab(2.75)` ≈ `#0a0a0a` [M] | — | Gradient-Text Cyan→Teal [S] |
| Komi | `#000` mit violettem Radial-Glow [M/S] | weiß | Lime `#e3f331`, Violett `#5f3ae8`-Bereich |
| bio.link | weiß | `#0d0d0d` [M] | CTA `linear-gradient(126deg, #ff5858 → #c058ff)` [M] |
| Cal.com | Canvas `#f4f4f4`, Panels weiß [M] | `#242424` [M] | Graustufen-Gradients statt Farbe |
| Linear | `#08090a` [M] | `#f7f8f8`, muted `#8a8f98` [M] | Indigo `#5e6ad2` [M] |
| Vercel | `#000000` [M] | `#ededed`, muted `#a1a1a1` [M] | Blau `#52a8ff` (Fokus) |

**Muster:**
- Die Hochwertigen (Linear, Cal.com) arbeiten fast nur mit **abgestuften Neutrals** und **einer** Akzentfarbe.
- Farbe kommt bei Link-in-Bio fast immer aus **Inhalten** (Avatar, Thumbnails) oder **einer** Markenfarbe.
- Linear nutzt `#08090a` statt `#000` und `#f7f8f8` statt `#fff`. Genau das verlangt unsere Regel „keine harten #000/#fff“. Vercel verwendet echtes Schwarz und ist hier kein Vorbild.

## 2. Typografie

| Quelle | Font | Display | Profil-Name | Link-Text |
|---|---|---|---|---|
| Linktree | Linksans / „Link Sans Product" [M] | 80px w800 [M] | 24px w600 [M] | 16px [M], wirkt w500 |
| hoo.be | Poppins [M] | 96px w700, enges Tracking [M/S] | ~26px w600 [S] | — |
| Komi | „Abcgravity Xcompressed" [M] | 160px, condensed, uppercase [M] | — | — |
| bio.link | Inter Bold [M] | 72px, sehr enges Tracking [M/S] | — | — |
| Cal.com | „Cal Sans" [M] | 64px w600 [M] | — | — |
| Linear | Inter Variable [M] | 64px **w510** [M] | — | Nav 13px [M] |
| Vercel | Geist [M] | 64px w400 [M] | — | Nav 14px [M] |

**Muster:**
- Eine einzige Schriftfamilie.
- Große Headlines mit **negativem Letter-Spacing**.
- Mittlere Gewichte (500–600) statt Bold für UI-Text.
- **Geist ist bei uns schon eingebunden** (`src/app/layout.tsx` via `next/font`) und ist die Vercel-Schrift. Wir brauchen also keine zusätzliche Schrift.

## 3. Spacing & Maße (Link-in-Bio-Profile)

| Element | Wert |
|---|---|
| Seiten-Gutter (Handy) | ~14px links und rechts (Cards 362px bei 390px Viewport) [M] |
| Link-Card-Höhe | **64px** bei Linktree, durchgängig [M] |
| Abstand zwischen Cards | ~14px [S] |
| Avatar | ~96px, rund [S]; hoo.be: ~120px mit hellem Ring und Verified-Badge [S] |
| Avatar → Name | ~24px [S]; Name → Bio ~8px [S]; Bio → erste Card ~32px [S] |
| Card-Radius | 16px (Selena), 64px als Pill (Tony Hawk) [M]; hoo.be-Grid ~24px [S] |
| Social-Icons (hoo.be) | runde 40px-Kreise, hellgrauer Hintergrund, eigene Zeile unter dem Namen [S] |

## 4. Elevation (Shadows & Layering)

| Quelle | Wert |
|---|---|
| Linktree Cards | `0 … rgba(0,0,0,.08)`, sehr weich [M] |
| Linktree „Join"-Pill | `… rgba(0,0,0,.2)` [M] |
| Tony Hawk | harter Offset-Schatten im Neo-Brutalism-Stil [S]. Passt **nicht** zu unserem Ziel. |
| Cal.com Buttons | `linear-gradient(#292929 → #242424)` + `inset 0 2px 0 rgba(255,255,255,.15)` [M]. Gradient mit Lichtkante wirkt „physisch". |
| Cal.com Badges | `0 4px 8px rgba(34,42,53,.05)` [M] |
| Cal.com Layout | weißes Panel mit großem Radius auf `#f4f4f4`-Canvas, also klares Layering [S] |
| Linear Sign-up | **mehrere gestapelte Schatten** mit Alpha .00–.04 [M]. Das ist der „weich, mehrschichtig"-Effekt. |

## 5. Motion

| Quelle | Transition [M] |
|---|---|
| Linktree CTAs | `background-color 0.15s cubic-bezier(0,0,.2,1), transform 0.15s` → **150ms ease-out** + Transform |
| Linktree Join-Pill | `0.2s cubic-bezier(.4,0,.2,1)` |
| hoo.be | `0.15s cubic-bezier(.4,0,.2,1)` |
| Linear | `0.1–0.16s cubic-bezier(.25,.46,.45,.94)` (easeOutQuad) |
| Vercel | `0.15s cubic-bezier(.4,0,.2,1)` |
| Komi | `background-color 0.2s` |

**Muster:**
- Alle bleiben bei **100–200ms**, ausgebremst am Ende (ease-out).
- Animiert werden Farbe, Hintergrund und `transform`, kein Layout.
- Unsere Regel „mind. 150ms ease-out“ deckt sich mit dem Marktstandard.
- Größere Bewegung gibt es nur beim Einblenden. Beispiele: der verschwommene Text bei Beacons, der sich schärft (Blur-Reveal), und der Glow-Hero bei Komi.

## 6. Layout-Muster

**Profilseite:**
- Eine Spalte, zentriert, oben Icon-Buttons (Logo und Teilen).
- Darunter Avatar, Name, Bio und dann der Link-Stack.
- Linktree zeigt unten eine schwebende Pill „linktr.ee/you ✕“ als Werbung für die eigene Plattform.

**Link-Card:**
- Text zentriert, optional ein Thumbnail links, ein ⋮-Menü rechts (Linktree).
- hoo.be nutzt ein Grid mit großen Media-Cards (Bento-Erbe).

**Gruppierung:** Selena hat Sektionsüberschriften wie „In The Dark“. Für unseren MVP ist das zu viel, also ein Backlog-Kandidat.

**Landing:**
- **Drei von fünf Link-in-Bio-Tools haben ein Claim-Feld im Hero:** hoo.be (`hoo.be/ yourhandle [Get started →]`), bio.link (`bio.link/name [Start]`) und Linktree.
- Header als schwebender, abgerundeter Container (Linktree, Komi, bio.link).

**Dark Mode:** Linktree-Profile ignorieren `prefers-color-scheme: dark` und bleiben weiß (`…-darkpref.png`). Unsere Entscheidung „folgt dem Besucher-System“ ist also eine echte Verbesserung.

---

## 7. Ableitungen für unser Design-System

### Tokens (Vorgabe für tweakcn → `globals.css`)
| Token | Light | Dark | Herkunft |
|---|---|---|---|
| `--background` | `#f4f4f5` (Canvas) | `#09090b` | Cal.com / Linear |
| `--card` | `#ffffff` | `#111114` | Layering Cal.com |
| `--foreground` | `#18181b` | `#f7f8f8` | Linear |
| `--muted-foreground` | `#71717a` | `#8a8f98` | Linear |
| `--border` | `#e4e4e7` | `rgba(255,255,255,.08)` | — |
| `--radius` | `1rem` (16px → `rounded-2xl`) | gleich | Linktree Cards |
| `--shadow-sm/md/lg` | 2–3 gestapelte Layer, Alpha ≤ .08 | in Dark: Schatten + 1px Lichtkante `inset 0 1px 0 rgba(255,255,255,.06)` | Linear / Cal.com |
| Font | Geist (schon eingebunden) | — | Vercel |

### Komponenten-Regeln
1. **Link-Card (Public):**
   - Höhe min. 56–64px, volle Breite, max. ~560px.
   - `rounded-2xl`, Abstand 12px.
   - Fläche als Gradient `from-card to-card/90` plus Lichtkante plus weicher Mehrfachschatten.
   - Text 16px w500, zentriert.
   - Hover: `translate-y-[-1px]`, stärkerer Schatten, Rand in `--brand`, 150ms ease-out. Active: `scale-[.98]`.
2. **Primär-Button:** Hintergrund `--brand` als vertikaler Gradient (oben ca. 8% heller per `color-mix`) plus Inset-Lichtkante, wie bei Cal.com.
3. **Avatar:** 96px, Ring in `--brand` mit 2px Abstand (hoo.be-Stil). Fallback auf Initialen auf einem `--brand`-Verlauf.
4. **Public-Page-Hintergrund:** dezenter Radial-Glow aus `--brand` oben, nach unten auslaufend (Komi, aber zurückhaltend mit ca. 10–15% Deckkraft). So gibt es keine flache Fläche, und die User-Farbe prägt die Seite.
5. **Einblend-Motion:** Links mit Stagger (30–50ms Versatz) als Fade + 8px Slide per Motion. Berücksichtigt `prefers-reduced-motion`.
6. **Footer-Pill** „Erstellt mit <App> · Eigene Seite“ unten auf der Public-Page (Linktree-Muster, dient gleichzeitig als CTA).
7. **Landing:** Hero mit **Claim-Feld** `/u/ [username] [Loslegen →]`, das den Wunschnamen an `/signup?username=…` weitergibt. Header als schwebender, abgerundeter Container.
8. **Dashboard:** Cal.com-Layering, also weiße bzw. dunkle Panels auf dem Canvas. Rechts die Phone-Preview mit Gerätrahmen (`rounded-[2.5rem]`, mehrschichtiger Schatten).

### Anti-Patterns (bewusst vermeiden)
- Flache Vollfarb-Buttons ohne Tiefe (`anti-inspiration/linktree-profile-spotify-flat.png`).
- Echtes `#000` als Hintergrund (Vercel).
- Harte Offset-Schatten und unruhige Foto-Hintergründe hinter Text (Tony Hawk: Lesbarkeit leidet).
- Text nur über Bildern ohne Kontrastschicht.
