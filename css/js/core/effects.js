/* =========================================================
   pointer: sparkle trail + glass shine + parallax
   ========================================================= */
const Trail = (() => {
  const cv = $('#trail'), ctx = cv.getContext('2d');
  let W, H, dpr = Math.min(2, devicePixelRatio || 1), parts = [], last = {x:0, y:0}, running = false;
  const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  const colors = () => document.body.dataset.route === 'tarot' ? ['#FFE9A8','#E8C872','#C9B2FF','#FFFFFF'] : ['#FF8FB5','#9DB4FF','#FFD66B','#8FDCC4','#C9A8FF'];
  function spawn(x, y, n, burst){
    const cs = colors();
    for(let i = 0; i < n; i++){
      const a = Math.random() * Math.PI * 2, sp = burst ? 1.5 + Math.random() * 3.5 : Math.random() * .6;
      parts.push({x, y, vx:Math.cos(a) * sp, vy:Math.sin(a) * sp - (burst ? 1 : .2), life:1, decay:.012 + Math.random() * .02, size:(burst ? 5 : 3) + Math.random() * 5, rot:Math.random() * 6, vr:(Math.random() - .5) * .2, c:cs[(Math.random() * cs.length) | 0], shape:['star','heart','dot','star'][(Math.random() * 4) | 0]});
    }
    if(parts.length > 260) parts.splice(0, parts.length - 260);
    if(!running){ running = true; requestAnimationFrame(tick); }
  }
  function star(s){ ctx.beginPath(); for(let i = 0; i < 8; i++){ const r = i % 2 ? s * .32 : s; const a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
  function heart(s){ s *= .9; ctx.beginPath(); ctx.moveTo(0, s * .35); ctx.bezierCurveTo(-s, -s * .3, -s * .45, -s, 0, -s * .45); ctx.bezierCurveTo(s * .45, -s, s, -s * .3, 0, s * .35); ctx.fill(); }
  function tick(){
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter(p => p.life > 0);
    for(const p of parts){
      p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .98; p.rot += p.vr; p.life -= p.decay;
      ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      const s = p.size * (.5 + p.life * .5);
      if(p.shape === 'star') star(s); else if(p.shape === 'heart') heart(s); else { ctx.beginPath(); ctx.arc(0, 0, s * .35, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    if(parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  if(!REDUCED){
    addEventListener('pointermove', e => {
      if(e.pointerType === 'touch') return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      if(dx * dx + dy * dy > 180){ spawn(e.clientX, e.clientY, 1 + ((Math.random() * 2) | 0)); last = {x:e.clientX, y:e.clientY}; }
    }, {passive:true});
    addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 14, true), {passive:true});
  }
  return {spawn};
})();

let shineEl = null;
addEventListener('pointermove', e => {
  const g = e.target.closest && e.target.closest('.glass.shine');
  if(g){ const r = g.getBoundingClientRect(); g.style.setProperty('--mx', (e.clientX - r.left) + 'px'); g.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
  shineEl = g;
  if(!REDUCED){
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    $$('.blob').forEach((b, i) => b.style.translate = `${nx * (i + 1) * 14}px ${ny * (i + 1) * 14}px`);
    $$('.sticker').forEach(s => { const d = Number(s.dataset.depth || 1); s.style.transform = `translate(${nx * d * -40}px, ${ny * d * -40}px)`; });
  }
}, {passive:true});

(function makeStars(){ const layer = $('#stars'); for(let i = 0; i < 90; i++){ const s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 100 + '%'; s.style.animationDelay = (-Math.random() * 3) + 's'; const z = Math.random() < .15 ? 3 : 2; s.style.width = s.style.height = z + 'px'; layer.append(s); } })();
