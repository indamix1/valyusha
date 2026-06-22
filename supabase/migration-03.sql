-- =========================================================
--  Міграція 03: структуровані блоки туру
--  «Організаційні деталі», «Що оплачується окремо»,
--  «Кількість учасників». Запусти у Supabase -> SQL Editor.
--  Безпечно повторювати.
-- =========================================================

alter table tours add column if not exists org_details  text;
alter table tours add column if not exists participants text;
alter table tours add column if not exists excludes     text[] not null default '{}';
