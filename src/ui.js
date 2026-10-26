/* HOSH: layout и блоки. Дизайн прежний (кобальт, кремовые волнистые карточки, Dela Gothic).
   Покупка — на одной странице /podpiska/ (builder.js), без корзины и регистрации. */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const { CFG } = require('./setup');

let site;
const init = s => { site = s; };

const BLOB = { floral: ['#FF8FB1', '#FFD1DC'], fresh: ['#46D3B5', '#C8F7E8'], gourmand: ['#E59A4C', '#FFE0B8'], hotel: ['#C9A46B', '#F3E3C2'], spa: ['#7DC9A0', '#D9F0E2'], perfume: ['#8D73E8', '#E1D8FF'] };
const blob = cat => `<span class="blob" style="background:radial-gradient(circle at 35% 30%, ${BLOB[cat][1]}, ${BLOB[cat][0]})"></span>`;
const months = m => `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;
const pm = d => D.fmt(Math.min(...d.plans.map(D.perMonth)));
const count = () => D.scents.length;
/* «34 аромата», «21 аромат» */
const aromas = (n = count()) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'аромат' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'аромата' : 'ароматов'}`;
/* Скидка за 6 месяцев против помесячной цены: 26% */
const save6 = (d = D.devices[0]) => Math.round((1 - D.perMonth(d.plans[2]) / D.perMonth(d.plans[0])) * 100);

/* Аппараты называем по задаче, модель — вторым планом */
const DEV = { nova300: { name: 'Для квартиры', long: 'Диффузор для квартиры' }, nova1000: { name: 'Для большого дома и бизнеса', long: 'Диффузор для большого дома и бизнеса' } };

/* Название аромата: ароматы с чужими брендами — «по мотивам …», без логотипов */
const scentName = s => s.motif ? `по мотивам ${s.name}` : s.name;
const scentHtml = s => s.motif ? `<em>по мотивам</em> ${esc(s.name)}` : esc(s.name);
const shortNotes = s => s.notes.map(x => x.split(',')[0].trim());

/* WhatsApp с меткой сайта и страницы — видно, откуда пришёл человек */
const wa = (page, text = 'Помогите выбрать подписку.') => D.waLink(`Здравствуйте! Пишу с сайта HOSH, страница «${page}». ${text}`);

const NAV = [['Ароматы', 'aromaty/'], ['Для дома', 'diffuzor-dlya-doma/'], ['Для бизнеса', 'aromat-dlya/'], ['Доставка', 'dostavka-i-oplata/']];
const NAV_MORE = [['Как в отеле', 'kak-v-otele/'], ['Nova 300', 'nova-300/'], ['Nova 1000', 'nova-1000/'], ['Вопросы', 'voprosy/'], ['Контакты', 'kontakty/']];

function header(p) {
  const cur = h => p.section === h ? ' aria-current="page"' : '';
  return `<a class="skip" href="#top">К содержанию</a>
<header class="nav" id="nav">
  <a class="logo" href="/" aria-label="HOSH — на главную">HOSH</a>
  <nav class="nav-links" id="menu" aria-label="Разделы">${NAV.map(([n, h]) => `<a href="/${h}"${cur(h)}>${n}</a>`).join('')}${NAV_MORE.map(([n, h]) => `<a class="m-only" href="/${h}"${cur(h)}>${n}</a>`).join('')}</nav>
  <a class="btn btn-red nav-cta" href="/podpiska/"${cur('podpiska/')}>Собрать<span class="d-only">&nbsp;подписку</span></a>
  <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
</header>`;
}

function footer(p) {
  const C = D.contacts;
  return `<footer class="foot2">
  <div class="f-in">
    <div><a class="logo" href="/">HOSH</a><p>Аромат для дома и бизнеса по подписке в Астане: диффузор, масла, доставка и сервис — оформление онлайн, без звонков.</p></div>
    <nav aria-label="Магазин"><b>Магазин</b><a href="/podpiska/">Собрать подписку</a>${[...NAV, ...NAV_MORE].map(([n, h]) => `<a href="/${h}">${n}</a>`).join('')}</nav>
    <nav aria-label="Семейства"><b>Ароматы</b>${D.categories.map(c => `<a href="/aromaty/#${c.id}">${c.name}</a>`).join('')}</nav>
    <address><b>Контакты</b><a href="tel:${C.phoneRaw}">${C.phone}</a><a href="${wa(p.h1 || 'Главная', 'Здравствуйте!')}" target="_blank" rel="noopener" data-ev="wa_help" data-where="footer">WhatsApp</a><a href="${C.map2gis}" target="_blank" rel="noopener">${C.address}</a><span>${C.hours}</span></address>
  </div>
  <div class="f-bot"><span>HOSH · Аромат по подписке · Астана · © 2026</span><a href="/politika-konfidencialnosti/">Политика конфиденциальности</a></div>
</footer>
${p.builder ? '' : `<div class="mbar" id="mbar"><a class="btn btn-red" href="/podpiska/">Собрать подписку</a><a class="btn btn-cream" href="${wa(p.h1 || 'Главная')}" target="_blank" rel="noopener" data-ev="wa_help" data-where="mbar">WhatsApp</a></div>`}
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

/* Счётчики подключаются, только когда в config.js есть ID */
function analytics() {
  const { ga4, metrika } = CFG.analytics;
  let s = '<script>window.dataLayer=window.dataLayer||[];</script>';
  if (ga4) s += `\n<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script>\n<script>function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}');</script>`;
  if (metrika) s += `\n<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${metrika},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script>`;
  return s;
}

function layout(p, head) {
  return `<!doctype html>
<html lang="ru">
<head>
${head}
<script>document.documentElement.classList.add('js')</script>
${analytics()}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body class="${p.bodyClass || ''}${p.builder ? ' is-builder' : ''}"${p.item ? ` data-item="${p.item}"` : ''}>
${p.loader ? `<div class="loader" id="loader" aria-hidden="true"><p>Подождите, HOSH<br>распыляет аромат<span class="ld-dots"></span></p><i class="ld-bar"><i id="ld-fill"></i></i></div>` : ''}
${header(p)}
<main id="top">
${p.body}
${p.noCta ? '' : contact(p)}
</main>
${footer(p)}
<script src="/assets/js/data.js"></script>
<script src="/assets/js/main.js"></script>
${p.builder ? '<script src="/assets/js/builder.js"></script>' : ''}
</body>
</html>`;
}

/* Аппарат: рендер из Blender (device.webp) */
function deviceArt(cls = 'dev-art', o = {}) {
  return site.img('device', { cls: cls + ' dev-photo', ...o });
}

function crumbs(p) { return site.crumbs(p.breadcrumbs); }

function phead(p, o = {}) {
  return `<section class="phead">
  ${crumbs(p)}
  <h1 class="poster small${o.cls ? ' ' + o.cls : ''}">${o.title || p.h1}</h1>
  ${o.lead ? `<p class="phead-lead">${o.lead}</p>` : ''}
</section>`;
}

function faq(list, title = 'Вопросы') {
  return `<section class="sec" id="faq"><h2 class="h2">${title}</h2>
  <div class="faq">${list.map(([q, a]) => `<div class="fq"><button type="button" aria-expanded="false"><span>${esc(q)}</span><span aria-hidden="true">+</span></button><p class="a">${a}</p></div>`).join('')}</div></section>`;
}

/* Метки аромата: настроение, семейство, три ноты */
function tags(s, o = {}) {
  const c = D.cat(s.cat);
  return `<span class="tags"><i class="t-mood">${s.mood}</i><i>${c.short}</i>${o.notes === false ? '' : shortNotes(s).map(n => `<i class="t-note">${esc(n)}</i>`).join('')}</span>`;
}

/* Плитка каталога: цена — цена подписки, ароматы отдельно не продаются */
function aromaCard(s) {
  const c = D.cat(s.cat);
  return `<a class="ar scallop" href="/aromaty/${s.slug}/" data-c="${s.cat}" data-m="${s.mood}">${blob(s.cat)}<small>N°${String(s.n).padStart(2, '0')} · ${c.short}</small><b>${scentHtml(s)}</b>${tags(s, { notes: false })}<p>${esc(s.desc)}</p><p class="ar-nt">${shortNotes(s).map(esc).join(' · ')}</p><span class="ar-go">в подписке от ${D.fmt(D.minPerMonth())}/мес →</span></a>`;
}

/* Карточка хита: настроение, семейство, три ноты, «по мотивам», «Выбрать» → конструктор с этим ароматом */
function hitCard(s, o = {}) {
  const c = D.cat(s.cat);
  const pic = o.pic !== false && site.hasImg('fam-' + c.slug) ? site.img('fam-' + c.slug, { cls: 'hit-img', alt: `${c.name} ароматы — ${s.name}` }) : `<span class="hit-img hit-blob">${blob(s.cat)}</span>`;
  return `<article class="hit scallop" data-c="${s.cat}">
  <div class="hit-pic">${pic}<span class="hit-mood">${s.mood}</span></div>
  <small>N°${String(s.n).padStart(2, '0')} · ${c.name}</small>
  <h3><a href="/aromaty/${s.slug}/">${scentHtml(s)}</a></h3>
  <ul class="hit-notes" aria-label="Ноты">${['Верх', 'Сердце', 'База'].map((k, i) => `<li><span>${k}</span>${esc(s.notes[i])}</li>`).join('')}</ul>
  <a class="btn btn-red" href="/podpiska/?scent=${s.n}" data-ev="add_to_cart" data-n="${s.n}">Выбрать</a>
</article>`;
}

/* Цена 2 × 3: аппарат по задаче × срок; клик ведёт в конструктор с этим выбором */
function priceTable(o = {}) {
  const scent = o.scent ? `&amp;scent=${o.scent}` : '';
  return `<div class="ptab scallop">
  <div class="ptab-row ptab-head"><span></span>${D.devices[0].plans.map((pl, i) => `<span>${months(pl.months)}${i === 2 ? ` <em class="tag">−${save6()}%</em>` : ''}</span>`).join('')}</div>
  ${D.devices.map(d => `<div class="ptab-row"><span class="ptab-dev"><b>${DEV[d.id].name}</b><small>${d.name} · до ${d.area} м²</small></span>${d.plans.map((pl, i) => `<a class="ptab-c${i === 2 ? ' best' : ''}" href="/podpiska/?dev=${d.id}&amp;term=${i}${scent}"><span class="m-term">${months(pl.months)}${i === 2 ? `, −${save6()}%` : ''}</span><b>${D.fmt(D.perMonth(pl))}</b><small>в месяц${pl.months > 1 ? ` · ${D.fmt(pl.total)} за ${pl.months} мес` : ''}</small></a>`).join('')}</div>`).join('')}
  <p class="ptab-note"><b>−${save6()}% при оплате за 6 месяцев.</b> Аппарат, масла, доставка, установка и сервис — уже в цене, без доплат.</p>
</div>`;
}

/* Финал страницы: два пути — собрать самому или попросить помочь */
function contact(p) {
  const C = D.contacts;
  return `<section class="sec contact">
  <h2 class="poster small"><span>Хочется</span><span><i>пахнуть</i></span><span>приятно?</span></h2>
  <div class="ct">
    <a class="btn btn-red" href="/podpiska/">Собрать подписку</a>
    <a class="btn btn-cream" href="${wa(p.h1 || 'Главная')}" target="_blank" rel="noopener" data-ev="wa_help" data-where="final">Помогите выбрать</a>
    <a class="ct-l" href="tel:${C.phoneRaw}">${C.phone}</a>
    <span class="ct-l">${C.hours}</span>
  </div>
</section>`;
}

module.exports = { init, layout, deviceArt, phead, faq, aromaCard, hitCard, priceTable, tags, blob, months, pm, contact, wa, scentName, scentHtml, shortNotes, aromas, count, save6, DEV, BLOB, CFG };
