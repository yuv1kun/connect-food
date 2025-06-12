create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text,
  role text check (role in ('donor','ngo','delivery')),
  org_name text,
  reg_number text,
  vehicle_type text,
  license_number text,
  created_at timestamptz default timezone('utc', now())
);

alter table profiles enable row level security;
