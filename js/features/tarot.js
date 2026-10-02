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
        <div class="tact"><button data-g>📖 คู่มือ${t.guide && t.guide.cards ? ` <small>${t.guide.cards.filter(c => c.meaning || c.keywords).length}/${t.guide.cards.length}</small>` : ''}</button><button data-e>แก้ไข</button><button data-f>พลิกกลับ</button></div>
      </div>
    </div></div>`);
    c.onclick = e => {
      if(e.target.closest('[data-e]')){ Tarot.edit(t); return; }
      if(e.target.closest('[data-g]')){ openGuide(t); return; }
      c.classList.toggle('flip');
      const r = c.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height / 2, 18, true);
    };
    c.onkeydown = e => { if(e.key === 'Enter' && e.target === c) c.click(); };
    grid.append(c);
  });
  el.append(grid);
};

/* =========================================================
   GUIDEBOOK: name / meaning / keywords for every card of a deck,
   either a full 78-card tarot list or a free-form oracle deck
   ========================================================= */
const TAROT_MAJOR = ['The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'];
const TAROT_SUITS = [['wands','Wands','ไม้เท้า'], ['cups','Cups','ถ้วย'], ['swords','Swords','ดาบ'], ['pentacles','Pentacles','เหรียญ']];
const TAROT_RANKS = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];
const ROMAN = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
function tarotGuideCards(){
  return [
    ...TAROT_MAJOR.map((n, i) => ({no:ROMAN[i], name:n, group:'major', meaning:'', keywords:''})),
    ...TAROT_SUITS.flatMap(([g, en]) => TAROT_RANKS.map(r => ({no:'', name:`${r} of ${en}`, group:g, meaning:'', keywords:''})))
  ];
}
let guideFilter = 'all', guideQ = '';

function openGuide(deck){
  const back = modal({title:`คู่มือ · ${deck.name}`, body:h('<div class="tg"></div>'), wide:true});
  $('.modal', back.el).classList.add('tg-modal');
  const box = $('.tg', back.el);
  const save = async () => { try{ await Store.save('tarot', deck); }catch(e){ toast('บันทึกไม่สำเร็จ'); throw e; } };

  // first time: choose tarot or oracle
  const setup = () => {
    box.innerHTML = '';
    const pick = h(`<div class="tg-setup">
      <p>สร้างคู่มือสำหรับสำรับนี้ เลือกชนิดของไพ่ก่อนนะ</p>
      <div class="tg-types">
        <button class="tg-type" data-t="tarot"><span class="tg-ico">✦</span><b>ไพ่ทาโรต์</b><small>มีรายชื่อไพ่ 78 ใบให้พร้อม (Major 22 + Minor 56) เติมแค่ความหมายกับคีย์เวิร์ด</small></button>
        <button class="tg-type" data-t="oracle"><span class="tg-ico">☾</span><b>ไพ่ออราเคิล</b><small>ตั้งชื่อไพ่เองทุกใบ เพิ่มทีละใบ หรือสร้างแถวตามจำนวนใบในสำรับ</small></button>
      </div>
    </div>`);
    $$('.tg-type', pick).forEach(b => b.onclick = async () => {
      const type = b.dataset.t;
      deck.guide = {type, cards:type === 'tarot' ? tarotGuideCards() : []};
      await save(); guideFilter = 'all'; guideQ = ''; render(); rerender();
    });
    box.append(pick);
  };

  const editCard = (card, isNew) => {
    openForm({title:isNew ? 'เพิ่มไพ่' : `แก้ไข · ${card.name || 'ไพ่'}`, value:card, fields:[
      {type:'row', fields:[{key:'name', label:'ชื่อไพ่', type:'text', required:true}, {key:'no', label:'เลข / ลำดับ', type:'text', placeholder:'เช่น 7 หรือ XVII'}]},
      {key:'meaning', label:'ความหมาย', type:'textarea', rows:5, placeholder:'ความหมายตามคู่มือของสำรับนี้'},
      {key:'keywords', label:'คีย์เวิร์ด', type:'text', placeholder:'ความหวัง, การเยียวยา, แรงบันดาลใจ', help:'คั่นแต่ละคำด้วยจุลภาค ( , )'}
    ], onSave: async v => {
      const i = deck.guide.cards.indexOf(card);
      const c = {...card, ...v, keywords:(v.keywords || '').split(/[,，、]/).map(x => x.trim()).filter(Boolean).join(', ')};
      if(isNew) deck.guide.cards.push(c); else deck.guide.cards[i] = c;
      await save(); render(); rerender();
    }, onDelete: isNew ? null : async () => { deck.guide.cards.splice(deck.guide.cards.indexOf(card), 1); await save(); render(); rerender(); }});
  };

  const render = () => {
    if(!deck.guide || !deck.guide.cards) return setup();
    const g = deck.guide, tarot = g.type === 'tarot';
    const filled = g.cards.filter(c => c.meaning || c.keywords).length;
    box.innerHTML = '';
    const head = h(`<div class="tg-head">
      <span class="tg-badge">${tarot ? '✦ ไพ่ทาโรต์' : '☾ ไพ่ออราเคิล'}</span>
      <span class="tg-prog">${LANG === 'en' ? `${filled} of ${g.cards.length} written` : `เขียนแล้ว ${filled} / ${g.cards.length} ใบ`}</span>
      <input type="search" class="tg-search" placeholder="ค้นหาชื่อ ความหมาย หรือคีย์เวิร์ด" aria-label="ค้นหาในคู่มือ">
      <button class="tg-add">${ic('plus')}<span>เพิ่มไพ่</span></button>
      <button class="tg-more" aria-label="ตั้งค่าคู่มือ" title="ตั้งค่าคู่มือ">⋯</button>
    </div>`);
    $('.tg-search', head).value = guideQ;
    box.append(head);
    if(tarot){
      const tabs = h('<div class="tg-tabs" role="tablist"></div>');
      [['all', 'ทั้งหมด'], ['major', 'ไพ่ชุดใหญ่'], ...TAROT_SUITS.map(([k, , th]) => [k, 'ชุด' + th])].forEach(([k, l]) => {
        const b = h(`<button class="${guideFilter === k ? 'on' : ''}" role="tab" aria-selected="${guideFilter === k}">${l}</button>`);
        b.onclick = () => { guideFilter = k; render(); }; tabs.append(b);
      });
      box.append(tabs);
    }
    if(!tarot && !g.cards.length){
      const n = Number(deck.count) || 0;
      const e = h(`<div class="tg-empty"><p>ยังไม่มีไพ่ในคู่มือ เพิ่มทีละใบ${n ? ` หรือสร้างแถวว่าง ${n} ใบตามจำนวนในสำรับ แล้วค่อยเติมชื่อทีหลัง` : ''}</p></div>`);
      if(n){ const b = h(`<button class="tg-btn">${ic('plus')}<span>สร้าง ${n} แถว</span></button>`); b.onclick = async () => { g.cards = Array.from({length:n}, (_, i) => ({no:String(i + 1), name:'', meaning:'', keywords:''})); await save(); render(); rerender(); }; e.append(b); }
      box.append(e);
    }
    const table = h(`<div class="tg-wrap"><table class="tg-table"><thead><tr><th class="c-no">#</th><th>ชื่อไพ่</th><th>ความหมาย</th><th>คีย์เวิร์ด</th></tr></thead><tbody></tbody></table></div>`);
    const draw = () => {
      const q = guideQ.toLowerCase(), tb = $('tbody', table); tb.innerHTML = '';
      const list = g.cards.filter(c => (!tarot || guideFilter === 'all' || c.group === guideFilter) && (!q || `${c.name} ${c.meaning} ${c.keywords}`.toLowerCase().includes(q)));
      if(!list.length && g.cards.length) tb.append(h(`<tr class="none"><td colspan="4">${T('ไม่พบไพ่ที่ค้นหา')}</td></tr>`));
      list.forEach(c => {
        const r = h(`<tr tabindex="0" class="${c.meaning || c.keywords ? '' : 'blank'}">
          <td class="c-no">${esc(c.no || '')}</td>
          <td class="c-name">${c.name ? esc(c.name) : `<i>${T('ยังไม่มีชื่อ')}</i>`}${tarot && c.group !== 'major' && guideFilter === 'all' ? `<small>${T('ชุด' + TAROT_SUITS.find(x => x[0] === c.group)[2])}</small>` : ''}</td>
          <td class="c-mean">${c.meaning ? esc(c.meaning) : `<i>${T('แตะเพื่อเขียนความหมาย')}</i>`}</td>
          <td class="c-kw">${(c.keywords || '').split(',').map(k => k.trim()).filter(Boolean).map(k => `<span class="tg-kw">${esc(k)}</span>`).join('')}</td>
        </tr>`);
        r.onclick = () => editCard(c);
        r.onkeydown = e => { if(e.key === 'Enter') editCard(c); };
        tb.append(r);
      });
    };
    $('.tg-search', head).oninput = e => { guideQ = e.target.value; draw(); };
    $('.tg-add', head).onclick = () => editCard({no:'', name:'', meaning:'', keywords:'', group:tarot && guideFilter !== 'all' ? guideFilter : (tarot ? 'major' : '')}, true);
    $('.tg-more', head).onclick = () => guideSettings();
    if(g.cards.length) box.append(table);
    draw();
  };

  const guideSettings = () => {
    const g = deck.guide;
    const body = h(`<div class="form"><p class="muted" style="margin:0">ชนิดของคู่มือตอนนี้: <b>${g.type === 'tarot' ? 'ไพ่ทาโรต์' : 'ไพ่ออราเคิล'}</b></p>
      <p class="muted" style="margin:0">เปลี่ยนชนิดได้โดยไม่ลบไพ่ที่เขียนไว้ ถ้าเปลี่ยนเป็นทาโรต์ ระบบจะเติมรายชื่อไพ่ที่ยังขาดให้ครบ 78 ใบ</p></div>`);
    const sw = btn(g.type === 'tarot' ? 'เปลี่ยนเป็นออราเคิล' : 'เปลี่ยนเป็นทาโรต์', 'soft', async () => {
      if(g.type === 'tarot'){ g.type = 'oracle'; g.cards.forEach(c => delete c.group); }
      else {
        g.type = 'tarot';
        const have = new Set(g.cards.map(c => (c.name || '').toLowerCase()));
        g.cards.forEach(c => { const t = tarotGuideCards().find(x => x.name.toLowerCase() === (c.name || '').toLowerCase()); c.group = t ? t.group : 'major'; });
        g.cards.push(...tarotGuideCards().filter(c => !have.has(c.name.toLowerCase())));
      }
      await save(); m.close(); guideFilter = 'all'; render(); rerender();
    });
    const del = deleteBtn(async () => { delete deck.guide; await save(); m.close(); render(); rerender(); });
    $('span', del).textContent = T('ลบคู่มือทั้งหมด');
    const m = modal({title:'ตั้งค่าคู่มือ', body, actions:[del, 'spacer', sw]});
  };

  render();
}

Object.assign(DICT, {'คู่มือ':'Guide', 'สร้างคู่มือสำหรับสำรับนี้ เลือกชนิดของไพ่ก่อนนะ':'Create a guidebook for this deck. First, pick the kind of deck',
  'ไพ่ทาโรต์':'Tarot', 'ไพ่ออราเคิล':'Oracle', 'ชื่อไพ่':'Card name', 'เลข / ลำดับ':'Number', 'คีย์เวิร์ด':'Keywords', 'เพิ่มไพ่':'Add card',
  'ค้นหาชื่อ ความหมาย หรือคีย์เวิร์ด':'Search names, meanings or keywords', 'ค้นหาในคู่มือ':'Search the guide', 'ตั้งค่าคู่มือ':'Guide settings',
  'ไพ่ชุดใหญ่':'Major Arcana', 'ชุดไม้เท้า':'Wands', 'ชุดถ้วย':'Cups', 'ชุดดาบ':'Swords', 'ชุดเหรียญ':'Pentacles', 'ไม่พบไพ่ที่ค้นหา':'No cards found',
  'ยังไม่มีชื่อ':'No name yet', 'แตะเพื่อเขียนความหมาย':'Tap to write the meaning', 'ลบคู่มือทั้งหมด':'Delete the whole guide',
  'เปลี่ยนเป็นออราเคิล':'Switch to oracle', 'เปลี่ยนเป็นทาโรต์':'Switch to tarot', 'คั่นแต่ละคำด้วยจุลภาค ( , )':'Separate keywords with commas',
  'ความหมายตามคู่มือของสำรับนี้':'The meaning from this deck’s guidebook'});
