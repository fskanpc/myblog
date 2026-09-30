/* =========================================================
   GAME: claw machine (ตู้คีบตุ๊กตา)
   ========================================================= */
const PLUSH = {
  bunny: {th:'กระต่าย', body:'#FFC9DA', ear:'#FFC9DA', inner:'#FF9DBE'},
  bear:  {th:'หมี', body:'#D2A274', ear:'#D2A274', inner:'#F1D2B0'},
  piggy: {th:'หมูน้อย', body:'#FFB9C9', ear:'#FFA3B9', inner:'#FF8FAA'},
  chick: {th:'ลูกเจี๊ยบ', body:'#FFE27A', ear:'#FFD24A', inner:'#FFB23A'},
  lamb:  {th:'แกะ', body:'#FFFFFF', ear:'#F7D6DE', inner:'#F7D6DE'},
  kitty: {th:'แมว', body:'#E6DEFA', ear:'#E6DEFA', inner:'#FFC4D8'}
};
const PLUSH_TYPES = Object.keys(PLUSH);
const DAILY_COINS = 5;
const CM = {W:360, H:440, railY:22, chuteX:98, chuteTop:300, homeX:54};
/* claw arms: w = how far each arm reaches out sideways */
const CLAW = {len:44, tip:16, open:40, rest:22, shut:7};

function drawPlush(ctx, type, r, ang = 0){
  const P = PLUSH[type], line = '#9A7589';
  ctx.save(); ctx.rotate(ang); ctx.lineWidth = Math.max(1.4, r * .07); ctx.strokeStyle = line; ctx.lineJoin = 'round';
  const fillStroke = () => { ctx.fill(); ctx.stroke(); };
  ctx.fillStyle = P.ear;
  if(type === 'bunny'){
    for(const s of [-1, 1]){ ctx.beginPath(); ctx.ellipse(s * r * .38, -r * 1.05, r * .24, r * .62, s * .18, 0, 7); fillStroke(); ctx.fillStyle = P.inner; ctx.beginPath(); ctx.ellipse(s * r * .38, -r * 1.02, r * .1, r * .4, s * .18, 0, 7); ctx.fill(); ctx.fillStyle = P.ear; }
  } else if(type === 'bear' || type === 'lamb'){
    for(const s of [-1, 1]){ ctx.beginPath(); ctx.arc(s * r * .66, -r * .66, r * .3, 0, 7); fillStroke(); ctx.fillStyle = P.inner; ctx.beginPath(); ctx.arc(s * r * .66, -r * .66, r * .15, 0, 7); ctx.fill(); ctx.fillStyle = P.ear; }
  } else if(type === 'piggy' || type === 'kitty'){
    for(const s of [-1, 1]){ ctx.beginPath(); ctx.moveTo(s * r * .78, -r * .38); ctx.lineTo(s * r * .62, -r * 1.02); ctx.lineTo(s * r * .18, -r * .78); ctx.closePath(); fillStroke(); }
  } else if(type === 'chick'){
    ctx.beginPath(); ctx.moveTo(-r * .1, -r * .92); ctx.quadraticCurveTo(0, -r * 1.35, r * .14, -r * .9); ctx.quadraticCurveTo(r * .3, -r * 1.2, r * .32, -r * .86); fillStroke();
  }
  // body
  ctx.fillStyle = P.body; ctx.beginPath();
  if(type === 'lamb'){ for(let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2; ctx.moveTo(Math.cos(a) * r * .86 + r * .2, Math.sin(a) * r * .86); ctx.arc(Math.cos(a) * r * .86, Math.sin(a) * r * .86, r * .2, 0, 7); } ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, r * .9, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(0, r * .05, r * .62, 0, 7); ctx.fillStyle = '#FFF6EE'; }
  else ctx.ellipse(0, 0, r, r * .92, 0, 0, 7);
  fillStroke();
  // face
  const ey = type === 'lamb' ? r * .02 : -r * .05;
  ctx.fillStyle = '#4A3548';
  for(const s of [-1, 1]){ ctx.beginPath(); ctx.ellipse(s * r * .3, ey, r * .075, r * .1, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,120,150,.45)';
  for(const s of [-1, 1]){ ctx.beginPath(); ctx.ellipse(s * r * .5, ey + r * .2, r * .14, r * .09, 0, 0, 7); ctx.fill(); }
  if(type === 'piggy'){ ctx.fillStyle = P.inner; ctx.beginPath(); ctx.ellipse(0, ey + r * .26, r * .22, r * .15, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#9A5A70'; for(const s of [-1, 1]){ ctx.beginPath(); ctx.arc(s * r * .07, ey + r * .26, r * .035, 0, 7); ctx.fill(); } }
  else if(type === 'chick'){ ctx.fillStyle = P.inner; ctx.beginPath(); ctx.moveTo(-r * .1, ey + r * .15); ctx.lineTo(r * .1, ey + r * .15); ctx.lineTo(0, ey + r * .3); ctx.closePath(); ctx.fill(); }
  else if(type === 'bear'){ ctx.fillStyle = P.inner; ctx.beginPath(); ctx.ellipse(0, ey + r * .28, r * .26, r * .19, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4A3548'; ctx.beginPath(); ctx.ellipse(0, ey + r * .2, r * .07, r * .05, 0, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle = '#4A3548'; ctx.lineWidth = Math.max(1.2, r * .05); ctx.beginPath(); ctx.moveTo(-r * .1, ey + r * .2); ctx.quadraticCurveTo(-r * .05, ey + r * .28, 0, ey + r * .2); ctx.quadraticCurveTo(r * .05, ey + r * .28, r * .1, ey + r * .2); ctx.stroke(); }
  if(type === 'kitty'){ ctx.strokeStyle = 'rgba(74,53,72,.5)'; ctx.lineWidth = 1; for(const s of [-1, 1]) for(const k of [0, 1]){ ctx.beginPath(); ctx.moveTo(s * r * .55, ey + r * (.12 + k * .1)); ctx.lineTo(s * r * .9, ey + r * (.06 + k * .16)); ctx.stroke(); } }
  ctx.restore();
}
function plushIcon(type, size = 64){
  const c = document.createElement('canvas'), d = 2; c.width = c.height = size * d; c.style.width = c.style.height = size + 'px';
  const x = c.getContext('2d'); x.scale(d, d); x.translate(size / 2, size * .6); drawPlush(x, type, size * .34); return c;
}

/* tiny sound effects */
const Blip = (() => {
  let ac;
  function tone(f, dur, type = 'sine', vol = .08, when = 0, slide){
    try{
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if(ac.state === 'suspended') ac.resume();
      const t = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if(slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + .02);
    }catch(e){}
  }
  return {
    coin(){ tone(988, .08, 'square', .05); tone(1319, .25, 'square', .05, .08); },
    move(){ tone(220, .05, 'triangle', .03); },
    drop(){ tone(520, .5, 'sine', .05, 0, 180); },
    grab(){ tone(300, .12, 'square', .04); },
    win(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', .07, i * .11)); },
    miss(){ tone(330, .25, 'sawtooth', .03, 0, 150); }
  };
})();

function gameState(){
  const g = META.game || {};
  if(g.day !== ymd()){ g.day = ymd(); g.coins = DAILY_COINS; }
  META.game = g; META.prizes = META.prizes || {};
  return g;
}
function saveGame(){ clearTimeout(saveGame.t); saveGame.t = setTimeout(() => Store.setMeta(META).catch(() => {}), 500); }

VIEWS.game = async el => {
  el.append(pageHead('เกมคีบตุ๊กตา', 'ได้เหรียญฟรีวันละ 5 เหรียญ คีบให้ได้แล้วเก็บไว้บนชั้นของสะสม'));
  el.append(clawMachine({globalKeys:true}));
};

/* the machine on its own, so the home page can show it next to the folders.
   globalKeys: arrow keys and Space work anywhere on the page (game page only);
   otherwise they only work while the machine has focus or a coin is in play */
function clawMachine({compact = false, globalKeys = false} = {}){
  const g = gameState();
  const wrap = h(`<div class="cm-wrap${compact ? ' compact' : ''}">
    <div class="claw-machine" tabindex="0" aria-label="ตู้คีบตุ๊กตา">
      <div class="cm-sign"><span>LUCKY CATCH</span></div>
      <div class="cm-window">
        <canvas aria-label="ตู้คีบตุ๊กตา" role="img"></canvas>
        <div class="cm-glass" aria-hidden="true"></div>
        <div class="cm-msg" role="status" aria-live="polite"></div>
      </div>
      <div class="cm-panel">
        <div class="cm-slots">
          <span class="slot" aria-hidden="true"><i></i></span><span class="slot tilt" aria-hidden="true"><i></i></span>
          <button class="cm-coin" aria-label="ใส่เหรียญ"><b>1</b><small>coin</small></button>
        </div>
        <div class="cm-stick">
          <button class="cm-dir" data-d="-1" aria-label="เลื่อนซ้าย">${ic('left')}</button>
          <span class="cm-knob" aria-hidden="true"><i></i></span>
          <button class="cm-dir" data-d="1" aria-label="เลื่อนขวา">${ic('right')}</button>
        </div>
        <button class="cm-drop" aria-label="กดคีบ"><span></span></button>
      </div>
    </div>
    <aside class="cm-side">
      <section class="glass cm-card">
        <h3>เหรียญวันนี้</h3>
        <div class="cm-coinrow"></div>
        <p class="muted">กด <b>1 coin</b> เพื่อเริ่ม เลื่อนที่คีบด้วยปุ่มลูกศร แล้วกดปุ่มแดงเพื่อคีบ ใช้คีย์บอร์ดได้ด้วย ← → เลื่อน และ Space คีบ</p>
      </section>
      <section class="glass cm-card">
        <h3>ชั้นของสะสม</h3>
        <div class="cm-shelf"></div>
      </section>
    </aside>
  </div>`);

  const cv = $('canvas', wrap), ctx = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = CM.W * dpr; cv.height = CM.H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const msg = $('.cm-msg', wrap);
  const say = (t, ms) => { msg.textContent = T(t); msg.classList.add('show'); clearTimeout(say.t); if(ms) say.t = setTimeout(() => msg.classList.remove('show'), ms); };

  const renderCoins = () => {
    const row = $('.cm-coinrow', wrap); row.innerHTML = '';
    for(let i = 0; i < DAILY_COINS; i++) row.append(h(`<span class="coin ${i < g.coins ? 'on' : ''}" aria-hidden="true"></span>`));
    row.append(h(`<span class="coin-txt">${LANG === 'en' ? `${g.coins} left` : `เหลือ ${g.coins} เหรียญ`}</span>`));
    $('.cm-coin', wrap).disabled = g.coins <= 0 || S.state !== 'idle';
  };
  const renderShelf = () => {
    const sh = $('.cm-shelf', wrap); sh.innerHTML = '';
    const total = Object.values(META.prizes).reduce((a, b) => a + b, 0);
    if(!total){ sh.append(h('<p class="muted" style="margin:0">ยังว่างอยู่ คีบตัวแรกให้ได้กัน</p>')); return; }
    PLUSH_TYPES.forEach(t => {
      const n = META.prizes[t] || 0; if(!n) return;
      const it = h(`<div class="prize"><span class="pn">×${n}</span><span class="pl">${PLUSH[t].th}</span></div>`);
      it.prepend(plushIcon(t, 58)); sh.append(it);
    });
  };

  /* ---- world ---- */
  const S = {state:'idle', x:CM.homeX, rope:30, w:CLAW.rest, target:CLAW.rest, held:null, dir:0, slipAt:0, t:0};
  const hubY = () => CM.railY + 22 + S.rope;              // bottom of the claw's hub; arms hinge here
  const holdY = p => hubY() + p.r * .88;                   // plush centre when it hangs inside the claw
  const plush = [];
  const addPlush = (x, y) => { const type = PLUSH_TYPES[(Math.random() * PLUSH_TYPES.length) | 0]; plush.push({type, x, y, vx:0, vy:0, r:25 + Math.random() * 6, a:(Math.random() - .5) * .6, va:0, won:false, fade:1}); };
  for(let i = 0; i < 15; i++) addPlush(125 + Math.random() * 210, 150 + Math.random() * 260);
  for(let k = 0; k < 240; k++) physics();

  function physics(){
    for(const p of plush){
      if(p === S.held) continue;
      p.vy += .45; p.vx *= .985; p.vy *= .995; p.x += p.vx; p.y += p.vy; p.va = (p.va - p.a * .004) * .86; p.a = Math.max(-.45, Math.min(.45, p.a + p.va));
      const floor = CM.H - p.r * .9;
      if(p.y > floor){ p.y = floor; p.vy *= -.15; p.vx *= .8; }
      if(p.x < 12 + p.r){ p.x = 12 + p.r; p.vx *= -.3; }
      if(p.x > CM.W - 12 - p.r){ p.x = CM.W - 12 - p.r; p.vx *= -.3; }
      if(p.y + p.r * .5 > CM.chuteTop){
        if(p.x < CM.chuteX){ if(p.x > CM.chuteX - 4 - p.r) { p.x = CM.chuteX - 4 - p.r; p.vx *= -.3; } }
        else if(p.x < CM.chuteX + 4 + p.r){ p.x = CM.chuteX + 4 + p.r; p.vx = Math.abs(p.vx) * .3; }
      }
    }
    for(let it = 0; it < 3; it++) for(let i = 0; i < plush.length; i++) for(let j = i + 1; j < plush.length; j++){
      const a = plush[i], b = plush[j]; if(a === S.held || b === S.held) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = (a.r + b.r) * .86;
      if(d < min){
        const push = (min - d) / 2, nx = dx / d, ny = dy / d;
        a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if(rv < 0){ const imp = -rv * .6; a.vx -= nx * imp / 2; a.vy -= ny * imp / 2; b.vx += nx * imp / 2; b.vy += ny * imp / 2; if(rv < -1.2){ a.va -= nx * .03; b.va += nx * .03; } }
      }
    }
  }

  function step(){
    const sp = 2.4;
    if(S.state === 'ready' && S.dir){ S.x = Math.max(CM.homeX, Math.min(CM.W - 40, S.x + S.dir * sp)); }
    else if(S.state === 'down'){
      S.rope += 3.2;
      // stop when the hub reaches the top of a plush right under it, or the floor
      const hit = plush.some(p => p.x > CM.chuteX && Math.abs(p.x - S.x) < p.r * .9 && hubY() >= p.y - p.r * .9);
      if(hit || hubY() + CLAW.len * .7 >= CM.H - 4){
        S.state = 'close'; Blip.grab();
        let best = null, bd = 1e9;
        for(const p of plush){ const dx = Math.abs(p.x - S.x); if(p.x > CM.chuteX && dx < p.r * .95 && Math.abs(p.y - holdY(p)) < p.r * .6 && dx < bd){ bd = dx; best = p; } }
        const chance = best ? Math.max(.15, Math.min(.88, .92 - bd / best.r * .75)) : 0;
        S.grab = best && Math.random() < chance ? best : null;
        // arms close until they touch the plush; a miss squeezes past it
        S.target = S.grab ? S.grab.r + 3 : CLAW.shut;
      }
    } else if(S.state === 'close'){
      S.w = Math.max(S.target, S.w - 1.1);
      if(S.grab && S.w < S.grab.r + 14){ const p = S.grab; p.vx += (S.x - p.x) * .08; p.vy = Math.min(p.vy, 0); }
      if(S.w <= S.target){
        if(S.grab){ S.held = S.grab; S.held.vx = S.held.vy = 0; S.slipAt = Math.random() < .2 ? CM.homeX + 30 + Math.random() * Math.max(10, S.x - CM.homeX - 40) : -1; }
        S.grab = null; S.state = 'up';
      }
    } else if(S.state === 'up'){
      S.rope = Math.max(30, S.rope - 2.6);
      if(S.rope <= 30){ S.state = 'carry'; if(!S.held){ say('พลาดไปนิดเดียว ลองใหม่นะ', 2200); Blip.miss(); } }
    } else if(S.state === 'carry'){
      S.x = Math.max(CM.homeX, S.x - 2.2);
      if(S.held && S.slipAt > 0 && S.x <= S.slipAt){ const p = S.held; S.held = null; S.w = S.target = CLAW.rest; p.vy = 1; p.va = (Math.random() - .5) * .1; say('โอ๊ะ หลุดมือ ลองใหม่นะ', 2200); Blip.miss(); }
      if(S.x <= CM.homeX){ S.state = 'release'; }
    } else if(S.state === 'release'){
      S.w = Math.min(CLAW.open, S.w + 1.2);
      if(S.held && S.w >= S.held.r + 10){ const p = S.held; S.held = null; p.vy = 2; p.vx = .3; }
      if(S.w >= CLAW.open){ S.w = S.target = CLAW.rest; S.state = 'idle'; renderCoins(); if(!plush.some(p => p.x < CM.chuteX && !p.won)) say(g.coins > 0 ? 'ใส่เหรียญเพื่อเล่นอีกครั้ง' : 'เหรียญวันนี้หมดแล้ว พรุ่งนี้มาใหม่นะ'); }
    }
    if(S.held){ S.held.x = S.x; S.held.y = holdY(S.held); S.held.a *= .9; S.held.va = 0; }
    physics();
    // prizes that reach the bottom of the chute
    for(const p of plush){
      if(!p.won && p.x < CM.chuteX && p.y > CM.H - p.r * 1.3 && p !== S.held){
        p.won = true; META.prizes[p.type] = (META.prizes[p.type] || 0) + 1; saveGame(); renderShelf(); Blip.win();
        say(LANG === 'en' ? `You caught a ${p.type}!` : `ได้${PLUSH[p.type].th}แล้ว เก่งมาก!`, 2600);
        const r = cv.getBoundingClientRect(); Trail.spawn(r.left + p.x / CM.W * r.width, r.top + p.y / CM.H * r.height, 30, true);
      }
      if(p.won) p.fade -= .02;
    }
    for(let i = plush.length - 1; i >= 0; i--) if(plush[i].fade <= 0) plush.splice(i, 1);
    if(plush.filter(p => !p.won).length < 11 && S.state === 'idle' && Math.random() < .02) addPlush(150 + Math.random() * 170, -30);
  }

  function draw(){
    const c = ctx; c.clearRect(0, 0, CM.W, CM.H);
    const bg = c.createLinearGradient(0, 0, 0, CM.H); bg.addColorStop(0, '#FFEFD9'); bg.addColorStop(1, '#FFD9C9'); c.fillStyle = bg; c.fillRect(0, 0, CM.W, CM.H);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(200, 0); c.lineTo(250, 0); c.lineTo(80, CM.H); c.lineTo(30, CM.H); c.fill();
    // chute
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(12, CM.chuteTop, CM.chuteX - 12, CM.H - CM.chuteTop);
    c.strokeStyle = '#F29AB5'; c.lineWidth = 3; c.beginPath(); c.moveTo(12, CM.chuteTop); c.lineTo(CM.chuteX, CM.chuteTop); c.lineTo(CM.chuteX, CM.H); c.stroke();
    c.fillStyle = '#E0708F'; c.font = '700 11px system-ui,sans-serif'; c.textAlign = 'center'; c.fillText('PRIZE', 55, CM.chuteTop + 18);
    c.beginPath(); c.moveTo(48, CM.chuteTop + 26); c.lineTo(62, CM.chuteTop + 26); c.lineTo(55, CM.chuteTop + 35); c.fill();
    // plush (back to front by y)
    [...plush].sort((a, b) => a.y - b.y).forEach(p => { c.save(); c.globalAlpha = Math.max(0, p.fade); c.translate(p.x, p.y); drawPlush(c, p.type, p.r, p.a); c.restore(); });
    // rail + carriage + claw
    const hy = hubY();
    c.fillStyle = '#AFC0F2'; c.strokeStyle = '#7F95D8'; c.lineWidth = 2;
    roundRect(c, 6, CM.railY - 5, CM.W - 12, 10, 5); c.fill(); c.stroke();
    roundRect(c, S.x - 20, CM.railY - 10, 40, 22, 6); c.fillStyle = '#D5DEFA'; c.fill(); c.stroke();
    c.strokeStyle = '#9CAEE8'; c.lineWidth = 5; c.beginPath(); c.moveTo(S.x, CM.railY + 12); c.lineTo(S.x, hy - 10); c.stroke();
    // arms: hinge at the hub, knee out at the side of the plush, tip curls in under it
    c.lineCap = 'round'; c.lineJoin = 'round';
    for(const s of [-1, 1]){
      const w = S.w, kx = S.x + s * w, ky = hy + Math.sqrt(Math.max(0, CLAW.len * CLAW.len - w * w)) * .78;
      const tx = kx - s * Math.max(4, w * .42), ty = ky + CLAW.tip;
      c.strokeStyle = '#6F86D2'; c.lineWidth = 7; c.beginPath(); c.moveTo(S.x + s * 5, hy); c.quadraticCurveTo(kx + s * 3, hy + 2, kx, ky); c.lineTo(tx, ty); c.stroke();
      c.strokeStyle = '#B7C6F6'; c.lineWidth = 3; c.beginPath(); c.moveTo(S.x + s * 5, hy); c.quadraticCurveTo(kx + s * 3, hy + 2, kx, ky); c.lineTo(tx, ty); c.stroke();
      c.fillStyle = '#FFC4D6'; c.beginPath(); c.arc(tx, ty, 3.2, 0, 7); c.fill();
    }
    c.fillStyle = '#8FA3E8'; roundRect(c, S.x - 15, hy - 14, 30, 16, 8); c.fill();
    c.fillStyle = '#FFC4D6'; c.beginPath(); c.arc(S.x, hy - 6, 5, 0, 7); c.fill();
  }
  function roundRect(c, x, y, w, hh, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  let raf = 0, lastMove = 0, lastT = performance.now(), acc = 0, waited = 0, onScreen = true;
  // pause the simulation while the machine is scrolled out of view
  if(window.IntersectionObserver) new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }).observe(cv);
  const loop = now => {
    if(!cv.isConnected){
      // the view is built before it is put on the page, so wait a little before giving up
      if(!wrap.dataset.live && waited++ < 120){ raf = requestAnimationFrame(loop); return; }
      cancelAnimationFrame(raf); removeEventListener('keydown', onKey); removeEventListener('keyup', onKeyUp); return;
    }
    wrap.dataset.live = '1';
    if(!onScreen && S.state === 'idle'){ lastT = now || performance.now(); raf = requestAnimationFrame(loop); return; }
    // fixed 60 steps per second, so the claw moves at the same speed on 60 Hz and 120 Hz screens
    acc += Math.min(100, (now || performance.now()) - lastT); lastT = now || performance.now();
    let n = 0; while(acc >= 16.67 && n < 5){ step(); acc -= 16.67; n++; }
    if(n === 5) acc = 0;
    draw();
    if(S.dir && S.state === 'ready' && performance.now() - lastMove > 120){ lastMove = performance.now(); Blip.move(); }
    $('.cm-knob', wrap).style.transform = `rotate(${S.dir * 18}deg)`;
    raf = requestAnimationFrame(loop);
  };

  /* ---- controls ---- */
  const insert = () => {
    if(S.state !== 'idle' || g.coins <= 0) return;
    g.coins--; saveGame(); Blip.coin(); S.state = 'ready'; renderCoins();
    say('เลื่อนที่คีบแล้วกดปุ่มแดง', 2400);
  };
  const drop = () => { if(S.state !== 'ready') return; S.state = 'down'; S.w = S.target = CLAW.open; S.dir = 0; Blip.drop(); msg.classList.remove('show'); };
  $('.cm-coin', wrap).onclick = insert;
  $('.cm-drop', wrap).onclick = drop;
  $$('.cm-dir', wrap).forEach(b => {
    const d = Number(b.dataset.d);
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); S.dir = d; });
    const stop = () => { if(S.dir === d) S.dir = 0; };
    b.addEventListener('pointerup', stop); b.addEventListener('pointercancel', stop); b.addEventListener('lostpointercapture', stop);
  });
  const onKey = e => {
    if(document.querySelector('.modal-back')) return;
    const a = document.activeElement;
    if(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    if(!globalKeys && !wrap.contains(a) && S.state !== 'ready') return;
    if(e.key === 'ArrowLeft'){ S.dir = -1; e.preventDefault(); }
    else if(e.key === 'ArrowRight'){ S.dir = 1; e.preventDefault(); }
    else if(e.key === ' ' || e.key === 'Enter'){ if(S.state === 'idle') insert(); else drop(); e.preventDefault(); }
  };
  const onKeyUp = e => { if((e.key === 'ArrowLeft' && S.dir === -1) || (e.key === 'ArrowRight' && S.dir === 1)) S.dir = 0; };
  addEventListener('keydown', onKey); addEventListener('keyup', onKeyUp);

  renderCoins(); renderShelf();
  say(g.coins > 0 ? 'กด 1 coin เพื่อเริ่มเล่น' : 'เหรียญวันนี้หมดแล้ว พรุ่งนี้มาใหม่นะ');
  raf = requestAnimationFrame(loop);
  return wrap;
}
