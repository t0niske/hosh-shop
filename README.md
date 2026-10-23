# HOSH — подписка на аромат

Магазин подписок сети. Дизайн прежний (кобальт, кремовые волнистые карточки, Dela Gothic One + Manrope), теперь это многостраничный сайт под SEO.

Сайт: https://t0niske.github.io/hosh-shop/

## Структура (42 страницы)
- `/` — главная
- `/podpiska/` — конструктор: аппарат, срок, аромат. Понимает ссылки вида `?dev=nova1000&term=1&scent=17`
- `/nova-300/`, `/nova-1000/` — страницы аппаратов (Product, AggregateOffer)
- `/aromaty/` + 32 страницы ароматов с нотами, интенсивностью и похожими ароматами
- `/dostavka-i-oplata/`, `/voprosy/`, `/kontakty/`

Корзина общая для всех страниц (localStorage `hosh-cart`), заказ уходит в WhatsApp.

## Как править
Тексты — `src/pages.js`, данные и цены — `lib/data.js`, стиль — `src/assets/css/style.css`, конструктор — `src/assets/js/builder.js`, корзина — `src/assets/js/main.js`. Картинки и промпты — `IMAGES.md`.
```
node build.js
```
