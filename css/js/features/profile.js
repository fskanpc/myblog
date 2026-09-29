/* =========================================================
   PROFILE
   ========================================================= */
function zodiacOf(bd){
  if(!bd) return '';
  const [, m, d] = bd.split('-').map(Number); if(!m) return '';
  const starts = [[1,1,'มังกร'],[1,20,'กุมภ์'],[2,19,'มีน'],[3,21,'เมษ'],[4,20,'พฤษภ'],[5,21,'เมถุน'],[6,21,'กรกฎ'],[7,23,'สิงห์'],[8,23,'กันย์'],[9,23,'ตุลย์'],[10,23,'พิจิก'],[11,22,'ธนู'],[12,22,'มังกร']];
  let z = 'มังกร'; for(const [sm, sd, n] of starts) if(m > sm || (m === sm && d >= sd)) z = n;
  return z;
}
function passportId(){
  let x = hash(Store.uid + '|' + (META.joined || '')) || 1, out = '';
  for(let i = 0; i < 12; i++){ x = (x * 1103515245 + 12345) & 0x7fffffff; out += (x % 10); }
  return `BB-${out.slice(0,4)}-${out.slice(4,8)}-${out.slice(8)}`;
}
const PP_PAT = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><g fill="none" stroke="#E7DFA6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 34h26a8 8 0 0 0 0-16 11 11 0 0 0-21-2 7 7 0 0 0-5 18z"/><path d="M88 14l2.5 5.5 6 .7-4.5 4 1.2 6L88 27.3 82.8 30.2 84 24.2l-4.5-4 6-.7z"/><path d="M40 96s-10-6-10-13a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 7-10 13-10 13z"/><circle cx="96" cy="84" r="9"/><path d="M96 70v-3M96 101v-3M82 84h-3M113 84h-3"/><path d="M62 58l3 3M68 58l-3 3"/></g></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
})();
const SUN_SVG = `<svg class="sun" viewBox="0 0 100 100" aria-hidden="true"><g stroke="#FCE7A0" stroke-width="5" stroke-linecap="round">${Array.from({length:12}, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${50 + Math.cos(a) * 26}" y1="${50 + Math.sin(a) * 26}" x2="${50 + Math.cos(a) * 40}" y2="${50 + Math.sin(a) * 40}"/>`; }).join('')}</g><circle cx="50" cy="50" r="19" fill="#FDF0BD"/></svg>`;
const profileFields = [
  {key:'avatar', label:'รูปโปรไฟล์', type:'image', max:400, budget:70000},
  {type:'row', fields:[{key:'name', label:'ชื่อเล่น', type:'text', required:true}, {key:'birthday', label:'วันเกิด', type:'date'}]},
  {type:'row', fields:[{key:'hometown', label:'บ้านเกิด', type:'text', placeholder:'เช่น พิษณุโลก'}, {key:'mbti', label:'MBTI', type:'text', placeholder:'เช่น INFP'}]},
  {type:'row', fields:[{key:'favFood', label:'ของโปรด', type:'text', placeholder:'เช่น พีช ชานม'}, {key:'dream', label:'ที่ที่อยากไปที่สุด', type:'text', placeholder:'เช่น ไอซ์แลนด์'}]},
  {key:'bio', label:'แนะนำตัว', type:'textarea', rows:3},
  {key:'quote', label:'คำคมประจำใจ', type:'text'},
  {key:'favColor', label:'สีที่ชอบ', type:'color'},
  {key:'siteName', label:'ชื่อบล็อก', type:'text'}
];
VIEWS.profile = async el => {
  const counts = {};
  for(const s of ['diary','books','tarot','travel','screen','music','vocab','planner']) counts[s] = (await Store.list(s)).length;
  const booksDone = (await Store.list('books')).filter(b => b.status === 'done').length;
  const content = contentWidth();
  const stack = content < 1040;
  const zoom = Math.min(1, (stack ? content : 600) / 600);
  const name = META.name || '';

  const head = pageHead('โปรไฟล์', 'หน้าข้อมูลในพาสปอร์ตของฉัน');
  const editBtn = btn('แก้ไขพาสปอร์ต', '', () => openForm({
    title:'แก้ไขพาสปอร์ต', fields:profileFields, value:META,
    onSave: async v => { META = {...META, ...v}; await Store.setMeta(META); renderShell(); rerender(); }
  }), 'edit');
  head.append(editBtn);
  el.append(head);

  const wrap = h(`<div class="prof2 ${stack ? 'stack' : ''}"></div>`);
  const pp = passportEl({zoom, stamps:[{a:'เที่ยวแล้ว', n:counts.travel, b:'ที่', color:'#E0708F'}, {a:'อ่านจบ', n:booksDone, b:'เล่ม', color:'#6F9BD9'}]});

  const side = h('<div class="pp-side"></div>');
  side.append(h(`<section class="about glass">
    <h3>เกี่ยวกับฉัน</h3>
    <p class="bio">${META.bio ? esc(META.bio) : 'ยังไม่ได้เขียนแนะนำตัว กดแก้ไขพาสปอร์ตเพื่อเพิ่ม'}</p>
    ${META.quote ? `<div class="quote">${esc(META.quote)}</div>` : ''}
    ${META.favColor ? `<p class="muted" style="font-size:14px;margin:12px 0 0">สีที่ชอบ <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${META.favColor};vertical-align:middle"></span></p>` : ''}
  </section>`));
  const stats = h('<div class="stat-grid"></div>');
  const label = L({diary:'หน้าไดอารี่', books:'หนังสือบนชั้น', tarot:'สำรับไพ่', travel:'สถานที่', screen:'เรื่องโปรด', music:'เพลงโปรด', vocab:'คำศัพท์', planner:'งานในแพลนเนอร์'}, {diary:'Diary pages', books:'Books on the shelf', tarot:'Tarot decks', travel:'Places visited', screen:'Favorite titles', music:'Favorite songs', vocab:'Words saved', planner:'Planner tasks'});
  Object.keys(label).forEach(k => { const a = appOf(k); stats.append(h(`<a class="stat glass shine" href="#${k}" style="--c1:${a.c1}"><div class="v">${counts[k]}</div><div class="k">${label[k]}</div></a>`)); });
  const settings = h(`<section class="settings glass">
    <h3>การตั้งค่า</h3>
    <div class="set-row"><div><b>บัญชี</b><p>${esc(Store.email)}</p></div></div>
    <div class="set-row"><div><b>ที่เก็บข้อมูล</b><p>เก็บแบบส่วนตัวในฐานข้อมูล Supabase เปิดจากเครื่องไหนก็เห็นข้อมูลเดิม</p></div></div>
    <div class="set-row"><div><b>ธีม</b><p>ตามระบบ สว่าง หรือมืด</p></div><div class="opt-row" data-theme-row></div></div>
    <div class="set-row"><div><b>ภาษา</b><p>ภาษาของหน้าเว็บ</p></div><div data-lang-row></div></div>
    <div class="set-row"><div><b>รหัสผ่าน</b><p>เปลี่ยนรหัสผ่านที่ใช้เข้าสู่ระบบ</p></div></div>
    <div class="set-row"><div><b>ออกจากระบบ</b><p>ครั้งหน้าจะต้องเข้าสู่ระบบอีกครั้ง</p></div></div>
  </section>`);
  const rows = $$('.set-row', settings);
  const tr = $('[data-theme-row]', settings);
  [['auto','ตามระบบ'], ['light','สว่าง'], ['dark','มืด']].forEach(([v, l]) => { const b = h(`<button class="opt ${(META.theme || 'auto') === v ? 'on' : ''}">${l}</button>`); b.onclick = async () => { META.theme = v; applyTheme(); try{ await Store.setMeta(META); }catch(e){} rerender(); }; tr.append(b); });
  rows[4].append(btn('เปลี่ยนรหัสผ่าน', 'soft', () => changePassword()));
  rows[5].append(btn('ออกจากระบบ', 'danger', () => Auth.logout(), 'logout'));
  $('[data-lang-row]', settings).append(langToggle());
  side.append(stats, settings);
  wrap.append(pp, side);
  el.append(wrap);
};
function changePassword(title){
  const v = {};
  const form = h('<div class="form"></div>');
  const mk = (key, label) => { const f = h(`<div class="field"><label>${label}<input type="password" autocomplete="new-password" style="margin-top:5px"></label></div>`); $('input', f).oninput = e => v[key] = e.target.value; return f; };
  form.append(mk('n1', 'รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)'), mk('n2', 'ยืนยันรหัสผ่านใหม่'));
  const err = h('<div class="err" style="color:#D6406A;font-size:14px"></div>'); form.append(err);
  const m = modal({title: title || 'เปลี่ยนรหัสผ่าน', body:form, actions:[btn('ยกเลิก', 'soft', () => m.close()), btn('บันทึก', '', async () => {
    if((v.n1 || '').length < 6){ err.textContent = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'; return; }
    if(v.n1 !== v.n2){ err.textContent = 'รหัสผ่านสองช่องไม่ตรงกัน'; return; }
    const {error} = await Store.sb.auth.updateUser({password:v.n1});
    if(error){ err.textContent = authError(error); return; }
    m.close(); toast('เปลี่ยนรหัสผ่านแล้ว');
  }, 'check')]});
}
