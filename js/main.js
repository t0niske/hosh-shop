(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const monthsWord = m => m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев';
  const BLOB = { floral: ['#FF8FB1', '#FFD1DC'], fresh: ['#46D3B5', '#C8F7E8'], gourmand: ['#E59A4C', '#FFE0B8'], hotel: ['#C9A46B', '#F3E3C2'], spa: ['#7DC9A0', '#D9F0E2'], perfume: ['#8D73E8', '#E1D8FF'] };

  /* loader: a short "spraying" bar, then lift */
  const loader = $('#loader');
  if (reduce) loader.classList.add('done');
  else {
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 1100);
      $('#ld-fill').style.width = (p * 100) + '%';
      if (p < 1) requestAnimationFrame(tick); else loader.classList.add('done');
    })(t0);
  }

  LED.cycle($('#hero-led'), ['ON', '♥', '72', '3D'], { cols: 11, rows: 9, pitch: 3.6, r: 1.35, on: '#FFB24D', off: 'rgba(255,178,77,.08)' }, 1600);

  /* marquee */
  const mq = ['Без покупки оборудования', 'Масла включены', 'Замена каждый месяц', 'Обслуживание', 'Гарантия', 'Установка в день обращения', '3 дня бесплатно'];
  $('#mq').innerHTML = [...mq, ...mq].map(t => `<span>${t}</span>`).join('');

  /* ---------- builder state ---------- */
  const st = { dev: 0, qty: 1, term: 2, scent: 17, cat: 'all' };
  const mini = `<svg viewBox="0 0 330 320" aria-hidden="true"><polygon points="220,80 268,54 268,259 220,285" fill="#1F2322"/><polygon points="62,80 110,54 268,54 220,80" fill="#5E6462"/><rect x="62" y="80" width="158" height="205" rx="5" fill="#3A3F3E"/><ellipse cx="165" cy="67" rx="58" ry="11" fill="#0C0D0E"/><rect x="156" y="94" width="46" height="178" rx="3" fill="#040506"/><g fill="#FFB24D"><rect x="166" y="108" width="5" height="16"/><rect x="174" y="108" width="5" height="16"/></g></svg>`;

  $('#b-dev').innerHTML = D.devices.map((d, i) => `
    <button type="button" class="dv" data-i="${i}" aria-pressed="${i === st.dev}">
      <span><b>${d.name}</b><small>до ${d.area} м² · ${d.specs[2][1]} · ${d.specs[3][1]}</small></span>${mini}
      <span class="pr">от <em>${D.fmt(D.perMonth(d.plans[2]))}</em> / мес</span>
    </button>`).join('');

  function renderTerms() {
    const d = D.devices[st.dev];
    $('#b-term').innerHTML = d.plans.map((p, i) => `
      <button type="button" class="tm" data-i="${i}" aria-pressed="${i === st.term}">
        ${i === 1 ? '<span class="tag">Популярный</span>' : i === 2 ? '<span class="tag">Выгоднее</span>' : ''}
        <b>${p.months} ${monthsWord(p.months)}</b><span>${D.fmt(D.perMonth(p))} / мес</span><small>${D.fmt(p.total)} за период</small>
      </button>`).join('');
  }

  $('#b-cats').innerHTML = `<button type="button" data-c="all" aria-pressed="true">Все 32</button>` + Object.entries(D.categories).map(([k, v]) => `<button type="button" data-c="${k}" aria-pressed="false">${v}</button>`).join('');
  $('#b-scents').innerHTML = D.scents.map(s => `
    <button type="button" class="sc scallop" data-n="${s.n}" data-c="${s.cat}" aria-pressed="${s.n === st.scent}">
      <span class="blob" style="background:radial-gradient(circle at 35% 30%, ${BLOB[s.cat][1]}, ${BLOB[s.cat][0]})"></span>
      <small>N°${String(s.n).padStart(2, '0')} · ${D.categories[s.cat]}</small><b>${esc(s.name)}</b><p>${esc(s.desc)}</p>
    </button>`).join('');

  function line() {
    const d = D.devices[st.dev], p = d.plans[st.term], s = D.scents.find(x => x.n === st.scent);
    return { d, p, s, qty: st.qty, pm: Math.round(p.total * st.qty / p.months), total: p.total * st.qty, save: (d.plans[0].total * p.months - p.total) * st.qty };
  }
  function renderSummary() {
    const L = line();
    $('#s-dev').textContent = `${L.d.name} × ${L.qty}`;
    $('#s-term').textContent = `${L.p.months} ${monthsWord(L.p.months)}`;
    $('#s-scent').textContent = L.s.name;
    $('#s-pm').textContent = D.fmt(L.pm);
    $('#s-save').textContent = L.save > 0 ? D.fmt(L.save) : '—';
    $('#s-total').textContent = D.fmt(L.total);
    $('#q-val').textContent = st.qty;
  }

  $('#b-dev').addEventListener('click', e => {
    const b = e.target.closest('.dv'); if (!b) return;
    st.dev = +b.dataset.i; $$('#b-dev .dv').forEach(x => x.setAttribute('aria-pressed', x === b));
    renderTerms(); renderSummary();
  });
  $('#b-term').addEventListener('click', e => {
    const b = e.target.closest('.tm'); if (!b) return;
    st.term = +b.dataset.i; $$('#b-term .tm').forEach(x => x.setAttribute('aria-pressed', x === b)); renderSummary();
  });
  $('#q-minus').addEventListener('click', () => { st.qty = Math.max(1, st.qty - 1); renderSummary(); });
  $('#q-plus').addEventListener('click', () => { st.qty = Math.min(20, st.qty + 1); renderSummary(); });
  $('#b-cats').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    st.cat = b.dataset.c; $$('#b-cats button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('#b-scents .sc').forEach(x => x.classList.toggle('hide', st.cat !== 'all' && x.dataset.c !== st.cat));
  });
  $('#b-scents').addEventListener('click', e => {
    const b = e.target.closest('.sc'); if (!b) return;
    st.scent = +b.dataset.n; $$('#b-scents .sc').forEach(x => x.setAttribute('aria-pressed', x === b)); renderSummary();
  });
  renderTerms(); renderSummary();

  /* ---------- cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('hosh-cart') || '[]'); } catch (_) { cart = []; }
  const save = () => { try { localStorage.setItem('hosh-cart', JSON.stringify(cart)); } catch (_) {} };
  const itemCalc = it => { const d = D.devices.find(x => x.id === it.dev), p = d.plans[it.term], s = D.scents.find(x => x.n === it.scent); return { d, p, s, pm: Math.round(p.total * it.qty / p.months), total: p.total * it.qty }; };

  function renderCart() {
    $('#cart-count').textContent = cart.reduce((a, it) => a + it.qty, 0);
    if (!cart.length) {
      $('#dr-items').innerHTML = '<p class="dr-empty">Пока пусто. Соберите подписку: аппарат, срок и аромат.</p>';
      $('#dr-pm').textContent = '0 ₸';
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
    $('#checkout').href = D.waLink(`Здравствуйте! Хочу оформить подписку HOSH${name ? ' (' + name + ')' : ''}${biz ? ', объект: ' + biz : ''}.\n${lines.join('\n')}\nНачнём с 3 бесплатных дней?`);
  }
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200); };

  $('#add').addEventListener('click', () => {
    const it = { dev: D.devices[st.dev].id, qty: st.qty, term: st.term, scent: st.scent };
    const same = cart.find(x => x.dev === it.dev && x.term === it.term && x.scent === it.scent);
    if (same) same.qty += it.qty; else cart.push(it);
    save(); renderCart();
    const btn = $('#cart-open'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
    toast('Добавлено в корзину ✦');
  });
  const drawer = $('#drawer');
  const open = () => { drawer.hidden = false; document.body.style.overflow = 'hidden'; $('.dr-x').focus(); };
  const close = () => { drawer.hidden = true; document.body.style.overflow = ''; $('#cart-open').focus(); };
  $('#cart-open').addEventListener('click', open);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) close();
    const rm = e.target.closest('[data-rm]'); if (rm) { cart.splice(+rm.dataset.rm, 1); save(); renderCart(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) close(); });
  $('#dr-form').addEventListener('input', updCheckout);
  renderCart();

  /* ---------- static blocks ---------- */
  $('#stats').innerHTML = D.facts.map(f => `<div class="rv"><b>${f.v}</b><span>${esc(f.t)}</span></div>`).join('');
  const who = ['Кофейни', 'Бутики', 'Салоны красоты', 'Отели', 'Фитнес', 'Клиники', 'Офисы', 'Шоурумы', 'Спа', 'Рестораны', 'Барбершопы', 'Лобби ЖК'];
  $('#who').innerHTML = who.map(w => `<span class="stk">${w}</span>`).join('');
  $('#faq-list').innerHTML = D.faq.map(([q, a]) => `<div class="fq"><button type="button" aria-expanded="false"><span>${esc(q)}</span><span aria-hidden="true">+</span></button><p class="a">${esc(a)}</p></div>`).join('');
  $('#faq-list').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const f = b.parentElement, o = !f.classList.contains('open');
    f.classList.toggle('open', o); b.setAttribute('aria-expanded', o);
  });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .h2, .how li').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
