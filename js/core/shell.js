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
function renderShell(){
  const app = $('#app');
  app.innerHTML = '';
  const side = h(`<aside class="side glass" aria-label="เมนูหลัก">
    <div class="brand"><div class="brand-orb"></div><span>${esc(META.siteName || 'My Little Bubble')}</span></div>
    <nav class="nav">${APPS.map(a => `<a href="#${a.id}" data-r="${a.id}"><span class="ic" style="--c1:${a.c1};--c2:${a.c2}">${ic(a.icon)}</span><span class="lbl">${a.name}</span></a>`).join('')}</nav>
    <div class="side-foot">
      <button class="icon-btn" id="themeBtn" aria-label="เปลี่ยนธีม"></button>
      <button class="icon-btn lang-btn" id="langBtn" aria-label="เปลี่ยนภาษา" title="เปลี่ยนภาษา">${LANG === 'en' ? 'TH' : 'EN'}</button>
      <button class="icon-btn" id="outBtn" aria-label="ออกจากระบบ" title="ออกจากระบบ">${ic('logout')}</button>
    </div>
  </aside>`);
  app.append(side, h('<main id="main" tabindex="-1"></main>'));
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
  $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r === id));
  const on = $('.nav a.on'); if(on && innerWidth <= 860) on.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
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
