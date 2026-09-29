/* =========================================================
   Seaside scene for the home page (original artwork, drawn as SVG)
   girl + white dog walking on the beach, dolphins, sun & clouds by day,
   moon & stars by night. Sized 1600x1000 and "cover"-fitted (slice).
   ========================================================= */
function seaScene(){
  const R = (() => { let s = 20261001; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; })();
  const W = 1600, HZ = 560;           // width, horizon
  // ---------- stars ----------
  let stars = '';
  for(let i = 0; i < 110; i++){
    const x = R() * W, y = R() * (HZ - 60), r = .8 + R() * 1.8;
    stars += `<circle class="tw" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" style="animation-delay:${(-R() * 4).toFixed(2)}s;animation-duration:${(2.5 + R() * 3).toFixed(1)}s"/>`;
  }
  // ---------- clouds ----------
  const cloud = (s) => `<g transform="scale(${s})"><ellipse cx="0" cy="0" rx="120" ry="26"/><circle cx="-60" cy="-18" r="34"/><circle cx="-8" cy="-40" r="48"/><circle cx="48" cy="-24" r="36"/><circle cx="86" cy="-6" r="24"/></g>`;
  const cl = [[180, 150, 1, 150], [760, 90, .75, 190], [1380, 230, .9, 165], [520, 300, .55, 230], [1120, 60, .6, 210]];
  const clouds = cl.map(([x, y, s, dur]) => {
    const span = W + 700, start = (x + 350) / span;
    return `<g transform="translate(0 ${y})"><g class="cl" style="animation-duration:${dur}s;animation-delay:${(-dur * (1 - start)).toFixed(1)}s">${cloud(s)}</g></g>`;
  }).join('');
  // ---------- birds ----------
  const birds = [[0, 140, 1], [40, 118, .8], [78, 150, .7]].map(([x, y, s], i) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path class="wing" style="animation-delay:${-i * .2}s" d="M-16 0 Q-8 -9 0 0 Q8 -9 16 0" fill="none" stroke="#3F4E6B" stroke-width="3" stroke-linecap="round"/></g>`).join('');
  // ---------- sea waves ----------
  let waves = '';
  for(let i = 0; i < 9; i++){
    const y = HZ + 14 + i * i * 4.2 + i * 10, amp = 2 + i * .9, len = 50 + i * 18;
    let d = `M-200 ${y}`; for(let x = -200; x < W + 400; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    waves += `<path class="wv" d="${d}" stroke-width="${(1.2 + i * .35).toFixed(1)}" style="animation-duration:${(9 - i * .5).toFixed(1)}s;animation-delay:${(-i * .7).toFixed(1)}s;opacity:${(.18 + i * .03).toFixed(2)}"/>`;
  }
  // sun glitter / moon path on the water
  let glitter = '', moonpath = '';
  for(let i = 0; i < 26; i++){
    const y = HZ + 8 + i * 9 + R() * 4, w = 10 + R() * 34 - i * .3, x = 1000 + (R() - .5) * (40 + i * 7);
    glitter += `<rect class="gl" x="${(x - w / 2).toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="2.4" rx="1.2" style="animation-delay:${(-R() * 3).toFixed(2)}s"/>`;
    moonpath += `<rect class="gl" x="${(x - w / 2).toFixed(0)}" y="${y.toFixed(0)}" width="${(w * 1.2).toFixed(0)}" height="2.4" rx="1.2" style="animation-delay:${(-R() * 3).toFixed(2)}s"/>`;
  }
  // ---------- dolphins (SMIL motion along a jump arc) ----------
  const dolphin = `<g transform="translate(-55 0)">
      <path d="M0 0 L-18 -13 L-9 0 L-18 13 Z" fill="#4E7FA8"/>
      <path d="M0 0 C22 -24 74 -28 104 -11 L118 -15 L109 -4 C112 2 108 7 101 5 C72 11 30 13 0 0 Z" fill="#5E93BE"/>
      <path d="M8 2 C36 10 74 9 100 4 C84 12 40 15 8 2 Z" fill="#D7E9F5"/>
      <path d="M44 -22 L56 -44 L64 -21 Z" fill="#4E7FA8"/>
      <path d="M58 -2 L70 12 L74 -1 Z" fill="#4E7FA8"/>
      <circle cx="94" cy="-8" r="2.4" fill="#1F2B3A"/>
    </g>`;
  const jump = (x0, y0, dx, hgt, dur, begin, s) => {
    const path = `M${x0} ${y0} Q${x0 + dx / 2} ${y0 - hgt * 2} ${x0 + dx} ${y0}`;
    const splash = (x, kt, vals) => `<g transform="translate(${x} ${y0})" opacity="0"><ellipse rx="${16 * s}" ry="${4 * s}" fill="#fff"/><circle cx="${-8 * s}" cy="${-8 * s}" r="${3.5 * s}" fill="#fff"/><circle cx="${7 * s}" cy="${-11 * s}" r="${2.8 * s}" fill="#fff"/><circle cx="${1 * s}" cy="${-16 * s}" r="${2.2 * s}" fill="#fff"/><animate attributeName="opacity" values="${vals}" keyTimes="${kt}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
    return `<g class="dolphin">
      ${splash(x0, '0;0.04;0.16;1', '0;.95;0;0')}
      ${splash(x0 + dx, '0;0.36;0.4;0.52;1', '0;0;.95;0;0')}
      <g opacity="0">
        <g transform="scale(${s})">${dolphin}</g>
        <animateMotion path="${path}" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.4;1" calcMode="linear" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.03;0.37;0.4;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
      </g>
    </g>`;
  };
  const dolphins = jump(640, 700, 230, 105, 5.2, 0, .95) + jump(930, 668, 190, 85, 6.4, 2.1, .78) + jump(1180, 640, 150, 60, 7.4, 3.6, .6) + jump(380, 650, 150, 62, 8.2, 5.1, .62);
  // ---------- palms ----------
  const leaf = (a, len) => `<path transform="rotate(${a})" d="M0 0 C${len * .3} -${len * .22} ${len * .7} -${len * .2} ${len} ${len * .08} C${len * .7} -${len * .02} ${len * .3} ${len * .04} 0 0 Z" fill="#2F9A62"/><path transform="rotate(${a})" d="M0 0 C${len * .3} -${len * .12} ${len * .7} -${len * .1} ${len} ${len * .08}" fill="none" stroke="#1F7A4A" stroke-width="2"/>`;
  const palm = (x, y, flip, h) => `<g transform="translate(${x} ${y}) scale(${flip} 1)">
      <path d="M0 0 C8 -${h * .35} 26 -${h * .7} 58 -${h}" fill="none" stroke="#9B6B43" stroke-width="18" stroke-linecap="round"/>
      <path d="M0 0 C8 -${h * .35} 26 -${h * .7} 58 -${h}" fill="none" stroke="#7E5434" stroke-width="18" stroke-dasharray="3 16" stroke-linecap="round"/>
      <g class="palmtop" transform="translate(58 -${h})"><g class="sway">
        ${[-160, -130, -95, -60, -25, 10, 40].map((a, i) => leaf(a, 130 + (i % 2) * 30)).join('')}
        <circle cx="-6" cy="8" r="9" fill="#6B4A2E"/><circle cx="8" cy="10" r="8" fill="#7A5634"/>
      </g></g>
    </g>`;
  // ---------- girl & dog ----------
  const girl = `<g class="girl">
      <g class="bob">
        <path d="M-10 -118 C-26 -112 -30 -80 -24 -58 C-18 -66 -10 -72 -6 -84 Z" fill="#6B4636"/>
        <g class="leg l1"><rect x="-8" y="-42" width="8" height="40" rx="4" fill="#F9D2B8"/><ellipse cx="-2" cy="-2" rx="8" ry="4" fill="#fff"/></g>
        <g class="leg l2"><rect x="0" y="-42" width="8" height="40" rx="4" fill="#F4C3A6"/><ellipse cx="6" cy="-2" rx="8" ry="4" fill="#FFE1EA"/></g>
        <g class="arm a1"><rect x="-6" y="-92" width="7" height="34" rx="3.5" fill="#F4C3A6"/></g>
        <path d="M-14 -96 L14 -96 L28 -38 L-28 -38 Z" fill="#FFB3C8"/>
        <path d="M-28 -38 L28 -38 L26 -44 L-26 -44 Z" fill="#fff" opacity=".85"/>
        <circle cx="-8" cy="-66" r="2.5" fill="#fff" opacity=".8"/><circle cx="8" cy="-58" r="2.5" fill="#fff" opacity=".8"/><circle cx="-2" cy="-50" r="2.5" fill="#fff" opacity=".8"/><circle cx="14" cy="-72" r="2.5" fill="#fff" opacity=".8"/>
        <path d="M6 -90 L32 -70" stroke="#F9D2B8" stroke-width="7" stroke-linecap="round"/>
        <circle cx="2" cy="-114" r="17" fill="#F9D2B8"/>
        <path d="M-15 -114 C-16 -134 16 -138 19 -118 C10 -126 -2 -126 -15 -114 Z" fill="#6B4636"/>
        <circle cx="11" cy="-114" r="2" fill="#3A2A2A"/>
        <ellipse cx="13" cy="-107" rx="4" ry="2.4" fill="#FF9DBE" opacity=".7"/>
        <path d="M12 -103 Q15 -101 17 -103" fill="none" stroke="#C0616F" stroke-width="1.6" stroke-linecap="round"/>
        <ellipse cx="0" cy="-129" rx="32" ry="6.5" fill="#F6D48C"/>
        <path d="M-16 -130 C-16 -146 18 -146 18 -130 Z" fill="#F6D48C"/>
        <path d="M-16 -132 L18 -132 L18 -136 L-16 -136 Z" fill="#FF8FB1"/>
      </g>
    </g>`;
  const dog = `<g class="dog" transform="translate(96 0)">
      <g class="dbob">
        <g class="tail"><path d="M-26 -34 C-40 -44 -44 -58 -32 -60 C-30 -50 -24 -44 -20 -38 Z" fill="#fff" stroke="#DCDDE6" stroke-width="2"/></g>
        <g class="dleg d1"><rect x="-20" y="-20" width="8" height="20" rx="4" fill="#fff" stroke="#DCDDE6" stroke-width="2"/></g>
        <g class="dleg d2"><rect x="10" y="-20" width="8" height="20" rx="4" fill="#fff" stroke="#DCDDE6" stroke-width="2"/></g>
        <ellipse cx="-2" cy="-28" rx="30" ry="16" fill="#fff" stroke="#DCDDE6" stroke-width="2"/>
        <g class="dleg d3"><rect x="-12" y="-20" width="8" height="20" rx="4" fill="#fff" stroke="#DCDDE6" stroke-width="2"/></g>
        <g class="dleg d4"><rect x="18" y="-20" width="8" height="20" rx="4" fill="#fff" stroke="#DCDDE6" stroke-width="2"/></g>
        <circle cx="28" cy="-44" r="15" fill="#fff" stroke="#DCDDE6" stroke-width="2"/>
        <ellipse cx="40" cy="-40" rx="9" ry="7" fill="#fff" stroke="#DCDDE6" stroke-width="2"/>
        <path d="M18 -54 C10 -52 10 -38 16 -34 C20 -40 22 -48 18 -54 Z" fill="#F1ECEF" stroke="#DCDDE6" stroke-width="2"/>
        <circle cx="47" cy="-42" r="3" fill="#2A2330"/>
        <circle cx="33" cy="-48" r="2.2" fill="#2A2330"/>
        <ellipse cx="36" cy="-38" rx="3" ry="1.8" fill="#FFB3C8" opacity=".8"/>
        <path d="M16 -36 C22 -30 30 -30 34 -34" fill="none" stroke="#FF7FA8" stroke-width="4" stroke-linecap="round"/>
      </g>
    </g>`;
  const leash = `<path class="leash" d="M32 -70 Q70 -40 112 -33" fill="none" stroke="#FF7FA8" stroke-width="2.2"/>`;
  // ---------- starfish & shells ----------
  const star = (x, y, r, rot, c) => { let d = ''; for(let i = 0; i < 10; i++){ const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); } return `<path d="${d}Z" fill="${c}" transform="rotate(${rot} ${x} ${y})" stroke-linejoin="round" stroke="${c}" stroke-width="3"/>`; };
  const shell = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-14 -2 -16 -18 0 -22 C16 -18 14 -2 0 0 Z" fill="#FFE3EC" stroke="#F4B7C9" stroke-width="2"/><path d="M0 0 L-6 -18 M0 0 L0 -21 M0 0 L6 -18" stroke="#F4B7C9" stroke-width="1.6"/></g>`;

  return `<svg class="sea-scene" viewBox="0 0 ${W} 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="ssDay" x1="0" y1="0" x2="0" y2="${HZ}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5DB6EE"/><stop offset=".6" stop-color="#A9DDF6"/><stop offset="1" stop-color="#FFE6CC"/></linearGradient>
    <linearGradient id="ssNight" x1="0" y1="0" x2="0" y2="${HZ}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#060D2E"/><stop offset=".6" stop-color="#18215A"/><stop offset="1" stop-color="#393E7D"/></linearGradient>
    <linearGradient id="seaDay" x1="0" y1="${HZ}" x2="0" y2="880" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6ACBE6"/><stop offset=".45" stop-color="#2B9BD0"/><stop offset="1" stop-color="#38C3CF"/></linearGradient>
    <linearGradient id="seaNight" x1="0" y1="${HZ}" x2="0" y2="880" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2A3C78"/><stop offset=".45" stop-color="#132B5C"/><stop offset="1" stop-color="#1A4D6E"/></linearGradient>
    <radialGradient id="sunGlow"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE38C" stop-opacity=".55"/><stop offset="1" stop-color="#FFE38C" stop-opacity="0"/></radialGradient>
    <radialGradient id="moonGlow"><stop offset="0" stop-color="#FFF8DC" stop-opacity=".7"/><stop offset=".4" stop-color="#C9D4FF" stop-opacity=".25"/><stop offset="1" stop-color="#C9D4FF" stop-opacity="0"/></radialGradient>
    <mask id="moonCut" maskUnits="userSpaceOnUse" x="-80" y="-80" width="160" height="160"><rect x="-80" y="-80" width="160" height="160" fill="#fff"/><circle cx="26" cy="-16" r="50" fill="#000"/></mask>
    <linearGradient id="sand" x1="0" y1="800" x2="0" y2="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F7E3BD"/><stop offset="1" stop-color="#EFCF98"/></linearGradient>
  </defs>
  <rect class="sky-day" width="${W}" height="${HZ + 4}" fill="url(#ssDay)"/>
  <rect class="sky-night" width="${W}" height="${HZ + 4}" fill="url(#ssNight)"/>
  <g class="stars" fill="#FFF7DA">${stars}</g>
  <g class="sun" transform="translate(1000 170)">
    <circle r="190" fill="url(#sunGlow)"/>
    <g class="rays">${Array.from({length:12}, (_, i) => `<rect x="-3" y="-118" width="6" height="26" rx="3" fill="#FFE9A0" opacity=".8" transform="rotate(${i * 30})"/>`).join('')}</g>
    <circle r="64" fill="#FFE58A"/><circle r="52" fill="#FFF1B8"/>
  </g>
  <g class="moon" transform="translate(1000 170)">
    <circle r="210" fill="url(#moonGlow)"/>
    <g mask="url(#moonCut)"><circle r="56" fill="#FFF6D6"/><circle cx="-26" cy="14" r="7" fill="#F1E6BF"/><circle cx="-12" cy="34" r="4" fill="#F1E6BF"/></g>
  </g>
  <g class="birds"><g class="flock">${birds}</g></g>
  <g class="clouds" fill="#fff">${clouds}</g>
  <path d="M0 ${HZ + 18} C120 ${HZ - 4} 200 ${HZ - 16} 280 ${HZ - 8} C330 ${HZ - 20} 380 ${HZ - 6} 430 ${HZ + 18} Z" class="island"/>
  <rect class="sea-day" y="${HZ}" width="${W}" height="${1000 - HZ}" fill="url(#seaDay)"/>
  <rect class="sea-night" y="${HZ}" width="${W}" height="${1000 - HZ}" fill="url(#seaNight)"/>
  <rect y="${HZ - 1}" width="${W}" height="3" fill="#fff" opacity=".45"/>
  <g class="glitter" fill="#FFF8D6">${glitter}</g>
  <g class="moonpath" fill="#FFF8DC">${moonpath}</g>
  <g class="waves" fill="none" stroke="#fff" stroke-linecap="round">${waves}</g>
  <g class="boat"><g class="boat-move"><g class="boat-rock"><path d="M-30 0 L30 0 L22 10 L-22 10 Z" fill="#F4F1EA"/><path d="M0 -2 L0 -54 L26 -8 Z" fill="#FFB3C8"/><path d="M-3 -2 L-3 -46 L-22 -8 Z" fill="#fff"/></g></g></g>
  ${dolphins}
  <path class="wet" d="M0 842 C260 800 560 832 860 816 S1380 796 1600 822 V1000 H0 Z" fill="#E4C38F"/>
  <g class="foam"><path d="M-40 838 C240 796 560 828 860 812 S1380 792 1640 818" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-dasharray="60 18 24 14" opacity=".9"/></g>
  <path d="M0 872 C300 842 620 866 900 852 S1400 836 1600 858 V1000 H0 Z" fill="url(#sand)"/>
  ${star(300, 950, 14, 18, '#FF9B6A')}${star(1260, 930, 11, -12, '#FFB38A')}${shell(470, 972, 1)}${shell(1130, 962, .8)}${shell(1420, 978, .9)}
  <g transform="translate(0 916)"><g class="walker">${leash}${girl}${dog}</g></g>
  <g class="palms">${palm(70, 1000, 1, 330)}${palm(1560, 1000, -1, 300)}</g>
</svg>`;
}
