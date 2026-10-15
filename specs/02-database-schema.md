# 02 — Datenbank-Schema, RLS, Trigger, RPC

**Status:** ✅ fertig und verifiziert (2026-10-15)

## Ziel
Die Supabase-Datenbank enthält `profiles` und `links` mit allen Regeln direkt in Postgres: Validierung per CHECK, Zugriffsschutz per RLS, automatische Profil-Anlage per Trigger und atomares Umsortieren per RPC. Die TypeScript-Typen sind generiert.

## Abhängigkeiten
- keine (kann parallel zu 01 laufen)

## Out of Scope
- App-Code, der die Tabellen nutzt (Specs 03 ff.)
- Storage / Avatar-Upload

## Akzeptanzkriterien
- [x] `profiles`: `id uuid pk → auth.users on delete cascade`, `username text not null unique`, `display_name text`, `bio text`, `avatar_url text`, `accent_color text not null default '#4f46e5'`, `created_at`, `updated_at`
- [x] CHECKs auf `profiles`: Username-Regex `^[a-z0-9]([a-z0-9_-]{1,28}[a-z0-9])?$` · Username nicht in Reserved-Liste (`references/sparring.md`) · `display_name` ≤ 50 · `bio` ≤ 160 · `avatar_url` null oder `^https://` und ≤ 2048 · `accent_color ~* '^#[0-9a-f]{6}$'`
- [x] `links`: `id uuid pk default gen_random_uuid()`, `user_id uuid not null → profiles on delete cascade`, `title text not null` (1–80), `url text not null` (`^https?://`, ≤ 2048), `is_visible boolean not null default true`, `position integer not null default 0`, `created_at`, `updated_at`; Index `(user_id, position)`; **kein** unique auf `(user_id, position)`
- [x] Max. 100 Links pro User (Trigger `before insert`)
- [x] RLS auf beiden Tabellen aktiv:
  - `profiles`: SELECT für `anon, authenticated`; UPDATE nur `auth.uid() = id`; kein INSERT/DELETE über die API
  - `links`: SELECT öffentlich nur `is_visible = true`, Owner sieht alle; INSERT/UPDATE/DELETE nur Owner (`with check (user_id = (select auth.uid()))`)
- [x] Explizite GRANTs für `anon` / `authenticated`
- [x] Trigger `on_auth_user_created` → `public.handle_new_user()` (`security definer set search_path = ''`), liest `raw_user_meta_data->>'username'` (lowercase); `revoke execute … from public, anon, authenticated`
- [x] `updated_at`-Trigger auf beiden Tabellen
- [x] RPC `public.reorder_links(link_ids uuid[])` (`security invoker`, `search_path = ''`), setzt `position` per `unnest … with ordinality`, filtert auf `auth.uid()`
- [x] Migrationen über Supabase MCP (`apply_migration`) mit sprechenden Namen
- [x] `get_advisors` (security + performance) ohne Warnungen
- [x] Typen generiert nach `src/lib/database.types.ts`

## Tasks
1. Skill `supabase-postgres-best-practices` laden, Schema gegenprüfen
2. Migration `create_profiles` (Tabelle, CHECKs, RLS, Policies, Grants)
3. Migration `create_links` (Tabelle, CHECKs, Index, Limit-Trigger, RLS, Policies, Grants)
4. Migration `handle_new_user_trigger`
5. Migration `reorder_links_rpc` + `updated_at`-Trigger
6. Advisors laufen lassen, Findings beheben
7. `generate_typescript_types` → Datei schreiben

## Validation
- SQL-Tests via `execute_sql` (als Rollen `anon` / `authenticated` mit gesetzten JWT-Claims):
  - `update profiles set accent_color = 'red'` → Fehler
  - `insert … username = 'admin'` / `'Ab'` / `'-abc'` → Fehler
  - `insert links … url = 'javascript:alert(1)'` → Fehler
  - User A kann Links von User B weder lesen (unsichtbare) noch ändern
  - anon sieht nur `is_visible = true`
  - 101. Link → Fehler
- Test-User über Auth anlegen → Profil-Zeile existiert automatisch
- Test-Daten danach wieder löschen

## Relevante Rules / Skills
- `rules/verification.md` (Typ Supabase-Schema) · `guidelines.md` 003, 004 · Skills: supabase, supabase-postgres-best-practices · `references/discovery.md` §2, §4

## Debrief
- Migrationen (MCP `apply_migration`): `create_profiles`, `create_links`, `handle_new_user_trigger`, `reorder_links_rpc_and_updated_at`.
- Über die Spec hinaus: **Spalten-Grants** für UPDATE (`profiles`: display_name, bio, avatar_url, accent_color · `links`: title, url, is_visible, position) → Username und `user_id` sind über die API nicht änderbar. Die generierten `Update`-Typen listen trotzdem alle Spalten; die DB lehnt verbotene Spalten mit „permission denied“ ab.
- Link-Limit-Trigger nimmt einen Advisory-Lock pro User → parallele Inserts können das 100er-Limit nicht umgehen. Titel darf nicht nur aus Leerzeichen bestehen; `position >= 0`.
- Laut Supabase-Changelog (Breaking Change 2026) werden neue Tabellen nicht mehr automatisch exponiert → explizite `revoke all` + gezielte GRANTs (anon, authenticated, service_role).
- Advisors: security leer; performance nur INFO „unused index“ für `links_user_id_position_idx` (leere Tabelle, Index wird ab Spec 07 genutzt und deckt den FK ab).
- Validation: 28 SQL-Tests als postgres/authenticated/anon mit JWT-Claims, alle wie erwartet (CHECKs, RLS fremder User, anon nur sichtbare Links, Spalten-Grants, RPC-Rechte, 101. Link, Trigger inkl. Lowercase und Abbruch bei fehlendem/reserviertem Username). Testdaten per Cascade entfernt, 0 Reste.
- Typen nach `src/lib/database.types.ts`.
