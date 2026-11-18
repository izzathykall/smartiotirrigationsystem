const $=s=>document.querySelector(s);
const icon=window.hubIcon;
const courses=[
 {id:'tekno',code:'EDUP6023',en:'Technology',title:'Teknologi untuk Pengajaran dan Pembelajaran',desc:'Kursus utama: nota, tutorial, tugasan dan projek digital.',pet:'bunny',scene:'scene-read',num:'01',rows:[['book','Nota Pembelajaran','notes-tekno'],['clipboard','Tutorial Minggu 1, 2, 3 dan seterusnya','tutorials'],['folder','Tugasan dan Projek','page:projek'],['video','Video Pembelajaran','videos'],['gallery','Galeri Hasil Kerja','page:galeri']]},
 {id:'sejarah',code:'EDUP6013',en:'History of education',title:'Sejarah Pendidikan di Malaysia',desc:'Kenali perjalanan pendidikan dan kisah di sebaliknya.',pet:'bear',scene:'scene-tech',num:'02',rows:[['book','Nota Pembelajaran','notes-sejarah'],['folder','Tugasan KPPB','kppb-sejarah'],['mic','Audio Temu Bual','interview']]},
 {id:'english',code:'MPU6122',en:'English language',title:'English Language Proficiency',desc:'Explore, express and grow your confidence in English.',pet:'cat',scene:'scene-art',num:'03',rows:[['book','Learning Notes','notes-english'],['folder','KPPB Assignments','kppb-english'],['video','Movie Review','movie']]}
];
const resources=[
 {id:'intro',title:'Video Pengenalan',desc:'Kenali pembelajaran digital melalui video intro.',icon:'video',tag:'Video · Teknologi',group:'tekno',url:'https://drive.google.com/file/d/18nhTUSDEzggWSfwlYa3z-1Y-UMchM9gh/view?usp=sharing'},
 {id:'tutorial2',title:'Tutorial Minggu 2',desc:'Bahan tutorial kursus Teknologi untuk Pengajaran dan Pembelajaran.',icon:'clipboard',tag:'Tutorial · EDUP6023',group:'tekno',url:'https://drive.google.com/file/d/16RJcHPJBuI_FVUzDzBrOvqanGIjP8AkR/view?usp=drive_link'},
 {id:'podcast',title:'Podcast Pembelajaran',desc:'Pasang telinga dan terokai perkongsian dalam bentuk audio.',icon:'headphones',tag:'Podcast · Teknologi',group:'tekno',url:'https://www.youtube.com/watch?v=fvmf6XZR3wU&authuser=0'},
 {id:'reels',title:'Reels Pembelajaran',desc:'Perkongsian video pendek untuk diterokai.',icon:'video',tag:'YouTube Shorts · Teknologi',group:'tekno',url:'https://youtube.com/shorts/z7xvbJnaOXA?feature=share&authuser=0'},
 {id:'interview',title:'Audio Temu Bual Sejarah',desc:'Imbas kod QR atau buka pautan untuk mengakses audio temu bual Sejarah.',icon:'mic',tag:'Audio · EDUP6013',group:'kppb',qr:'qr-dokumen-01.svg',url:'https://q.me-qr.com/t83qn6ps'},
 {id:'movie',title:'English Movie Review',desc:'Imbas kod QR atau buka pautan untuk mengakses English Movie Review.',icon:'film',tag:'Movie Review · MPU6122',group:'kppb',qr:'qr-dokumen-02.svg',url:'https://q.me-qr.com/skfboiwj'}
];
const projects=[
 {id:'animation',title:'Video Animasi',desc:'Ruang untuk video animasi projek. Pautan video belum disertakan dalam dokumen.',icon:'film',tag:'Video Animasi'},
 {id:'learning',title:'Ruang Pembelajaran',desc:'Terokai laman asal Ekspres Cilik untuk aktiviti pembelajaran interaktif.',icon:'bus',tag:'Ruang Pembelajaran',url:'https://izzathykall.github.io/EkspresCilik/'}
];
function courseCard(c,full=false){return `<article class="course-card ${c.id}"><${full?'div':`a href="#portfolio" data-course="${c.id}"`} class="course-art" ${full?'':`aria-label="Terokai ${c.title}"`}><span class="course-code">${c.code}</span>${icon('sparkle','art-star')}<svg class="course-scene" viewBox="0 0 320 280" aria-hidden="true"><use href="#${c.scene}"/></svg></${full?'div':'a'}><div class="course-content"><small>${c.en}</small><h3>${c.title}</h3><p>${c.desc}</p>${full?`<div class="course-rows">${c.rows.map(r=>`<button class="course-row" data-open="${r[2]}"><span class="row-icon" aria-hidden="true">${icon(r[0])}</span>${r[1]}<span class="row-arrow" aria-hidden="true">${icon('external')}</span></button>`).join('')}</div>`:`<a href="#portfolio" data-course="${c.id}" class="card-bottom">Terokai kursus <span class="arrow" aria-hidden="true">${icon('external')}</span></a>`}</div></article>`}

function filterCourses(id){$('#portfolio-courses').innerHTML=courses.filter(c=>id==='all'||c.id===id).map(c=>courseCard(c,true)).join('');document.querySelectorAll('[data-filter]').forEach(b=>{const yes=b.dataset.filter===id;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',yes)})}
filterCourses('all');
function resourceCard(r){return `<article class="resource-card ${r.qr?'has-resource-qr':''}"><span class="resource-icon" aria-hidden="true">${icon(r.icon)}</span><small>${r.tag}</small><h3>${r.title}</h3><p>${r.desc}</p>${r.qr?`<figure class="resource-qr"><img src="${r.qr}" width="190" height="190" alt="Kod QR untuk ${r.title}"><figcaption>Imbas untuk membuka bahan</figcaption></figure>`:''}${r.url?`<a href="${r.url}" target="_blank" rel="noopener noreferrer" aria-label="Buka ${r.title}">${r.qr?'Buka bahan':r.id==='learning'?'Buka ruang pembelajaran':r.id==='interview'?'Buka audio temu bual':r.id==='movie'?'Buka movie review':r.id==='podcast'?'Buka podcast':'Buka bahan'} ${icon('external')}<span class="sr-only"> (tab baharu)</span></a>`:'<span class="unavailable">Pautan belum disertakan</span>'}</article>`}

$('#project-list').innerHTML=projects.map(resourceCard).join('');
let resourceGroup='all';
function renderResources(){
 const q=$('#search').value.toLocaleLowerCase('ms');
 const result=resources.filter(r=>(resourceGroup==='all'||r.group===resourceGroup)&&`${r.title} ${r.desc} ${r.tag}`.toLocaleLowerCase('ms').includes(q));
 $('#resource-list').innerHTML=['tekno','kppb'].map(group=>{
  const items=result.filter(r=>r.group===group);
  return items.length?`<section class="folder-section" aria-labelledby="folder-${group}"><div class="folder-heading"><span class="folder-icon">${icon('folder')}</span><div><h2 id="folder-${group}">${group==='tekno'?'Folder Teknologi':'Folder KPPB'}</h2><p>${group==='tekno'?'EDUP6023 · Video intro, tutorial, podcast dan Reels':'Sejarah & English · Audio temu bual dan movie review'}</p></div></div><div class="resource-grid">${items.map(resourceCard).join('')}</div></section>`:'';
 }).join('');
 $('#no-results').hidden=result.length>0;
}
renderResources();$('#search').addEventListener('input',renderResources);
const pages=[['pengenalan','Pengenalan'],['portfolio','My Learning Portfolio'],['projek','Tugasan dan Projek'],['kuiz','Uji Kefahaman'],['galeri','Galeri Hasil Kerja'],['bahan','Folder Bahan Pembelajaran'],['penutup','Penutup']];
function showPage(){
 const id=location.hash.slice(1)||'pengenalan';const index=Math.max(0,pages.findIndex(p=>p[0]===id));const [valid,title]=pages[index];
 document.querySelectorAll('.page').forEach(p=>{p.hidden=p.id!==valid;p.classList.toggle('active',p.id===valid)});
 document.querySelectorAll('[data-page]').forEach(a=>{const yes=a.dataset.page===valid;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 document.title=`${title} · Digital Learning Hub`;
 $('.nav-inner').classList.remove('expanded');$('.menu-toggle').setAttribute('aria-expanded','false');
 $('#flow-progress').textContent='';
 $('#flow-previous').hidden=index===0;
 if(index>0){$('#flow-previous').href=`#${pages[index-1][0]}`;$('#flow-previous').innerHTML=`${icon('left')}<span><small>Sebelumnya</small>${pages[index-1][1]}</span>`}
 const next=pages[(index+1)%pages.length];$('#flow-next').href=`#${next[0]}`;$('#flow-next').innerHTML=`<span><small>${index===pages.length-1?'Kembali ke mula':'Seterusnya'}</small>${next[1]}</span>${icon('right')}`;
 if(location.hash){window.scrollTo({top:0,behavior:'instant'});$('#kandungan').focus({preventScroll:true})}
}
window.addEventListener('hashchange',showPage);showPage();
$('.menu-toggle').addEventListener('click',()=>{const expanded=$('.nav-inner').classList.toggle('expanded');$('.menu-toggle').setAttribute('aria-expanded',expanded)});
document.addEventListener('click',e=>{const course=e.target.closest('[data-course]');if(course)filterCourses(course.dataset.course);const filter=e.target.closest('[data-filter]');if(filter)filterCourses(filter.dataset.filter);const tab=e.target.closest('[data-resource]');if(tab){resourceGroup=tab.dataset.resource;document.querySelectorAll('[data-resource]').forEach(b=>{const yes=b===tab;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',yes)});renderResources()}const open=e.target.closest('[data-open]');if(open)openResource(open.dataset.open)});
const fullContent=window.HUB_CONTENT||{};
for(const [key,selector] of [['intro','#intro-full'],['portfolio','#portfolio-full'],['closing','#closing-full']]){$(selector).innerHTML=(fullContent[key]||[]).map(p=>`<p>${p}</p>`).join('')}
const dialog=$('#resource-dialog');
const collections={
 'notes-tekno':{title:'Nota Pembelajaran',label:'EDUP6023 · TEKNOLOGI',icon:'book',text:'Koleksi nota bagi kursus Teknologi untuk Pengajaran dan Pembelajaran.',missing:'Fail atau pautan nota belum disertakan dalam dokumen.'},
 'notes-sejarah':{title:'Nota Pembelajaran',label:'EDUP6013 · SEJARAH',icon:'book',text:'Koleksi nota bagi kursus Sejarah Pendidikan di Malaysia.',missing:'Fail atau pautan nota belum disertakan dalam dokumen.'},
 'notes-english':{title:'Learning Notes',label:'MPU6122 · ENGLISH',icon:'book',text:'A space for English Language Proficiency learning notes.',missing:'The document does not include links to learning notes yet.'},
 tutorials:{title:'Tutorial Mingguan',label:'EDUP6023 · TEKNOLOGI',icon:'clipboard',text:'Bahan tutorial disusun mengikut minggu untuk memudahkan rujukan.',items:['tutorial2'],missing:'Pautan Minggu 1, Minggu 3 dan minggu seterusnya belum disertakan.'},
 videos:{title:'Video Pembelajaran',label:'EDUP6023 · TEKNOLOGI',icon:'video',text:'Tonton dan dengar bahan pembelajaran berikut.',items:['intro','reels','podcast']},
 'kppb-sejarah':{title:'Tugasan KPPB Sejarah',label:'EDUP6013 · KPPB',icon:'mic',text:'Dokumentasi hasil kerja kursus Sejarah Pendidikan di Malaysia.',items:['interview']},
 'kppb-english':{title:'KPPB Assignments',label:'MPU6122 · KPPB',icon:'film',text:'A collection of work for English Language Proficiency.',items:['movie']}
};
function openResource(id){if(id.startsWith('page:')){location.hash=id.slice(5);return}let info=collections[id];if(!info){const r=resources.find(r=>r.id===id);if(r)info={title:r.title,label:r.tag,icon:r.icon,text:r.desc,items:r.url?[r.id]:[],missing:r.url?'':'Pautan bahan belum disertakan.'}}if(!info)return;$('#dialog-icon').innerHTML=icon(info.icon);$('#dialog-label').textContent=info.label;$('#dialog-title').textContent=info.title;$('#dialog-body').innerHTML=`<p>${info.text}</p>${info.missing?`<div class="empty-state">${icon('leaf')} ${info.missing}</div>`:''}`;$('#dialog-actions').innerHTML=(info.items||[]).map(id=>resources.find(r=>r.id===id)).filter(Boolean).map(r=>`<a class="button primary" href="${r.url}" target="_blank" rel="noopener noreferrer">${icon(r.icon)} ${r.title} <span>${icon('external')}</span></a>`).join('');dialog.showModal()}
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
