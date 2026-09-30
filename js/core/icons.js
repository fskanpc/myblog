/* =========================================================
   icons (original line icons)
   ========================================================= */
const P = {
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  diary:'<path d="M6 3h11a2 2 0 0 1 2 2v16H8a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1z"/><path d="M5 18a3 3 0 0 1 3-3h11"/><path d="M12 11.5l-2.2-2.1a1.4 1.4 0 0 1 2.2-1.7 1.4 1.4 0 0 1 2.2 1.7z"/>',
  books:'<path d="M4 20V5h3v15M9 20V7h3v13M14.5 20l2.2-14.5 3 .5L17.5 20.4"/><path d="M3 20.5h18"/>',
  tarot:'<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M12 7.5l1.2 2.7 2.9.3-2.2 2 .6 2.8L12 13.9l-2.5 1.4.6-2.8-2.2-2 2.9-.3z"/>',
  travel:'<path d="M21.5 2.5L10.5 13.5"/><path d="M21.5 2.5l-7 19-4-8.5-8.5-4z"/>',
  screen:'<rect x="3" y="4.5" width="18" height="13" rx="3"/><path d="M10 8.5l5 2.5-5 2.5z"/><path d="M8 21h8"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  vocab:'<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 15l2.5-7 2.5 7M8.8 13h3.4M15.5 10.5v4.5M15.5 12.5a1.8 1.8 0 1 1 0 .01"/>',
  planner:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>',
  claw:'<path d="M3 3h18M12 3v6"/><circle cx="12" cy="10.5" r="1.8"/><path d="M10.6 11.6L6.5 15.5l2.2 4M13.4 11.6l4.1 3.9-2.2 4"/>',
  profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  moon:'<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  auto:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  left:'<path d="M15 6l-6 6 6 6"/>',
  right:'<path d="M9 6l6 6-6 6"/>',
  link:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  shuffle:'<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  cloud:'<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 11 3.5 3.5 0 0 0 7 18z"/>',
  star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
};
function ic(name, extra = ''){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${P[name] || ''}</svg>`; }

const APPS = [
  {id:'home',    name:'หน้าแรก',        icon:'home',    c1:'#FF9CC0', c2:'#B79BFF'},
  {id:'diary',   name:'ไดอารี่',        icon:'diary',   c1:'#FF86AE', c2:'#FFC3D6'},
  {id:'books',   name:'ชั้นหนังสือ',     icon:'books',   c1:'#FFA66E', c2:'#FFD39E'},
  {id:'tarot',   name:'ไพ่ทาโร่ต์',      icon:'tarot',   c1:'#7A58F5', c2:'#C0A3FF'},
  {id:'travel',  name:'ที่เที่ยว',       icon:'travel',  c1:'#4FAEFF', c2:'#A6DBFF'},
  {id:'screen',  name:'หนังและการ์ตูน', icon:'screen',  c1:'#FF6F86', c2:'#FFB0B8'},
  {id:'music',   name:'เพลงโปรด',       icon:'music',   c1:'#3EC6A6', c2:'#A3EAD6'},
  {id:'vocab',   name:'สมุดคำศัพท์',    icon:'vocab',   c1:'#F7B928', c2:'#FFE38C'},
  {id:'planner', name:'แพลนเนอร์',      icon:'planner', c1:'#6F8DFF', c2:'#B3C4FF'},
  {id:'photobooth', name:'โฟโต้บูธ',     icon:'camera',  c1:'#F47C9B', c2:'#FFC2D1'},
  {id:'game',    name:'เกมคีบตุ๊กตา',   icon:'claw',    c1:'#FF7FA8', c2:'#FFC6D8'},
  {id:'profile', name:'โปรไฟล์',        icon:'profile', c1:'#C07CFF', c2:'#E6C8FF'}
];
const appOf = id => APPS.find(a => a.id === id) || APPS[0];
