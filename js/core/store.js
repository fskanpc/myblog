/* =========================================================
   storage: Supabase (Postgres + Row Level Security)
   ========================================================= */
const SECTIONS = ['diary','books','tarot','travel','screen','music','vocab','english','planner','photobooth'];
/* text copied from PDFs or web pages can carry invisible control characters; Postgres jsonb
   rejects \u0000 ("unsupported Unicode escape sequence"), so clean every string before saving */
function cleanForDb(x){
  if(typeof x === 'string') return x.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFE\uFFFF]/g, '').replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  if(Array.isArray(x)) return x.map(cleanForDb);
  if(x && typeof x === 'object'){ const o = {}; for(const k in x) o[k] = cleanForDb(x[k]); return o; }
  return x;
}
const Store = {
  mode:'supabase', uid:null, email:'', sb:null, cache:{},
  init(){
    const cfg = window.BUBBLE_CONFIG || {};
    const ok = window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !/YOUR_/.test(cfg.SUPABASE_URL + cfg.SUPABASE_ANON_KEY);
    if(!ok){ this.mode = 'unconfigured'; return; }
    this.sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}});
  },
  async session(){
    const {data} = await this.sb.auth.getSession();
    this.setUser(data.session && data.session.user);
    return data.session && data.session.user;
  },
  setUser(u){ this.uid = u ? u.id : null; this.email = u ? (u.email || '') : ''; this.user = u || null; },
  reset(){ this.cache = {}; },
  newId(){ return (crypto.randomUUID ? crypto.randomUUID() : 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)); },
  async list(section){
    if(this.cache[section]) return this.cache[section];
    const {data, error} = await this.sb.from('items').select('id,data').eq('section', section);
    if(error){ console.error(error); toast('โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง'); return (this.cache[section] = []); }
    return (this.cache[section] = data.map(r => ({...r.data, id:r.id})));
  },
  async save(section, item){
    const items = await this.list(section);
    if(!item.id){ item.id = this.newId(); item.createdAt = Date.now(); }
    item.updatedAt = Date.now();
    Object.assign(item, cleanForDb(item));
    const {id, ...data} = item;
    const {error} = await this.sb.from('items').upsert({user_id:this.uid, id, section, data}, {onConflict:'user_id,id'});
    if(error) throw new Error(error.message);
    const i = items.findIndex(x => x.id === item.id);
    if(i >= 0) items[i] = item; else items.push(item);
    return item;
  },
  async remove(section, id){
    const {error} = await this.sb.from('items').delete().eq('id', id);
    if(error) throw new Error(error.message);
    const items = await this.list(section);
    const i = items.findIndex(x => x.id === id);
    if(i >= 0) items.splice(i, 1);
  },
  /* video files go to Supabase Storage (bucket "videos", one folder per user), not the items table */
  async uploadVideo(file){
    const ext = (file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
    const path = `${this.uid}/${this.newId()}.${ext}`;
    const {error} = await this.sb.storage.from('videos').upload(path, file, {contentType:file.type || 'video/mp4', upsert:false});
    if(error) throw new Error(/bucket not found/i.test(error.message) ? 'ยังไม่ได้สร้างที่เก็บวิดีโอใน Supabase (ดู README)' : error.message);
    return path;
  },
  async videoUrl(path){
    const {data, error} = await this.sb.storage.from('videos').createSignedUrl(path, 60 * 60 * 6);
    if(error){ console.error(error); return ''; }
    return data.signedUrl;
  },
  async removeVideo(path){
    if(!path) return;
    const {error} = await this.sb.storage.from('videos').remove([path]);
    if(error) console.error(error);
  },
  async getMeta(){
    const {data, error} = await this.sb.from('profiles').select('meta').eq('user_id', this.uid).maybeSingle();
    if(error){ console.error(error); return {}; }
    return (data && data.meta) || {};
  },
  async setMeta(meta){
    const {error} = await this.sb.from('profiles').upsert({user_id:this.uid, meta:cleanForDb(meta)}, {onConflict:'user_id'});
    if(error) throw new Error(error.message);
  }
};
