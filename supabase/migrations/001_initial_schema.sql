-- DreamBody initial schema with RLS

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  age integer,
  gender text check (gender in ('male', 'female')),
  height integer,
  weight integer,
  activity_level text check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  goal text check (goal in ('lose_fat', 'maintain', 'gain_muscle')),
  created_at timestamptz default now()
);

create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  created_at timestamptz default now()
);

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')) not null,
  name text not null,
  ingredients text not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null
);

alter table profiles enable row level security;
alter table meal_plans enable row level security;
alter table meals enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can view own meal plans"
  on meal_plans for select using (auth.uid() = user_id);

create policy "Users can insert own meal plans"
  on meal_plans for insert with check (auth.uid() = user_id);

create policy "Users can delete own meal plans"
  on meal_plans for delete using (auth.uid() = user_id);

create policy "Users can view own meals"
  on meals for select using (
    exists (
      select 1 from meal_plans
      where meal_plans.id = meals.meal_plan_id
      and meal_plans.user_id = auth.uid()
    )
  );

create policy "Users can insert own meals"
  on meals for insert with check (
    exists (
      select 1 from meal_plans
      where meal_plans.id = meals.meal_plan_id
      and meal_plans.user_id = auth.uid()
    )
  );

create policy "Users can delete own meals"
  on meals for delete using (
    exists (
      select 1 from meal_plans
      where meal_plans.id = meals.meal_plan_id
      and meal_plans.user_id = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index if not exists meal_plans_user_id_idx on meal_plans(user_id);
create index if not exists meals_meal_plan_id_idx on meals(meal_plan_id);
