# Oreo's Cafe

A static website: no build step, no libraries. Open `index.html` in a browser.

## Files

- `index.html` the page structure
- `style.css` all styling (theme colors are in the `:root` blocks, vignette tones in `--vig`)
- `script.js` everything that moves (menu data is at the top: `MENU`)
- `manifest.webmanifest` and `sw.js` make it installable and available offline (only works over https or localhost)
- `images/` your photos (see below)

## Image names (put them in `images/`)

A missing file is fine: the emoji or gradient shows instead.

- `icon.png` logo and favicon (a square 512x512 PNG works best for installing as an app)
- `og.jpg` preview picture when the link is shared (1200x630)
- Hero photo per theme: `hero-espresso.jpg`, `hero-paper.jpg`, `hero-snow.jpg`, `hero-midnight.jpg`, `hero-forest.jpg`, `hero-wine.jpg` (any theme without one uses `hero.jpg`)
- `about.jpg` and `reserve.jpg` for the two photo blocks
- `gallery-1.jpg` to `gallery-6.jpg` for the gallery
- Drinks:
  oat-latte.jpg
  flat-white.jpg
  iced-caramel.jpg
  cold-brew.jpg
  matcha-latte.jpg
  masala-chai.jpg
  mocha.jpg
  iced-lemon-tea.jpg
  butter-croissant.jpg
  glazed-donut.jpg
  chocolate-muffin.jpg
  blueberry-cheesecake.jpg
  cappuccino.jpg
  americano.jpg
  vanilla-latte.jpg
  caramel-macchiato.jpg
  affogato.jpg
  jasmine-green-tea.jpg
  chamomile-tea.jpg
  peach-iced-tea.jpg
  apple-pie.jpg
  chocolate-chip-cookie.jpg
  sesame-bagel.jpg
  belgian-waffle.jpg
  hero.jpg

## Editing

- Add or change a drink: edit the `MENU` list at the top of `script.js`. Order is `[name, price, category, emoji, hue, rating, description, image]`.
- Homepage shows two rows, the rest are on the full menu page. Phones show fewer.
- Add a theme: add its colors in `style.css` (copy a `:root[data-theme=...]` block), a `--vig` line, and an entry in `THEMES` in `script.js`.
- Performance mode (Settings) turns off blur and glass if the site lags.

## Features

Theme and accent switcher, cart that survives refresh, fake checkout with order tracker and loyalty card, favorites (heart), drink popup with sizes, add-ons, pairing and share link (`#/drink/oat-latte`), search (Ctrl K or /), reservation form with calendar file, gallery lightbox, reviews strip, opening hours, keyboard shortcuts (?), install as an app.

Checkout, reservations and reviews are demo only. Nothing is sent or stored on a server.
