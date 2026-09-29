/* =========================================================
   PLANNER
   ========================================================= */
const TAGS = [['#FF86AE','ส่วนตัว'], ['#6F8DFF','เรียน/งาน'], ['#3EC6A6','สุขภาพ'], ['#F7B928','นัดหมาย'], ['#A77BFF','อื่น ๆ']];
let calMonth = null, calSel = ymd();
VIEWS.planner = async el => {
  const tasks = await Store.list('planner');
  if(!calMonth){ const d = new Date(); calMonth = new Date(d.getFullYear(), d.getMonth(), 1); }
  el.append(pageHead('แพลนเนอร์', 'วางแผนทีละวัน ติ๊กทีละอย่าง'));
  const wrap = h('<div class="planner"></div>');
  const cal = h(`<section class="cal glass">
    <div class="cal-head"><button class="icon-btn" data-p aria-label="เดือนก่อน">${ic('left')}</button><h2>${L(`${TH_MONTHS[calMonth.getMonth()]} ${calMonth.getFullYear() + 543}`, `${EN_MONTHS[calMonth.getMonth()]} ${calMonth.getFullYear()}`)}</h2><button class="icon-btn" data-n aria-label="เดือนถัดไป">${ic('right')}</button></div>
    <div class="cal-grid">${['อา','จ','อ','พ','พฤ','ศ','ส'].map(d => `<div class="dow">${d}</div>`).join('')}</div>
  </section>`);
  $('[data-p]', cal).onclick = () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); rerender(); };
  $('[data-n]', cal).onclick = () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); rerender(); };
  const grid = $('.cal-grid', cal);
  const start = new Date(calMonth); start.setDate(1 - calMonth.getDay());
  const byDate = {}; tasks.forEach(t => (byDate[t.date] = byDate[t.date] || []).push(t));
  for(let i = 0; i < 42; i++){
    const d = new Date(start); d.setDate(start.getDate() + i);
    const key = ymd(d), list = byDate[key] || [];
    const cell = h(`<button class="day ${d.getMonth() !== calMonth.getMonth() ? 'other' : ''} ${key === ymd() ? 'today' : ''} ${key === calSel ? 'sel' : ''}" aria-label="${thDate(key)} มี ${list.length} งาน"><span class="n">${d.getDate()}</span><span class="dots">${list.slice(0, 4).map(t => `<i style="background:${t.tag || '#A77BFF'};opacity:${t.done ? .35 : 1}"></i>`).join('')}</span></button>`);
    cell.onclick = () => { calSel = key; if(d.getMonth() !== calMonth.getMonth()) calMonth = new Date(d.getFullYear(), d.getMonth(), 1); rerender(); };
    grid.append(cell);
  }
  const dayTasks = (byDate[calSel] || []).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const [y, m, dd] = calSel.split('-').map(Number);
  const panel = h(`<section class="daypanel glass">
    <h2>${L(`วัน${TH_DAYS[new Date(y, m - 1, dd).getDay()]}ที่ ${dd}`, `${EN_DAYS[new Date(y, m - 1, dd).getDay()]} ${dd}`)}</h2>
    <p class="sub">${thDate(calSel)} ${dayTasks.length ? `— เสร็จแล้ว ${dayTasks.filter(t => t.done).length}/${dayTasks.length}` : ''}</p>
    <ul class="tasks"></ul>
    <div class="addtask">
      <div class="row"><input type="text" placeholder="เพิ่มสิ่งที่ต้องทำ" aria-label="สิ่งที่ต้องทำ" maxlength="120"><input type="time" aria-label="เวลา"></div>
      <div class="row"><div class="swatches"></div><button class="btn" style="margin-left:auto;padding:9px 16px">${ic('plus')}<span>เพิ่ม</span></button></div>
    </div>
  </section>`);
  const ul = $('.tasks', panel);
  if(!dayTasks.length) ul.append(h('<li class="muted" style="font-size:14.5px">ยังไม่มีแผนสำหรับวันนี้</li>'));
  dayTasks.forEach(t => {
    const li = h(`<li class="task ${t.done ? 'done' : ''}" style="--tc:${t.tag || '#A77BFF'}">
      <button class="check ${t.done ? 'on' : ''}" aria-label="ทำเสร็จแล้ว">${ic('check')}</button>
      <div><div class="tt">${esc(t.text)}</div>${t.time ? `<div class="tm">${esc(t.time)}${L(' น.', '')}</div>` : ''}</div>
      <button class="icon-btn" aria-label="ลบ">${ic('trash')}</button></li>`);
    const [chk, del] = $$('button', li);
    chk.onclick = async () => { t.done = !t.done; if(t.done) { const r = chk.getBoundingClientRect(); Trail.spawn(r.left + 16, r.top + 16, 16, true); } try{ await Store.save('planner', t); }catch(e){ toast('บันทึกไม่สำเร็จ'); } rerender(); };
    del.onclick = async () => { try{ await Store.remove('planner', t.id); }catch(e){ toast('ลบไม่สำเร็จ'); } rerender(); };
    ul.append(li);
  });
  let tag = TAGS[0][0];
  const sw = $('.swatches', panel);
  TAGS.forEach(([c, l]) => { const b = h(`<button class="swatch ${c === tag ? 'on' : ''}" style="background:${c};width:28px;height:28px" aria-label="${l}" title="${l}"></button>`); b.onclick = () => { tag = c; $$('.swatch', sw).forEach(x => x.classList.remove('on')); b.classList.add('on'); }; sw.append(b); });
  const [txt, tm] = $$('.addtask input', panel);
  const add = async () => {
    if(!txt.value.trim()){ txt.focus(); return; }
    try{ await Store.save('planner', {date:calSel, text:txt.value.trim(), time:tm.value, tag, done:false}); }catch(e){ toast('บันทึกไม่สำเร็จ'); return; }
    rerender(); setTimeout(() => { const i = $('.addtask input'); i && i.focus(); }, 50);
  };
  $('.addtask .btn', panel).onclick = add;
  txt.onkeydown = e => { if(e.key === 'Enter') add(); };
  const legend = h(`<p class="muted" style="font-size:13px;margin:12px 0 0">${TAGS.map(([c, l]) => `<span style="display:inline-flex;align-items:center;gap:5px;margin-right:12px"><i style="width:9px;height:9px;border-radius:50%;background:${c};display:inline-block"></i>${l}</span>`).join('')}</p>`);
  panel.append(legend);
  wrap.append(cal, panel);
  el.append(wrap);
};
