# My Little Bubble 🫧

บล็อกส่วนตัวธีมพาสเทล มีไดอารี่ ชั้นหนังสือ ไพ่ทาโร่ต์ ที่เที่ยว หนังและการ์ตูน เพลงโปรด สมุดคำศัพท์ แพลนเนอร์ และโปรไฟล์ เก็บข้อมูลใน Supabase และเข้าสู่ระบบด้วยอีเมลกับรหัสผ่าน

เป็นเว็บแบบ static (HTML + CSS + JavaScript) ไม่ต้อง build ไม่ต้องติดตั้ง Node แยกไฟล์ตามฟีเจอร์ให้แก้ง่าย

```
my-little-bubble/
├── index.html              โครงหน้าเว็บ + โหลดไฟล์ทั้งหมดตามลำดับ
├── config.js               ค่าเชื่อมต่อ Supabase (ต้องแก้)
├── css/
│   ├── base.css            สี ธีม ฟอนต์ กระจก เมนู ปุ่ม ฟอร์ม หน้าเข้าสู่ระบบ
│   ├── home.css            หน้าแรก (แฟ้มใหญ่ สติกเกอร์ โฟลเดอร์ลายต่าง ๆ)
│   ├── diary.css           ไดอารี่
│   ├── books.css           ชั้นหนังสือ
│   ├── tarot.css           ไพ่ทาโร่ต์
│   ├── travel.css          ที่เที่ยว (ราวรูป ตั๋ว สมุดพาสปอร์ต เครื่องพิมพ์ตั๋ว)
│   ├── screen.css          หนังและการ์ตูน (ตั๋วหนัง)
│   ├── music.css           เพลงโปรด (ปกและแผ่นเสียง)
│   ├── vocab.css           สมุดคำศัพท์
│   ├── planner.css         แพลนเนอร์
│   ├── profile.css         โปรไฟล์และพาสปอร์ต
│   └── motion.css          ลดอนิเมชันสำหรับคนที่ตั้งค่าลดการเคลื่อนไหว (ต้องโหลดท้ายสุด)
├── js/
│   ├── core/
│   │   ├── helpers.js      ฟังก์ชันพื้นฐาน วันที่ ดาว toast
│   │   ├── i18n.js         สลับภาษาไทย/อังกฤษ และคำแปลทั้งหมด
│   │   ├── icons.js        ไอคอน และรายชื่อเมนู (APPS)
│   │   ├── store.js        อ่าน/เขียนข้อมูลกับ Supabase
│   │   ├── auth.js         เข้าสู่ระบบ สมัคร ลืมรหัสผ่าน
│   │   ├── shell.js        ธีม เมนูด้านข้าง และระบบเปลี่ยนหน้า
│   │   ├── ui.js           หน้าต่าง popup ฟอร์ม การย่อรูป
│   │   └── effects.js      ประกายตามเมาส์ แสงสะท้อนกระจก พารัลแลกซ์
│   ├── features/
│   │   ├── home.js         หน้าแรก
│   │   ├── diary.js        ไดอารี่
│   │   ├── books.js        ชั้นหนังสือ
│   │   ├── tarot.js        ไพ่ทาโร่ต์
│   │   ├── travel.js       ที่เที่ยว + บอร์ดดิ้งพาส + สมุดพาสปอร์ต + เครื่องพิมพ์ตั๋ว
│   │   ├── screen.js       หนังและการ์ตูน
│   │   ├── music.js        เพลงโปรด + การสแครชแผ่นเสียง
│   │   ├── vocab.js        สมุดคำศัพท์ + โหมดท่อง
│   │   ├── planner.js      แพลนเนอร์
│   │   └── profile.js      โปรไฟล์ + หน้าข้อมูลพาสปอร์ต + เปลี่ยนรหัสผ่าน
│   └── main.js             จุดเริ่มต้น (เชื่อม Supabase แล้วเปิดแอป)
├── supabase/schema.sql     ตาราง + สิทธิ์การเข้าถึง
├── .gitignore
└── README.md
```

ไฟล์ JavaScript เป็นสคริปต์ธรรมดา ใช้ตัวแปรร่วมกัน จึงต้องโหลดตามลำดับใน `index.html`
(core ก่อน แล้วค่อย features และ `main.js` ท้ายสุด) ถ้าเพิ่มไฟล์ใหม่ ให้ใส่ก่อน `main.js`

### อยากแก้ส่วนไหน แก้ไฟล์ไหน

- เปลี่ยนหน้าตาของฟีเจอร์: แก้ `css/<ชื่อฟีเจอร์>.css`
- เปลี่ยนช่องในฟอร์มหรือการทำงาน: แก้ `js/features/<ชื่อฟีเจอร์>.js` (ช่องฟอร์มอยู่ในตัวแปร `...Fields` ด้านบนของไฟล์)
- เพิ่มหรือแก้คำแปลภาษาอังกฤษ: แก้ `DICT` ใน `js/core/i18n.js`
- เปลี่ยนสีหลักของทั้งเว็บ: แก้ตัวแปรใน `:root` ของ `css/base.css`

## 1. สร้างโปรเจกต์ Supabase

1. สมัครและสร้างโปรเจกต์ใหม่ที่ https://supabase.com
2. ไปที่ **SQL Editor → New query** วางเนื้อหาไฟล์ `supabase/schema.sql` ทั้งหมด แล้วกด **Run**
   ระบบจะสร้างตาราง `profiles` กับ `items` และเปิด Row Level Security ให้แต่ละคนเห็นเฉพาะข้อมูลของตัวเอง
3. ไปที่ **Project Settings → API** คัดลอก **Project URL** กับ **anon public key**

## 2. ใส่ค่าลงใน `config.js`

```js
window.BUBBLE_CONFIG = {
  SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOi...'
};
```

anon key เปิดเผยในหน้าเว็บได้ เพราะข้อมูลถูกป้องกันด้วย Row Level Security
**ห้ามใส่ `service_role` key ลงในไฟล์นี้เด็ดขาด**

## 3. ลองรันบนเครื่อง

ต้องเปิดผ่านเว็บเซิร์ฟเวอร์ (เปิดไฟล์ตรง ๆ แบบ `file://` ระบบเข้าสู่ระบบจะใช้ไม่ได้)

```bash
# เลือกอย่างใดอย่างหนึ่ง (ต้องอยู่ในโฟลเดอร์ my-little-bubble)
python3 -m http.server 5500
npx serve .
```

แล้วเปิด http://localhost:5500

## 4. ตั้งค่าอีเมลและลิงก์ใน Supabase

ไปที่ **Authentication → URL Configuration**

- **Site URL**: ใส่ URL เว็บจริงของคุณ เช่น `https://username.github.io/my-little-bubble/`
- **Redirect URLs**: เพิ่ม URL เว็บจริง และ `http://localhost:5500` สำหรับทดสอบ

ลิงก์ยืนยันอีเมลและลิงก์ตั้งรหัสผ่านใหม่จะพากลับมาที่ URL เหล่านี้

ถ้าไม่อยากให้ต้องยืนยันอีเมลตอนสมัคร (เช่น ใช้คนเดียว) ปิดได้ที่
**Authentication → Sign In / Providers → Email → Confirm email**

## 5. อัปโหลดขึ้น Git

```bash
cd my-little-bubble
git init
git add .
git commit -m "My Little Bubble"
git branch -M main
git remote add origin https://github.com/USERNAME/my-little-bubble.git
git push -u origin main
```

## 6. เปิดเว็บให้ใช้งานได้จริง (เลือกทางใดทางหนึ่ง)

- **GitHub Pages**: ใน repo ไปที่ **Settings → Pages** เลือก Branch `main` โฟลเดอร์ `/ (root)` แล้วกด Save
  รอสักครู่จะได้ URL `https://USERNAME.github.io/my-little-bubble/`
- **Vercel / Netlify**: Import repo จาก GitHub เลือก framework เป็น "Other" หรือ static ไม่ต้องตั้ง build command

เสร็จแล้วอย่าลืมกลับไปใส่ URL นี้ใน Supabase ตามข้อ 4

## ข้อมูลเก็บอย่างไร

- `profiles`: แถวละหนึ่งผู้ใช้ เก็บชื่อเล่น รูปโปรไฟล์ ธีม ภาษา และข้อมูลพาสปอร์ตในคอลัมน์ `meta` (jsonb)
- `items`: ทุกหมวดอยู่ตารางเดียว แยกด้วยคอลัมน์ `section` เนื้อหาอยู่ในคอลัมน์ `data` (jsonb)
- รูปภาพถูกย่อขนาดในเบราว์เซอร์ก่อนบันทึก (ประมาณ 50–150 KB ต่อรูป) แล้วเก็บในฐานข้อมูลโดยตรง
  แพ็กเกจฟรีของ Supabase มีพื้นที่ฐานข้อมูล 500 MB ใช้ได้หลายพันรูป
  ถ้ารูปเยอะมากในอนาคต ย้ายไปเก็บใน Supabase Storage ได้

## หมายเหตุ

- ข้อมูลที่เคยบันทึกไว้ในเวอร์ชัน Claude Artifact จะไม่ย้ายมาอัตโนมัติ เพราะเก็บคนละที่
- ไลบรารีที่โหลดจาก CDN: `@supabase/supabase-js@2.45.4` และฟอนต์จาก Google Fonts (Mali, IBM Plex Sans Thai Looped, Cinzel Decorative)
