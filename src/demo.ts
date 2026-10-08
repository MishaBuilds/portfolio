/**
 * Живое демо для hero: волна поиска пути (BFS) на сетке.
 * Тот же класс задач, что и в проектах: сетка, волна, кратчайший маршрут.
 * Ванильный canvas, один rAF, пауза вне экрана, статика при reduced-motion.
 */

type Phase = 'wave' | 'path' | 'hold' | 'fade';

const ACCENT = '#2340d8';
const INK = '23,23,28';

export function initPathDemo(
  canvas: HTMLCanvasElement,
  statEl: HTMLElement | null
): void {
  const maybeCtx = canvas.getContext('2d');
  if (!maybeCtx) return;
  const ctx: CanvasRenderingContext2D = maybeCtx;

  const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cols = 0;
  let rows = 0;
  let cell = 14;
  let walls: Uint8Array = new Uint8Array(0);
  let order: number[] = [];
  let path: number[] = [];
  let revealed = 0;
  let pathShown = 0;
  let phase: Phase = 'wave';
  let holdUntil = 0;
  let fadeStep = 0;
  let seed = 20261008;
  let raf = 0;
  let running = false;
  let frame = 0;

  const at = (x: number, y: number): number => y * cols + x;

  function rnd(): number {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function generate(): void {
    for (let attempt = 0; attempt < 14; attempt += 1) {
      seed += 7919;
      walls = new Uint8Array(cols * rows);
      const density = 0.22 + rnd() * 0.06;
      for (let i = 0; i < walls.length; i += 1) {
        if (rnd() < density) walls[i] = 1;
      }
      const sx = 1;
      const sy = 1;
      const tx = cols - 2;
      const ty = rows - 2;
      walls[at(sx, sy)] = 0;
      walls[at(tx, ty)] = 0;
      if (bfs(sx, sy, tx, ty)) break;
    }
    revealed = 0;
    pathShown = 0;
    phase = 'wave';
    fadeStep = 0;
    draw();
  }

  function bfs(sx: number, sy: number, tx: number, ty: number): boolean {
    const prev = new Int32Array(cols * rows).fill(-1);
    const seen = new Uint8Array(cols * rows);
    const queue: number[] = [at(sx, sy)];
    seen[at(sx, sy)] = 1;
    order = [];
    const target = at(tx, ty);
    let found = at(sx, sy) === target;
    while (queue.length > 0) {
      const cur = queue.shift() as number;
      order.push(cur);
      if (cur === target) {
        found = true;
        break;
      }
      const cx = cur % cols;
      const cy = Math.floor(cur / cols);
      const neighbours: number[] = [];
      if (cx > 0) neighbours.push(cur - 1);
      if (cx < cols - 1) neighbours.push(cur + 1);
      if (cy > 0) neighbours.push(cur - cols);
      if (cy < rows - 1) neighbours.push(cur + cols);
      for (const next of neighbours) {
        if (seen[next] === 0 && walls[next] === 0) {
          seen[next] = 1;
          prev[next] = cur;
          queue.push(next);
        }
      }
    }
    if (!found) return false;
    path = [];
    let cur: number = target;
    while (cur !== -1) {
      path.push(cur);
      cur = prev[cur];
    }
    path.reverse();
    return true;
  }

  function drawCell(i: number, fill: string, inset = 0): void {
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * cell;
    ctx.fillStyle = fill;
    ctx.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
  }

  function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < walls.length; i += 1) {
      if (walls[i] === 1) drawCell(i, `rgba(${INK},0.055)`);
    }
    for (let k = 0; k < revealed && k < order.length; k += 1) {
      drawCell(order[k], `rgba(${INK},0.10)`);
    }
    const frontierStart = Math.max(0, revealed - 48);
    for (let k = frontierStart; k < revealed && k < order.length; k += 1) {
      drawCell(order[k], `rgba(${INK},0.30)`);
    }
    for (let k = 0; k < pathShown && k < path.length; k += 1) {
      drawCell(path[k], ACCENT, Math.max(1.5, cell * 0.14));
    }
  }

  function tick(now: number): void {
    if (!running) return;
    frame += 1;
    if (phase === 'wave') {
      const per = Math.max(4, Math.ceil(order.length / 150));
      revealed = Math.min(order.length, revealed + per);
      draw();
      if (revealed >= order.length) {
        phase = path.length > 0 ? 'path' : 'hold';
        holdUntil = now + 2200;
      }
    } else if (phase === 'path') {
      pathShown = Math.min(path.length, pathShown + 2);
      draw();
      if (pathShown >= path.length) {
        phase = 'hold';
        holdUntil = now + 2200;
      }
    } else if (phase === 'hold') {
      if (now >= holdUntil) {
        phase = 'fade';
        fadeStep = 0;
      }
    } else {
      fadeStep += 1;
      ctx.fillStyle = 'rgba(255,255,255,0.09)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (fadeStep >= 11) {
        seed += 104729;
        generate();
      }
    }
    if (statEl !== null && frame % 6 === 0) {
      statEl.textContent = `шаг ${revealed} · путь ${pathShown}`;
    }
    raf = requestAnimationFrame(tick);
  }

  function start(): void {
    if (running || calmMotion) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(raf);
  }

  function reseed(): void {
    seed = (Math.random() * 4294967296) >>> 0;
    generate();
    start();
  }

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const nextCols = Math.max(26, Math.min(48, Math.floor(rect.width / 13)));
    const nextCell = rect.width / nextCols;
    const nextRows = Math.max(18, Math.floor(rect.height / nextCell));
    if (nextCols === cols && nextRows === rows) {
      draw();
      return;
    }
    cols = nextCols;
    rows = nextRows;
    cell = rect.width / cols;
    generate();
    if (calmMotion) {
      revealed = order.length;
      pathShown = path.length;
      draw();
      if (statEl !== null) statEl.textContent = `клеток ${order.length} · путь ${path.length}`;
    }
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 200);
  });

  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    watcher.observe(canvas);
  }

  canvas.addEventListener('pointerdown', reseed);
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reseed();
    }
  });

  resize();
  start();
}
