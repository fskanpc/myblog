/* =========================================================
   helpers
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MK = '\u2063';
const escT = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* user content is wrapped in invisible markers so the translator never touches it */
const esc = s => { const v = escT(s); return v ? MK + v + MK : ''; };
function h(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
function hash(str){ let x = 0; for (const c of String(str)) x = (x * 31 + c.charCodeAt(0)) | 0; return Math.abs(x); }
const TH_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const TH_MON = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const TH_DAYS = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
function ymd(d = new Date()){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function thDate(s, short){ if(!s) return ''; const [y,m,d] = s.split('-').map(Number); if(!y) return s; if(LANG === 'en') return short ? `${d} ${EN_MON[m-1]} '${String(y).slice(2)}` : `${d} ${EN_MONTHS[m-1]} ${y}`; return short ? `${d} ${TH_MON[m-1]} ${String(y+543).slice(2)}` : `${d} ${TH_MONTHS[m-1]} ${y+543}`; }
function starsHTML(n = 0){ n = Math.round(Number(n)||0); return `<span class="stars" aria-label="${n} จาก 5 ดาว">${'★'.repeat(n)}<span class="off">${'★'.repeat(5-n)}</span></span>`; }
function ls(k, v){ try{ if(v === undefined) return localStorage.getItem(k); if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); }catch(e){ return null; } }
function ss(k, v){ try{ if(v === undefined) return sessionStorage.getItem(k); if(v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); }catch(e){ return null; } }
let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }
