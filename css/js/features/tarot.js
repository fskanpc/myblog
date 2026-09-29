/* =========================================================
   TAROT
   ========================================================= */
const tarotFields = [
  {key:'name', label:'ชื่อสำรับ', type:'text', required:true},
  {type:'row', fields:[{key:'creator', label:'ผู้ออกแบบ / สำนักพิมพ์', type:'text'}, {key:'count', label:'จำนวนใบ', type:'number', default:78}]},
  {type:'row', fields:[{key:'bought', label:'วันที่ซื้อ', type:'date', default:ymd()}, {key:'price', label:'ราคา (บาท)', type:'number'}]},
  {key:'shop', label:'ซื้อจากที่ไหน', type:'text'},
  {key:'energy', label:'พลังของสำรับ', type:'select', options:['อ่อนโยน','ลึกลับ','สดใส','ดุดัน','ฝันหวาน']},
  {key:'image', label:'รูปสำรับ', type:'image', max:600, budget:110000},
  {key:'notes', label:'บันทึกเพิ่มเติม', type:'textarea', rows:4, placeholder:'ความรู้สึกแรกที่เปิดกล่อง ใบที่ชอบที่สุด…'}
];
const Tarot = crud('tarot', tarotFields, 'สำรับไพ่', 'tarot deck');
const SIGIL = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="38" stroke-dasharray="2 3"/><path d="M50 8L58 42 92 50 58 58 50 92 42 58 8 50 42 42z"/><circle cx="50" cy="50" r="12"/><path d="M50 22a28 28 0 1 0 0.1 0" stroke-dasharray="1 4"/><path d="M20 20l60 60M80 20L20 80" stroke-opacity=".4"/></svg>`;
VIEWS.tarot = async el => {
  const items = [...await Store.list('tarot')].sort((a, b) => (b.bought || '').localeCompare(a.bought || ''));
  const total = items.reduce((s, t) => s + (Number(t.price) || 0), 0);
  el.append(pageHead('Tarot Vault', items.length ? `สะสมไว้ <span class="tarot-count">${items.length}</span> สำรับ${total ? ` มูลค่ารวม ${total.toLocaleString('th-TH')} บาท` : ''}` : 'ห้องเก็บสำรับไพ่ที่ฉันรัก', 'เพิ่มสำรับ', () => Tarot.add()));
  el.append(h('<div class="moon-row" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>'));
  if(!items.length) return el.append(emptyState('tarot', 'ยังไม่มีสำรับในคลัง เพิ่มสำรับแรกเพื่อเริ่มสะสม', 'เพิ่มสำรับ', () => Tarot.add()));
  const grid = h('<div class="tarot-grid"></div>');
  items.forEach(t => {
    const c = h(`<div class="tcard" tabindex="0" role="button" aria-label="${esc(t.name)} แตะเพื่อพลิกดูรายละเอียด"><div class="tcard-in">
      <div class="tface tfront">
        ${t.image ? `<img src="${t.image}" alt="">` : `<div class="sigil">${SIGIL}</div>`}
        <span class="tcorner" style="top:12px;left:14px">✦</span><span class="tcorner" style="top:12px;right:14px">✦</span>
        <div class="tname">${esc(t.name)}</div>
      </div>
      <div class="tface tback">
        <h3>${esc(t.name)}</h3>
        <dl>
          ${t.creator ? `<dt>ผู้ออกแบบ</dt><dd>${esc(t.creator)}</dd>` : ''}
          ${t.count ? `<dt>จำนวน</dt><dd>${esc(t.count)} ${L('ใบ', 'cards')}</dd>` : ''}
          ${t.bought ? `<dt>ซื้อเมื่อ</dt><dd>${thDate(t.bought, true)}</dd>` : ''}
          ${t.price ? `<dt>ราคา</dt><dd>${Number(t.price).toLocaleString('th-TH')} ฿</dd>` : ''}
          ${t.shop ? `<dt>ร้าน</dt><dd>${esc(t.shop)}</dd>` : ''}
          ${t.energy ? `<dt>พลัง</dt><dd>${escT(t.energy)}</dd>` : ''}
        </dl>
        <div class="tnote">${esc(t.notes || '')}</div>
        <div class="tact"><button data-e>แก้ไข</button><button data-f>พลิกกลับ</button></div>
      </div>
    </div></div>`);
    c.onclick = e => {
      if(e.target.closest('[data-e]')){ Tarot.edit(t); return; }
      c.classList.toggle('flip');
      const r = c.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height / 2, 18, true);
    };
    c.onkeydown = e => { if(e.key === 'Enter' && e.target === c) c.click(); };
    grid.append(c);
  });
  el.append(grid);
};
