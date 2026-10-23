/* Сборка HOSH: node build.js → docs/ (GitHub Pages публикует папку docs).
   Домен: поменяйте origin и base (для своего домена base: '/'). */
const { createSite } = require('./lib/engine');
const D = require('./lib/data');
const UI = require('./src/ui');
const { register } = require('./src/pages');

const site = createSite({
  root: __dirname,
  name: 'HOSH',
  origin: 'https://t0niske.github.io',
  base: '/hosh-shop/',
  description: 'Подписка на аромат в Астане',
  themeColor: '#2230C9',
  ogImage: 'og',
  images: require('./src/images'),
  browserData: D.browserScript()
});
UI.init(site);
register(site);
site.build(UI.layout);
