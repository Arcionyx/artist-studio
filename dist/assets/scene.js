import * as THREE from './three.module.min.js';

// Original folded surfaces. The geometry is also used in design-source/render-studies.py.
function surfacePoint(u, v, variant = 0) {
 const twist = u * (variant === 2 ? 1 : .5) + [ .28, .7, .45 ][variant];
 const radius = 2 + .15 * Math.sin(3 * u);
 const width = .63 + .16 * Math.sin(u + .4);
 const x = (radius + width * v * Math.cos(twist)) * Math.cos(u);
 const y = (1.2 + width * v * Math.cos(twist)) * Math.sin(u);
 const z = width * v * Math.sin(twist) + .38 * Math.sin(2 * u);
 const a = .91;
 return new THREE.Vector3(x, y * Math.sin(a) + z * Math.cos(a), -y * Math.cos(a) + z * Math.sin(a));
}
function foldedGeometry(variant) {
 const positions = [], indices = [], U = 220, V = 28;
 for (let i = 0; i <= U; i++) for (let j = 0; j <= V; j++) {
  const p = surfacePoint(i / U * Math.PI * 2, j / V * 2 - 1, variant);
  positions.push(p.x, p.y, p.z);
 }
 for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) {
  const a = i * (V + 1) + j;
  indices.push(a, a + 1, a + V + 2, a, a + V + 2, a + V + 1);
 }
 const geometry = new THREE.BufferGeometry();
 geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
 geometry.setIndex(indices); geometry.computeVertexNormals();
 return geometry;
}
function buildStudy(variant, material) {
 const group = new THREE.Group();
 const surface = new THREE.Mesh(foldedGeometry(variant), material);
 surface.castShadow = true; surface.receiveShadow = true; group.add(surface);
 const contours = new THREE.Group();
 const contourMat = new THREE.LineBasicMaterial({color:0x8f6c49, transparent:true, opacity:.7});
 for (let i = 0; i < 19; i++) {
  const points = [];
  for (let j = 0; j <= 220; j++) points.push(surfacePoint(j / 220 * Math.PI * 2, i / 18 * 2 - 1, variant));
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), contourMat);
  contours.add(line);
 }
 contours.visible = false; group.add(contours);
 // Finished boundary lines catch light and articulate the surface without a heavy wireframe.
 for (const v of [-1,1]) {
  const points=[];
  for (let j=0;j<=220;j++) points.push(surfacePoint(j/220*Math.PI*2,v,variant));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0xa48154,transparent:true,opacity:.45})));
 }
 group.rotation.y = [.3,-.24,-.9][variant];
 group.userData = {surface,contours};
 return group;
}
export function mountScene(container, options={}) {
 let renderer;
 try { renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'}); }
 catch { return ()=>{}; }
 const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
 renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
 renderer.setClearColor(0x000000,0);
 renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 renderer.outputColorSpace = THREE.SRGBColorSpace;
 renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
 renderer.domElement.setAttribute('aria-hidden','true'); container.appendChild(renderer.domElement);
 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(-4,4,3,-3,.1,100);
 camera.position.set(5.3,3.5,8.2); camera.lookAt(0,-.05,0);
 scene.add(new THREE.HemisphereLight(0xfff9eb,0xbaa18a,2.8));
 const key = new THREE.DirectionalLight(0xfff7e7,4.1);
 key.position.set(-4,7,5); key.castShadow = true;
 key.shadow.mapSize.set(1024,1024);
 Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5});
 key.shadow.normalBias=.04; key.shadow.bias=-.0002; key.shadow.radius=5; scene.add(key);
 const fill = new THREE.DirectionalLight(0xffe1b4,1.3); fill.position.set(5,3,-3); scene.add(fill);
 const rim = new THREE.DirectionalLight(0xffffff,2.2); rim.position.set(1,3,-6); scene.add(rim);
 const colors = [0xe2d7bd,0xb76a45,0xefebe1];
 const studies = colors.map((color,i)=>buildStudy(i,new THREE.MeshPhysicalMaterial({color,roughness:.35,metalness:.06,clearcoat:.28,clearcoatRoughness:.35,side:THREE.DoubleSide,transparent:true,opacity:1})));
 const root = new THREE.Group(); root.position.x=.55; scene.add(root);
 studies.forEach((g,i)=>{g.visible=i===(options.slide||0);root.add(g)});
 const floor = new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.105}));
 floor.rotation.x=-Math.PI/2;floor.position.y=-1.62;floor.receiveShadow=true;scene.add(floor);
 let stopped=false,paused=!!options.reduced,inViewport=true,dragging=false,userX=0,userY=0,targetX=0,targetY=0,dragX=0,dragY=0,needsRender=true,frame=0,last=0,progress=0,mode='surface';
 function size(){
  const {width,height}=container.getBoundingClientRect();if(!width||!height)return;
  renderer.setSize(width,height,false);const ratio=width/height;
  const halfHeight=ratio<.9?3.3:2.75;
  camera.left=-halfHeight*ratio;camera.right=halfHeight*ratio;camera.top=halfHeight;camera.bottom=-halfHeight;
  camera.updateProjectionMatrix();root.scale.setScalar(ratio<.75?.85:1);root.position.x=ratio<.9?0:.55;needsRender=true;
 }
 const resize = new ResizeObserver(size);resize.observe(container);size();
 const down=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;dragX=e.clientX;dragY=e.clientY;if(e.pointerType==='mouse')container.setPointerCapture(e.pointerId)};
 const move=e=>{if(dragging){userY+=(e.clientX-dragX)*.006;userX+=(e.clientY-dragY)*.004;userX=Math.max(-.65,Math.min(.65,userX));dragX=e.clientX;dragY=e.clientY;needsRender=true}else if(e.pointerType==='mouse'&&!reducedQuery.matches){const r=container.getBoundingClientRect();targetY=((e.clientX-r.left)/r.width-.5)*.16;targetX=((e.clientY-r.top)/r.height-.5)*.08;needsRender=true}};
 const up=()=>{dragging=false};const leave=()=>{targetX=0;targetY=0;needsRender=true};
 const keyboard=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(e.key==='Home'){userX=0;userY=0}else if(e.key==='ArrowLeft')userY-=.12;else if(e.key==='ArrowRight')userY+=.12;else if(e.key==='ArrowUp')userX-=.1;else userX+=.1;needsRender=true};
 const changeSlide=e=>{studies.forEach((g,i)=>g.visible=i===e.detail);userX=0;userY=0;needsRender=true};
 const changeMotion=e=>{paused=e.detail;needsRender=true};
 const changeView=e=>{mode=e.detail;studies.forEach(g=>{g.userData.contours.visible=mode==='structure';g.userData.surface.material.opacity=mode==='structure'?.07:1;g.userData.surface.castShadow=mode!=='structure'});needsRender=true};
 const reset=()=>{userX=0;userY=0;targetX=0;targetY=0;needsRender=true};
 const scroll=()=>{const r=container.parentElement.getBoundingClientRect();progress=Math.max(0,Math.min(1,-r.top/r.height));needsRender=true};
 const visibility=()=>{needsRender=true};
 const listenerList=[[container,'pointerdown',down],[container,'pointermove',move],[container,'pointerup',up],[container,'pointercancel',up],[container,'pointerleave',leave],[container,'keydown',keyboard],[window,'pointerup',up],[window,'stillroom-slide',changeSlide],[window,'stillroom-motion',changeMotion],[window,'stillroom-view',changeView],[window,'stillroom-reset',reset],[window,'scroll',scroll],[document,'visibilitychange',visibility]];
 listenerList.forEach(([target,event,fn])=>target.addEventListener(event,fn,event==='scroll'?{passive:true}:undefined));
 const observer=new IntersectionObserver(([e])=>{inViewport=e.isIntersecting;needsRender=true},{threshold:0});observer.observe(container);
 function draw(time){
  if(stopped)return;frame=requestAnimationFrame(draw);
  const moving=!paused&&!reducedQuery.matches&&inViewport&&!document.hidden;
  if(!inViewport||document.hidden||(!moving&&!needsRender)||time-last<33)return;
  last=time;const seconds=time*.001;
  root.rotation.y=userY+targetY+(moving?Math.sin(seconds*.2)*.11+progress*.23:0);
  root.rotation.x=userX+targetX+(moving?progress*.09:0);
  root.position.y=moving?Math.sin(seconds*.6)*.055:0;
  renderer.render(scene,camera);needsRender=false;container.parentElement.classList.add('scene-ready');
 }
 draw(0);
 const contextLost=e=>{e.preventDefault();container.parentElement.classList.remove('scene-ready');stopped=true;cancelAnimationFrame(frame)};
 renderer.domElement.addEventListener('webglcontextlost',contextLost);
 return()=>{stopped=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();listenerList.forEach(([target,event,fn])=>target.removeEventListener(event,fn));scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove()};
}
