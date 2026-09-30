/* =========================================================
   Train scene for the home banner (original artwork, drawn as SVG)
   a snowy peak, a little red train climbing along the hillside,
   and a meadow of lupins in front. 1200x600, "cover"-fitted (slice).
   Weather and day/night are switched with data-wx / data-day in CSS.
   ========================================================= */
function trainScene(){
  const R = (() => { let s = 20260930; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; })();
  const W = 1200, H = 600;
  // track: a straight, level line across the meadow
  const T0 = {x:-60, y:448}, ANG = 0, rad = ANG * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
  const onTrack = s => ({x:T0.x + s * cos, y:T0.y + s * sin});
  const trackY = x => T0.y + (x - T0.x) * Math.tan(rad);

  // ---------- stars ----------
  let stars = '';
  for(let i = 0; i < 70; i++){
    const x = R() * W, y = R() * 260, r = .8 + R() * 1.6;
    stars += `<circle class="tw" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" style="animation-delay:${(-R() * 4).toFixed(2)}s;animation-duration:${(2 + R() * 3).toFixed(1)}s"/>`;
  }
  for(let i = 0; i < 6; i++){
    const x = 60 + R() * 1080, y = 20 + R() * 200, s = 5 + R() * 5;
    stars += `<path class="tw sp" transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" d="M0 ${-s}L${s * .22} ${-s * .22}L${s} 0L${s * .22} ${s * .22}L0 ${s}L${-s * .22} ${s * .22}L${-s} 0L${-s * .22} ${-s * .22}Z" style="animation-delay:${(-R() * 4).toFixed(2)}s"/>`;
  }

  // ---------- clouds ----------
  const cloud = s => `<g transform="scale(${s})"><ellipse cx="0" cy="0" rx="92" ry="22"/><circle cx="-46" cy="-14" r="28"/><circle cx="-4" cy="-32" r="38"/><circle cx="40" cy="-18" r="29"/><circle cx="70" cy="-4" r="18"/></g>`;
  const clouds = [[150, 90, .95, 140], [560, 60, .7, 180], [980, 130, .85, 160], [380, 170, .5, 210], [1120, 50, .55, 200]].map(([x, y, s, dur]) => {
    const start = (x + 300) / (W + 600);
    return `<g transform="translate(0 ${y})"><g class="cl" style="animation-duration:${dur}s;animation-delay:${(-dur * (1 - start)).toFixed(1)}s">${cloud(s)}</g></g>`;
  }).join('');

  // ---------- far range + the peak ----------
  const far = `<path class="far" d="M0 330 L90 262 L150 290 L240 214 L320 268 L400 236 L470 280 L560 250 L620 300 L700 300 L1000 300 L1060 232 L1120 262 L1200 214 L1200 400 L0 400Z"/>
    <path class="far-snow" d="M240 214 L262 232 L250 236 L238 228 L226 240 L218 230Z M1060 232 L1080 248 L1068 250 L1058 244 L1046 252 L1040 246Z M1200 214 L1200 236 L1188 232 L1176 240 L1180 226Z M90 262 L108 276 L96 278 L86 272 L74 280Z"/>`;
  // three peaks: a small one each side and a well-proportioned main peak in the middle,
  // each with a lit left face, a shaded right face and a jagged snow cap
  const mtn = (ax, ay, lx, rx, fx, left, right, ridge, snowL, snowR) => `
    <path class="pk-l" d="M${ax} ${ay} ${left.map(p => 'L' + p).join(' ')} L${lx} 400 L${fx} 400 ${ridge.slice().reverse().map(p => 'L' + p).join(' ')}Z"/>
    <path class="pk-r" d="M${ax} ${ay} ${right.map(p => 'L' + p).join(' ')} L${rx} 400 L${fx} 400 ${ridge.slice().reverse().map(p => 'L' + p).join(' ')}Z"/>
    <path class="snow" d="M${ax} ${ay} ${snowL.map(p => 'L' + p).join(' ')}Z"/>
    <path class="snow snow-r" d="M${ax} ${ay} ${snowR.map(p => 'L' + p).join(' ')}Z"/>`;
  const peak = `<g class="peak">
    ${mtn(500, 206, 330, 650, 518, ['462 250', '412 308', '370 358'], ['540 248', '586 300', '628 358'], ['506 270', '512 330'],
      ['462 250', '450 264', '468 268', '482 256', '494 274', '506 262', '506 240'], ['540 248', '552 262', '536 268', '522 256', '508 270', '506 262', '506 240'])}
    ${mtn(962, 236, 850, 1110, 978, ['930 270', '896 320', '870 364'], ['990 266', '1036 316', '1080 364'], ['968 300', '974 350'],
      ['930 270', '922 282', '938 284', '952 274', '964 288', '966 262'], ['990 266', '1000 280', '986 284', '974 276', '966 288', '966 262'])}
    ${mtn(700, 108, 430, 990, 722, ['656 158', '612 204', '562 262', '500 330'], ['744 152', '792 198', '852 252', '922 324'], ['712 190', '706 280', '716 340'],
      ['656 158', '612 204', '594 224', '614 232', '632 218', '650 242', '670 224', '690 248', '706 216', '712 190'],
      ['744 152', '792 198', '812 220', '794 232', '776 216', '758 240', '740 222', '724 236', '708 216', '712 190'])}
  </g>`;

  // ---------- hills ----------
  let pines = '';
  for(let i = 0; i < 26; i++){
    const x = 20 + R() * 1160, base = 376 + R() * 22, s = 9 + R() * 9;
    pines += `<path d="M${x.toFixed(0)} ${(base - s * 2.4).toFixed(0)} L${(x + s).toFixed(0)} ${base.toFixed(0)} L${(x - s).toFixed(0)} ${base.toFixed(0)}Z"/>`;
  }
  const hills = `<path class="hill-far" d="M0 380 C 160 350, 330 360, 520 392 C 640 410, 760 400, 900 380 C 1020 364, 1120 360, 1200 368 L1200 600 L0 600Z"/>
    <g class="pines">${pines}</g>
    <path class="hill-near" d="M0 402 C 260 390, 560 386, 820 390 C 980 393, 1100 398, 1200 394 L1200 600 L0 600Z"/>
    <path class="hill-shade" d="M0 522 C 300 508, 700 504, 1200 518 L1200 600 L0 600Z"/>`;

  // ---------- track, poles and wire ----------
  let sleepers = '';
  for(let s = 0; s < 1400; s += 16) sleepers += `<rect x="${s}" y="-7" width="5" height="14" rx="1"/>`;
  const track = `<g transform="translate(${T0.x} ${T0.y}) rotate(${ANG})">
    <rect class="ballast" x="-20" y="-11" width="1440" height="22" rx="8"/>
    <g class="sleepers">${sleepers}</g>
    <rect class="rail" x="-20" y="-5" width="1440" height="2.6"/><rect class="rail" x="-20" y="3" width="1440" height="2.6"/>
  </g>`;
  let poles = '', tops = [];
  for(let s = 140; s < 1400; s += 300){
    const p = onTrack(s), px = p.x - 22 * sin * -1, py = p.y - 16;
    poles += `<line x1="${px.toFixed(0)}" y1="${py.toFixed(0)}" x2="${px.toFixed(0)}" y2="${(py - 92).toFixed(0)}"/><line x1="${(px - 2).toFixed(0)}" y1="${(py - 86).toFixed(0)}" x2="${(px + 26).toFixed(0)}" y2="${(py - 86 + 26 * Math.tan(rad)).toFixed(0)}"/>`;
    tops.push([px + 20, py - 86 + 20 * Math.tan(rad)]);
  }
  const wire = `<path class="wire" d="M${tops.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(' L')}"/>`;

  // ---------- the train (two cars, drawn in track coordinates) ----------
  const wheel = x => `<g transform="translate(${x} -2)"><circle r="9" class="whl"/><g class="spin"><path d="M-7 0H7M0 -7V7" class="spk"/></g><circle r="2.4" class="hub"/></g>`;
  const car = (x, front) => `<g transform="translate(${x} 0)">
    <rect class="bogie" x="10" y="-12" width="128" height="8" rx="3"/>
    ${wheel(28)}${wheel(52)}${wheel(98)}${wheel(122)}
    <path class="body" d="M0 -18 L0 -74 Q0 -84 10 -84 L${front ? 132 : 140} -84 Q${front ? 150 : 150} -84 ${front ? 156 : 150} ${front ? -64 : -74} L${front ? 160 : 150} -18 Z"/>
    <rect class="stripe" x="0" y="-38" width="${front ? 160 : 150}" height="7"/>
    <rect class="skirt" x="0" y="-22" width="${front ? 160 : 150}" height="5" rx="2"/>
    <path class="roof" d="M8 -84 L${front ? 136 : 142} -84 L${front ? 130 : 136} -91 L14 -91Z"/>
    ${[14, 44, 74].map(wx => `<rect class="win" x="${wx}" y="-72" width="24" height="24" rx="5"/>`).join('')}
    <rect class="door" x="${front ? 104 : 108}" y="-74" width="20" height="50" rx="4"/><rect class="win" x="${front ? 107 : 111}" y="-70" width="14" height="18" rx="3"/>
    ${front ? `<path class="win" d="M136 -72 L148 -72 Q154 -66 156 -50 L136 -50Z"/><circle class="lamp" cx="156" cy="-28" r="4.5"/><text class="plate" x="12" y="-32.4">BUBBLE EXPRESS</text>` : ''}
  </g>`;
  const panto = x => `<path class="panto" d="M${x} -91 L${x + 14} -106 L${x - 6} -118 M${x - 14} -118 H${x + 6}"/>`;
  const train = `<g transform="translate(${T0.x} ${T0.y}) rotate(${ANG})"><g class="train"><g class="rock">
    ${car(0, false)}<rect class="coupler" x="148" y="-30" width="16" height="6" rx="2"/>${car(162, true)}${panto(70)}${panto(250)}
  </g></g></g>`;

  // lit windows and headlight, drawn above the night shade and moving with the train
  const lit = (x, front) => `<g transform="translate(${x} 0)">${[14, 44, 74].map(wx => `<rect x="${wx}" y="-72" width="24" height="24" rx="5"/>`).join('')}<rect x="${front ? 107 : 111}" y="-70" width="14" height="18" rx="3"/>${front ? '<path d="M136 -72 L148 -72 Q154 -66 156 -50 L136 -50Z"/><path class="beam" d="M158 -28 L330 -70 L330 14Z"/><circle class="lampglow" cx="156" cy="-28" r="7"/>' : ''}</g>`;
  const lights = `<g class="lights" transform="translate(${T0.x} ${T0.y}) rotate(${ANG})"><g class="train"><g class="rock">${lit(0, false)}${lit(162, true)}</g></g></g>`;

  // ---------- meadow of lupins, daisies and buttercups below the track ----------
  const lup = ['#8C9CF5', '#7C8BEB', '#A996F2', '#6F83E6', '#B3A6F7'];
  let flowers = '';
  for(let i = 0; i < 90; i++){
    const x = R() * (W + 40) - 20, top = trackY(x) + 34, y = top + Math.pow(R(), .7) * (H + 20 - top);
    if(y > H + 10) continue;
    const near = (y - top) / (H - top), h = 26 + near * 70, c = lup[(R() * lup.length) | 0], n = 6 + ((near * 6) | 0);
    let buds = '';
    for(let k = 0; k < n; k++){ const t = k / n, bw = (1 - t) * (4 + near * 6) + 1.6; buds += `<ellipse cx="${((k % 2 ? 1 : -1) * bw * .35).toFixed(1)}" cy="${(-h * .35 - t * h * .65).toFixed(1)}" rx="${bw.toFixed(1)}" ry="${(bw * .8).toFixed(1)}"/>`; }
    flowers += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="sway" style="animation-delay:${(-R() * 4).toFixed(2)}s;animation-duration:${(3 + R() * 2.5).toFixed(1)}s"><path class="stem" d="M0 0 Q2 ${(-h * .4).toFixed(0)} 0 ${(-h * .95).toFixed(0)}"/><g fill="${c}">${buds}</g></g></g>`;
  }
  let dots = '';
  for(let i = 0; i < 70; i++){
    const x = R() * W, top = trackY(x) + 22, y = top + R() * (H - top);
    dots += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.6 + R() * 2.6).toFixed(1)}" fill="${R() < .5 ? '#FFD66B' : '#FFFFFF'}"/>`;
  }

  return `<svg class="train-scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="tsDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD2F2"/><stop offset=".55" stop-color="#D4ECFA"/><stop offset="1" stop-color="#FBE6EF"/></linearGradient>
      <linearGradient id="tsGrey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AEBBCB"/><stop offset="1" stop-color="#E4E4EC"/></linearGradient>
      <linearGradient id="tsRain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E8AA3"/><stop offset="1" stop-color="#B9BCCB"/></linearGradient>
      <linearGradient id="tsNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C2152"/><stop offset=".6" stop-color="#3A3B78"/><stop offset="1" stop-color="#6B5A96"/></linearGradient>
      <radialGradient id="tsMoon" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#FFFDF0"/><stop offset=".6" stop-color="#FFF3C4"/><stop offset="1" stop-color="#F0DDA0"/></radialGradient>
      <radialGradient id="tsGlow"><stop offset="0" stop-color="#FFF4C8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF4C8" stop-opacity="0"/></radialGradient>
      <linearGradient id="tsBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF3B8" stop-opacity=".75"/><stop offset="1" stop-color="#FFF3B8" stop-opacity="0"/></linearGradient>
    </defs>
    <rect class="sky sky-day" width="${W}" height="${H}" fill="url(#tsDay)"/>
    <rect class="sky sky-grey" width="${W}" height="${H}" fill="url(#tsGrey)"/>
    <rect class="sky sky-rain" width="${W}" height="${H}" fill="url(#tsRain)"/>
    <rect class="sky sky-night" width="${W}" height="${H}" fill="url(#tsNight)"/>
    <g class="stars">${stars}</g>
    <g class="moon"><circle cx="1040" cy="196" r="110" fill="url(#tsGlow)"/><circle cx="1040" cy="196" r="32" fill="url(#tsMoon)"/><circle cx="1029" cy="187" r="6" fill="#EADBA8" opacity=".6"/><circle cx="1051" cy="209" r="4.5" fill="#EADBA8" opacity=".5"/></g>
    <g class="clouds">${clouds}</g>
    <g class="land">
      ${far}${peak}${hills}
      <g class="poles">${poles}</g>${wire}
      ${track}${train}
      <g class="dots">${dots}</g>
      <g class="flowers">${flowers}</g>
    </g>
    <rect class="shade" width="${W}" height="${H}"/>
    ${lights}
  </svg>`;
}
