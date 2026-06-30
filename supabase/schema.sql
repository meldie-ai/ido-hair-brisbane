-- ============================================================
-- Ido Hair Brisbane — Supabase Schema
-- Paste this entire file into the Supabase SQL Editor and run it.
-- ============================================================

-- STAFF
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

insert into staff (name, role, display_order) values
  ('Andy',       'Nanoplasty Specialist', 1),
  ('Yein',       'Colour & Styling',      2),
  ('Ara',        'Perm Specialist',       3),
  ('Nova & Rose','Cut & Colour',          4);

-- PROMOTIONS
create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  discount_percent integer,
  description text,
  time_window_start time,
  time_window_end time,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into promotions (label, discount_percent, description, time_window_start, time_window_end, is_active) values
  ('Tue – Fri', 20, 'All main chemical services during the morning event window, Tuesday through Friday.',  '09:45', '11:00', true),
  ('Sat – Mon', 15, 'All main chemical services during the morning event window, Saturday through Monday.', '09:45', '11:00', true);

-- BUSINESS HOURS (day_of_week: 0=Sunday … 6=Saturday)
create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null unique,
  open_time time,
  close_time time,
  is_closed boolean default false
);

insert into business_hours (day_of_week, open_time, close_time, is_closed) values
  (0, '09:30', '17:00', false),
  (1, '09:30', '18:30', false),
  (2, '09:30', '18:30', false),
  (3, '09:30', '18:30', false),
  (4, '09:30', '18:30', false),
  (5, '09:30', '18:30', false),
  (6, '09:30', '17:00', false);

-- ANNOUNCEMENT (single row)
create table if not exists announcement (
  id uuid primary key default gen_random_uuid(),
  message_text text not null,
  is_active boolean default true
);

insert into announcement (message_text, is_active) values
  ('Morning Special 9:45–11:00 am · Tue–Fri 20% off · Sat–Mon 15% off · Pre-book 1 day ahead to apply', true);

-- ROW LEVEL SECURITY — public can read, nobody can write via anon key
alter table staff          enable row level security;
alter table promotions     enable row level security;
alter table business_hours enable row level security;
alter table announcement   enable row level security;

create policy "public read staff"         on staff          for select using (true);
create policy "public read promotions"    on promotions     for select using (true);
create policy "public read hours"         on business_hours for select using (true);
create policy "public read announcement"  on announcement   for select using (true);
