-- Legt bei jedem neuen Auth-User die Profil-Zeile an. Username kommt aus signUp(options.data.username).
-- raw_user_meta_data wird nur hier zur Erstanlage gelesen, nie zur Autorisierung (guidelines.md 004).
-- Fehlt der Username oder verletzt er einen CHECK/Unique, schlägt das ganze Sign-up fehl: kein User ohne Profil.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'));
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
