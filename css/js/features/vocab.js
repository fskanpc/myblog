/* =========================================================
   VOCAB
   ========================================================= */
const vocabFields = [
  {type:'row', fields:[{key:'word', label:'คำศัพท์', type:'text', required:true}, {key:'reading', label:'คำอ่าน', type:'text', placeholder:'เช่น /ˈbʌb.əl/'}]},
  {key:'pos', label:'ชนิดของคำ', type:'select', options:['n.','v.','adj.','adv.','phrase','อื่น ๆ']},
  {key:'meaning', label:'ความหมาย', type:'text', required:true},
  {key:'example', label:'ประโยคตัวอย่าง', type:'textarea', rows:2},
  {key:'lang', label:'ภาษา', type:'select', options:['อังกฤษ','ญี่ปุ่น','เกาหลี','จีน','อื่น ๆ'], default:'อังกฤษ'}
];
const Vocab = crud('vocab', vocabFields, 'คำศัพท์', 'word');
let vocabMode = 'book', vocabQ = '', vocabDeck = null, vocabIdx = 0, vocabKnown = 0;
VIEWS.vocab = async el => {
  const all = [...await Store.list('vocab')].sort((a, b) => b.createdAt - a.createdAt);
  const learned = all.filter(w => w.learned).length;
  el.append(pageHead('สมุดคำศัพท์', all.length ? `${all.length} คำ จำได้แล้ว ${learned} คำ` : 'จดไว้ ท่องทุกวัน', 'จดคำใหม่', () => Vocab.add()));
  el.append(chips([['book','สมุดจด'], ['practice','โหมดท่อง']], vocabMode, v => { vocabMode = v; vocabDeck = null; rerender(); }));
  if(!all.length) return el.append(emptyState('vocab', 'สมุดยังว่าง จดคำศัพท์คำแรกเลย', 'จดคำใหม่', () => Vocab.add()));
  if(vocabMode === 'practice') return practice(el, all);
  const tools = h(`<div class="vtools"><input type="search" placeholder="ค้นหาคำหรือความหมาย" aria-label="ค้นหาคำศัพท์" value="${escT(vocabQ)}"></div>`);
  const book = h('<div class="notebook"><div class="rings" aria-hidden="true">' + '<i></i>'.repeat(6) + '</div><div class="vlist"></div></div>');
  const draw = () => {
    const q = vocabQ.toLowerCase();
    const list = all.filter(w => !q || (w.word + ' ' + w.meaning).toLowerCase().includes(q));
    const vl = $('.vlist', book); vl.innerHTML = '';
    if(!list.length) vl.append(h('<p class="muted">ไม่พบคำที่ค้นหา</p>'));
    list.forEach(w => {
      const row = h(`<div class="vword ${w.learned ? 'learned' : ''}">
        <div class="w">${esc(w.word)}<small>${esc(w.reading || '')} ${w.pos ? `<span class="pill">${escT(w.pos)}</span>` : ''}</small></div>
        <div class="m">${esc(w.meaning)}</div>${w.example ? `<div class="ex">${esc(w.example)}</div>` : ''}
        <div class="acts"><button class="check ${w.learned ? 'on' : ''}" aria-label="จำได้แล้ว" title="จำได้แล้ว">${ic('check')}</button><button class="icon-btn" aria-label="แก้ไข">${ic('edit')}</button></div>
      </div>`);
      const [chk, ed] = $$('.acts button', row);
      chk.onclick = async () => { w.learned = !w.learned; try{ await Store.save('vocab', w); }catch(e){ toast('บันทึกไม่สำเร็จ'); } rerender(); };
      ed.onclick = () => Vocab.edit(w);
      vl.append(row);
    });
  };
  $('input', tools).oninput = e => { vocabQ = e.target.value; draw(); };
  draw();
  el.append(tools, book);
};
function practice(el, all){
  if(!vocabDeck){
    let pool = all.filter(w => !w.learned); if(!pool.length) pool = [...all];
    vocabDeck = pool.sort(() => Math.random() - .5).map(w => w.id); vocabIdx = 0; vocabKnown = 0;
  }
  const wrap = h('<div class="flash-wrap"></div>');
  if(vocabIdx >= vocabDeck.length){
    wrap.append(h(`<div class="glass" style="padding:36px 24px"><h2 style="font-size:28px">ท่องครบรอบแล้ว</h2><p class="muted">จำได้ ${vocabKnown} จาก ${vocabDeck.length} คำ</p></div>`));
    const again = btn('สุ่มรอบใหม่', '', () => { vocabDeck = null; rerender(); }, 'shuffle'); again.style.marginTop = '18px';
    wrap.append(again); return el.append(wrap);
  }
  const w = all.find(x => x.id === vocabDeck[vocabIdx]);
  if(!w){ vocabIdx++; return practice(el, all); }
  wrap.append(h(`<p class="muted" style="margin:0 0 8px">คำที่ ${vocabIdx + 1} จาก ${vocabDeck.length}</p>`));
  wrap.append(h(`<div class="progress"><i style="width:${vocabIdx / vocabDeck.length * 100}%"></i></div>`));
  const card = h(`<div class="flash" tabindex="0" role="button" aria-label="แตะเพื่อดูความหมาย"><div class="flash-in">
    <div class="face"><div class="fw">${esc(w.word)}</div><div class="muted">${esc(w.reading || '')}</div><div class="hint">แตะเพื่อดูความหมาย</div></div>
    <div class="face back"><div class="fm">${esc(w.meaning)}</div>${w.example ? `<p class="muted" style="font-style:italic;max-width:40ch">${esc(w.example)}</p>` : ''}</div>
  </div></div>`);
  card.onclick = () => card.classList.toggle('flip');
  card.onkeydown = e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.click(); } };
  const btns = h('<div class="flash-btns"></div>');
  btns.append(
    btn('ยังไม่แน่ใจ', 'soft', () => { vocabIdx++; rerender(); }),
    btn('จำได้แล้ว', '', async () => { vocabKnown++; w.learned = true; try{ await Store.save('vocab', w); }catch(e){} vocabIdx++; rerender(); }, 'check')
  );
  wrap.append(card, btns);
  el.append(wrap);
}
