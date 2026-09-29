/* =========================================================
   BOOKS
   ========================================================= */
const BOOK_STATUS = [['reading','กำลังอ่าน'], ['done','อ่านจบแล้ว'], ['want','อยากอ่าน']];
const bookFields = [
  {key:'title', label:'ชื่อหนังสือ', type:'text', required:true},
  {type:'row', fields:[{key:'author', label:'ผู้เขียน', type:'text'}, {key:'finished', label:'วันที่อ่านจบ', type:'date'}]},
  {key:'status', label:'สถานะ', type:'select', options:BOOK_STATUS, default:'done'},
  {key:'rating', label:'คะแนน', type:'stars', default:0},
  {key:'display', label:'วางบนชั้นแบบ', type:'select', options:[['auto','ให้ระบบจัดให้'], ['cover','โชว์หน้าปก'], ['spine','โชว์สันปก']], default:'auto'},
  {key:'color', label:'สีของเล่ม', type:'color', default:'#FF86AE'},
  {key:'cover', label:'รูปปก', type:'image', max:500, budget:90000},
  {key:'review', label:'รีวิว', type:'textarea', rows:6, placeholder:'ชอบตรงไหน ประโยคไหนติดใจ…'}
];
const Books = crud('books', bookFields, 'หนังสือ', 'book');
let bookFilter = 'all';

function tint(hex, amt){
  const m = /^#?([\da-f]{6})$/i.exec(hex || ''); if(!m) return hex;
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.round(c + (255 - c) * amt).toString(16).padStart(2, '0');
  return '#' + f(r) + f(g) + f(b);
}

/* original shelf decorations */
const DECOR = {
  bear:{w:88, h:104, svg:`<svg viewBox="0 0 88 104"><circle cx="22" cy="20" r="11" fill="#D9A274"/><circle cx="66" cy="20" r="11" fill="#D9A274"/><circle cx="22" cy="20" r="6" fill="#F4CFA9"/><circle cx="66" cy="20" r="6" fill="#F4CFA9"/><ellipse cx="44" cy="82" rx="25" ry="21" fill="#DFA97D"/><ellipse cx="20" cy="76" rx="8" ry="12" fill="#D39C6F" transform="rotate(25 20 76)"/><ellipse cx="68" cy="76" rx="8" ry="12" fill="#D39C6F" transform="rotate(-25 68 76)"/><circle cx="29" cy="97" r="9" fill="#D39C6F"/><circle cx="59" cy="97" r="9" fill="#D39C6F"/><circle cx="29" cy="97" r="4.5" fill="#F4CFA9"/><circle cx="59" cy="97" r="4.5" fill="#F4CFA9"/><circle cx="44" cy="40" r="27" fill="#E6B48A"/><ellipse cx="44" cy="51" rx="11" ry="8.5" fill="#F7DDC2"/><ellipse cx="44" cy="47.5" rx="4" ry="3" fill="#3A2E5A"/><path d="M40 53q4 3 8 0" stroke="#3A2E5A" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="34" cy="38" r="3.2" fill="#3A2E5A"/><circle cx="54" cy="38" r="3.2" fill="#3A2E5A"/><circle cx="27" cy="47" r="4.5" fill="#FF9DBE" opacity=".6"/><circle cx="61" cy="47" r="4.5" fill="#FF9DBE" opacity=".6"/><path d="M44 66l-11-6v12zM44 66l11-6v12z" fill="#FF7FA8"/><circle cx="44" cy="66" r="3.5" fill="#FF5F8F"/></svg>`},
  ghost:{w:78, h:108, svg:`<svg viewBox="0 0 80 110"><g class="flame"><ellipse cx="40" cy="22" rx="12" ry="17" fill="#FFD66B" opacity=".3"/><path d="M40 6c7 11 9 17 5 24a6 6 0 0 1-10 0c-4-7-2-13 5-24z" fill="#FFAE34"/><path d="M40 17c3 6 3 10 1 13a2.2 2.2 0 0 1-3 0c-1.5-3-1-7 2-13z" fill="#FFF6D2"/></g><path d="M40 30v7" stroke="#3A2E5A" stroke-width="2" stroke-linecap="round"/><path d="M40 36c-18 0-27 16-27 34v28c0 4 4 6 7 3l5-5 7 6 8-6 8 6 7-6 5 5c3 3 7 1 7-3V70c0-18-9-34-27-34z" fill="#FFFDF7"/><ellipse cx="32" cy="63" rx="3.4" ry="5" fill="#2A2240"/><ellipse cx="48" cy="63" rx="3.4" ry="5" fill="#2A2240"/><circle cx="26" cy="72" r="4" fill="#FFB3C8" opacity=".55"/><circle cx="54" cy="72" r="4" fill="#FFB3C8" opacity=".55"/></svg>`},
  phone:{w:106, h:80, svg:`<svg viewBox="0 0 110 82"><path d="M24 40h62l14 38a3 3 0 0 1-3 4H13a3 3 0 0 1-3-4z" fill="#FF9DBE"/><path d="M24 40h62l3 8H21z" fill="#FFB8CF"/><path d="M6 30c0-11 9-18 16-18h66c7 0 16 7 16 18 0 4-3 7-7 7H88c-3 0-6-3-6-6v-4H28v4c0 3-3 6-6 6H13c-4 0-7-3-7-7z" fill="#FF7FA8"/><circle cx="55" cy="60" r="16" fill="#FFF4F8"/><g fill="#FFB3C8">${Array.from({length:10}, (_, i) => { const a = (i / 10) * Math.PI * 1.6 + 2.2; return `<circle cx="${(55 + Math.cos(a) * 10.5).toFixed(1)}" cy="${(60 + Math.sin(a) * 10.5).toFixed(1)}" r="2.4"/>`; }).join('')}</g><circle cx="55" cy="60" r="5" fill="#FF7FA8"/></svg>`},
  plant:{w:84, h:118, svg:`<svg viewBox="0 0 90 120"><g fill="#6FB98C"><ellipse cx="45" cy="42" rx="7" ry="24"/><ellipse cx="45" cy="46" rx="7" ry="22" transform="rotate(-28 45 68)"/><ellipse cx="45" cy="46" rx="7" ry="22" transform="rotate(28 45 68)"/><ellipse cx="45" cy="52" rx="6.5" ry="18" transform="rotate(-58 45 68)"/><ellipse cx="45" cy="52" rx="6.5" ry="18" transform="rotate(58 45 68)"/></g><g fill="#9AD3AE"><ellipse cx="45" cy="52" rx="5" ry="15"/><ellipse cx="45" cy="54" rx="4.5" ry="13" transform="rotate(-35 45 68)"/><ellipse cx="45" cy="54" rx="4.5" ry="13" transform="rotate(35 45 68)"/></g><path d="M22 72h46l-6 46H28z" fill="#FFFFFF"/><rect x="18" y="66" width="54" height="11" rx="4" fill="#F3EEFB"/><path d="M28 90q17 6 34 0" stroke="#FFB3C8" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},
  mug:{w:78, h:86, svg:`<svg viewBox="0 0 80 88"><g class="steam" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M26 22q-5-6 0-12t0-10"/><path d="M36 22q-5-6 0-12t0-10"/><path d="M46 22q-5-6 0-12t0-10"/></g><path d="M58 44h6a10 10 0 0 1 0 20h-6" stroke="#FFC94A" stroke-width="7" fill="none"/><rect x="12" y="32" width="50" height="54" rx="10" fill="#FFD66B"/><rect x="12" y="32" width="50" height="9" rx="4.5" fill="#FFE8A3"/><path d="M37 70s-11-6.5-11-13.5a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 7-11 13.5-11 13.5z" fill="#FF7FA8"/></svg>`},
  stack:{w:100, h:64, svg:`<svg viewBox="0 0 104 66"><rect x="6" y="46" width="92" height="20" rx="3" fill="#7C9CFF"/><rect x="92" y="48" width="4" height="16" fill="#FFFDF6"/><rect x="12" y="26" width="82" height="20" rx="3" fill="#FFB48A"/><rect x="88" y="28" width="4" height="16" fill="#FFFDF6"/><rect x="4" y="8" width="86" height="18" rx="3" fill="#A77BFF"/><rect x="84" y="10" width="4" height="14" fill="#FFFDF6"/><rect x="20" y="14" width="34" height="3" rx="1.5" fill="#fff" opacity=".7"/><rect x="26" y="33" width="26" height="3" rx="1.5" fill="#fff" opacity=".7"/><rect x="20" y="53" width="40" height="3" rx="1.5" fill="#fff" opacity=".7"/><circle cx="72" cy="4" r="4" fill="#FFD66B"/></svg>`}
};
const DECOR_ORDER = ['bear','ghost','phone','plant','mug','stack'];
const WALL_PAT = (() => {
  const blobs = [
    ['M40 60c22-20 66-10 70 14s-22 32-44 28-42-22-26-42z','#CFE6FF',.55],
    ['M300 30c26-8 60 6 58 28s-34 22-52 16-34-36-6-44z','#FFFFFF',.35],
    ['M210 160c18-14 52-6 54 12s-18 26-36 22-34-20-18-34z','#FFD9E4',.45],
    ['M60 250c30-10 72 4 70 26s-40 30-62 22-40-36-8-48z','#BFDDFF',.5],
    ['M380 250c20-18 64-10 66 10s-22 30-44 26-36-18-22-36z','#FFF1C6',.4],
    ['M170 380c26-12 70-2 72 20s-30 32-56 26-44-32-16-46z','#CFE6FF',.5],
    ['M420 420c14-10 40-4 40 10s-16 18-30 16-24-16-10-26z','#FFFFFF',.35],
    ['M30 440c16-8 40 0 38 14s-22 18-34 14-20-20-4-28z','#FFD9E4',.4],
    ['M470 120c10-6 28 0 26 10s-14 12-22 10-14-12-4-20z','#FFFFFF',.35],
    ['M260 470c14-8 36-2 36 10s-16 16-28 14-20-14-8-24z','#FFF1C6',.4]
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520">${blobs.map(([d, c, o]) => `<path d="${d}" fill="${c}" opacity="${o}"/>`).join('')}</svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
})();

function bookMode(b){
  if(b.display === 'cover' || b.display === 'spine') return b.display;
  if(b.cover) return 'cover';
  return hash(b.id + 'm') % 3 === 0 ? 'cover' : 'spine';
}

VIEWS.books = async el => {
  const all = [...await Store.list('books')].sort((a, b) => a.createdAt - b.createdAt);
  const list = bookFilter === 'all' ? all : all.filter(b => b.status === bookFilter);
  const done = all.filter(b => b.status === 'done'), rated = all.filter(b => b.rating);
  const avg = rated.length ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1) : '–';

  const content = innerWidth > 860 ? Math.min(innerWidth - 268, 1320) - 72 : innerWidth - 32;
  const k = content < 640 ? .7 : content < 900 ? .85 : 1;
  const wallPad = content < 640 ? 28 : 72;
  const avail = content - wallPad - (content < 640 ? 20 : 48);
  const gap = 14 * k;

  const wall = h(`<section class="shelfie" style="--k:${k};--wall-pat:${WALL_PAT}">
    <div class="shelfie-head"><h1>ชั้นหนังสือของฉัน</h1><p>หนังสือที่อ่านแล้ว กำลังอ่าน และอยากอ่าน</p></div>
    <div class="shelves"></div>
    <div class="shelfie-foot"><div class="who"><span class="brand-orb"></span>${esc(META.name || '')}</div>
      <div class="pills"><span>อ่านจบ ${done.length} เล่ม</span><span>กำลังอ่าน ${all.filter(b => b.status === 'reading').length} เล่ม</span><span>คะแนนเฉลี่ย ${avg} ★</span></div></div>
  </section>`);
  const head = $('.shelfie-head', wall);
  head.append(btn('เพิ่มหนังสือ', '', () => Books.add(), 'plus'));
  if(all.length) head.append(chips([['all','ทั้งหมด'], ...BOOK_STATUS], bookFilter, v => { bookFilter = v; rerender(); }));
  const shelves = $('.shelves', wall);

  /* build items with widths */
  const items = list.map((b, i) => {
    const kk = hash(b.id + b.title), mode = bookMode(b);
    const w = mode === 'cover' ? 126 * k : (34 + kk % 18) * k;
    return {b, mode, w, h:(158 + kk % 36) * k, kk};
  });
  const decorW = name => DECOR[name].w * k;
  const rows = []; let row = [], used = 0;
  items.forEach(it => {
    const reserve = decorW('bear') + gap;
    if(row.length && used + it.w + gap > avail - reserve){ rows.push(row); row = []; used = 0; }
    row.push(it); used += it.w + gap;
  });
  if(row.length || !rows.length) rows.push(row);

  const makeDecor = name => h(`<div class="decor" style="width:${decorW(name)}px;height:${DECOR[name].h * k}px" aria-hidden="true">${DECOR[name].svg}</div>`);
  const makeBook = (it, next, prev) => {
    const {b, mode} = it, st = (BOOK_STATUS.find(s => s[0] === b.status) || [, ''])[1];
    const bc = b.color || PALETTE[it.kk % 8], bc2 = tint(bc, .28);
    const tip = `<span class="tip">${esc(b.title)}${b.rating ? ` <span class="stars">${'★'.repeat(b.rating)}</span>` : ''}</span>`;
    const ribbon = b.status === 'reading' ? '<span class="ribbon"></span>' : '';
    let el;
    if(mode === 'cover'){
      const lw = Math.max(0, ...String(b.title).split(/\s+/).filter(x => /^[\x00-\x7F]+$/.test(x)).map(x => x.length));
      const fs = lw > 8 ? Math.max(12, 17 * 8.5 / lw).toFixed(1) : 17;
      el = h(`<button class="sitem fbook" style="--bc:${bc};--bc2:${bc2};--fs:${fs}" aria-label="${esc(b.title)} ${st}"><span class="fin">${ribbon}
        <span class="fc">${b.cover ? `<img src="${b.cover}" alt="">` : `<span class="fm ${it.kk % 2 ? 'star' : ''}">${it.kk % 2 ? '✦' : ''}</span><span class="fa">${esc(b.author || '')}</span><span class="ft">${esc(b.title)}</span>`}</span></span>${tip}</button>`);
    } else {
      const lean = next && next.mode === 'spine' && it.kk % 2 === 0 && !(prev && prev.lean);
      it.lean = lean;
      el = h(`<button class="sitem sbook ${lean ? 'lean' : ''}" style="--w:${it.w}px;--h:${it.h}px;--bc:${bc};--bc2:${bc2}" aria-label="${esc(b.title)} ${st}">${ribbon}
        <span class="sp"><span class="st">${esc(b.title)}</span>${b.rating ? '<span class="sd"></span>' : ''}</span>${tip}</button>`);
    }
    el.onclick = () => openBook(b);
    return el;
  };

  rows.forEach((r, ri) => {
    const rowEl = h('<div class="shelf-row"><div class="shelf-items"></div><div class="plank"><div class="top"></div><div class="front"></div></div></div>');
    const box = $('.shelf-items', rowEl);
    const nodes = r.map((it, i) => makeBook(it, r[i + 1], r[i - 1]));
    let space = avail - r.reduce((s, it) => s + it.w + gap, 0);
    const d1 = DECOR_ORDER[(ri * 2) % DECOR_ORDER.length], d2 = DECOR_ORDER[(ri * 2 + 1) % DECOR_ORDER.length];
    if(!r.length){
      box.append(makeDecor('ghost'), h(`<p class="shelf-empty" style="align-self:center;margin:0 ${gap * 2}px">${all.length ? 'ยังไม่มีหนังสือในหมวดนี้' : 'ชั้นยังว่างอยู่ วางหนังสือเล่มแรกกัน'}</p>`), makeDecor('plant'));
    } else {
      const first = makeDecor(d1); space -= decorW(d1) + gap;
      if(ri % 2 === 0) nodes.unshift(first); else nodes.push(first);
      if(space > decorW(d2) + gap){
        space -= decorW(d2) + gap;
        const mid = Math.min(nodes.length, Math.max(1, Math.round(nodes.length * (ri % 2 ? .35 : .65))));
        nodes.splice(mid, 0, makeDecor(d2));
      }
      box.append(...nodes);
    }
    shelves.append(rowEl);
  });
  el.append(wall);
};
let booksResizeT, booksW = innerWidth;
addEventListener('resize', () => { clearTimeout(booksResizeT); booksResizeT = setTimeout(() => { if(['books','travel','profile'].includes(document.body.dataset.route) && Math.abs(innerWidth - booksW) > 60){ booksW = innerWidth; rerender(); } }, 250); });
function coverHTML(b){ return `<div class="cover" style="--bc:linear-gradient(160deg,${tint(b.color || '#FF86AE', .28)},${b.color || '#FF86AE'})">${b.cover ? `<img src="${b.cover}" alt="ปก ${esc(b.title)}">` : `<div class="ct">${esc(b.title)}</div><div class="ca">${esc(b.author || '')}</div>`}</div>`; }
function openBook(b){
  const st = (BOOK_STATUS.find(s => s[0] === b.status) || [, ''])[1];
  const body = h(`<div class="book-detail">${coverHTML(b)}<div>
    <h2>${esc(b.title)}</h2><p class="by">${b.author ? esc(b.author) : 'ไม่ระบุผู้เขียน'}</p>
    <div class="big-stars">${starsHTML(b.rating)}</div>
    <p style="margin:10px 0"><span class="pill">${st}</span> ${b.finished ? `<span class="pill">อ่านจบ ${thDate(b.finished)}</span>` : ''}</p>
    <p class="read-body" style="margin-top:6px">${b.review ? esc(b.review) : '<span class="muted">ยังไม่ได้เขียนรีวิว</span>'}</p>
  </div></div>`);
  const m = modal({title:'หนังสือ', body, wide:true, actions:[btn('แก้ไข', 'soft', () => { m.close(); Books.edit(b); }, 'edit')]});
}
