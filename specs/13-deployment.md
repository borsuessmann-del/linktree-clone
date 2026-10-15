# 13 — Deployment (GitHub + Vercel)

**Status:** ⏳ offen

## Ziel
Die App läuft öffentlich auf Vercel (Hobby), der Code liegt in einem GitHub-Repo; ab hier wird nach jedem Arbeitspaket committet (Kurs-Sub 5.13.7).

## Abhängigkeiten
- 01–12 — alle Features fertig und verifiziert

## Out of Scope
- Custom Domain · Preview-Umgebungen mit eigener Datenbank

## Akzeptanzkriterien
- [ ] Globale git-Identität gesetzt (`user.name`, `user.email`)
- [ ] `.env.local` NICHT im Repo (`git status` prüfen); keine Secrets im Code
- [ ] Sinnvolle Commit-Historie seit dem Initial-Commit (Features gebündelt)
- [ ] GitHub-Repo angelegt und gepusht
- [ ] Vercel-Projekt verbunden, Env-Variablen `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` gesetzt
- [ ] Supabase Auth → URL Configuration: Site-URL = Vercel-URL
- [ ] `npm run build` lokal grün; Vercel-Build grün
- [ ] Live-Test: Sign-Up, Link anlegen, `/u/<username>` auf der Live-URL, 404-Seite

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
_Nach Abschluss ausfüllen._
