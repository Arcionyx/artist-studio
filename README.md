# Artist Studio

A warm, responsive artist-led product design website. The working name **Stillroom Studio** is provisional.

## Pages

Home, Design, Shop, Studio, Journal, Contact. The first product is a sleep-support product; exact specifications, photos, price, release date and checkout are intentionally pending the artist’s information. The portfolio visuals are original concept studies, clearly identified as such. Journal entries and the studio statement are preview copy.

## Features

- English by default; Simplified Chinese, Traditional Chinese, Japanese and Korean. Language choice persists in the browser.
- Three-slide homepage carousel, touch gestures, pause control and arrow-key navigation.
- Locally bundled Three.js sculpture with drag interaction, lighting, shadows and gentle motion; an SVG fallback works without WebGL.
- Reduced-motion support, responsive layouts, keyboard-accessible navigation, image dialogs and product accordions.
- Contact draft preparation, local draft saving, copy and text download. **No message is sent**, and no payment is taken.

## Preview and validation

Serve `dist/` using a static server. In this managed environment use `sites-preview start /workspace/sites/artist-studio`.

Run `npm run check` for locale completeness, page shells and local module references.

## Edit content

- `dist/assets/content.js`: working name, future contact email and all five language dictionaries.
- `dist/assets/app.js`: page content and interactions.
- `dist/assets/scene.js`: 3D visual study.
- `dist/assets/style.css`: colours, layout, motion and responsive styling.

To activate commerce, supply product details and connect an actual purchase destination. Add a real studio email or a contact service before enabling message sending.

## Design references

Official artist sites were reviewed for site structure and presentation: [Malika Favre](https://www.malikafavre.com/), [Bodil Jane](https://www.bodiljane.com/), [Studio Olafur Eliasson](https://olafureliasson.net/), and [David Shrigley](https://davidshrigley.com/). No artwork or website assets from these sites are reproduced.

## Third-party software

Three.js 0.180.0 is bundled locally under its MIT licence; see `dist/assets/THREE-LICENSE.txt`.
