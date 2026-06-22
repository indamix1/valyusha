# CLAUDE.md — Сайт «Valyusha» (гід в Японії)

## Проєкт
Сайт-візитка ліцензованого гіда в Японії (Валентина Ямазакі). Авторські тури:
екскурсії, індивідуальні маршрути, круїзним туристам, трансфери. Має бути простим
у користуванні («щоб і бабуся розібралась») і красивим. Замовниця наповнює контент
сама через адмінку.

## Стек
- Next.js 16 (App Router, Turbopack), TypeScript
- Стилі: один глобальний CSS-файл `app/globals.css` (НЕ Tailwind-утиліти; кастомні
  класи + CSS-змінні, шрифти Fraunces / Nunito Sans / Sacramento). Дизайн світлий,
  «сакурний» (тепла кремова палітра, рожевий акцент `--rose`).
- БД/авторизація/сховище: Supabase (`@supabase/ssr`)
- Мультимовність: next-intl (locales: ru, uk, en; defaultLocale: **ru**)
- Хостинг (план): Vercel

## Команди
- Запуск: `npm run dev`
- Перевірка типів/збірки: `npm run build`
- Lint: `npm run lint`

## Структура
```
app/
  layout.tsx              мінімальний root (<html lang="ru">, globals.css)
  [locale]/
    layout.tsx            NextIntlClientProvider + <Header/> {children} <Footer/>
    page.tsx              головна (server component; тексти hero/about з БД)
  admin/                  адмінка (поза [locale], одномовна)
    page.tsx              дашборд (лічильники + перехід у розділи)
    login/page.tsx        вхід (Supabase Auth)
    tours/page.tsx        список турів
    tours/new/page.tsx    новий тур
    tours/[id]/page.tsx   редагування туру
components/
  Header.tsx              client; перемикач мов + локалізована навігація (useTranslations)
  Footer.tsx              server; контакти
  admin/TourForm.tsx      форма туру (client; завантаження фото в Storage)
i18n/
  routing.ts              defineRouting (ru/uk/en, default ru)
  request.ts              getRequestConfig -> messages/<locale>.json
  navigation.ts           createNavigation (локалізовані Link/useRouter/usePathname)
messages/{ru,uk,en}.json  переклади інтерфейсу (поки лише nav)
lib/
  supabase/server.ts      серверний клієнт Supabase
  supabase/client.ts      браузерний клієнт Supabase
  content.ts              getSiteContent(locale) -> тексти головної з відкатом на ru
types/database.ts         типи таблиць
proxy.ts                  /admin -> Supabase auth; решта -> next-intl middleware
supabase/                 schema.sql + migration-01.sql + migration-02.sql (історія)
```

## База даних (Supabase, RLS увімкнено)
Публіка читає лише активне/опубліковане; писати може лише авторизований (адмін).
- **tours**: slug(unique), title, city, summary, description, price(numeric),
  currency(default 'USD'), price_note, price_details(текст тарифів по групах),
  duration, format('group'|'individual'|'both'), includes(text[]), cover_url,
  gallery(text[]), sort_order, is_active, translations(jsonb), created_at
- **posts**: блог (slug, title, excerpt, content, cover_url, published, ...,
  translations jsonb)
- **reviews**: author_name, author_city, avatar_url, rating, text, tour_id,
  is_approved, sort_order, translations(jsonb)
- **site_content**: key, value(ru), value_uk, value_en, updated_at
- Storage bucket **media** (Public) — фото турів/блогу.

## Мультимовність — правила
- **Російська — основна (обов'язкова)**. UK/EN — опційні, відкат на ru, якщо порожньо.
- Тексти головної: site_content.value (ru) + value_uk + value_en.
- Контент турів/відгуків: базові поля = ru; переклади UK/EN кладуться у `translations`
  jsonb (напр. `{ "uk": { "title": "...", "description": "..." }, "en": {...} }`).
- next-intl messages/*.json — лише рядки інтерфейсу (меню, кнопки, заголовки секцій).
- Адмінка одномовна (українською в інтерфейсі), не локалізується.

## Ціни
- Валюта всюди **USD**. `price` = «від $X» для картки.
- `price_details` (текст): «1–6 — $480; 7–12 — $X; від 13 — індивідуально».

## Що ВЖЕ зроблено
- Каркас Next.js + Supabase, авторизація, захист /admin.
- Світла головна (дизайн), фото гіда в /public/valentyna.jpg.
- Спільні Header/Footer через layout.
- Мультимовність next-intl: /ru (деф.), /uk, /en + перемикач у шапці.
- Головна: hero (eyebrow/title/subtitle) та заголовок «про мене» тягнуться з БД за мовою.
- Адмінка: редактор турів (список + створення/редагування/видалення + завантаження фото).

## Що ЗАЛИШИЛОСЬ (пріоритет згори)
1. **Сітка турів на головній з БД** (зараз 6 карток захардкоджені укр. мовою) —
   читати активні tours, показувати price як «від $X», лінк на сторінку туру.
2. **Сторінка туру** `app/[locale]/tury/[slug]/page.tsx` (опис, price_details,
   «що включено», галерея).
3. **Переклад інтерфейсу**: винести захардкоджені укр. тексти головної/секцій у
   messages/*.json (ru/uk/en).
4. **Сторінки категорій** (6 шт.): pro-mene, ekskursii, individualni, kruizni,
   transferi, kontakty — інфо-текст + кнопка «звʼязатися».
5. **Адмін-редактори**: відгуки, блог, тексти головної (site_content), переклади
   UK/EN для турів.
6. **Розділи**: «індивідуальні маршрути на замовлення» + список міст; тури по сезонах
   (весна/літо/осінь/зима); «додаткові бонуси» (майстер-класи, дрифт).
7. **Оплата**: кнопка PayPal за реквізитами зараз; еквайринг на ФОП — пізніше
   (замовниця відкриє рахунок у Токіо).
8. **Деплой** на Vercel + домен.

## Контент від замовниці (чекати/наповнювати через адмінку)
8 готових маршрутів (Токіо денний/нічний, Одавара, Ідзу, Фудзі, Камакура, Хаконе,
Нікко 3 дні) з цінами та описами — у файлі `content-brief.md`. Фото під тури,
відгуки, перелік міст, назва сайту/логотип — замовниця надішле згодом.

## Контакти на сайті
Тел/WhatsApp/Telegram/Viber: +81 80 3360 5724 · valentynaodawara@gmail.com ·
Instagram @valentyna.japan.guide · WhatsApp-лінк https://wa.me/818033605724

## Конвенції
- Кастомні CSS-класи з globals.css; колір лише через CSS-змінні (--ink, --rose, ...).
- Клієнтські компоненти позначати `'use client'` (форми, перемикачі, useState).
- Не використовувати Tailwind-утиліти (їх немає в цьому дизайні).
- Іконки — інлайн-SVG, без сторонніх бібліотек.
- Після правок перевіряти `npm run build`, що типи й збірка проходять.
- НЕ комітити .env.local та secret-ключі Supabase.
