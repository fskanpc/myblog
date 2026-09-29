/* =========================================================
   MOVIES & CARTOONS
   ========================================================= */
const KINDS = [['movie','หนัง'], ['cartoon','การ์ตูน'], ['anime','อนิเมะ'], ['series','ซีรีส์']];
const KIND_COLOR = {movie:['#FF7FA8','#FFC2D6'], cartoon:['#F2A92A','#FFE08A'], anime:['#9A74F5','#D6C4FF'], series:['#33B89A','#A6EAD6']};
const screenFields = [
  {key:'title', label:'ชื่อเรื่อง', type:'text', required:true},
  {key:'kind', label:'ประเภท', type:'select', options:KINDS, default:'movie'},
  {type:'row', fields:[{key:'year', label:'ปีที่ออกฉาย', type:'number'}, {key:'watched', label:'ดูเมื่อ', type:'date'}]},
  {key:'status', label:'สถานะ', type:'select', options:['ดูจบแล้ว','กำลังดู','อยากดู'], default:'ดูจบแล้ว'},
  {key:'rating', label:'คะแนน', type:'stars', default:0},
  {key:'poster', label:'โปสเตอร์หรือภาพหน้าตั๋ว', type:'image', max:600, budget:100000},
  {key:'stills', label:'ภาพจากเรื่อง', type:'images', limit:4, max:700, budget:55000, help:'ฉากที่ชอบ ใส่ได้สูงสุด 4 ภาพ'},
  {key:'notes', label:'ความประทับใจ', type:'textarea', rows:4, placeholder:'ฉากที่ชอบ ตัวละครที่รัก…'}
];
const Screen = crud('screen', screenFields, 'เรื่องโปรด', 'favorite');
let screenFilter = 'all';
VIEWS.screen = async el => {
  const all = [...await Store.list('screen')].sort((a, b) => (b.watched || '').localeCompare(a.watched || '') || b.createdAt - a.createdAt);
  const addPreset = () => Screen.add({kind: screenFilter === 'all' ? 'movie' : screenFilter});
  const done = all.filter(s => s.status === 'ดูจบแล้ว').length;
  const mq = h(`<section class="marquee"><div class="marquee-in">
    <div><p class="now">NOW SHOWING</p><h1>โรงหนังของฉัน</h1><p class="sub">${all.length ? `สะสมตั๋วไว้ ${all.length} ใบ ดูจบแล้ว ${done} เรื่อง` : 'เก็บตั๋วหนัง การ์ตูน และซีรีส์ที่รัก'}</p></div>
  </div></section>`);
  $('.marquee-in', mq).append(btn('เพิ่มตั๋วใหม่', '', addPreset, 'plus'));
  el.append(mq);
  el.append(chips([['all','ทั้งหมด'], ...KINDS], screenFilter, v => { screenFilter = v; rerender(); }));
  const list = screenFilter === 'all' ? all : all.filter(s => s.kind === screenFilter);
  if(!list.length) return el.append(emptyState('screen', 'ยังไม่มีตั๋วในหมวดนี้ เพิ่มเรื่องที่ชอบได้เลย', 'เพิ่มตั๋วใหม่', addPreset));
  const grid = h('<div class="mtickets"></div>');
  list.forEach(s => {
    const [tc, c2] = KIND_COLOR[s.kind] || KIND_COLOR.movie;
    const kind = (KINDS.find(k => k[0] === s.kind) || [, ''])[1];
    const no = String(hash(s.id) % 100000).padStart(5, '0');
    const t = h(`<button class="mt-wrap" aria-label="${esc(s.title)}"><span class="mticket" style="--tc:${tc};--c2:${c2}">
      <span class="mt-poster">${s.poster ? `<img src="${s.poster}" alt="">` : `<span class="noimg">${ic('screen')}${esc(s.title)}</span>`}</span>
      <span class="mt-main">
        <span class="mt-top"><span>ADMIT ONE</span><span class="k">${kind}</span></span>
        <span class="mt-title">${esc(s.title)}</span>
        <span class="mt-meta"><span>รอบ<b>${s.watched ? thDate(s.watched, true) : '—'}</b></span><span>ปี<b>${esc(s.year || '—')}</b></span><span>สถานะ<b>${escT(s.status || '—')}</b></span></span>
        <span class="mt-stars">${starsHTML(s.rating)}</span>
      </span>
      <span class="mt-stub"><span class="no">No.${no}</span><span class="adm">TICKET</span><span class="vbar"></span></span>
    </span></button>`);
    t.onclick = () => openScreen(s);
    grid.append(t);
  });
  el.append(grid);
};
function openScreen(s){
  const kind = (KINDS.find(k => k[0] === s.kind) || [, ''])[1];
  const [tc, c2] = KIND_COLOR[s.kind] || KIND_COLOR.movie;
  const stills = s.stills || [];
  const body = h(`<div><div class="book-detail">
    <div class="cover" style="--bc:linear-gradient(160deg,${c2},${tc});border-radius:14px">${s.poster ? `<img src="${s.poster}" alt="">` : `<div class="ct">${esc(s.title)}</div><div class="ca">${kind}</div>`}</div>
    <div><h2>${esc(s.title)}</h2><p class="by">${kind}${s.year ? ' ปี ' + esc(s.year) : ''}</p>
    <div class="big-stars">${starsHTML(s.rating)}</div>
    <p style="margin:10px 0"><span class="pill">${escT(s.status || '')}</span> ${s.watched ? `<span class="pill">ดูเมื่อ ${thDate(s.watched)}</span>` : ''}</p>
    <p class="read-body">${esc(s.notes || '')}</p></div></div>
    ${stills.length ? `<div class="mt-strip"><div class="frames">${stills.map(x => `<img src="${x}" alt="">`).join('')}</div></div>` : ''}
  </div>`);
  $$('.mt-strip img', body).forEach(img => img.onclick = () => viewImage(img.src));
  const m = modal({title:'ตั๋วหนัง', body, wide:true, actions:[btn('แก้ไข', 'soft', () => { m.close(); Screen.edit(s); }, 'edit')]});
}
