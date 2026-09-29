/* =========================================================
   DIARY
   ========================================================= */
const MOODS = ['😊','🥰','😌','🤩','😴','😢','😤','🤒'];
const diaryFields = [
  {type:'row', fields:[{key:'date', label:'วันที่', type:'date', default:ymd(), required:true}, {key:'title', label:'หัวข้อ', type:'text', placeholder:'วันนี้…'}]},
  {key:'mood', label:'อารมณ์วันนี้', type:'select', options:MOODS, default:'😊'},
  {key:'body', label:'เรื่องราว', type:'textarea', rows:8, required:true, placeholder:'เล่าให้ฟังหน่อย…'},
  {key:'photos', label:'รูปภาพ', type:'images', limit:3, max:800, budget:60000, help:'เพิ่มได้สูงสุด 3 รูปต่อหนึ่งหน้า ระบบย่อขนาดให้อัตโนมัติ'}
];
const Diary = crud('diary', diaryFields, 'บันทึก', 'diary entry');
VIEWS.diary = async el => {
  const items = [...await Store.list('diary')].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
  el.append(pageHead('ไดอารี่', items.length ? `เขียนไว้แล้ว ${items.length} หน้า` : 'พื้นที่เก็บเรื่องราวในแต่ละวัน', 'เขียนบันทึก', () => Diary.add()));
  if(!items.length) return el.append(emptyState('diary', 'ยังไม่มีบันทึก เริ่มเขียนหน้าแรกของวันนี้ได้เลย', 'เขียนบันทึก', () => Diary.add()));
  const grid = h('<div class="diary-grid"></div>');
  items.forEach(it => {
    const photos = it.photos || [];
    const c = h(`<article class="dcard glass shine" tabindex="0">
      <div class="tape" aria-hidden="true"></div>
      <div class="meta"><span>${thDate(it.date)}</span><span class="mood">${esc(it.mood || '')}</span></div>
      <h3>${it.title ? esc(it.title) : 'ไม่มีหัวข้อ'}</h3>
      <p>${esc((it.body || '').slice(0, 170))}${(it.body || '').length > 170 ? '…' : ''}</p>
      ${photos.length ? `<div class="polas">${photos.map((p, i) => `<div class="pola" style="--rot:${[-4, 3, -2][i]}deg"><img src="${p}" alt=""></div>`).join('')}</div>` : ''}
    </article>`);
    c.onclick = () => readDiary(it); c.onkeydown = e => { if(e.key === 'Enter') readDiary(it); };
    grid.append(c);
  });
  el.append(grid);
};
function readDiary(it){
  const body = h(`<div>
    <div class="muted">${thDate(it.date)} <span style="font-size:22px;vertical-align:middle">${esc(it.mood || '')}</span></div>
    <p class="read-body">${esc(it.body)}</p>
    ${(it.photos || []).length ? `<div class="read-photos">${it.photos.map(p => `<img src="${p}" alt="">`).join('')}</div>` : ''}
  </div>`);
  $$('.read-photos img', body).forEach(img => img.onclick = () => viewImage(img.src));
  const m = modal({title:it.title || 'บันทึก', body, wide:true, actions:[btn('แก้ไข', 'soft', () => { m.close(); Diary.edit(it); }, 'edit')]});
}
