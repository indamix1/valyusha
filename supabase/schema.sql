-- ============================================================
--  Valyusha · Гід в Японії — схема бази (Supabase / Postgres)
--  Запусти весь цей файл у Supabase → SQL Editor → Run
-- ============================================================

-- ---------- ТУРИ / МАРШРУТИ ----------
create table if not exists tours (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- напр. 'tokyo', 'fuji'
  title       text not null,                  -- "Токіо"
  city        text,                           -- місто/регіон
  summary     text,                           -- короткий опис для картки
  description text,                           -- повний опис для сторінки туру
  price       numeric(10,2),                  -- ціна числом (показуємо число)
  currency    text default 'USD',             -- USD / EUR / JPY
  price_note  text default 'від, за особу',   -- підпис біля ціни
  duration    text,                           -- "1 день", "5 годин"
  format      text default 'both'             -- group | individual | both
              check (format in ('group','individual','both')),
  includes    text[] default '{}',            -- що входить (список)
  cover_url   text,                           -- головне фото
  gallery     text[] default '{}',            -- додаткові фото
  sort_order  int  default 0,                 -- порядок на сайті
  is_active   boolean default true,           -- показувати на сайті
  created_at  timestamptz default now()
);

-- ---------- БЛОГ ----------
create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,                           -- анонс
  content      text,                           -- тіло статті (markdown/html)
  cover_url    text,
  published    boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now()
);

-- ---------- ВІДГУКИ ----------
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null,                   -- "Олена"
  author_city text,                            -- "Київ"
  avatar_url  text,
  rating      int default 5 check (rating between 1 and 5),
  text        text not null,
  tour_id     uuid references tours(id) on delete set null,
  is_approved boolean default true,            -- модерація
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ---------- КОНТЕНТ ГОЛОВНОЇ (редаговані тексти) ----------
-- key → value. Зручно міняти заголовки/підзаголовки без коду.
create table if not exists site_content (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- ============================================================
--  RLS (Row Level Security)
--  Публіка бачить лише активне/опубліковане. Писати може лише
--  авторизований користувач (адмін, який заходить у /admin).
-- ============================================================
alter table tours        enable row level security;
alter table posts        enable row level security;
alter table reviews      enable row level security;
alter table site_content enable row level security;

-- читання для всіх (anon)
create policy "public read active tours"
  on tours for select using (is_active = true);
create policy "public read published posts"
  on posts for select using (published = true);
create policy "public read approved reviews"
  on reviews for select using (is_approved = true);
create policy "public read site_content"
  on site_content for select using (true);

-- повний доступ для авторизованих (адмін)
create policy "admin all tours"   on tours        for all to authenticated using (true) with check (true);
create policy "admin all posts"   on posts        for all to authenticated using (true) with check (true);
create policy "admin all reviews" on reviews      for all to authenticated using (true) with check (true);
create policy "admin all content" on site_content for all to authenticated using (true) with check (true);

-- ============================================================
--  Початкові тексти головної (можна редагувати в адмінці)
-- ============================================================
insert into site_content (key, value) values
  ('hero_eyebrow',  'Авторський гід · Токіо · Кіото · Фудзі'),
  ('hero_title',    'Японія без шаблонів — авторські подорожі з Валентиною Ямазакі'),
  ('hero_subtitle', 'Живу в Японії понад 20 років і відкриваю її такою, якою ви її не знайдете в путівниках.'),
  ('about_title',   'Покажу Японію такою, яка вона є'),
  ('about_text',    'Офіційний ліцензований гід у Японії. Понад 20 років живу тут — знаю культуру, традиції та всі нюанси життя. Складаю маршрути, що показують справжню Японію, а не лише популярні місця.'),
  ('contact_phone', '+81 80-3360-5724'),
  ('contact_email', 'valentynaodawara@gmail.com'),
  ('contact_whatsapp', 'https://wa.me/818033605724')
on conflict (key) do nothing;
