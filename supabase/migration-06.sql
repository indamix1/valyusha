-- migration-06: разрешить посетителям (anon) отправлять отзывы на модерацию.
-- Вставка разрешена только с is_approved = false — самоодобрение невозможно.
-- Публичное чтение по-прежнему только approved (политика из schema.sql).

create policy "public submit reviews"
  on reviews for insert
  to anon
  with check (is_approved = false);
