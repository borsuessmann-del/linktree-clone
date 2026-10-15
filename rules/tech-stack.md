# Tech-Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui · Framer Motion · Lucide · Supabase · Vercel · npm

> Next.js 16 hat Breaking Changes gegenüber 15 (u. a. `proxy.ts` statt `middleware.ts`). Vor API-Nutzung `node_modules/next/dist/docs/` oder Context7 lesen.

## Commands
| Command | Zweck |
|---|---|
| `npm run dev` | Dev-Server auf http://localhost:3000 |
| `npm run build` | Produktions-Build (muss vor Deploy grün sein) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` — Script wird im UI-Setup in `package.json` ergänzt; bis dahin `npx tsc --noEmit` |
| `npx shadcn@latest add <komponente>` | shadcn-Komponente nach `src/components/ui/` kopieren |
| `npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts` | DB-Typen generieren (alternativ via Supabase MCP) |
| `browser-use <<'PY' … PY` | Steuert das laufende Chrome (sichtbar = „headed"; es gibt kein `--headed`-Flag). Python-Helfer: `new_tab`, `goto_url`, `wait_for_load`, `capture_screenshot(path, max_dim=1800)`, `js`, `cdp`. Immer eigenen Tab öffnen und am Ende `close_tab()`. Viewport via `cdp("Emulation.setDeviceMetricsOverride", …)`. Voraussetzung: Remote-Debugging in `chrome://inspect/#remote-debugging` an. |

> Windows-Hinweis: `python` ist hier nur der Microsoft-Store-Platzhalter. Für Skripte das uv-Python nutzen: `~/AppData/Roaming/uv/tools/browser-use/Scripts/python.exe -I -X utf8`.

## MCPs (Scope: project)
- **Supabase** (full-access, Service-Role-Token des Kurs-Projekts — nie Prod-DB): Tabellen, Migrations, SQL, Typen, Logs.
- **Context7**: aktuelle Library-Docs.

## Ordner-Struktur
```
src/
  app/            Routen (App Router): (auth)/, dashboard/, u/[username]/
  components/     UI-Komponenten; ui/ = shadcn
  lib/            Supabase-Clients, Validierung, Utils, DB-Typen
specs/            Feature-Specs NN-<feature>.md
rules/            Regeln für den Agent
references/       Recherche + Screenshots
```
