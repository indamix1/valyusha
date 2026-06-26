-- seed-usd.sql — все туры в долларах (EUR -> USD по ~1.08, округлено).
-- Запусти в Supabase -> SQL Editor. Меняет price, currency, price_details.

-- Одавара
update tours set currency='USD', price=160, price_details=
'Индивидуальная на трансфере из Токио: $160/чел. (группа до 12 чел.), включены входные билеты в Замок и Музей доспехов
Пешеходная со встречей на ст. Одавара: $140/чел.'
where slug='odavara';

-- Идзу
update tours set currency='USD', price=1300, price_details=
'Однодневная поездка из Токио: $1300 за группу 1–6 чел.
Двухдневная поездка: $2250 за группу 1–6 чел.
Группы от 7 человек — обсуждаются индивидуально.'
where slug='idzu';

-- Фудзи
update tours set currency='USD', price=1200, price_details=
'$1200 за группу до 7 чел. независимо от количества участников
Для групп 8–12 чел. — организация на микроавтобусе, цена обсуждается.'
where slug='fudzi';

-- Камакура
update tours set currency='USD', price=1000, price_details=
'$1000 за экскурсию для группы до 7 чел. независимо от количества участников'
where slug='kamakura';

-- Хаконе
update tours set currency='USD', price=1350, price_details=
'Выезд из Токио: $1350 за группу до 7 чел.
Для групп 8–20 чел.: $90/чел. + проездной по Хаконе (~$45, оплачивается отдельно). Встреча на ст. Hakone-Yumoto или Odawara.'
where slug='hakone';

-- Никко
update tours set currency='USD', price=1950, price_details=
'Для 1–3 чел.: $1950–2250 за тур
Для 4–6 чел.: $2400–2800 за тур
Для 7 чел.: $2800–3150 за тур'
where slug='nikko';

-- Фудзи и зелёный чай (Симидзу)
update tours set currency='USD', price=1300, price_details=
'$1300 за экскурсию (1–6 гостей).
В цену входят все входные билеты по маршруту.'
where slug='fuji-chay-svyatynya';
-- украинский перевод price_details для этого тура
update tours set translations = jsonb_set(translations, '{uk,price_details}', to_jsonb(
'$1300 за екскурсію (1–6 гостей).
У ціну входять усі вхідні квитки по маршруту.'::text))
where slug='fuji-chay-svyatynya' and translations ? 'uk';

-- Симидзу (по запросу) — только валюта
update tours set currency='USD' where slug in ('shimizu-fuji-svyatyni','tokaido-staryy-trakt');

-- На всякий случай зафиксировать USD у уже долларовых
update tours set currency='USD' where slug in ('istoricheskiy-tokio','tokio-posle-zakata');
