-- migration-07: точки маршрута тура (stops) как jsonb-массив.
-- Каждая точка: { "title": "...", "text": "...", "image_url": "...", "image_query": "..." }
-- Idempotent — можно запускать повторно.
alter table tours add column if not exists stops jsonb not null default '[]'::jsonb;
