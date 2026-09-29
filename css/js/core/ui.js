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
  const onKey = e => { if(e.key === 'Escape') close(); };
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
  if(['text','date','number','url','time'].includes(f.type)){
    const inp = h(`<input id="${id}" type="${f.type}" ${f.placeholder ? `placeholder="${escT(f.placeholder)}"` : ''} ${f.type === 'number' ? 'min="0" step="any"' : ''}>`);
    inp.value = v[f.key] ?? '';
    inp.oninput = () => v[f.key] = f.type === 'number' ? (inp.value === '' ? '' : Number(inp.value)) : inp.value;
    wrap.append(inp);
  } else if(f.type === 'textarea'){
    const t = h(`<textarea id="${id}" rows="${f.rows || 5}" ${f.placeholder ? `placeholder="${escT(f.placeholder)}"` : ''}></textarea>`);
    t.value = v[f.key] ?? ''; t.oninput = () => v[f.key] = t.value; wrap.append(t);
  } else if(f.type === 'select'){
    const row = h('<div class="opt-row" role="radiogroup"></div>');
    f.options.forEach(o => {
      const [val, l] = Array.isArray(o) ? o : [o, o];
      const b = h(`<button type="button" class="opt ${v[f.key] === val ? 'on' : ''}" role="radio" aria-checked="${v[f.key] === val}">${l}</button>`);
      b.onclick = () => { v[f.key] = val; $$('.opt', row).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked','false'); }); b.classList.add('on'); b.setAttribute('aria-checked','true'); };
      row.append(b);
    });
    wrap.append(row);
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
