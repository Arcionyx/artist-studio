"""Original Steven Studio vector lettering and a fluid, chamfered ST monogram."""
from pathlib import Path
import json
root=Path('/workspace/sites/artist-studio/dist/assets')
mark_paths=[
 ('currentColor','M118 10H44C32 10 22 17 16 29l-3 6C6 48 15 53 29 53h6c-6-4-3-10 0-16l5-9c3-5 7-6 15-6h26l-6 13 14 16 8-29h10Z'),
 ('currentColor','M40 34h23c15 0 21 4 30 16l6 7-16 17H8l13-13h43c9 0 13-3 13-7s-4-6-11-6H38c-6 0-5-5-2-9Z'),
 ('#bb7444','m101 59 4 5-8 16H86Z')
]
glyphs={
 'S':('M84 0H24L8 14C3 18 0 25 0 32c0 10 8 16 20 16h39c4 0 5 3 2 6l-3 4H13L0 74h61l17-16c12-11 7-26-10-26H25c-4 0-5-3-2-6l6-6h39Z',90),
 'T':('M14 0H96L81 18H58v56H39V18H0Z',96),
 'E':('M18 0h66L69 18H22v11h54L62 45H22v11h62L69 74H0V18Z',84),
 'V':('M0 0h23l30 49L85 0h23L61 74H44Z',108),
 'N':('M0 74V0h20l55 46V0h20v74H75L20 28v46Z',95)
}
# Positive spacing is part of the artwork; nothing depends on a font being installed.
x=0;letter_paths=[]
for char in 'STEVEN':
 path,width=glyphs[char];letter_paths.append((x,path));x+=width+28
width=x-28
mark=''.join(f'<path fill="{color}" d="{path}"/>' for color,path in mark_paths)
letters=''.join(f'<path transform="translate({pos} 0)" d="{path}"/>' for pos,path in letter_paths)
mark_svg=f'<svg class="sun-mark steven-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 92" aria-hidden="true">{mark}</svg>'
word_svg=f'<svg class="steven-wordmark" xmlns="http://www.w3.org/2000/svg" viewBox="-3 -4 {width+6} 82" aria-hidden="true"><g fill="currentColor">{letters}</g></svg>'
(root/'identity.js').write_text('// Original chamfered vector lettering and fluid ST symbol.\nexport const brandMark=()=>'+json.dumps(mark_svg)+';\nexport const brandWordmark=()=>'+json.dumps(word_svg)+';\n')
(root/'steven-symbol.svg').write_text(mark_svg.replace(' aria-hidden="true"','').replace('<path','<title>Steven Studio — fluid ST</title><path',1).replace('currentColor','#292b27'))
(root/'steven-wordmark.svg').write_text(word_svg.replace(' aria-hidden="true"','').replace('<g','<title>Steven Studio — custom vector lettering</title><g',1).replace('currentColor','#292b27'))
favicon=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="23" fill="#f8f7f2"/><g transform="translate(0 18)">{mark.replace("currentColor","#292b27")}</g></svg>'
(root/'favicon.svg').write_text(favicon)
# A standalone editable lockup with intentional clear space and exact SVG artwork.
lockup=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 670"><rect width="1100" height="670" fill="#f8f7f2"/><g transform="translate(486 108)">{mark.replace("currentColor","#292b27")}</g><g transform="translate(180 286) scale({740/width})" fill="#292b27">{letters}</g><text x="550" y="439" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" letter-spacing="13" fill="#6e7565">STUDIO</text></svg>'
(root/'steven-studio-lockup.svg').write_text(lockup)
print(f'Built a {width}-unit custom wordmark, ST symbol, favicon and spacious lockup.')
