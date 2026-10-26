/* Применяет src/config.js к общим данным (lib/data.js) только внутри сборки HOSH:
   свои контакты, если заполнены, ароматы «по мотивам» сверх общего каталога и метки ароматов.
   lib/data.js не меняется — его перезаписывает sites/_engine/sync.js. */
const D = require('../lib/data');
const CFG = require('./config');

for (const [k, v] of Object.entries(CFG.contacts)) if (v) D.contacts[k] = v;
if (CFG.extraScents.enabled) CFG.extraScents.list.forEach(s => { if (!D.byN(s.n)) D.scents.push({ ...s }); });
D.scents.forEach(s => { s.mood = CFG.mood[s.n] || ''; s.motif = CFG.motif.includes(s.n); });

/* То, что нужно скриптам в браузере (без бизнес-заготовок, которые там не используются) */
const browserCfg = () => `window.HOSH_CFG=${JSON.stringify({
  analytics: CFG.analytics, checkout: CFG.checkout, trial: CFG.trial, moods: CFG.moods,
  devName: { nova300: 'Для квартиры', nova1000: 'Для большого дома и бизнеса' }
})};\n`;

module.exports = { CFG, browserCfg };
