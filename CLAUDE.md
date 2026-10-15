# Linktree-Clone — CLAUDE.md

@AGENTS.md

## Kommunikation
- Deutsch, RPL: respektvoll, pragmatisch, lösungsorientiert.
- Mitbauende sind Einsteiger: jeden Schritt vor dem Ausführen in 1–2 Sätzen begründen, Fachwörter kurz erklären.

## Projekt
Link-in-Bio-App (wie Linktree/Bento.me): Email+Passwort-Auth, öffentliche Seite unter `/u/<username>`, Links per Drag-and-Drop sortierbar, eine Accent-Color pro User.

## Wann welche Datei lesen
| Situation | Datei |
|---|---|
| UI bauen oder stylen | `rules/design-system.md` |
| Code schreiben, Dateien anlegen | `rules/code-conventions.md` |
| Arbeitspaket abschließen | `rules/verification.md` |
| Commands, Ordner, MCPs | `rules/tech-stack.md` |
| Architektur-Frage / neue Entscheidung | `guidelines.md` |
| Nächstes Feature wählen | `implementierungsplan.md` → `specs/NN-*.md` |
| Neue Spec anlegen | `specs/README.md` |
| Idee außerhalb des Scopes | `backlog.md` |

## Tools
- **Supabase MCP** (full-access, nur Kurs-Projekt): Schema, Migrations, SQL, Typen.
- **Context7 MCP**: aktuelle Docs (Next.js, Supabase, shadcn, Framer Motion) — vor API-Nutzung abrufen, nie aus dem Gedächtnis.
- **Skills** (`.claude/skills/`): shadcn, supabase, supabase-postgres-best-practices.
- **browser-use** (steuert das sichtbare Chrome, Details in `rules/tech-stack.md`): Visual Verification Loop bei UI-Arbeit.

## Kernprinzipien
1. MVP-Scope ist fix — alles andere landet in `backlog.md`.
2. Eine Spec = ein Build-Loop: Plan → Build → Check.
3. Next.js 16 weicht vom Trainingswissen ab (z. B. `proxy.ts` statt `middleware.ts`) → Docs lesen.
4. Accent-Color nur als validierter Hex `/^#[0-9a-f]{6}$/i`, client- UND serverseitig.
5. Row Level Security auf jeder Tabelle, ohne Ausnahme.
6. Keine Commits vor Sub 5.13.7 (Git + GitHub + Vercel).
7. Nach jedem Arbeitspaket: `rules/verification.md` abarbeiten.
