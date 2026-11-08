import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {copy,languages} from '../dist/assets/content.js';
import assert from 'node:assert/strict';
import {direction} from '../dist/assets/direction.js';
const base=Object.keys(copy.en).sort();
for(const [lang] of languages){assert.deepEqual(Object.keys(copy[lang]).sort(),base,`${lang}: translation keys`);for(const [key,value] of Object.entries(copy.en)){if(Array.isArray(value))assert.equal(copy[lang][key].length,value.length,`${lang}.${key}: list length`)}assert.equal(copy[lang].nav.length,6);assert.deepEqual(Object.keys(direction[lang]).sort(),Object.keys(direction.en).sort());assert.equal(direction[lang].titles.length,3)}
for(const page of ['index','design','shop','studio','journal','contact']){const html=readFileSync(`dist/${page}.html`,'utf8');assert.ok(html.includes('assets/app.js'));assert.ok(html.includes('name="viewport"'));assert.ok(html.includes('meta name="description"'))}
for(const file of readdirSync('dist/assets')){if(!file.endsWith('.js'))continue;const text=readFileSync(`dist/assets/${file}`,'utf8');for(const m of text.matchAll(/(?:from|import)\s*['"](\.\.?\/[^'"]+)['"]/g)){assert.ok(existsSync(new URL(m[1],new URL(`../dist/assets/${file}`,import.meta.url))),`Missing import ${file} -> ${m[1]}`)}}
assert.ok(existsSync('dist/assets/three.core.min.js'));
for(const name of ['rest','form','light']) assert.ok(existsSync(`dist/assets/study-${name}.jpg`),`Missing rendered study ${name}`);
console.log('Verified: 6 pages, 5 complete locale dictionaries, local assets and module imports.');
