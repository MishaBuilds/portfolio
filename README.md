# Портфолио разработчика

Современное портфолио на TypeScript + Vite: интерактивные веб-приложения,
3D-визуализации, симуляторы, браузерные инструменты и Telegram-боты.

## Структура

```
Мое портфолио/
├── index.html            — разметка и SEO (title, description, OG, favicon)
├── favicon.svg           — иконка сайта
├── assets/               — картинки (превью проектов)
├── src/
│   ├── main.ts           — меню, scroll-spy, анимации, фильтр, форма
│   └── style.css         — дизайн-система, тёмная тема, адаптив
├── .github/workflows/
│   └── deploy.yml        — автоматический деплой на GitHub Pages
├── package.json
├── tsconfig.json
└── vite.config.ts        # base: './' — относительные пути (GitHub Pages)
```

## Локальный запуск

```bash
cd "Мое портфолио"
npm install
npm run dev        # dev-сервер с HMR
```

## Production build

```bash
npm run build      # typecheck + сборка в dist/
npm run preview    # просмотр собранной версии локально
```

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub (например, `portfolio`).
2. Загрузите код:

   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

3. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Workflow `.github/workflows/deploy.yml` соберёт сайт и опубликует его.
5. Сайт будет доступен по адресу: **https://YOUR_USERNAME.github.io/portfolio/**

> Сборка использует относительные пути (`base: './'`), поэтому сайт корректно
> работает и из подкаталога, и из корня пользовательского сайта.

## Что нужно заполнить перед публикацией

- [ ] `index.html`: имя в `<title>`, `og:*`, `canonical` — заменить
      `session24`/`portfolio` на ваши реальные значения
- [ ] `index.html` → раздел «Контакты»: email и Telegram (`@yourusername`)
- [ ] `src/main.ts`: константа `CONTACT_EMAIL`
- [ ] Добавить `assets/og-cover.png` (картинка для соцсетей, 1200×630)
- [ ] Кнопки «Открыть проект»/«GitHub» — добавляются в карточки проектов
      в `index.html` после публикации самих проектов

## Стек

TypeScript (strict) · Vite · HTML5 · CSS3 · без фреймворков и рантайм-зависимостей
