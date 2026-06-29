create table profiles (
id uuid primary key,
name text,
email text unique,
age integer,
gender text,
height integer,
weight integer,
activity_level text,
goal text,
created_at timestamp default now()
);

create table meal_plans (
id uuid primary key default gen_random_uuid(),
user_id uuid references profiles(id),
calories integer,
protein integer,
carbs integer,
fat integer,
created_at timestamp default now()
);

create table meals (
id uuid primary key default gen_random_uuid(),
meal_plan_id uuid references meal_plans(id),
meal_type text,
name text,
ingredients text,
calories integer,
protein integer,
carbs integer,
fat integer
);