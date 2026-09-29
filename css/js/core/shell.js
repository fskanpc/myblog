/* =========================================================
   theme
   ========================================================= */
function applyTheme(){
  const t = META.theme || 'auto';
  if(t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = t;
  const b = $('#themeBtn'); if(b){ b.innerHTML = ic(t === 'dark' ? 'moon' : t === 'light' ? 'sun' : 'auto'); b.title = 'ธีม: ' + ({auto:'ตามระบบ', light:'สว่าง', dark:'มืด'})[t]; }
}
async function cycleTheme(){
  const order = ['auto','light','dark'];
  META.theme = order[(order.indexOf(META.theme || 'auto') + 1) % 3];
  applyTheme();
  try{ await Store.setMeta(META); }catch(e){}
}

/* =========================================================
   shell & router
   ========================================================= */
/* width available for page content (used by layouts that measure themselves) */
function contentWidth(){ return innerWidth > 860 ? Math.min(innerWidth, 1320) - 72 : innerWidth - 32; }
function renderShell(){
  const app = $('#app');
  app.innerHTML = '';
  const bar = h(`<header class="topbar glass" aria-label="แถบด้านบน">
    <a class="tb-brand" href="#home" aria-label="หน้าแรก"><span class="brand-orb"></span><span>${esc(META.siteName || 'My Little Bubble')}</span></a>
    <a class="tb-home" href="#home">${ic('home')}<span>แฟ้มของฉัน</span></a>
    <div class="tb-acts">
      <button class="icon-btn" id="themeBtn" aria-label="เปลี่ยนธีม"></button>
      <button class="icon-btn lang-btn" id="langBtn" aria-label="เปลี่ยนภาษา" title="เปลี่ยนภาษา">${LANG === 'en' ? 'TH' : 'EN'}</button>
      <button class="icon-btn" id="outBtn" aria-label="ออกจากระบบ" title="ออกจากระบบ">${ic('logout')}</button>
    </div>
  </header>`);
  app.append(bar, h('<main id="main" tabindex="-1"></main>'));
  $('#themeBtn').onclick = cycleTheme;
  $('#langBtn').onclick = () => setLang(LANG === 'en' ? 'th' : 'en');
  $('#outBtn').onclick = () => Auth.logout();
  applyTheme();
}

const VIEWS = {};
let routeToken = 0;
async function route(){
  if(!Auth.logged()) return showAuth();
  if(!$('#main')) renderShell();
  const r = (location.hash.slice(1) || 'home').split('/')[0];
  const id = VIEWS[r] ? r : 'home';
  document.body.dataset.route = id;
  const main = $('#main');
  const token = ++routeToken;
  const frag = document.createElement('div');
  try{ await VIEWS[id](frag); }
  catch(e){ console.error(e); frag.innerHTML = ''; frag.append(emptyState('cloud', 'เปิดหน้านี้ไม่สำเร็จ ลองรีเฟรชอีกครั้ง')); }
  if(token !== routeToken) return;
  main.innerHTML = '';
  main.append(...frag.childNodes);
  window.scrollTo({top:0});
}
window.addEventListener('hashchange', route);
function rerender(){ route(); }

function pageHead(title, sub, actionLabel, onAction){
  const el = h(`<header class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></header>`);
  if(actionLabel){ const b = h(`<button class="btn">${ic('plus')}<span>${actionLabel}</span></button>`); b.onclick = onAction; el.append(b); }
  return el;
}
function emptyState(icon, text, label, onClick){
  const el = h(`<div class="empty"><div class="em-orb">${ic(icon)}</div><p>${text}</p></div>`);
  if(label){ const b = h(`<button class="btn">${ic('plus')}<span>${label}</span></button>`); b.onclick = onClick; el.append(b); }
  return el;
}
function chips(options, current, onPick){
  const el = h('<div class="chips" role="tablist"></div>');
  options.forEach(([v, l]) => {
    const b = h(`<button class="chip ${v === current ? 'on' : ''}" role="tab" aria-selected="${v === current}">${l}</button>`);
    b.onclick = () => onPick(v);
    el.append(b);
  });
  return el;
}
