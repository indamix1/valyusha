-- seed-hero.sql — заголовок и подзаголовок hero (RU).
-- Большой заголовок (H1) и мелкий подзаголовок поменяны местами по просьбе.
-- Запусти в Supabase -> SQL Editor. UK/EN откатываются на RU, пока не заданы.

insert into site_content (key, value) values
  ('hero_title', 'Ваш персональный проводник в Японию. Авторские маршруты локальных гидов от классики до секретных локаций.'),
  ('hero_subtitle', 'Индивидуальные путешествия по Японии премиум-класса с Валентиной и командой профессиональных гидов.')
on conflict (key) do update set value = excluded.value, updated_at = now();
