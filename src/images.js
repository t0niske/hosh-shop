/* Слоты картинок HOSH. Стиль — яркий постер: кобальт #2230C9, крем #FFF3D6, томатный #FF5B3A. */
const POP = 'Bold playful pop-art product photography, flat saturated cobalt-blue background (#2230C9), hard direct flash light with crisp short shadows, a few cream (#FFF3D6) and tomato-red (#FF5B3A) paper confetti shapes, wavy scalloped cream paper cut-outs. Graphic, poster-like, joyful, high detail. No text, no letters, no logos.';
const fam = (what) => ({ w: 1, h: 1, prio: 2, prompt: `${POP}\nSubject: ${what}, arranged as a fun flat-lay seen from above, centred, with air around it. Aspect ratio 1:1.` });

module.exports = {
  'device': {
    title: 'Диффузор Nova на кобальтовом фоне', w: 1, h: 1, prio: 1, where: 'главная, страницы Nova 300 и Nova 1000',
    alt: 'Диффузор Nova — подписка на аромат HOSH',
    prompt: `${POP}\nSubject: a compact rectangular aroma diffuser about 20 cm tall made of matte graphite-grey metal with slightly rounded edges, a narrow vertical black glossy glass panel on the right half of the front with small glowing blue LED digits and a tiny red power icon, a round black fan grille on top, four short black feet. Three-quarter view, standing on a cream scalloped paper plinth, a puff of white mist from the top. The background must be pure cream (#FFF3D6) inside a scalloped frame, so it sits on the cream card of the website. Aspect ratio 1:1.\n\nПриложите фото аппарата из PDF-прайса как референс.`
  },
  'fam-svezhie-citrusovye': { title: 'Свежие и цитрусовые', alt: 'Свежие и цитрусовые ароматы', where: 'страницы свежих ароматов', ...fam('halved lemons and limes, a bergamot, basil leaves and ice cubes') },
  'fam-cvetochnye': { title: 'Цветочные', alt: 'Цветочные ароматы', where: 'страницы цветочных ароматов', ...fam('pink roses, white jasmine and freesia flowers, scattered petals') },
  'fam-gurmanskie': { title: 'Гурманские', alt: 'Гурманские ароматы', where: 'страницы гурманских ароматов', ...fam('coffee beans, a small espresso cup, vanilla pods and caramel candies') },
  'fam-otelnye': { title: 'Отельные', alt: 'Отельные ароматы', where: 'страницы отельных ароматов', ...fam('a folded white hotel towel, a halved fig, a cup of white tea and a hotel key card without text') },
  'fam-spa-relax': { title: 'SPA и релакс', alt: 'SPA-ароматы', where: 'страницы SPA-ароматов', ...fam('lavender bundles, eucalyptus branches, green tea leaves and smooth stones') },
  'fam-parfyumernye': { title: 'Парфюмерные', alt: 'Парфюмерные ароматы', where: 'страницы парфюмерных ароматов', ...fam('a cedar wood block, a leather glove, dried tobacco leaves and pink peppercorns') },
  'og': { title: 'Обложка для соцсетей', w: 16, h: 9, prio: 2, where: 'превью ссылок', alt: 'HOSH — подписка на аромат', prompt: `${POP}\nSubject: the graphite aroma diffuser on the right on a cream scalloped plinth, puffs of mist shaped like little clouds, empty cobalt space on the left for a headline. Aspect ratio 16:9.` }
};
