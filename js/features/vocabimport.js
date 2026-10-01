/* =========================================================
   VOCAB IMPORT: read a PDF (or pasted text) and turn it into
   word cards automatically, then let the owner check them
   before saving. Everything happens in the browser.
   - text PDFs: pdf.js reads the text layer
   - scanned PDFs: tesseract.js reads the page images (OCR)
   ========================================================= */
const VI_LIBS = {
  pdf:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  pdfWorker:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  ocr:'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',
  ocrLangs:'https://tessdata.projectnaptha.com/4.0.0'
};
const VI_MAX_PAGES = 30;
function viLoad(src){
  return new Promise((res, rej) => {
    if(document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.append(s);
  });
}

/* ---------- reading ---------- */
/* many Thai fonts store shifted vowels and tone marks as private-use glyphs (U+F700–F71A);
   map them back to the real Thai characters so words like ร่าเริง keep their marks */
const VI_PUA = ['\u0E10','\u0E34','\u0E35','\u0E36','\u0E37','\u0E48','\u0E49','\u0E4A','\u0E4B','\u0E4C','\u0E48','\u0E49','\u0E4A','\u0E4B','\u0E4C','\u0E0D','\u0E31','\u0E4D','\u0E47','\u0E48','\u0E49','\u0E4A','\u0E4B','\u0E4C','\u0E38','\u0E39','\u0E3A'];
const viFixThai = s => s.replace(/[\uF700-\uF71A]/g, c => VI_PUA[c.charCodeAt(0) - 0xF700]);
async function viPdfText(file, onStep){
  await viLoad(VI_LIBS.pdf);
  pdfjsLib.GlobalWorkerOptions.workerSrc = VI_LIBS.pdfWorker;
  const doc = await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
  const n = Math.min(doc.numPages, VI_MAX_PAGES), lines = [];
  let lost = 0;   // private-use glyphs we could not map back to text
  for(let p = 1; p <= n; p++){
    onStep(L(`กำลังอ่านหน้า ${p} จาก ${n}`, `Reading page ${p} of ${n}`));
    const page = await doc.getPage(p), tc = await page.getTextContent();
    // rebuild lines: group text pieces by their baseline, keep a tab where a column gap is wide
    const rows = [];
    for(const it of tc.items){
      it.str = viFixThai(it.str || '');
      lost += (it.str.match(/[\uE000-\uF8FF]/g) || []).length;
      if(!it.str.trim()) continue;
      const x = it.transform[4], y = it.transform[5], hgt = Math.abs(it.transform[3]) || 10;
      let row = rows.find(r => Math.abs(r.y - y) < hgt * .5);
      if(!row){ row = {y, h:hgt, parts:[]}; rows.push(row); }
      row.parts.push({x, w:it.width || 0, s:it.str});
    }
    rows.sort((a, b) => b.y - a.y);
    for(const r of rows){
      r.parts.sort((a, b) => a.x - b.x);
      let out = '', end = null;
      for(const pt of r.parts){
        if(end !== null){ const gap = pt.x - end; out += gap > r.h * 1.6 ? '\t' : gap > r.h * .15 && !/\s$/.test(out) && !/^\s/.test(pt.s) ? ' ' : ''; }
        out += pt.s; end = pt.x + pt.w;
      }
      lines.push(out.trim());
    }
    lines.push('');
  }
  return {lines, doc, pages:n, lost};
}
async function viOcr(doc, pages, langs, onStep){
  await viLoad(VI_LIBS.ocr);
  onStep(L('กำลังเตรียมตัวอ่านภาพ (ครั้งแรกอาจใช้เวลาสักครู่)', 'Preparing the image reader (the first time can take a moment)'));
  const worker = await Tesseract.createWorker(langs, 1, {langPath:VI_LIBS.ocrLangs});
  const lines = [];
  try{
    for(let p = 1; p <= pages; p++){
      onStep(L(`กำลังอ่านภาพหน้า ${p} จาก ${pages}`, `Reading the image of page ${p} of ${pages}`));
      const page = await doc.getPage(p), vp = page.getViewport({scale:2});
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
      await page.render({canvasContext:c.getContext('2d'), viewport:vp}).promise;
      const {data} = await worker.recognize(c);
      // Tesseract puts spaces between Thai letters; drop spaces between two Thai characters
      lines.push(...data.text.split('\n').map(s => s.replace(/(?<=[฀-๿]) (?=[฀-๿])/g, '')), '');
    }
  } finally { await worker.terminate(); }
  return lines;
}

/* ---------- turning lines into words ---------- */
const VI_POS = [
  [/^(n|noun|nn)\.?$/i, 'n.'], [/^(v|verb|vt|vi)\.?$/i, 'v.'], [/^(adj|adjective|a)\.?$/i, 'adj.'], [/^(adv|adverb)\.?$/i, 'adv.'],
  [/^(phr|phrase|idiom|phrasal verb|phv)\.?$/i, 'phrase'], [/^(prep|preposition|conj|conjunction|pron|pronoun|interj|det)\.?$/i, 'อื่น ๆ'],
  [/^(คำนาม|น\.)$/, 'n.'], [/^(คำกริยา|ก\.)$/, 'v.'], [/^(คำคุณศัพท์|ว\.)$/, 'adj.'], [/^(คำวิเศษณ์)$/, 'adv.']
];
const viPos = t => { t = (t || '').trim().replace(/^[([]|[)\]]$/g, ''); for(const [re, v] of VI_POS) if(re.test(t)) return v; return ''; };
const VI_THAI = /[฀-๿]/, VI_KANA = /[぀-ヿ]/, VI_HANGUL = /[가-힯ᄀ-ᇿ]/, VI_HAN = /[一-鿿]/;
const viLang = w => VI_KANA.test(w) ? 'ญี่ปุ่น' : VI_HANGUL.test(w) ? 'เกาหลี' : VI_HAN.test(w) ? 'จีน' : /[A-Za-z]/.test(w) ? 'อังกฤษ' : 'อื่น ๆ';
const VI_SKIP = /^(vocabulary|vocab|word list|wordlist|word|words|meaning|meanings|definition|คำศัพท์|ความหมาย|คำแปล|no\.?|page \d+|หน้า \d+|\d+|unit \d+.*|lesson \d+.*|บทที่ \d+.*)$/i;
const VI_EX = /^(example|ประโยคตัวอย่าง|ตัวอย่าง|e\.g\.|eg\.|ex\.)\s*[:\-–]?\s*|^(example|ex)\s*:\s*/i;

function viParse(lines){
  const out = [];
  let last = null;
  for(let raw of lines){
    let s = (raw || '').replace(/ /g, ' ').replace(/[ ]{2,}/g, '\t').trim();
    if(!s){ last = null; continue; }
    s = s.replace(/^(\(?\d{1,4}[.)]|[•●▪◦\-*–])\s+/, '').trim();          // numbering and bullets
    if(!s || VI_SKIP.test(s.replace(/\t/g, ' ').trim()) || s.split(/[\t ]+/).every(x => VI_SKIP.test(x.trim()))) continue;   // titles and table headers
    if(VI_EX.test(s) && last){ last.example = s.replace(VI_EX, '').trim(); continue; }

    let word = '', rest = '';
    const sep = s.match(/ [-–—=:|] |\s*[=:|]\s+/);
    if(s.includes('\t')){ const parts = s.split('\t').map(x => x.trim()).filter(Boolean); word = parts[0]; rest = parts.slice(1).join(' '); }
    else if(sep){ const i = s.indexOf(sep[0]); word = s.slice(0, i).trim(); rest = s.slice(i + sep[0].length).trim(); }
    else if(!VI_THAI.test(s[0]) && VI_THAI.test(s)){                         // "apple แอปเปิ้ล" → split where the Thai starts
      const i = s.search(VI_THAI); word = s.slice(0, i).trim(); rest = s.slice(i).trim();
      const posTail = word.match(/\s*\(?\b(n|v|adj|adv|phr|prep|conj)\.?\)?\s*$/i);
      if(posTail){ rest = posTail[0].trim() + ' ' + rest; word = word.slice(0, posTail.index).trim(); }
    } else {
      // a long sentence right after a word is its example; anything else stays a lone word to fill in later
      if(last && !last.example && s.split(/\s+/).length >= 4 && /[.!?。]$/.test(s)){ last.example = s; continue; }
      word = s; rest = '';
    }
    word = word.replace(/[,;:]+$/, '').trim();
    if(!word || word.length > 60) continue;

    // reading: /.../ or [...] next to the word or at the start of the meaning
    let reading = '';
    const rd = (word + ' ' + rest).match(/\/[^/]{1,40}\/|\[[^\]]{1,40}\]/);
    if(rd){ reading = rd[0]; word = word.replace(rd[0], '').trim(); rest = rest.replace(rd[0], '').trim(); }
    // part of speech: (n.) / n. / noun at the start of the meaning, or at the end of the word
    let pos = '';
    const pm = rest.match(/^[([]?([A-Za-zก-๙]{1,12}\.?)[)\]]?(?:[.:]|\s)+/);
    if(pm && viPos(pm[1])){ pos = viPos(pm[1]); rest = rest.slice(pm[0].length).trim(); }
    const pw = word.match(/\s*\(([A-Za-z. ]{1,12})\)$/);
    if(!pos && pw && viPos(pw[1])){ pos = viPos(pw[1]); word = word.slice(0, pw.index).trim(); }
    rest = rest.replace(/^[-–—:=|]\s*/, '').trim();
    // an example glued to the meaning: "meaning e.g. sentence"
    let example = '';
    const exm = rest.match(/\s(e\.g\.|eg\.|ex\.|example:?|ตัวอย่าง:?)\s+(.+)$/i);
    if(exm){ example = exm[2].trim(); rest = rest.slice(0, exm.index).trim(); }

    last = {word, reading, pos, meaning:rest, example, lang:viLang(word)};
    out.push(last);
  }
  // drop exact repeats inside the file
  const seen = new Set();
  return out.filter(w => { const k = w.word.toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true; });
}

/* fill in Thai tone marks the text layer dropped, using the OCR reading of the same word */
const VI_MARKS = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g;
function viMerge(textRows, ocrRows){
  const byWord = new Map(ocrRows.map(o => [o.word.toLowerCase().replace(/\s+/g, ''), o]));
  const bare = s => (s || '').replace(VI_MARKS, '').replace(/\s+/g, '');
  return textRows.map(r => {
    const o = byWord.get(r.word.toLowerCase().replace(/\s+/g, ''));
    const fixed = o && o.meaning && bare(o.meaning) === bare(r.meaning) && o.meaning.length > r.meaning.length;
    return {word:r.word, reading:r.reading, pos:r.pos, example:r.example, lang:r.lang, meaning:fixed ? o.meaning : r.meaning};
  });
}

/* ---------- the import window ---------- */
function vocabImport(existing){
  const have = new Set(existing.map(w => (w.word || '').toLowerCase().trim()));
  const body = h(`<div class="vi">
    <div class="vi-drop" tabindex="0" role="button" aria-label="เลือกไฟล์ PDF">
      <span class="vi-ic" aria-hidden="true">📄</span>
      <b>เลือกไฟล์ PDF หรือลากมาวางตรงนี้</b>
      <small>ระบบอ่านไฟล์บนเครื่องของคุณเอง ไม่ได้ส่งไฟล์ไปที่ไหน · สูงสุด ${VI_MAX_PAGES} หน้า</small>
      <input type="file" accept="application/pdf,.pdf" hidden>
    </div>
    <details class="vi-paste"><summary>หรือวางข้อความแทน</summary>
      <textarea rows="5" placeholder="apple - แอปเปิ้ล&#10;borrow (v.) ยืม&#10;curious /ˈkjʊə.ri.əs/ adj. อยากรู้อยากเห็น"></textarea>
      <button class="btn soft vi-read">${ic('check')}<span>อ่านข้อความนี้</span></button>
    </details>
    <div class="vi-ocr" hidden>
      <p class="vi-ocr-note"></p>
      <span>ภาษาในไฟล์</span>
      <label><input type="checkbox" value="eng" checked> อังกฤษ</label><label><input type="checkbox" value="tha" checked> ไทย</label>
      <label><input type="checkbox" value="jpn"> ญี่ปุ่น</label><label><input type="checkbox" value="kor"> เกาหลี</label><label><input type="checkbox" value="chi_sim"> จีน</label>
    </div>
    <p class="vi-status muted" role="status" aria-live="polite"></p>
    <div class="vi-result" hidden>
      <div class="vi-bar"><label class="vi-all"><input type="checkbox" checked> เลือกทั้งหมด</label><span class="vi-sum"></span></div>
      <div class="vi-table" role="list"></div>
    </div>
  </div>`);
  const saveBtn = btn('บันทึกคำที่เลือก', '', null, 'check'); saveBtn.disabled = true;
  const m = modal({title:'นำเข้าคำศัพท์', body, wide:true, actions:['spacer', saveBtn]});
  const status = $('.vi-status', body), table = $('.vi-table', body), fileIn = $('input[type=file]', body);
  let rows = [], busy = false, pending = null;
  const say = t => { status.textContent = T(t); };

  const sum = () => {
    const n = rows.filter(r => r.on).length;
    $('.vi-sum', body).textContent = LANG === 'en' ? `${n} of ${rows.length} selected` : `เลือก ${n} จาก ${rows.length} คำ`;
    $('span', saveBtn).textContent = n ? (LANG === 'en' ? `Save ${n} words` : `บันทึก ${n} คำ`) : T('บันทึกคำที่เลือก');
    saveBtn.disabled = !n || busy;
    $('.vi-all input', body).checked = n === rows.length;
  };
  const show = words => {
    rows = words.map(w => ({...w, dup:have.has(w.word.toLowerCase()), on:!have.has(w.word.toLowerCase()) && !!w.meaning}));
    table.innerHTML = '';
    if(!rows.length){ $('.vi-result', body).hidden = true; say(L('ไม่เจอคำศัพท์ในไฟล์นี้ ลองวางข้อความแทน หรือเช็กว่าไฟล์เป็นรายการคำศัพท์', 'No words found. Try pasting the text instead, or check the file is a word list.')); return; }
    rows.forEach(r => {
      const el = h(`<div class="vi-row ${r.dup ? 'dup' : ''}" role="listitem">
        <input type="checkbox" class="vi-on" aria-label="เลือกคำนี้" ${r.on ? 'checked' : ''}>
        <input class="vi-w" value="${escT(r.word)}" aria-label="คำศัพท์">
        <select class="vi-p" aria-label="ชนิดของคำ"><option value=""></option>${['n.','v.','adj.','adv.','phrase','อื่น ๆ'].map(p => `<option ${p === r.pos ? 'selected' : ''}>${p}</option>`).join('')}</select>
        <input class="vi-m" value="${escT(r.meaning)}" placeholder="${T('ใส่ความหมาย')}" aria-label="ความหมาย">
        ${r.dup ? `<span class="vi-tag">${T('มีแล้ว')}</span>` : r.meaning ? '' : `<span class="vi-tag warn">${T('ยังไม่มีความหมาย')}</span>`}
        ${r.reading || r.example ? `<small class="vi-more">${esc(r.reading)}${r.reading && r.example ? ' · ' : ''}${r.example ? esc(r.example) : ''}</small>` : ''}
      </div>`);
      $('.vi-on', el).onchange = e => { r.on = e.target.checked; sum(); };
      $('.vi-w', el).oninput = e => { r.word = e.target.value; };
      $('.vi-p', el).onchange = e => { r.pos = e.target.value; };
      $('.vi-m', el).oninput = e => { r.meaning = e.target.value; if(r.meaning.trim() && !r.on && !r.dup){ r.on = true; $('.vi-on', el).checked = true; sum(); } };
      table.append(el);
    });
    $('.vi-result', body).hidden = false;
    const found = rows.length, dups = rows.filter(r => r.dup).length;
    say(L(`เจอ ${found} คำ${dups ? ` (มีในสมุดแล้ว ${dups} คำ)` : ''} ตรวจแล้วกดบันทึกได้เลย`, `Found ${found} words${dups ? ` (${dups} already in your notebook)` : ''}. Check them, then save.`));
    sum();
  };

  const offerOcr = (msg, keepStatus) => {
    $('.vi-ocr', body).hidden = false;
    $('.vi-ocr-note', body).textContent = T(msg);
    if(!keepStatus) say('');
    if($('.vi-ocr .btn', body)) return;
    const go = btn('อ่านจากภาพ', 'soft', async () => {
      const langs = $$('.vi-ocr input:checked', body).map(i => i.value).join('+') || 'eng';
      busy = true; go.disabled = true; body.classList.add('busy'); sum();
      try{
        const ocr = viParse(await viOcr(pending.doc, pending.pages, langs, say));
        // after a text read, keep its words and only borrow the tone marks the text layer lost
        show(rows.length ? viMerge(rows, ocr) : ocr); $('.vi-ocr', body).hidden = true;
      }
      catch(e){ console.error(e); say(L('อ่านภาพไม่สำเร็จ ลองใหม่ หรือวางข้อความแทน', 'Couldn’t read the images. Try again, or paste the text instead.')); }
      busy = false; go.disabled = false; body.classList.remove('busy'); sum();
    }, 'camera');
    $('.vi-ocr', body).append(go);
  };
  const readFile = async file => {
    if(busy || !file) return;
    if(!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) return say(L('ไฟล์นี้ไม่ใช่ PDF', 'That isn’t a PDF file'));
    busy = true; $('.vi-result', body).hidden = true; $('.vi-ocr', body).hidden = true; body.classList.add('busy');
    try{
      const {lines, doc, pages, lost} = await viPdfText(file, say);
      const textLen = lines.join('').replace(/\s/g, '').length;
      pending = {doc, pages};
      if(textLen < pages * 20){
        // almost no text layer: a scan or photo
        offerOcr(L('ไฟล์นี้เป็นภาพสแกน เลือกภาษาในไฟล์ แล้วกด "อ่านจากภาพ"', 'This file is a scan. Choose its languages, then press “Read the images”.'));
      } else {
        show(viParse(lines));
        if(lost > 2) offerOcr(L('ไฟล์นี้มีตัวอักษรบางตัวที่อ่านเป็นข้อความไม่ได้ ถ้าเห็นคำแปลก ๆ กด "อ่านจากภาพ" จะได้ครบกว่า', 'Some characters in this file can’t be read as text. If any words look wrong, press “Read the images” for a fuller result.'), true);
      }
    }catch(e){ console.error(e); say(L('เปิดไฟล์นี้ไม่ได้ ไฟล์อาจมีรหัสผ่านหรือเสียหาย', 'Couldn’t open this file. It may be password-protected or damaged.')); }
    busy = false; body.classList.remove('busy'); sum();
  };

  const drop = $('.vi-drop', body);
  drop.onclick = () => fileIn.click();
  drop.onkeydown = e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fileIn.click(); } };
  fileIn.onchange = () => readFile(fileIn.files[0]);
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); readFile(e.dataTransfer.files[0]); });
  $('.vi-read', body).onclick = () => { const t = $('.vi-paste textarea', body).value; if(t.trim()) show(viParse(t.split('\n'))); };
  $('.vi-all input', body).onchange = e => { rows.forEach(r => r.on = e.target.checked); $$('.vi-on', table).forEach(c => c.checked = e.target.checked); sum(); };

  saveBtn.onclick = async () => {
    const pick = rows.filter(r => r.on && r.word.trim());
    if(!pick.length) return;
    busy = true; sum();
    let done = 0, fail = 0;
    for(let i = 0; i < pick.length; i += 5){
      await Promise.all(pick.slice(i, i + 5).map(async r => {
        const item = {word:r.word.trim(), reading:r.reading || '', pos:r.pos || '', meaning:(r.meaning || '').trim(), example:r.example || '', lang:r.lang || 'อังกฤษ'};
        try{ await Store.save('vocab', item); done++; }catch(e){ fail++; }
      }));
      say(L(`กำลังบันทึก ${done + fail} / ${pick.length}`, `Saving ${done + fail} / ${pick.length}`));
    }
    busy = false;
    m.close();
    toast(fail ? L(`บันทึก ${done} คำ ไม่สำเร็จ ${fail} คำ`, `Saved ${done}, ${fail} failed`) : L(`จดลงสมุดแล้ว ${done} คำ`, `Added ${done} words`));
    rerender();
  };
}

Object.assign(DICT, {
  'นำเข้าคำศัพท์':'Import words', 'นำเข้าจาก PDF':'Import from PDF', 'เลือกไฟล์ PDF':'Choose a PDF file', 'เลือกไฟล์ PDF หรือลากมาวางตรงนี้':'Choose a PDF file or drop it here',
  'ระบบอ่านไฟล์บนเครื่องของคุณเอง ไม่ได้ส่งไฟล์ไปที่ไหน':'The file is read on your own device and never uploaded', 'สูงสุด':'up to', 'หน้า':'pages',
  'หรือวางข้อความแทน':'Or paste text instead', 'อ่านข้อความนี้':'Read this text', 'ภาษาในไฟล์':'Languages in the file', 'อ่านจากภาพ':'Read the images',
  'เลือกทั้งหมด':'Select all', 'บันทึกคำที่เลือก':'Save selected', 'เลือกคำนี้':'Select this word', 'ใส่ความหมาย':'Add a meaning', 'มีแล้ว':'Already saved', 'ยังไม่มีความหมาย':'No meaning yet'
});
