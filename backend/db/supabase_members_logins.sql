create extension if not exists pgcrypto;
create table if not exists public.members_logins (
  id uuid primary key default gen_random_uuid(),
  nome text,
  whatsapp text,
  ts timestamptz not null default timezone('utc', now())
);
alter table public.members_logins enable row level security;
grant usage on schema public to anon, authenticated;
grant select, insert on table public.members_logins to anon, authenticated;
create policy "insert_public" on public.members_logins for insert to public with check (true);
create policy "select_public" on public.members_logins for select to public using (true);
