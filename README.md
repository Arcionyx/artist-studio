# ARCSEON

ARCSEON is an art-led product company bringing artistic expression, product design and everyday experience together. The website preserves its sculptural visual direction and begins with a sleep-support product.

## Pages

Home, Design, Shop, Company, Designers, Journal, Contact. The legacy studio.html route forwards to company.html. The first product is a sleep-support product; exact specifications, photos, price, release date and checkout are intentionally pending product information. The portfolio visuals are original concept studies, clearly identified as such. Journal entries and the company statement are preview copy.

## Features

- English by default; Simplified Chinese, Traditional Chinese, Japanese and Korean. Language choice persists in the browser.
- A Designers page and company-page introductions for Steven (Ruixi) Feng, Founder & Designer, and Chengyan Tan, Co-founder & Designer. Steven's supplied original portrait is included; Chengyan's image area is blank and both biographies are pending.
- A three-chapter pinned homepage with scroll-directed camera movement, a 5.8-second autonomous slideshow, masked line reveals and animated poster fallbacks.
- Continuous 3D orbit, eased study crossfades, rotating light, scroll zoom, surface/structure modes and keyboard/drag interaction.
- A horizontal visual-study gallery, image parallax, full-screen keyboard-accessible navigation and page transitions.
- Reduced-motion settings remove pinning and autonomous animation while keeping the entire site usable.
- An original open-arc A emblem and custom ARCSEON lettering, with positive letter spacing, a matching favicon and a compact contact footer.
- Smaller responsive hero titles with padded reveal masks to protect full letterforms and descenders.
- Original continuous folded-surface sculptures in local Three.js, with drag and keyboard rotation, surface/structure modes, view reset, subtle scroll response, lighting and shadows. Ray-traced JPEG studies provide a fallback without WebGL.
- Reduced-motion support, responsive layouts, keyboard-accessible navigation, image dialogs and product accordions.
- Contact draft preparation, local draft saving, copy and text download. **No message is sent**, and no payment is taken.

## Preview and validation

Serve `dist/` using a static server. In this managed environment use `sites-preview start /workspace/sites/artist-studio`.

Run `npm run check` for locale completeness, page shells and local module references.

## Edit content

- `dist/assets/content.js`: company identity, designer profiles, future contact email and all five language dictionaries. Add portraits and localized biographies to the exported `designers` array when supplied.
- `dist/assets/app.js`: page content and interactions.
- `dist/assets/scene.js`: original parametric 3D studies.
- `dist/assets/direction.js`: visual-direction copy in all five languages.
- `dist/assets/direction.css`: revised sculptural visual system.
- `design-source/render-studies.py`: reproducible Blender source for the original material studies.
- `dist/assets/style.css`: baseline layout and responsive styling.
- `dist/assets/motion.css` and `dist/assets/motion.js`: kinetic layout and scroll chapters.
- `dist/assets/arcseon-symbol.svg`, `arcseon-wordmark.svg` and `arcseon-lockup.svg`: editable vector brand artwork.
- `dist/assets/identity.css` and `identity.js`: shared brand components, compact contact-footer composition and safe hero typography.
- `design-source/build-identity.py`: reproducible original vector artwork.

To activate commerce, supply product details and connect an actual purchase destination. Add a real company email or a contact service before enabling message sending.

## Design references

Official artist sites were reviewed for site structure and presentation: [Malika Favre](https://www.malikafavre.com/), [Bodil Jane](https://www.bodiljane.com/), [Studio Olafur Eliasson](https://olafureliasson.net/), and [David Shrigley](https://davidshrigley.com/). The second visual direction draws on [Zaha Hadid Design’s Form in Motion](https://www.zaha-hadid-design.com/pages/form-in-motion) for continuous surfaces and spatial movement, and [Kenya Hara’s White](https://hara.ndc.co.jp/en/books/shiro/) for considered space and material sensitivity. All sculptures and imagery are original concept studies. No artwork or website assets from these sites are reproduced.

## Third-party software

Three.js 0.180.0 is bundled locally under its MIT licence; see `dist/assets/THREE-LICENSE.txt`.

The current ZHA website at https://www.zha.com/ was also reviewed for its image-led project presentation and content structure. The implementation, monogram and animation system here are original. Browser inspection in this cloud environment was blocked by connection errors; animation control and navigation are checked through DOM and animation-graph fixtures.

## Current preview

https://arcseon.steven0574.chatgpt.site

The footer uses a small brand mark, contact-page link and a localized contact-details-pending message until public contact information is provided.
