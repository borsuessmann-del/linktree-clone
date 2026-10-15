# Linktree-Clone

Link-in-Bio-App im Stil von Linktree / Bento.me — Kurs-Projekt für den Einstieg ins Agentic Coding.

User registrieren sich mit E-Mail + Passwort, bekommen eine öffentliche Seite unter `/u/<username>`, verwalten ihre Links per Drag-and-Drop und wählen eine Accent-Color.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui · Framer Motion · Lucide · Supabase (Postgres + Auth + RLS) · Vercel — alles auf Free-Tiers.

## Lokal starten
```bash
npm install
npm run dev        # http://localhost:3000
```
Voraussetzung: `.env.local` mit den Supabase-Keys (kommt im Supabase-Setup).

## Dokumentation
| Datei | Inhalt |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Einstieg für den Coding-Agent (Router zu allen Regeln) |
| [implementierungsplan.md](implementierungsplan.md) | Arbeitspakete + Status |
| [specs/](specs/README.md) | Feature-Specs `NN-<feature>.md` + Template |
| [guidelines.md](guidelines.md) | Architektur-Entscheidungen |
| [rules/](rules/) | Design-System, Code-Konventionen, Verifikation, Tech-Stack |
| [references/](references/README.md) | Discovery- und Design-Recherche |
| [changelog.md](changelog.md) · [learning.md](learning.md) · [backlog.md](backlog.md) | Protokoll, Debriefs, Ideen-Parkplatz |
