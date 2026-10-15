-- Öffentliches Profil pro Auth-User (1:1), Anlage per Trigger (siehe handle_new_user_trigger)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  bio text,
  avatar_url text,
  accent_color text not null default '#4f46e5',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_username_format
    check (username ~ '^[a-z0-9]([a-z0-9_-]{1,28}[a-z0-9])?$'),
  constraint profiles_username_not_reserved
    check (username <> all (array[
      'admin', 'api', 'app', 'auth', 'login', 'logout', 'signup', 'register',
      'settings', 'dashboard', 'edit', 'account', 'profile', 'u', 'help',
      'support', 'about', 'terms', 'privacy', 'static', '_next', 'assets',
      'public', 'null', 'undefined', 'root', 'www', 'mail', 'me', 'new'
    ])),
  constraint profiles_display_name_length
    check (char_length(display_name) <= 50),
  constraint profiles_bio_length
    check (char_length(bio) <= 160),
  constraint profiles_avatar_url_format
    check (avatar_url ~ '^https://' and char_length(avatar_url) <= 2048),
  constraint profiles_accent_color_format
    check (accent_color ~* '^#[0-9a-f]{6}$')
);

comment on table public.profiles is 'Öffentliches Profil pro User; Seite unter /u/<username>.';

alter table public.profiles enable row level security;

create policy "Profile sind öffentlich lesbar"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "User ändern nur ihr eigenes Profil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Kein INSERT/DELETE über die API: Anlage per Trigger, Löschen per Cascade von auth.users.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to anon, authenticated;
-- Username ist nicht änderbar (Backlog), daher Spalten-Grant.
grant update (display_name, bio, avatar_url, accent_color) on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;
