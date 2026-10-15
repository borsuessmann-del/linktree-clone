# Implementierungsplan

## Projektbeschreibung
Link-in-Bio-App im Stil von Linktree / Bento.me. User registrieren sich mit E-Mail, Passwort (min. 8) und Username und landen direkt im Dashboard. Ihre öffentliche Seite unter `/u/<username>` zeigt Profil (Display-Name, Bio, Avatar-URL) und URL-Links, die per Drag-and-Drop (Motion `Reorder` + ↑/↓) sortiert und einzeln ausgeblendet werden können. Eine Accent-Color (10 Presets + eigene Farbe) färbt die Seite als CSS-Variable `--brand`. Design-Niveau: Linear / Cal.com — abgestufte Neutrals, Layering, weiche Schatten, Dark Mode nach Besucher-System.

Grundlagen: `references/discovery.md` · `references/sparring.md` · `references/design-analysis.md` · `guidelines.md` · `rules/`.

## Arbeitspakete

| # | Feature | Spec | Abhängigkeiten | Status |
|---|---|---|---|---|
| 01 | UI-Fundament (shadcn, tweakcn-Tokens, Dark Mode, Basis-Pakete) | [specs/01-ui-foundation.md](specs/01-ui-foundation.md) | — | ✅ |
| 02 | Datenbank-Schema + RLS + Trigger + RPC | [specs/02-database-schema.md](specs/02-database-schema.md) | — | ✅ |
| 03 | Supabase-Clients, `proxy.ts`, DAL | [specs/03-auth-infrastructure.md](specs/03-auth-infrastructure.md) | 02 | ✅ |
| 04 | Sign-Up / Login / Logout | [specs/04-auth-flows.md](specs/04-auth-flows.md) | 01, 02, 03 | ✅ |
| 05 | Dashboard-Shell (Layout, Navigation, Theme-Toggle) | [specs/05-dashboard-shell.md](specs/05-dashboard-shell.md) | 01, 04 | ✅ |
| 06 | Profil-Editor (Name, Bio, Avatar-URL) | [specs/06-profile-editor.md](specs/06-profile-editor.md) | 05 | ✅ |
| 07 | Link-CRUD (+ Sichtbarkeit, Undo-Löschen) | [specs/07-link-crud.md](specs/07-link-crud.md) | 05 | ✅ |
| 08 | Link-Reorder (Motion Reorder + ↑/↓) | [specs/08-link-reorder.md](specs/08-link-reorder.md) | 07 | ✅ |
| 09 | Accent-Color (Presets, Picker, `--brand`, Kontrast) | [specs/09-accent-color.md](specs/09-accent-color.md) | 05 | ✅ |
| 10 | Public-Page `/u/<username>` + 404 | [specs/10-public-page.md](specs/10-public-page.md) | 02, 03, 09 | ✅ |
| 11 | Live-Preview im Dashboard (Phone-Frame) | [specs/11-live-preview.md](specs/11-live-preview.md) | 06, 07, 08, 10 | ✅ |
| 12 | Landing-Page `/` mit Claim-Feld | [specs/12-landing-page.md](specs/12-landing-page.md) | 04, 10 | ✅ |
| 13 | Deployment (GitHub + Vercel) | [specs/13-deployment.md](specs/13-deployment.md) | 01–12 | 🚧 |

**Parallelisierbar:** 01 ∥ 02 · danach 06 ∥ 07 ∥ 09 (alle nur von 05 abhängig).

## Offene Voraussetzungen (vor Build-Loop 01)
- [x] UI-Setup aus Kurs-Sub 5.13.3 (tweakcn-Theme, shadcn-Init) — oder in Spec 01 erledigen
- [x] Supabase Dashboard → Auth → Providers → Email: **Minimum password length = 8**

## Status-Legende
| Symbol | Bedeutung |
|---|---|
| ⏳ | offen |
| 🚧 | in Arbeit |
| ✅ | fertig und verifiziert (siehe `rules/verification.md`) |
