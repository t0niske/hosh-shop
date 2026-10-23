/* HOSH — общее для всех страниц: лоадер, меню, LED, корзина (localStorage «hosh-cart»),
   вопросы, фильтр каталога, появление блоков. Конструктор — в builder.js. */
(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const monthsWord = m => m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев';

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

  if (window.LED) $$('.led').forEach((g, i) => LED.cycle(g, ['ON', '♥', '72', '24'], { cols: 11, rows: 9, pitch: 3.6, r: 1.35, on: '#FFB24D', off: 'rgba(255,178,77,.08)' }, 1600 + i * 120));

  /* ---------- корзина ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('hosh-cart') || '[]'); } catch (_) { cart = []; }
  const save = () => { try { localStorage.setItem('hosh-cart', JSON.stringify(cart)); } catch (_) {} };
  const itemCalc = it => { const d = D.devices.find(x => x.id === it.dev), p = d.plans[it.term], s = D.byN(it.scent); return { d, p, s, pm: Math.round(p.total * it.qty / p.months), total: p.total * it.qty }; };

  function renderCart() {
    cart = cart.filter(it => D.devices.some(d => d.id === it.dev) && D.byN(it.scent));
    $('#cart-count').textContent = cart.reduce((a, it) => a + it.qty, 0);
    if (!cart.length) {
      $('#dr-items').innerHTML = '<p class="dr-empty">Пока пусто. <a href="' + $('#menu a[href$="podpiska/"]').getAttribute('href') + '">Соберите подписку</a>: аппарат, срок и аромат.</p>';
      $('#dr-pm').textContent = D.fmt(0);
      $('#checkout').setAttribute('aria-disabled', 'true');
      return;
    }
    let pm = 0;
    $('#dr-items').innerHTML = cart.map((it, i) => {
      const c = itemCalc(it); pm += c.pm;
      return `<div class="it"><b>${c.d.name} × ${it.qty}</b><span class="p">${D.fmt(c.pm)}/мес</span>
        <small>${c.p.months} ${monthsWord(c.p.months)} · ${esc(c.s.name)} · итого ${D.fmt(c.total)}</small>
        <button type="button" data-rm="${i}">Удалить</button></div>`;
    }).join('');
    $('#dr-pm').textContent = D.fmt(pm);
    $('#checkout').removeAttribute('aria-disabled');
    updCheckout();
  }
  function updCheckout() {
    const name = $('#o-name').value.trim(), biz = $('#o-biz').value.trim();
    const lines = cart.map((it, i) => { const c = itemCalc(it); return `${i + 1}) ${c.d.name} × ${it.qty}, ${c.p.months} мес, аромат «${c.s.name}» — ${D.fmt(c.total)}`; });
    $('#checkout').href = D.waLink(`Здравствуйте! Хочу оформить подписку HOSH${name ? ' (' + name + ')' : ''}${biz ? ', объект: ' + biz : ''}.\n${lines.join('\n')}`);
  }
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200); };

  const drawer = $('#drawer');
  const open = () => { drawer.hidden = false; document.body.style.overflow = 'hidden'; $('.dr-x').focus(); };
  const close = () => { drawer.hidden = true; document.body.style.overflow = ''; $('#cart-open').focus(); };
  $('#cart-open').addEventListener('click', open);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) close();
    const rm = e.target.closest('[data-rm]'); if (rm) { cart.splice(+rm.dataset.rm, 1); save(); renderCart(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { if (!drawer.hidden) close(); document.body.classList.remove('menu-open'); } });
  $('#dr-form').addEventListener('input', updCheckout);
  renderCart();

  /* API для конструктора */
  window.HOSH = {
    add(it) {
      const same = cart.find(x => x.dev === it.dev && x.term === it.term && x.scent === it.scent);
      if (same) same.qty += it.qty; else cart.push(it);
      save(); renderCart();
      const btn = $('#cart-open'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
      toast('Добавлено в корзину ✦');
    }
  };

  /* вопросы */
  $$('.fq button').forEach(b => b.addEventListener('click', () => {
    const f = b.parentElement, o = !f.classList.contains('open');
    f.classList.toggle('open', o); b.setAttribute('aria-expanded', o);
  }));

  /* фильтр каталога */
  const cf = $('#cat-filter');
  if (cf) cf.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', cf).forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.fam-block').forEach(x => { x.hidden = b.dataset.c !== 'all' && x.dataset.c !== b.dataset.c; });
  });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.h2, .how li, .prod, .fam, .ar, .stats div').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
