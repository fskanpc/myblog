/* =========================================================
   PHOTOBOOTH: take or pick up to 4 photos, press PRINT,
   watch the strip come out of the booth, then keep it on
   the memory board (polaroids pinned together with string)
   ========================================================= */
const PB_MAX = 4;
const PB_DOODLES = [
  // swirl, hearts, candy cane, ring, star, squiggle (original line doodles)
  ['<path d="M8 40c10-30 34-30 30-8-3 16-24 14-20-2 4-14 30-14 34 6 3 16-12 22-18 12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>', '62%', '2%', 70, -8],
  ['<path d="M14 26s-10-6-10-13a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 7-10 13-10 13z" fill="currentColor"/><path d="M36 40s-7-4-7-9a4 4 0 0 1 7-3 4 4 0 0 1 7 3c0 5-7 9-7 9z" fill="currentColor"/>', '88%', '3%', 60, 10],
  ['<path d="M30 6c-14 0-14 18-2 18M28 24l-14 40" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-dasharray="5 5"/>', '92%', '46%', 54, 18],
  ['<ellipse cx="50" cy="30" rx="46" ry="24" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="52" cy="31" rx="42" ry="26" fill="none" stroke="currentColor" stroke-width="1.4"/>', '-2%', '55%', 120, -6],
  ['<path d="M25 4l6 13 14 2-10 10 3 14-13-7-13 7 3-14L5 19l14-2z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>', '46%', '90%', 50, 12],
  ['<path d="M4 20c8-14 14 14 22 0s14 14 22 0 14 14 22 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>', '70%', '97%', 80, -4]
];

/* compose the chosen photos into one strip image (like a real booth print) */
function pbCompose(srcs){
  return Promise.all(srcs.map(s => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = s; }))).then(imgs => {
    const one = imgs.length === 1, W = one ? 480 : 360, fw = W - 28, fh = one ? Math.round(fw * 1.2) : Math.round(fw * .75), gap = 12, top = 14, foot = 44;
    const H = top + imgs.length * fh + (imgs.length - 1) * gap + foot;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#FFFDF8'; x.fillRect(0, 0, W, H);
    imgs.forEach((im, k) => {
      const y = top + k * (fh + gap), r = Math.max(fw / im.naturalWidth, fh / im.naturalHeight);
      const sw = fw / r, sh = fh / r, sx = (im.naturalWidth - sw) / 2, sy = (im.naturalHeight - sh) / 2;
      x.drawImage(im, sx, sy, sw, sh, 14, y, fw, fh);
    });
    x.fillStyle = '#D9507F'; x.font = '600 15px "Mali", system-ui, sans-serif'; x.textAlign = 'center';
    x.fillText('♡ My Little Bubble ♡', W / 2, H - 17);
    let q = .85, d = c.toDataURL('image/jpeg', q);
    while(d.length > 230000 && q > .4){ q -= .08; d = c.toDataURL('image/jpeg', q); }
    return d;
  });
}

VIEWS.photobooth = async el => {
  const items = [...await Store.list('photobooth')].sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.createdAt || 0) - (b.createdAt || 0));
  el.append(pageHead('โฟโต้บูธ', 'ถ่ายหรือเลือกรูปได้สูงสุด 4 รูป กด PRINT แล้วภาพจะไปติดบนบอร์ดความทรงจำ'));
  const wrap = h(`<div class="pb-wrap">
    <section class="pb-booth" aria-label="ตู้โฟโต้บูธ">
      <div class="pb-sign"><span>PHOTO BOOTH</span></div>
      <div class="pb-curtain" aria-hidden="true"></div>
      <div class="pb-screen">
        <video playsinline muted aria-label="ภาพจากกล้อง"></video>
        <img class="pb-preview" alt="">
        <div class="pb-hint"><span>กด <b>ถ่ายรูป</b> หรือ <b>เลือกรูป</b> เพื่อเริ่ม</span></div>
        <div class="pb-count" aria-live="assertive"></div>
        <div class="pb-flash"></div>
      </div>
      <div class="pb-tray" aria-label="รูปที่เลือก"></div>
      <div class="pb-controls">
        <button class="pb-btn cam">${ic('camera')}<span>ถ่ายรูป</span></button>
        <button class="pb-btn pick">${ic('plus')}<span>เลือกรูป</span></button>
      </div>
      <input class="pb-caption" maxlength="60" placeholder="เขียนแคปชันสั้น ๆ (ไม่ใส่ก็ได้)">
      <div class="pb-printrow">
        <div class="pb-slot" aria-hidden="true"><i></i></div>
        <button class="pb-print" disabled><span>PRINT</span></button>
      </div>
      <div class="pb-out"><img class="pb-strip" alt="ภาพที่ปริ้นออกมา"></div>
    </section>
    <section class="pb-board" aria-label="บอร์ดความทรงจำ">
      <h2 class="pb-title">บอร์ดความทรงจำ</h2>
      <div class="pb-doodles" aria-hidden="true"></div>
      <span class="pb-washi" aria-hidden="true"></span>
      <div class="pb-grid"></div>
      <svg class="pb-string" aria-hidden="true"></svg>
    </section>
  </div>`);
  el.append(wrap);

  const video = $('video', wrap), preview = $('.pb-preview', wrap), tray = $('.pb-tray', wrap), printBtn = $('.pb-print', wrap);
  const shots = [];
  let stream = null, busy = false;

  const doodles = $('.pb-doodles', wrap);
  PB_DOODLES.forEach(([d, x, y, s, r]) => doodles.append(h(`<svg viewBox="0 0 100 70" style="left:${x};top:${y};width:${s}px;transform:rotate(${r}deg)">${d}</svg>`)));

  /* ---- selected photos ---- */
  const renderTray = () => {
    tray.innerHTML = '';
    for(let i = 0; i < PB_MAX; i++){
      const s = shots[i];
      const slot = h(`<div class="pb-thumb ${s ? 'on' : ''}">${s ? `<img src="${s}" alt=""><button aria-label="ลบรูปนี้">${ic('close')}</button>` : `<span>${i + 1}</span>`}</div>`);
      if(s) $('button', slot).onclick = () => { shots.splice(i, 1); renderTray(); };
      tray.append(slot);
    }
    printBtn.disabled = !shots.length || busy;
    preview.src = shots.length ? shots[shots.length - 1] : '';
    wrap.classList.toggle('has-shots', !!shots.length);
  };

  /* ---- camera ---- */
  const stopCam = () => { if(stream){ stream.getTracks().forEach(t => t.stop()); stream = null; } wrap.classList.remove('live'); $('.cam span', wrap).textContent = T('ถ่ายรูป'); };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const snap = async () => {
    if(shots.length >= PB_MAX){ toast(T('ครบ 4 รูปแล้ว กด PRINT ได้เลย')); return; }
    const cnt = $('.pb-count', wrap);
    for(const n of ['3', '2', '1']){ cnt.textContent = n; cnt.classList.remove('go'); void cnt.offsetWidth; cnt.classList.add('go'); await wait(650); }
    cnt.textContent = '';
    const c = document.createElement('canvas'), vw = video.videoWidth || 640, vh = video.videoHeight || 480;
    c.width = vw; c.height = vh;
    const x = c.getContext('2d'); x.translate(vw, 0); x.scale(-1, 1); x.drawImage(video, 0, 0, vw, vh);   // mirrored, like a selfie
    const f = $('.pb-flash', wrap); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    if(typeof Blip !== 'undefined') Blip.grab();
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .9));
    shots.push(await compress(blob, 900, 120000)); renderTray();
  };
  $('.cam', wrap).onclick = async () => {
    if(busy) return;
    if(stream){ busy = true; try{ await snap(); } finally { busy = false; renderTray(); } return; }
    try{
      stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user', width:{ideal:1280}, height:{ideal:960}}, audio:false});
      video.srcObject = stream; await video.play();
      wrap.classList.add('live'); $('.cam span', wrap).textContent = T('กดถ่าย');
      const stopWhenGone = setInterval(() => { if(!wrap.isConnected){ clearInterval(stopWhenGone); stopCam(); } }, 800);
    }catch(e){ stopCam(); toast(T('เปิดกล้องไม่ได้ ลองเลือกรูปจากเครื่องแทนนะ')); }
  };
  $('.pick', wrap).onclick = async () => {
    if(busy) return;
    const files = (await pickFiles(true)).slice(0, PB_MAX - shots.length);
    if(!files.length) return;
    for(const f of files){ try{ shots.push(await compress(f, 900, 120000)); }catch(e){ toast(T('อ่านรูปไม่ได้')); } }
    renderTray();
  };

  /* ---- print ---- */
  printBtn.onclick = async () => {
    if(busy || !shots.length) return;
    busy = true; printBtn.disabled = true; stopCam();
    const booth = $('.pb-booth', wrap), out = $('.pb-out', wrap), strip = $('.pb-strip', wrap);
    let img;
    try{ img = await pbCompose(shots); }catch(e){ busy = false; renderTray(); return toast(T('อ่านรูปไม่ได้')); }
    booth.classList.add('printing');
    if(typeof Blip !== 'undefined'){ Blip.coin(); for(let k = 0; k < 8; k++) setTimeout(() => Blip.move(), 500 + k * 260); }
    strip.src = img;
    await new Promise(r => strip.complete ? r() : (strip.onload = r));
    out.style.setProperty('--sh', strip.getBoundingClientRect().height || 300);
    out.classList.remove('done'); out.classList.add('go');
    await wait(3000);
    booth.classList.remove('printing');
    const item = {img, caption:$('.pb-caption', wrap).value.trim(), date:ymd(), count:shots.length, tilt:+((Math.random() - .5) * 8).toFixed(1)};
    try{
      await Store.save('photobooth', item);
      if(typeof Blip !== 'undefined') Blip.win();
      const r = strip.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height / 2, 26, true);
      items.push(item);
      shots.length = 0; $('.pb-caption', wrap).value = '';
      await wait(900);
      out.classList.add('done');
      renderBoard(item.id);
    }catch(e){
      console.error(e);
      toast(/section_check|violates check/i.test(e.message) ? T('ต้องอัปเดตฐานข้อมูลก่อน ดูวิธีใน README หัวข้อโฟโต้บูธ') : T('บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง'));
      out.classList.add('done');
    }
    busy = false; renderTray();
  };

  /* ---- memory board ---- */
  const grid = $('.pb-grid', wrap), svg = $('.pb-string', wrap), board = $('.pb-board', wrap);
  function renderBoard(newId){
    grid.innerHTML = '';
    if(!items.length){ grid.append(h('<p class="pb-empty">ยังไม่มีภาพบนบอร์ด ลองถ่ายหรือเลือกรูป แล้วกด PRINT</p>')); svg.innerHTML = ''; return; }
    items.forEach((it, i) => {
      const card = h(`<figure class="pb-card ${it.count > 1 ? 'pb-multi' : ''} ${it.id === newId ? 'fresh' : ''}" style="--r:${it.tilt || 0}deg" tabindex="0">
        <img src="${it.img}" alt="">
        <figcaption>${thDate(it.date)}</figcaption>
      </figure>`);
      const cell = h(`<div class="pb-cell"></div>`);
      cell.append(card);
      if(it.caption) cell.append(h(`<p class="pb-note" style="--nr:${i % 2 ? 3 : -3}deg">${esc(it.caption)}</p>`));
      card.onclick = () => openPrint(it); card.onkeydown = e => { if(e.key === 'Enter') openPrint(it); };
      grid.append(cell);
    });
    const imgs = $$('img', grid);
    Promise.all(imgs.map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))).then(() => { drawString(); const f = $('.fresh', grid); if(f) f.scrollIntoView({behavior: REDUCED ? 'auto' : 'smooth', block:'center'}); });
  }
  // purple string from pin to pin, in the order the prints were made
  function drawString(){
    if(!board.isConnected) return;
    const b = board.getBoundingClientRect();
    svg.setAttribute('width', b.width); svg.setAttribute('height', b.height); svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    const pts = $$('.pb-card', grid).map((c, i) => { const r = c.getBoundingClientRect(); return [r.left - b.left + r.width * (i % 2 ? .66 : .34), r.top - b.top + 16]; });
    svg.innerHTML = `<defs><radialGradient id="pbPin" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C9B6FF"/><stop offset=".55" stop-color="#7B5BE0"/><stop offset="1" stop-color="#4E35A8"/></radialGradient></defs>`
      + (pts.length > 1 ? `<polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#6E4FD6" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>` : '')
      + pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${(y + 2).toFixed(1)}" r="9" fill="rgba(40,20,90,.25)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="url(#pbPin)"/>`).join('');
  }
  function openPrint(it){
    const body = h(`<div class="pb-view"><img src="${it.img}" alt=""><p class="muted">${thDate(it.date)}${it.caption ? ` · ${esc(it.caption)}` : ''}</p></div>`);
    const m = modal({title:'ภาพจากโฟโต้บูธ', body, actions:[deleteBtn(async () => {
      try{ await Store.remove('photobooth', it.id); items.splice(items.indexOf(it), 1); m.close(); renderBoard(); toast(T('ลบแล้ว')); }
      catch(e){ toast(T('ลบไม่สำเร็จ')); }
    })]});
  }
  const onResize = () => { if(!board.isConnected) return removeEventListener('resize', onResize); drawString(); };
  addEventListener('resize', onResize);

  renderTray();
  renderBoard();
  requestAnimationFrame(() => requestAnimationFrame(drawString));   // after the page is on screen
};

Object.assign(DICT, {
  'โฟโต้บูธ':'Photobooth', 'ถ่ายหรือเลือกรูปได้สูงสุด 4 รูป กด PRINT แล้วภาพจะไปติดบนบอร์ดความทรงจำ':'Take or pick up to 4 photos, press PRINT, and the print goes up on your memory board',
  'ตู้โฟโต้บูธ':'Photo booth', 'ภาพจากกล้อง':'Camera preview', 'เพื่อเริ่ม':'to start', 'ถ่ายรูป':'Take photo', 'เลือกรูป':'Pick photos', 'กดถ่าย':'Snap',
  'เขียนแคปชันสั้น ๆ (ไม่ใส่ก็ได้)':'Short caption (optional)', 'รูปที่เลือก':'Chosen photos', 'ลบรูปนี้':'Remove this photo', 'ภาพที่ปริ้นออกมา':'Printed photo',
  'บอร์ดความทรงจำ':'Memory board', 'ยังไม่มีภาพบนบอร์ด ลองถ่ายหรือเลือกรูป แล้วกด PRINT':'No prints yet. Take or pick photos, then press PRINT',
  'ครบ 4 รูปแล้ว กด PRINT ได้เลย':'That’s 4 photos. Press PRINT!', 'เปิดกล้องไม่ได้ ลองเลือกรูปจากเครื่องแทนนะ':'Couldn’t open the camera. Try picking photos instead',
  'ต้องอัปเดตฐานข้อมูลก่อน ดูวิธีใน README หัวข้อโฟโต้บูธ':'The database needs an update first. See the Photobooth section in the README',
  'ภาพจากโฟโต้บูธ':'Photobooth print'
});
