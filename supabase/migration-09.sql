-- migration-09: специальные маршруты (тематические/сезонные направления).
create table if not exists special_routes (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  cover_url   text,
  gallery     text[] not null default '{}',
  sort_order  int default 0,
  is_active   boolean default true,
  translations jsonb not null default '{}'::jsonb,
  created_at  timestamptz default now()
);

alter table special_routes enable row level security;

create policy "public read active specials"
  on special_routes for select using (is_active = true);

create policy "admin all specials"
  on special_routes for all to authenticated using (true) with check (true);
