/* HOSH — общее для всех страниц: лоадер, меню, вопросы, фильтры каталога, появление блоков
   и события аналитики (GA4 + Метрика, если ID заданы в src/config.js). Конструктор — в builder.js. */
(function () {
  const D = window.SITE_DATA, CFG = window.HOSH_CFG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- аналитика: стандартные события электронной торговли GA4 ---------- */
  const item = (n, extra) => { const s = D.byN(+n); return s ? Object.assign({ item_id: 'scent-' + s.n, item_name: s.name, item_category: s.cat }, extra || {}) : null; };
  function track(name, params) {
    params = params || {};
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      else (window.dataLayer = window.dataLayer || []).push({ event: name, ecommerce: params });
      const ym = window.ym, id = CFG.analytics && CFG.analytics.metrika;
      if (typeof ym === 'function' && id) ym(+id, 'reachGoal', name, params);
    } catch (_) {}
  }
  window.HOSH = { track, item };

  /* клики: «Выбрать» → add_to_cart, «Помогите выбрать» → wa_help */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-ev]'); if (!a) return;
    if (a.dataset.ev === 'add_to_cart') { const it = item(a.dataset.n); if (it) track('add_to_cart', { currency: 'KZT', items: [it] }); }
    else track(a.dataset.ev, { where: a.dataset.where || location.pathname });
  });
  /* страница аромата → view_item */
  const viewed = document.body.dataset.item;
  if (viewed && item(viewed)) track('view_item', { currency: 'KZT', items: [item(viewed)] });

  /* лоадер — только на главной */
  const loader = $('#loader');
  if (loader) {
    if (reduce || sessionStorage.getItem('hosh-seen')) loader.classList.add('done');
    else {
      const t0 = performance.now();
      (function tick(t) {
        const p = Math.min(1, (t - t0) / 900);
        $('#ld-fill').style.width = (p * 100) + '%';
        if (p < 1) requestAnimationFrame(tick); else loader.classList.add('done');
      })(t0);
      try { sessionStorage.setItem('hosh-seen', '1'); } catch (_) {}
    }
  }

  /* меню на телефоне */
  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('menu-open'); });

  if (window.LED) $$('.led').forEach((g, i) => LED.cycle(g, ['ON', '♥', '72', '24'], { cols: 11, rows: 9, pitch: 3.6, r: 1.35, on: '#FFB24D', off: 'rgba(255,178,77,.08)' }, 1600 + i * 120));

  /* вопросы */
  $$('.fq button').forEach(b => b.addEventListener('click', () => {
    const f = b.parentElement, o = !f.classList.contains('open');
    f.classList.toggle('open', o); b.setAttribute('aria-expanded', o);
  }));

  /* фильтр каталога: семейство и настроение вместе */
  const cf = $('#cat-filter'), mf = $('#mood-filter');
  if (cf && mf) {
    const st = { c: 'all', m: 'all' };
    const apply = () => {
      $$('.fam-block').forEach(b => {
        let any = false;
        $$('.ar', b).forEach(a => { const on = st.m === 'all' || a.dataset.m === st.m; a.hidden = !on; any = any || on; });
        b.hidden = (st.c !== 'all' && b.dataset.c !== st.c) || !any;
      });
    };
    const bind = (box, key, attr) => box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      st[key] = b.dataset[attr]; $$('button', box).forEach(x => x.setAttribute('aria-pressed', x === b)); apply();
    });
    bind(cf, 'c', 'c'); bind(mf, 'm', 'm');
  }

  /* нижняя панель на телефоне: прячем, когда виден финальный блок с теми же кнопками */
  const mbar = $('#mbar'), fin = $('.contact');
  if (mbar && fin && 'IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => mbar.classList.toggle('off', e.isIntersecting))).observe(fin);

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.h2, .how li, .prod, .fam, .ar, .hit, .stats div').forEach(el => { el.classList.add('rv'); io.observe(el); });

  window.HOSH.toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t.h); t.h = setTimeout(() => t.classList.remove('on'), 2400); };
})();
