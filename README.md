# Artist Studio

A warm, responsive artist-led product design website, revised around fluid sculptural geometry, warm-white space and precise editorial typography. The working name **Stillroom Studio** is provisional.

## Pages

Home, Design, Shop, Studio, Journal, Contact. The first product is a sleep-support product; exact specifications, photos, price, release date and checkout are intentionally pending the artist’s information. The portfolio visuals are original concept studies, clearly identified as such. Journal entries and the studio statement are preview copy.

## Features

- English by default; Simplified Chinese, Traditional Chinese, Japanese and Korean. Language choice persists in the browser.
- Three-slide homepage carousel, touch gestures, pause control and arrow-key navigation.
- Original continuous folded-surface sculptures in local Three.js, with drag and keyboard rotation, surface/structure modes, view reset, subtle scroll response, lighting and shadows. Ray-traced JPEG studies provide a fallback without WebGL.
- Reduced-motion support, responsive layouts, keyboard-accessible navigation, image dialogs and product accordions.
- Contact draft preparation, local draft saving, copy and text download. **No message is sent**, and no payment is taken.

## Preview and validation

Serve `dist/` using a static server. In this managed environment use `sites-preview start /workspace/sites/artist-studio`.

Run `npm run check` for locale completeness, page shells and local module references.

## Edit content

- `dist/assets/content.js`: working name, future contact email and all five language dictionaries.
- `dist/assets/app.js`: page content and interactions.
- `dist/assets/scene.js`: original parametric 3D studies.
- `dist/assets/direction.js`: visual-direction copy in all five languages.
- `dist/assets/direction.css`: revised sculptural visual system.
- `design-source/render-studies.py`: reproducible Blender source for the original material studies.
- `dist/assets/style.css`: colours, layout, motion and responsive styling.

To activate commerce, supply product details and connect an actual purchase destination. Add a real studio email or a contact service before enabling message sending.

## Design references

Official artist sites were reviewed for site structure and presentation: [Malika Favre](https://www.malikafavre.com/), [Bodil Jane](https://www.bodiljane.com/), [Studio Olafur Eliasson](https://olafureliasson.net/), and [David Shrigley](https://davidshrigley.com/). The second visual direction draws on [Zaha Hadid Design’s Form in Motion](https://www.zaha-hadid-design.com/pages/form-in-motion) for continuous surfaces and spatial movement, and [Kenya Hara’s White](https://hara.ndc.co.jp/en/books/shiro/) for considered space and material sensitivity. All sculptures and imagery are original concept studies. No artwork or website assets from these sites are reproduced.

## Third-party software

Three.js 0.180.0 is bundled locally under its MIT licence; see `dist/assets/THREE-LICENSE.txt`.
