import * as THREE from './three.module.min.js';
export function mountScene(container, options={}) {
 let renderer;
 try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}catch{return()=>{}}
 const reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
 renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 container.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(37,1,.1,100);camera.position.set(3.5,2.3,7.5);camera.lookAt(0,-.1,0);
 scene.add(new THREE.HemisphereLight(0xfff6da,0xb9794f,2.6));
 const key=new THREE.DirectionalLight(0xfff2d5,4.2);key.position.set(-3,7,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.025;key.shadow.bias=-.0001;key.shadow.radius=5;scene.add(key);
 const fill=new THREE.DirectionalLight(0xffd6a5,1.2);fill.position.set(5,2,-2);scene.add(fill);
 const cream=new THREE.MeshStandardMaterial({color:0xf4dfb6,roughness:.59,metalness:.02});
 const clay=new THREE.MeshStandardMaterial({color:0xb65032,roughness:.52,metalness:.025});
 const gold=new THREE.MeshStandardMaterial({color:0xf2bf68,roughness:.47,metalness:.04});
 const pedestalMat=new THREE.MeshStandardMaterial({color:0xf6e7ca,roughness:.92});
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.17}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.84;floor.receiveShadow=true;scene.add(floor);
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.48,1.48,.27,96),pedestalMat);pedestal.position.y=-1.70;pedestal.castShadow=true;pedestal.receiveShadow=true;scene.add(pedestal);
 const root=new THREE.Group();scene.add(root);
 const groups=[new THREE.Group(),new THREE.Group(),new THREE.Group()];
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.92,.32,64,128),cream);ring.scale.set(1,1.22,1);ring.rotation.set(.18,.18,-.45);ring.position.set(0,.05,0);groups[0].add(ring);
 const bead=new THREE.Mesh(new THREE.SphereGeometry(.33,48,32),clay);bead.position.set(.95,-1.13,.25);groups[0].add(bead);
 const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(.7,.235,180,32,2,3),clay);knot.scale.setScalar(1.15);knot.rotation.set(.2,.4,.2);groups[1].add(knot);
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(.96,64,48),cream);sphere.position.set(-.18,0,0);groups[2].add(sphere);
 const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.28,.075,24,128),gold);orbit.rotation.set(1.02,-.34,-.45);groups[2].add(orbit);
 groups.forEach((g,i)=>{g.traverse(obj=>{if(obj.isMesh){obj.castShadow=true;obj.receiveShadow=true}});g.visible=i===(options.slide||0);root.add(g)});
 let stopped=false,paused=!!options.reduced,visible=true,dragging=false,dragX=0,dragY=0,userX=0,userY=0,targetX=0,targetY=0,needsRender=true,frame=0,last=0;
 const size=()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();needsRender=true};
 const resize=new ResizeObserver(size);resize.observe(container);size();
 const down=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;dragX=e.clientX;dragY=e.clientY;if(e.pointerType==='mouse')container.setPointerCapture(e.pointerId)};
 const move=e=>{if(dragging){userY+=(e.clientX-dragX)*.007;userX+=(e.clientY-dragY)*.004;userX=Math.max(-.65,Math.min(.65,userX));dragX=e.clientX;dragY=e.clientY;needsRender=true}else if(e.pointerType==='mouse'&&!reducedQuery.matches){const r=container.getBoundingClientRect();targetY=((e.clientX-r.left)/r.width-.5)*.25;targetX=((e.clientY-r.top)/r.height-.5)*.12;needsRender=true}};
 const up=()=>{dragging=false};const leave=()=>{targetX=0;targetY=0;needsRender=true};
 const slideChange=e=>{groups.forEach((g,i)=>g.visible=i===e.detail);userX=0;userY=0;needsRender=true};
 const motionChange=e=>{paused=e.detail;needsRender=true};
 const visibility=()=>{visible=!document.hidden;needsRender=true};
 container.addEventListener('pointerdown',down);container.addEventListener('pointermove',move);container.addEventListener('pointerup',up);container.addEventListener('pointercancel',up);container.addEventListener('pointerleave',leave);window.addEventListener('pointerup',up);window.addEventListener('stillroom-slide',slideChange);window.addEventListener('stillroom-motion',motionChange);document.addEventListener('visibilitychange',visibility);
 const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting&&!document.hidden;needsRender=true},{threshold:0});observer.observe(container);
 function draw(time){if(stopped)return;frame=requestAnimationFrame(draw);const moving=!paused&&!reducedQuery.matches&&visible;if(!visible||(!moving&&!needsRender)||time-last<33)return;last=time;const seconds=time*.001;root.rotation.y=userY+(moving?Math.sin(seconds*.22)*.17:0)+targetY;root.rotation.x=userX+targetX;root.position.y=moving?Math.sin(seconds*.75)*.065:0;if(moving)groups[1].rotation.y=seconds*.12;renderer.render(scene,camera);needsRender=false;if(!container.parentElement.classList.contains('scene-ready'))container.parentElement.classList.add('scene-ready')}
 draw(0);
 return()=>{stopped=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();container.removeEventListener('pointerdown',down);container.removeEventListener('pointermove',move);container.removeEventListener('pointerup',up);container.removeEventListener('pointercancel',up);container.removeEventListener('pointerleave',leave);window.removeEventListener('pointerup',up);window.removeEventListener('stillroom-slide',slideChange);window.removeEventListener('stillroom-motion',motionChange);document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove()};
}
