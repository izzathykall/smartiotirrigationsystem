/* One persistent background player per document. Preferences stay local. */
(() => {
 'use strict';
 if (document.getElementById('hub-background-music')) return;
 const PREF='dlh-music-preferences-v1', POSITION='dlh-music-position-v1';
 const clamp=value=>Math.max(0,Math.min(1,Number(value)||0));
 const read=(storage,key)=>{try{return JSON.parse(storage.getItem(key)||'null')}catch{return null}};
 const write=(storage,key,value)=>{try{storage.setItem(key,JSON.stringify(value))}catch{}};
 let preferences=null,position=null;
 try{preferences=read(window.localStorage,PREF)}catch{}
 try{position=read(window.sessionStorage,POSITION)}catch{}
 let volume=preferences&&Number.isFinite(preferences.volume)?clamp(preferences.volume):.25;
 let muted=Boolean(preferences&&preferences.muted),lastVolume=volume||.25;
 let gain=0,transition=null,frame=0,started=false,starting=false,lastSave=0,error=false,leaving=false;
 const graphic=name=>{
  const paths={music:'<path d="M9 18V5l12-3v13M9 9l12-3"/><ellipse cx="5" cy="19" rx="4" ry="3"/><ellipse cx="17" cy="16" rx="4" ry="3"/>',speaker:'<path d="M3 9h4l5-5v16l-5-5H3zm13-2q6 5 0 10m3-13q9 8 0 16"/>',mute:'<path d="M3 9h4l5-5v16l-5-5H3zm13 0 6 6m0-6-6 6"/>',play:'<path d="m7 4 13 8-13 8z"/>'};
  return `<svg viewBox="0 0 24 24" class="hub-music-icon" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
 };
 const player=document.createElement('section');player.id='hub-music-player';player.className='hub-music';player.setAttribute('aria-label','Pemain muzik latar');
 player.innerHTML=`<button class="hub-music-toggle" type="button" aria-label="Tetapan bunyi" aria-expanded="false" aria-controls="hub-music-panel" title="Tetapan bunyi">${graphic('speaker')}</button><div id="hub-music-panel" class="hub-music-panel" role="dialog" aria-labelledby="hub-music-heading" hidden><strong id="hub-music-heading">Bunyi</strong><span id="hub-music-status" class="hub-visually-hidden" role="status">Menyediakan muzik…</span><button class="hub-music-start" type="button" data-music-start>${graphic('play')}<span>Mainkan muzik</span></button><label class="hub-music-volume"><span class="hub-volume-high">Kuat</span><span class="hub-visually-hidden">Kelantangan muzik latar</span><input id="hub-music-volume" type="range" min="0" max="100" step="1" orient="vertical" aria-orientation="vertical" value="${Math.round(volume*100)}" aria-label="Kelantangan muzik latar"><span class="hub-volume-low">Perlahan</span><output for="hub-music-volume">${Math.round(volume*100)}%</output></label><button class="hub-music-mute" type="button" data-music-mute aria-pressed="false" aria-label="Senyapkan muzik">${graphic('speaker')}<span>Mute</span></button></div>`;
 const host=document.querySelector('.site-header')||document.querySelector('header .top')||document.querySelector('header');
 if(host){const menu=host.querySelector('.menu-toggle');if(menu)host.insertBefore(player,menu);else host.append(player);host.classList.add('has-music-controls')}else{document.body.prepend(player);player.classList.add('hub-music-standalone')}
 const status=player.querySelector('#hub-music-status'),startButton=player.querySelector('.hub-music-start'),muteButton=player.querySelector('.hub-music-mute'),slider=player.querySelector('input'),output=player.querySelector('output'),toggleButton=player.querySelector('.hub-music-toggle'),panel=player.querySelector('#hub-music-panel');
 function setOpen(open,returnFocus=false){panel.hidden=!open;toggleButton.setAttribute('aria-expanded',String(open));if(open)slider.focus({preventScroll:true});else if(returnFocus)toggleButton.focus({preventScroll:true})}
 toggleButton.addEventListener('click',()=>{setOpen(panel.hidden);if(!started&&!muted&&volume>0)attempt()});
 document.addEventListener('click',event=>{if(!player.contains(event.target))setOpen(false)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();setOpen(false,true)}});
 player.addEventListener('focusout',event=>{if(event.relatedTarget&&!player.contains(event.relatedTarget))setOpen(false)});
 slider.addEventListener('keydown',event=>{let next;if(event.key==='ArrowUp')next=volume+.05;else if(event.key==='ArrowDown')next=volume-.05;else if(event.key==='Home')next=0;else if(event.key==='End')next=1;else return;event.preventDefault();changeVolume(next)});

 const audio=document.createElement('audio');audio.id='hub-background-music';audio.loop=true;audio.autoplay=true;audio.preload='auto';audio.volume=0;audio.muted=muted;audio.setAttribute('aria-hidden','true');
 function remember(){try{write(window.localStorage,PREF,{volume,muted})}catch{}}
 function savePosition(){if(Number.isFinite(audio.currentTime)){try{write(window.sessionStorage,POSITION,{time:audio.currentTime})}catch{}}}
 function update(){
  const silent=muted||volume===0;
  muteButton.innerHTML=graphic(silent?'mute':'speaker')+`<span>${silent?'Hidupkan':'Mute'}</span>`;toggleButton.innerHTML=graphic(silent?'mute':'speaker');muteButton.setAttribute('aria-pressed',String(silent));muteButton.setAttribute('aria-label',silent?'Hidupkan bunyi muzik':'Senyapkan muzik');muteButton.title=silent?'Hidupkan bunyi':'Mute';toggleButton.title=silent?'Tetapan bunyi · Mute':'Tetapan bunyi';
  slider.value=String(Math.round(volume*100));slider.setAttribute('aria-valuetext',`${Math.round(volume*100)} peratus`);output.value=`${Math.round(volume*100)}%`;output.textContent=output.value;
  status.textContent=error?'Fail muzik tidak dapat dimainkan':silent?'Muzik disenyapkan':started&&!audio.paused?'Sedang dimainkan · Berulang':'Klik untuk memainkan muzik';
  startButton.hidden=started&&!audio.paused||error;player.classList.toggle('hub-music-silent',silent);
 }
 function envelope(){
  if(!Number.isFinite(audio.duration)||audio.duration<3)return 1;
  // Soften both ends when the track repeats.
  const n=Math.max(0,Math.min(1,audio.currentTime/1.2,(audio.duration-audio.currentTime)/1.2));
  return n*n*(3-2*n);
 }
 function tick(now){
  frame=0;
  if(transition){const t=Math.max(0,Math.min(1,(now-transition.at)/transition.duration));const eased=t*t*(3-2*t);gain=transition.from+(transition.to-transition.from)*eased;if(t===1){const done=transition.done;transition=null;if(done)done()}}
  audio.volume=clamp(gain*envelope());
  if(!audio.paused||transition)frame=requestAnimationFrame(tick);
 }
 function fade(to,duration=900,done){transition={from:gain,to:clamp(to),at:performance.now(),duration:Math.max(1,duration),done};if(!frame)frame=requestAnimationFrame(tick)}
 async function attempt(){
  if(error||leaving||starting)return;
  if(!audio.paused){update();return}
  starting=true;
  try{await audio.play()}catch{started=false;update()}finally{starting=false}
 }
 function activate(){
  if(error||leaving)return;
  muted=false;if(volume===0)volume=lastVolume||.25;audio.muted=false;remember();fade(volume);update();attempt();
 }
 function toggleMute(){
  if(leaving)return;
  if(muted||volume===0){activate();return}
  muted=true;remember();update();fade(0,450,()=>{if(muted)audio.muted=true});
 }
 function changeVolume(value){
  if(leaving)return;
  volume=clamp(value);if(volume>0)lastVolume=volume;muted=false;audio.muted=false;remember();update();fade(volume,220);attempt();
 }
 audio.addEventListener('loadedmetadata',()=>{if(position&&Number.isFinite(position.time)&&position.time>0&&position.time<audio.duration-1.2){try{audio.currentTime=position.time}catch{}}position=null});
 audio.addEventListener('playing',()=>{if(leaving)return;started=true;gain=0;fade(muted?0:volume,1200);update()});
 audio.addEventListener('pause',update);
 audio.addEventListener('error',()=>{error=true;transition=null;update()});
 audio.addEventListener('timeupdate',()=>{if(performance.now()-lastSave>1000){savePosition();lastSave=performance.now()}});
 slider.addEventListener('input',()=>changeVolume(Number(slider.value)/100));muteButton.addEventListener('click',toggleMute);
 document.addEventListener('click',event=>{const button=event.target.closest('[data-music-start]');if(button){activate();if(!player.contains(button))slider.focus({preventScroll:true})}});
 const gesture=event=>{if(!started&&!muted&&volume>0&&!event.target.closest('[data-music-mute], .hub-music-volume'))attempt()};
 document.addEventListener('pointerdown',gesture,{passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')gesture(event)});
 // Fade before moving between the two supplied HTML pages, then resume the track.
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  const link=event.target.closest('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  let destination;try{destination=new URL(link.href,location.href)}catch{return}
  if(destination.origin!==location.origin||destination.pathname===location.pathname||!/(?:index|ekspres-cilik)\.html$/.test(destination.pathname))return;
  if(!started||audio.paused||muted||volume===0)return;
  event.preventDefault();if(leaving)return;leaving=true;
  fade(0,450,()=>{savePosition();audio.pause();location.assign(destination.href)});
 });
 window.addEventListener('pagehide',()=>{savePosition();audio.pause();if(frame)cancelAnimationFrame(frame);frame=0;transition=null;gain=0;audio.volume=0});
 window.addEventListener('pageshow',event=>{if(event.persisted){leaving=false;attempt()}});
 window.HubMusic={start:activate,setVolume:changeVolume,toggleMute};
 document.body.append(audio);audio.src='lagu-bapaku-pulang.mp3';update();attempt();
})();
