/* HOSH: layout и блоки. Дизайн прежний (кобальт, кремовые волнистые карточки, Dela Gothic),
   теперь на нескольких страницах; корзина общая для всех страниц (localStorage). */
const D = require('../lib/data');
const { esc } = require('../lib/engine');

let site;
const init = s => { site = s; };

const BLOB = { floral: ['#FF8FB1', '#FFD1DC'], fresh: ['#46D3B5', '#C8F7E8'], gourmand: ['#E59A4C', '#FFE0B8'], hotel: ['#C9A46B', '#F3E3C2'], spa: ['#7DC9A0', '#D9F0E2'], perfume: ['#8D73E8', '#E1D8FF'] };
const blob = cat => `<span class="blob" style="background:radial-gradient(circle at 35% 30%, ${BLOB[cat][1]}, ${BLOB[cat][0]})"></span>`;
const months = m => `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;
const pm = d => D.fmt(Math.min(...d.plans.map(D.perMonth)));

const NAV = [['Собрать подписку', 'podpiska/'], ['Nova 300', 'nova-300/'], ['Nova 1000', 'nova-1000/'], ['Ароматы', 'aromaty/'], ['Для бизнеса', 'aromat-dlya/'], ['Доставка и оплата', 'dostavka-i-oplata/'], ['Вопросы', 'voprosy/']];

function header(p) {
  return `<a class="skip" href="#top">К содержанию</a>
<header class="nav" id="nav">
  <a class="logo" href="/" aria-label="HOSH — на главную">HOSH</a>
  <nav class="nav-links" id="menu" aria-label="Разделы">${NAV.map(([n, h]) => `<a href="/${h}"${p.section === h ? ' aria-current="page"' : ''}>${n}</a>`).join('')}<a class="m-only" href="/kontakty/">Контакты</a></nav>
  <button class="cart-btn" id="cart-open" type="button" aria-label="Открыть корзину">Корзина <b id="cart-count">0</b></button>
  <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
</header>`;
}

function footer() {
  const C = D.contacts;
  return `<footer class="foot2">
  <div class="f-in">
    <div><a class="logo" href="/">HOSH</a><p>Подписка на аромат в Астане: диффузор в аренду, масла каждый месяц, сервис и гарантия.</p></div>
    <nav aria-label="Магазин"><b>Магазин</b>${NAV.map(([n, h]) => `<a href="/${h}">${n}</a>`).join('')}</nav>
    <nav aria-label="Семейства"><b>Ароматы</b>${D.categories.map(c => `<a href="/aromaty/#${c.id}">${c.name}</a>`).join('')}</nav>
    <address><b>Контакты</b><a href="tel:${C.phoneRaw}">${C.phone}</a><a href="${D.waLink()}" target="_blank" rel="noopener">WhatsApp</a><a href="${C.map2gis}" target="_blank" rel="noopener">${C.address}</a><span>${C.hours}</span></address>
  </div>
  <div class="f-bot"><span>HOSH · Подписка на аромат · Астана · © 2026</span><a href="/politika-konfidencialnosti/">Политика конфиденциальности</a></div>
</footer>
<div class="drawer" id="drawer" hidden>
  <div class="drawer-bg" data-close></div>
  <aside class="drawer-in" role="dialog" aria-modal="true" aria-labelledby="dr-title">
    <div class="dr-head"><p class="dr-t" id="dr-title">Корзина</p><button type="button" class="dr-x" data-close aria-label="Закрыть">×</button></div>
    <div class="dr-items" id="dr-items"></div>
    <div class="dr-foot">
      <div class="dr-total"><span>Итого в месяц</span><b id="dr-pm">0 ₸</b></div>
      <form class="dr-form" id="dr-form" novalidate>
        <label for="o-name">Имя</label><input id="o-name" autocomplete="name" placeholder="Как к вам обращаться">
        <label for="o-biz">Компания или адрес объекта</label><input id="o-biz" placeholder="Кофейня на Мангилик Ел">
      </form>
      <a class="btn btn-red wide" id="checkout" href="#" target="_blank" rel="noopener">Оформить в WhatsApp</a>
      <span class="sum-note">Менеджер подтвердит заказ и время установки. Договор с юрлицом или ИП.</span>
    </div>
  </aside>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

function layout(p, head) {
  return `<!doctype html>
<html lang="ru">
<head>
${head}
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body class="${p.bodyClass || ''}">
${p.loader ? `<div class="loader" id="loader" aria-hidden="true"><p>Подождите, HOSH<br>распыляет аромат<span class="ld-dots"></span></p><i class="ld-bar"><i id="ld-fill"></i></i></div>` : ''}
${header(p)}
<main id="top">
${p.body}
${p.noCta ? '' : contact()}
</main>
${footer()}
<script src="/assets/js/data.js"></script>
<script src="/assets/js/led.js"></script>
<script src="/assets/js/main.js"></script>
${p.builder ? '<script src="/assets/js/builder.js"></script>' : ''}
</body>
</html>`;
}

/* Рисованный аппарат (как на прежнем сайте), пока нет фото device.* */
let n = 0;
function deviceArt(cls = 'dev-art') {
  if (site.hasImg('device')) return site.img('device', { cls: cls + ' dev-photo' });
  const k = ++n;
  return `<svg class="${cls}" viewBox="0 0 330 320" role="img" aria-label="Диффузор Nova">
  <defs><linearGradient id="hf${k}" x1="0" x2="1"><stop offset="0" stop-color="#4A504F"/><stop offset="1" stop-color="#2B2F2E"/></linearGradient><linearGradient id="ht${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6462"/><stop offset="1" stop-color="#434847"/></linearGradient></defs>
  <ellipse cx="165" cy="298" rx="120" ry="12" fill="rgba(34,48,201,.25)"/>
  <polygon points="220,80 268,54 268,259 220,285" fill="#1F2322"/><polygon points="62,80 110,54 268,54 220,80" fill="url(#ht${k})"/>
  <rect x="62" y="80" width="158" height="205" rx="5" fill="url(#hf${k})"/><ellipse cx="165" cy="67" rx="58" ry="11" fill="#0C0D0E"/>
  <rect x="156" y="94" width="46" height="178" rx="3" fill="#040506"/><g class="led" transform="translate(159,104)"></g>
  <circle cx="179" cy="160" r="5" fill="none" stroke="#E04848" stroke-width="1.6"/><path d="M179 153v6" stroke="#E04848" stroke-width="1.6"/>
  <rect x="76" y="283" width="22" height="9" rx="3" fill="#121314"/><rect x="186" y="283" width="22" height="9" rx="3" fill="#121314"/>
</svg>`;
}

function crumbs(p) { return site.crumbs(p.breadcrumbs); }

function phead(p, o = {}) {
  return `<section class="phead">
  ${crumbs(p)}
  <h1 class="poster small">${o.title || p.h1}</h1>
  ${o.lead ? `<p class="phead-lead">${o.lead}</p>` : ''}
</section>`;
}

function faq(list, title = 'Вопросы') {
  return `<section class="sec" id="faq"><h2 class="h2">${title}</h2>
  <div class="faq">${list.map(([q, a]) => `<div class="fq"><button type="button" aria-expanded="false"><span>${esc(q)}</span><span aria-hidden="true">+</span></button><p class="a">${a}</p></div>`).join('')}</div></section>`;
}

function aromaCard(s) {
  const c = D.cat(s.cat);
  return `<a class="ar scallop" href="/aromaty/${s.slug}/" data-c="${s.cat}">${blob(s.cat)}<small>N°${String(s.n).padStart(2, '0')} · ${c.short}</small><b>${esc(s.name)}</b><p>${esc(s.desc)}</p><span class="ar-go">Выбрать →</span></a>`;
}

function contact() {
  const C = D.contacts;
  return `<section class="sec contact">
  <h2 class="poster small"><span>Хочется</span><span><i>пахнуть</i></span><span>приятно?</span></h2>
  <div class="ct">
    <a class="btn btn-cream" href="${D.waLink('Здравствуйте! Хочу подписку HOSH.')}" target="_blank" rel="noopener">Написать в WhatsApp</a>
    <a class="ct-l" href="tel:${C.phoneRaw}">${C.phone}</a>
    <span class="ct-l">${C.address}</span>
    <span class="ct-l">${C.hours}</span>
  </div>
</section>`;
}

module.exports = { init, layout, deviceArt, phead, faq, aromaCard, blob, months, pm, contact, BLOB };
