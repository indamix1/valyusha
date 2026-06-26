-- seed-hero.sql — новый заголовок и подзаголовок hero (RU).
-- Запусти в Supabase -> SQL Editor. UK/EN откатываются на RU, пока не заданы.

insert into site_content (key, value) values
  ('hero_title', 'Индивидуальные путешествия по Японии премиум-класса с Валентиной и командой профессиональных гидов.'),
  ('hero_subtitle', 'Ваш персональный проводник в Японию. Авторские маршруты локальных гидов от классики до секретных локаций.')
on conflict (key) do update set value = excluded.value, updated_at = now();
