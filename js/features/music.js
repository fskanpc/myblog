/* =========================================================
   MUSIC
   ========================================================= */
const musicFields = [
  {key:'title', label:'ชื่อเพลง', type:'text', required:true},
  {key:'artist', label:'ศิลปิน', type:'text'},
  {key:'link', label:'ลิงก์ฟังเพลง', type:'url', placeholder:'https://open.spotify.com/… หรือ YouTube'},
  {key:'mood', label:'ฟังตอนไหน', type:'select', options:['ตอนเช้า','ตอนทำงาน','ตอนเศร้า','ตอนเดินทาง','ก่อนนอน','ฮึกเหิม']},
  {key:'vinyl', label:'สีแผ่นเสียง', type:'select', options:[['black','ดำคลาสสิก'], ['pink','ชมพู'], ['lilac','ม่วงลาเวนเดอร์'], ['mint','มิ้นท์'], ['butter','เหลืองเนย']], default:'black'},
  {key:'cover', label:'ปกอัลบั้ม', type:'image', max:500, budget:80000},
  {key:'why', label:'ทำไมถึงชอบ', type:'textarea', rows:3}
];
const Music = crud('music', musicFields, 'เพลง', 'song');
const VINYL_COLORS = {black:['#221C33','#2E2645'], pink:['#F7A1BD','#FBC0D3'], lilac:['#B79BF2','#CDB9F7'], mint:['#7FD2B9','#A4E3CF'], butter:['#F3CF6A','#F8DF94']};
let nowPlaying = null;
let scratchSound = ls('bubble:scratch') !== 'off';

/* ---- scratch sound: short bursts of filtered noise whose pitch follows the hand ---- */
const Scratch = (() => {
  let ac, noise, lastGrain = 0;
  function ctx(){
    if(!ac){
      const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return null;
      ac = new AC();
      noise = ac.createBuffer(1, ac.sampleRate * .5, ac.sampleRate);
      const d = noise.getChannelData(0); for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if(ac.state === 'suspended') ac.resume();
    return ac;
  }
  function grain(f1, f2, dur = .07, vol = .22, when = 0){
    if(!scratchSound) return;
    const a = ctx(); if(!a) return;
    const t = a.currentTime + when;
    const src = a.createBufferSource(); src.buffer = noise;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 4;
    bp.frequency.setValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(Math.max(60, f2), t + dur);
    const g = a.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .25); g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp).connect(g).connect(a.destination);
    src.start(t, Math.random() * .3, dur + .02);
  }
  return {
    wiki(){ [[380, 1500], [1500, 300], [420, 1700], [1600, 350], [500, 1300], [1200, 400]].forEach(([a, b], i) => grain(a, b, .075, .22 - i * .025, i * .12)); },
    drag(speed){ const now = performance.now(); if(now - lastGrain < 38) return; lastGrain = now; const f = 250 + Math.min(40, Math.abs(speed)) * 45; grain(speed > 0 ? f * .6 : f * 1.3, speed > 0 ? f * 1.3 : f * .6, .045, Math.min(.25, .05 + Math.abs(speed) * .012)); }
  };
})();

/* ---- turntable physics: idle spin, click-to-scratch wobble, drag-to-scratch ---- */
const Decks = (() => {
  let list = [], running = false;
  function tick(now){
    list = list.filter(v => v.el.isConnected);
    for(const v of list){
      if(!v.drag) v.angle += v.base;
      let off = 0;
      if(v.scr){
        const t = (now - v.scr) / 1000;
        if(t > 1.05) v.scr = 0; else off = 78 * Math.sin(2 * Math.PI * 3.4 * t) * Math.exp(-t / .42);
      }
      v.disc.style.transform = `rotate(${(v.angle + off).toFixed(2)}deg)`;
    }
    if(list.length) requestAnimationFrame(tick); else running = false;
  }
  function fx(v){
    const art = v.el.closest('.m-art'); if(!art) return;
    const words = ['wikka!', 'scratch!', 'zigga!', 'wub wub'];
    const f = h(`<span class="scratch-fx" style="left:${70 + Math.random() * 20}%;top:${-4 + Math.random() * 10}%">${words[(Math.random() * words.length) | 0]}</span>`);
    art.append(f); setTimeout(() => f.remove(), 850);
  }
  function add(el, base){
    const v = {el, disc:$('.m-disc', el), angle:Math.random() * 360, base: REDUCED ? 0 : base, scr:0, drag:false};
    list.push(v);
    let last = null, moved = 0, prevT = 0;
    const center = () => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const ang = e => { const [cx, cy] = center(); return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI; };
    el.addEventListener('pointerdown', e => {
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      v.drag = true; v.scr = 0; last = ang(e); moved = 0; prevT = performance.now();
    });
    el.addEventListener('pointermove', e => {
      if(!v.drag) return;
      const a = ang(e); let d = a - last; if(d > 180) d -= 360; if(d < -180) d += 360;
      last = a; moved += Math.abs(d); v.angle += d;
      const now = performance.now(), sp = d / Math.max(1, now - prevT) * 16; prevT = now;
      if(Math.abs(d) > .6) Scratch.drag(sp);
    });
    const up = () => {
      if(!v.drag) return; v.drag = false;
      if(moved < 6){ v.scr = performance.now(); Scratch.wiki(); fx(v); const r = el.getBoundingClientRect(); Trail.spawn(r.left + r.width / 2, r.top + r.height / 2, 10, true); }
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); v.scr = performance.now(); Scratch.wiki(); fx(v); } });
    if(!running){ running = true; requestAnimationFrame(tick); }
  }
  return {add};
})();

function musicArt(s, sleeveLabel){
  const cols = [['#FF9DBE','#FFD66B'], ['#7FD8BE','#9DB4FF'], ['#B79BFF','#FF9DBE'], ['#FFB48A','#FF7FA8'], ['#9FD2FF','#C9A8FF']];
  const [c1, c2] = cols[hash(s.id) % cols.length];
  const [vc, vc2] = VINYL_COLORS[s.vinyl] || VINYL_COLORS.black;
  return h(`<div class="m-art" style="--c1:${c1};--c2:${c2}">
    <div class="m-vinyl" style="--vc:${vc};--vc2:${vc2}" tabindex="0" role="button" aria-label="สแครชแผ่นเสียง ${esc(s.title)}">
      <div class="m-disc"><span class="mark"></span><span class="lbl">${s.cover ? `<img src="${s.cover}" alt="" draggable="false">` : ''}</span></div>
    </div>
    <button class="m-sleeve" aria-label="${esc(sleeveLabel)}">${s.cover ? `<img src="${s.cover}" alt="" draggable="false">` : `<span class="noart">${ic('music')}<span>${esc(s.title)}</span></span>`}</button>
  </div>`);
}

VIEWS.music = async el => {
  const items = [...await Store.list('music')].sort((a, b) => b.createdAt - a.createdAt);
  el.append(pageHead('เพลงโปรด', 'แตะหรือลากแผ่นเสียงเพื่อสแครชแบบดีเจ', 'เพิ่มเพลง', () => Music.add()));
  if(!items.length) return el.append(emptyState('music', 'ยังไม่มีเพลงในกล่อง เพิ่มเพลงที่ฟังวนซ้ำได้เลย', 'เพิ่มเพลง', () => Music.add()));
  const cur = items.find(i => i.id === nowPlaying) || items[0];

  const player = h(`<section class="m-player glass"><div class="art-slot"></div>
    <div><p class="muted" style="margin:0;font-size:14px">กำลังเล่น${cur.mood ? ' — ' + escT(cur.mood) : ''}</p><h2>${esc(cur.title)}</h2><p class="artist">${esc(cur.artist || '')}</p>
      ${cur.why ? `<p class="why">${esc(cur.why)}</p>` : ''}<div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="acts"></div><p class="hint">ลากแผ่นเสียงไปมาเพื่อสแครช หรือแตะเพื่อให้มันสแครชเอง</p></div>
  </section>`);
  const bigArt = musicArt(cur, 'ปกอัลบั้ม ' + cur.title);
  $('.art-slot', player).replaceWith(bigArt);
  $('.m-sleeve', bigArt).onclick = () => { if(cur.link && /^https?:\/\//.test(cur.link)) window.open(cur.link, '_blank', 'noopener'); };
  const acts = $('.acts', player);
  if(cur.link && /^https?:\/\//.test(cur.link)) acts.append(h(`<a class="btn" href="${escT(cur.link)}" target="_blank" rel="noopener">${ic('link')}<span>เปิดฟัง</span></a>`));
  acts.append(btn('แก้ไข', 'soft', () => Music.edit(cur), 'edit'));
  const snd = btn(scratchSound ? 'เสียงสแครช: เปิดอยู่' : 'เสียงสแครช: ปิดอยู่', 'soft', () => { scratchSound = !scratchSound; ls('bubble:scratch', scratchSound ? 'on' : 'off'); $('span', snd).textContent = scratchSound ? 'เสียงสแครช: เปิดอยู่' : 'เสียงสแครช: ปิดอยู่'; });
  acts.append(snd);
  el.append(player);
  Decks.add($('.m-vinyl', bigArt), 1.6);

  const grid = h('<div class="m-grid"></div>');
  items.forEach(s => {
    const card = h(`<article class="m-card glass ${s.id === cur.id ? 'on' : ''}"><button class="icon-btn m-edit" aria-label="แก้ไข ${esc(s.title)}">${ic('edit')}</button></article>`);
    const art = musicArt(s, 'เล่นเพลง ' + s.title);
    card.append(art, h(`<div><h3>${esc(s.title)}</h3><p>${esc(s.artist || '')}</p>${s.id === cur.id ? '<div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' : ''}</div>`));
    $('.m-sleeve', art).onclick = () => { nowPlaying = s.id; rerender(); };
    $('.m-edit', card).onclick = () => Music.edit(s);
    Decks.add($('.m-vinyl', art), s.id === cur.id ? 1.2 : 0);
    grid.append(card);
  });
  el.append(grid);
};
