/* =========================================================
   weather: live conditions from Open-Meteo (free, no key)
   location: browser location -> hometown in the profile -> Bangkok
   ========================================================= */
const Weather = (() => {
  const KINDS = {
    clear:  {th:'ท้องฟ้าแจ่มใส', icon:'☀️'},
    partly: {th:'มีเมฆบางส่วน', icon:'🌤️'},
    cloudy: {th:'เมฆมาก', icon:'☁️'},
    fog:    {th:'มีหมอก', icon:'🌫️'},
    rain:   {th:'ฝนตก', icon:'🌧️'},
    storm:  {th:'ฝนฟ้าคะนอง', icon:'⛈️'}
  };
  const kindOf = code => code <= 1 ? 'clear' : code === 2 ? 'partly' : code === 3 ? 'cloudy' : (code === 45 || code === 48) ? 'fog'
    : code >= 95 ? 'storm' : ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) ? 'rain' : 'cloudy';
  const cacheGet = (k, maxAge) => { try{ const v = JSON.parse(ss(k) || ls(k) || 'null'); return v && Date.now() - v.t < maxAge ? v.d : null; }catch(e){ return null; } };
  const cacheSet = (k, d, persist) => { const v = JSON.stringify({t:Date.now(), d}); persist ? ls(k, v) : ss(k, v); };
  function browserPos(){
    return new Promise(res => {
      if(!navigator.geolocation || ls('bubble:geo-denied')) return res(null);
      navigator.geolocation.getCurrentPosition(
        p => res({lat:p.coords.latitude, lon:p.coords.longitude, name:''}),
        err => { if(err.code === 1) ls('bubble:geo-denied', '1'); res(null); },
        {timeout:7000, maximumAge:3600000});
    });
  }
  async function hometownPos(){
    const q = (META.hometown || '').trim(); if(!q) return null;
    try{
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=1&language=th&name=${encodeURIComponent(q)}`);
      const j = await r.json(); const g = j.results && j.results[0];
      return g ? {lat:g.latitude, lon:g.longitude, name:g.name} : null;
    }catch(e){ return null; }
  }
  async function position(){
    const c = cacheGet('bubble:pos', 6 * 3600e3); if(c) return c;
    const p = (await browserPos()) || (await hometownPos()) || {lat:13.7563, lon:100.5018, name:'กรุงเทพฯ'};
    cacheSet('bubble:pos', p, true); return p;
  }
  async function current(){
    const c = cacheGet('bubble:wx', 20 * 60e3); if(c) return c;
    const p = await position();
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,weather_code,is_day&timezone=auto`);
    const j = await r.json(); const cur = j.current || {};
    const d = {temp:Math.round(cur.temperature_2m), kind:kindOf(cur.weather_code ?? 0), day:cur.is_day !== 0, place:p.name || ''};
    cacheSet('bubble:wx', d); return d;
  }
  return {KINDS, current, label:k => (KINDS[k] || KINDS.clear).th, icon:k => (KINDS[k] || KINDS.clear).icon};
})();
