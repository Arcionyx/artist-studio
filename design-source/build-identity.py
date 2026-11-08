"""ARCSEON: original open-arc A emblem and chamfered geometric lettering."""
from pathlib import Path
import json
from html import escape
root=Path('/workspace/sites/artist-studio/dist/assets')
mark_paths=[
 ('currentColor','M8 80 45 14c4-7 14-7 19 0l40 66H82L54 33 28 80Z'),
 ('#bb7444','M35 61c10-11 29-11 42 0l8 14c-19-13-38-12-57 1Z')
]
glyphs={
 'A':('M0 74 36 0h21l40 74H74l-7-15H27L20 74Zm36-33h22L46 17Z',97),
 'R':('M0 74V0h58c24 0 36 12 36 29 0 13-7 23-20 27l25 18H68L40 53H21v21Zm21-56v18h33c10 0 17-2 17-9s-7-9-17-9Z',99),
 'C':('M89 0H24L7 17C2 22 0 30 0 37s2 15 7 20l17 17h65L74 56H32l-9-9V27l9-9h42Z',89),
 'S':('M84 0H24L8 14C3 18 0 25 0 32c0 10 8 16 20 16h39c4 0 5 3 2 6l-3 4H13L0 74h61l17-16c12-11 7-26-10-26H25c-4 0-5-3-2-6l6-6h39Z',90),
 'E':('M18 0h66L69 18H22v11h54L62 45H22v11h62L69 74H0V18Z',84),
 'O':('M23 0h47l21 20v34L70 74H23L0 53V21Zm8 18L21 28v18l10 10h31l9-10V28L61 18Z',91),
 'N':('M0 74V0h20l55 46V0h20v74H75L20 28v46Z',95)
}
x=0;letter_paths=[]
for char in 'ARCSEON':
 path,width=glyphs[char];letter_paths.append((x,path));x+=width+24
width=x-24
mark=''.join(f'<path fill="{color}" d="{path}"/>' for color,path in mark_paths)
letters=''.join(f'<path transform="translate({pos} 0)" d="{path}"/>' for pos,path in letter_paths)
mark_svg=f'<svg class="sun-mark arcseon-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 92" aria-hidden="true">{mark}</svg>'
word_svg=f'<svg class="arcseon-wordmark" xmlns="http://www.w3.org/2000/svg" viewBox="-3 -4 {width+6} 82" aria-hidden="true"><g fill="currentColor" fill-rule="evenodd">{letters}</g></svg>'
(root/'identity.js').write_text('// Original open-arc A emblem and ARCSEON vector lettering.\nexport const brandMark=()=>'+json.dumps(mark_svg)+';\nexport const brandWordmark=()=>'+json.dumps(word_svg)+';\n')
(root/'arcseon-symbol.svg').write_text(mark_svg.replace(' aria-hidden="true"','').replace('<path','<title>ARCSEON — open arc</title><path',1).replace('currentColor','#292b27'))
(root/'arcseon-wordmark.svg').write_text(word_svg.replace(' aria-hidden="true"','').replace('<g','<title>ARCSEON — custom vector lettering</title><g',1).replace('currentColor','#292b27'))
(root/'favicon.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="23" fill="#f8f7f2"/><g transform="translate(8 18)">{mark.replace("currentColor","#292b27")}</g></svg>')
lockup=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 670"><rect width="1100" height="670" fill="#f8f7f2"/><g transform="translate(494 108)">{mark.replace("currentColor","#292b27")}</g><g transform="translate(155 286) scale({790/width})" fill="#292b27" fill-rule="evenodd">{letters}</g><text x="550" y="439" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" letter-spacing="7" fill="#6e7565">ART / OBJECTS</text></svg>'
(root/'arcseon-lockup.svg').write_text(lockup)
print(f'Built ARCSEON: seven custom letters, a {width}-unit wordmark, open-arc A and favicon.')
