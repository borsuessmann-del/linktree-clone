-- updated_at automatisch pflegen
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger links_set_updated_at
  before update on public.links
  for each row execute function public.set_updated_at();

-- Speichert die Reihenfolge atomar: position = Index im Array (ab 0).
-- security invoker → RLS bleibt aktiv; zusätzlicher Filter auf den eigenen User.
create function public.reorder_links(link_ids uuid[])
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.links as l
  set position = (o.ord - 1)::integer
  from unnest(link_ids) with ordinality as o(id, ord)
  where l.id = o.id
    and l.user_id = (select auth.uid());
$$;

revoke execute on function public.reorder_links(uuid[]) from public, anon;
grant execute on function public.reorder_links(uuid[]) to authenticated;
