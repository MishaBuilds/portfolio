/**
 * Портфолио — клиентская логика
 * Мобильное меню, scroll-spy, раскрытие при скролле,
 * фильтр проектов, счётчики статистики, форма обратной связи.
 */

/* ── Утилиты ─────────────────────────────────────────── */
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
  const isOpen = nav?.classList.toggle('open');
  burger.classList.toggle('open', Boolean(isOpen));
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});

const menuLinks = nav ? qsa<HTMLAnchorElement>('.nav-link', nav) : [];

menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

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

/* ── Раскрытие при скролле ───────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

qsa('.reveal').forEach((el) => revealObserver.observe(el));

/* ── Фильтр проектов ─────────────────────────────────── */
const chips = qsa<HTMLButtonElement>('.chip');
const cards = qsa<HTMLElement>('.project-card');
const emptyState = qs<HTMLElement>('#projectsEmpty');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => {
      const isActive = c === chip;
      c.classList.toggle('chip-active', isActive);
      c.setAttribute('aria-pressed', String(isActive));
    });

    const filter = chip.dataset.filter ?? 'all';
    let visible = 0;

    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        visible += 1;
        card.classList.add('visible');
      }
    });

    if (emptyState) {
      emptyState.hidden = visible > 0;
    }
  });
});

/* ── Счётчики статистики в hero ──────────────────────── */
const counters = qsa<HTMLElement>('.counter');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);

      const target = Number((entry.target as HTMLElement).dataset.target ?? '0');
      const duration = 1400;
      const start = performance.now();

      const tick = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        (entry.target as HTMLElement).textContent = String(
          Math.round(target * eased)
        );
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* ── Форма обратной связи → mailto ───────────────────── */
const form = qs<HTMLFormElement>('#contactForm');
const formError = qs<HTMLElement>('#formError');
const CONTACT_EMAIL = 'email@example.com'; // ЗАМЕНИТЕ на свой email

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = qs<HTMLInputElement>('#fieldName', form)?.value.trim() ?? '';
  const email = qs<HTMLInputElement>('#fieldEmail', form)?.value.trim() ?? '';
  const message = qs<HTMLTextAreaElement>('#fieldMessage', form)?.value.trim() ?? '';

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valid = name.length > 0 && emailOk && message.length > 0;

  if (formError) formError.hidden = valid;
  if (!valid) {
    const firstInvalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      'input, textarea'
    );
    firstInvalid?.focus();
    return;
  }

  const subject = encodeURIComponent(`Портфолио: сообщение от ${name}`);
  const body = encodeURIComponent(
    `Имя: ${name}\nEmail: ${email}\n\n${message}`
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

/* ── Год в подвале ───────────────────────────────────── */
const yearEl = qs<HTMLElement>('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
