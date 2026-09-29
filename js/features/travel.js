/* =========================================================
   TRAVEL
   ========================================================= */
const travelFields = [
  {key:'place', label:'สถานที่', type:'text', required:true, placeholder:'เช่น ดอยอินทนนท์'},
  {type:'row', fields:[{key:'city', label:'จังหวัด / ประเทศ', type:'text'}, {key:'date', label:'วันที่ไป', type:'date', default:ymd()}]},
  {type:'row', fields:[{key:'with', label:'ไปกับใคร', type:'text'}, {key:'from', label:'ออกเดินทางจาก', type:'text', default:'บ้าน'}]},
  {key:'rating', label:'ความประทับใจ', type:'stars', default:5},
  {key:'photo', label:'รูปความทรงจำ', type:'image', max:800, budget:120000},
  {key:'notes', label:'เรื่องเล่าจากทริป', type:'textarea', rows:5}
];
const Travel = crud('travel', travelFields, 'ที่เที่ยว', 'place');
function ppCut(s, n){ s = String(s || ''); return [...s].length > n ? [...s].slice(0, n).join('') + '…' : s; }
function boardingPassHTML(o = {}){
  const now = new Date(), name = META.name || '', pid = passportId();
  const seed = o.seed ? hash(o.seed) : hash(Store.uid);
  const flight = 'BB' + String(META.joined || ymd()).slice(2, 4) + String(seed % 90 + 10);
  const from = ppCut(o.from || META.hometown || T('บ้าน'), 8), to = ppCut(o.to || META.dream || T('ทุกที่'), 8);
  const dateTxt = thDate(o.date || ymd(now), true);
  const timeTxt = o.time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}${L(' น.', '')}`;
  const ticket = o.seed ? `${String(seed % 10000).padStart(4, '0')}-${pid.slice(8)}` : pid.slice(3);
  return `<div class="bp">
    <div class="bp-main">
      <div class="bp-head"><span class="bp-logo">${ic('travel')}</span>Boarding Pass<span class="air">Bubble Air<small>LITTLE BUBBLE LINES</small></span></div>
      <div class="bp-body">${SUN_SVG}
        <div><div class="bp-k">ชื่อ</div><div class="bp-v">${esc(ppCut(name, 10))}</div></div>
        <div><div class="bp-k">เที่ยวบิน</div><div class="bp-v">${flight}</div></div>
        <div><div class="bp-k">ชั้น</div><div class="bp-v">Bubble Class</div></div>
        <div class="bp-route"><div><div class="bp-k">ต้นทาง</div><div class="code">${esc(from)}</div></div><div class="path">${ic('travel')}</div><div><div class="bp-k">ถึง</div><div class="code">${esc(to)}</div></div></div>
        <div><div class="bp-k">วันที่</div><div class="bp-v">${dateTxt}</div></div>
        <div><div class="bp-k">${o.timeLabel || 'เวลา'}</div><div class="bp-v">${esc(timeTxt)}</div></div>
        <div><div class="bp-k">ตั๋ว</div><div class="bp-v">${ticket}</div></div>
        <div class="bp-waves"></div>
      </div>
    </div>
    <div class="bp-stub">
      <div class="sh">Boarding Pass<span class="bp-logo">${ic('travel')}</span></div>
      <div class="sb">
        <div><span>${esc(ppCut(name, 7))}</span><span>${flight}</span></div>
        <div><span>${esc(ppCut(from, 5))}</span><span>→ ${esc(ppCut(to, 5))}</span></div>
        <div><span>${dateTxt}</span></div>
        <div class="bar"></div>
      </div>
      <div class="band">Bubble</div>
    </div>
  </div>`;
}
function stampsHTML(list, spots){
  return (list || []).filter(x => x.n).slice(0, 2).map((x, i) => `<div class="stamp" style="${spots[i]};color:${x.color}"><span>${x.a}<b>${x.n}</b>${x.b}</span></div>`).join('');
}
function dataPageHTML(stamps){
  const name = META.name || '', pid = passportId();
  const joinedTxt = META.joined ? thDate(META.joined, true) : '-';
  return `<div class="pp-bottom">
    <h2 class="pp-title"><span class="wv"></span>PASSPORT<span class="wv"></span></h2>
    <div class="pp-grid">
      <div>
        <div class="pp-photo">${META.avatar ? `<img src="${META.avatar}" alt="">` : esc([...name][0] || '?')}</div>
        <div class="pp-name"><span class="lab">ชื่อ</span>${esc(name)}</div>
      </div>
      <div class="pp-fields">
        <div class="pp-f"><span class="lab">ราศี</span><span class="val">${escT(zodiacOf(META.birthday) || '-')}</span></div>
        <div class="pp-f"><span class="lab">วันเกิด</span><span class="val">${META.birthday ? thDate(META.birthday, true) : '-'}</span></div>
        <div class="pp-f"><span class="lab">บ้านเกิด</span><span class="val">${esc(META.hometown || '-')}</span></div>
        <div class="pp-f"><span class="lab">MBTI</span><span class="val">${esc(META.mbti || '-')}</span></div>
        <div class="pp-f"><span class="lab">ของโปรด</span><span class="val">${esc(META.favFood || '-')}</span></div>
        <div class="pp-f"><span class="lab">ออกบัตรเมื่อ</span><span class="val">${joinedTxt}</span></div>
        <div class="pp-f full"><span class="lab">หมายเลขพาสปอร์ต</span><span class="val">${pid}</span></div>
      </div>
    </div>
    ${stamps || ''}
  </div>`;
}
/* profile: data page only */
function passportEl(o = {}){
  const stamps = stampsHTML(o.stamps, ['--rot:-14deg;left:14px;top:8px;width:82px;height:82px', '--rot:11deg;right:14px;top:8px;width:82px;height:82px']);
  return h(`<div class="pp-wrap" style="zoom:${o.zoom || 1}"><article class="pp" style="--pp-pat:${PP_PAT}" aria-label="พาสปอร์ตของ ${esc(META.name || '')}">${dataPageHTML(stamps)}</article></div>`);
}
/* travel: booklet that opens and closes */
let travelBookOpen = false;
function passportBook(items, cities, zoom){
  const last = items[0];
  const stamps = stampsHTML([{a:'เที่ยวแล้ว', n:items.length, b:'ที่', color:'#E0708F'}, {a:'ไปมา', n:cities.size, b:'เมือง', color:'#6F9BD9'}], ['--rot:-14deg;left:34px;bottom:10px', '--rot:10deg;right:40px;bottom:14px;width:88px;height:88px']);
  const bp = boardingPassHTML(last ? {to:last.place, date:last.date, time:last.city || '-', timeLabel:'ปลายทาง', seed:last.id} : {});
  const book = h(`<div class="pbook ${travelBookOpen ? 'open' : ''}" style="--z:${zoom}" role="button" tabindex="0" aria-label="${travelBookOpen ? 'ปิดพาสปอร์ต' : 'เปิดพาสปอร์ต'}" aria-expanded="${travelBookOpen}"><div class="pbook-in">
    <div class="pb-stage">
      <div class="pb-lower pp" style="--pp-pat:${PP_PAT}">${dataPageHTML()}</div>
      <span class="pb-cover">
        <span class="pb-front">
          <span class="pb-emblem"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="50" cy="50" r="30"/><ellipse cx="50" cy="50" rx="13" ry="30"/><path d="M20 50h60M24 36h52M24 64h52"/><circle cx="50" cy="50" r="42" stroke-dasharray="2 5"/><path d="M78 20l6-4-2 7" stroke-linejoin="round"/></svg></span>
          <span class="pb-t">PASSPORT</span>
          <span class="pb-th">หนังสือเดินทาง</span>
          <span class="pb-site">${esc(META.siteName || 'My Little Bubble')}</span>
          <span class="pb-hint">แตะเพื่อเปิด</span>
        </span>
        <span class="pb-back pp" style="--pp-pat:${PP_PAT}"><span class="pp-top">${bp}${stamps}</span></span>
      </span>
    </div>
  </div></div>`);
  const toggle = e => {
    if(e) e.preventDefault();
    travelBookOpen = !travelBookOpen;
    book.classList.toggle('open', travelBookOpen);
    book.setAttribute('aria-expanded', travelBookOpen);
    book.setAttribute('aria-label', travelBookOpen ? 'ปิดพาสปอร์ต' : 'เปิดพาสปอร์ต');
    const r = book.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height / 2, 16, true);
  };
  // the whole booklet is the click target, so 3D hit-testing quirks can't swallow the tap
  book.addEventListener('click', toggle);
  book.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') toggle(e); });
  return book;
}
/* boarding-pass printer shown after adding a new place */
function printPass(t){
  const back = h(`<div class="modal-back printer-back" role="dialog" aria-modal="true" aria-label="พิมพ์บอร์ดดิ้งพาส">
    <div class="printer-wrap">
      <div class="printer">
        <div class="pr-body">
          <span class="pr-brand">Bubble Air</span>
          <span class="pr-screen"><span class="pr-msg">กำลังพิมพ์ตั๋ว</span><span class="pr-dots"><i></i><i></i><i></i></span></span>
          <span class="pr-lights"><i></i><i></i></span>
        </div>
        <div class="pr-slot"></div>
      </div>
      <div class="pr-clip"><div class="pr-paper">${boardingPassHTML({to:t.place, date:t.date, time:t.city || '-', timeLabel:'ปลายทาง', seed:t.id || t.place})}</div></div>
      <div class="pr-actions"></div>
    </div>
  </div>`);
  const close = () => { back.classList.remove('show'); document.removeEventListener('keydown', onKey); setTimeout(() => back.remove(), 250); };
  const onKey = e => { if(e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  back.addEventListener('mousedown', e => { if(e.target === back) close(); });
  const done = btn('เก็บตั๋วใบนี้', '', close, 'check');
  $('.pr-actions', back).append(done);
  document.body.append(back);
  requestAnimationFrame(() => back.classList.add('show'));
  const paper = $('.pr-paper', back);
  paper.addEventListener('animationend', e => {
    if(e.animationName !== 'printOut') return;
    back.classList.add('printed');
    $('.pr-msg', back).textContent = 'พิมพ์เสร็จแล้ว';
    const r = paper.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height / 2, 30, true);
    done.focus();
  });
  if(REDUCED){ back.classList.add('printed'); $('.pr-msg', back).textContent = 'พิมพ์เสร็จแล้ว'; }
}
Travel.add = (preset = {}) => openForm({title:'เพิ่มที่เที่ยว', fields:travelFields, value:preset, onSave: async v => { await Store.save('travel', v); rerender(); setTimeout(() => printPass(v), 380); }});
let travelView = 'line';
function travelPassport(items, cities, zoom){
  const wrap = h('<div class="trip-pp"></div>');
  wrap.append(passportBook(items, cities, zoom));
  return wrap;
}
function travelToggle(){ return chips([['line','ราวรูปภาพ'], ['tickets','ตั๋วเดินทาง']], travelView, v => { travelView = v; rerender(); }); }
const ROPE_DECO = {
  bow:{w:62, h:46, svg:`<svg viewBox="0 0 62 46"><path d="M31 18C22 4 6 2 4 12s12 16 27 8z" fill="#B3212E"/><path d="M31 18C40 4 56 2 58 12s-12 16-27 8z" fill="#B3212E"/><path d="M31 18c-6-8-18-10-20-6s8 8 20 6z" fill="#8E1622"/><path d="M31 18c6-8 18-10 20-6s-8 8-20 6z" fill="#8E1622"/><path d="M28 22L18 44l7-3 3 5 5-20zM34 22l10 22-7-3-3 5-5-20z" fill="#C62B3A"/><rect x="26" y="13" width="10" height="11" rx="4" fill="#D63445"/></svg>`},
  star:{w:54, h:52, svg:`<svg viewBox="0 0 54 52"><path d="M27 3c2 0 3 1 4 3l5 11 12 2c4 1 5 5 2 8l-9 8 2 12c1 4-3 6-6 4l-10-6-10 6c-3 2-7 0-6-4l2-12-9-8c-3-3-2-7 2-8l12-2 5-11c1-2 2-3 4-3z" fill="#F6CB45"/><path d="M27 7l4.5 10 11 1.8" stroke="#FFE28A" stroke-width="2" fill="none" stroke-linecap="round"/><g fill="#B98A1D"><circle cx="23" cy="24" r="2.4"/><circle cx="31" cy="24" r="2.4"/><circle cx="23" cy="32" r="2.4"/><circle cx="31" cy="32" r="2.4"/></g></svg>`},
  cookie:{w:50, h:50, svg:`<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="22" fill="#C98B4E"/><circle cx="25" cy="25" r="22" fill="none" stroke="#A86B34" stroke-width="2"/><g fill="#4A2A18"><ellipse cx="16" cy="17" rx="4" ry="3"/><ellipse cx="31" cy="13" rx="3" ry="2.5"/><ellipse cx="34" cy="28" rx="4" ry="3.2"/><ellipse cx="19" cy="31" rx="3.5" ry="3"/><ellipse cx="27" cy="38" rx="3" ry="2.4"/><ellipse cx="25" cy="23" rx="2.4" ry="2"/></g></svg>`},
  gingham:{w:60, h:56, svg:`<svg viewBox="0 0 60 56"><defs><pattern id="gh" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#fff"/><rect width="3" height="6" fill="#6E8F5E" opacity=".55"/><rect width="6" height="3" fill="#6E8F5E" opacity=".55"/></pattern></defs><path d="M30 16C22 2 6 2 5 11s13 14 25 5zM30 16C38 2 54 2 55 11s-13 14-25 5z" fill="url(#gh)" stroke="#5F7F50" stroke-width="1.5"/><path d="M27 20L18 54l8-4 4 5 3-33zM33 20l6 34-7-3" fill="url(#gh)" stroke="#5F7F50" stroke-width="1.5"/><rect x="25" y="11" width="10" height="11" rx="4" fill="#6E8F5E"/></svg>`},
  heart:{w:40, h:40, svg:`<svg viewBox="0 0 40 40"><path d="M20 36S4 26 4 14A8.5 8.5 0 0 1 20 9a8.5 8.5 0 0 1 16 5c0 12-16 22-16 22z" fill="#FF7FA8"/><path d="M11 12a4 4 0 0 1 5-2" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/></svg>`}
};
const DECO_CYCLE = ['bow','star','cookie','gingham','heart','star'];

VIEWS.travel = async el => {
  const items = [...await Store.list('travel')].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if(travelView === 'tickets') return travelTickets(el, items);
  const content = contentWidth();
  const k = content < 640 ? .74 : content < 900 ? .88 : 1;
  const perRow = content < 640 ? 2 : content < 1000 ? 3 : 4;
  const pw = Math.round(176 * k);
  const cities = new Set(items.map(i => (i.city || '').trim()).filter(Boolean));

  const scene = h(`<section class="trip-scene" style="--k:${k};--pw:${pw}px">
    <div class="trip-sky" aria-hidden="true"><div class="trip-sun"></div></div>
    <div class="trip-hills" aria-hidden="true"><svg viewBox="0 0 1200 300" preserveAspectRatio="none">
      <path d="M0 120C180 40 380 60 560 115S900 40 1200 95V300H0z" fill="var(--hill1)"/>
      <path d="M0 180C160 115 340 135 540 190S900 120 1200 170V300H0z" fill="var(--hill2)"/>
      <path d="M0 240C220 185 430 205 650 245S1010 195 1200 228V300H0z" fill="var(--hill3)"/>
      <path d="M0 180C160 115 340 135 540 190" stroke="rgba(255,255,255,.25)" stroke-width="3" fill="none" vector-effect="non-scaling-stroke"/>
    </svg></div>
    <header class="trip-head">
      <p class="kicker">ความทรงจำระหว่างทาง</p>
      <h1>ที่เที่ยวของฉัน</h1>
      <div class="stats"><span>${items.length} สถานที่</span><span>${cities.size} เมือง / ประเทศ</span>${items[0] ? `<span>ล่าสุด ${esc(items[0].place)}</span>` : ''}</div>
    </header>
    <div class="lines"></div>
  </section>`);
  const head = $('.trip-head', scene);
  head.append(btn('เพิ่มที่เที่ยว', '', () => Travel.add(), 'plus'), travelToggle());


  // drifting clouds with mouse parallax (outer .sticker is moved by the global pointer handler)
  const sky = $('.trip-sky', scene);
  [[4, 26, 190, 1.2, 70], [60, 18, 150, .8, 55], [28, 52, 230, 1.6, 80], [78, 44, 170, 1, 65], [-4, 70, 210, 2, 90]].forEach(([x, y, w, d, cd]) => {
    sky.append(h(`<div class="sticker" data-depth="${d}" style="left:${x}%;top:${y}%"><div class="cloud-drift" style="--cd:${cd}s"><div class="cloud" style="--cw:${Math.round(w * k)}px"></div></div></div>`));
  });

  const rows = [];
  const list = items.length ? items : [null];
  for(let i = 0; i < list.length; i += perRow) rows.push(list.slice(i, i + perRow));
  const lines = $('.lines', scene);
  const RH = 80, y0 = 16;
  const cardH = pw * 1.25 + 70 * k + 18 * k;
  rows.forEach((row, ri) => {
    const sag = (ri % 2 ? 34 : 24) * (k < 1 ? .8 : 1);
    const yAt = f => { const t = (f * 1000 + 10) / 1020; return y0 + 4 * sag * t * (1 - t); };
    const n = row.length;
    const Wr = content, step = perRow > 1 ? Math.min((Wr - 36 - pw) / (perRow - 1), pw * 1.5) : 0;
    const fs = row.map((_, i) => (Wr / 2 + (i - (n - 1) / 2) * step) / Wr);
    const rowEl = h(`<div class="line-row" style="height:${Math.round(y0 + sag + cardH + 26)}px">
      <svg class="rope" height="${RH}" viewBox="0 0 1000 ${RH}" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-10 ${y0} Q500 ${y0 + 2 * sag} 1010 ${y0}" fill="none" stroke="var(--rope)" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        <path d="M-10 ${y0} Q500 ${y0 + 2 * sag} 1010 ${y0}" fill="none" stroke="var(--rope2)" stroke-width="2.5" stroke-dasharray="5 6" vector-effect="non-scaling-stroke"/>
      </svg></div>`);
    row.forEach((t, i) => {
      const f = fs[i], y = yAt(f), kk = t ? hash(t.id) : ri;
      const r = ((kk % 2 ? 1 : -1) * (2.5 + kk % 3)).toFixed(1);
      const style = `left:calc(${(f * 100).toFixed(2)}% - ${pw / 2}px);top:${Math.round(y - 4)}px;--r:${r}deg;--d:${(4.5 + (kk % 5) * .6).toFixed(1)}s;--dl:${-(kk % 7) * .5}s`;
      let card;
      if(!t){
        card = h(`<button class="hang add" style="${style}"><span class="pin"></span><span class="pc"><span class="ph">${ic('plus')}</span><span class="cap">หนีบรูปแรก</span><span class="csub">แตะเพื่อเพิ่มที่เที่ยว</span></span></button>`);
        card.onclick = () => Travel.add();
      } else {
        card = h(`<button class="hang" style="${style}" aria-label="${esc(t.place)}"><span class="pin"></span><span class="pc">
          <span class="ph ${t.photo ? '' : 'none'}">${t.photo ? `<img src="${t.photo}" alt="">` : ic('travel')}</span>
          <span class="cap">${esc(t.place)}</span>
          <span class="csub">${esc(t.city || thDate(t.date, true) || '')}${t.rating ? ` ${starsHTML(t.rating)}` : ''}</span>
        </span></button>`);
        card.onclick = () => openTrip(t);
      }
      rowEl.append(card);
    });
    // decorations between and beside the photos
    const edge = Math.max(.03, fs[0] - (pw / 2 + 30 * k) / Wr), edge2 = Math.min(.97, fs[n - 1] + (pw / 2 + 30 * k) / Wr);
    const decoF = [edge, ...fs.slice(0, -1).map((f, i) => (f + fs[i + 1]) / 2), edge2];
    decoF.forEach((f, di) => {
      if((di + ri) % 2 === 1 && n > 1 && di !== 0) return; // keep it airy
      const name = DECO_CYCLE[(ri * 3 + di) % DECO_CYCLE.length], d = ROPE_DECO[name];
      const w = d.w * k, hh = d.h * k;
      rowEl.append(h(`<div class="rope-deco" style="width:${w}px;height:${hh}px;left:calc(${(f * 100).toFixed(2)}% - ${w / 2}px);top:${Math.round(yAt(f) - hh * .3)}px;--r:${di % 2 ? -7 : 7}deg;animation-delay:${-di * .7}s">${d.svg}</div>`));
    });
    lines.append(rowEl);
  });
  el.append(scene);
};
async function travelTickets(el, items){
  el.append(pageHead('ที่เที่ยวของฉัน', 'ตั๋วความทรงจำจากทุกการเดินทาง', 'เพิ่มที่เที่ยว', () => Travel.add()));
  el.append(travelToggle());
  const cities = new Set(items.map(i => (i.city || '').trim()).filter(Boolean));
  const content = contentWidth();
  const tp = travelPassport(items, cities, Math.min(.8, content / 600)); tp.style.cssText = 'display:block;width:fit-content;margin:0 auto 28px';
  el.append(tp);
  if(!items.length) return el.append(emptyState('travel', 'ยังไม่มีตั๋วใบแรก ไปเที่ยวที่ไหนมาบ้าง', 'เพิ่มที่เที่ยว', () => Travel.add()));
  const grid = h('<div class="tickets"></div>');
  items.forEach(t => {
    const code = (t.id || '').slice(-5).toUpperCase();
    const c = h(`<article class="ticket" tabindex="0" role="button" aria-label="${esc(t.place)}">
      <div class="tk-main">
        <div class="tk-top"><span>Boarding pass</span><span>${esc(thDate(t.date, true))}</span></div>
        <div>
          <div class="tk-route"><span class="from">${t.from ? esc(t.from) : 'บ้าน'}</span><span class="dash"></span><span class="to">${esc(t.place)}</span></div>
          <div class="tk-info"><div>ปลายทาง<b>${esc(t.city || '—')}</b></div><div>ไปกับ<b>${t.with ? esc(t.with) : 'ตัวเอง'}</b></div></div>
          <div style="margin-top:6px;font-size:14px">${starsHTML(t.rating)}</div>
        </div>
        <div class="tk-photo">${t.photo ? `<img src="${t.photo}" alt="">` : ''}</div>
      </div>
      <div class="tk-stub"><span>ที่นั่ง</span><span class="code">${code}</span><div class="barcode"></div><span>${esc((t.date || '').slice(0, 4))}</span></div>
    </article>`);
    c.onclick = () => openTrip(t); c.onkeydown = e => { if(e.key === 'Enter') openTrip(t); };
    grid.append(c);
  });
  el.append(grid);
}
function openTrip(t){
  const body = h(`<div>${t.photo ? `<img src="${t.photo}" alt="" style="width:100%;border-radius:18px;margin-bottom:14px;cursor:zoom-in">` : ''}
    <p class="muted" style="margin:0">${esc(t.city || '')} ${t.date ? '— ' + thDate(t.date) : ''}</p>
    <div style="font-size:22px">${starsHTML(t.rating)}</div>
    ${t.with ? `<p style="margin:6px 0 0">ไปกับ ${esc(t.with)}</p>` : ''}
    <p class="read-body">${esc(t.notes || '')}</p></div>`);
  const img = $('img', body); if(img) img.onclick = () => viewImage(img.src);
  const m = modal({title:t.place, body, wide:true, actions:[btn('แก้ไข', 'soft', () => { m.close(); Travel.edit(t); }, 'edit')]});
}
