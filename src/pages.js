/* Страницы HOSH: главная, конструктор, 2 аппарата, каталог и 32 страницы ароматов. */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const UI = require('./ui');

const HOME = ['Главная', ''];
const POWER = {
  1: ['деликатный', 'Он едва заметен и не утомляет — подходит для небольших помещений и мест, где люди проводят много времени: кабинетов, клиник, спален.'],
  2: ['средней интенсивности', 'Это универсальный вариант: заметен на входе и не тяжелеет в течение дня — для залов, офисов, бутиков и квартир.'],
  3: ['насыщенный', 'Он заметен сразу на входе и хорошо звучит в просторных помещениях, лаунжах и вечерней атмосфере. Интенсивность для него обычно ставят мягче.']
};
/* прилагательное семейства в ед. ч.: «отельный аромат» */
const ADJ = { fresh: 'свежий', floral: 'цветочный', gourmand: 'гурманский', hotel: 'отельный', spa: 'расслабляющий SPA-', perfume: 'парфюмерный' };
const WHO = ['Кофейни', 'Бутики', 'Салоны красоты', 'Отели', 'Фитнес', 'Клиники', 'Офисы', 'Шоурумы', 'Спа', 'Рестораны', 'Барбершопы', 'Лобби ЖК', 'Квартиры'];

function register(site) {
  const { add, img } = site;
  const from = D.fmt(D.minPerMonth());

  /* ── Главная ── */
  add({
    path: '', priority: '1.0', loader: true, bodyClass: 'home',
    title: 'HOSH — подписка на аромат: диффузор, масла и сервис в Астане',
    description: `Подписка на аромат HOSH: диффузор Nova 300 или Nova 1000 в аренду, 32 аромата, масла каждый месяц, сервис и гарантия. От ${from} в месяц, Астана.`,
    schema: [site.schema.website(), site.schema.business(D.contacts), site.schema.faq(D.faq)],
    body: `
<section class="hero">
  <span class="vert" aria-hidden="true">аромат · атмосфера · впечатление</span>
  <h1 class="poster"><span>Подписка</span><span>на <i>аромат</i></span></h1>
  <div class="card-wrap">
    <div class="hero-card scallop">
      ${UI.deviceArt()}
      <div class="hero-copy">
        <p>Диффузор в аренду, масла каждый месяц, сервис и гарантия — одной подпиской. Выберите аппарат, срок и аромат.</p>
        <a class="btn btn-red" href="/podpiska/">Собрать подписку</a>
        <span class="from">от <b>${from}</b> / мес</span>
      </div>
    </div>
    <svg class="sticker" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs><circle cx="60" cy="60" r="58" fill="var(--red)"/><text><textPath href="#circ">${D.trialDays} ДНЯ БЕСПЛАТНО · ${D.trialDays} ДНЯ БЕСПЛАТНО ·</textPath></text><text x="60" y="58" class="st-mid" text-anchor="middle">${D.trialDays}</text><text x="60" y="76" class="st-sub" text-anchor="middle">дня</text></svg>
  </div>
</section>
<div class="marquee" aria-hidden="true"><div class="mq">${[0, 1].map(() => ['Без покупки оборудования', 'Масла включены', 'Замена по графику', 'Обслуживание', 'Гарантия', 'Установка в день обращения'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

<section class="sec" id="how">
  <h2 class="h2">Как это <i>работает</i></h2>
  <ol class="how">
    <li class="scallop"><b>1</b><h3>Выберите аппарат</h3><p><a href="/nova-300/">Nova 300</a> для помещений до 300 м², <a href="/nova-1000/">Nova 1000</a> — до 1000 м².</p></li>
    <li class="scallop"><b>2</b><h3>Выберите срок</h3><p>1, 3 или 6 месяцев. Чем дольше, тем ниже цена в месяц.</p></li>
    <li class="scallop"><b>3</b><h3>Выберите аромат</h3><p><a href="/aromaty/">32 композиции</a>: от свежего цитруса до отельных signature.</p></li>
    <li class="scallop"><b>4</b><h3>Мы привезём</h3><p>Установим в день обращения и будем менять масла сами.</p></li>
  </ol>
</section>

<section class="sec">
  <h2 class="h2">Два <i>аппарата</i></h2>
  <div class="prods">${D.devices.map(d => `<a class="prod scallop" href="/${d.slug}/">${UI.deviceArt('prod-art')}<span class="prod-t"><b>${d.name}</b><small>до ${d.area} м² · ${d.specs[2][1]}</small><span>${d.lead}</span><em>от ${UI.pm(d)} / мес →</em></span></a>`).join('')}</div>
</section>

<section class="sec">
  <h2 class="h2">32 <i>аромата</i></h2>
  <div class="fams">${D.categories.map(c => `<a class="fam scallop" href="/aromaty/#${c.id}">${UI.blob(c.id)}<b>${c.name}</b><span>${c.mood}</span><small>${D.scents.filter(s => s.cat === c.id).length} ароматов →</small></a>`).join('')}</div>
  <p class="more"><a class="btn btn-cream" href="/aromaty/">Весь каталог</a></p>
</section>

<section class="sec stats-sec">
  <div class="stats"><div><b>32</b><span>аромата на выбор в каждой подписке</span></div><div><b>1</b><span>день от заявки до запуска диффузора</span></div><div><b>0 ₸</b><span>за оборудование: диффузор в аренду</span></div></div>
</section>

<section class="sec"><h2 class="h2">Для <i>кого</i></h2><div class="stickers">${WHO.map(w => `<span class="stk">${w}</span>`).join('')}</div></section>
${UI.faq(D.faq)}`
  });

  /* ── Конструктор ── */
  add({
    path: 'podpiska/', section: 'podpiska/', builder: true,
    title: 'Собрать подписку на аромат — аппарат, срок и аромат | HOSH',
    description: `Конструктор подписки HOSH: выберите диффузор Nova 300 или Nova 1000, срок 1, 3 или 6 месяцев и один из 32 ароматов. Цена сразу, оформление в WhatsApp.`,
    h1: 'Собрать подписку',
    breadcrumbs: [HOME, ['Собрать подписку', 'podpiska/']],
    get body() {
      return UI.phead(this, { title: '<span>Собрать</span><span><i>подписку</i></span>', lead: 'Три шага: аппарат, срок и аромат. Добавьте в корзину и оформите заказ в WhatsApp — менеджер подтвердит время установки.' }) + `
<section class="sec shop" id="shop">
  <div class="builder">
    <div class="steps">
      <div class="step"><h2 class="st-h"><span>01</span>Аппарат</h2><div class="devs" id="b-dev"></div>
        <div class="qty"><span>Количество</span><button type="button" id="q-minus" aria-label="Меньше">−</button><output id="q-val">1</output><button type="button" id="q-plus" aria-label="Больше">+</button></div></div>
      <div class="step"><h2 class="st-h"><span>02</span>Срок</h2><div class="terms" id="b-term"></div></div>
      <div class="step" id="scents"><h2 class="st-h"><span>03</span>Аромат</h2><div class="cats" id="b-cats"></div><div class="sc-grid" id="b-scents"></div></div>
    </div>
    <aside class="summary scallop" aria-live="polite">
      <span class="sum-k">Ваша подписка</span>
      <div class="sum-dev" id="s-dev">Nova 300 × 1</div>
      <dl class="sum-dl"><div><dt>Срок</dt><dd id="s-term">6 месяцев</dd></div><div><dt>Аромат</dt><dd id="s-scent">—</dd></div><div><dt>В месяц</dt><dd id="s-pm">—</dd></div><div><dt>Экономия</dt><dd id="s-save">—</dd></div></dl>
      <div class="sum-total"><span>Итого за период</span><b id="s-total">—</b></div>
      <button class="btn btn-red wide" id="add" type="button">Добавить в корзину</button>
      <span class="sum-note">В подписку входят диффузор в аренду, масла, их замена, обслуживание и гарантия.</span>
    </aside>
  </div>
</section>
<section class="sec"><div class="prose scallop">
  <h2>Как выбрать</h2>
  <p><b>Аппарат.</b> Nova 300 рассчитан на помещение до 300 м² — кофейню, бутик, офис, квартиру. Nova 1000 — на зал до 1000 м² и управляется со смартфона. Если помещение разделено стенами, удобнее взять несколько Nova 300.</p>
  <p><b>Срок.</b> На 6 месяцев цена в месяц ниже всего: ${D.fmt(33333)} за Nova 300 вместо ${D.fmt(45000)} при помесячной подписке.</p>
  <p><b>Аромат.</b> Если сомневаетесь, начните с универсальных: White Tea, Свежий цитрус, Intercontinental Hotel. Все 32 аромата с нотами — в <a href="/aromaty/">каталоге</a>.</p>
</div></section>`;
    }
  });

  /* ── Аппараты ── */
  D.devices.forEach((d, di) => {
    const p = `${d.slug}/`;
    const other = D.devices[1 - di];
    const dfaq = [
      [`На какую площадь рассчитан ${d.name}?`, `До ${d.area} м² открытого помещения с обычными потолками. Для высоких потолков или нескольких комнат нужно больше аппаратов.`],
      ['Что входит в подписку?', D.included.join(', ') + '.'],
      ['Можно ли купить аппарат?', 'HOSH работает только по подписке: аппарат выдаётся в аренду, а масла и сервис входят в цену.'],
      [`Как часто меняют масло?`, `Флакон ${d.volume} мл, расход около ${String(d.flow).replace('.', ',')} мл в час работы. Масло меняем по графику, который зависит от расписания.`]
    ];
    add({
      path: p, section: p,
      title: `${d.name} — диффузор для ароматизации до ${d.area} м² по подписке`,
      description: `${d.name}: металлический диффузор для помещений до ${d.area} м². Подписка от ${UI.pm(d)} в месяц: аппарат, 32 аромата, масла, сервис и гарантия. HOSH, Астана.`,
      h1: d.name,
      breadcrumbs: [HOME, [d.name, p]],
      schema: [site.schema.product({ name: `${d.name} — подписка на аромат`, description: d.lead, low: d.plans[0].total, high: d.plans[2].total, count: 3 }, p), site.schema.faq(dfaq)],
      get body() {
        return `<section class="phead">${site.crumbs(this.breadcrumbs)}</section>
<section class="pp">
  <div class="pp-card scallop">
    ${UI.deviceArt('pp-art')}
    <div class="pp-copy">
      <span class="sum-k">до ${d.area} м²</span>
      <h1 class="pp-h">${d.name}</h1>
      <p>${d.lead}</p>
      <div class="terms terms-static">${d.plans.map((pl, i) => `<a class="tm" href="/podpiska/?dev=${d.id}&amp;term=${i}">${i === 2 ? '<span class="tag">Выгоднее</span>' : ''}<b>${UI.months(pl.months)}</b><span>${D.fmt(D.perMonth(pl))} / мес</span><small>${D.fmt(pl.total)} за период</small></a>`).join('')}</div>
      <a class="btn btn-red" href="/podpiska/?dev=${d.id}">Собрать подписку на ${d.name}</a>
    </div>
  </div>
</section>
<section class="sec">
  <h2 class="h2">Характе<i>ристики</i></h2>
  <div class="spec-grid">
    <dl class="specs2 scallop">${d.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <div class="fits scallop"><span class="sum-k">Где ставят</span><ul>${d.fits.map(f => `<li>${f[0].toUpperCase() + f.slice(1)}</li>`).join('')}</ul><span class="sum-k">В подписке</span><ul>${D.included.map(t => `<li>${t}</li>`).join('')}</ul></div>
  </div>
</section>
<section class="sec"><div class="prose scallop"><h2>Нужна другая площадь?</h2><p>${other.name} рассчитан на помещение до ${other.area} м², подписка от ${UI.pm(other)} в месяц. <a href="/${other.slug}/">Смотреть ${other.name}</a>.</p></div></section>
${UI.faq(dfaq, `Вопросы о ${d.name}`)}`;
      }
    });
  });

  /* ── Каталог ── */
  add({
    path: 'aromaty/', section: 'aromaty/',
    title: 'Ароматы для диффузора — 32 аромата для дома и бизнеса | HOSH',
    description: 'Каталог HOSH: 32 аромата для диффузора — свежие, цветочные, гурманские, отельные, SPA и парфюмерные. Ноты, интенсивность, где подходит. Любой — в подписке.',
    h1: 'Ароматы',
    breadcrumbs: [HOME, ['Ароматы', 'aromaty/']],
    schema: [site.schema.itemList(D.scents.map(s => [s.name, `aromaty/${s.slug}/`]))],
    get body() {
      return UI.phead(this, { title: '<span>32</span><span><i>аромата</i></span>', lead: 'Любой аромат входит в подписку без доплаты. Нажмите на карточку — там ноты, интенсивность и где он звучит лучше всего.' }) + `
<section class="sec sec-t">
  <div class="cats cats-lg" id="cat-filter"><button type="button" data-c="all" aria-pressed="true">Все 32</button>${D.categories.map(c => `<button type="button" data-c="${c.id}" aria-pressed="false">${c.name}</button>`).join('')}</div>
  ${D.categories.map(c => `<div class="fam-block" id="${c.id}" data-c="${c.id}"><h2 class="fam-h">${c.name} <small>${c.mood}</small></h2><div class="ars">${D.scents.filter(s => s.cat === c.id).map(UI.aromaCard).join('')}</div></div>`).join('')}
</section>`;
    }
  });

  D.scents.forEach(s => {
    const c = D.cat(s.cat);
    const p = `aromaty/${s.slug}/`;
    const [pw, pwText] = POWER[s.power];
    const similar = D.scents.filter(x => x.cat === s.cat && x !== s).slice(0, 4);
    const desc = `${s.name}: ${s.notes.join(', ')}. ${ADJ[s.cat][0].toUpperCase() + ADJ[s.cat].slice(1)}${s.cat === 'spa' ? '' : ' '}аромат для: ${s.spaces.slice(0, 2).join(', ')}. В подписке HOSH от ${from} в месяц.`;
    add({
      path: p, section: 'aromaty/',
      title: `Аромат ${s.name} для диффузора — подписка HOSH`,
      description: desc.length > 165 ? desc.slice(0, desc.lastIndexOf(' ', 162)) + '…' : desc,
      h1: `Аромат ${s.name}`,
      breadcrumbs: [HOME, ['Ароматы', 'aromaty/'], [s.name, p]],
      get body() {
        return `<section class="phead">${site.crumbs(this.breadcrumbs)}</section>
<section class="pp">
  <div class="pp-card scallop">
    <div class="ap-visual">${site.hasImg('fam-' + c.slug) ? img('fam-' + c.slug, { cls: 'ap-img', alt: `${c.name} ароматы` }) : UI.blob(s.cat).replace('class="blob"', 'class="blob blob-xl"')}<span class="ap-n">N°${String(s.n).padStart(2, '0')}</span></div>
    <div class="pp-copy">
      <span class="sum-k">${c.name} · ${pw}</span>
      <h1 class="pp-h">${esc(s.name)}</h1>
      <p>${esc(s.desc)}</p>
      <dl class="pyr">${['Верхние ноты', 'Сердце', 'База'].map((k, i) => `<div><dt>${k}</dt><dd>${esc(s.notes[i])}</dd></div>`).join('')}</dl>
      <a class="btn btn-red" href="/podpiska/?scent=${s.n}">Выбрать в подписку</a>
      <span class="from">аромат входит в подписку от <b>${from}</b> / мес</span>
    </div>
  </div>
</section>
<section class="sec"><div class="prose scallop">
  <h2>Как звучит ${esc(s.name)}</h2>
  <p>${esc(s.name)} — ${ADJ[s.cat]}${s.cat === 'spa' ? '' : ' '}аромат из коллекции HOSH. Композиция раскрывается в три этапа: сначала вы чувствуете ${esc(s.notes[0])}, затем сердце — ${esc(s.notes[1])}, а в шлейфе остаются ${esc(s.notes[2])}. Настроение семейства — ${c.mood}.</p>
  <p>Это ${pw} аромат. ${pwText}</p>
  <h2>Где подходит</h2>
  <p>Чаще всего ${esc(s.name)} выбирают для таких пространств: ${esc(s.spaces.join(', '))}. Для помещения до 300 м² достаточно <a href="/nova-300/">Nova 300</a>, для зала до 1000 м² — <a href="/nova-1000/">Nova 1000</a>.</p>
</div></section>
<section class="sec"><h2 class="h2">Похожие <i>ароматы</i></h2><div class="ars">${similar.map(UI.aromaCard).join('')}</div></section>`;
      }
    });
  });

  /* ── Доставка и оплата ── */
  const dFaq = [['Сколько стоит доставка и установка?', 'Доставка и установка по Астане входят в подписку.'], ['Как быстро привезёте?', 'Обычно в день обращения: менеджер согласует время, специалист привозит и запускает диффузор.'], ['Как платить?', 'По официальному договору с юрлицом или ИП за выбранный период подписки.'], ['Можно ли продлить подписку?', 'Да. Перед окончанием срока менеджер предложит продлить подписку или сменить аромат.']];
  add({
    path: 'dostavka-i-oplata/', section: 'dostavka-i-oplata/',
    title: 'Доставка, установка и оплата подписки на аромат — HOSH Астана',
    description: 'Как HOSH доставляет и устанавливает диффузор в Астане, как заключается договор и оплачивается подписка, когда меняют масло и как продлить подписку.',
    h1: 'Доставка и оплата',
    breadcrumbs: [HOME, ['Доставка и оплата', 'dostavka-i-oplata/']],
    schema: [site.schema.faq(dFaq)],
    get body() {
      return UI.phead(this, { title: '<span>Доставка</span><span>и <i>оплата</i></span>', lead: 'Привозим, ставим, запускаем — обычно в день обращения. Дальше масла меняем сами.' }) + `
<section class="sec sec-t"><ol class="how">
  <li class="scallop"><b>1</b><h2 class="how-h">Заказ</h2><p>Собираете подписку на сайте и отправляете заказ в WhatsApp.</p></li>
  <li class="scallop"><b>2</b><h2 class="how-h">Договор</h2><p>Официальный договор с юрлицом или ИП на 1, 3 или 6 месяцев.</p></li>
  <li class="scallop"><b>3</b><h2 class="how-h">Установка</h2><p>Специалист привозит диффузор, ставит рядом с розеткой и настраивает интенсивность.</p></li>
  <li class="scallop"><b>4</b><h2 class="how-h">Сервис</h2><p>Масла меняем по графику, при поломке заменяем аппарат.</p></li>
</ol></section>
<section class="sec"><div class="prose scallop"><h2>Что нужно от вас</h2><p>Розетка рядом с местом установки и полка, стойка или стена, куда можно поставить аппарат. Мы подскажем лучшее место: ближе к проходу и движению воздуха, а не в дальнем углу.</p><h2>Где работаем</h2><p>Доставляем и обслуживаем подписки по всей Астане. Офис: ${D.contacts.address}.</p></div></section>
${UI.faq(dFaq)}`;
    }
  });

  /* ── Вопросы ── */
  const allFaq = [...D.faq, ...dFaq.slice(0, 2), ['Можно ли сменить аромат?', 'Да, при следующей замене масла. Все 32 аромата входят в подписку без доплаты.'], ['Подходит ли для квартиры?', 'Да. Nova 300 работает тише 35 дБ и рассчитан на площадь до 300 м².']];
  add({
    path: 'voprosy/', section: 'voprosy/',
    title: 'Вопросы о подписке на аромат HOSH — ответы',
    description: 'Ответы на частые вопросы о подписке HOSH: безопасность ароматов, аренда диффузора, сроки установки, договор, смена аромата и обслуживание.',
    h1: 'Вопросы',
    breadcrumbs: [HOME, ['Вопросы', 'voprosy/']],
    schema: [site.schema.faq(allFaq)],
    get body() { return UI.phead(this, { title: '<span><i>Вопросы</i></span>', lead: 'Всё, что спрашивают перед первой подпиской.' }) + UI.faq(allFaq, 'Частые вопросы'); }
  });

  /* ── Контакты, служебные ── */
  const C = D.contacts;
  add({
    path: 'kontakty/', section: 'kontakty/',
    title: 'Контакты HOSH — подписка на аромат в Астане',
    description: `Контакты HOSH в Астане: ${C.phone}, WhatsApp, ${C.street}. ${C.hours}. Оформление подписки на аромат и установка диффузора.`,
    h1: 'Контакты',
    breadcrumbs: [HOME, ['Контакты', 'kontakty/']],
    schema: [site.schema.business(C)],
    get body() {
      return UI.phead(this, { title: '<span><i>Контакты</i></span>', lead: 'Пишите в WhatsApp или звоните — поможем выбрать аппарат и аромат.' }) + `
<section class="sec sec-t"><div class="fams">
  <a class="fam scallop" href="tel:${C.phoneRaw}"><b>Телефон</b><span>${C.phone}</span></a>
  <a class="fam scallop" href="${D.waLink('Здравствуйте! Хочу подписку HOSH.')}" target="_blank" rel="noopener"><b>WhatsApp</b><span>Написать</span></a>
  <a class="fam scallop" href="${C.map2gis}" target="_blank" rel="noopener"><b>Офис</b><span>${C.address}</span></a>
  <div class="fam scallop"><b>Время работы</b><span>${C.hours}</span></div>
</div></section>
<section class="sec"><div class="prose scallop"><p>HOSH — магазин подписок на аромат в Астане. Вы выбираете аппарат, срок и один из 32 ароматов, а мы привозим диффузор, запускаем его и дальше сами меняем масла. Заказать можно через <a href="/podpiska/">конструктор</a> или написать нам напрямую — менеджер подберёт вариант под ваше помещение и согласует время установки.</p><p>Перед установкой расскажите, какое у вас помещение и сколько в нём зон: для квартиры или кофейни хватит одного Nova 300, для зала или лобби лучше Nova 1000. Если не уверены в аромате, начните с универсальных композиций — White Tea, Свежий цитрус или Intercontinental Hotel, — а при следующей замене масла его можно сменить.</p></div></section>`;
    }
  });
  add({
    path: 'politika-konfidencialnosti/', noindex: true, noCta: true,
    title: 'Политика конфиденциальности — HOSH',
    description: 'Политика обработки персональных данных HOSH: что хранится в корзине браузера и что передаётся в WhatsApp при оформлении заказа.',
    h1: 'Политика конфиденциальности',
    breadcrumbs: [HOME, ['Политика', 'politika-konfidencialnosti/']],
    get body() { return UI.phead(this, {}) + `<section class="sec"><div class="prose scallop"><p>Корзина хранится только в вашем браузере (localStorage) и не передаётся на сервер. При оформлении заказа имя, адрес объекта и состав корзины передаются в WhatsApp сообщением, которое вы отправляете сами. Мы используем эти данные только для связи, договора и установки и не передаём их третьим лицам, кроме случаев, предусмотренных законодательством Республики Казахстан.</p></div></section>`; }
  });
  add({
    path: '404.html', noindex: true, noCta: true,
    title: 'Страница не найдена — HOSH', description: 'Такой страницы нет. Вернитесь в магазин HOSH.',
    body: `<section class="phead nf"><h1 class="poster small"><span>404</span><span><i>не пахнет</i></span></h1><p class="phead-lead">Страница не найдена.</p><a class="btn btn-red" href="/">В магазин</a></section>`
  });
}

module.exports = { register };
