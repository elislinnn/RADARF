# Антикризисный радар — сайт

Все файлы сайта лежат в одной папке, без вложенных папок.

## Как выложить на GitHub Pages

1. github.com → «+» → **New repository** → имя `radar-site`, **Public** → **Create repository**.
2. Нажмите **uploading an existing file** → **choose your files**, откройте эту папку, выделите все файлы (Ctrl+A или Cmd+A) → **Открыть**.
3. Дождитесь загрузки → **Commit changes**.
4. **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main**, **/(root)** → **Save**.
5. Через 1–3 минуты сайт откроется по адресу `https://<логин>.github.io/radar-site/`.

## Общие файлы (нужны каждой странице)

| Файл | Что внутри |
|---|---|
| `radar.css` | цвета и шрифт бренда, кнопки, карточки, ключевые кадры анимаций |
| `components.css` | стили бокового меню и нижнего таб-бара |
| `dc-lite.js` | движок шаблонов и перерисовки, без зависимостей |
| `comp-sidebar.js` | боковое меню кабинета |
| `comp-tabbar.js` | нижний таб-бар мобильных экранов |
| `favicon.svg` | иконка вкладки |
| `404.html` | страница «не найдено» |

## Экраны и их файлы

| Страница | Экран | Стили | Логика и анимации | Компоненты |
|---|---|---|---|---|
| `index.html` | Антикризисный радар — лендинг | `page-index.css` | `page-index.js` | — |
| `m-landing.html` | Антикризисный радар — лендинг, телефон | `page-m-landing.css` | `page-m-landing.js` | — |
| `login.html` | Вход — Антикризисный радар | `page-login.css` | `page-login.js` | — |
| `signup.html` | Онбординг, шаг 1 — Расскажите о бизнесе | `page-signup.css` | `page-signup.js` | — |
| `signup-profile.html` | Онбординг, шаг 2 — Как мы вас поняли | `page-signup-profile.css` | `page-signup-profile.js` | — |
| `signup-questions.html` | Онбординг, шаг 3 — Уточнения | `page-signup-questions.css` | `page-signup-questions.js` | — |
| `signup-save.html` | Онбординг, шаг 4 — Сохранить снимок | `page-signup-save.css` | `page-signup-save.js` | — |
| `signup-snapshot.html` | Снимок бизнеса — первый показ | `page-signup-snapshot.css` | `page-signup-snapshot.js` | — |
| `app.html` | Кабинет — снимок бизнеса | `page-app.css` | `page-app.js` | `comp-sidebar.js` |
| `app-signals.html` | Кабинет — лента сигналов | `page-app-signals.css` | `page-app-signals.js` | `comp-sidebar.js` |
| `app-signal.html` | Кабинет — сигнал и «Почему?» | `page-app-signal.css` | `page-app-signal.js` | `comp-sidebar.js` |
| `app-what-if.html` | Кабинет — что если | `page-app-what-if.css` | `page-app-what-if.js` | `comp-sidebar.js` |
| `app-calendar.html` | Кабинет — календарь | `page-app-calendar.css` | `page-app-calendar.js` | `comp-sidebar.js` |
| `app-ask.html` | Кабинет — спросить радар | `page-app-ask.css` | `page-app-ask.js` | `comp-sidebar.js` |
| `app-support.html` | Кабинет — господдержка | `page-app-support.css` | `page-app-support.js` | `comp-sidebar.js` |
| `app-report.html` | Кабинет — отчёт «Что радар дал вам» | `page-app-report.css` | `page-app-report.js` | `comp-sidebar.js` |
| `app-time-machine.html` | Кабинет — машина времени | `page-app-time-machine.css` | `page-app-time-machine.js` | `comp-sidebar.js` |
| `app-profile.html` | Кабинет — мой бизнес | `page-app-profile.css` | `page-app-profile.js` | `comp-sidebar.js` |
| `app-notifications.html` | Кабинет — уведомления и пороги | `page-app-notifications.css` | `page-app-notifications.js` | `comp-sidebar.js` |
| `app-market.html` | Кабинет — рынок | `page-app-market.css` | `page-app-market.js` | `comp-sidebar.js` |
| `app-forecast.html` | Кабинет — прогноз прибыли и денег | `page-app-forecast.css` | `page-app-forecast.js` | `comp-sidebar.js` |
| `tariffs.html` | Предложение тарифа — день 14 | `page-tariffs.css` | `page-tariffs.js` | — |
| `checkout.html` | Оплата тарифа и успех | `page-checkout.css` | `page-checkout.js` | — |
| `m-signup.html` | Онбординг одной фразой — телефон | `page-m-signup.css` | `page-m-signup.js` | — |
| `m-app.html` | Снимок бизнеса — телефон | `page-m-app.css` | `page-m-app.js` | `comp-tabbar.js` |
| `m-app-signals.html` | Сигналы — телефон, свайп | `page-m-app-signals.css` | `page-m-app-signals.js` | `comp-tabbar.js` |
| `m-app-signal.html` | «Почему?» — нижний лист, телефон | `page-m-app-signal.css` | `page-m-app-signal.js` | — |
| `m-app-what-if.html` | Что если — телефон | `page-m-app-what-if.css` | `page-m-app-what-if.js` | `comp-tabbar.js` |

Парные страницы сами переключаются на мобильную версию на экранах уже 768 px. Принудительно: `?view=desktop` или `?view=mobile`.

Шрифт Onest подключается с Google Fonts. Демо-данные кофейни и платёжный виджет — заглушки.
