/* =========================================================
   HOME
   ========================================================= */
const BLADES = (() => {
  let d = ''; for(let x = 0; x < 64; x += 4){ const hgt = 6 + ((x * 7) % 12); d += `M${x} 18 L${x + 2} ${18 - hgt} L${x + 4} 18 Z `; }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="18"><path d="${d}" fill="#86D068"/></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
})();
const HOME_STK = {
  bunny:`<svg viewBox="0 0 140 196"><circle cx="70" cy="24" r="18" fill="none" stroke="#9AA0AE" stroke-width="7"/><circle cx="70" cy="24" r="18" fill="none" stroke="#D5D9E2" stroke-width="2.5"/>${[48,58,68,78].map(y => `<circle cx="70" cy="${y}" r="3.6" fill="#A7ADBB"/>`).join('')}<g transform="translate(0 6)"><ellipse cx="54" cy="92" rx="10" ry="26" fill="#F8A5C6" transform="rotate(-14 54 92)"/><ellipse cx="86" cy="92" rx="10" ry="26" fill="#F8A5C6" transform="rotate(14 86 92)"/><ellipse cx="54" cy="94" rx="4.5" ry="17" fill="#FFD3E4" transform="rotate(-14 54 94)"/><ellipse cx="86" cy="94" rx="4.5" ry="17" fill="#FFD3E4" transform="rotate(14 86 94)"/><ellipse cx="70" cy="160" rx="24" ry="22" fill="#F8A5C6"/><ellipse cx="38" cy="140" rx="8" ry="14" fill="#F8A5C6" transform="rotate(-50 38 140)"/><ellipse cx="102" cy="140" rx="8" ry="14" fill="#F8A5C6" transform="rotate(50 102 140)"/><ellipse cx="56" cy="182" rx="10" ry="7" fill="#F8A5C6"/><ellipse cx="84" cy="182" rx="10" ry="7" fill="#F8A5C6"/><circle cx="70" cy="128" r="30" fill="#FBB4D0"/><path d="M56 124q5-6 10 0M74 124q5-6 10 0" stroke="#5A2D44" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M62 134q8 12 16 0z" fill="#E0507A"/><circle cx="52" cy="134" r="5" fill="#FF7FA8" opacity=".6"/><circle cx="88" cy="134" r="5" fill="#FF7FA8" opacity=".6"/></g></svg>`,
  star:`<svg viewBox="0 0 130 130"><path d="M65 8c4 0 6 2 8 6l12 26 28 4c7 1 9 8 4 13l-20 20 5 28c1 7-6 11-12 8l-25-13-25 13c-6 3-13-1-12-8l5-28-20-20c-5-5-3-12 4-13l28-4 12-26c2-4 4-6 8-6z" fill="#F4B942" stroke="#C98A1E" stroke-width="3"/><path d="M50 52l30 30M80 52L50 82" stroke="#B0781A" stroke-width="3.5" stroke-linecap="round"/><path d="M65 20l9 20" stroke="#FFE08A" stroke-width="4" stroke-linecap="round" opacity=".8"/></svg>`,
  cherry:`<svg viewBox="0 0 150 140"><path d="M42 92C54 50 72 30 96 18M108 96C104 60 100 36 96 18" stroke="#5E8C3A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96 18c14-14 38-12 48-2-14 12-34 14-48 2z" fill="#7CC36A"/><path d="M96 18c-12-10-30-10-40-2 12 10 28 12 40 2z" fill="#8FD17A"/><circle cx="40" cy="104" r="28" fill="#E0374F"/><circle cx="108" cy="106" r="28" fill="#E0374F"/><circle cx="30" cy="94" r="7" fill="#fff" opacity=".45"/><circle cx="98" cy="96" r="7" fill="#fff" opacity=".45"/><circle cx="32" cy="106" r="2.8" fill="#3A1A20"/><circle cx="48" cy="106" r="2.8" fill="#3A1A20"/><path d="M36 113q4 3 8 0" stroke="#3A1A20" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="100" cy="108" r="2.8" fill="#3A1A20"/><circle cx="116" cy="108" r="2.8" fill="#3A1A20"/><path d="M104 117q4-4 8 0" stroke="#3A1A20" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`
};
const FOLDER_THEME = {
  diary:  {bg:'#FFDCE8', ink:'#E47AA3', tab:'#F8C3D6'},
  books:  {bg:'#FFF4E6', ink:'rgba(255,160,100,.45)', tab:'#FFD2AE', icon:'#EE8A4E'},
  tarot:  {bg:'#EBE2FD', ink:'#8E72DA', tab:'#D7C8F7'},
  travel: {bg:'#CFE4F7', ink:'#FFFFFF', tab:'#B9D6F1', icon:'#5A91D0'},
  screen: {bg:'#FFF1F1', ink:'rgba(240,110,125,.4)', line:'rgba(200,70,90,.5)', tab:'#FFC9CF', icon:'#E0566B'},
  music:  {bg:'#E4F7EF', ink:'rgba(70,190,155,.55)', tab:'#BDE9D8', icon:'#2FA886'},
  vocab:  {bg:'#FFF6D6', ink:'#F2C24E', tab:'#FBE39B', icon:'#D39A12'},
  planner:{bg:'#EEF1FF', ink:'rgba(130,150,245,.5)', tab:'#CCD5FB', icon:'#6480EE'},
  profile:{bg:'#FBE4B7', ink:'#F08CAA', tab:'#EFCB8A', icon:'#E0708F'}
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
    profile:`${heart(T.profile.ink)} 0 0/40px 40px,${T.profile.bg}`
  };
})();
const FOLDER_TAB = Object.fromEntries(Object.entries(FOLDER_THEME).map(([k, v]) => [k, v.tab]));
const FOLDER_ICON = Object.fromEntries(Object.entries(FOLDER_THEME).map(([k, v]) => [k, v.icon || v.ink]));
/* ---- meadow background: fluffy clouds + grassy hill with little flowers (drawn, no photos) ---- */
function seeded(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const MEADOW_SVG = (() => {
  const R = seeded(20260929), W = 1200, H = 1400;
  const hill = x => 250 - 190 * Math.exp(-Math.pow((x - 600) / 300, 2)) - 18 * Math.sin(x / 120) + 10 * Math.sin(x / 47);
  const back = x => 175 - 40 * Math.sin(x / 260 + 1.2) - 25 * Math.cos(x / 170);
  const path = (f, step = 12) => { let d = `M0 ${f(0).toFixed(1)}`; for(let x = step; x <= W; x += step) d += ` L${x} ${f(x).toFixed(1)}`; return d + ` L${W} ${H} L0 ${H} Z`; };
  const greens = ['#4E9E38','#5DAF44','#6BBE4E','#3F8A2E','#7ACB58','#88D466','#347A28'];
  const fringe = (f, n, lenMin, lenMax, cols) => { let s = ''; for(let i = 0; i < n; i++){ const x = (i / n) * W + R() * 4; const y = f(x) + 3 + R() * 5; const l = lenMin + R() * (lenMax - lenMin); const lean = (R() - .5) * 10; s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q${(lean / 2).toFixed(1)} ${(-l / 2).toFixed(1)} ${lean.toFixed(1)} ${(-l).toFixed(1)}" stroke="${cols[(R() * cols.length) | 0]}" stroke-width="${(1.4 + R() * 1.4).toFixed(1)}"/>`; } return s; };
  // blades scattered across the hill body, shorter near the top (distance)
  let body = '';
  for(let i = 0; i < 1400; i++){
    const x = R() * W, top = hill(x); const y = top + 10 + Math.pow(R(), .7) * (H - top - 10);
    const depth = Math.min(1, (y - top) / 700); const l = 5 + depth * 22 + R() * 6; const lean = (R() - .5) * (6 + depth * 10);
    body += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q${(lean / 2).toFixed(1)} ${(-l / 2).toFixed(1)} ${lean.toFixed(1)} ${(-l).toFixed(1)}" stroke="${greens[(R() * greens.length) | 0]}" stroke-width="${(1 + depth * 2).toFixed(1)}" opacity="${(.55 + R() * .45).toFixed(2)}"/>`;
  }
  // little white flowers
  let flowers = '';
  for(let i = 0; i < 120; i++){
    const x = 30 + R() * (W - 60), top = hill(x); const y = top + 14 + Math.pow(R(), 1.3) * 520;
    const s = .5 + Math.min(1.4, (y - top) / 300);
    flowers += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})"><circle cx="0" cy="-2.2" r="2"/><circle cx="2.1" cy="-.6" r="2"/><circle cx="1.3" cy="1.9" r="2"/><circle cx="-1.3" cy="1.9" r="2"/><circle cx="-2.1" cy="-.6" r="2"/><circle r="1.1" fill="#F6D65A"/></g>`;
  }
  // red wildflower clusters on both sides
  let reds = '';
  const cluster = (cx, spread, n) => { for(let i = 0; i < n; i++){ const x = cx + (R() - .5) * spread, top = hill(x), y = top - 4 + R() * 30; const h = 10 + R() * 16; const c = ['#E0503A','#D8452F','#EF7A4A','#C93A2A'][(R() * 4) | 0]; reds += `<path d="M${x.toFixed(1)} ${(y + h).toFixed(1)} l${((R() - .5) * 3).toFixed(1)} ${-h.toFixed(1)}" stroke="#4E8F34" stroke-width="1.2"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2 + R() * 1.8).toFixed(1)}" fill="${c}"/>`; } };
  cluster(120, 200, 55); cluster(300, 120, 25); cluster(930, 140, 30); cluster(1090, 180, 50);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mdBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D98A"/><stop offset=".4" stop-color="#7FC05E"/></linearGradient>
      <linearGradient id="mdHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AD063"/><stop offset=".25" stop-color="#63B045"/><stop offset=".7" stop-color="#4A9A36"/><stop offset="1" stop-color="#3C8A2E"/></linearGradient>
      <radialGradient id="mdLight" cx=".5" cy=".05" r=".6"><stop offset="0" stop-color="#EFFFD0" stop-opacity=".45"/><stop offset="1" stop-color="#EFFFD0" stop-opacity="0"/></radialGradient>
    </defs>
    <path d="${path(back)}" fill="url(#mdBack)"/>
    <g fill="none" stroke-linecap="round">${fringe(back, 260, 5, 11, ['#8CCB6A','#9ED67C','#7DBD5C'])}</g>
    <path d="${path(hill)}" fill="url(#mdHill)"/>
    <path d="${path(hill)}" fill="url(#mdLight)"/>
    <g fill="none" stroke-linecap="round">${body}</g>
    <g fill="none" stroke-linecap="round">${fringe(hill, 420, 8, 22, greens)}</g>
    <g>${reds}</g>
    <g fill="#FFFFFF">${flowers}</g>
  </svg>`;
})();
function meadowClouds(){
  const R = seeded(77);
  const spec = [[1, 5, 230], [24, 2, 170], [70, 4, 250], [88, 16, 180], [8, 26, 150], [80, 30, 140]];
  return spec.map(([x, y, w], i) => {
    let puffs = '';
    const n = 14;
    for(let k = 0; k < n; k++){
      const t = k / (n - 1), px = 6 + t * 88 + (R() - .5) * 6, arch = Math.sin(t * Math.PI);
      const size = 18 + arch * 26 + R() * 10, py = 62 - arch * 26 + (R() - .5) * 8;
      puffs += `<i style="left:${px.toFixed(1)}%;top:${py.toFixed(1)}%;width:${size.toFixed(1)}%;"></i>`;
    }
    return `<div class="sticker md-cloud-wrap" data-depth="${(.6 + (i % 3) * .5).toFixed(1)}" style="left:${x}%;top:${y}%"><div class="md-cloud" style="--cw:${w}px;--cd:${60 + i * 9}s">${puffs}</div></div>`;
  }).join('');
}
VIEWS.home = async el => {
  const now = new Date(), hr = now.getHours();
  const hello = hr < 5 ? 'ดึกแล้วนะ' : hr < 12 ? 'อรุณสวัสดิ์' : hr < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';
  const name = META.name || T('เธอ');
  const data = {};
  for(const s of ['diary','books','tarot','travel','screen','music','vocab','planner']) data[s] = await Store.list(s);
  const todayTasks = data.planner.filter(t => t.date === ymd()).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const left = todayTasks.filter(t => !t.done);
  const reading = data.books.filter(b => b.status === 'reading');
  const toLearn = data.vocab.filter(w => !w.learned);
  const word = toLearn.length ? toLearn[now.getDate() % toLearn.length] : null;
  const newest = arr => [...arr].sort((a, b) => b.createdAt - a.createdAt)[0];
  const lastDiary = [...data.diary].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt)[0];
  const lastTrip = [...data.travel].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
  const song = newest(data.music);

  const preview = {
    diary: lastDiary ? `ล่าสุด ${esc(lastDiary.mood || '')} ${esc(lastDiary.title || thDate(lastDiary.date))}` : 'วันนี้เป็นยังไงบ้าง เขียนหน้าแรกกัน',
    books: reading.length ? `กำลังอ่าน ${esc(reading[0].title)}` : `${data.books.length} เล่มบนชั้น`,
    tarot: data.tarot.length ? `สะสมไว้ ${data.tarot.length} สำรับ` : 'ยังไม่มีสำรับในคลัง',
    travel: lastTrip ? `ล่าสุด ${esc(lastTrip.place)}` : 'ยังไม่มีรูปบนราว',
    screen: data.screen.length ? `ตั๋ว ${data.screen.length} ใบ` : 'ยังไม่มีตั๋วหนัง',
    music: song ? `${esc(song.title)}${song.artist ? ' — ' + esc(song.artist) : ''}` : 'ยังไม่มีแผ่นเสียง',
    vocab: word ? `${esc(word.word)} = ${esc(word.meaning)}` : 'จดคำแรกเพื่อเริ่มท่อง',
    planner: todayTasks.length ? `วันนี้เหลือ ${left.length} จาก ${todayTasks.length} งาน` : 'วันนี้ยังว่าง',
    profile: esc([META.mbti, zodiacOf(META.birthday) && 'ราศี' + zodiacOf(META.birthday)].filter(Boolean).join(' ') || 'พาสปอร์ตของฉัน')
  };

  const scene = h(`<section class="home-scene" style="--blades:${BLADES}">
    <div class="hs-sky" aria-hidden="true">${meadowClouds()}</div>
    <div class="hs-hill" aria-hidden="true">${MEADOW_SVG}</div>
    <div class="hero-fold-wrap">
      <div class="hf">
        <div class="hf-back"></div>
        <div class="hf-paper p1"><div class="row"><span>NAME ${esc(ppCut(name, 12))}</span><span>NO. ${passportId().slice(3, 7)}</span></div><div class="row" style="margin-top:12px"><span>TODAY ${ymd()}</span><span>TASKS ${todayTasks.length}</span></div></div>
        <div class="hf-paper p2"></div>
        <div class="hf-front">
          <div class="hf-star" aria-hidden="true"></div>
          <p class="handle">@${esc(name)}</p>
          <h1><span class="word" style="animation-delay:.05s">${hello}</span><br><span class="word" style="animation-delay:.18s">${esc(name)}</span></h1>
          <p class="sub">${dayLine(ymd())}</p>
          <div class="todo">${left.slice(0, 2).map(t => `<a href="#planner">${t.time ? esc(t.time) + ' ' : ''}${esc(ppCut(t.text, 18))}</a>`).join('')}${word ? `<a href="#vocab">คำวันนี้ ${esc(word.word)}</a>` : ''}</div>
        </div>
      </div>
      <div class="hstk bunny sticker" data-depth="1.6" aria-hidden="true"><span class="stk">${HOME_STK.bunny}</span></div>
      <div class="hstk star sticker" data-depth="2.2" aria-hidden="true"><span class="stk" style="--d:4.4s">${HOME_STK.star}</span></div>
      <div class="hstk cherry sticker" data-depth="1.2" aria-hidden="true"><span class="stk" style="--d:5.6s">${HOME_STK.cherry}</span></div>
    </div>
    <h2 class="fold-title">แฟ้มของฉัน</h2>
    <nav class="folds" aria-label="แฟ้มทั้งหมด"></nav>
  </section>`);

  const folds = $('.folds', scene);
  APPS.filter(a => a.id !== 'home').forEach(a => {
    const f = h(`<a class="fold" href="#${a.id}" aria-label="${a.name}" title="${a.name}" style="--pat:${FOLDER_PAT[a.id]};--tabc:${FOLDER_TAB[a.id]};--fic:${FOLDER_ICON[a.id]}">
      <span class="fold-back"></span>
      <span class="fold-paper"></span><span class="fold-paper two"></span>
      <span class="fold-front"><span class="fi">${ic(a.icon)}</span></span>
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
  el.append(scene);
};
