---
name: content-population-workflow
description: "How we fill Valyusha content — user runs SQL snippets, photos via admin"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 84ac572d-48df-49c4-a62a-f1560c8ab2cc
---

Користувач (Артем) наповнює сайт разом зі мною: він дає матеріал (часто українською), я оформлюю під поля БД, перекладаю на RU/UK/EN, роблю латинський slug.

**Спосіб (обраний користувачем): SQL-сніппети.** Я готую `insert ... on conflict (slug) do update` для tours/reviews/posts/site_content, користувач вставляє в **Supabase → SQL Editor → Run**.

**Why:** anon-ключ через RLS уміє лише читати; писати може лише авторизований адмін. SQL Editor у дешборді обходить RLS безпечно, без передачі паролів.

**How to apply:**
- Базова мова — RU (перекладаю з присланого). UK/EN кладу в `translations` jsonb.
- **Фото НЕ можна через SQL** — лише через адмінку (форма туру: головне фото + галерея, multi-upload). Тож текст через SQL, фото — окремо в `/admin/tours`.
- slug латиницею (напр. `fuji`, `tokyo`). У JSON всередині SQL використовувати лише фігурні апострофи ’ (U+2019), не прямі ', щоб не ламати рядок.
- Залитий тур: `fuji` (Фудзі, EUR €1100). Є тестовий тур slug «Проверка перевода» — можна видалити.

Деталі статусу проєкту — [[project-status]].
