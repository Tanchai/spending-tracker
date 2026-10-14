-- ============================================================
-- Our Spending Tracker — PUBLIC (no-login) schema v2
-- Run this ONCE in the Supabase SQL Editor (replaces v1).
-- IMPORTANT: this version has NO login — anyone with the URL can
-- add/edit/delete. RLS is wide open to anonymous + authenticated.
-- ============================================================

-- Clean slate (the table is new/empty — safe to drop and recreate)
drop table if exists public.spending;

-- Drop v1's authenticated-only policies (ignore errors if absent)
drop policy if exists "any signed-in user can read shared spending" on public.spending;
drop policy if exists "signed-in user can insert spending" on public.spending;
drop policy if exists "signed-in user can update spending" on public.spending;
drop policy if exists "signed-in user can delete spending" on public.spending;

create table if not exists public.spending (
  id          uuid primary key default gen_random_uuid(),
  added_name  text not null default '',            -- who added it ("you" | "bae")
  entry_date  date not null default current_date,
  amount      numeric(12,2) not null check (amount >= 0),
  category    text not null default 'other',
  description text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Public read for everyone (anon included)
create policy "public read spending"
  on public.spending for select
  to anon, authenticated
  using (true);

-- Public insert
create policy "public insert spending"
  on public.spending for insert
  to anon, authenticated
  with check (true);

-- Public update
create policy "public update spending"
  on public.spending for update
  to anon, authenticated
  using (true);

-- Public delete
create policy "public delete spending"
  on public.spending for delete
  to anon, authenticated
  using (true);

alter table public.spending enable row level security;

-- Grants (idempotent — safe to re-run)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.spending to authenticated;
grant select, insert, update, delete on public.spending to anon;
grant usage on all sequences in schema public to anon, authenticated;