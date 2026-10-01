/* =========================================================
   GAME: claw machine (ตู้คีบตุ๊กตา) — free play, just for fun
   machine and plushies follow the owner's own "Lucky Catch" design
   ========================================================= */
const PLUSH = {
  pigbun:  {th:'กระต่ายหมู', w:4},
  bear:    {th:'หมีน้ำตาล', w:3},
  puppy:   {th:'ลูกหมาโบชมพู', w:2, bow:'#F7B6C8', bowLine:'#E58AA4'},
  puppyRed:{th:'ลูกหมาโบแดง', w:1, bow:'#F2716F', bowLine:'#D14E50'},
  mini:    {th:'หมีเหลืองจิ๋ว', w:1}
};
const PLUSH_BAG = Object.entries(PLUSH).flatMap(([k, v]) => Array(v.w).fill(k));
const CM = {W:380, H:410, railY:20, chuteX:100, chuteTop:292, homeX:56};
/* claw arms: w = how far each arm reaches out sideways */
const CLAW = {len:54, tip:18, open:52, rest:26, shut:8};

/* soft shapes: stroke every part first, then fill them all, so only the outer outline shows */
function puff(c, parts, fill, line, lw){
  c.lineJoin = 'round'; c.lineWidth = lw * 2; c.strokeStyle = line;
  for(const p of parts){ c.beginPath(); p(); c.stroke(); }
  c.fillStyle = fill;
  for(const p of parts){ c.beginPath(); p(); c.fill(); }
}
const ell = (c, x, y, rx, ry, a = 0) => () => c.ellipse(x, y, rx, ry, a, 0, Math.PI * 2);
function dotEyes(c, r, y, col, size = .06){ c.fillStyle = col; for(const s of [-1, 1]){ c.beginPath(); c.ellipse(s * r * .3, y, r * size, r * size * 1.15, 0, 0, 7); c.fill(); } }
function blush(c, r, y, col, a = .5, sx = .55){ c.save(); c.globalAlpha = a; c.fillStyle = col; for(const s of [-1, 1]){ c.beginPath(); c.ellipse(s * r * sx, y, r * .17, r * .1, 0, 0, 7); c.fill(); } c.restore(); }
function bow(c, x, y, s, col, line){
  c.save(); c.translate(x, y); c.rotate(-.35);
  puff(c, [() => { c.moveTo(0, 0); c.bezierCurveTo(-s * .9, -s * .9, -s * 1.3, s * .5, 0, 0); }, () => { c.moveTo(0, 0); c.bezierCurveTo(s * .9, -s * .9, s * 1.3, s * .5, 0, 0); }, ell(c, 0, 0, s * .26, s * .22)], col, line, 1.4);
  c.restore();
}

function drawPlush(c, type, r){
  c.save();
  if(type === 'pigbun'){
    const g = c.createRadialGradient(-r * .3, -r * .4, r * .1, 0, 0, r * 1.2); g.addColorStop(0, '#FFEDEB'); g.addColorStop(1, '#F9C4C4');
    puff(c, [ell(c, -r * .52, -r * .78, r * .3, r * .42, -.25), ell(c, -r * .36, -r * .98, r * .22, r * .22), ell(c, r * .52, -r * .78, r * .3, r * .42, .25), ell(c, r * .36, -r * .98, r * .22, r * .22),
      ell(c, 0, 0, r * 1.08, r * .84), ell(c, -r * .7, -r * .3, r * .38, r * .36), ell(c, r * .7, -r * .3, r * .38, r * .36)], g, '#E8A1A4', 1.6);
    dotEyes(c, r, -r * .02, '#6984DE');
    c.fillStyle = '#F5ADAE'; c.beginPath(); c.ellipse(0, r * .22, r * .2, r * .13, 0, 0, 7); c.fill();
    c.fillStyle = '#D9878B'; for(const s of [-1, 1]){ c.beginPath(); c.ellipse(s * r * .07, r * .22, r * .035, r * .05, 0, 0, 7); c.fill(); }
    blush(c, r, r * .2, '#F59A9C', .45, .62);
  } else if(type === 'bear' || type === 'mini'){
    const mini = type === 'mini';
    const [top, bot, line, inner] = mini ? ['#FFF1A6', '#FFDA6A', '#E0B444', '#FFE9A0'] : ['#DDB084', '#BB8A5D', '#93633F', '#EBC9A0'];
    const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, top); g.addColorStop(1, bot);
    puff(c, [ell(c, -r * .68, -r * .62, r * .3, r * .3), ell(c, r * .68, -r * .62, r * .3, r * .3), ell(c, 0, 0, r * 1.02, r * .86)], g, line, mini ? 1.3 : 1.7);
    c.fillStyle = inner; for(const s of [-1, 1]){ c.beginPath(); c.arc(s * r * .68, -r * .62, r * .15, 0, 7); c.fill(); }
    c.fillStyle = mini ? '#FFF6CC' : '#EACAA2'; c.beginPath(); c.ellipse(0, r * .3, r * .32, r * .23, 0, 0, 7); c.fill();
    dotEyes(c, r, -r * .06, '#4A3226', .065);
    // happy open smile
    c.fillStyle = '#5B3424'; c.beginPath(); c.moveTo(-r * .17, r * .22); c.quadraticCurveTo(0, r * .52, r * .17, r * .22); c.closePath(); c.fill();
    c.fillStyle = '#F08C8C'; c.beginPath(); c.ellipse(0, r * .37, r * .08, r * .05, 0, 0, 7); c.fill();
    blush(c, r, r * .22, '#F2765E', mini ? .35 : .5, .6);
  } else {
    const p = PLUSH[type];
    const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FBEFF2');
    puff(c, [ell(c, -r * .92, r * .08, r * .3, r * .52, .45), ell(c, r * .92, r * .08, r * .3, r * .52, -.45), ell(c, 0, 0, r * 1.05, r * .8), ell(c, -r * .35, -r * .55, r * .5, r * .32), ell(c, r * .35, -r * .55, r * .5, r * .32)], g, '#8DA6EA', 1.6);
    // three little hair strokes
    c.strokeStyle = '#8DA6EA'; c.lineWidth = Math.max(1.2, r * .045); c.lineCap = 'round';
    for(const k of [-1, 0, 1]){ c.beginPath(); c.moveTo(k * r * .1 - r * .02, -r * .48); c.lineTo(k * r * .1 + r * .02, -r * .36); c.stroke(); }
    dotEyes(c, r, r * .02, '#5F7FDC');
    c.fillStyle = '#F2706F'; c.beginPath(); c.arc(0, r * .16, r * .045, 0, 7); c.fill();
    blush(c, r, r * .2, '#F7A8B4', .5, .55);
    bow(c, -r * .72, -r * .42, r * .42, p.bow, p.bowLine);
  }
  c.restore();
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

VIEWS.game = async el => {
  el.append(pageHead('เกมคีบตุ๊กตา', 'คีบเล่นได้ไม่จำกัด เลื่อนคันโยกแล้วกดปุ่มแดง'));
  el.append(clawMachine({globalKeys:true}));
};

/* the machine on its own, so the home page can show it too.
   globalKeys: arrow keys and Space work anywhere on the page (game page only);
   otherwise they only work while the machine has focus or the claw is moving */
function clawMachine({globalKeys = false} = {}){
  const wrap = h(`<div class="cm-wrap">
    <div class="claw-machine" tabindex="0" aria-label="ตู้คีบตุ๊กตา">
      <div class="cm-body">
        <div class="cm-sign"><span>LUCKY CATCH</span></div>
        <div class="cm-window">
          <canvas aria-label="ตู้คีบตุ๊กตา" role="img"></canvas>
          <div class="cm-glass" aria-hidden="true"></div>
          <div class="cm-msg" role="status" aria-live="polite"></div>
        </div>
        <div class="cm-panel">
          <div class="cm-slots" aria-hidden="true">
            <span class="slot"><i></i></span><span class="slot tilt"><i></i></span>
            <span class="cm-coin"><b>1</b><small>coin</small></span>
          </div>
          <div class="cm-stick" role="group" aria-label="คันโยก">
            <span class="cm-knob" aria-hidden="true"><i></i></span>
            <button class="cm-dir l" data-d="-1" aria-label="เลื่อนซ้าย"></button>
            <button class="cm-dir r" data-d="1" aria-label="เลื่อนขวา"></button>
          </div>
          <button class="cm-drop" aria-label="กดคีบ"><span></span></button>
        </div>
      </div>
    </div>
    <p class="cm-help muted">กดค้างที่คันโยกด้านซ้ายหรือขวาเพื่อเลื่อน แล้วกดปุ่มแดงเพื่อคีบ ใช้คีย์บอร์ดได้ด้วย ← → และ Space</p>
  </div>`);

  const cv = $('canvas', wrap), ctx = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = CM.W * dpr; cv.height = CM.H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const msg = $('.cm-msg', wrap);
  const say = (t, ms) => { msg.textContent = T(t); msg.classList.add('show'); clearTimeout(say.t); if(ms) say.t = setTimeout(() => msg.classList.remove('show'), ms); };

  /* ---- world ---- */
  const S = {state:'ready', x:CM.homeX, rope:30, w:CLAW.rest, target:CLAW.rest, held:null, dir:0, slipAt:0, pop:0};
  const hubY = () => CM.railY + 22 + S.rope;              // bottom of the claw's hub; arms hinge here
  const holdY = p => hubY() + p.r * .88;                   // plush centre when it hangs inside the claw
  const plush = [];
  const addPlush = (x, y) => {
    const type = PLUSH_BAG[(Math.random() * PLUSH_BAG.length) | 0];
    plush.push({type, x, y, vx:0, vy:0, r:type === 'mini' ? 23 + Math.random() * 3 : 37 + Math.random() * 6, won:false, fade:1});
  };
  for(let i = 0; i < 12; i++) addPlush(140 + Math.random() * 210, 130 + Math.random() * 250);
  for(let k = 0; k < 260; k++) physics();

  function physics(){
    for(const p of plush){
      if(p === S.held) continue;
      p.vy += .45; p.vx *= .985; p.vy *= .995; p.x += p.vx; p.y += p.vy;
      const floor = CM.H - p.r * .82;
      if(p.y > floor){ p.y = floor; p.vy *= -.15; p.vx *= .8; }
      if(p.x < 12 + p.r){ p.x = 12 + p.r; p.vx *= -.3; }
      if(p.x > CM.W - 12 - p.r){ p.x = CM.W - 12 - p.r; p.vx *= -.3; }
      // an invisible glass wall keeps the pile out of the chute; only plushies the claw lets go of can fall in
      if(!p.dropped && p.x - p.r < CM.chuteX + 4){ p.x = CM.chuteX + 4 + p.r; p.vx = Math.abs(p.vx) * .3; }
      if(p.y + p.r * .5 > CM.chuteTop){
        if(p.x < CM.chuteX){ if(p.x > CM.chuteX - 4 - p.r) { p.x = CM.chuteX - 4 - p.r; p.vx *= -.3; } }
        else if(p.x < CM.chuteX + 4 + p.r){ p.x = CM.chuteX + 4 + p.r; p.vx = Math.abs(p.vx) * .3; }
      }
    }
    for(let it = 0; it < 3; it++) for(let i = 0; i < plush.length; i++) for(let j = i + 1; j < plush.length; j++){
      const a = plush[i], b = plush[j]; if(a === S.held || b === S.held) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = (a.r + b.r) * .8;
      if(d < min){
        const push = (min - d) / 2, nx = dx / d, ny = dy / d;
        a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if(rv < 0){ const imp = -rv * .6; a.vx -= nx * imp / 2; a.vy -= ny * imp / 2; b.vx += nx * imp / 2; b.vy += ny * imp / 2; }
      }
    }
  }

  function step(){
    if(S.state === 'ready' && S.dir){ S.x = Math.max(CM.homeX, Math.min(CM.W - 40, S.x + S.dir * 2.4)); }
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
        if(S.grab){ S.held = S.grab; S.held.vx = S.held.vy = 0; S.pop = 50; S.slipAt = Math.random() < .2 ? CM.homeX + 30 + Math.random() * Math.max(10, S.x - CM.homeX - 40) : -1; }
        S.grab = null; S.state = 'up';
      }
    } else if(S.state === 'up'){
      S.rope = Math.max(30, S.rope - 2.6);
      if(S.rope <= 30){ S.state = 'carry'; if(!S.held){ say('พลาดไปนิดเดียว ลองใหม่นะ', 2200); Blip.miss(); } }
    } else if(S.state === 'carry'){
      S.x = Math.max(CM.homeX, S.x - 2.2);
      if(S.held && S.slipAt > 0 && S.x <= S.slipAt){ const p = S.held; S.held = null; S.w = S.target = CLAW.rest; p.vy = 1; p.dropped = p.x < CM.chuteX + p.r; say('โอ๊ะ หลุดมือ ลองใหม่นะ', 2200); Blip.miss(); }
      if(S.x <= CM.homeX){ S.state = 'release'; }
    } else if(S.state === 'release'){
      S.w = Math.min(CLAW.open, S.w + 1.2);
      // let go once the arms have opened a little past the plush (big ones included)
      if(S.held && S.w >= Math.min(S.held.r + 6, CLAW.open - 2)){ const p = S.held; S.held = null; p.vy = 2; p.vx = .3; p.dropped = true; }
      if(S.w >= CLAW.open){ if(S.held){ S.held.vy = 2; S.held.dropped = true; S.held = null; } S.w = S.target = CLAW.rest; S.state = 'ready'; }
    }
    if(S.pop) S.pop--;
    if(S.held){ S.held.x = S.x; S.held.y = holdY(S.held); }
    physics();
    // prizes that reach the bottom of the chute: celebrate, then the machine refills itself
    for(const p of plush){
      if(!p.won && p.x < CM.chuteX && p.y > CM.H - p.r * 1.3 && p !== S.held){
        p.won = true; Blip.win();
        say(LANG === 'en' ? 'You caught one! 🎉' : `ได้${PLUSH[p.type].th}แล้ว เก่งมาก!`, 2600);
        const r = cv.getBoundingClientRect(); Trail.spawn(r.left + p.x / CM.W * r.width, r.top + p.y / CM.H * r.height, 30, true);
      }
      if(p.won) p.fade -= .02;
    }
    for(let i = plush.length - 1; i >= 0; i--) if(plush[i].fade <= 0) plush.splice(i, 1);
    if(plush.filter(p => !p.won).length < 10 && S.state === 'ready' && Math.random() < .02) addPlush(160 + Math.random() * 180, -30);
  }

  function draw(){
    const c = ctx; c.clearRect(0, 0, CM.W, CM.H);
    const bg = c.createLinearGradient(0, 0, 0, CM.H); bg.addColorStop(0, '#FFEEDC'); bg.addColorStop(1, '#FFD4C2'); c.fillStyle = bg; c.fillRect(0, 0, CM.W, CM.H);
    // soft light streaks on the back glass
    c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.moveTo(250, 0); c.lineTo(300, 0); c.lineTo(110, CM.H); c.lineTo(60, CM.H); c.fill();
    c.fillStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.moveTo(320, 0); c.lineTo(338, 0); c.lineTo(150, CM.H); c.lineTo(132, CM.H); c.fill();
    // prize chute
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(12, CM.chuteTop, CM.chuteX - 12, CM.H - CM.chuteTop);
    c.strokeStyle = '#F29AB5'; c.lineWidth = 3; c.beginPath(); c.moveTo(12, CM.chuteTop); c.lineTo(CM.chuteX, CM.chuteTop); c.lineTo(CM.chuteX, CM.H); c.stroke();
    c.fillStyle = '#E0708F'; c.font = '700 11px system-ui,sans-serif'; c.textAlign = 'center'; c.fillText('PRIZE', (12 + CM.chuteX) / 2, CM.chuteTop + 18);
    c.beginPath(); c.moveTo(49, CM.chuteTop + 26); c.lineTo(63, CM.chuteTop + 26); c.lineTo(56, CM.chuteTop + 35); c.fill();
    // plush (back to front)
    [...plush].sort((a, b) => a.y - b.y).forEach(p => { c.save(); c.globalAlpha = Math.max(0, p.fade); c.translate(p.x, p.y); drawPlush(c, p.type, p.r); c.restore(); });
    // rail with its end bracket, carriage, rod and claw
    const hy = hubY();
    c.fillStyle = '#B9C8F4'; c.strokeStyle = '#8AA0E2'; c.lineWidth = 2;
    roundRect(c, -6, CM.railY - 6, CM.W + 12, 12, 6); c.fill(); c.stroke();
    roundRect(c, CM.W - 30, CM.railY - 12, 26, 70, 6); c.fillStyle = 'rgba(205,216,248,.75)'; c.fill(); c.stroke();
    roundRect(c, S.x - 24, CM.railY - 12, 48, 26, 7); c.fillStyle = '#D3DDFA'; c.fill(); c.stroke();
    c.fillStyle = '#B9C8F4'; roundRect(c, S.x - 4, CM.railY + 12, 8, hy - CM.railY - 22, 4); c.fill(); c.stroke();
    c.lineCap = 'round'; c.lineJoin = 'round';
    for(const s of [-1, 1]){
      const w = S.w, kx = S.x + s * w, ky = hy + Math.sqrt(Math.max(0, CLAW.len * CLAW.len - w * w)) * .78;
      const tx = kx - s * Math.max(4, w * .42), ty = ky + CLAW.tip;
      c.strokeStyle = '#7F95DE'; c.lineWidth = 8; c.beginPath(); c.moveTo(S.x + s * 5, hy); c.quadraticCurveTo(kx + s * 3, hy + 2, kx, ky); c.lineTo(tx, ty); c.stroke();
      c.strokeStyle = '#C3D0F7'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(S.x + s * 5, hy); c.quadraticCurveTo(kx + s * 3, hy + 2, kx, ky); c.lineTo(tx, ty); c.stroke();
    }
    c.fillStyle = '#9DB1EE'; c.strokeStyle = '#7F95DE'; c.beginPath(); c.arc(S.x, hy - 6, 10, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#FFE6A6'; c.beginPath(); c.ellipse(S.x, hy - 6, 10, 3.5, 0, 0, 7); c.fill();
    c.fillStyle = '#F7B6C8'; c.beginPath(); c.arc(S.x, hy + 4, 5, 0, 7); c.fill();
    // "got it!" marks
    if(S.pop && S.held){
      const p = S.held, a = Math.min(1, S.pop / 15);
      c.save(); c.globalAlpha = a; c.strokeStyle = '#F2768F'; c.lineWidth = 5;
      for(const [dx, dy, l, ang] of [[-1.2, -.6, 16, -2.6], [-1.05, -1.05, 18, -2.2], [-.6, -1.3, 16, -1.8]]){
        const x = p.x + dx * p.r, y = p.y + dy * p.r; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ang) * l, y + Math.sin(ang) * l); c.stroke();
      }
      c.restore();
    }
  }
  function roundRect(c, x, y, w, hh, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  let raf = 0, lastMove = 0, lastT = performance.now(), acc = 0, waited = 0, onScreen = true;
  // pause the simulation while the machine is scrolled out of view
  if(window.IntersectionObserver) new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }).observe(cv);
  const knob = $('.cm-knob', wrap);
  const loop = now => {
    if(!cv.isConnected){
      // the view is built before it is put on the page, so wait a little before giving up
      if(!wrap.dataset.live && waited++ < 120){ raf = requestAnimationFrame(loop); return; }
      cancelAnimationFrame(raf); removeEventListener('keydown', onKey); removeEventListener('keyup', onKeyUp); return;
    }
    wrap.dataset.live = '1';
    if(!onScreen && S.state === 'ready'){ lastT = now || performance.now(); raf = requestAnimationFrame(loop); return; }
    // fixed 60 steps per second, so the claw moves at the same speed on 60 Hz and 120 Hz screens
    acc += Math.min(100, (now || performance.now()) - lastT); lastT = now || performance.now();
    let n = 0; while(acc >= 16.67 && n < 5){ step(); acc -= 16.67; n++; }
    if(n === 5) acc = 0;
    draw();
    if(S.dir && S.state === 'ready' && performance.now() - lastMove > 120){ lastMove = performance.now(); Blip.move(); }
    knob.style.transform = `rotate(${S.dir * 20}deg)`;
    raf = requestAnimationFrame(loop);
  };

  /* ---- controls: hold either side of the joystick, red button grabs ---- */
  const drop = () => { if(S.state !== 'ready') return; S.state = 'down'; S.dir = 0; S.w = S.target = CLAW.open; Blip.drop(); msg.classList.remove('show'); };
  $('.cm-drop', wrap).onclick = drop;
  $$('.cm-dir', wrap).forEach(b => {
    const d = Number(b.dataset.d);
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); S.dir = d; });
    const stop = () => { if(S.dir === d) S.dir = 0; };
    b.addEventListener('pointerup', stop); b.addEventListener('pointercancel', stop); b.addEventListener('lostpointercapture', stop);
    b.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); S.dir = d; } });
    b.addEventListener('keyup', stop);
  });
  const onKey = e => {
    if(document.querySelector('.modal-back')) return;
    const a = document.activeElement;
    if(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    if(!globalKeys && !wrap.contains(a)) return;
    if(a && a.classList.contains('cm-dir')) return;
    if(e.key === 'ArrowLeft'){ S.dir = -1; e.preventDefault(); }
    else if(e.key === 'ArrowRight'){ S.dir = 1; e.preventDefault(); }
    else if(e.key === ' ' || e.key === 'Enter'){ if(a && a.classList.contains('cm-drop') && e.key === 'Enter') return; drop(); e.preventDefault(); }
  };
  const onKeyUp = e => { if((e.key === 'ArrowLeft' && S.dir === -1) || (e.key === 'ArrowRight' && S.dir === 1)) S.dir = 0; };
  addEventListener('keydown', onKey); addEventListener('keyup', onKeyUp);

  say('เลื่อนคันโยกแล้วกดปุ่มแดงเพื่อคีบ', 3200);
  raf = requestAnimationFrame(loop);
  return wrap;
}

Object.assign(DICT, {
  'คีบเล่นได้ไม่จำกัด เลื่อนคันโยกแล้วกดปุ่มแดง':'Play as much as you like: move the joystick, then press the red button',
  'เลื่อนคันโยกแล้วกดปุ่มแดงเพื่อคีบ':'Move the joystick, then press the red button',
  'กดค้างที่คันโยกด้านซ้ายหรือขวาเพื่อเลื่อน แล้วกดปุ่มแดงเพื่อคีบ ใช้คีย์บอร์ดได้ด้วย ← → และ Space':'Hold the left or right side of the joystick to move, then press the red button to grab. Keyboard works too: ← → and Space',
  'คันโยก':'Joystick'
});
