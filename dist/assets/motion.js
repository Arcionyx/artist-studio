/** Scroll chapters, real horizontal scrolling, image parallax and page transitions.
 * Motion is disabled by the operating system preference; navigation stays native.
 */
export function mountMotion({onChapter=()=>{},onScrollMode=()=>{}}={}) {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const story=document.querySelector('.hero-story');
 const reels=[...document.querySelectorAll('[data-motion-reel]')];
 const media=[...document.querySelectorAll('[data-parallax]')];
 let frame=0,destroyed=false,controlled=false,lastChapter=-1;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function update(){
  frame=0;if(destroyed)return;
  const h=window.innerHeight||800;
  if(story){
   const r=story.getBoundingClientRect();const travel=r.height-h;
   const progress=!reduced.matches&&travel>20?clamp(-r.top/travel):0;
   const nextControlled=!reduced.matches&&progress>.025&&progress<.99;
   story.style.setProperty('--story-progress',progress.toFixed(4));
   if(controlled!==nextControlled){controlled=nextControlled;onScrollMode(controlled)}
   if(controlled){const chapter=Math.min(2,Math.floor(progress*3));if(chapter!==lastChapter){lastChapter=chapter;onChapter(chapter)}}else lastChapter=-1;
   window.dispatchEvent(new CustomEvent('steven-scroll',{detail:progress}));
  }
  for(const reel of reels){
   const viewport=reel.querySelector('.motion-rail');if(!viewport)continue;
   const r=reel.getBoundingClientRect();const travel=r.height-h;
   if(!reduced.matches&&window.innerWidth>850&&travel>20&&r.top<h&&r.bottom>0){
    const p=clamp(-r.top/travel);const left=p*(viewport.scrollWidth-viewport.clientWidth);
    if(Math.abs(viewport.scrollLeft-left)>1)viewport.scrollLeft=left;
   }
  }
  if(!reduced.matches)for(const el of media){const r=el.getBoundingClientRect();if(r.height>0&&r.bottom>0&&r.top<h)el.style.setProperty('--media-shift',`${((h-r.top)/(h+r.height)-.5)*85}px`)}
  const footer=document.querySelector('.footer-wordmark');if(footer&&!reduced.matches){const r=footer.getBoundingClientRect();footer.style.setProperty('--wordmark-shift',`${(1-clamp((h-r.top)/h))*45}px`)}
 }
 const schedule=()=>{if(!frame&&!destroyed)frame=requestAnimationFrame(update)};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);schedule();
 const reelHandlers=[];
 for(const reel of reels){for(const button of reel.querySelectorAll('[data-reel-step]')){const handler=()=>{const rail=reel.querySelector('.motion-rail');const card=rail.querySelector('.motion-card');const distance=card?.getBoundingClientRect().width||rail.clientWidth*.8;const step=Number(button.dataset.reelStep)*(distance+28);const rect=reel.getBoundingClientRect();const travel=rect.height-window.innerHeight;const maxLeft=rail.scrollWidth-rail.clientWidth;if(!reduced.matches&&window.innerWidth>850&&travel>20&&maxLeft>0){const ratio=clamp((rail.scrollLeft+step)/maxLeft);window.scrollTo({top:window.scrollY+rect.top+ratio*travel,behavior:'smooth'})}else rail.scrollBy({left:step,behavior:reduced.matches?'instant':'smooth'})};button.addEventListener('click',handler);reelHandlers.push([button,handler])}}
 const navigate=e=>{
  if(reduced.matches||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[href]');if(!a||a.hasAttribute('download')||a.target==='_blank')return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||!url.pathname.endsWith('.html')||url.hash||(url.pathname===location.pathname&&url.search===location.search))return;
  e.preventDefault();document.body.classList.add('is-leaving');
  window.setTimeout(()=>location.assign(url.href),580);
 };
 document.addEventListener('click',navigate);
 const restore=()=>document.body.classList.remove('is-leaving');window.addEventListener('pageshow',restore);
 return {
  goToChapter(index){if(!story||reduced.matches){onChapter(index);return}const r=story.getBoundingClientRect();const travel=r.height-(window.innerHeight||800);if(travel<=20){onChapter(index);return}const y=window.scrollY+r.top+(index+.15)/3*travel;window.scrollTo({top:y,behavior:'smooth'})},
  destroy(){destroyed=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);document.removeEventListener('click',navigate);window.removeEventListener('pageshow',restore);reelHandlers.forEach(([button,handler])=>button.removeEventListener('click',handler))}
 };
}
