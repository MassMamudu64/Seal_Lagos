create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  route_id text not null,
  service_slug text not null,
  weight numeric not null check (weight > 0),
  unit text not null check (unit in ('lbs', 'kg')),
  description text not null,
  pickup_requested boolean not null default false,
  sender_name text not null,
  sender_email text not null,
  sender_phone text not null,
  receiver_name text not null,
  receiver_phone text not null,
  receiver_address text not null,
  notes text,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'quoted', 'confirmed', 'in_progress', 'completed', 'cancelled', 'archived')
  ),
  assigned_to uuid references public.staff_members(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'new' check (
    status in ('new', 'open', 'responded', 'closed', 'archived')
  ),
  assigned_to uuid references public.staff_members(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('weight', 'electronics')),
  corridor_id text,
  input_weight numeric,
  input_unit text check (input_unit is null or input_unit in ('lbs', 'kg')),
  billable_weight numeric,
  freight_total numeric not null default 0 check (freight_total >= 0),
  service_fee numeric not null default 0 check (service_fee >= 0),
  total numeric not null default 0 check (total >= 0),
  minimum_applied boolean not null default false,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'converted', 'archived')
  ),
  assigned_to uuid references public.staff_members(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists bookings_created_at_idx on public.bookings(created_at desc);
create index if not exists bookings_assigned_to_idx on public.bookings(assigned_to);

create index if not exists contact_messages_status_idx on public.contact_messages(status);
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);
create index if not exists contact_messages_assigned_to_idx on public.contact_messages(assigned_to);

create index if not exists quotes_status_idx on public.quotes(status);
create index if not exists quotes_created_at_idx on public.quotes(created_at desc);
create index if not exists quotes_assigned_to_idx on public.quotes(assigned_to);

drop trigger if exists set_staff_members_updated_at on public.staff_members;
create trigger set_staff_members_updated_at
before update on public.staff_members
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

drop trigger if exists set_quotes_updated_at on public.quotes;
create trigger set_quotes_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

alter table public.staff_members enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.quotes enable row level security;

drop policy if exists "Public insert bookings" on public.bookings;
create policy "Public insert bookings"
on public.bookings
for insert
to anon
with check (true);

drop policy if exists "Public insert contact messages" on public.contact_messages;
create policy "Public insert contact messages"
on public.contact_messages
for insert
to anon
with check (true);

drop policy if exists "Public insert quotes" on public.quotes;
create policy "Public insert quotes"
on public.quotes
for insert
to anon
with check (true);

revoke all on public.staff_members from anon, authenticated;
revoke all on public.bookings from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
revoke all on public.quotes from anon, authenticated;

grant insert on public.bookings to anon;
grant insert on public.contact_messages to anon;
grant insert on public.quotes to anon;

grant select, insert, update, delete on public.staff_members to service_role;
grant select, insert, update, delete on public.bookings to service_role;
grant select, insert, update, delete on public.contact_messages to service_role;
grant select, insert, update, delete on public.quotes to service_role;
