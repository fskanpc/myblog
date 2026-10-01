/* =========================================================
   VOCAB
   ========================================================= */
const VOCAB_POS = [['n.','noun'], ['pron.','pronoun'], ['v.','verb'], ['adj.','adjective'], ['adv.','adverb'], ['prep.','preposition'], ['conj.','conjunction'], ['interj.','interjection'], ['det.','determiner'], ['phr. v.','phrasal verb'], ['idiom','idiom'], ['phrase','phrase']];
const posList = w => (Array.isArray(w.pos) ? w.pos : w.pos ? [w.pos] : []).filter(p => p && p !== 'อื่น ๆ');
const vocabCats = all => [...new Set([...(META.vocabCats || []), ...all.map(w => w.cat).filter(Boolean)])].sort((a, b) => a.localeCompare(b, 'th'));
const vocabFields = all => [
  {type:'row', fields:[{key:'word', label:'คำศัพท์', type:'text', required:true}, {key:'reading', label:'คำอ่าน', type:'text', placeholder:'เช่น /ˈbʌb.əl/'}]},
  {key:'pos', label:'ชนิดของคำ (part of speech) เลือกได้หลายอย่าง', type:'multi', options:VOCAB_POS.map(([v, l]) => [v, `${v} <small>${l}</small>`]), addable:'เพิ่มชนิดคำเอง เช่น modal verb'},
  {key:'meaning', label:'ความหมาย', type:'text', required:true},
  {key:'example', label:'ประโยคตัวอย่าง', type:'textarea', rows:2},
  {key:'image', label:'รูปประกอบ', type:'image', max:600, budget:50000, help:'รูปช่วยจำ ระบบย่อขนาดให้อัตโนมัติ'},
  {key:'cat', label:'หมวดหมู่', type:'select', options:[['', 'ไม่มีหมวด'], ...vocabCats(all)], addable:'สร้างหมวดใหม่ เช่น อาหาร', default:vocabCat && vocabCat !== '*' ? vocabCat : ''},
  {key:'lang', label:'ภาษา', type:'select', options:['อังกฤษ','ญี่ปุ่น','เกาหลี','จีน','อื่น ๆ'], default:'อังกฤษ'}
];
const Vocab = {
  add(all){ openForm({title:'เพิ่มคำศัพท์', fields:vocabFields(all), value:{}, onSave: async v => { await Store.save('vocab', v); rerender(); }}); },
  edit(w, all){ openForm({title:'แก้ไขคำศัพท์', fields:vocabFields(all), value:w, onSave: async v => { await Store.save('vocab', v); rerender(); }, onDelete: async () => { await Store.remove('vocab', w.id); rerender(); }}); }
};
let vocabMode = 'book', vocabQ = '', vocabDeck = null, vocabIdx = 0, vocabKnown = 0, vocabCat = '*';
async function saveCats(list){ META.vocabCats = list; try{ await Store.setMeta(META); }catch(e){ toast('บันทึกไม่สำเร็จ'); } }
function newCategory(all){
  const body = h('<div class="form"><div class="field"><label for="vc-name">ชื่อหมวด</label><input id="vc-name" maxlength="40" placeholder="เช่น อาหาร, TOEIC, เดินทาง"></div></div>');
  const ok = btn('สร้างหมวด', '', async () => {
    const name = $('input', body).value.trim(); if(!name) return;
    if(!vocabCats(all).includes(name)) await saveCats([...(META.vocabCats || []), name]);
    vocabCat = name; m.close(); rerender();
  }, 'plus');
  const m = modal({title:'หมวดหมู่ใหม่', body, actions:[btn('ยกเลิก', 'soft', () => m.close()), ok]});
  $('input', body).onkeydown = e => { if(e.key === 'Enter') ok.click(); };
}
function manageCategory(name, all){
  const words = all.filter(w => w.cat === name);
  const body = h(`<div class="form"><div class="field"><label for="vc-rn">ชื่อหมวด</label><input id="vc-rn" maxlength="40"></div><p class="muted" style="margin:0">มี ${words.length} คำในหมวดนี้ ถ้าลบหมวด คำศัพท์จะยังอยู่ แค่ไม่มีหมวด</p></div>`);
  $('input', body).value = name;
  const save = btn('บันทึก', '', async () => {
    const nn = $('input', body).value.trim(); if(!nn || nn === name) return m.close();
    save.disabled = true;
    for(const w of words){ w.cat = nn; try{ await Store.save('vocab', w); }catch(e){} }
    await saveCats([...(META.vocabCats || []).filter(c => c !== name && c !== nn), nn]);
    vocabCat = nn; m.close(); rerender();
  }, 'check');
  const del = deleteBtn(async () => {
    for(const w of words){ w.cat = ''; try{ await Store.save('vocab', w); }catch(e){} }
    await saveCats((META.vocabCats || []).filter(c => c !== name));
    vocabCat = '*'; m.close(); rerender();
  });
  const m = modal({title:'จัดการหมวด', body, actions:[del, 'spacer', btn('ยกเลิก', 'soft', () => m.close()), save]});
}
VIEWS.vocab = async el => {
  const every = [...await Store.list('vocab')].sort((a, b) => b.createdAt - a.createdAt);
  const cats = vocabCats(every);
  if(vocabCat !== '*' && vocabCat !== '' && !cats.includes(vocabCat)) vocabCat = '*';
  const all = vocabCat === '*' ? every : every.filter(w => (w.cat || '') === vocabCat);
  const learned = every.filter(w => w.learned).length;
  el.append(pageHead('สมุดคำศัพท์', every.length ? `${every.length} คำ จำได้แล้ว ${learned} คำ` : 'จดไว้ ท่องทุกวัน', 'จดคำใหม่', () => Vocab.add(every)));

  // categories
  const catRow = h('<div class="vcats" role="tablist" aria-label="หมวดหมู่"></div>');
  const chip = (val, label, n) => {
    const b = h(`<button class="vcat ${vocabCat === val ? 'on' : ''}" role="tab" aria-selected="${vocabCat === val}">${label}${n !== undefined ? ` <small>${n}</small>` : ''}</button>`);
    b.onclick = () => { vocabCat = val; vocabDeck = null; rerender(); };
    catRow.append(b);
  };
  chip('*', T('ทั้งหมด'), every.length);
  cats.forEach(c => chip(c, esc(c), every.filter(w => w.cat === c).length));
  if(cats.length && every.some(w => !w.cat)) chip('', T('ไม่มีหมวด'), every.filter(w => !w.cat).length);
  const nb = h(`<button class="vcat add">${ic('plus')}<span>หมวดใหม่</span></button>`); nb.onclick = () => newCategory(every); catRow.append(nb);
  if(vocabCat !== '*' && vocabCat !== ''){ const mb = h(`<button class="vcat manage" aria-label="จัดการหมวดนี้">${ic('edit')}</button>`); mb.onclick = () => manageCategory(vocabCat, every); catRow.append(mb); }
  el.append(catRow);

  el.append(chips([['book','สมุดจด'], ['practice','โหมดท่อง']], vocabMode, v => { vocabMode = v; vocabDeck = null; rerender(); }));
  if(!every.length) return el.append(emptyState('vocab', 'สมุดยังว่าง จดคำศัพท์คำแรกเลย', 'จดคำใหม่', () => Vocab.add(every)));
  if(!all.length) return el.append(emptyState('vocab', 'หมวดนี้ยังว่าง จดคำแรกของหมวดนี้เลย', 'จดคำใหม่', () => Vocab.add(every)));
  if(vocabMode === 'practice') return practice(el, all);
  const tools = h(`<div class="vtools"><input type="search" placeholder="ค้นหาคำหรือความหมาย" aria-label="ค้นหาคำศัพท์" value="${escT(vocabQ)}"></div>`);
  const book = h('<div class="notebook"><div class="rings" aria-hidden="true">' + '<i></i>'.repeat(6) + '</div><div class="vlist"></div></div>');
  const draw = () => {
    const q = vocabQ.toLowerCase();
    const list = all.filter(w => !q || (w.word + ' ' + w.meaning).toLowerCase().includes(q));
    const vl = $('.vlist', book); vl.innerHTML = '';
    if(!list.length) vl.append(h('<p class="muted">ไม่พบคำที่ค้นหา</p>'));
    list.forEach(w => {
      const row = h(`<div class="vword ${w.learned ? 'learned' : ''} ${w.image ? 'has-img' : ''}">
        ${w.image ? `<img class="vimg" src="${w.image}" alt="">` : ''}
        <div class="w">${esc(w.word)}<small>${esc(w.reading || '')} ${posList(w).map(p => `<span class="pill">${esc(p)}</span>`).join(' ')}${w.cat && vocabCat === '*' ? ` <span class="pill cat">${esc(w.cat)}</span>` : ''}</small></div>
        <div class="m">${esc(w.meaning)}</div>${w.example ? `<div class="ex">${esc(w.example)}</div>` : ''}
        <div class="acts"><button class="check ${w.learned ? 'on' : ''}" aria-label="จำได้แล้ว" title="จำได้แล้ว">${ic('check')}</button><button class="icon-btn" aria-label="แก้ไข">${ic('edit')}</button></div>
      </div>`);
      const [chk, ed] = $$('.acts button', row);
      chk.onclick = async () => { w.learned = !w.learned; try{ await Store.save('vocab', w); }catch(e){ toast('บันทึกไม่สำเร็จ'); } rerender(); };
      ed.onclick = () => Vocab.edit(w, every);
      if(w.image) $('.vimg', row).onclick = () => viewImage(w.image);
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
    <div class="face">${w.image ? `<img class="fimg" src="${w.image}" alt="">` : ''}<div class="fw">${esc(w.word)}</div><div class="muted">${esc(w.reading || '')} ${posList(w).map(p => `<span class="pill">${esc(p)}</span>`).join(' ')}</div><div class="hint">แตะเพื่อดูความหมาย</div></div>
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

Object.assign(DICT, {'หมวดหมู่':'Category', 'หมวดใหม่':'New category', 'หมวดหมู่ใหม่':'New category', 'ชื่อหมวด':'Category name', 'สร้างหมวด':'Create', 'จัดการหมวด':'Edit category', 'จัดการหมวดนี้':'Edit this category',
  'ไม่มีหมวด':'No category', 'ทั้งหมด':'All', 'รูปประกอบ':'Picture', 'รูปช่วยจำ ระบบย่อขนาดให้อัตโนมัติ':'A picture to help you remember; resized automatically',
  'ชนิดของคำ (part of speech) เลือกได้หลายอย่าง':'Part of speech (pick any)', 'เพิ่มชนิดคำเอง เช่น modal verb':'Add your own, e.g. modal verb', 'สร้างหมวดใหม่ เช่น อาหาร':'New category, e.g. Food',
  'เพิ่มคำศัพท์':'Add word', 'แก้ไขคำศัพท์':'Edit word', 'หมวดนี้ยังว่าง จดคำแรกของหมวดนี้เลย':'This category is empty. Add its first word.'});
