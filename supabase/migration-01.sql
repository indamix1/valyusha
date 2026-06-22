-- =========================================================
--  Міграція 01: підтримка перекладів (RU база + UK/EN опційно)
--  Запусти у Supabase -> SQL Editor -> Run.
--  Безпечно запускати повторно (нічого не зламає).
-- =========================================================

-- 1) JSONB-переклади для турів / блогу / відгуків.
--    Базові поля = російська. Сюди кладуться переклади UK/EN.
alter table tours   add column if not exists translations jsonb not null default '{}'::jsonb;
alter table posts   add column if not exists translations jsonb not null default '{}'::jsonb;
alter table reviews add column if not exists translations jsonb not null default '{}'::jsonb;

-- 2) Тексти головної: базове value = російська, + окремі переклади.
alter table site_content add column if not exists value_uk text;
alter table site_content add column if not exists value_en text;

-- 3) Заповнюємо/оновлюємо тексти головної (RU основна, UK/EN — переклади).
insert into site_content (key, value, value_uk, value_en) values
  ('hero_eyebrow',
   'Авторский гид · Токио · Киото · Фудзи',
   'Авторський гід · Токіо · Кіото · Фудзі',
   'Private guide · Tokyo · Kyoto · Fuji'),
  ('hero_title',
   'Япония без шаблонов — авторские путешествия с Валентиной Ямазаки',
   'Японія без шаблонів — авторські подорожі з Валентиною Ямазакі',
   'Japan beyond the clichés — bespoke journeys with Valentyna Yamazaki'),
  ('hero_subtitle',
   'Живу в Японии более 20 лет и открываю её такой, какой вы её не найдёте в путеводителях.',
   'Живу в Японії понад 20 років і відкриваю її такою, якою ви її не знайдете в путівниках.',
   'I have lived in Japan for over 20 years and reveal it the way guidebooks never will.'),
  ('about_title',
   'Покажу Японию такой, какая она есть',
   'Покажу Японію такою, яка вона є',
   'I will show you the real Japan'),
  ('about_text',
   'Официальный лицензированный гид в Японии. Более 20 лет живу здесь — знаю культуру, традиции и все нюансы жизни. Составляю маршруты, которые показывают настоящую Японию, а не только популярные места.',
   'Офіційний ліцензований гід у Японії. Понад 20 років живу тут — знаю культуру, традиції та всі нюанси життя. Складаю маршрути, що показують справжню Японію, а не лише популярні місця.',
   'Officially licensed guide in Japan. I have lived here for over 20 years and know its culture, traditions and everyday life. I craft routes that reveal the real Japan, not just the popular spots.'),
  ('contact_phone',    '+81 80 3360 5724',            '+81 80 3360 5724',            '+81 80 3360 5724'),
  ('contact_email',    'valentynaodawara@gmail.com',  'valentynaodawara@gmail.com',  'valentynaodawara@gmail.com'),
  ('contact_whatsapp', 'https://wa.me/818033605724',  'https://wa.me/818033605724',  'https://wa.me/818033605724')
on conflict (key) do update
  set value    = excluded.value,
      value_uk = excluded.value_uk,
      value_en = excluded.value_en;
