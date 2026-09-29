/* =========================================================
   boot
   ========================================================= */
async function enterApp(){
  Store.reset();
  META = await Store.getMeta();
  if(!META.name){
    const u = Store.user || {};
    META = {...META, name:(u.user_metadata && u.user_metadata.name) || (Store.email || 'me').split('@')[0], siteName:META.siteName || 'My Little Bubble', theme:META.theme || 'auto', joined:META.joined || ymd(), lang:META.lang || LANG};
    try{ await Store.setMeta(META); }catch(e){ toast('บันทึกบัญชีไม่สำเร็จ ลองอีกครั้ง'); }
  }
  if(META.lang && META.lang !== LANG){ LANG = META.lang; ls('bubble:lang', LANG); }
  document.documentElement.lang = LANG;
  applyTheme();
  if(/access_token|type=/.test(location.hash)) history.replaceState(null, '', location.pathname + '#home');
  renderShell();
  route();
}
let recoveryPending = false;
async function boot(){
  document.documentElement.lang = LANG;
  Store.init();
  if(Store.mode === 'unconfigured') return showSetup();
  $('#app').innerHTML = '<div class="auth-wrap"><div class="auth glass"><div class="brand-orb"></div><h1>กำลังเปิดบับเบิ้ล…</h1><p>เชื่อมต่อพื้นที่ส่วนตัวของคุณ</p></div></div>';
  Store.sb.auth.onAuthStateChange((event, session) => {
    if(event === 'PASSWORD_RECOVERY'){ recoveryPending = true; Store.setUser(session && session.user); }
    if(event === 'SIGNED_OUT' && Store.uid){ Store.setUser(null); showAuth('login'); }
  });
  const u = await Store.session();
  if(!u) return showAuth('login');
  await enterApp();
  if(recoveryPending){ recoveryPending = false; changePassword('ตั้งรหัสผ่านใหม่'); }
}
boot();
