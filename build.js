/* Сборка HOSH: node build.js → docs/ (GitHub Pages публикует папку docs).
   Домен: поменяйте origin и base (для своего домена base: '/'). Настройки магазина — src/config.js. */
const { createSite } = require('./lib/engine');
const D = require('./lib/data');
const { CFG, browserCfg } = require('./src/setup');
const UI = require('./src/ui');
const { register } = require('./src/pages');

const site = createSite({
  root: __dirname,
  name: 'HOSH',
  origin: 'https://t0niske.github.io',
  base: '/hosh-shop/',
  description: 'Аромат для дома и бизнеса по подписке в Астане',
  themeColor: '#2230C9',
  ogImage: 'og',
  yandexVerification: CFG.yandexVerification,
  googleVerification: CFG.googleVerification,
  images: require('./src/images'),
  browserData: D.browserScript() + browserCfg()
});
UI.init(site);
register(site);
site.build(UI.layout);
