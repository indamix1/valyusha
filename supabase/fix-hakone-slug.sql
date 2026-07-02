-- fix-hakone-slug.sql — повернути слаг туру Хаконе в нижній регістр.
-- Причина: при редагуванні слаг став "Hakone", через що /ru/tury/hakone давав 404
-- (URL чутливий до регістру). Запусти у Supabase SQL Editor.
update tours set slug = 'hakone' where slug = 'Hakone';
