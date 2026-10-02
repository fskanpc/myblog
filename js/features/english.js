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

/* a frame from the clip used as the cover: {src, x, y, z} where x/y is the focus point in % and z the zoom.
   The crop is applied with CSS, so YouTube stills (which block canvas reads) can be cropped too */
function engFrameImg(f, extra = ''){
  const x = f.x ?? 50, y = f.y ?? 50, z = f.z || 1;
  return `<img src="${escT(f.src)}" alt="" ${extra} style="object-position:${x}% ${y}%;transform:scale(${z});transform-origin:${x}% ${y}%">`;
}
function engCoverHTML(l){
  if(l.cover) return `<img src="${escT(l.cover)}" alt="" loading="lazy">`;
  if(l.frame && l.frame.src) return engFrameImg(l.frame, 'loading="lazy"');
  const t = engThumb(l);
  return t ? `<img src="${escT(t)}" alt="" loading="lazy">` : '';
}
/* draw the video's current picture into a small JPEG */
function engGrab(video){
  return new Promise((res, rej) => {
    const w = video.videoWidth, hh = video.videoHeight;
    if(!w) return rej(new Error(T('ยังโหลดภาพจากคลิปไม่ได้ ลองใหม่อีกครั้ง')));
    const s = Math.min(1, 1100 / Math.max(w, hh));
    const c = document.createElement('canvas'); c.width = Math.round(w * s); c.height = Math.round(hh * s);
    c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
    try{ c.toBlob(b => b ? compress(b, 1100, 120000).then(res, rej) : rej(new Error(T('จับภาพจากคลิปไม่สำเร็จ'))), 'image/jpeg', .9); }
    catch(e){ rej(new Error(T('คลิปนี้ไม่อนุญาตให้จับภาพ'))); }   // cross-origin video without CORS
  });
}
/* grab a picture about 10% into the clip (at most 1 s in) without showing anything */
function engAutoFrame(src){
  return new Promise(res => {
    const vid = document.createElement('video');
    vid.muted = true; vid.playsInline = true; vid.preload = 'auto'; vid.crossOrigin = 'anonymous';
    const done = f => { clearTimeout(timer); vid.removeAttribute('src'); vid.load(); res(f); };
    const timer = setTimeout(() => done(null), 10000);
    vid.onloadedmetadata = () => { vid.currentTime = Math.min(1, (vid.duration || 2) * .1); };
    vid.onseeked = () => engGrab(vid).then(src => done({src, x:50, y:50, z:1}), () => done(null));
    vid.onerror = () => done(null);
    vid.src = src;
  });
}

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
let engPendingURL = '', engPendingFor = null;
function engPendingSrc(){
  if(engPendingFor !== engPendingFile){ if(engPendingURL) URL.revokeObjectURL(engPendingURL); engPendingFor = engPendingFile; engPendingURL = engPendingFile ? URL.createObjectURL(engPendingFile) : ''; }
  return engPendingURL;
}
const engCanFrame = v => !!(engPendingFile || v.videoPath || ['youtube','file'].includes((engSource(v.video) || {}).kind));

/* choose a picture from the clip, then crop it. start = an existing frame to go straight to cropping */
async function engPickFrame(v, onDone, start){
  let src = null;
  if(engPendingFile) src = {kind:'video', src:engPendingSrc()};
  else if(v.videoPath){ const u = await Store.videoUrl(v.videoPath); if(u) src = {kind:'video', src:u}; }
  else { const s = engSource(v.video); if(s && s.kind === 'youtube') src = {kind:'youtube', id:s.id}; else if(s && s.kind === 'file') src = {kind:'video', src:s.src}; }
  if(!src) return toast(T('คลิปแบบนี้เลือกภาพปกไม่ได้'));
  const body = h('<div class="eng-pick"></div>');
  const choose = () => {
    body.innerHTML = '';
    if(src.kind === 'youtube'){
      body.append(h('<p class="muted">เลือกภาพจากคลิป แล้วครอปในขั้นถัดไป</p>'));
      const grid = h('<div class="eng-pick-yt"></div>');
      [['hqdefault','ภาพปกของคลิป'], ['hq1','ช่วงต้น'], ['hq2','ช่วงกลาง'], ['hq3','ช่วงท้าย']].forEach(([n, lb]) => {
        const url = `https://i.ytimg.com/vi/${src.id}/${n}.jpg`;
        const b = h(`<button type="button"><span class="eng-pick-im"><img src="${url}" alt=""></span><span>${lb}</span></button>`);
        b.onclick = () => crop({src:url, x:50, y:50, z:1.34});   // YouTube stills are 4:3 with black bars; start zoomed past them
        grid.append(b);
      });
      body.append(grid);
    } else {
      body.append(h('<p class="muted">เลื่อนคลิปไปยังภาพที่ชอบ แล้วกด "ใช้ภาพนี้"</p>'));
      const vid = h('<video class="eng-pick-video" controls playsinline muted preload="auto" crossorigin="anonymous"></video>');
      vid.src = src.src;
      const bar = h('<div class="eng-pick-acts"></div>');
      bar.append(btn('ใช้ภาพนี้', '', async () => {
        vid.pause();
        try{ crop({src:await engGrab(vid), x:50, y:50, z:1}); }catch(e){ toast(e.message); }
      }, 'camera'));
      body.append(vid, bar);
    }
  };
  const crop = f => {
    f = {...f};
    body.innerHTML = '';
    const box = h(`<div class="eng-crop">
      <div class="eng-crop-frame">${engFrameImg(f, 'draggable="false"')}</div>
      <label class="eng-zoom"><span>ซูม</span><input type="range" min="1" max="3" step="0.01" aria-label="ซูม"></label>
      <p class="muted">ลากภาพเพื่อเลื่อนตำแหน่ง แล้วเลื่อนแถบเพื่อซูมเข้าออก</p>
      <div class="eng-pick-acts"></div>
    </div>`);
    const frame = $('.eng-crop-frame', box), img = $('img', box), zoom = $('input', box);
    const paint = () => { img.style.objectPosition = `${f.x}% ${f.y}%`; img.style.transformOrigin = `${f.x}% ${f.y}%`; img.style.transform = `scale(${f.z})`; };
    const clamp = n => Math.round(Math.min(100, Math.max(0, n)) * 10) / 10;
    zoom.value = f.z;
    zoom.oninput = () => { f.z = Number(zoom.value); paint(); };
    let drag = null;
    frame.onpointerdown = e => { drag = {px:e.clientX, py:e.clientY, x:f.x, y:f.y}; frame.setPointerCapture(e.pointerId); frame.classList.add('drag'); };
    frame.onpointermove = e => {
      if(!drag) return;
      f.x = clamp(drag.x - (e.clientX - drag.px) / frame.clientWidth * 100 / f.z);
      f.y = clamp(drag.y - (e.clientY - drag.py) / frame.clientHeight * 100 / f.z);
      paint();
    };
    frame.onpointerup = frame.onpointercancel = () => { drag = null; frame.classList.remove('drag'); };
    const bar = $('.eng-pick-acts', box);
    bar.append(btn('เลือกภาพอื่น', 'soft', choose, 'left'), btn('ใช้เป็นปก', '', () => { onDone(f); m.close(); }, 'check'));
    body.append(box);
  };
  const m = modal({title:'ภาพปกจากคลิป', body, wide:true});
  if(start && start.src) crop(start); else choose();
}
function engVideoField(v){
  const box = h(`<div class="eng-vin">
    <input type="url" placeholder="วางลิงก์ YouTube, Vimeo หรือ Google Drive" aria-label="ลิงก์วิดีโอ">
    <div class="eng-vrow"><span class="muted">หรือ</span><button type="button" class="btn soft eng-up">${ic('video')}<span>อัปโหลดไฟล์วิดีโอ</span></button></div>
    <div class="eng-vfile" hidden><span class="nm"></span><button type="button" class="icon-btn" aria-label="เอาวิดีโอออก">${ic('close')}</button></div>
    <div class="eng-fr" hidden>
      <span class="eng-fr-prev"></span>
      <span class="eng-fr-side"><b>ภาพปกจากคลิป</b><span class="muted eng-fr-note"></span><span class="eng-fr-btns"></span></span>
    </div>
  </div>`);
  const inp = $('input', box), chip = $('.eng-vfile', box), fr = $('.eng-fr', box);
  inp.value = v.video || '';
  const paintFrame = () => {
    fr.hidden = !engCanFrame(v);
    if(fr.hidden) return;
    const f = v.frame && v.frame.src ? v.frame : null, s = engSource(v.video);
    $('.eng-fr-prev', fr).innerHTML = f ? engFrameImg(f) : s && s.thumb ? `<img src="${escT(s.thumb)}" alt="">` : ic('video');
    $('.eng-fr-note', fr).textContent = T(f ? 'เลือกและครอปไว้แล้ว' : 'ยังไม่ได้เลือก ระบบจะใช้ภาพจากคลิปให้อัตโนมัติ');
    const btns = $('.eng-fr-btns', fr); btns.innerHTML = '';
    const set = nf => { v.frame = nf; paintFrame(); };
    btns.append(btn(f ? 'เลือกภาพใหม่' : 'เลือกภาพจากคลิป', 'soft eng-up', () => engPickFrame(v, set), 'camera'));
    if(f){
      btns.append(btn('ครอปใหม่', 'soft eng-up', () => engPickFrame(v, set, f), 'edit'));
      const x = h(`<button type="button" class="icon-btn" aria-label="ใช้ภาพอัตโนมัติ" title="ใช้ภาพอัตโนมัติ">${ic('close')}</button>`);
      x.onclick = () => set(null);
      btns.append(x);
    }
  };
  const paint = () => {
    const name = engPendingFile ? engPendingFile.name : v.videoPath ? (v.videoName || T('ไฟล์วิดีโอ')) : '';
    chip.hidden = !name;
    $('.nm', chip).textContent = name ? `🎬 ${name}` : '';
    paintFrame();
  };
  inp.oninput = () => {
    const was = v.video;
    v.video = inp.value.trim();
    if(v.video !== was) v.frame = null;   // a different clip needs a new picture
    if(v.video){ engPendingFile = null; v.videoPath = ''; v.videoName = ''; }
    paint();
  };
  $('.btn', box).onclick = () => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*';
    i.onchange = () => {
      const file = i.files[0]; if(!file) return;
      if(file.size > ENG_MAX_MB * 1024 * 1024) return toast(L(`ไฟล์ใหญ่เกิน ${ENG_MAX_MB} MB ลองอัปขึ้น YouTube แบบไม่เป็นสาธารณะแล้ววางลิงก์แทน`, `File is over ${ENG_MAX_MB} MB. Try an unlisted YouTube upload and paste the link instead.`));
      engPendingFile = file; v.video = ''; inp.value = ''; v.videoPath = ''; v.videoName = file.name; v.frame = null;
      paint();
    };
    i.click();
  };
  $('.icon-btn', chip).onclick = () => { engPendingFile = null; v.videoPath = ''; v.videoName = ''; v.frame = null; paint(); };
  paint();
  return box;
}
const engFields = [
  {key:'title', label:'ชื่อบทเรียน', type:'text', required:true, placeholder:'เช่น Present Perfect ใช้ยังไง'},
  {key:'video', label:'วิดีโอ', type:'custom', render:engVideoField, help:`ไฟล์วิดีโอใหญ่ได้ไม่เกิน ${ENG_MAX_MB} MB`},
  {key:'skill', label:'ทักษะ', type:'select', options:ENG_SKILLS, default:'listening'},
  {type:'row', fields:[{key:'level', label:'ระดับ', type:'select', options:[['', '—'], ...ENG_LEVELS], default:''}, {key:'date', label:'วันที่เรียน', type:'date'}]},
  {key:'status', label:'สถานะ', type:'select', options:ENG_STATUS, default:'todo'},
  {key:'cover', label:'รูปปก', type:'image', max:800, budget:90000, help:'ถ้าไม่ใส่ จะใช้ภาพจากคลิปเป็นปกแทน'},
  {key:'images', label:'รูปภาพประกอบ', type:'images', limit:8, max:1100, budget:120000, help:'สไลด์ โน้ตที่จด หรือภาพจากบทเรียน ใส่ได้สูงสุด 8 ภาพ'},
  {key:'notes', label:'สรุปบทเรียน', type:'textarea', rows:6, placeholder:'จดสิ่งที่ได้เรียน พิมพ์เวลา เช่น 2:15 เพื่อกดข้ามไปช่วงนั้นของวิดีโอได้'}
];
async function engSave(v, before = {}){
  // no cover and no picked picture: take one from an uploaded file or .mp4 link (YouTube already has its own)
  if(!v.cover && !(v.frame && v.frame.src)){
    const s = engSource(v.video);
    const src = engPendingFile ? engPendingSrc() : s && s.kind === 'file' ? s.src : '';
    if(src) v.frame = await engAutoFrame(src);
  }
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
  const thumb = engCoverHTML(l), c = ENG_SKILL_COLOR[l.skill] || ENG_SKILL_COLOR.listening;
  const a = h(`<a class="eng-card" href="#english/${encodeURIComponent(l.id)}" style="--sc:${c}">
    <span class="eng-thumb">${thumb || `<span class="noimg">${ic(engHasVideo(l) ? 'video' : 'english')}</span>`}
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
  // lessons saved before covers came from the clip: take a picture once and keep it
  if(l.videoPath && fileUrl && !l.cover && !(l.frame && l.frame.src)){
    engAutoFrame(fileUrl).then(f => { if(f){ l.frame = f; Store.save('english', l).catch(() => {}); } });
  }
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
  'ภาพปกจากคลิป':'Cover from the clip', 'เลือกและครอปไว้แล้ว':'Picked and cropped', 'ยังไม่ได้เลือก ระบบจะใช้ภาพจากคลิปให้อัตโนมัติ':'Not picked yet — a picture from the clip is used automatically',
  'เลือกภาพจากคลิป':'Pick from clip', 'เลือกภาพใหม่':'Pick another', 'ครอปใหม่':'Re-crop', 'ใช้ภาพอัตโนมัติ':'Use the automatic picture', 'ถ้าไม่ใส่ จะใช้ภาพจากคลิปเป็นปกแทน':'Leave empty to use a picture from the clip',
  'เลือกภาพจากคลิป แล้วครอปในขั้นถัดไป':'Pick a picture from the clip, then crop it next', 'ภาพปกของคลิป':'Clip cover', 'ช่วงต้น':'Start', 'ช่วงกลาง':'Middle', 'ช่วงท้าย':'End',
  'เลื่อนคลิปไปยังภาพที่ชอบ แล้วกด':'Move the clip to the picture you like, then press', 'ใช้ภาพนี้':'Use this picture', 'ซูม':'Zoom', 'ลากภาพเพื่อเลื่อนตำแหน่ง แล้วเลื่อนแถบเพื่อซูมเข้าออก':'Drag the picture to move it, and use the slider to zoom',
  'เลือกภาพอื่น':'Pick another', 'ใช้เป็นปก':'Use as cover', 'คลิปแบบนี้เลือกภาพปกไม่ได้':'Can’t pick a picture from this kind of clip', 'ยังโหลดภาพจากคลิปไม่ได้ ลองใหม่อีกครั้ง':'The clip hasn’t loaded yet. Try again.',
  'จับภาพจากคลิปไม่สำเร็จ':'Could not capture a picture', 'คลิปนี้ไม่อนุญาตให้จับภาพ':'This clip doesn’t allow capturing pictures',
  'ยังไม่ได้สร้างที่เก็บวิดีโอใน Supabase (ดู README)':'The video bucket is not set up in Supabase yet (see README)'
});
