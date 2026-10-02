/* =========================================================
   HOME: greeting card, picnic banner with weather moods, folders, claw machine
   ========================================================= */
const FOLDER_THEME = {
  diary:  {bg:'#FFDCE8', ink:'#E47AA3', tab:'#F8C3D6'},
  books:  {bg:'#FFF4E6', ink:'rgba(255,160,100,.45)', tab:'#FFD2AE', icon:'#EE8A4E'},
  tarot:  {bg:'#EBE2FD', ink:'#8E72DA', tab:'#D7C8F7'},
  travel: {bg:'#CFE4F7', ink:'#FFFFFF', tab:'#B9D6F1', icon:'#5A91D0'},
  screen: {bg:'#FFF1F1', ink:'rgba(240,110,125,.4)', line:'rgba(200,70,90,.5)', tab:'#FFC9CF', icon:'#E0566B'},
  music:  {bg:'#E4F7EF', ink:'rgba(70,190,155,.55)', tab:'#BDE9D8', icon:'#2FA886'},
  vocab:  {bg:'#FFF6D6', ink:'#F2C24E', tab:'#FBE39B', icon:'#D39A12'},
  english:{bg:'#E3F3FF', ink:'rgba(91,184,245,.4)', tab:'#BFE2FB', icon:'#3D9BDB'},
  planner:{bg:'#EEF1FF', ink:'rgba(130,150,245,.5)', tab:'#CCD5FB', icon:'#6480EE'},
  profile:{bg:'#FBE4B7', ink:'#F08CAA', tab:'#EFCB8A', icon:'#E0708F'},
  photobooth:{bg:'#FFE6EC', ink:'#EF8FA7', tab:'#FFC2D1', icon:'#D9507F'},
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
    english:`linear-gradient(${T.english.ink} 1.5px,transparent 1.5px) 0 0/16px 16px,linear-gradient(90deg,${T.english.ink} 1.5px,transparent 1.5px) 0 0/16px 16px,${T.english.bg}`,
    planner:`repeating-linear-gradient(90deg,${T.planner.ink} 0 10px,transparent 10px 22px),${T.planner.bg}`,
    profile:`${heart(T.profile.ink)} 0 0/40px 40px,${T.profile.bg}`,
    photobooth:`radial-gradient(circle,#FFF6F8 0 2.6px,transparent 3.1px) 4px 5px/14px 18px repeat-x,radial-gradient(circle,#FFF6F8 0 2.6px,transparent 3.1px) 4px calc(100% - 5px)/14px 18px repeat-x,linear-gradient(${T.photobooth.ink},${T.photobooth.ink}) top/100% 18px no-repeat,linear-gradient(${T.photobooth.ink},${T.photobooth.ink}) bottom/100% 18px no-repeat,${T.photobooth.bg}`,
    game:`radial-gradient(circle,#FFE38C 0 3px,transparent 3.5px) 6px 6px/22px 22px,repeating-linear-gradient(135deg,${T.game.ink} 0 9px,transparent 9px 18px),${T.game.bg}`
  };
})();
const FOLDER_TAB = Object.fromEntries(Object.entries(FOLDER_THEME).map(([k, v]) => [k, v.tab]));
const FOLDER_ICON = Object.fromEntries(Object.entries(FOLDER_THEME).map(([k, v]) => [k, v.icon || v.ink]));
let homeWeatherMode = null;
function weatherMode(){ return homeWeatherMode || META.weatherMode || 'auto'; }

/* little sticker doodles scattered on the page (original artwork) */
const HM_STK = {
  star:'<svg viewBox="0 0 40 40"><path d="M20 3l5 10.5 11.5 1.4-8.4 8 2.2 11.4L20 28.8 9.7 34.3l2.2-11.4-8.4-8L15 13.5z" fill="#FFD66B" stroke="#E9A93A" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="19" r="1.4" fill="#6B4A3A"/><circle cx="24" cy="19" r="1.4" fill="#6B4A3A"/><path d="M17.5 23q2.5 2 5 0" stroke="#6B4A3A" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
  heart:'<svg viewBox="0 0 40 40"><path d="M20 35S5 26 5 15a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 11-15 20-15 20z" fill="#FF8FB5" stroke="#E0648F" stroke-width="2"/><path d="M11 14a4 4 0 0 1 4-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>',
  sparkle:'<svg viewBox="0 0 40 40"><path d="M20 2c1.5 9 4 12 16 18-12 6-14.5 9-16 18-1.5-9-4-12-16-18 12-6 14.5-9 16-18z" fill="#C9B2FF" stroke="#9D82F0" stroke-width="2" stroke-linejoin="round"/></svg>',
  smile:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#9FE3CB" stroke="#4FB892" stroke-width="2"/><circle cx="14.5" cy="17" r="2" fill="#2F6B58"/><circle cx="25.5" cy="17" r="2" fill="#2F6B58"/><path d="M13 23q7 7 14 0" stroke="#2F6B58" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  flower:'<svg viewBox="0 0 40 40"><g fill="#FFC6A8" stroke="#F09A6E" stroke-width="1.8"><circle cx="20" cy="9" r="7"/><circle cx="31" cy="17" r="7"/><circle cx="27" cy="30" r="7"/><circle cx="13" cy="30" r="7"/><circle cx="9" cy="17" r="7"/></g><circle cx="20" cy="21" r="6" fill="#FFE38C" stroke="#E9A93A" stroke-width="1.8"/></svg>',
  bow:'<svg viewBox="0 0 48 32"><path d="M24 16C16 4 4 4 4 14s12 10 20 2zM24 16c8-12 20-12 20-2s-12 10-20 2z" fill="#FF9DBE" stroke="#E0648F" stroke-width="2" stroke-linejoin="round"/><path d="M21 17l-5 12M27 17l5 12" stroke="#E0648F" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="16" r="4" fill="#FFB8CF" stroke="#E0648F" stroke-width="2"/></svg>'
};
/* parts of the picnic picture that gently bob (centre x/y and radius in % of the picture, amplitude px, duration, delay) */
const PC_BOB = [
  [37.4, 57, 11, 19, 2.2, 3.4, 0], [59.5, 57.5, 10.6, 18.5, 2.2, 3.6, -1.2],          // the two children
  [49, 67.5, 5, 8, 3, 1.8, -.4],                                                        // chicks on the blanket
  [33.8, 42.6, 3.6, 4.6, 3, 2.2, -.9], [19.7, 62.5, 3.2, 4.6, 2.5, 2.6, -1.6], [14.3, 83.8, 3.2, 4.6, 2.5, 2.4, -.3],   // chicks on head / left
  [27.8, 75.5, 6.4, 8.4, 2, 2.8, -2], [69, 72, 6.4, 7.6, 2, 3, -.6], [90.3, 84.6, 5.2, 5.8, 2.6, 2.1, -1.1],            // cats and bunny
  [8, 17.5, 4, 5.6, 2, 2.6, -.5], [83.4, 18.5, 3.8, 5.4, 2, 2.9, -1.4], [91.2, 31, 3.6, 5, 2, 2.5, -2.1], [66.8, 15, 3, 4.4, 2, 2.3, -.8]  // chicks in the trees
];
const HM_DECO = [
  ['star', '-1%', '2%', 54, -12, 6], ['bow', '44%', '-1%', 50, 8, 7, 'hide-sm'], ['sparkle', '97%', '4%', 36, 0, 5],
  ['heart', '.5%', '46%', 40, -10, 6.5, 'hide-sm'], ['smile', '96%', '44%', 46, 12, 7],
  ['sparkle', '2%', '94%', 30, 0, 5.5, 'hide-sm'], ['star', '95%', '93%', 40, 14, 6.5], ['heart', '60%', '97%', 32, 10, 7, 'hide-sm']
];

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

  const chips = [];
  if(todayTasks.length) chips.push(`<a class="hm-chip" href="#planner">📝 <span>${LANG === 'en' ? `${left.length} of ${todayTasks.length} tasks left` : `เหลืออีก ${left.length} จาก ${todayTasks.length} งาน`}</span></a>`);
  if(word) chips.push(`<a class="hm-chip" href="#vocab">🔤 <span>${T('คำศัพท์วันนี้')}</span> <b>${esc(word.word)}</b></a>`);
  if(reading) chips.push(`<a class="hm-chip" href="#books">📖 <span>${T('กำลังอ่าน')}</span> <b>${esc(reading.title)}</b></a>`);
  if(!chips.length) chips.push(`<a class="hm-chip" href="#diary">✏️ <span>เขียนบันทึกวันนี้</span></a>`);

  const page = h(`<div class="hm">
    <div class="hm-deco" aria-hidden="true"></div>
    <section class="hm-hero" aria-label="${T('หน้าแรก')}">
      <div class="hm-card">
        <span class="hm-tape" aria-hidden="true"></span>
        <div class="hm-greet">
          <span class="hm-date">${dayLine(ymd())}</span>
          <p class="hm-hi">${T(hello)}</p>
          <h1 class="hm-name">${esc(name)}</h1>
        </div>
        <div class="hm-today">
          <div class="hm-type" role="status" aria-live="polite">
            <span class="mg-ic" aria-hidden="true">☁️</span>
            <span class="mg-line"><span class="mg-text"></span><span class="mg-caret"></span></span>
          </div>
          <div class="hm-chips">
            ${chips.join('')}
          </div>
        </div>
      </div>
      <div class="hm-scene meadow">
        <div class="pc-stage">
          <img class="pc-photo" src="img/picnic.jpg" alt="ปิกนิกใต้ต้นซากุระ" decoding="async">
          <div class="pc-sky"><img src="img/picnic-sky.jpg" alt="" decoding="async"></div>
          <div class="pc-tree l"></div><div class="pc-tree r"></div>
          ${PC_BOB.map(([x, y, rx, ry, amp, d, dl]) => `<div class="pc-bob" style="--x:${x}%;--y:${y}%;--rx:${rx}%;--ry:${ry}%;--a:${amp}px;--d:${d}s;--dl:${dl}s"></div>`).join('')}
          <div class="pc-shade"></div>
          <div class="pc-night" aria-hidden="true"><span class="pc-moon"></span><span class="pc-stars"></span></div>
          <div class="pc-petals" aria-hidden="true"></div>
          <div class="pc-snow" aria-hidden="true"></div>
        </div>
        <div class="md-tint"></div>
        <canvas class="md-rain" aria-hidden="true"></canvas>
        <div class="md-flash"></div>
        <div class="wx-widget md-weather" role="status" aria-live="polite">
          <span class="wx-top"><span class="wx-place">สภาพอากาศวันนี้</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M11 1L1 5.2l4.3 1.5L6.8 11z" fill="currentColor"/></svg></span>
          <span class="wx-temp">--°</span>
          <span class="wx-bottom"><span class="wi">☁️</span><span class="wt">กำลังดูสภาพอากาศ…</span></span>
          <span class="wx-hl"></span>
        </div>
        <div class="wx-modes" role="radiogroup" aria-label="โหมดสภาพอากาศ">
          <button data-m="auto" role="radio">อัตโนมัติ</button><button data-m="sun" role="radio">☀️ ร้อน</button><button data-m="rain" role="radio">🌧️ ฝน</button><button data-m="snow" role="radio">❄️ หิมะ</button><button data-m="night" role="radio">🌙 กลางคืน</button>
        </div>
      </div>
    </section>
    <div class="hm-ribbon" aria-hidden="true"><div>${Array(2).fill(Array(6).fill('<span>SERENESKY DIARIES <i>✿</i></span><span>MY LITTLE BUBBLE <i>❀</i></span>').join('')).join('')}</div></div>
    <section class="hm-board" id="folders">
      <h2 class="hm-title">แฟ้มของฉัน</h2>
      <nav class="folds" aria-label="แฟ้มทั้งหมด"></nav>
    </section>
    <section class="hm-arcade" aria-label="ตู้คีบตุ๊กตา">
      <h2 class="hm-title">ตู้คีบตุ๊กตา</h2>
    </section>
  </div>`);
  const hero = $('.meadow', page);

  /* sakura petals drifting on hot days, snowflakes in winter */
  const petals = $('.pc-petals', hero), snow = $('.pc-snow', hero);
  for(let i = 0; i < 18; i++){ const d = 9 + Math.random() * 9; petals.append(h(`<i style="left:${(Math.random() * 100).toFixed(1)}%;--s:${(7 + Math.random() * 7).toFixed(0)}px;--d:${d.toFixed(1)}s;--dl:${(-Math.random() * d).toFixed(1)}s;--x:${(40 + Math.random() * 90).toFixed(0)}px"></i>`)); }
  const stars = $('.pc-stars', hero);
  for(let i = 0; i < 34; i++){ const sp = i < 6; stars.append(h(`<i class="${sp ? 'sp' : ''}" style="left:${(31 + Math.random() * 36).toFixed(1)}%;top:${(10 + Math.random() * 28).toFixed(1)}%;--ss:${sp ? (9 + Math.random() * 6).toFixed(0) : (1.6 + Math.random() * 1.8).toFixed(1)}px;animation-delay:${(-Math.random() * 4).toFixed(1)}s;animation-duration:${(1.8 + Math.random() * 2.6).toFixed(1)}s"></i>`)); }
  for(let i = 0; i < 70; i++){ const d = 7 + Math.random() * 9; snow.append(h(`<i style="left:${(Math.random() * 100).toFixed(1)}%;--s:${(3 + Math.random() * 6).toFixed(1)}px;--d:${d.toFixed(1)}s;--dl:${(-Math.random() * d).toFixed(1)}s;--x:${(-30 + Math.random() * 60).toFixed(0)}px;opacity:${(.6 + Math.random() * .4).toFixed(2)}"></i>`)); }
  const deco = $('.hm-deco', page);
  HM_DECO.forEach(([k, x, y, s, r, d, cls]) => deco.append(h(`<span class="hm-stk ${cls || ''}" style="left:${x};top:${y};--s:${s}px;--r:${r}deg;--d:${d}s">${HM_STK[k]}</span>`)));

  const folds = $('.folds', page);
  APPS.filter(a => a.id !== 'home' && a.id !== 'game').forEach(a => {
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
  $('.hm-arcade', page).append(clawMachine());
  el.append(page);

  /* greeting messages typed into the card */
  const msgs = [`${T(hello)} ${name}`];
  typeLoop($('.mg-text', page), msgs);

  /* weather */
  let wx = null;
  const applyWeather = () => {
    const mode = weatherMode();
    let kind = wx ? wx.kind : 'clear', day = wx ? wx.day : (hr >= 6 && hr < 18);
    if(mode === 'sun'){ kind = 'clear'; day = true; }
    if(mode === 'rain'){ kind = 'rain'; }
    if(mode === 'night'){ kind = 'clear'; day = false; }
    // Thai seasons: rain follows the real weather; otherwise the cool season (Nov–Feb, or a cold day) snows and the rest is hot
    const winter = [10, 11, 0, 1].includes(now.getMonth()) || (wx && wx.temp <= 20);
    const mood = mode === 'snow' ? 'snow' : mode === 'sun' ? 'hot' : mode === 'rain' || kind === 'rain' || kind === 'storm' ? 'rain' : mode === 'auto' && winter ? 'snow' : 'hot';
    hero.dataset.wx = kind; hero.dataset.day = day ? '1' : '0'; hero.dataset.mood = mood;
    const icon = day || kind !== 'clear' ? Weather.icon(kind) : '🌙';
    $('.md-weather .wi', page).textContent = icon;
    // temperature and place stay real; the preview modes only change the sky
    $('.md-weather .wt', page).textContent = T(Weather.label(kind));
    $('.md-weather .wx-temp', page).textContent = wx ? `${wx.temp}°` : '--°';
    $('.md-weather .wx-place', page).textContent = wx && wx.place ? wx.place : T('สภาพอากาศวันนี้');
    $('.md-weather .wx-hl', page).textContent = wx && wx.hi != null ? `${LANG === 'en' ? 'H' : 'สูงสุด'}:${wx.hi}° ${LANG === 'en' ? 'L' : 'ต่ำสุด'}:${wx.lo}°` : '';
    $$('.wx-modes button', page).forEach(b => { const on = b.dataset.m === mode; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    $('.mg-ic', page).textContent = icon;
    Rain.set($('.md-rain', hero), kind === 'rain' || kind === 'storm', kind === 'storm', $('.md-flash', hero));
    // messages
    msgs.length = 0;
    msgs.push(`${T(hello)} ${name}`);
    if(wx && mode === 'auto') msgs.push(LANG === 'en' ? `It's ${wx.temp}° and ${T(Weather.label(wx.kind)).toLowerCase()}${wx.place ? ' in ' + wx.place : ''}` : `ตอนนี้ ${wx.temp}° ${Weather.label(wx.kind)}${wx.place ? 'ที่' + wx.place : ''}`);
    if(mood === 'snow') msgs.push(T('หน้าหนาวแล้ว ใส่เสื้อกันหนาวด้วยนะ'));
    else if(kind === 'rain' || kind === 'storm' || mood === 'rain') msgs.push(T('ฝนตกอยู่ พกร่มด้วยนะ'));
    else if(day && wx && wx.temp >= 33) msgs.push(T('อากาศร้อนมาก ดื่มน้ำเยอะ ๆ นะ'));
    else if(day) msgs.push(T('วันนี้อากาศดี ออกไปเดินเล่นกัน'));
    else msgs.push(T('ดึกแล้ว พักผ่อนเยอะ ๆ นะ'));
    if(todayTasks.length) msgs.push(LANG === 'en' ? `${left.length} of ${todayTasks.length} tasks left today` : `วันนี้เหลืออีก ${left.length} จาก ${todayTasks.length} งาน`);
    if(word) msgs.push(`${T('คำศัพท์วันนี้')}: ${word.word}`);
    if(reading) msgs.push(`${T('กำลังอ่าน')} ${reading.title}`);
  };
  requestAnimationFrame(() => requestAnimationFrame(applyWeather));   // after the page is on screen, so the rain canvas can size itself
  applyWeather();
  $$('.wx-modes button', page).forEach(b => b.onclick = async () => {
    if(b.dataset.m === weatherMode()) return;
    homeWeatherMode = b.dataset.m;
    META.weatherMode = homeWeatherMode; applyWeather();
    try{ await Store.setMeta(META); }catch(e){}
  });
  Weather.current().then(d => { wx = d; if(hero.isConnected) applyWeather(); }).catch(() => {
    if(hero.isConnected) $('.md-weather .wt', page).textContent = T('ดูสภาพอากาศไม่ได้');
  });
};

Object.assign(DICT, {'หน้าต่างวันนี้':'Today’s window', 'เขียนบันทึกวันนี้':'Write today’s entry', 'เปลี่ยนโหมดสภาพอากาศ':'Change weather mode', 'สภาพอากาศวันนี้':'Today’s weather', 'ร้อน':'Hot', 'หิมะ':'Snow', 'ปิกนิกใต้ต้นซากุระ':'Picnic under the cherry trees', 'หน้าหนาวแล้ว ใส่เสื้อกันหนาวด้วยนะ':'It’s the cool season, wrap up warm', 'อากาศร้อนมาก ดื่มน้ำเยอะ ๆ นะ':'It’s really hot, drink plenty of water', 'โหมดสภาพอากาศ':'Weather mode', 'แดด':'Sunny', 'ฝน':'Rain', 'กลางคืน':'Night', 'โหมดกลางคืน':'Night mode', 'เปลี่ยนเป็นกลางคืน':'Switched to night'});

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
