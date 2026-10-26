/* HOSH — конструктор и оформление подписки (/podpiska/) на одной странице.
   Ссылки с предвыбором: ?dev=nova1000&term=1&scent=17. Выбор помнится в localStorage «hosh-sub».
   Пока checkout.online = false, заказ уходит сообщением в WhatsApp, ссылку на оплату присылает менеджер. */
(function () {
  const D = window.SITE_DATA, CFG = window.HOSH_CFG, H = window.HOSH;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const monthsWord = m => m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев';
  const form = $('#order');
  const C = CFG.checkout;
  const scentName = s => s.motif ? 'по мотивам ' + s.name : s.name;

  /* ---------- состояние: ссылка > прошлый выбор > по умолчанию ---------- */
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('hosh-sub') || '{}') || {}; } catch (_) {}
  const q = new URLSearchParams(location.search);
  const devIdx = id => D.devices.findIndex(d => d.id === id);
  const st = {
    dev: devIdx(q.get('dev')) >= 0 ? devIdx(q.get('dev')) : devIdx(saved.dev) >= 0 ? devIdx(saved.dev) : 0,
    term: ['0', '1', '2'].includes(q.get('term')) ? +q.get('term') : [0, 1, 2].includes(saved.term) ? saved.term : 2,
    scent: D.byN(+q.get('scent')) ? +q.get('scent') : D.byN(saved.scent) ? saved.scent : 0,
    qty: Math.min(20, Math.max(1, +saved.qty || 1))
  };
  const save = () => { try { localStorage.setItem('hosh-sub', JSON.stringify({ dev: D.devices[st.dev].id, term: st.term, scent: st.scent, qty: st.qty })); } catch (_) {} };

  const radio = (name, v) => $(`input[name="${name}"][value="${v}"]`, form);
  radio('dev', D.devices[st.dev].id).checked = true;
  radio('term', st.term).checked = true;
  if (st.scent) radio('scent', st.scent).checked = true;

  function line() {
    const d = D.devices[st.dev], p = d.plans[st.term], s = D.byN(st.scent);
    return { d, p, s, qty: st.qty, pm: Math.round(p.total * st.qty / p.months), total: p.total * st.qty, save: (d.plans[0].total * p.months - p.total) * st.qty };
  }
  const gaItems = L => [{ item_id: L.d.id + '-' + L.p.months, item_name: L.d.name + ' · ' + L.p.months + ' мес', item_variant: L.s ? L.s.name : '', price: L.p.total, quantity: L.qty }];

  function render() {
    const L = line(), dn = CFG.devName[L.d.id];
    L.d.plans.forEach((p, i) => { $(`[data-pm="${i}"]`).textContent = D.fmt(D.perMonth(p)); $(`[data-total="${i}"]`).textContent = D.fmt(p.total) + ' за период'; });
    $('#s-dev').textContent = dn;
    $('#s-model').textContent = `${L.d.name} × ${L.qty}`;
    $('#s-term').textContent = `${L.p.months} ${monthsWord(L.p.months)}`;
    $('#s-scent').textContent = L.s ? scentName(L.s) : 'выберите';
    $('#s-pm').textContent = D.fmt(L.pm);
    $('#s-save').textContent = L.save > 0 ? D.fmt(L.save) : '—';
    $('#s-total').textContent = D.fmt(L.total);
    $('#q-val').textContent = st.qty;
    $('#sb-pm').textContent = D.fmt(L.pm) + ' / мес';
    $('#sb-line').textContent = `${dn} · ${L.p.months} мес · ${L.s ? L.s.name : 'аромат не выбран'}`;
    $('#r-line').textContent = `${dn}, ${L.d.name} × ${L.qty} · ${L.p.months} ${monthsWord(L.p.months)} · ${L.s ? scentName(L.s) : 'аромат не выбран'}`;
    $('#r-sum').textContent = `${D.fmt(L.pm)} в месяц · ${D.fmt(L.total)} за период`;
    save();
  }

  form.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'dev') st.dev = devIdx(t.value);
    else if (t.name === 'term') st.term = +t.value;
    else if (t.name === 'scent') { st.scent = +t.value; const it = H.item(st.scent); if (it) H.track('add_to_cart', { currency: 'KZT', items: [it] }); }
    else if (t.name === 'pay') {
      $('#iin-row').hidden = t.value !== 'invoice';
      const L = line(); H.track('add_payment_info', { currency: 'KZT', value: L.total, payment_type: t.value, items: gaItems(L) });
    }
    if (['dev', 'term', 'scent'].includes(t.name)) render();
  });
  $('#q-minus').addEventListener('click', () => { st.qty = Math.max(1, st.qty - 1); render(); });
  $('#q-plus').addEventListener('click', () => { st.qty = Math.min(20, st.qty + 1); render(); });

  /* ---------- фильтры ароматов: настроение × семейство ---------- */
  const f = { m: 'all', c: 'all' };
  const filter = () => $$('#b-scents .sc').forEach(x => x.classList.toggle('hide', (f.m !== 'all' && x.dataset.m !== f.m) || (f.c !== 'all' && x.dataset.c !== f.c)));
  [['#f-mood', 'm'], ['#f-cat', 'c']].forEach(([sel, k]) => $(sel).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    f[k] = b.dataset[k]; $$('button', $(sel)).forEach(x => x.setAttribute('aria-pressed', x === b)); filter();
  }));
  /* выбранный по ссылке аромат — в видимой части списка */
  const grid = $('#b-scents'), sel = st.scent && radio('scent', st.scent).closest('.sc');
  if (sel) requestAnimationFrame(() => { grid.scrollTop = sel.offsetTop - grid.offsetTop - 12; });

  /* ---------- оформление ---------- */
  const phone = $('#o-phone');
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    phone.value = !d ? '' : '+7' + (p[0] ? ' (' + p[0] : '') + (p[1] ? ') ' + p[1] : '') + (p[2] ? '-' + p[2] : '') + (p[3] ? '-' + p[3] : '');
  });
  phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+7'; });
  phone.addEventListener('blur', () => { if (phone.value === '+7') phone.value = ''; });
  $('#o-iin').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12); });

  /* ближайшие дни доставки */
  const day = $('#o-day'), wd = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  for (let i = 1; i <= (C.deliveryDays || 7); i++) {
    const dt = new Date(); dt.setDate(dt.getDate() + i);
    const label = (i === 1 ? 'Завтра, ' : i === 2 ? 'Послезавтра, ' : '') + wd[dt.getDay()] + ', ' + dt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    day.add(new Option(label, dt.toISOString().slice(0, 10)));
  }

  let started = false;
  $('#st-form').addEventListener('focusin', e => {
    if (started || !e.target.matches('input, select')) return;
    started = true; const L = line();
    H.track('begin_checkout', { currency: 'KZT', value: L.total, items: gaItems(L) });
  });

  const err = $('#o-err');
  const fail = (msg, el) => {
    err.textContent = msg; err.hidden = false;
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => el.focus({ preventScroll: true }), 350); }
    return false;
  };
  function validate() {
    const v = n => (form.elements[n] && form.elements[n].value || '').trim();
    const pay = $('input[name="pay"]:checked', form);
    if (!st.scent) return fail('Выберите аромат — или нажмите «Помогите выбрать».', $('#st-scent'));
    if (!v('name')) return fail('Как к вам обращаться?', $('#o-name'));
    if (v('phone').replace(/\D/g, '').length !== 11) return fail('Проверьте телефон: нужен номер из 11 цифр с WhatsApp.', phone);
    if (!v('address')) return fail('Укажите адрес доставки.', $('#o-addr'));
    if (!v('day')) return fail('Выберите день доставки.', day);
    if (!pay) return fail('Выберите способ оплаты.', $('input[name="pay"]', form));
    if (pay.value === 'invoice' && v('iin').length !== 12) return fail('Для счёта нужен ИИН или БИН — 12 цифр.', $('#o-iin'));
    if (!$('#o-agree').checked) return fail('Нужно согласие на обработку данных.', $('#o-agree'));
    err.hidden = true; return true;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    const L = line(), v = n => form.elements[n].value.trim();
    const pay = $('input[name="pay"]:checked', form).value, payName = C.payments.find(p => p.id === pay).name;
    const text = [
      'Здравствуйте! Пишу с сайта HOSH, страница «Собрать подписку». Хочу оформить подписку:',
      `• ${CFG.devName[L.d.id]} (${L.d.name}) × ${L.qty}`,
      `• Срок: ${L.p.months} ${monthsWord(L.p.months)} — ${D.fmt(L.pm)} в месяц, итого ${D.fmt(L.total)}`,
      `• Аромат: N°${String(L.s.n).padStart(2, '0')} ${scentName(L.s)}`,
      `Имя: ${v('name')}`, `Телефон: ${v('phone')}`, `Адрес: ${v('address')}`,
      `День доставки: ${day.options[day.selectedIndex].text}`, `Оплата: ${payName}`
    ].concat(pay === 'invoice' ? [`ИИН/БИН: ${v('iin')}`] : []).join('\n');
    const url = D.waLink(text);

    if (C.online && C.payUrl) {
      /* после подключения эквайринга: purchase лучше отправлять со страницы успешной оплаты */
      H.track('purchase', { currency: 'KZT', value: L.total, transaction_id: 'h' + Date.now(), payment_type: pay, items: gaItems(L) });
      location.href = C.payUrl + (C.payUrl.includes('?') ? '&' : '?') + 'amount=' + L.total + '&comment=' + encodeURIComponent(text);
      return;
    }
    H.track('generate_lead', { currency: 'KZT', value: L.total, payment_type: pay, items: gaItems(L) });
    $('#done-wa').href = url;
    $('#done').hidden = false; $('#done').focus();
    /* с флагом noopener window.open всегда возвращает null — обнуляем opener вручную */
    const w = window.open(url, '_blank');
    if (w) w.opener = null; else location.href = url;
  });

  /* панель итога на телефоне прячется, когда видно оформление */
  const sbar = $('#sbar');
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => sbar.classList.toggle('off', e.isIntersecting)), { rootMargin: '0px 0px -30% 0px' }).observe($('#st-form'));

  render();
})();
