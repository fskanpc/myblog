/* =========================================================
   ENGLISH CLASS: lessons with a video (link or uploaded file), photos and notes
   ========================================================= */
const ENG_SKILLS = [['listening','การฟัง'], ['speaking','การพูด'], ['reading','การอ่าน'], ['writing','การเขียน'], ['grammar','ไวยากรณ์'], ['vocab','คลังคำ'], ['pronunciation','การออกเสียง']];
const ENG_SKILL_COLOR = {listening:'#4FAEFF', speaking:'#FF7FA8', reading:'#3EC6A6', writing:'#A77BFF', grammar:'#F2A92A', vocab:'#F7B928', pronunciation:'#6F8DFF'};
const ENG_LEVELS = ['A1','A2','B1','B2','C1','C2'];
const ENG_STATUS = [['todo','อยากเรียน'], ['learning','กำลังเรียน'], ['done','เรียนจบแล้ว']];
const ENG_MAX_MB = 50;   // Supabase free plan: 50 MB per file
const engLabel = (list, v) => (list.find(x => x[0] === v) || [, ''])[1];

/* turn a pasted link into something we can play: YouTube, Vimeo, Google Drive, or a direct video file */
function engSource(url){
  let u; try{ u = new URL(String(url || '').trim()); }catch(e){ return null; }
  if(!/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.replace(/^(www|m)\./, '');
  const secs = t => { if(!t) return 0; if(/^\d+$/.test(t)) return +t; const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t); return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0; };
  let yt = null;
  if(host === 'youtu.be') yt = u.pathname.slice(1, 12);
  else if(/(^|\.)youtube(-nocookie)?\.com$/.test(host)) yt = u.searchParams.get('v') || (/^\/(?:embed|shorts|live|v)\/([\w-]{11})/.exec(u.pathname) || [])[1];
  if(yt && /^[\w-]{11}$/.test(yt)) return {kind:'youtube', id:yt, start:secs(u.searchParams.get('t') || u.searchParams.get('start')), thumb:`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`};
  const vm = host === 'vimeo.com' && /^\/(\d+)/.exec(u.pathname);
  if(vm) return {kind:'vimeo', id:vm[1]};
  const gd = host === 'drive.google.com' && /\/file\/d\/([\w-]+)/.exec(u.pathname);
  if(gd) return {kind:'drive', id:gd[1]};
  if(/\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(u.pathname)) return {kind:'file', src:u.href};
  return {kind:'link', src:u.href};
}
function engThumb(l){
  if(l.cover) return l.cover;
  const s = engSource(l.video);
  if(s && s.thumb) return s.thumb;
  return (l.images || [])[0] || '';
}
const engHasVideo = l => !!(l.videoPath || l.video);

/* player markup; start = seconds to jump to */
function engPlayer(l, fileUrl, start = 0, autoplay = false){
  if(l.videoPath){
    if(!fileUrl) return `<div class="eng-novideo">${ic('video')}<p>โหลดวิดีโอไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง</p></div>`;
    return `<video class="eng-video" src="${escT(fileUrl)}#t=${start}" controls playsinline preload="metadata" ${autoplay ? 'autoplay' : ''}></video>`;
  }
  const s = engSource(l.video);
  const frame = src => `<iframe src="${escT(src)}" title="${escT(l.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  if(!s) return '';
  if(s.kind === 'youtube') return frame(`https://www.youtube-nocookie.com/embed/${s.id}?rel=0&playsinline=1${(start || s.start) ? `&start=${start || s.start}` : ''}${autoplay ? '&autoplay=1' : ''}`);
  if(s.kind === 'vimeo') return frame(`https://player.vimeo.com/video/${s.id}${autoplay ? '?autoplay=1' : ''}${start ? `#t=${start}s` : ''}`);
  if(s.kind === 'drive') return frame(`https://drive.google.com/file/d/${s.id}/preview`);
  if(s.kind === 'file') return `<video class="eng-video" src="${escT(s.src)}#t=${start}" controls playsinline preload="metadata" ${autoplay ? 'autoplay' : ''}></video>`;
  return `<a class="eng-novideo link" href="${escT(s.src)}" target="_blank" rel="noopener">${ic('link')}<p>เปิดวิดีโอในแท็บใหม่</p></a>`;
}

/* notes: "1:23" or "01:02:03" become buttons that jump the video there */
function engNotesHTML(text){
  return esc(text || '').replace(/\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/g, (m, hh, mm, ss) => {
    const t = (+hh || 0) * 3600 + (+mm) * 60 + (+ss);
    return `<button type="button" class="eng-ts" data-t="${t}">${m}</button>`;
  });
}

/* ---------- form ---------- */
let engPendingFile = null;   // a picked video file waits here until the lesson is saved
function engVideoField(v){
  const box = h(`<div class="eng-vin">
    <input type="url" placeholder="วางลิงก์ YouTube, Vimeo หรือ Google Drive" aria-label="ลิงก์วิดีโอ">
    <div class="eng-vrow"><span class="muted">หรือ</span><button type="button" class="btn soft eng-up">${ic('video')}<span>อัปโหลดไฟล์วิดีโอ</span></button></div>
    <div class="eng-vfile" hidden><span class="nm"></span><button type="button" class="icon-btn" aria-label="เอาวิดีโอออก">${ic('close')}</button></div>
  </div>`);
  const inp = $('input', box), chip = $('.eng-vfile', box);
  inp.value = v.video || '';
  const paint = () => {
    const name = engPendingFile ? engPendingFile.name : v.videoPath ? (v.videoName || T('ไฟล์วิดีโอ')) : '';
    chip.hidden = !name;
    $('.nm', chip).textContent = name ? `🎬 ${name}` : '';
  };
  inp.oninput = () => {
    v.video = inp.value.trim();
    if(v.video){ engPendingFile = null; v.videoPath = ''; v.videoName = ''; paint(); }
  };
  $('.btn', box).onclick = () => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*';
    i.onchange = () => {
      const file = i.files[0]; if(!file) return;
      if(file.size > ENG_MAX_MB * 1024 * 1024) return toast(L(`ไฟล์ใหญ่เกิน ${ENG_MAX_MB} MB ลองอัปขึ้น YouTube แบบไม่เป็นสาธารณะแล้ววางลิงก์แทน`, `File is over ${ENG_MAX_MB} MB. Try an unlisted YouTube upload and paste the link instead.`));
      engPendingFile = file; v.video = ''; inp.value = ''; v.videoPath = ''; v.videoName = file.name;
      paint();
    };
    i.click();
  };
  $('.icon-btn', chip).onclick = () => { engPendingFile = null; v.videoPath = ''; v.videoName = ''; paint(); };
  paint();
  return box;
}
const engFields = [
  {key:'title', label:'ชื่อบทเรียน', type:'text', required:true, placeholder:'เช่น Present Perfect ใช้ยังไง'},
  {key:'video', label:'วิดีโอ', type:'custom', render:engVideoField, help:`ไฟล์วิดีโอใหญ่ได้ไม่เกิน ${ENG_MAX_MB} MB`},
  {key:'skill', label:'ทักษะ', type:'select', options:ENG_SKILLS, default:'listening'},
  {type:'row', fields:[{key:'level', label:'ระดับ', type:'select', options:[['', '—'], ...ENG_LEVELS], default:''}, {key:'date', label:'วันที่เรียน', type:'date'}]},
  {key:'status', label:'สถานะ', type:'select', options:ENG_STATUS, default:'todo'},
  {key:'cover', label:'รูปปก', type:'image', max:800, budget:90000, help:'ถ้าไม่ใส่ จะใช้ภาพจาก YouTube ให้อัตโนมัติ'},
  {key:'images', label:'รูปภาพประกอบ', type:'images', limit:8, max:1100, budget:120000, help:'สไลด์ โน้ตที่จด หรือภาพจากบทเรียน ใส่ได้สูงสุด 8 ภาพ'},
  {key:'notes', label:'สรุปบทเรียน', type:'textarea', rows:6, placeholder:'จดสิ่งที่ได้เรียน พิมพ์เวลา เช่น 2:15 เพื่อกดข้ามไปช่วงนั้นของวิดีโอได้'}
];
async function engSave(v, before = {}){
  if(engPendingFile){
    toast(L('กำลังอัปโหลดวิดีโอ…', 'Uploading video…'));
    v.videoPath = await Store.uploadVideo(engPendingFile);
    v.videoName = engPendingFile.name;
    v.video = '';
    engPendingFile = null;
  }
  await Store.save('english', v);
  if(before.videoPath && before.videoPath !== v.videoPath) await Store.removeVideo(before.videoPath);
}
const English = {
  add(preset = {}){
    engPendingFile = null;
    openForm({title:L('เพิ่มบทเรียน', 'Add lesson'), fields:engFields, value:preset, onSave: async v => { await engSave(v); rerender(); }});
  },
  edit(l){
    engPendingFile = null;
    openForm({title:L('แก้ไขบทเรียน', 'Edit lesson'), fields:engFields, value:l, onSave: async v => { await engSave(v, l); rerender(); },
      onDelete: async () => { await Store.remove('english', l.id); await Store.removeVideo(l.videoPath); if(location.hash === '#english') rerender(); else location.hash = '#english'; }});
  }
};

/* ---------- list ---------- */
let engFilter = 'all';
function engCard(l){
  const thumb = engThumb(l), c = ENG_SKILL_COLOR[l.skill] || ENG_SKILL_COLOR.listening;
  const a = h(`<a class="eng-card" href="#english/${encodeURIComponent(l.id)}" style="--sc:${c}">
    <span class="eng-thumb">${thumb ? `<img src="${escT(thumb)}" alt="" loading="lazy">` : `<span class="noimg">${ic(engHasVideo(l) ? 'video' : 'english')}</span>`}
      ${engHasVideo(l) ? `<span class="eng-play">${ic('play')}</span>` : ''}
      ${l.level ? `<span class="eng-lv">${escT(l.level)}</span>` : ''}
      ${l.status === 'done' ? `<span class="eng-done">${ic('check')}</span>` : ''}
    </span>
    <span class="eng-meta">
      <span class="eng-skill">${engLabel(ENG_SKILLS, l.skill)}</span>
      <span class="eng-title">${esc(l.title)}</span>
      <span class="eng-sub">${l.date ? thDate(l.date, true) : engLabel(ENG_STATUS, l.status)}${(l.images || []).length ? ` · 🖼 ${(l.images || []).length}` : ''}</span>
    </span>
  </a>`);
  return a;
}
VIEWS.english = async el => {
  const all = [...await Store.list('english')].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
  const id = decodeURIComponent(location.hash.split('/')[1] || '');
  if(id){
    const l = all.find(x => x.id === id);
    if(l) return engWatch(el, l, all);
  }
  const done = all.filter(l => l.status === 'done').length;
  const learning = all.filter(l => l.status === 'learning').length;
  el.append(pageHead(T('ห้องเรียนภาษาอังกฤษ'),
    all.length ? L(`บทเรียน ${all.length} บท · เรียนจบแล้ว ${done} · กำลังเรียน ${learning}`, `${all.length} lessons · ${done} done · ${learning} in progress`) : T('เก็บวิดีโอ รูป และโน้ตการเรียนภาษาอังกฤษไว้ดูซ้ำ'),
    T('เพิ่มบทเรียน'), () => English.add({skill: engFilter === 'all' ? 'listening' : engFilter})));
  if(all.length){
    const pct = Math.round(done / all.length * 100);
    el.append(h(`<div class="eng-prog" aria-label="${L('ความคืบหน้า', 'Progress')} ${pct}%"><i style="width:${pct}%"></i><span>${pct}%</span></div>`));
  }
  const used = ENG_SKILLS.filter(([k]) => all.some(l => l.skill === k));
  if(used.length > 1) el.append(chips([['all', 'ทั้งหมด'], ...used], engFilter, v => { engFilter = v; rerender(); }));
  const list = engFilter === 'all' ? all : all.filter(l => l.skill === engFilter);
  if(!list.length) return el.append(emptyState('english', 'ยังไม่มีบทเรียน เพิ่มวิดีโอหรือรูปที่อยากเก็บไว้ดูได้เลย', 'เพิ่มบทเรียน', () => English.add()));
  const grid = h('<div class="eng-grid"></div>');
  list.forEach(l => grid.append(engCard(l)));
  el.append(grid);
};

/* ---------- watch page ---------- */
async function engWatch(el, l, all){
  const fileUrl = l.videoPath ? await Store.videoUrl(l.videoPath) : '';
  const imgs = l.images || [];
  const c = ENG_SKILL_COLOR[l.skill] || ENG_SKILL_COLOR.listening;
  const next = all.filter(x => x.id !== l.id && x.skill === l.skill && x.status !== 'done').slice(0, 6);
  const page = h(`<div class="eng-watch" style="--sc:${c}">
    <a class="eng-back" href="#english">${ic('left')}<span>บทเรียนทั้งหมด</span></a>
    <div class="eng-main">
      <div class="eng-stage">${engHasVideo(l) ? `<div class="eng-screen">${engPlayer(l, fileUrl)}</div>` : ''}</div>
      <div class="eng-info glass">
        <div class="eng-tags"><span class="eng-skill">${engLabel(ENG_SKILLS, l.skill)}</span>${l.level ? `<span class="pill">${escT(l.level)}</span>` : ''}${l.date ? `<span class="pill">${thDate(l.date)}</span>` : ''}</div>
        <h1>${esc(l.title)}</h1>
        <div class="eng-acts"></div>
        ${l.notes ? `<div class="eng-notes"><h3>สรุปบทเรียน</h3><p class="read-body">${engNotesHTML(l.notes)}</p></div>` : ''}
      </div>
      ${imgs.length ? `<section class="eng-gal"><h3>รูปภาพประกอบ <small>${imgs.length}</small></h3><div class="eng-gal-grid">${imgs.map((src, i) => `<button type="button" data-i="${i}"><img src="${escT(src)}" alt="" loading="lazy"></button>`).join('')}</div></section>` : ''}
    </div>
    ${next.length ? `<aside class="eng-next"><h3>เรียนต่อ</h3></aside>` : ''}
  </div>`);
  if(!engHasVideo(l) && !l.cover && !imgs.length) $('.eng-stage', page).remove();
  else if(!engHasVideo(l)){ const t = engThumb(l); if(t) $('.eng-stage', page).innerHTML = `<div class="eng-screen"><img src="${escT(t)}" alt=""></div>`; }

  const acts = $('.eng-acts', page);
  const isDone = l.status === 'done';
  acts.append(btn(isDone ? 'เรียนจบแล้ว' : 'ทำเครื่องหมายว่าเรียนจบ', isDone ? 'soft' : '', async () => {
    l.status = isDone ? 'learning' : 'done';
    try{ await Store.save('english', l); toast(isDone ? T('ย้ายกลับไปกำลังเรียน') : T('เก่งมาก เรียนจบอีกบทแล้ว')); rerender(); }catch(e){ toast(T('บันทึกไม่สำเร็จ')); }
  }, 'check'));
  acts.append(btn('แก้ไข', 'soft', () => English.edit(l), 'edit'));

  // timestamps in the notes jump the player
  $$('.eng-ts', page).forEach(b => b.onclick = () => {
    const t = +b.dataset.t, screen = $('.eng-screen', page);
    if(!screen || !engHasVideo(l)) return;
    const v = $('video', screen);
    if(v){ v.currentTime = t; v.play().catch(() => {}); }
    else screen.innerHTML = engPlayer(l, fileUrl, t, true);
    screen.scrollIntoView({behavior:REDUCED ? 'auto' : 'smooth', block:'center'});
  });
  $$('.eng-gal-grid button', page).forEach(b => b.onclick = () => engGallery(imgs, +b.dataset.i));
  if(next.length){
    const aside = $('.eng-next', page);
    next.forEach(x => aside.append(engCard(x)));
  }
  el.append(page);
}

/* full-size photo viewer with previous / next */
function engGallery(imgs, i){
  const body = h(`<div class="eng-lightbox">
    <img alt="">
    ${imgs.length > 1 ? `<button type="button" class="icon-btn prev" aria-label="รูปก่อนหน้า">${ic('left')}</button><button type="button" class="icon-btn next" aria-label="รูปถัดไป">${ic('right')}</button><p class="cnt"></p>` : ''}
  </div>`);
  const show = () => { $('img', body).src = imgs[i]; const c = $('.cnt', body); if(c) c.textContent = `${i + 1} / ${imgs.length}`; };
  const go = d => { i = (i + d + imgs.length) % imgs.length; show(); };
  if(imgs.length > 1){
    $('.prev', body).onclick = () => go(-1); $('.next', body).onclick = () => go(1);
    let x0 = null;
    body.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive:true});
    body.addEventListener('touchend', e => { if(x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if(Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); x0 = null; });
  }
  show();
  const m = modal({title:'รูปภาพประกอบ', body, wide:true});
  const onKey = e => { if(!document.body.contains(m.el)) return document.removeEventListener('keydown', onKey); if(e.key === 'ArrowLeft') go(-1); if(e.key === 'ArrowRight') go(1); };
  if(imgs.length > 1) document.addEventListener('keydown', onKey);
}

Object.assign(DICT, {
  'ห้องเรียนภาษาอังกฤษ':'English Class', 'การฟัง':'Listening', 'การพูด':'Speaking', 'การอ่าน':'Reading', 'การเขียน':'Writing', 'ไวยากรณ์':'Grammar', 'คลังคำ':'Vocabulary', 'การออกเสียง':'Pronunciation',
  'อยากเรียน':'Want to learn', 'กำลังเรียน':'Learning', 'เรียนจบแล้ว':'Done', 'ชื่อบทเรียน':'Lesson title', 'เช่น Present Perfect ใช้ยังไง':'e.g. How to use the present perfect',
  'วิดีโอ':'Video', 'วางลิงก์ YouTube, Vimeo หรือ Google Drive':'Paste a YouTube, Vimeo or Google Drive link', 'ลิงก์วิดีโอ':'Video link', 'อัปโหลดไฟล์วิดีโอ':'Upload a video file', 'เอาวิดีโอออก':'Remove video', 'ไฟล์วิดีโอ':'Video file',
  'ไฟล์วิดีโอใหญ่ได้ไม่เกิน':'Video files up to', 'ทักษะ':'Skill', 'ระดับ':'Level', 'วันที่เรียน':'Date studied', 'ถ้าไม่ใส่ จะใช้ภาพจาก YouTube ให้อัตโนมัติ':'Leave empty to use the YouTube thumbnail',
  'รูปภาพประกอบ':'Photos', 'สไลด์ โน้ตที่จด หรือภาพจากบทเรียน ใส่ได้สูงสุด':'Slides, notes or screenshots, up to', 'สรุปบทเรียน':'Lesson notes',
  'จดสิ่งที่ได้เรียน พิมพ์เวลา เช่น':'Write what you learned. Type a time like', 'เพื่อกดข้ามไปช่วงนั้นของวิดีโอได้':'to jump to that part of the video',
  'เพิ่มบทเรียน':'Add lesson', 'เก็บวิดีโอ รูป และโน้ตการเรียนภาษาอังกฤษไว้ดูซ้ำ':'Keep English lesson videos, photos and notes to watch again',
  'ยังไม่มีบทเรียน เพิ่มวิดีโอหรือรูปที่อยากเก็บไว้ดูได้เลย':'No lessons yet. Add a video or photos you want to keep.', 'บทเรียนทั้งหมด':'All lessons', 'เรียนต่อ':'Up next',
  'ทำเครื่องหมายว่าเรียนจบ':'Mark as done', 'ย้ายกลับไปกำลังเรียน':'Moved back to learning', 'เก่งมาก เรียนจบอีกบทแล้ว':'Nice! Another lesson done',
  'โหลดวิดีโอไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง':'Could not load the video. Try refreshing.', 'เปิดวิดีโอในแท็บใหม่':'Open the video in a new tab', 'รูปก่อนหน้า':'Previous photo', 'รูปถัดไป':'Next photo',
  'ยังไม่ได้สร้างที่เก็บวิดีโอใน Supabase (ดู README)':'The video bucket is not set up in Supabase yet (see README)'
});
