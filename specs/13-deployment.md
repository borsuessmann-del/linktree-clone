# 13 — Deployment (GitHub + Vercel)

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Die App läuft öffentlich auf Vercel (Hobby), der Code liegt in einem GitHub-Repo; ab hier wird nach jedem Arbeitspaket committet (Kurs-Sub 5.13.7).

## Abhängigkeiten
- 01–12 — alle Features fertig und verifiziert

## Out of Scope
- Custom Domain · Preview-Umgebungen mit eigener Datenbank

## Akzeptanzkriterien
- [x] Globale git-Identität gesetzt (`user.name`, `user.email`)
- [x] `.env.local` NICHT im Repo (`git status` prüfen); keine Secrets im Code
- [x] Sinnvolle Commit-Historie seit dem Initial-Commit (Features gebündelt)
- [x] GitHub-Repo angelegt und gepusht
- [x] Vercel-Projekt verbunden, Env-Variablen `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` gesetzt
- [x] Supabase Auth → URL Configuration: Site-URL = Vercel-URL (im Dashboard durch User gesetzt und bestätigt)
- [x] `npm run build` lokal grün; Vercel-Build grün
- [x] Live-Test: Sign-Up, Link anlegen, `/u/<username>` auf der Live-URL, 404-Seite

## Tasks
1. `git config --global …`
2. Commits erstellen (nach User-Freigabe)
3. GitHub-Repo (User legt an oder `gh repo create`)
4. Vercel-Import + Env-Variablen
5. Supabase Site-URL anpassen
6. Live-Smoke-Test via browser-use

## Validation
- siehe `rules/verification.md` (Typ Deployment)
- `get_advisors` ein letztes Mal ohne Warnungen

## Relevante Rules / Skills
- `rules/verification.md` · `rules/tech-stack.md`

## Debrief
- **Live:** https://linktree-clone-ebon.vercel.app · **Repo:** https://github.com/borsuessmann-del/linktree-clone (öffentlich, Branch `main`).
- Git-Identität `borsuessmann <borsuessmann@gmail.com>`; Branch `master` → `main`; 7 gebündelte Commits nach Specs (Zwischenstände nicht einzeln lauffähig, da am Stück entstanden). `.claude/settings.local.json` in `.gitignore`; Secret-Scan ohne Funde; keine `.env*` in der Historie.
- Migrationen zusätzlich als `supabase/migrations/*.sql` im Repo (aus `supabase_migrations.schema_migrations` gelesen, identisch zum angewendeten Stand).
- Vercel: erster Build scheiterte ohne Env-Variablen (`env.ts` bricht absichtlich ab); danach Variablen gesetzt + Redeploy. „Vercel Authentication“ (Deployment Protection) musste aus, sonst Redirect auf `vercel.com/sso-api`. `linktree-clone.vercel.app` war vergeben → Domain `linktree-clone-ebon.vercel.app`.
- Live-Smoke-Test (curl + browser-use): `/` 200 · `/login`, `/signup` 200 · `/dashboard` ausgeloggt → 307 `/login` · Sign-up → Dashboard · Link anlegen (Liste + Preview) · `/u/livesmoke` zeigt Link · `/u/gibtsnicht` → 404-Ansicht · Logout (Tastatur) → `/login`, Dashboard danach gesperrt. Test-User gelöscht.
- Advisors: performance leer; security nur „Leaked Password Protection Disabled“ → nur im Pro-Plan verfügbar, steht im Backlog (bewusst akzeptiert).
- Supabase Auth → URL Configuration: Site-URL `https://linktree-clone-ebon.vercel.app` + Redirect-URL `…/**` vom User gesetzt (nicht per API prüfbar, Bestätigung durch User).
