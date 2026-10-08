# MishaBuilds — портфолио

Сайт-портфолио: https://mishabuilds.github.io/portfolio/

Спокойный светлый дизайн, строгая типографика, без фреймворков.
Разделы: проекты (4 опубликованных, у каждого live-демо и GitHub),
услуги, кому подойдёт, процесс, контакты.

## Структура

```
Мое портфолио/
├── index.html            — разметка, SEO (title, description, OG, favicon)
├── favicon.svg           — иконка сайта
├── assets/
│   ├── previews/         — скриншоты живых проектов (jpg, 1280×800)
│   └── og-cover.png      — картинка для соцсетей (1200×630)
├── src/
│   ├── main.ts           — меню, scroll-spy, появление при скролле, год
│   └── style.css         — светлая дизайн-система, адаптив
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

## Проекты в портфолио

| Проект | Live | GitHub |
|---|---|---|
| 3D Maze | https://mishabuilds.github.io/3d-maze/ | https://github.com/MishaBuilds/3d-maze |
| Sorting Visualizer | https://mishabuilds.github.io/sorting-visualizer/ | https://github.com/MishaBuilds/sorting-visualizer |
| Rubik's Cube | https://mishabuilds.github.io/rubiks-cube/ | https://github.com/MishaBuilds/rubiks-cube |
| Ant Colony Simulator | https://mishabuilds.github.io/ant-colony-simulator/ | https://github.com/MishaBuilds/ant-colony-simulator |

## Контакты на сайте

- Telegram: [@skyprop](https://t.me/skyprop)
- Email: micaelss061111@gmail.com

## Стек

TypeScript (strict) · Vite · HTML5 · CSS3 · без фреймворков и рантайм-зависимостей
