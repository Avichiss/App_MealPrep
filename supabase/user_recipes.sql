-- Tabel resep cloud per user (tema Meal Prep) + RLS
-- Jalankan di Supabase Dashboard -> SQL Editor

create table if not exists public.user_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  time integer not null default 15,
  category text,
  is_cooked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_recipes enable row level security;

-- Hapus policy lama jika perlu (opsional, aman dijalankan ulang)
drop policy if exists "Users can view own recipes" on public.user_recipes;
drop policy if exists "Users can insert own recipes" on public.user_recipes;
drop policy if exists "Users can update own recipes" on public.user_recipes;
drop policy if exists "Users can delete own recipes" on public.user_recipes;

create policy "Users can view own recipes"
  on public.user_recipes
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own recipes"
  on public.user_recipes
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recipes"
  on public.user_recipes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own recipes"
  on public.user_recipes
  for delete
  using (auth.uid() = user_id);
