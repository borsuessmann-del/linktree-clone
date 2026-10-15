# Specs

Eine Spec pro Feature: `specs/NN-<feature>.md` (z. B. `03-link-crud.md`). Die Nummer folgt den Abhängigkeiten — was andere Features braucht, kommt zuerst. Jede Spec wird in einem Build-Loop umgesetzt: **Plan → Build → Check**.

## Template

```markdown
# NN — <Feature-Name>

**Status:** ⏳ offen | 🚧 in Arbeit | ✅ fertig

## Ziel
1–3 Sätze: Was kann der User danach, was vorher nicht ging?

## Abhängigkeiten
- Spec NN — <warum benötigt>

## Out of Scope
- Was ausdrücklich NICHT Teil dieser Spec ist

## Akzeptanzkriterien
- [ ] Prüfbare Aussage aus User-Sicht
- [ ] …

## Tasks
1. …
2. …

## Validation
- Konkrete Prüfschritte (siehe Typ-Beispiele in rules/verification.md)

## Relevante Rules / Skills
- rules/… · Skill: shadcn / supabase / …

## Debrief
_Nach Abschluss ausfüllen:_ Was lief gut, was nicht, Abweichungen vom Plan.
```
