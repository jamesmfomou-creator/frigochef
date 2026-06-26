-- ============================================================
-- FrigoChef V2 – Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Profiles (auto-created on auth.users insert)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  scan_count integer not null default 0,
  scan_reset_date date not null default current_date,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

-- Si la table existe déjà, ajouter la colonne stripe
-- alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Pantry items
create table public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  quantity text,
  category text,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.pantry_items enable row level security;
create policy "Users can manage own pantry" on public.pantry_items for all using (auth.uid() = user_id);

-- Scans history
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  ingredients jsonb not null default '[]',
  created_at timestamptz not null default now()
);
alter table public.scans enable row level security;
create policy "Users can manage own scans" on public.scans for all using (auth.uid() = user_id);

-- Saved recipes
create table public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  time text,
  calories text,
  missing text[] default '{}',
  steps text[] default '{}',
  scan_id uuid references public.scans(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.saved_recipes enable row level security;
create policy "Users can manage own recipes" on public.saved_recipes for all using (auth.uid() = user_id);

-- Meal plans
create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_start date not null,
  days jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(user_id, week_start)
);
alter table public.meal_plans enable row level security;
create policy "Users can manage own meal plans" on public.meal_plans for all using (auth.uid() = user_id);

-- Shopping lists
create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  items jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);
alter table public.shopping_lists enable row level security;
create policy "Users can manage own shopping list" on public.shopping_lists for all using (auth.uid() = user_id);
