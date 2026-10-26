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
  'home-living': {
    title: 'Диффузор в гостиной', w: 1, h: 1, prio: 1, where: 'первый экран главной, «Аромадиффузор для дома», Nova 300',
    alt: 'Диффузор Nova на комоде в гостиной',
    prompt: `Bold, joyful pop interior photograph of a modern apartment living room in Astana: one wall painted saturated cobalt blue (#2230C9), a cream (#FFF3D6) boucle sofa with tomato-red (#FF5B3A) cushions, a round cream rug, a large window with soft daylight, a green plant in a terracotta pot, a cream lacquered sideboard. On the sideboard, in the right third of the frame, stands ${'a compact rectangular aroma diffuser about 20 cm tall (exactly the device in the attached reference image): dark graphite-green powder-coated metal box with softly rounded edges, a narrow vertical black glossy glass panel on the LEFT third of the front with small glowing blue LED digits "30" and a tiny red power icon below them, a black oval vented cap on top, four short black rubber feet'}, small and realistic in scale next to a stack of books and a ceramic vase; a faint wisp of mist above it. Clean graphic composition, crisp light, editorial magazine quality, high detail. No people, no text, no letters, no logos. Aspect ratio 1:1.\n\nРеференс — рендер аппарата .gfx/dev/hosh-ref.png.`
  },
  'home-hotel': {
    title: 'Спальня «как в отеле»', w: 4, h: 3, prio: 2, where: '«Аромат для дома как в отеле»',
    alt: 'Спальня как в отеле с диффузором Nova на прикроватной тумбе',
    prompt: `Bold, joyful pop interior photograph of a calm apartment bedroom styled like a five-star hotel room: a large bed with crisp white linen and a folded cream (#FFF3D6) throw, a headboard wall painted saturated cobalt blue (#2230C9), a tomato-red (#FF5B3A) armchair, two brass reading lamps, a tray with a white teapot and two cups, a rolled white towel. On the cream bedside table stands ${'a compact rectangular aroma diffuser about 20 cm tall (exactly the device in the attached reference image): dark graphite-green powder-coated metal box with softly rounded edges, a narrow vertical black glossy glass panel on the LEFT third of the front with small glowing blue LED digits "30" and a tiny red power icon below them, a black oval vented cap on top, four short black rubber feet'}, small and realistic in scale; a faint wisp of mist above it. Soft morning daylight, crisp graphic composition, editorial magazine quality, high detail. No people, no text, no letters, no logos. Aspect ratio 4:3.\n\nРеференс — рендер аппарата .gfx/dev/hosh-ref.png.`
  },
  'og': { title: 'Обложка для соцсетей', w: 16, h: 9, prio: 2, where: 'превью ссылок', alt: 'HOSH — подписка на аромат', prompt: `${POP}\nSubject: the graphite aroma diffuser on the right on a cream scalloped plinth, puffs of mist shaped like little clouds, empty cobalt space on the left for a headline. Aspect ratio 16:9.` }
};
