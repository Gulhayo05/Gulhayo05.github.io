// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

// Tashkent local time
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = fmt.format(new Date()); };
tick();
setInterval(tick, 30000);

// Count-up numbers
const countUp = el => {
  const target = +el.dataset.count;
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const start = performance.now(), dur = 1400;
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + Math.round(target * eased).toLocaleString('en-US') + suf;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll (staggered within each grid)
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const siblings = [...el.parentElement.children];
    el.style.transitionDelay = reduce ? '0s' : (siblings.indexOf(el) % 6) * 60 + 'ms';
    el.classList.add('visible');
    setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
    if (!reduce) el.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(el);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active nav link
const links = [...document.querySelectorAll('.nav-links a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();
