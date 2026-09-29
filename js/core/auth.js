/* =========================================================
   auth: Supabase email + password
   ========================================================= */
let META = {};
const Auth = {
  logged(){ return !!Store.uid; },
  async logout(){
    try{ await Store.sb.auth.signOut(); }catch(e){}
    Store.setUser(null); Store.reset(); META = {};
    history.replaceState(null, '', location.pathname);
    showAuth('login');
  }
};
function authError(e){
  const m = String((e && e.message) || e || '');
  if(/invalid login credentials/i.test(m)) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if(/email not confirmed/i.test(m)) return 'ยังไม่ได้ยืนยันอีเมล ลองเปิดลิงก์ในอีเมลก่อน';
  if(/already registered|already been registered/i.test(m)) return 'อีเมลนี้มีบัญชีอยู่แล้ว ลองเข้าสู่ระบบแทน';
  if(/password should be at least/i.test(m)) return 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร';
  if(/rate limit/i.test(m)) return 'ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่';
  return m || 'เกิดข้อผิดพลาด ลองอีกครั้ง';
}
function showAuth(mode = 'login'){
  document.body.dataset.route = 'auth';
  const app = $('#app');
  app.innerHTML = '';
  const titles = {login:'ยินดีต้อนรับกลับ', signup:'สร้างพื้นที่ของฉัน', forgot:'ลืมรหัสผ่าน'};
  const subs = {login:'เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน', signup:'สมัครด้วยอีเมล แล้วเริ่มเก็บเรื่องราวของคุณ', forgot:'ใส่อีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้'};
  const wrap = h(`<div class="auth-wrap"><div class="auth glass">
    <div class="brand-orb"></div>
    <h1>${titles[mode]}</h1>
    <p>${subs[mode]}</p>
    <div class="form">
      ${mode === 'signup' ? `<div class="field"><label for="a-name">ชื่อเล่น</label><input id="a-name" maxlength="30" autocomplete="nickname"></div>` : ''}
      <div class="field"><label for="a-email">อีเมล</label><input id="a-email" type="email" autocomplete="email" inputmode="email"></div>
      ${mode !== 'forgot' ? `<div class="field"><label for="a-pw">รหัสผ่าน</label><input id="a-pw" type="password" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}"></div>` : ''}
      ${mode === 'signup' ? `<div class="field"><label for="a-pw2">ยืนยันรหัสผ่าน</label><input id="a-pw2" type="password" autocomplete="new-password"></div>` : ''}
      <div class="field" id="a-err" role="alert" style="color:#D6406A;font-size:14px;min-height:1em"></div>
      <button class="btn" id="a-go">${({login:'เข้าสู่ระบบ', signup:'สมัครใช้งาน', forgot:'ส่งลิงก์ตั้งรหัสใหม่'})[mode]}</button>
      <div class="auth-links">
        ${mode === 'login' ? `<button data-m="signup">ยังไม่มีบัญชี? สมัครใช้งาน</button><button data-m="forgot">ลืมรหัสผ่าน?</button>` : `<button data-m="login">กลับไปหน้าเข้าสู่ระบบ</button>`}
      </div>
    </div>
  </div></div>`);
  const lt = langToggle(); lt.style.cssText = 'justify-content:center;margin:-8px 0 14px'; $('.auth p', wrap).after(lt);
  $$('[data-m]', wrap).forEach(b => b.onclick = () => showAuth(b.dataset.m));
  app.append(wrap);
  const err = $('#a-err'), go = $('#a-go');
  const say = (msg, good) => { err.style.color = good ? '#2FA886' : '#D6406A'; err.textContent = msg; };
  const submit = async () => {
    const email = $('#a-email').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){ say('ใส่อีเมลให้ถูกต้องก่อนนะ'); return; }
    go.disabled = true;
    try{
      if(mode === 'forgot'){
        const {error} = await Store.sb.auth.resetPasswordForEmail(email, {redirectTo: location.origin + location.pathname});
        if(error) throw error;
        say('ส่งลิงก์ไปที่อีเมลแล้ว เปิดลิงก์เพื่อตั้งรหัสผ่านใหม่', true);
      } else if(mode === 'signup'){
        const name = $('#a-name').value.trim(), pw = $('#a-pw').value;
        if(!name) throw new Error('ใส่ชื่อเล่นก่อนนะ');
        if(pw.length < 6) throw new Error('รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร');
        if(pw !== $('#a-pw2').value) throw new Error('รหัสผ่านสองช่องไม่ตรงกัน');
        const {data, error} = await Store.sb.auth.signUp({email, password:pw, options:{data:{name}, emailRedirectTo: location.origin + location.pathname}});
        if(error) throw error;
        if(data.session){ Store.setUser(data.user); await enterApp(); return; }
        say('สมัครเรียบร้อย เราส่งลิงก์ยืนยันไปที่อีเมลแล้ว ยืนยันแล้วกลับมาเข้าสู่ระบบได้เลย', true);
      } else {
        const {data, error} = await Store.sb.auth.signInWithPassword({email, password:$('#a-pw').value});
        if(error) throw error;
        Store.setUser(data.user); await enterApp(); return;
      }
    }catch(e){ say(authError(e)); }
    go.disabled = false;
  };
  go.onclick = submit;
  $$('input', wrap).forEach(i => i.addEventListener('keydown', e => { if(e.key === 'Enter') submit(); }));
  setTimeout(() => (mode === 'signup' ? $('#a-name') : $('#a-email')).focus(), 60);
}
function showSetup(){
  document.body.dataset.route = 'auth';
  $('#app').innerHTML = `<div class="auth-wrap"><div class="auth glass" style="text-align:left"><div class="brand-orb"></div>
    <h1 style="text-align:center">ยังไม่ได้เชื่อมต่อ Supabase</h1>
    <p>เปิดไฟล์ <b>config.js</b> แล้วใส่ Project URL กับ anon public key จากหน้า Project Settings → API ของ Supabase จากนั้นรีเฟรชหน้านี้ ดูขั้นตอนทั้งหมดได้ใน README.md</p>
  </div></div>`;
}
