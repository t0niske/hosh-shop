/* Страницы HOSH: главная, конструктор с оформлением, 2 аппарата, «для дома», «как в отеле»,
   подборки «аромат для …», каталог и страницы ароматов, доставка, вопросы, контакты. */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const UI = require('./ui');
const NICHES = require('./niches');
const TX = require('./texts');
const { CFG } = UI;

const HOME = ['Главная', ''];
const POWER = {
  1: ['деликатный', 'Он едва заметен и не утомляет — подходит для спальни, детской, кабинета и мест, где люди проводят много времени.'],
  2: ['средней интенсивности', 'Это универсальный вариант: заметен, когда входишь, и не тяжелеет к вечеру — для гостиной, прихожей, зала, офиса или бутика.'],
  3: ['насыщенный', 'Он заметен сразу и хорошо звучит в просторных комнатах, лаунжах и по вечерам. Интенсивность для него обычно ставят мягче.']
};
/* прилагательное семейства в ед. ч.: «отельный аромат» */
const ADJ = { fresh: 'свежий', floral: 'цветочный', gourmand: 'гурманский', hotel: 'отельный', spa: 'расслабляющий SPA-', perfume: 'парфюмерный' };
const WHO = ['Кофейни', 'Бутики', 'Салоны красоты', 'Отели', 'Фитнес', 'Клиники', 'Офисы', 'Шоурумы', 'Спа', 'Рестораны', 'Барбершопы', 'Лобби ЖК', 'Квартиры'];
const HOTEL6 = () => [26, 25, 33, 17, 8, 10, 28].map(D.byN).filter(Boolean).slice(0, 6);

function register(site) {
  const { add, img } = site;
  const N = UI.count();
  const [n300, n1000] = D.devices;
  const from = D.fmt(D.minPerMonth());
  const monthly = D.fmt(D.perMonth(n300.plans[0]));
  const trial = CFG.trial.text;
  const hits = CFG.hits.map(D.byN).filter(Boolean);
  const devProduct = d => site.schema.product({ name: `${UI.DEV[d.id].long} ${d.name} — подписка на аромат`, description: TX.lead[d.id], low: d.plans[0].total, high: d.plans[2].total, count: 3 }, d.slug + '/');

  /* ── Главная ── */
  add({
    path: '', priority: '1.0', loader: true, bodyClass: 'home',
    title: 'Аромат для дома и бизнеса по подписке — оформите онлайн за 2 минуты',
    description: `Диффузор, масла и сервис одной подпиской, без звонков: от ${from} в месяц, ${UI.aromas()}, ${trial} и ${CFG.swap}. HOSH, Астана.`,
    schema: [site.schema.website(), site.schema.business(D.contacts), site.schema.faq(TX.faq), ...D.devices.map(devProduct)],
    h1: 'Главная',
    body: `
<section class="hero">
  <span class="vert" aria-hidden="true">аромат · дом</span>
  <h1 class="poster hero-h"><span>Аромат для дома</span><span>и <i>бизнеса</i></span><span>по подписке</span></h1>
  <div class="card-wrap">
    <div class="hero-card scallop">
      <div class="hero-pic">${site.hasImg('home-living') ? img('home-living', { cls: 'hero-img', eager: true }) : UI.deviceArt('dev-art', { eager: true })}</div>
      <div class="hero-copy">
        <p class="hero-sub">Диффузор, масла и сервис — одной подпиской, без звонков</p>
        <p class="hero-price">от <b>${from}</b> в месяц<small>при оплате за 6 месяцев · ${monthly} помесячно</small></p>
        <div class="hero-btns"><a class="btn btn-red" href="/podpiska/">Собрать подписку</a><a class="btn btn-ink" href="/aromaty/">Ароматы</a></div>
        <p class="hero-note">${trial} · ${CFG.swap}</p>
        <p class="hero-hits"><span>Хиты:</span>${CFG.heroHits.map(D.byN).filter(Boolean).map(s => `<a class="chip" href="/aromaty/${s.slug}/">${esc(s.name)}</a>`).join('')}<a class="chip" href="/aromaty/">Ещё</a></p>
      </div>
    </div>
    <svg class="sticker" data-scroll-x viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs><circle cx="60" cy="60" r="58" fill="var(--red)"/><text><textPath href="#circ">${CFG.trial.days} ДНЯ БЕСПЛАТНО · ${CFG.trial.days} ДНЯ БЕСПЛАТНО ·</textPath></text><text x="60" y="58" class="st-mid" text-anchor="middle">${CFG.trial.days}</text><text x="60" y="76" class="st-sub" text-anchor="middle">дня</text></svg>
  </div>
</section>
<div class="marquee" data-scroll-x aria-hidden="true"><div class="mq">${[0, 1].map(() => ['Без покупки оборудования', 'Масла включены', 'Замена по графику', 'Доставка и установка', 'Гарантия', 'Смена аромата в любой момент'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

<section class="sec" id="hits">
  <h2 class="h2">Хиты <i>«как в …»</i></h2>
  <p class="sec-lead">Понюхать через экран нельзя, поэтому у каждого аромата есть настроение, семейство и три ноты. Не угадали — поменяем бесплатно.</p>
  <div class="hits">${hits.map(UI.hitCard).join('')}</div>
  <p class="more"><a class="btn btn-cream" href="/aromaty/">Все ${UI.aromas()}</a></p>
</section>

<section class="sec" id="how">
  <h2 class="h2">Как это <i>работает</i></h2>
  <ol class="how">
    <li class="scallop"><b>1</b><h3>Аппарат</h3><p><a href="/nova-300/">Для квартиры</a> — до 300 м², <a href="/nova-1000/">для большого дома и бизнеса</a> — до 1000 м².</p></li>
    <li class="scallop"><b>2</b><h3>Срок</h3><p>1, 3 или 6 месяцев. За полгода выходит на ${UI.save6()}% дешевле в месяц.</p></li>
    <li class="scallop"><b>3</b><h3>Аромат</h3><p><a href="/aromaty/">${UI.aromas()}</a> с метками: от свежего цитруса до запаха лобби пятизвёздочного отеля.</p></li>
    <li class="scallop"><b>4</b><h3>Оформление</h3><p>Имя, телефон и адрес — без регистрации. Привезём, включим и дальше сами меняем масло.</p></li>
  </ol>
</section>

<section class="sec">
  <h2 class="h2">Два <i>аппарата</i></h2>
  <div class="prods">${D.devices.map(d => `<a class="prod scallop" href="/${d.slug}/">${UI.deviceArt('prod-art')}<span class="prod-t"><b>${UI.DEV[d.id].name}</b><small>${d.name} · до ${d.area} м² · тише 35 дБ</small><span>${TX.lead[d.id]}</span><em>от ${UI.pm(d)} / мес →</em></span></a>`).join('')}</div>
</section>

<section class="sec" id="ceny">
  <h2 class="h2">Цена <i>подписки</i></h2>
  ${UI.priceTable()}
</section>

<section class="sec">
  <h2 class="h2">${N} <i>${UI.aromas().split(' ')[1]}</i></h2>
  <div class="fams">${D.categories.map(c => `<a class="fam scallop" href="/aromaty/#${c.id}">${UI.blob(c.id)}<b>${c.name}</b><span>${c.mood}</span><small>${UI.aromas(D.scents.filter(s => s.cat === c.id).length)} →</small></a>`).join('')}</div>
  <p class="more"><a class="btn btn-cream" href="/kak-v-otele/">Аромат как в отеле</a></p>
</section>

<section class="sec stats-sec">
  <div class="stats"><div><b>${N}</b><span>${UI.aromas().split(' ')[1]} на выбор в каждой подписке</span></div><div><b>2</b><span>минуты на оформление: без звонков и регистрации</span></div><div><b>0 ₸</b><span>за аппарат: он едет к вам вместе с подпиской</span></div></div>
</section>

<section class="sec"><h2 class="h2">Для <i>кого</i></h2><div class="stickers"><a class="stk" href="/diffuzor-dlya-doma/">Дом</a>${NICHES.map(n => `<a class="stk" href="/aromat-dlya/${n.slug}/">${n.name}</a>`).join('')}${WHO.filter(w => !/Кофейни|Бутики|Салоны|Отели|Фитнес|Клиники|Офисы|Рестораны|Барбершопы|Квартиры/.test(w)).map(w => `<span class="stk">${w}</span>`).join('')}</div></section>

<section class="sec"><div class="prose scallop try">
  <h2>Попробуйте ${CFG.trial.days} дня бесплатно</h2>
  <p>Понять, ваш ли это аромат, проще всего у себя дома или в своём зале. Привезём аппарат, включим — и первые ${CFG.trial.days} дня вы ничего не платите за подписку. ${CFG.rules.refuse}</p>
  <p>Дальше аромат можно менять когда угодно. ${CFG.rules.early} Подробно — на странице <a href="/dostavka-i-oplata/">«Доставка и оплата»</a>.</p>
</div></section>
${UI.faq(TX.faq)}`
  });

  /* ── Конструктор и оформление на одной странице ── */
  const help = (where, label = 'Помогите выбрать') => `<a class="help" href="${UI.wa('Собрать подписку', `Помогите выбрать: ${where.toLowerCase()}.`)}" target="_blank" rel="noopener" data-ev="wa_help" data-where="${where}">${label} в WhatsApp</a>`;
  const scentOpt = s => `<label class="sc scallop" data-c="${s.cat}" data-m="${s.mood}"><input type="radio" name="scent" value="${s.n}">${UI.blob(s.cat)}<small>N°${String(s.n).padStart(2, '0')} · ${D.cat(s.cat).short}</small><b>${UI.scentHtml(s)}</b>${UI.tags(s, { notes: false })}<span class="sc-nt">${UI.shortNotes(s).map(esc).join(' · ')}</span></label>`;
  const C = CFG.checkout;
  add({
    path: 'podpiska/', section: 'podpiska/', builder: true,
    title: 'Собрать подписку на аромат: аппарат, срок, аромат | HOSH',
    description: `Соберите подписку HOSH на одной странице: диффузор для квартиры или для бизнеса, срок 1, 3 или 6 месяцев и один из ${UI.aromas()}. Оплата Kaspi, картой или по счёту.`,
    h1: 'Собрать подписку',
    breadcrumbs: [HOME, ['Собрать подписку', 'podpiska/']],
    schema: D.devices.map(devProduct),
    get body() {
      return UI.phead(this, { title: '<span>Собрать</span><span><i>подписку</i></span>', lead: 'Аппарат, срок, аромат и доставка — на одной странице, за пару минут. Без регистрации и звонков.' }) + `
<section class="sec shop" id="shop">
  <form class="builder" id="order" novalidate>
    <div class="steps">
      <fieldset class="step" id="st-dev"><legend class="st-h"><span>01</span>Аппарат</legend>
        <div class="devs">${D.devices.map((d, i) => `<label class="dv"><input type="radio" name="dev" value="${d.id}"${i ? '' : ' checked'}><span class="dv-t"><b>${UI.DEV[d.id].name}</b><small>${d.name} · до ${d.area} м² · тише 35 дБ</small></span>${UI.deviceArt('dv-img')}<span class="pr">от <em>${D.fmt(D.perMonth(d.plans[2]))}</em> / мес</span></label>`).join('')}</div>
        <div class="qty"><span>Сколько аппаратов</span><button type="button" id="q-minus" aria-label="Меньше">−</button><output id="q-val">1</output><button type="button" id="q-plus" aria-label="Больше">+</button></div>
        ${help('Аппарат', 'Не знаю, какой — помогите выбрать')}
      </fieldset>
      <fieldset class="step" id="st-term"><legend class="st-h"><span>02</span>Срок</legend>
        <div class="terms">${n300.plans.map((p, i) => `<label class="tm"><input type="radio" name="term" value="${i}"${i === 2 ? ' checked' : ''}>${i === 2 ? `<span class="tag">Выгоднее на ${UI.save6()}%</span>` : ''}<b>${UI.months(p.months)}</b><span><em data-pm="${i}">${D.fmt(D.perMonth(p))}</em> / мес</span><small data-total="${i}">${D.fmt(p.total)} за период</small></label>`).join('')}</div>
        ${help('Срок')}
      </fieldset>
      <fieldset class="step" id="st-scent"><legend class="st-h"><span>03</span>Аромат</legend>
        <div class="filters">
          <div class="cats" id="f-mood" data-scroll-x role="group" aria-label="Настроение"><button type="button" data-m="all" aria-pressed="true">Любое настроение</button>${CFG.moods.map(m => `<button type="button" data-m="${m}" aria-pressed="false">${m}</button>`).join('')}</div>
          <div class="cats" id="f-cat" data-scroll-x role="group" aria-label="Семейство"><button type="button" data-c="all" aria-pressed="true">Все семейства</button>${D.categories.map(c => `<button type="button" data-c="${c.id}" aria-pressed="false">${c.short}</button>`).join('')}</div>
        </div>
        <div class="sc-grid" id="b-scents">${D.scents.map(scentOpt).join('')}</div>
        ${help('Аромат', 'Не знаю — помогите выбрать')}
      </fieldset>
      <fieldset class="step step-form" id="st-form"><legend class="st-h"><span>04</span>Оформление</legend>
        <div class="recap" aria-hidden="true"><b id="r-line">—</b><span id="r-sum">—</span></div>
        <div class="fields">
          <label class="fl"><span>Имя</span><input name="name" id="o-name" autocomplete="name" required placeholder="Как к вам обращаться"></label>
          <label class="fl"><span>Телефон с WhatsApp</span><input name="phone" id="o-phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 (7__) ___-__-__"></label>
          <label class="fl fl-wide"><span>Адрес доставки</span><input name="address" id="o-addr" autocomplete="street-address" required placeholder="Улица, дом, квартира или офис"></label>
          <label class="fl"><span>День доставки</span><select name="day" id="o-day" required><option value="">Выберите день</option></select></label>
          <div class="fl fl-wide" role="radiogroup" aria-labelledby="pay-l"><span id="pay-l">Способ оплаты</span><div class="pays">${C.payments.map(p => `<label class="pay"><input type="radio" name="pay" value="${p.id}" required><b>${p.name}</b><small>${p.hint}</small></label>`).join('')}</div></div>
          <label class="fl fl-wide" id="iin-row" hidden><span>ИИН или БИН для счёта</span><input name="iin" id="o-iin" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="12 цифр"></label>
          <label class="ck fl-wide"><input type="checkbox" name="agree" id="o-agree" required><span>Согласен на обработку данных по <a href="/politika-konfidencialnosti/">политике конфиденциальности</a></span></label>
        </div>
        <p class="err" id="o-err" role="alert" hidden></p>
        <button class="btn btn-red wide" type="submit" id="submit">${C.online ? 'Оплатить' : 'Оформить'}</button>
        <p class="sum-note sum-note-c">${C.online ? C.onlineNote : C.offlineNote}. ${trial}: ${CFG.rules.refuse.charAt(0).toLowerCase() + CFG.rules.refuse.slice(1)}</p>
        ${help('Оформление', 'Остались вопросы — напишите')}
        <div class="done" id="done" hidden tabindex="-1">
          <b>Заказ собран ✦</b>
          <p>Отправьте сообщение в WhatsApp — оно уже заполнено. Подтвердим заказ и время доставки и пришлём ссылку на оплату Kaspi.</p>
          <a class="btn btn-red" id="done-wa" href="#" target="_blank" rel="noopener">Открыть WhatsApp ещё раз</a>
        </div>
      </fieldset>
    </div>
    <aside class="summary scallop" aria-live="polite">
      <span class="sum-k">Ваша подписка</span>
      <div class="sum-dev" id="s-dev">—</div>
      <dl class="sum-dl"><div><dt>Аппарат</dt><dd id="s-model">—</dd></div><div><dt>Срок</dt><dd id="s-term">—</dd></div><div><dt>Аромат</dt><dd id="s-scent">—</dd></div><div><dt>В месяц</dt><dd id="s-pm">—</dd></div><div><dt>Экономия</dt><dd id="s-save">—</dd></div><div><dt>Доставка и установка</dt><dd>0 ₸</dd></div></dl>
      <div class="sum-total"><span>Итого за период</span><b id="s-total">—</b></div>
      <button class="btn btn-red wide" type="submit">${C.online ? 'Оплатить' : 'Оформить'}</button>
      <span class="sum-note">В подписке: ${TX.included.join(', ').toLowerCase()}. ${trial}.</span>
    </aside>
  </form>
</section>
<div class="sbar" id="sbar"><span class="sb-t"><b id="sb-pm">—</b><small id="sb-line">—</small></span><a class="btn btn-red" href="#st-form" id="sb-go">Оформить</a></div>
<section class="sec"><div class="prose scallop">
  <h2>Как выбрать</h2>
  <p><b>Аппарат.</b> «Для квартиры» — это Nova 300: до 300 м², тише 35 дБ, его хватает на квартиру, кабинет, студию или небольшой магазин. «Для большого дома и бизнеса» — Nova 1000: до 1000 м², больше флакон и настройка со смартфона. Если комнаты разделены стенами, удобнее два Nova 300.</p>
  <p><b>Срок.</b> За 6 месяцев цена в месяц ниже всего: ${D.fmt(D.perMonth(n300.plans[2]))} вместо ${monthly} при помесячной подписке.</p>
  <p><b>Аромат.</b> Сомневаетесь — начните с универсальных: White Tea, Свежий цитрус или аромат по мотивам The Ritz-Carlton. Поменять можно в любой момент. Все ароматы с нотами — в <a href="/aromaty/">каталоге</a>.</p>
</div></section>`;
    }
  });

  /* ── Аппараты ── */
  D.devices.forEach((d, di) => {
    const p = `${d.slug}/`;
    const other = D.devices[1 - di];
    const dv = UI.DEV[d.id];
    const hours = Math.round(d.volume / d.flow);
    const dfaq = [
      [`Какую площадь закроет ${d.name}?`, `До ${d.area} м² открытого помещения с обычными потолками. Для высоких потолков или нескольких комнат за стенами нужно больше аппаратов.`],
      ['Он шумит?', 'Тише 35 дБ — это уровень шёпота. Масло распыляется короткими циклами по расписанию, ночью можно поставить паузу.'],
      ['На сколько хватает флакона?', `Флакон ${d.volume} мл, расход около ${String(d.flow).replace('.', ',')} мл в час работы — примерно ${hours} часов распыления. Новое масло привозим сами по графику.`],
      ['Что в коробке?', `Сам ${d.name}, блок питания и флакон выбранного аромата. Привозим и настраиваем сами — вам нужна только розетка рядом.`],
      ['Можно ли купить аппарат?', 'HOSH работает только по подписке: аппарат приезжает на её срок, а масла и сервис уже в цене. Сломается — заменим.']
    ];
    add({
      path: p, section: p,
      title: `${dv.long} ${d.name} — от ${UI.pm(d)}/мес`,
      description: `${dv.long} ${d.name}: до ${d.area} м², тише 35 дБ, металлический корпус. Подписка от ${UI.pm(d)} в месяц: аппарат, ${UI.aromas()}, масла, доставка и сервис.`,
      h1: `${dv.long} — ${d.name}`,
      breadcrumbs: [HOME, [d.name, p]],
      schema: [devProduct(d), site.schema.faq(dfaq)],
      get body() {
        return `<section class="phead">${site.crumbs(this.breadcrumbs)}</section>
<section class="pp">
  <div class="pp-card scallop">
    ${UI.deviceArt('pp-art', { eager: true })}
    <div class="pp-copy">
      <span class="sum-k">до ${d.area} м² · тише 35 дБ</span>
      <h1 class="pp-h"><small>${dv.long} —</small> ${d.name}</h1>
      <p>${TX.lead[d.id]}</p>
      <div class="terms terms-static">${d.plans.map((pl, i) => `<a class="tm" href="/podpiska/?dev=${d.id}&amp;term=${i}">${i === 2 ? `<span class="tag">−${UI.save6(d)}%</span>` : ''}<b>${UI.months(pl.months)}</b><span>${D.fmt(D.perMonth(pl))} / мес</span><small>${D.fmt(pl.total)} за период</small></a>`).join('')}</div>
      <a class="btn btn-red" href="/podpiska/?dev=${d.id}">Собрать подписку</a>
    </div>
  </div>
</section>
${di === 0 && site.hasImg('home-living') ? `<section class="sec"><div class="photo-row"><div class="photo-card scallop">${img('home-living', { cls: 'photo-img' })}</div><div class="prose scallop"><h2>Nova 300 в квартире</h2><p>Аппарат размером с толстую книгу: 16 × 8,5 × 20 см. Его ставят на комод в гостиной, на полку в прихожей или рядом с кроватью — там, где есть розетка и воздух движется, а не в дальний угол.</p><p>Дома обычно хватает одного Nova 300 на всю квартиру. Если хотите разные ароматы в спальне и гостиной, возьмите два аппарата — это можно указать прямо в конструкторе.</p></div></div></section>` : ''}
<section class="sec">
  <h2 class="h2">Характе<i>ристики</i></h2>
  <div class="spec-grid">
    <dl class="specs2 scallop">${d.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <div class="fits scallop"><span class="sum-k">Где ставят</span><ul>${d.fits.map(f => `<li>${f[0].toUpperCase() + f.slice(1)}</li>`).join('')}</ul><span class="sum-k">В подписке</span><ul>${TX.included.map(t => `<li>${t}</li>`).join('')}</ul></div>
  </div>
</section>
<section class="sec"><div class="prose scallop"><h2>Нужна другая площадь?</h2><p>${UI.DEV[other.id].long} — ${other.name}: до ${other.area} м², подписка от ${UI.pm(other)} в месяц. <a href="/${other.slug}/">Смотреть ${other.name}</a>.</p></div></section>
${UI.faq(dfaq, `${d.name}: <i>вопросы</i>`)}`;
      }
    });
  });

  /* ── Для дома: аромадиффузор по подписке ── */
  const homeFaq = [
    ['Чем диффузор лучше палочек и свечей?', 'Он работает сам по расписанию и держит один ровный аромат во всей квартире. Палочки пахнут только рядом с собой и выдыхаются, свечу нельзя оставить без присмотра, а освежитель даёт резкий запах на пару минут.'],
    ['Почему подписка, а не покупка?', 'Хороший аппарат дорогой, а масла для него нужно искать и покупать постоянно. В подписке аппарат, масла, доставка и ремонт уже в цене, и аромат можно менять когда захочется.'],
    ['Сколько стоит в месяц?', `От ${from} при оплате за 6 месяцев и ${monthly} помесячно — за Nova 300, которого хватает на квартиру до 300 м².`],
    ['Сколько ароматов можно поменять?', `Сколько угодно: ${CFG.swap}. Выбирайте из ${UI.aromas()} каталога.`]
  ];
  add({
    path: 'diffuzor-dlya-doma/', section: 'diffuzor-dlya-doma/',
    title: 'Аромадиффузор для дома по подписке — без покупки, Астана | HOSH',
    description: `Автоматический аромадиффузор для дома: не покупать, а брать по подписке с маслами, доставкой и сервисом. Тише 35 дБ, от ${from} в месяц, ${trial}.`,
    h1: 'Аромадиффузор для дома по подписке',
    breadcrumbs: [HOME, ['Для дома', 'diffuzor-dlya-doma/']],
    schema: [devProduct(n300), site.schema.faq(homeFaq)],
    get body() {
      return UI.phead(this, { title: '<span>Аромадиффузор</span><span>для <i>дома</i></span><span>по подписке</span>', cls: 'long', lead: 'Не покупать аппарат и не искать к нему масла, а получить всё одной подпиской: диффузор, аромат, доставку и сервис.' }) + `
<section class="sec sec-t"><div class="photo-row">
  <div class="photo-card scallop">${site.hasImg('home-living') ? img('home-living', { cls: 'photo-img', eager: true }) : UI.deviceArt('pp-art')}</div>
  <div class="prose scallop">
    <h2>Что это такое</h2>
    <p>Аромадиффузор — небольшой металлический аппарат, который превращает ароматическое масло в сухой холодный туман и распыляет его по расписанию. Без воды, огня и нагрева: включается утром, когда вы встаёте, делает паузу ночью и наполняет ароматом всю квартиру, а не один угол.</p>
    <p>Мы привозим Nova 300, ставим у розетки, настраиваем расписание и интенсивность. Масло заканчивается — привозим новое сами. Вам остаётся выбрать аромат.</p>
    <a class="btn btn-red" href="/podpiska/?dev=nova300">Собрать подписку</a>
  </div>
</div></section>
<section class="sec">
  <h2 class="h2">В чём <i>разница</i></h2>
  <div class="cmp">
    <div class="cmp-c scallop"><b>Палочки</b><p>Пахнут в метре от флакона и выдыхаются за пару недель. Масло испаряется, даже когда вас нет дома.</p></div>
    <div class="cmp-c scallop"><b>Свечи</b><p>Красиво, но ненадолго: нельзя оставить без присмотра, дают копоть, а аромат уходит вместе с пламенем.</p></div>
    <div class="cmp-c scallop"><b>Освежитель</b><p>Резкий пшик на пару минут, потом снова ничего. Перебивает запах, а не создаёт атмосферу.</p></div>
    <div class="cmp-c cmp-us scallop"><b>Диффузор HOSH</b><p>Ровный аромат во всей квартире по расписанию. Тихий, без огня и аэрозоля. Масло и сервис — наши заботы.</p></div>
  </div>
</section>
<section class="sec"><div class="prose scallop">
  <h2>Купить или взять по подписке</h2>
  <p>Честно: купить аппарат выгоднее, если вы готовы сами искать масла, разбираться с настройками и чинить его, когда засорится форсунка. Покупка — это разовый платёж за аппарат и потом масло каждый месяц, а гарантия обычно заканчивается через год.</p>
  <p>Подписка нужна тем, кто хочет просто приятный запах дома. Аппарат приезжает на срок подписки, масла привозим по графику, ломается — меняем. Надоел аромат — меняем и его. Закончилась подписка — забираем аппарат, ничего не нужно продавать.</p>
  <p>Для квартиры хватает одного <a href="/nova-300/">Nova 300</a>. Если дом в два этажа или больше 300 м², подойдёт <a href="/nova-1000/">Nova 1000</a>. Какой запах выбрать для дома, мы собрали на странице <a href="/kak-v-otele/">«Аромат для дома как в отеле»</a> и в подборке <a href="/aromat-dlya/kvartiry/">для квартиры</a>.</p>
</div></section>
<section class="sec">
  <h2 class="h2">Цена <i>подписки</i></h2>
  ${UI.priceTable()}
</section>
${UI.faq(homeFaq, 'Частые <i>вопросы</i>')}`;
    }
  });

  /* ── Аромат для дома как в отеле ── */
  const hotelFaq = [
    ['Почему в отелях так приятно пахнет?', 'В лобби и коридорах стоят профессиональные диффузоры: они распыляют масло по расписанию, поэтому запах ровный весь день и встречает вас ещё у входа. Это не свеча и не аэрозоль.'],
    ['Это те самые ароматы отелей?', 'Это композиции для диффузора по мотивам узнаваемых отельных ароматов. HOSH не связан с отелями и брендами — мы делаем похожее настроение у вас дома.'],
    ['Какой отельный аромат выбрать для квартиры?', 'Для гостиной — по мотивам The Ritz-Carlton или Intercontinental Hotel, для спальни — деликатные White Tea и Белый мускус.'],
    ['Не будет ли слишком сильно для квартиры?', 'Нет: интенсивность настраивается, а дома её обычно ставят ниже, чем в лобби. Nova 300 работает тише 35 дБ.']
  ];
  add({
    path: 'kak-v-otele/', section: 'kak-v-otele/',
    title: 'Аромат для дома как в отеле — диффузор и масла по подписке | HOSH',
    description: `Аромат дорогого отеля у вас дома: диффузор по расписанию, шесть отельных ароматов по мотивам The Ritz-Carlton, InterContinental и других. От ${from} в месяц.`,
    h1: 'Аромат для дома как в отеле',
    breadcrumbs: [HOME, ['Как в отеле', 'kak-v-otele/']],
    schema: [site.schema.itemList(HOTEL6().map(s => [UI.scentName(s), `aromaty/${s.slug}/`])), site.schema.faq(hotelFaq)],
    get body() {
      return UI.phead(this, { title: '<span>Аромат</span><span>для дома</span><span>как в <i>отеле</i></span>', lead: 'Тот запах, который встречает в лобби пятизвёздочного отеля, можно устроить дома — с тем же аппаратом, что стоит в отелях, и без свечей.' }) + `
<section class="sec sec-t"><div class="photo-row">
  <div class="photo-card scallop">${img('home-hotel', { cls: 'photo-img', eager: true })}</div>
  <div class="prose scallop">
    <h2>Почему в отелях пахнет именно так</h2>
    <p>В хорошем отеле запах не случаен. В лобби, лифтах и коридорах стоят профессиональные диффузоры: аппарат превращает ароматическое масло в сухой туман и распыляет его по расписанию — понемногу, весь день. Поэтому аромат ровный, не душит и встречает вас ещё у входа.</p>
    <p>Это не свеча и не аэрозоль. Свеча пахнет, пока горит, а освежитель — пару минут после нажатия. Диффузор работает сам и держит одно настроение во всём пространстве.</p>
    <p>Дома работает тот же принцип: Nova 300 размером с книгу ставят в гостиной или прихожей, и квартира пахнет как номер, в котором хочется остаться.</p>
  </div>
</div></section>
<section class="sec">
  <h2 class="h2">Шесть <i>отельных</i> ароматов</h2>
  <div class="hits">${HOTEL6().map(s => UI.hitCard(s, { pic: false })).join('')}</div>
</section>
<section class="sec"><div class="prose scallop">
  <h2>Как выбрать отельный аромат для дома</h2>
  <p><b>Для гостиной и прихожей</b> берите ароматы средней интенсивности с тёплой базой — по мотивам The Ritz-Carlton или Intercontinental Hotel. Они звучат как лобби: цитрус на входе, дерево и белый чай в шлейфе.</p>
  <p><b>Для спальни</b> лучше деликатные: White Tea и Белый мускус. Они почти не заметны, пока не выйдешь из комнаты и не вернёшься.</p>
  <p><b>Если любите свежесть</b>, возьмите Свежее бельё — так пахнет номер сразу после уборки. Не угадали с ароматом — поменяем бесплатно, ${CFG.swap}.</p>
</div></section>
<section class="sec">
  <h2 class="h2">Цена <i>подписки</i></h2>
  ${UI.priceTable({ scent: 26 })}
  <p class="more"><a class="btn btn-red" href="/podpiska/?dev=nova300&amp;scent=26" data-ev="add_to_cart" data-n="26">Собрать подписку с отельным ароматом</a></p>
</section>
${UI.faq(hotelFaq, 'Частые <i>вопросы</i>')}`;
    }
  });

  /* ── Аромат для бизнеса: ниши ── */
  add({
    path: 'aromat-dlya/', section: 'aromat-dlya/',
    title: 'Аромат для бизнеса: ресторан, офис, магазин, салон, отель | HOSH',
    description: 'Какой аромат выбрать для ресторана, кофейни, офиса, магазина, салона красоты, барбершопа, клиники, фитнеса, отеля или квартиры. Подборки и подписка HOSH.',
    h1: 'Аромат для бизнеса',
    breadcrumbs: [HOME, ['Для бизнеса', 'aromat-dlya/']],
    schema: [site.schema.itemList(NICHES.map(n => [`Аромат для ${n.gen}`, `aromat-dlya/${n.slug}/`]))],
    get body() {
      return UI.phead(this, { title: '<span>Аромат</span><span>для <i>бизнеса</i></span>', lead: 'Десять готовых подборок: для каждого места — пять ароматов, нужный аппарат и советы, куда его поставить. Выберите своё и сразу соберите подписку.' }) + `
<section class="sec sec-t"><div class="fams">${NICHES.map(n => `<a class="fam scallop" href="/aromat-dlya/${n.slug}/">${UI.blob(D.byN(n.scents[0]).cat)}<b>${n.name}</b><span>${n.scents.slice(0, 3).map(x => D.byN(x).name).join(' · ')}</span><small>Подборка →</small></a>`).join('')}</div></section>
<section class="sec"><div class="prose scallop"><h2>Как мы собирали подборки</h2><p>Для каждого типа помещения мы смотрели, сколько времени там проводят люди, рядом ли еда и какое настроение нужно: бодрость в офисе и спортзале, спокойствие в клинике, уют в кофейне, статус в лобби отеля. Первый аромат в подборке — самый частый выбор, остальные — альтернативы с другим характером.</p><p>Для бизнеса выставляем счёт на ИП или ТОО — выберите «Счёт» при оформлении. Не нашли своё помещение? Откройте <a href="/aromaty/">весь каталог</a> из ${UI.aromas()} или напишите нам — подскажем.</p></div></section>`;
    }
  });

  NICHES.forEach(n => {
    const p = `aromat-dlya/${n.slug}/`;
    const d = D.devices.find(x => x.id === n.dev);
    const hit = D.byN(n.scents[0]);
    add({
      path: p, section: 'aromat-dlya/', title: n.title, description: n.description, h1: `Аромат для ${n.gen}`,
      breadcrumbs: [HOME, ['Для бизнеса', 'aromat-dlya/'], [n.name, p]],
      schema: [site.schema.itemList(n.scents.map(x => [UI.scentName(D.byN(x)), `aromaty/${D.byN(x).slug}/`])), site.schema.faq(n.faq)],
      get body() {
        return UI.phead(this, { title: `<span>Аромат</span><span>для <i>${n.gen}</i></span>`, lead: n.lead }) + `
<section class="sec sec-t"><div class="prose scallop">${n.text.map(t => `<p>${t}</p>`).join('')}</div></section>
<section class="sec">
  <h2 class="h2">Пять <i>ароматов</i></h2>
  <div class="ars">${n.scents.map(x => UI.aromaCard(D.byN(x))).join('')}</div>
</section>
<section class="sec">
  <h2 class="h2">Какой <i>аппарат</i></h2>
  <div class="prods"><a class="prod scallop" href="/podpiska/?dev=${d.id}&amp;scent=${hit.n}" data-ev="add_to_cart" data-n="${hit.n}">${UI.deviceArt('prod-art')}<span class="prod-t"><b>${UI.DEV[d.id].name}</b><small>${d.name} · до ${d.area} м² + ${esc(UI.scentName(hit))}</small><span>Готовый набор для ${n.gen}: аппарат и самый частый аромат уже выбраны в конструкторе — останется срок и адрес.</span><em>от ${UI.pm(d)} / мес →</em></span></a></div>
</section>
<section class="sec">
  <h2 class="h2">Три <i>совета</i></h2>
  <ol class="how how-3">${n.tips.map((t, i) => `<li class="scallop"><b>${i + 1}</b><p>${t}</p></li>`).join('')}</ol>
</section>
${UI.faq(n.faq, 'Частые <i>вопросы</i>')}
<section class="sec"><h2 class="h2">Другие <i>подборки</i></h2><div class="stickers">${NICHES.filter(x => x !== n).map(x => `<a class="stk" href="/aromat-dlya/${x.slug}/">${x.name}</a>`).join('')}</div></section>`;
      }
    });
  });

  /* ── Каталог ── */
  add({
    path: 'aromaty/', section: 'aromaty/',
    title: `Ароматы для дома и диффузора — ${UI.aromas()} по подписке | HOSH`,
    description: `Каталог HOSH: ${UI.aromas()} для диффузора с метками — настроение, семейство, ноты. Ароматы по мотивам The Ritz-Carlton, Jo Malone, Hilton. Любой — в подписке.`,
    h1: 'Ароматы',
    breadcrumbs: [HOME, ['Ароматы', 'aromaty/']],
    schema: [site.schema.itemList(D.scents.map(s => [UI.scentName(s), `aromaty/${s.slug}/`]))],
    get body() {
      return UI.phead(this, { title: `<span>${N}</span><span><i>${UI.aromas().split(' ')[1]}</i></span>`, lead: 'Ароматы отдельно не продаём: любой входит в подписку без доплаты. У каждого — настроение, семейство и три ноты, а на его странице — где он звучит лучше всего.' }) + `
<section class="sec sec-t">
  <div class="filters filters-lg">
    <div class="cats cats-lg" id="cat-filter" data-scroll-x role="group" aria-label="Семейство"><button type="button" data-c="all" aria-pressed="true">Все ${N}</button>${D.categories.map(c => `<button type="button" data-c="${c.id}" aria-pressed="false">${c.name}</button>`).join('')}</div>
    <div class="cats" id="mood-filter" data-scroll-x role="group" aria-label="Настроение"><button type="button" data-m="all" aria-pressed="true">Любое настроение</button>${CFG.moods.map(m => `<button type="button" data-m="${m}" aria-pressed="false">${m}</button>`).join('')}</div>
  </div>
  ${D.categories.map(c => `<div class="fam-block" id="${c.id}" data-c="${c.id}"><h2 class="fam-h">${c.name} <small>${c.mood}</small></h2><div class="ars">${D.scents.filter(s => s.cat === c.id).map(UI.aromaCard).join('')}</div></div>`).join('')}
</section>`;
    }
  });

  D.scents.forEach(s => {
    const c = D.cat(s.cat);
    const p = `aromaty/${s.slug}/`;
    const [pw, pwText] = POWER[s.power];
    const similar = D.scents.filter(x => x.cat === s.cat && x !== s).slice(0, 4);
    const nm = UI.scentName(s);
    const desc = `Аромат ${nm} для дома: ${s.notes.join(', ')}. ${s.mood}, ${ADJ[s.cat]}${s.cat === 'spa' ? '' : ' '}аромат. В подписке HOSH с диффузором от ${from} в месяц.`;
    add({
      path: p, section: 'aromaty/', item: s.n,
      title: s.motif ? `Аромат по мотивам ${s.name} для дома — подписка HOSH` : `Аромат ${s.name} для дома и диффузора — HOSH`,
      description: desc.length > 165 ? desc.slice(0, desc.lastIndexOf(' ', 162)) + '…' : desc,
      h1: `Аромат ${nm} для дома`,
      breadcrumbs: [HOME, ['Ароматы', 'aromaty/'], [s.name, p]],
      schema: [site.schema.product({ name: `Подписка с ароматом ${nm}`, description: s.desc, low: D.perMonth(n300.plans[2]), high: n1000.plans[0].total, count: 6 }, p)],
      get body() {
        return `<section class="phead">${site.crumbs(this.breadcrumbs)}</section>
<section class="pp">
  <div class="pp-card scallop">
    <div class="ap-visual">${site.hasImg('fam-' + c.slug) ? img('fam-' + c.slug, { cls: 'ap-img', alt: `${c.name} ароматы`, eager: true }) : UI.blob(s.cat).replace('class="blob"', 'class="blob blob-xl"')}<span class="ap-n">N°${String(s.n).padStart(2, '0')}</span></div>
    <div class="pp-copy">
      <span class="sum-k">${c.name} · ${pw}</span>
      <h1 class="pp-h pp-h-s"><small>${s.motif ? 'Аромат по мотивам' : 'Аромат'}</small> ${esc(s.name)} <small>для дома</small></h1>
      ${UI.tags(s)}
      <p>${esc(s.desc)}</p>
      <dl class="pyr">${['Верхние ноты', 'Сердце', 'База'].map((k, i) => `<div><dt>${k}</dt><dd>${esc(s.notes[i])}</dd></div>`).join('')}</dl>
      <a class="btn btn-red" href="/podpiska/?scent=${s.n}" data-ev="add_to_cart" data-n="${s.n}">Выбрать этот аромат</a>
      <span class="from">подписка с этим ароматом от <b>${from}</b> / мес · ${monthly} помесячно</span>
    </div>
  </div>
</section>
<section class="sec"><div class="prose scallop">
  <h2>Как звучит ${esc(nm)}</h2>
  <p>${esc(s.name)} — ${ADJ[s.cat]}${s.cat === 'spa' ? '' : ' '}аромат из коллекции HOSH, его настроение — ${s.mood.toLowerCase()}. Композиция раскрывается в три этапа: сначала вы чувствуете ${esc(s.notes[0])}, затем сердце — ${esc(s.notes[1])}, а в шлейфе остаются ${esc(s.notes[2])}. Настроение семейства — ${c.mood}.</p>
  <p>Это ${pw} аромат. ${pwText}</p>
  ${s.motif ? `<p>Это не оригинальный парфюм, а композиция для диффузора по мотивам узнаваемого аромата ${esc(s.name)}. HOSH не связан с брендом и не продаёт его продукцию.</p>` : ''}
  <h2>Где подходит</h2>
  <p>Дома ${esc(s.name)} ставят в ${s.power === 1 ? 'спальне, детской или кабинете' : s.power === 2 ? 'гостиной или прихожей' : 'просторной гостиной или прихожей с мягкой интенсивностью'}. В бизнесе его чаще всего выбирают для таких пространств: ${esc(s.spaces.join(', '))}. Для квартиры или помещения до 300 м² достаточно <a href="/nova-300/">Nova 300</a>, для большого дома или зала до 1000 м² — <a href="/nova-1000/">Nova 1000</a>.</p>
</div></section>
<section class="sec">
  <h2 class="h2">Подписка <i>с этим ароматом</i></h2>
  ${UI.priceTable({ scent: s.n })}
</section>
<section class="sec"><h2 class="h2">Похожие <i>ароматы</i></h2><div class="ars">${similar.map(UI.aromaCard).join('')}</div></section>`;
      }
    });
  });

  /* ── Доставка и оплата ── */
  const R = CFG.rules;
  const dFaq = [
    ['Сколько стоит доставка и установка?', 'Нисколько: доставка и установка по Астане входят в подписку.'],
    ['Как быстро привезёте?', 'В день, который вы выберете при оформлении. Накануне напишем в WhatsApp и согласуем время.'],
    ['Как платить?', `Kaspi, картой или по счёту для ИП и ТОО. ${CFG.checkout.online ? 'Оплата — сразу на сайте.' : 'После оформления подтвердим заказ в WhatsApp и пришлём ссылку на оплату Kaspi или счёт.'}`],
    ['Можно отказаться?', `${R.refuse} ${R.early}`],
    ['Что будет при переезде?', R.moving],
    ['Можно ли продлить подписку?', 'Да. За неделю до конца срока напомним в WhatsApp: продлить, сменить аромат или закончить.']
  ];
  add({
    path: 'dostavka-i-oplata/', section: 'dostavka-i-oplata/',
    title: 'Доставка и оплата подписки на аромат: Kaspi, карта, счёт | HOSH',
    description: 'Как HOSH привозит и устанавливает диффузор в Астане, как оплатить подписку через Kaspi, картой или по счёту, как отказаться, вернуть аппарат и что при переезде.',
    h1: 'Доставка и оплата',
    breadcrumbs: [HOME, ['Доставка и оплата', 'dostavka-i-oplata/']],
    schema: [site.schema.faq(dFaq)],
    get body() {
      return UI.phead(this, { title: '<span>Доставка</span><span>и <i>оплата</i></span>', lead: 'Оформляете на сайте за пару минут, мы привозим, ставим и включаем. Дальше масла меняем сами.' }) + `
<section class="sec sec-t"><ol class="how">
  <li class="scallop"><b>1</b><h2 class="how-h">Заказ</h2><p>Собираете подписку на сайте: аппарат, срок, аромат, адрес и день доставки. Без регистрации.</p></li>
  <li class="scallop"><b>2</b><h2 class="how-h">Оплата</h2><p>Kaspi, картой или по счёту для ИП и ТОО. ${CFG.checkout.online ? 'Сразу на сайте.' : 'Ссылку на оплату пришлём в WhatsApp.'}</p></li>
  <li class="scallop"><b>3</b><h2 class="how-h">Установка</h2><p>Привозим в выбранный день, ставим рядом с розеткой и настраиваем расписание.</p></li>
  <li class="scallop"><b>4</b><h2 class="how-h">Сервис</h2><p>Масла привозим по графику, аромат меняем по запросу, при поломке заменяем аппарат.</p></li>
</ol></section>
<section class="sec">
  <h2 class="h2">Способы <i>оплаты</i></h2>
  <div class="fams">${CFG.checkout.payments.map(p => `<div class="fam scallop"><b>${p.name}</b><span>${p.hint}</span></div>`).join('')}</div>
</section>
<section class="sec"><div class="prose scallop">
  <h2>Отказ и возврат</h2>
  <p><b>Первые ${CFG.trial.days} дня.</b> ${R.refuse}</p>
  <p><b>Досрочно.</b> ${R.early}</p>
  <p><b>Возврат аппарата.</b> ${R.return}</p>
  <p><b>Поломка.</b> ${R.damage}</p>
  <h2>Переезд</h2>
  <p>${R.moving}</p>
  <h2>Что нужно от вас</h2>
  <p>Розетка рядом с местом установки и полка, комод или стойка, куда можно поставить аппарат. Подскажем лучшее место: ближе к проходу и движению воздуха, а не в дальнем углу.</p>
  <h2>Где работаем</h2>
  <p>Доставляем и обслуживаем подписки по всей Астане.</p>
</div></section>
${UI.faq(dFaq)}`;
    }
  });

  /* ── Вопросы ── */
  const allFaq = [...TX.faq, dFaq[0], dFaq[2], ['Сколько ароматов в каталоге?', `${UI.aromas()}: свежие, цветочные, гурманские, отельные, SPA и парфюмерные. Любой входит в подписку без доплаты.`]];
  add({
    path: 'voprosy/', section: 'voprosy/',
    title: 'Вопросы о подписке на аромат HOSH — шум, масло, смена, переезд',
    description: 'Ответы на частые вопросы о подписке HOSH: шумит ли диффузор, на сколько хватает масла, безопасно ли для детей и животных, как сменить аромат и что при переезде.',
    h1: 'Вопросы',
    breadcrumbs: [HOME, ['Вопросы', 'voprosy/']],
    schema: [site.schema.faq(allFaq)],
    get body() { return UI.phead(this, { title: '<span><i>Вопросы</i></span>', lead: 'Всё, что спрашивают перед первой подпиской. Не нашли свой — напишите в WhatsApp.' }) + UI.faq(allFaq, 'Частые вопросы'); }
  });

  /* ── Контакты, служебные ── */
  const Ct = D.contacts;
  add({
    path: 'kontakty/', section: 'kontakty/',
    title: 'Контакты HOSH — аромат для дома и бизнеса по подписке, Астана',
    description: `Контакты HOSH в Астане: ${Ct.phone}, WhatsApp. ${Ct.hours}. Оформление подписки на аромат онлайн, доставка и установка диффузора.`,
    h1: 'Контакты',
    breadcrumbs: [HOME, ['Контакты', 'kontakty/']],
    schema: [site.schema.business(Ct)],
    get body() {
      return UI.phead(this, { title: '<span><i>Контакты</i></span>', lead: 'Обычно всё можно оформить на сайте без звонка. Если остались вопросы — пишите в WhatsApp.' }) + `
<section class="sec sec-t"><div class="fams">
  <a class="fam scallop" href="tel:${Ct.phoneRaw}"><b>Телефон</b><span>${Ct.phone}</span></a>
  <a class="fam scallop" href="${UI.wa('Контакты', 'Здравствуйте!')}" target="_blank" rel="noopener" data-ev="wa_help" data-where="kontakty"><b>WhatsApp</b><span>Написать</span></a>
  <a class="fam scallop" href="${Ct.map2gis}" target="_blank" rel="noopener"><b>Офис</b><span>${Ct.address}</span></a>
  <div class="fam scallop"><b>Время работы</b><span>${Ct.hours}</span></div>
</div></section>
<section class="sec"><div class="prose scallop"><p>HOSH — магазин подписок на аромат в Астане. Вы выбираете аппарат, срок и один из ${UI.aromas()} в <a href="/podpiska/">конструкторе</a>, оставляете адрес и день доставки — а мы привозим диффузор, запускаем его и дальше сами меняем масла. Звонить для этого не нужно.</p><p>Если не уверены, что выбрать, напишите в WhatsApp, какое у вас помещение: для квартиры хватит одного Nova 300, для большого дома или зала лучше Nova 1000. Начать можно с универсальных ароматов — White Tea, Свежий цитрус или по мотивам The Ritz-Carlton, — а поменять в любой момент.</p><p>Бизнесу выставим счёт на ИП или ТОО: выберите «Счёт» при оформлении и укажите БИН — договор пришлём в WhatsApp вместе со счётом.</p></div></section>`;
    }
  });
  add({
    path: 'politika-konfidencialnosti/', noindex: true, noCta: true,
    title: 'Политика конфиденциальности — HOSH',
    description: 'Политика обработки персональных данных HOSH: что передаётся при оформлении подписки, как используются данные и какие счётчики работают на сайте.',
    h1: 'Политика конфиденциальности',
    breadcrumbs: [HOME, ['Политика', 'politika-konfidencialnosti/']],
    get body() { return UI.phead(this, {}) + `<section class="sec"><div class="prose scallop"><p>При оформлении подписки вы указываете имя, телефон, адрес доставки, день доставки, способ оплаты и, для счёта, ИИН или БИН. Эти данные вместе с составом подписки уходят нам сообщением в WhatsApp, которое вы отправляете сами. Мы используем их только для связи, оплаты, договора и доставки и не передаём третьим лицам, кроме случаев, предусмотренных законодательством Республики Казахстан.</p><p>Выбор в конструкторе (аппарат, срок, аромат) хранится в вашем браузере, чтобы не собирать подписку заново. Для статистики посещений сайт может использовать Яндекс Метрику и Google Analytics: они получают обезличенные данные о просмотрах страниц и нажатиях кнопок.</p></div></section>`; }
  });
  add({
    path: '404.html', noindex: true, noCta: true,
    title: 'Страница не найдена — HOSH', description: 'Такой страницы нет. Вернитесь в магазин HOSH.',
    body: `<section class="phead nf"><h1 class="poster small"><span>404</span><span><i>не пахнет</i></span></h1><p class="phead-lead">Страница не найдена.</p><a class="btn btn-red" href="/">В магазин</a></section>`
  });
}

module.exports = { register };
