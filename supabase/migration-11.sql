-- migration-11.sql — галерея фото для статей блогу.
-- Дозволяє додавати до статті кілька фото (крім обкладинки).
-- Запусти у Supabase SQL Editor.
alter table posts add column if not exists gallery text[] not null default '{}';
