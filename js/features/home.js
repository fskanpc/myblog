/* =========================================================
   HOME: live meadow photo + greeting + folders
   ========================================================= */
const FOLDER_THEME = {
  diary:  {bg:'#FFDCE8', ink:'#E47AA3', tab:'#F8C3D6'},
  books:  {bg:'#FFF4E6', ink:'rgba(255,160,100,.45)', tab:'#FFD2AE', icon:'#EE8A4E'},
  tarot:  {bg:'#EBE2FD', ink:'#8E72DA', tab:'#D7C8F7'},
  travel: {bg:'#CFE4F7', ink:'#FFFFFF', tab:'#B9D6F1', icon:'#5A91D0'},
  screen: {bg:'#FFF1F1', ink:'rgba(240,110,125,.4)', line:'rgba(200,70,90,.5)', tab:'#FFC9CF', icon:'#E0566B'},
  music:  {bg:'#E4F7EF', ink:'rgba(70,190,155,.55)', tab:'#BDE9D8', icon:'#2FA886'},
  vocab:  {bg:'#FFF6D6', ink:'#F2C24E', tab:'#FBE39B', icon:'#D39A12'},
  planner:{bg:'#EEF1FF', ink:'rgba(130,150,245,.5)', tab:'#CCD5FB', icon:'#6480EE'},
  profile:{bg:'#FBE4B7', ink:'#F08CAA', tab:'#EFCB8A', icon:'#E0708F'},
  game:   {bg:'#FFE9F0', ink:'rgba(255,127,168,.35)', tab:'#FFC6D8', icon:'#F0648F'}
};
const FOLDER_PAT = (() => {
  const u = svg => `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
  const T = FOLDER_THEME;
  const bow = c => u(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><g stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="${c}" fill-opacity=".35"><path d="M16 14c-5-6-12-5-12 0s7 6 12 0zM16 14c5-6 12-5 12 0s-7 6-12 0zM15 15l-4 9M17 15l4 9"/><path d="M48 44c-4-5-10-4-10 0s6 5 10 0zM48 44c4-5 10-4 10 0s-6 5-10 0zM47 45l-3 7M49 45l3 7"/></g></svg>`);
  const petal = 'M0 -8c3 0 3 5 0 7c-3-2-3-7 0-7zM0 8c3 0 3-5 0-7c-3 2-3 7 0 7zM-8 0c0 3 5 3 7 0c-2-3-7-3-7 0zM8 0c0 3-5 3-7 0c2-3 7-3 7 0z';
  const flower = c => u(`<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58"><g fill="none" stroke="${c}" stroke-width="1.3"><g transform="translate(15 15)"><path d="${petal}" transform="rotate(20)"/><circle r="1.6" fill="${c}"/></g><g transform="translate(42 40) scale(.8)"><path d="${petal}" transform="rotate(-15)"/><circle r="1.6" fill="${c}"/></g></g></svg>`);
  const heart = c => u(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M10 15s-5-3-5-6.5A2.8 2.8 0 0 1 10 7a2.8 2.8 0 0 1 5 1.5C15 12 10 15 10 15z" fill="${c}"/><path d="M30 35s-4-2.5-4-5.2A2.3 2.3 0 0 1 30 28.6a2.3 2.3 0 0 1 4 1.2C34 32.5 30 35 30 35z" fill="${c}" fill-opacity=".6"/></svg>`);
  const plaid = (a, l, bg) => `repeating-linear-gradient(90deg,${a} 0 7px,transparent 7px 12px,${l} 12px 13px,transparent 13px 20px),repeating-linear-gradient(0deg,${a} 0 7px,transparent 7px 12px,${l} 12px 13px,transparent 13px 20px),${bg}`;
  return {
    diary:`${bow(T.diary.ink)} 0 0/64px 64px,${T.diary.bg}`,
    books:`linear-gradient(90deg,${T.books.ink} 50%,transparent 0) 0 0/30px 30px,linear-gradient(${T.books.ink} 50%,transparent 0) 0 0/30px 30px,${T.books.bg}`,
    tarot:`${flower(T.tarot.ink)} 0 0/58px 58px,${T.tarot.bg}`,
    travel:`radial-gradient(circle at 50% 50%,#FFFFFF 0 3.2px,#E3E8EE 3.6px,transparent 4.2px) 2px 12%/10px 10px repeat-x,${T.travel.bg}`,
    screen:plaid(T.screen.ink, T.screen.line, T.screen.bg),
    music:`radial-gradient(circle,${T.music.ink} 0 3.5px,transparent 4px) 0 0/18px 18px,radial-gradient(circle,${T.music.ink} 0 2px,transparent 2.5px) 9px 9px/18px 18px,${T.music.bg}`,
    vocab:`linear-gradient(90deg,transparent 21%,${T.vocab.ink} 21% 22%,transparent 22% 24%,${T.vocab.ink} 24% 25%,transparent 25%),linear-gradient(180deg,transparent 12%,${T.vocab.ink} 12% 13.5%,transparent 13.5% 17%,${T.vocab.ink} 17% 18.5%,transparent 18.5%),${T.vocab.bg}`,
    planner:`repeating-linear-gradient(90deg,${T.planner.ink} 0 10px,transparent 10px 22px),${T.planner.bg}`,
    profile:`${heart(T.profile.ink)} 0 0/40px 40px,${T.profile.bg}`,
    game:`radial-gradient(circle,#FFE38C 0 3px,transparent 3.5px) 6px 6px/22px 22px,repeating-linear-gradient(135deg,${T.game.ink} 0 9px,transparent 9px 18px),${T.game.bg}`
  };
})();
const FOLDER_TAB = Object.fromEntries(Object.entries(FOLDER_THEME).map(([k, v]) => [k, v.tab]));
const FOLDER_ICON = Object.fromEntries(Object.entries(FOLDER_THEME).map(([k, v]) => [k, v.icon || v.ink]));
/* photo layers: sky strip (moves) + hill cut-out (still). Source photo 2940x1628 after 4x upscale */
let homeWeatherMode = null;
function weatherMode(){ return homeWeatherMode || META.weatherMode || 'auto'; }

VIEWS.home = async el => {
  const now = new Date(), hr = now.getHours();
  const hello = hr < 5 ? 'ดึกแล้วนะ' : hr < 12 ? 'อรุณสวัสดิ์' : hr < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';
  const name = META.name || T('เธอ');
  const data = {};
  for(const s of ['planner','vocab','books']) data[s] = await Store.list(s);
  const todayTasks = data.planner.filter(t => t.date === ymd());
  const left = todayTasks.filter(t => !t.done);
  const toLearn = data.vocab.filter(w => !w.learned);
  const word = toLearn.length ? toLearn[now.getDate() % toLearn.length] : null;
  const reading = data.books.find(b => b.status === 'reading');

  const hero = h(`<section class="meadow" aria-label="${T('หน้าแรก')}">
    ${seaScene()}
    <div class="md-greet" role="status" aria-live="polite">
      <span class="mg-ic" aria-hidden="true">☁️</span>
      <span class="mg-line"><span class="mg-text"></span><span class="mg-caret"></span></span>
      <button class="mg-go" aria-label="เลื่อนลงไปที่แฟ้ม">${ic('left', 'style="transform:rotate(-90deg)"')}</button>
    </div>
    <div class="md-tint"></div>
    <canvas class="md-rain" aria-hidden="true"></canvas>
    <div class="md-flash"></div>
    <button class="md-weather"><span class="wi">☁️</span><span class="wt">กำลังดูสภาพอากาศ…</span><span class="wm"></span></button>
    <button class="md-scroll">เลื่อนลงเพื่อเปิดแฟ้ม<i>${ic('left')}</i></button>
  </section>`);
  const lawn = h(`<section class="lawn" id="folders">
    <h2 class="fold-title">แฟ้มของฉัน</h2>
    <nav class="folds" aria-label="แฟ้มทั้งหมด"></nav>
  </section>`);

  const folds = $('.folds', lawn);
  APPS.filter(a => a.id !== 'home').forEach(a => {
    const f = h(`<a class="fold" href="#${a.id}" aria-label="${a.name}" title="${a.name}" style="--pat:${FOLDER_PAT[a.id]};--tabc:${FOLDER_TAB[a.id]};--fic:${FOLDER_ICON[a.id]}">
      <span class="fold-back"></span>
      <span class="fold-paper"></span><span class="fold-paper two"></span>
      <span class="fold-front"><span class="fi">${ic(a.icon)}</span></span>
      <span class="fold-name">${a.name}</span>
    </a>`);
    f.addEventListener('click', e => {
      if(REDUCED || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      f.classList.add('opening');
      const r = f.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height * .4, 14, true);
      setTimeout(() => { location.hash = '#' + a.id; }, 360);
    });
    folds.append(f);
  });
  el.append(hero, lawn);

  const toFolders = () => lawn.scrollIntoView({behavior: REDUCED ? 'auto' : 'smooth', block:'start'});
  $('.mg-go', hero).onclick = toFolders; $('.md-scroll', hero).onclick = toFolders;

  /* greeting messages typed into the glass bar */
  const msgs = [`${T(hello)} ${name}`];
  const typer = typeLoop($('.mg-text', hero), msgs);

  /* weather */
  let wx = null;
  const applyWeather = () => {
    const mode = weatherMode();
    let kind = wx ? wx.kind : 'clear', day = wx ? wx.day : (hr >= 6 && hr < 18);
    if(mode === 'sun'){ kind = 'clear'; day = true; }
    if(mode === 'rain'){ kind = 'rain'; }
    hero.dataset.wx = kind; hero.dataset.day = day ? '1' : '0';
    $('.md-weather .wi', hero).textContent = day || kind !== 'clear' ? Weather.icon(kind) : '🌙';
    $('.md-weather .wt', hero).textContent = (wx && mode === 'auto' ? `${wx.temp}° ` : '') + T(Weather.label(kind));
    $('.md-weather .wm', hero).textContent = T(({auto:'อัตโนมัติ', sun:'โหมดแดดดี', rain:'โหมดฝนตก'})[mode]);
    $('.mg-ic', hero).textContent = day || kind !== 'clear' ? Weather.icon(kind) : '🌙';
    Rain.set($('.md-rain', hero), kind === 'rain' || kind === 'storm', kind === 'storm', $('.md-flash', hero));
    // messages
    msgs.length = 0;
    msgs.push(`${T(hello)} ${name}`);
    if(wx && mode === 'auto') msgs.push(LANG === 'en' ? `It's ${wx.temp}° and ${T(Weather.label(wx.kind)).toLowerCase()}${wx.place ? ' in ' + wx.place : ''}` : `ตอนนี้ ${wx.temp}° ${Weather.label(wx.kind)}${wx.place ? 'ที่' + wx.place : ''}`);
    if(kind === 'rain' || kind === 'storm') msgs.push(T('ฝนตกอยู่ พกร่มด้วยนะ'));
    else if(day) msgs.push(T('วันนี้อากาศดี ออกไปเดินเล่นกัน'));
    else msgs.push(T('ดึกแล้ว พักผ่อนเยอะ ๆ นะ'));
    if(todayTasks.length) msgs.push(LANG === 'en' ? `${left.length} of ${todayTasks.length} tasks left today` : `วันนี้เหลืออีก ${left.length} จาก ${todayTasks.length} งาน`);
    if(word) msgs.push(`${T('คำศัพท์วันนี้')}: ${word.word}`);
    if(reading) msgs.push(`${T('กำลังอ่าน')} ${reading.title}`);
  };
  requestAnimationFrame(() => requestAnimationFrame(applyWeather));   // after the page is on screen, so the rain canvas can size itself
  applyWeather();
  $('.md-weather', hero).onclick = async () => {
    const order = ['auto', 'sun', 'rain'];
    homeWeatherMode = order[(order.indexOf(weatherMode()) + 1) % 3];
    META.weatherMode = homeWeatherMode; applyWeather();
    toast(T(({auto:'สภาพอากาศตามจริง', sun:'เปลี่ยนเป็นวันแดดดี', rain:'เปลี่ยนเป็นวันฝนตก'})[homeWeatherMode]));
    try{ await Store.setMeta(META); }catch(e){}
  };
  Weather.current().then(d => { wx = d; if(hero.isConnected) applyWeather(); }).catch(() => {
    if(hero.isConnected) $('.md-weather .wt', hero).textContent = T('ดูสภาพอากาศไม่ได้');
  });
};

/* typewriter that understands Thai combining marks */
function typeLoop(el, msgs){
  const seg = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter(LANG === 'en' ? 'en' : 'th', {granularity:'grapheme'}) : null;
  const split = s => seg ? [...seg.segment(s)].map(x => x.segment) : [...s];
  let i = 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  (async () => {
    for(let n = 0; !el.isConnected && n < 100; n++) await wait(50);   // the view is built before it is put on the page
    while(el.isConnected){
      const msg = msgs[i % msgs.length] || ''; const g = split(msg);
      if(REDUCED){ el.textContent = msg; await wait(4000); i++; continue; }
      for(let k = 1; k <= g.length && el.isConnected; k++){ el.textContent = g.slice(0, k).join(''); await wait(55); }
      await wait(2600);
      for(let k = g.length; k >= 0 && el.isConnected; k--){ el.textContent = g.slice(0, k).join(''); await wait(22); }
      await wait(350); i++;
    }
  })();
}

/* rain on a canvas, only while the home page is on screen */
const Rain = (() => {
  let cv, ctx, drops = [], on = false, storm = false, flash, raf = 0, W = 0, H = 0, nextBolt = 0;
  function size(){ const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
  function seed(){ const n = Math.round(W * H / 2600); drops = Array.from({length:n}, () => ({x:Math.random() * W, y:Math.random() * H, l:10 + Math.random() * 16, v:9 + Math.random() * 9, o:.18 + Math.random() * .35})); }
  function tick(t){
    if(!cv || !cv.isConnected || !on){ raf = 0; if(ctx) ctx.clearRect(0, 0, W, H); return; }
    ctx.clearRect(0, 0, W, H); ctx.lineWidth = 1; ctx.lineCap = 'round';
    for(const d of drops){
      d.y += d.v; d.x -= d.v * .18;
      if(d.y > H){ d.y = -d.l; d.x = Math.random() * (W + 60); }
      ctx.strokeStyle = `rgba(225,235,255,${d.o})`;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.l * .18, d.y - d.l); ctx.stroke();
    }
    if(storm && flash && t > nextBolt){ flash.classList.remove('bolt'); void flash.offsetWidth; flash.classList.add('bolt'); nextBolt = t + 6000 + Math.random() * 9000; }
    raf = requestAnimationFrame(tick);
  }
  return {
    set(canvas, rain, isStorm, flashEl){
      cv = canvas; ctx = cv.getContext('2d'); flash = flashEl; storm = isStorm; on = rain;
      if(!on){ ctx.clearRect(0, 0, cv.width, cv.height); return; }
      size(); seed();
      if(!canvas._rs){ canvas._rs = true; addEventListener('resize', () => { if(cv && cv.isConnected){ size(); seed(); } }); }
      if(REDUCED){ drops.forEach(d => d.v = 2); }
      if(!raf) raf = requestAnimationFrame(tick);
    }
  };
})();
