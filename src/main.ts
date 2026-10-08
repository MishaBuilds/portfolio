/**
 * MishaBuilds — клиентская логика.
 * Мобильное меню, состояние шапки, scroll-spy, появление при скролле, год.
 * Без зависимостей.
 */

function qs<T extends Element>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

function qsa<T extends Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/* ── Мобильное меню ──────────────────────────────────── */
const burger = qs<HTMLButtonElement>('#burger');
const nav = qs<HTMLElement>('#mainNav');

function closeMenu(): void {
  burger?.classList.remove('open');
  burger?.setAttribute('aria-expanded', 'false');
  burger?.setAttribute('aria-label', 'Открыть меню');
  nav?.classList.remove('open');
}

burger?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;
  burger?.classList.toggle('open', isOpen);
  burger?.setAttribute('aria-expanded', String(isOpen));
  burger?.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});

qsa<HTMLAnchorElement>('.nav-link', nav ?? document).forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

/* ── Шапка при скролле ───────────────────────────────── */
const header = qs<HTMLElement>('#siteHeader');

const onScroll = (): void => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Scroll-spy: активный пункт меню ─────────────────── */
const sections = qsa<HTMLElement>('main section[id]');
const navLinks = qsa<HTMLAnchorElement>('.nav-link');

if ('IntersectionObserver' in window && sections.length > 0) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => spy.observe(section));
}

/* ── Появление при скролле ───────────────────────────── */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );

  qsa('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  // Без IntersectionObserver показываем всё сразу.
  qsa('.reveal').forEach((el) => el.classList.add('visible'));
}

/* ── Год в подвале ───────────────────────────────────── */
const yearEl = qs<HTMLElement>('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
