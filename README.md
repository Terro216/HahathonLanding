# CreativeHack 2022 — сохранённая версия HahathonLanding

Публичный архив: **https://creativehack.ilyamedve.dev/**.
Мероприятие РТУ МИРЭА и ВКонтакте проходило **18–21 октября 2022 года**.
Это историческая версия работы, а регистрация завершена.

Исходный репозиторий: https://github.com/Terro216/HahathonLanding.
Зафиксированная основа: `252bb49cecc2fd53281612da33594e3b62f99f92`
(`ilyamed`, 30.10.2022 22:59:57 +03:00). Ветка восстановления:
`archive/creativehack-2022`. История исходного проекта сохранена.
Автор в package.json — Ivan Laptev, contributor — ilya Medvedev;
исходная метка RTUITLab сохранена. Исторические GitHub Pages и
hack.rtuitlab.dev не являются адресами этой публикации.

17.10.2026 выполнено сравнение Git blob hashes: **47/47 файлов src**
совпали с `RTUITLab/HahathonLanding` на `a74b90891f71e436263c7e04a1f5ab713c950c1b`.
Upstream читался отдельно, его коммиты не сливались.
[Полный манифест основы](archive/origin.json). Автоматического pull/merge нет.

## Что сохранено и изменено

Сохранены исходные Furore/Inter, SVG/WebP/PNG, цвета, двойной контур
заголовков, стеклянные карточки с backdrop blur, двадцать SVG-шаров
(50/40 секунд desktop, 18/16 секунд mobile, blur/grayscale и задержки),
цветные hover-эффекты логотипов, меню со скрытием при прокрутке,
плавные якоря, семь FAQ с поворотом стрелок, две карточки кейсов,
призы, даты, победители и иллюстрация формы.
Графика, шрифты и восемь исходных файлов стилей блоков проверяются
по Git blob SHA-1 относительно основы: 37 неизменённых файлов.
Общий SCSS дополнен небольшими архивными пометками и стилем кнопки меню.

Небольшая пометка показывает архивный статус 2022 года. Кнопки регистрации
ведут к закрытой форме, её поля и кнопка отключены. Выбор кейса подсвечивает
исторический трек и прокручивает к форме. JS не читает персональные данные,
не использует сеть или browser storage; удалены POST /team, reCAPTCHA,
её sitekey и ложное сообщение «Регистрация прошла успешно».
Исторический адрес почты показан обычным текстом без mailto; ответ FAQ
о регистрации явно отмечен как ответ 2022 года. Ссылки на Telegram-чат
2022 года остаются историческими внешними ссылками; автообращений к ним нет.

Оригинальные PDF положения и политики сохранены локально с источником
и SHA-256 в [archive/documents.json](archive/documents.json).
Все автоматически загружаемые ресурсы локальны. Canonical, Open Graph,
sitemap и robots указывают новый адрес. Исправлена метка og:image:height.
Мобильное меню и FAQ доступны с клавиатуры; высота фонового слоя
пересчитывается при загрузке шрифтов, раскрытии FAQ и resize.

## Воспроизводимая сборка на big-one

В дереве server сначала проверить `command -v node npm docker`.
Сборки, preview и Chromium запускать на big-one. `.git` через Mutagen
не передаётся; после правок перед Docker использовать
`timeout 45 mutagen sync flush server` либо сверять remote SHA-256.

Dockerfile закрепляет Node 22 и nginx 1.27 по digest. Parcel/Pug/Sass
остаются на исходных версиях из lockfile (`npm ci`), прямые зависимости
зафиксированы на 2.7.0; autoinstall и source maps отключены. Обновление
сборочного инструментария требует отдельной проверки внешнего вида.
В nginx-образ не попадают Node, node_modules, исходники, .git или секреты.

```sh
python3 scripts/check-archive.py
docker build --progress plain -t creativehack:archive-20261017-252bb49 .
docker compose config --quiet
```

Нет .env и секретов, томов, БД, очередей, host units или пользовательского
состояния. Nginx работает UID/GID 101, rootfs read-only, tmpfs 8 МиБ;
32 МиБ RAM, 0.25 CPU, 32 PID, все capabilities сброшены;
логи 2 × 5 МиБ, access log отключён. Healthcheck: GET /healthz.
Backend отсутствует: принимаются только GET/HEAD, прочие методы дают 405;
/team и неизвестные пути — 404. CSP запрещает connect, form, frame и
сторонние ресурсы. Порты на хосте не публикуются, только `caddy_net`.

## Проверки и публикация

```sh
# Из корня server:
bash scripts/bootstrap/check.sh --fast
bash scripts/bootstrap/check.sh
# На big-one, Playwright 1.63.0 + Chromium:
node scripts/browser-qa.mjs http://127.0.0.1:18123 /tmp/creativehack-qa-preview /path/to/playwright
node scripts/browser-qa.mjs https://creativehack.ilyamedve.dev /tmp/creativehack-qa-public /path/to/playwright
# Только целевой стек, после проверки образа:
docker compose up -d --no-deps --no-build --pull never --wait --wait-timeout 60 web
```

Browser QA проверяет ширины 1440/768/390/320, ошибки и все запросы,
изображения/шрифты, движение шаров, hover, каждый FAQ, меню и якоря,
выбор кейсов, невозможность отправки, CSP и адаптацию фона.
Исходная страница отдельно снималась в loopback-preview с блокировкой
reCAPTCHA; старую регистрацию не вызывали. Результаты и границы проверки:
[archive/release.md](archive/release.md).

## Восстановление и откат

Это stateless сервис, **отдельный backup данных и включение в DE Restic
не требуются**. Исключение явное: Git хранит исходники, lockfile, графику,
локальные документы и конфигурацию; immutable image восстанавливает статику.
Активная общесерверная копия — ежедневная DE; паузу Яндекс.Диска не менять.
Общие Caddy/DNS восстанавливаются по серверному runbook. У самого сайта
credentials нет. Отдельный backup данных, новый encrypted secrets export
и ручное обновление Bitwarden для CreativeHack не нужны. Сохранённые образ
и Git bundle — дополнительные копии, восстановление возможно из Git.

На новом big-one после восстановления Docker/Caddy и `caddy_net`:

```sh
git clone --branch archive/creativehack-2022 https://github.com/Terro216/HahathonLanding.git /home/me/server/projects/HahathonLanding
cd /home/me/server/projects/HahathonLanding
# Сверить release commit и image ID по archive/release.md.
# Можно загрузить сохранённый образ: docker load -i creativehack-image.tar
# Или собрать из зафиксированного release commit:
docker build -t creativehack:archive-20261017-252bb49 .
docker compose up -d --no-build --pull never --wait --wait-timeout 60 web
curl --fail https://creativehack.ilyamedve.dev/healthz
```

DNS A: `creativehack.ilyamedve.dev` → `94.126.204.131`; IPv6 публиковать
только после проверки реальной IPv6-доступности. Caddy получает TLS
автоматически по labels; не перезапускать Caddy и не загружать отдельно
его базовый Caddyfile поверх Docker routes.

Для первого выпуска откат — убрать только новый сервис и его маршрут:
`docker compose down` из **этого каталога**, без удаления образов/сетей.
Для последующих выпусков сначала сохранить прошлый image ID и присвоить
ему rollback tag; вернуть `CREATIVEHACK_IMAGE=<прошлый immutable tag>` и
повторить `up --no-deps --no-build --pull never --wait web`.
Каталог портала и новые monitoring entries откатываются отдельно по
сохранённым scoped diff, без замены чужих изменений.
Саму страницу и образ можно восстановить независимо от портала.
