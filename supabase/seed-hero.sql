-- seed-hero.sql — заголовок и подзаголовок hero на 3 языках (RU = основа).
-- Запусти в Supabase -> SQL Editor.

insert into site_content (key, value, value_uk, value_en) values
  (
    'hero_title',
    'Ваш персональный проводник в Японию. Авторские маршруты от классики до секретных локаций.',
    'Ваш персональний провідник у Японію. Авторські маршрути — від класики до секретних локацій.',
    'Your personal guide to Japan. Original routes from classics to secret spots.'
  ),
  (
    'hero_subtitle',
    'Индивидуальные путешествия по Японии премиум-класса с Валентиной и командой профессиональных гидов.',
    'Індивідуальні подорожі Японією преміум-класу з Валентиною та командою професійних гідів.',
    'Premium private journeys across Japan with Valentina and a team of professional guides.'
  )
on conflict (key) do update set
  value = excluded.value,
  value_uk = excluded.value_uk,
  value_en = excluded.value_en,
  updated_at = now();
