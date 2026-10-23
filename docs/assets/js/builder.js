/* HOSH — конструктор подписки (/podpiska/). Параметры ссылки: ?dev=nova1000&term=1&scent=17 */
(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const monthsWord = m => m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев';
  const BLOB = { floral: ['#FF8FB1', '#FFD1DC'], fresh: ['#46D3B5', '#C8F7E8'], gourmand: ['#E59A4C', '#FFE0B8'], hotel: ['#C9A46B', '#F3E3C2'], spa: ['#7DC9A0', '#D9F0E2'], perfume: ['#8D73E8', '#E1D8FF'] };

  const q = new URLSearchParams(location.search);
  const st = {
    dev: Math.max(0, D.devices.findIndex(d => d.id === q.get('dev'))),
    qty: 1,
    term: [0, 1, 2].includes(+q.get('term')) && q.get('term') !== null ? +q.get('term') : 2,
    scent: D.byN(+q.get('scent')) ? +q.get('scent') : 17,
    cat: 'all'
  };
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

  $('#b-cats').innerHTML = `<button type="button" data-c="all" aria-pressed="true">Все 32</button>` + D.categories.map(c => `<button type="button" data-c="${c.id}" aria-pressed="false">${c.name}</button>`).join('');
  $('#b-scents').innerHTML = D.scents.map(s => `
    <button type="button" class="sc scallop" data-n="${s.n}" data-c="${s.cat}" aria-pressed="${s.n === st.scent}">
      <span class="blob" style="background:radial-gradient(circle at 35% 30%, ${BLOB[s.cat][1]}, ${BLOB[s.cat][0]})"></span>
      <small>N°${String(s.n).padStart(2, '0')} · ${D.categories.find(c => c.id === s.cat).short}</small><b>${esc(s.name)}</b><p>${esc(s.desc)}</p>
    </button>`).join('');
  const sel = $(`#b-scents .sc[data-n="${st.scent}"]`);
  if (sel && q.get('scent')) setTimeout(() => sel.scrollIntoView({ block: 'nearest' }), 300);

  function line() {
    const d = D.devices[st.dev], p = d.plans[st.term], s = D.byN(st.scent);
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
  $('#add').addEventListener('click', () => window.HOSH.add({ dev: D.devices[st.dev].id, qty: st.qty, term: st.term, scent: st.scent }));
  renderTerms(); renderSummary();
})();
