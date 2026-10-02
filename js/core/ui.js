/* =========================================================
   modal
   ========================================================= */
function modal({title, body, actions = [], wide}){
  const back = h(`<div class="modal-back" role="dialog" aria-modal="true" aria-label="${escT(T(title))}">
    <div class="modal glass ${wide ? 'wide' : ''}">
      <div class="modal-head"><h2>${escT(T(title))}</h2><button class="icon-btn" data-x aria-label="ปิด">${ic('close')}</button></div>
      <div class="modal-body"></div>
    </div></div>`);
  const m = $('.modal', back);
  $('.modal-body', back).append(body);
  if(actions.length){
    const bar = h('<div class="modal-actions"></div>');
    actions.forEach(a => bar.append(a === 'spacer' ? h('<div class="spacer"></div>') : a));
    m.append(bar);
  }
  const prev = document.activeElement;
  const close = () => { back.classList.remove('show'); document.removeEventListener('keydown', onKey); setTimeout(() => back.remove(), 250); if(prev && prev.focus) prev.focus(); };
  const onKey = e => { if(e.key === 'Escape' && back === $$('.modal-back').pop()) close(); };   // only the top modal closes
  back.addEventListener('mousedown', e => { if(e.target === back) close(); });
  $('[data-x]', back).onclick = close;
  document.addEventListener('keydown', onKey);
  document.body.append(back);
  requestAnimationFrame(() => back.classList.add('show'));
  setTimeout(() => { const f = $('input,textarea', back) || $('[data-x]', back); f && f.focus({preventScroll:true}); }, 80);
  return {close, el:back};
}
function btn(label, cls, onClick, icon){ const b = h(`<button class="btn ${cls || ''}">${icon ? ic(icon) : ''}<span>${label}</span></button>`); b.onclick = onClick; return b; }
function deleteBtn(onConfirm){
  const b = btn('ลบ', 'danger', null, 'trash');
  let armed = false;
  b.onclick = async () => {
    if(!armed){ armed = true; b.classList.add('armed'); $('span', b).textContent = 'แตะอีกครั้งเพื่อลบ'; setTimeout(() => { armed = false; b.classList.remove('armed'); $('span', b).textContent = 'ลบ'; }, 3000); return; }
    b.disabled = true; await onConfirm();
  };
  return b;
}

/* =========================================================
   images
   ========================================================= */
function compress(file, max = 900, budget = 140000){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth, hh = img.naturalHeight;
      const s = Math.min(1, max / Math.max(w, hh));
      w = Math.round(w * s); hh = Math.round(hh * s);
      const c = document.createElement('canvas'); c.width = w; c.height = hh;
      const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, hh); ctx.drawImage(img, 0, 0, w, hh);
      let q = .82, d = c.toDataURL('image/jpeg', q);
      while(d.length > budget && q > .35){ q -= .08; d = c.toDataURL('image/jpeg', q); }
      if(d.length > budget){ c.width = w * .7; c.height = hh * .7; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); d = c.toDataURL('image/jpeg', .6); }
      URL.revokeObjectURL(url); res(d);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('อ่านรูปไม่ได้')); };
    img.src = url;
  });
}
function pickFiles(multiple){
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = !!multiple;
    i.onchange = () => res([...i.files]); i.click();
  });
}
function viewImage(src){ modal({title:'รูปภาพ', body:h(`<img src="${src}" alt="" style="width:100%;border-radius:16px">`), wide:true}); }

/* =========================================================
   generic form
   ========================================================= */
const PALETTE = ['#FF86AE','#FFA66E','#F7B928','#7FD8BE','#4FAEFF','#6F8DFF','#A77BFF','#C07CFF','#8C6A5A','#3A2E5A'];
function fieldEl(f, v){
  const id = 'f-' + f.key + '-' + Math.random().toString(36).slice(2,6);
  const wrap = h(`<div class="field"></div>`);
  const lab = f.type === 'text' || f.type === 'date' || f.type === 'number' || f.type === 'url' || f.type === 'time' || f.type === 'textarea'
    ? `<label for="${id}">${f.label}${f.required ? ' *' : ''}</label>` : `<span class="lbl">${f.label}</span>`;
  wrap.innerHTML = lab;
  if(f.type === 'date'){
    wrap.append(datePicker(id, v, f));
  } else if(['text','number','url','time'].includes(f.type)){
    const inp = h(`<input id="${id}" type="${f.type}" ${f.placeholder ? `placeholder="${escT(f.placeholder)}"` : ''} ${f.type === 'number' ? 'min="0" step="any"' : ''}>`);
    inp.value = v[f.key] ?? '';
    inp.oninput = () => v[f.key] = f.type === 'number' ? (inp.value === '' ? '' : Number(inp.value)) : inp.value;
    wrap.append(inp);
  } else if(f.type === 'textarea'){
    const t = h(`<textarea id="${id}" rows="${f.rows || 5}" ${f.placeholder ? `placeholder="${escT(f.placeholder)}"` : ''}></textarea>`);
    t.value = v[f.key] ?? ''; t.oninput = () => v[f.key] = t.value; wrap.append(t);
  } else if(f.type === 'select' || f.type === 'multi'){
    // select: pick one · multi: pick any number (stored as an array) · addable: type a new option
    const multi = f.type === 'multi';
    if(multi && !Array.isArray(v[f.key])) v[f.key] = v[f.key] ? [v[f.key]] : [];
    const row = h(`<div class="opt-row" role="${multi ? 'group' : 'radiogroup'}"></div>`);
    const isOn = val => multi ? v[f.key].includes(val) : v[f.key] === val;
    const addOpt = (val, l) => {
      const b = h(`<button type="button" class="opt ${isOn(val) ? 'on' : ''}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${isOn(val)}">${l}</button>`);
      b.dataset.val = val;
      b.onclick = () => {
        if(multi){ v[f.key] = isOn(val) ? v[f.key].filter(x => x !== val) : [...v[f.key], val]; }
        else { v[f.key] = val; $$('.opt', row).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked','false'); }); }
        b.classList.toggle('on', isOn(val)); b.setAttribute('aria-checked', isOn(val));
      };
      row.append(b); return b;
    };
    const known = new Set();
    f.options.forEach(o => { const [val, l] = Array.isArray(o) ? o : [o, o]; known.add(val); addOpt(val, l); });
    // values saved earlier that are no longer in the list still show up
    (multi ? v[f.key] : [v[f.key]]).forEach(val => { if(val && !known.has(val)){ known.add(val); addOpt(val, escT(val)); } });
    wrap.append(row);
    if(f.addable){
      const add = h(`<div class="opt-add"><input type="text" maxlength="40" placeholder="${escT(f.addable)}" aria-label="${escT(f.addable)}"><button type="button" class="opt">${ic('plus')}</button></div>`);
      const inp = $('input', add);
      const go = () => {
        let val = inp.value.trim(); if(!val) return;
        // typing an option that already exists (any case) just picks it
        const same = [...known].find(k => k && k.toLowerCase() === val.toLowerCase());
        if(same) val = same; else { known.add(val); addOpt(val, escT(val)); }
        const b = [...$$('.opt', row)].find(x => x.dataset.val === val);
        if(b && !isOn(val)) b.click();
        inp.value = '';
      };
      $('button', add).onclick = go;
      inp.onkeydown = e => { if(e.key === 'Enter'){ e.preventDefault(); go(); } };
      wrap.append(add);
    }
  } else if(f.type === 'stars'){
    const row = h('<div class="star-in"></div>');
    const paint = () => $$('button', row).forEach((b, i) => b.classList.toggle('on', i < (v[f.key] || 0)));
    for(let i = 1; i <= 5; i++){ const b = h(`<button type="button" aria-label="${i} ดาว">★</button>`); b.onclick = () => { v[f.key] = v[f.key] === i ? 0 : i; paint(); }; row.append(b); }
    paint(); wrap.append(row);
  } else if(f.type === 'color'){
    const row = h('<div class="swatches"></div>');
    (f.palette || PALETTE).forEach(c => {
      const b = h(`<button type="button" class="swatch ${v[f.key] === c ? 'on' : ''}" style="background:${c}" aria-label="สี ${c}"></button>`);
      b.onclick = () => { v[f.key] = c; $$('.swatch', row).forEach(x => x.classList.remove('on')); b.classList.add('on'); };
      row.append(b);
    });
    wrap.append(row);
  } else if(f.type === 'image' || f.type === 'images'){
    const multi = f.type === 'images', limit = multi ? (f.limit || 3) : 1;
    const row = h('<div class="img-in"></div>');
    const list = () => multi ? (v[f.key] = v[f.key] || []) : (v[f.key] ? [v[f.key]] : []);
    const paint = () => {
      row.innerHTML = '';
      list().forEach((src, i) => {
        const s = h(`<div class="img-slot"><img src="${src}" alt=""><button type="button" class="x" aria-label="ลบรูป">${ic('close')}</button></div>`);
        $('.x', s).onclick = () => { if(multi) v[f.key].splice(i, 1); else v[f.key] = ''; paint(); };
        row.append(s);
      });
      if(list().length < limit){
        const add = h(`<button type="button" class="img-slot add">${ic('camera')}<span>${multi ? `เพิ่มรูป (${list().length}/${limit})` : 'เลือกรูป'}</span></button>`);
        add.onclick = async () => {
          const files = await pickFiles(multi);
          for(const file of files.slice(0, limit - list().length)){
            try{
              const d = await compress(file, f.max || 900, f.budget || 140000);
              if(multi) v[f.key].push(d); else v[f.key] = d;
            }catch(e){ toast(e.message); }
          }
          paint();
        };
        row.append(add);
      }
    };
    paint(); wrap.append(row);
  } else if(f.type === 'custom'){
    wrap.append(f.render(v));
  } else if(f.type === 'row'){
    const row = h('<div class="two"></div>'); f.fields.forEach(sf => row.append(fieldEl(sf, v))); return row;
  }
  if(f.help) wrap.append(h(`<div class="muted" style="font-size:12.5px;margin-top:4px">${f.help}</div>`));
  wrap.dataset.key = f.key || '';
  return wrap;
}
function openForm({title, fields, value = {}, onSave, onDelete}){
  const v = JSON.parse(JSON.stringify(value));
  fields.forEach(f => { if(f.default !== undefined && v[f.key] === undefined) v[f.key] = f.default; (f.fields || []).forEach(sf => { if(sf.default !== undefined && v[sf.key] === undefined) v[sf.key] = sf.default; }); });
  const form = h('<div class="form"></div>');
  fields.forEach(f => form.append(fieldEl(f, v)));
  const all = fields.flatMap(f => f.fields || [f]);
  const save = btn('บันทึก', '', async () => {
    $$('.err', form).forEach(e => e.remove());
    const missing = all.filter(f => f.required && !String(v[f.key] ?? '').trim());
    if(missing.length){
      missing.forEach(f => { const w = $(`.field[data-key="${f.key}"]`, form); w && w.append(h(`<div class="err">${L(`ใส่${f.label}ก่อนบันทึก`, `Please fill in ${T(f.label)} first`)}</div>`)); });
      return;
    }
    save.disabled = true; $('span', save).textContent = 'กำลังบันทึก…';
    try{ await onSave(v); m.close(); toast('บันทึกแล้ว'); }
    catch(e){ save.disabled = false; $('span', save).textContent = 'บันทึก'; toast('บันทึกไม่สำเร็จ: ' + (e.message || 'ลองใหม่อีกครั้ง')); }
  }, 'check');
  const acts = [];
  if(onDelete) acts.push(deleteBtn(async () => { try{ await onDelete(); m.close(); toast('ลบแล้ว'); }catch(e){ toast('ลบไม่สำเร็จ'); } }), 'spacer');
  acts.push(btn('ยกเลิก', 'soft', () => m.close()), save);
  const m = modal({title, body:form, actions:acts});
  return m;
}

/* generic CRUD glue */
function crud(section, fields, label, en = ''){
  return {
    add(preset = {}){ openForm({title:L('เพิ่ม' + label, 'Add ' + en), fields, value:preset, onSave: async v => { await Store.save(section, v); rerender(); }}); },
    edit(item){ openForm({title:L('แก้ไข' + label, 'Edit ' + en), fields, value:item, onSave: async v => { await Store.save(section, v); rerender(); }, onDelete: async () => { await Store.remove(section, item.id); rerender(); }}); }
  };
}

/* =========================================================
   date picker: our own calendar, so month and year can be
   picked straight from dropdowns (Safari's built-in one can't)
   value stays a "YYYY-MM-DD" string
   ========================================================= */
function datePicker(id, v, f){
  const box = h(`<div class="dp">
    <button type="button" id="${id}" class="dp-field" aria-haspopup="dialog" aria-expanded="false"><span class="dp-text"></span>${ic('planner')}</button>
    <div class="dp-pop" role="dialog" aria-label="${T('เลือกวันที่')}" hidden>
      <div class="dp-head">
        <button type="button" class="dp-nav" data-d="-1" aria-label="${T('เดือนก่อน')}">${ic('left')}</button>
        <select class="dp-m" aria-label="${T('เดือน')}"></select>
        <select class="dp-y" aria-label="${T('ปี')}"></select>
        <button type="button" class="dp-nav" data-d="1" aria-label="${T('เดือนถัดไป')}">${ic('right')}</button>
      </div>
      <div class="dp-week"></div>
      <div class="dp-grid" role="grid"></div>
      <div class="dp-foot"><button type="button" class="dp-today">${T('วันนี้')}</button>${f.required ? '' : `<button type="button" class="dp-clear">${T('ล้าง')}</button>`}</div>
    </div>
  </div>`);
  const field = $('.dp-field', box), pop = $('.dp-pop', box), mSel = $('.dp-m', box), ySel = $('.dp-y', box), grid = $('.dp-grid', box);
  const months = LANG === 'en' ? EN_MONTHS : TH_MONTHS;
  const days = LANG === 'en' ? ['S','M','T','W','T','F','S'] : ['อา','จ','อ','พ','พฤ','ศ','ส'];
  $('.dp-week', box).innerHTML = days.map(d => `<span>${d}</span>`).join('');
  months.forEach((m, i) => mSel.append(new Option(m, i)));
  const parse = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const yLabel = y => LANG === 'en' ? String(y) : `${y + 543}`;
  let view = parse(v[f.key]) || new Date();
  const fillYears = () => {
    const now = new Date().getFullYear(), sel = view.getFullYear();
    const from = Math.min(now - 100, sel - 5), to = Math.max(now + 10, sel + 5);
    ySel.innerHTML = '';
    for(let y = to; y >= from; y--) ySel.append(new Option(yLabel(y), y));
  };
  const showText = () => {
    const d = parse(v[f.key]);
    $('.dp-text', box).textContent = d ? thDate(v[f.key]) : T('เลือกวันที่');
    field.classList.toggle('empty', !d);
  };
  const draw = () => {
    fillYears();
    mSel.value = view.getMonth(); ySel.value = view.getFullYear();
    const y = view.getFullYear(), m = view.getMonth(), start = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
    const sel = v[f.key], today = ymd();
    grid.innerHTML = '';
    for(let i = 0; i < start; i++) grid.append(h('<span></span>'));
    for(let d = 1; d <= n; d++){
      const key = ymd(new Date(y, m, d));
      const b = h(`<button type="button" class="${key === sel ? 'on' : ''} ${key === today ? 'today' : ''}">${d}</button>`);
      b.onclick = () => { v[f.key] = key; showText(); close(); };
      grid.append(b);
    }
  };
  const onDoc = e => { if(!box.contains(e.target)) close(); };
  const onKey = e => { if(e.key === 'Escape'){ e.stopPropagation(); close(); field.focus(); } };
  const open = () => { view = parse(v[f.key]) || new Date(); draw(); pop.hidden = false; field.setAttribute('aria-expanded', 'true'); setTimeout(() => document.addEventListener('mousedown', onDoc), 0); pop.addEventListener('keydown', onKey); };
  const close = () => { pop.hidden = true; field.setAttribute('aria-expanded', 'false'); document.removeEventListener('mousedown', onDoc); };
  field.onclick = () => pop.hidden ? open() : close();
  mSel.onchange = () => { view = new Date(view.getFullYear(), +mSel.value, 1); draw(); };
  ySel.onchange = () => { view = new Date(+ySel.value, view.getMonth(), 1); draw(); };
  $$('.dp-nav', box).forEach(b => b.onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + Number(b.dataset.d), 1); draw(); });
  $('.dp-today', box).onclick = () => { v[f.key] = ymd(); showText(); close(); };
  if($('.dp-clear', box)) $('.dp-clear', box).onclick = () => { v[f.key] = ''; showText(); close(); };
  showText();
  return box;
}
Object.assign(DICT, {'เลือกวันที่':'Pick a date', 'เดือนก่อน':'Previous month', 'เดือนถัดไป':'Next month', 'เดือน':'Month', 'ปี':'Year', 'ล้าง':'Clear'});
