create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  url text not null,
  is_visible boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint links_title_length
    check (char_length(title) <= 80 and btrim(title) <> ''),
  constraint links_url_format
    check (url ~* '^https?://' and char_length(url) <= 2048),
  constraint links_position_non_negative
    check (position >= 0)
);

comment on table public.links is 'Links eines Profils, sortiert nach position.';

-- Kein unique (user_id, position): sonst scheitert schon das Vertauschen zweier Links.
create index links_user_id_position_idx on public.links (user_id, position);

-- Max. 100 Links pro User. Advisory-Lock pro User verhindert, dass parallele Inserts das Limit umgehen.
create function public.enforce_link_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if (select count(*) from public.links where user_id = new.user_id) >= 100 then
    raise exception 'Maximal 100 Links pro Profil.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke execute on function public.enforce_link_limit() from public, anon, authenticated;

create trigger links_enforce_limit
  before insert on public.links
  for each row execute function public.enforce_link_limit();

alter table public.links enable row level security;

create policy "Besucher sehen sichtbare Links"
  on public.links for select
  to anon
  using (is_visible);

create policy "Eingeloggte sehen sichtbare und eigene Links"
  on public.links for select
  to authenticated
  using (is_visible or (select auth.uid()) = user_id);

create policy "User legen nur eigene Links an"
  on public.links for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "User ändern nur eigene Links"
  on public.links for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "User löschen nur eigene Links"
  on public.links for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.links from anon, authenticated;
grant select on table public.links to anon;
grant select, insert, delete on table public.links to authenticated;
grant update (title, url, is_visible, position) on table public.links to authenticated;
grant select, insert, update, delete on table public.links to service_role;
