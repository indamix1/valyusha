-- migration-08: рекомендуемые отели (управляются через админку).
create table if not exists hotels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  area        text,                               -- город/район (необязательно)
  stars       int default 5 check (stars between 1 and 5),
  description text,
  url         text,                               -- ссылка на бронирование
  price_note  text,                               -- "от $120 / ночь"
  image_url   text,
  sort_order  int default 0,
  is_active   boolean default true,
  translations jsonb not null default '{}'::jsonb,
  created_at  timestamptz default now()
);

alter table hotels enable row level security;

create policy "public read active hotels"
  on hotels for select using (is_active = true);

create policy "admin all hotels"
  on hotels for all to authenticated using (true) with check (true);
