/* =========================================================
   DIARY: a spiral journal open on a gingham tablecloth,
   one spread per entry (left page: day + story on ruled lines,
   right page: bubble-letter title, little checklist, polaroids)
   ========================================================= */
const MOODS = ['😊','🥰','😌','🤩','😴','😢','😤','🤒'];
const diaryFields = [
  {type:'row', fields:[{key:'date', label:'วันที่', type:'date', default:ymd(), required:true}, {key:'title', label:'หัวข้อ', type:'text', placeholder:'วันนี้…'}]},
  {type:'row', fields:[{key:'mood', label:'อารมณ์วันนี้', type:'select', options:MOODS, default:'😊'}, {key:'place', label:'ที่ไหน', type:'text', placeholder:'at the park'}]},
  {key:'body', label:'เรื่องราว', type:'textarea', rows:8, required:true, placeholder:'เล่าให้ฟังหน่อย…'},
  {key:'list', label:'ลิสต์เล็ก ๆ', type:'textarea', rows:3, placeholder:'matcha tea\nshortcake\ncookies', help:'บรรทัดละหนึ่งอย่าง จะขึ้นเป็นเช็กลิสต์ในหน้าขวา (ไม่ใส่ก็ได้)'},
  {key:'photos', label:'รูปภาพ', type:'images', limit:3, max:800, budget:60000, help:'เพิ่มได้สูงสุด 3 รูปต่อหนึ่งหน้า ระบบย่อขนาดให้อัตโนมัติ'}
];
const Diary = crud('diary', diaryFields, 'บันทึก', 'diary entry');
let diaryPage = 0;

const DY_COLORS = ['#E8505B', '#F29B38', '#E9B92F', '#8DB04A', '#5A9BD8', '#9A7BDB', '#E36FA0'];
const dyGraphemes = s => (window.Intl && Intl.Segmenter) ? [...new Intl.Segmenter(LANG === 'en' ? 'en' : 'th', {granularity:'grapheme'}).segment(s)].map(x => x.segment) : [...s];
const rainbow = s => dyGraphemes(s).map((g, i) => g.trim() ? `<span style="color:${DY_COLORS[i % DY_COLORS.length]}">${escT(g)}</span>` : g).join('');
const bubble = s => dyGraphemes(s).map((g, i) => g.trim() ? `<span class="${i % 2 ? 'g' : 'r'}">${escT(g)}</span>` : ' ').join('');

/* little hand-drawn doodles (original) */
const DY_ART = {
  clip:c => `<svg viewBox="0 0 60 60"><path d="M30 4l6 16 17 1-13 11 5 17-15-9-15 9 5-17L7 21l17-1z" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/><path d="M30 14l3 9 9 1-7 6 3 9-8-5-8 5 3-9-7-6 9-1z" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" opacity=".65"/></svg>`,
  daisy:'<svg viewBox="0 0 70 80"><path d="M35 40 Q40 62 48 76" fill="none" stroke="#8DB04A" stroke-width="2.5" stroke-linecap="round"/><g fill="#FFF8EE" stroke="#E9A23B" stroke-width="2">' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="35" cy="22" rx="6" ry="12" transform="rotate(${a} 35 34)"/>`).join('') + '</g><circle cx="35" cy="34" r="7" fill="#F29B38" stroke="#E07A2A" stroke-width="2"/></svg>',
  cake:'<svg viewBox="0 0 120 100"><path d="M14 52 L92 30 L106 56 L106 82 L14 90Z" fill="#FFE7A8" stroke="#E9A23B" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 52 L92 30 L106 56 L14 70Z" fill="#FFD3DD" stroke="#E58AA4" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 74 L106 66" stroke="#F27A90" stroke-width="5"/><g fill="#fff" stroke="#E58AA4" stroke-width="2">' + [22, 36, 50, 64, 78].map((x, i) => `<circle cx="${x}" cy="${52 - i * 4.4}" r="6"/>`).join('') + '</g><path d="M62 30c-6-12 6-20 10-10 4-10 16-2 10 10-4 8-16 8-20 0z" fill="#F0505F" stroke="#C93A48" stroke-width="2"/><path d="M70 22l2-6" stroke="#8DB04A" stroke-width="2.5" stroke-linecap="round"/></svg>',
  fork:'<svg viewBox="0 0 30 90"><path d="M9 4v22M15 4v22M21 4v22M7 24c0 8 16 8 16 0M15 32v54" fill="none" stroke="#5A8BD8" stroke-width="3.5" stroke-linecap="round"/></svg>',
  star:c => `<svg viewBox="0 0 40 40"><path d="M20 3l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="${c}" stroke="#E07A2A" stroke-width="2" stroke-linejoin="round"/></svg>`,
  bunny:'<svg viewBox="0 0 120 110"><g fill="#fff" stroke="#E2C9C9" stroke-width="2.5"><ellipse cx="44" cy="30" rx="12" ry="28"/><ellipse cx="76" cy="30" rx="12" ry="28"/><ellipse cx="60" cy="74" rx="44" ry="34"/></g><ellipse cx="44" cy="30" rx="5" ry="18" fill="#FFD3DD"/><ellipse cx="76" cy="30" rx="5" ry="18" fill="#FFD3DD"/><path d="M48 70l8 8M56 70l-8 8M66 70l8 8M74 70l-8 8" stroke="#5A4A5A" stroke-width="3" stroke-linecap="round"/><ellipse cx="38" cy="84" rx="8" ry="5" fill="#FFC2CF"/><ellipse cx="82" cy="84" rx="8" ry="5" fill="#FFC2CF"/></svg>',
  pen:'<svg viewBox="0 0 60 240"><rect x="14" y="0" width="32" height="170" rx="10" fill="#8DB04A" stroke="#5E8530" stroke-width="3"/><rect x="14" y="150" width="32" height="20" fill="#B9D57A"/><path d="M14 170 L46 170 L34 214 L26 214Z" fill="#FFF3D6" stroke="#C9A060" stroke-width="3"/><path d="M26 214 L34 214 L30 230Z" fill="#5A4A3A"/></svg>',
  tape:'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#9DB9EE" stroke="#5A82CF" stroke-width="3"/><circle cx="60" cy="60" r="56" fill="url(#dyGrid)"/><circle cx="60" cy="60" r="24" fill="#FFF8EE" stroke="#5A82CF" stroke-width="3"/><defs><pattern id="dyGrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/></pattern></defs></svg>'
};

VIEWS.diary = async el => {
  const items = [...await Store.list('diary')].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
  el.append(pageHead('ไดอารี่', items.length ? `เขียนไว้แล้ว ${items.length} หน้า` : 'พื้นที่เก็บเรื่องราวในแต่ละวัน', 'เขียนบันทึก', () => { diaryPage = 0; Diary.add(); }));
  diaryPage = Math.max(0, Math.min(diaryPage, items.length - 1));

  const desk = h(`<div class="dy-desk">
    <span class="dy-prop clip a" aria-hidden="true">${DY_ART.clip('#E8505B')}</span>
    <span class="dy-prop clip b" aria-hidden="true">${DY_ART.clip('#6F9BE3')}</span>
    <span class="dy-prop clip c" aria-hidden="true">${DY_ART.clip('#F29B38')}</span>
    <span class="dy-prop pen" aria-hidden="true">${DY_ART.pen}</span>
    <span class="dy-prop tape" aria-hidden="true">${DY_ART.tape}</span>
    <div class="dy-book"></div>
    <nav class="dy-nav" aria-label="เปิดหน้า">
      <button class="dy-turn prev" aria-label="หน้าก่อน">${ic('left')}</button>
      <span class="dy-count"></span>
      <button class="dy-turn next" aria-label="หน้าถัดไป">${ic('right')}</button>
    </nav>
  </div>`);
  el.append(desk);
  const book = $('.dy-book', desk);

  const spread = it => {
    if(!it) return h(`<div class="dy-spread empty">
      <section class="dy-page left"><div class="dy-day">${rainbow(T('วันนี้'))}</div><div class="dy-lines"><p>${T('ยังไม่มีบันทึก เริ่มเขียนหน้าแรกของวันนี้ได้เลย')}</p></div></section>
      <div class="dy-rings" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
      <section class="dy-page right"><h2 class="dy-title">${bubble('Dear Diary')}</h2><div class="dy-polas"><figure class="dy-pola" style="--r:3deg"><div class="ph blank">${DY_ART.bunny}<b>hello!</b></div><figcaption>${thDate(ymd(), true)}</figcaption></figure></div></section>
    </div>`);
    const d = it.date ? new Date(it.date + 'T00:00') : new Date();
    const dayName = LANG === 'en' ? EN_DAYS[d.getDay()].toUpperCase() : 'วัน' + TH_DAYS[d.getDay()];
    const list = (it.list || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 6);
    const photos = it.photos || [];
    const s = h(`<div class="dy-spread">
      <section class="dy-page left">
        <span class="dy-lace" aria-hidden="true"></span><span class="dy-washi" aria-hidden="true"></span>
        ${it.place ? `<div class="dy-note"><span>${esc(it.place)}</span><i aria-hidden="true">${DY_ART.daisy}</i><b class="dy-mtape" aria-hidden="true"></b></div>` : ''}
        <div class="dy-day">${rainbow(dayName)} <span class="dy-num">${d.getDate()}</span> <span class="dy-mood" title="${T('อารมณ์วันนี้')}">${esc(it.mood || '')}</span></div>
        <div class="dy-lines"><p>${esc(it.body || '')}</p></div>
        <span class="dy-cake" aria-hidden="true">${DY_ART.cake}</span><span class="dy-fork" aria-hidden="true">${DY_ART.fork}</span>
      </section>
      <div class="dy-rings" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
      <section class="dy-page right">
        <h2 class="dy-title">${it.title ? `<small>~ ${esc(thDate(it.date, true))} ~</small>${bubble(it.title)}` : bubble(T('บันทึก'))}</h2>
        ${list.length ? `<ul class="dy-check">${list.map((x, i) => `<li><i style="--c:${DY_COLORS[(i * 2 + 3) % DY_COLORS.length]}"></i>${esc(x)}</li>`).join('')}</ul><span class="dy-squig" aria-hidden="true"></span>` : ''}
        <div class="dy-polas n${Math.max(1, photos.length)}">
          <span class="dy-paper" aria-hidden="true"></span>
          ${(photos.length ? photos : [null]).map((p, i) => `<figure class="dy-pola" style="--r:${[3, -5, 6][i]}deg">
            <div class="ph ${p ? '' : 'blank'}">${p ? `<img src="${p}" alt="">` : `${DY_ART.bunny}<b>${esc(it.mood || '♡')}</b>`}</div>
            <figcaption>${thDate(it.date, true)}</figcaption>
            <span class="dy-star a" aria-hidden="true">${DY_ART.star('#F7B53B')}</span>${i === 0 ? `<span class="dy-star b" aria-hidden="true">${DY_ART.star('#F27A3A')}</span>` : ''}
          </figure>`).join('')}
        </div>
        <button class="dy-edit">${ic('edit')}<span>แก้ไข</span></button>
      </section>
    </div>`);
    $('.dy-edit', s).onclick = () => Diary.edit(it);
    $$('.dy-pola img', s).forEach(img => img.onclick = () => viewImage(img.src));
    return s;
  };

  const show = dir => {
    const it = items[diaryPage];
    const next = spread(it);
    if(dir && !REDUCED) next.classList.add(dir > 0 ? 'in-next' : 'in-prev');
    book.innerHTML = ''; book.append(next);
    $('.dy-count', desk).textContent = items.length ? (LANG === 'en' ? `page ${items.length - diaryPage} of ${items.length}` : `หน้า ${items.length - diaryPage} / ${items.length}`) : '';
    $('.prev', desk).disabled = diaryPage >= items.length - 1;   // older
    $('.next', desk).disabled = diaryPage <= 0;                  // newer
    $('.dy-nav', desk).hidden = items.length < 2;
  };
  $('.prev', desk).onclick = () => { if(diaryPage < items.length - 1){ diaryPage++; show(-1); } };
  $('.next', desk).onclick = () => { if(diaryPage > 0){ diaryPage--; show(1); } };
  show(0);
};

Object.assign(DICT, {'ที่ไหน':'Where', 'ลิสต์เล็ก ๆ':'Little list', 'บรรทัดละหนึ่งอย่าง จะขึ้นเป็นเช็กลิสต์ในหน้าขวา (ไม่ใส่ก็ได้)':'One item per line, shown as a checklist on the right page (optional)', 'เปิดหน้า':'Turn pages', 'หน้าก่อน':'Older page', 'หน้าถัดไป':'Newer page'});
