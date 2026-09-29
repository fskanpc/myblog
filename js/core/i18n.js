/* =========================================================
   language (Thai / English)
   ========================================================= */
let LANG = ls('bubble:lang') === 'en' ? 'en' : 'th';
const L = (th, en) => LANG === 'en' ? en : th;
const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const EN_MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const EN_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function dayLine(s){ const [y, m, d] = s.split('-').map(Number); const wd = new Date(y, m - 1, d).getDay(); return L(`วัน${TH_DAYS[wd]}ที่ ${thDate(s)}`, `${EN_DAYS[wd]}, ${thDate(s)}`); }
const DICT = {
'หน้าแรก':'Home','ไดอารี่':'Diary','ชั้นหนังสือ':'Bookshelf','ไพ่ทาโร่ต์':'Tarot','ที่เที่ยว':'Travel','หนังและการ์ตูน':'Movies & Cartoons','เพลงโปรด':'Favorite Songs','สมุดคำศัพท์':'Vocabulary','แพลนเนอร์':'Planner','โปรไฟล์':'Profile',
'โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง':'Could not load data. Try refreshing the page.','พื้นที่ในเบราว์เซอร์เต็มแล้ว ลองลบรูปที่ไม่ใช้ออก':'Browser storage is full. Remove photos you no longer need.',
'สร้างพื้นที่ของฉัน':'Create my space','ยินดีต้อนรับกลับ':'Welcome back','ตั้งชื่อเล่นและรหัสผ่าน':'Pick a nickname and a','หลัก เพื่อล็อกบล็อกส่วนตัวนี้':'digit passcode to lock this private blog',
'ใส่รหัสผ่านเพื่อเข้าสู่ระบบ':'Enter your passcode to log in','ชื่อเล่น':'Nickname','รหัสผ่าน':'Passcode','ยืนยันรหัสผ่าน':'Confirm passcode','จดจำฉันไว้บนเครื่องนี้':'Remember me on this device',
'สร้างและเข้าสู่ระบบ':'Create and log in','เข้าสู่ระบบ':'Log in','รหัสผ่านต้องเป็นตัวเลข':'Passcode must be','หลัก':'digits','ใส่ชื่อเล่นก่อนนะ':'Add a nickname first',
'รหัสผ่านสองช่องไม่ตรงกัน':'The two passcodes don’t match','บันทึกบัญชีไม่สำเร็จ ลองอีกครั้ง':'Could not save the account. Try again.','รหัสผ่านไม่ถูกต้อง ลองอีกครั้ง':'Wrong passcode. Try again.',
'ธีม':'Theme','ตามระบบ':'System','สว่าง':'Light','มืด':'Dark','เมนูหลัก':'Main menu','เปลี่ยนธีม':'Change theme','ออกจากระบบ':'Log out','เปิดหน้านี้ไม่สำเร็จ ลองรีเฟรชอีกครั้ง':'Could not open this page. Try refreshing.',
'ปิด':'Close','ลบ':'Delete','แตะอีกครั้งเพื่อลบ':'Tap again to delete','อ่านรูปไม่ได้':'Could not read the image','รูปภาพ':'Photo','สี':'Color','ลบรูป':'Remove photo','เพิ่มรูป':'Add photo','เลือกรูป':'Choose photo',
'บันทึก':'Save','กำลังบันทึก':'Saving','บันทึกแล้ว':'Saved','บันทึกไม่สำเร็จ':'Could not save','ลองใหม่อีกครั้ง':'try again','ลบแล้ว':'Deleted','ลบไม่สำเร็จ':'Could not delete','ยกเลิก':'Cancel','เพิ่ม':'Add','แก้ไข':'Edit',
'ดึกแล้วนะ':'Up late?','อรุณสวัสดิ์':'Good morning','สวัสดีตอนบ่าย':'Good afternoon','สวัสดีตอนเย็น':'Good evening','เธอ':'you','ล่าสุด':'Latest','กำลังอ่าน':'Reading',
'ราศี':'Zodiac','พาสปอร์ตของฉัน':'My passport','คำวันนี้':'Word of the day','แฟ้มของฉัน':'My folders','แถบด้านบน':'Top bar','แฟ้มทั้งหมด':'All folders',
'วันที่':'Date','หัวข้อ':'Title','วันนี้':'Today','อารมณ์วันนี้':'Today’s mood','เรื่องราว':'Story','เล่าให้ฟังหน่อย':'Tell me about it','เพิ่มได้สูงสุด':'Up to','รูปต่อหนึ่งหน้า ระบบย่อขนาดให้อัตโนมัติ':'photos per page, resized automatically',
'เขียนไว้แล้ว':'Written','หน้า':'pages','พื้นที่เก็บเรื่องราวในแต่ละวัน':'A place for the stories of each day','เขียนบันทึก':'Write an entry','ยังไม่มีบันทึก เริ่มเขียนหน้าแรกของวันนี้ได้เลย':'No entries yet. Start today’s first page.','ไม่มีหัวข้อ':'Untitled',
'อ่านจบแล้ว':'Finished','อยากอ่าน':'Want to read','ชื่อหนังสือ':'Book title','ผู้เขียน':'Author','วันที่อ่านจบ':'Date finished','สถานะ':'Status','คะแนน':'Rating','วางบนชั้นแบบ':'Show on shelf as','ให้ระบบจัดให้':'Auto','โชว์หน้าปก':'Cover facing out','โชว์สันปก':'Spine out','สีของเล่ม':'Book color','รูปปก':'Cover image','รีวิว':'Review','ชอบตรงไหน ประโยคไหนติดใจ':'What did you love? Any lines that stuck?',
'หนังสือ':'Book','ชั้นหนังสือของฉัน':'My Bookshelf','หนังสือที่อ่านแล้ว กำลังอ่าน และอยากอ่าน':'Books I’ve read, am reading, and want to read','อ่านจบ':'Finished','เล่ม':'books','คะแนนเฉลี่ย':'Average','เพิ่มหนังสือ':'Add book','ทั้งหมด':'All',
'ยังไม่มีหนังสือในหมวดนี้':'No books in this category yet','ชั้นยังว่างอยู่ วางหนังสือเล่มแรกกัน':'The shelf is empty. Place your first book.','ปก':'Cover of','ไม่ระบุผู้เขียน':'Unknown author','ยังไม่ได้เขียนรีวิว':'No review yet',
'ชื่อสำรับ':'Deck name','ผู้ออกแบบ':'Designer','สำนักพิมพ์':'Publisher','จำนวนใบ':'Number of cards','วันที่ซื้อ':'Date bought','ราคา':'Price','บาท':'Baht','ซื้อจากที่ไหน':'Where did you buy it','พลังของสำรับ':'Deck energy',
'อ่อนโยน':'Gentle','ลึกลับ':'Mysterious','สดใส':'Bright','ดุดัน':'Fierce','ฝันหวาน':'Dreamy','รูปสำรับ':'Deck photo','บันทึกเพิ่มเติม':'Notes','ความรู้สึกแรกที่เปิดกล่อง ใบที่ชอบที่สุด':'First impressions, favorite card…','สำรับไพ่':'Tarot decks',
'สะสมไว้':'Collected','สำรับ':'decks','สำรับ มูลค่ารวม':'decks, total value','ห้องเก็บสำรับไพ่ที่ฉันรัก':'A vault for the decks I love','เพิ่มสำรับ':'Add deck','ยังไม่มีสำรับในคลัง เพิ่มสำรับแรกเพื่อเริ่มสะสม':'The vault is empty. Add your first deck.',
'แตะเพื่อพลิกดูรายละเอียด':'tap to flip for details','จำนวน':'Cards','ซื้อเมื่อ':'Bought','ร้าน':'Shop','พลัง':'Energy','พลิกกลับ':'Flip back',
'สถานที่':'places','เช่น ดอยอินทนนท์':'e.g. Doi Inthanon','จังหวัด':'Province','ประเทศ':'countries','วันที่ไป':'Date visited','ไปกับใคร':'Went with','ออกเดินทางจาก':'Departed from','บ้าน':'Home','ความประทับใจ':'Impression','รูปความทรงจำ':'Memory photo','เรื่องเล่าจากทริป':'Trip story','ทุกที่':'Anywhere',
'ชื่อ':'Name','เที่ยวบิน':'Flight','ชั้น':'Class','ต้นทาง':'From','ถึง':'To','เวลา':'Time','วันเกิด':'Birthday','บ้านเกิด':'Hometown','ของโปรด':'Favorite','ออกบัตรเมื่อ':'Issued','หมายเลขพาสปอร์ต':'Passport no.','พาสปอร์ตของ':'Passport of',
'เที่ยวแล้ว':'Visited','ที่':'places','ไปมา':'Been to','เมือง':'cities','ปลายทาง':'Destination','ปิดพาสปอร์ต':'Close passport','เปิดพาสปอร์ต':'Open passport','หนังสือเดินทาง':'Travel document','แตะเพื่อเปิด':'Tap to open',
'พิมพ์บอร์ดดิ้งพาส':'Printing boarding pass','กำลังพิมพ์ตั๋ว':'Printing ticket','เก็บตั๋วใบนี้':'Keep this ticket','พิมพ์เสร็จแล้ว':'Printed!','เพิ่มที่เที่ยว':'Add place','ราวรูปภาพ':'Photo line','ตั๋วเดินทาง':'Tickets',
'ความทรงจำระหว่างทาง':'memories along the way','ที่เที่ยวของฉัน':'My Travels','หนีบรูปแรก':'Pin your first photo','แตะเพื่อเพิ่มที่เที่ยว':'tap to add a place','ตั๋วความทรงจำจากทุกการเดินทาง':'Memory tickets from every trip','ยังไม่มีตั๋วใบแรก ไปเที่ยวที่ไหนมาบ้าง':'No tickets yet. Where have you been?',
'ไปกับ':'With','ตัวเอง':'Just me','ที่นั่ง':'Seat','หนัง':'Movie','การ์ตูน':'Cartoon','อนิเมะ':'Anime','ซีรีส์':'Series','ชื่อเรื่อง':'Title','ประเภท':'Type','ปีที่ออกฉาย':'Release year','ดูเมื่อ':'Watched','ดูจบแล้ว':'Watched','กำลังดู':'Watching','อยากดู':'Want to watch',
'โปสเตอร์หรือภาพหน้าตั๋ว':'Poster or ticket image','ภาพจากเรื่อง':'Stills','ฉากที่ชอบ ใส่ได้สูงสุด':'Favorite scenes, up to','ภาพ':'images','ฉากที่ชอบ ตัวละครที่รัก':'Favorite scenes, beloved characters…','เรื่องโปรด':'Favorites','โรงหนังของฉัน':'My Cinema',
'สะสมตั๋วไว้':'Collected','ใบ ดูจบแล้ว':'tickets, watched','เรื่อง':'titles','เก็บตั๋วหนัง การ์ตูน และซีรีส์ที่รัก':'Keep tickets for the movies, cartoons and series you love','เพิ่มตั๋วใหม่':'Add ticket','ยังไม่มีตั๋วในหมวดนี้ เพิ่มเรื่องที่ชอบได้เลย':'No tickets in this category yet. Add a favorite.','รอบ':'Showtime','ปี':'Year','ตั๋วหนัง':'Movie ticket',
'ชื่อเพลง':'Song title','ศิลปิน':'Artist','ลิงก์ฟังเพลง':'Listening link','หรือ':'or','ฟังตอนไหน':'When do you play it','ตอนเช้า':'Mornings','ตอนทำงาน':'While working','ตอนเศร้า':'When sad','ตอนเดินทาง':'On the road','ก่อนนอน':'Before bed','ฮึกเหิม':'Hype',
'สีแผ่นเสียง':'Vinyl color','ดำคลาสสิก':'Classic black','ชมพู':'Pink','ม่วงลาเวนเดอร์':'Lavender','มิ้นท์':'Mint','เหลืองเนย':'Butter','ปกอัลบั้ม':'Album cover','ทำไมถึงชอบ':'Why I love it','เพลง':'Song','สแครชแผ่นเสียง':'Scratch the record',
'แตะหรือลากแผ่นเสียงเพื่อสแครชแบบดีเจ':'Tap or drag a record to scratch like a DJ','เพิ่มเพลง':'Add song','ยังไม่มีเพลงในกล่อง เพิ่มเพลงที่ฟังวนซ้ำได้เลย':'No songs yet. Add one you play on repeat.','กำลังเล่น':'Now playing',
'ลากแผ่นเสียงไปมาเพื่อสแครช หรือแตะเพื่อให้มันสแครชเอง':'Drag the record back and forth to scratch, or tap to let it scratch itself','เปิดฟัง':'Listen','เสียงสแครช':'Scratch sound','เปิดอยู่':'On','ปิดอยู่':'Off','เล่นเพลง':'Play',
'คำศัพท์':'Word','คำอ่าน':'Pronunciation','เช่น':'e.g.','ชนิดของคำ':'Part of speech','อื่น ๆ':'Other','ความหมาย':'Meaning','ประโยคตัวอย่าง':'Example sentence','ภาษา':'Language','อังกฤษ':'English','ญี่ปุ่น':'Japanese','เกาหลี':'Korean','จีน':'Chinese',
'คำ จำได้แล้ว':'words, learned','คำ':'words','จดไว้ ท่องทุกวัน':'Write it down, review every day','จดคำใหม่':'Add word','สมุดจด':'Notebook','โหมดท่อง':'Practice','สมุดยังว่าง จดคำศัพท์คำแรกเลย':'The notebook is empty. Add your first word.',
'ค้นหาคำหรือความหมาย':'Search words or meanings','ค้นหาคำศัพท์':'Search vocabulary','ไม่พบคำที่ค้นหา':'No matching words','จำได้แล้ว':'Got it','ท่องครบรอบแล้ว':'Round complete','จำได้':'Remembered','จาก':'of','ดาว':'stars','สุ่มรอบใหม่':'Shuffle a new round','คำที่':'Word','แตะเพื่อดูความหมาย':'Tap to see the meaning','ยังไม่แน่ใจ':'Not sure yet',
'ส่วนตัว':'Personal','เรียน':'Study','งาน':'tasks','สุขภาพ':'Health','นัดหมาย':'Appointment','วางแผนทีละวัน ติ๊กทีละอย่าง':'Plan one day at a time, tick one thing at a time','เดือนก่อน':'Previous month','เดือนถัดไป':'Next month',
'อา':'Su','จ':'Mo','อ':'Tu','พ':'We','พฤ':'Th','ศ':'Fr','ส':'Sa','มี':'has',
'เสร็จแล้ว':'done','เพิ่มสิ่งที่ต้องทำ':'Add a to-do','สิ่งที่ต้องทำ':'To-do','ยังไม่มีแผนสำหรับวันนี้':'Nothing planned for this day','ทำเสร็จแล้ว':'Mark done',
'มังกร':'Capricorn','กุมภ์':'Aquarius','มีน':'Pisces','เมษ':'Aries','พฤษภ':'Taurus','เมถุน':'Gemini','กรกฎ':'Cancer','สิงห์':'Leo','กันย์':'Virgo','ตุลย์':'Libra','พิจิก':'Scorpio','ธนู':'Sagittarius',
'รูปโปรไฟล์':'Profile photo','เช่น พิษณุโลก':'e.g. Phitsanulok','เช่น พีช ชานม':'e.g. peaches, milk tea','ที่ที่อยากไปที่สุด':'Dream destination','เช่น ไอซ์แลนด์':'e.g. Iceland','แนะนำตัว':'About me','คำคมประจำใจ':'Favorite quote','สีที่ชอบ':'Favorite color','ชื่อบล็อก':'Blog name',
'หน้าข้อมูลในพาสปอร์ตของฉัน':'The data page of my passport','แก้ไขพาสปอร์ต':'Edit passport','เกี่ยวกับฉัน':'About me','ยังไม่ได้เขียนแนะนำตัว กดแก้ไขพาสปอร์ตเพื่อเพิ่ม':'No intro yet. Tap Edit passport to add one.',
'หน้าไดอารี่':'Diary pages','หนังสือบนชั้น':'Books on the shelf','งานในแพลนเนอร์':'Planner tasks','การตั้งค่า':'Settings','ที่เก็บข้อมูล':'Storage','เก็บแบบส่วนตัวในบัญชี':'Stored privately in your','ของคุณ เปิดจากเครื่องไหนก็เห็นข้อมูลเดิม':'account — open it on any device and see the same data',
'เก็บไว้ในเบราว์เซอร์นี้เท่านั้น':'Stored in this browser only','ตามระบบ สว่าง หรือมืด':'System, light or dark','เปลี่ยนรหัสที่ใช้เข้าสู่ระบบ':'Change the passcode you log in with','ครั้งหน้าจะต้องใส่รหัสผ่านอีกครั้ง':'You’ll need your passcode next time',
'เปลี่ยนรหัสผ่าน':'Change passcode','รหัสเดิม':'Current passcode','รหัสใหม่':'New passcode','ตัวเลข':'digits','ยืนยันรหัสใหม่':'Confirm new passcode','รหัสเดิมไม่ถูกต้อง':'Current passcode is wrong','รหัสใหม่ต้องเป็นตัวเลข':'New passcode must be',
'รหัสใหม่สองช่องไม่ตรงกัน':'The two new passcodes don’t match','เปลี่ยนรหัสผ่านแล้ว':'Passcode changed','กำลังเปิดบับเบิ้ล':'Opening your bubble','เชื่อมต่อพื้นที่ส่วนตัวของคุณ':'Connecting to your private space',
'ไทย':'ไทย','เปลี่ยนภาษา':'Change language','ภาษาของหน้าเว็บ':'Language of the site','กำลังดูหน้าแรก':'Home'
};
Object.assign(DICT, {
'อีเมล':'Email','ลืมรหัสผ่าน':'Forgot password','ลืมรหัสผ่าน?':'Forgot password?','สมัครใช้งาน':'Sign up','ยังไม่มีบัญชี? สมัครใช้งาน':'No account yet? Sign up','กลับไปหน้าเข้าสู่ระบบ':'Back to log in',
'ส่งลิงก์ตั้งรหัสใหม่':'Send reset link','เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน':'Log in with your email and password','สมัครด้วยอีเมล แล้วเริ่มเก็บเรื่องราวของคุณ':'Sign up with email and start keeping your stories',
'ใส่อีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้':'Enter the email you signed up with and we’ll send a reset link','ใส่อีเมลให้ถูกต้องก่อนนะ':'Please enter a valid email',
'ส่งลิงก์ไปที่อีเมลแล้ว เปิดลิงก์เพื่อตั้งรหัสผ่านใหม่':'Link sent. Open it to set a new password.','รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร':'Password must be at least 6 characters',
'สมัครเรียบร้อย เราส่งลิงก์ยืนยันไปที่อีเมลแล้ว ยืนยันแล้วกลับมาเข้าสู่ระบบได้เลย':'You’re signed up! We sent a confirmation link to your email. Confirm it, then come back and log in.',
'อีเมลหรือรหัสผ่านไม่ถูกต้อง':'Wrong email or password','ยังไม่ได้ยืนยันอีเมล ลองเปิดลิงก์ในอีเมลก่อน':'Email not confirmed yet. Open the link in your email first.',
'อีเมลนี้มีบัญชีอยู่แล้ว ลองเข้าสู่ระบบแทน':'This email already has an account. Try logging in.','ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่':'Too many attempts. Wait a moment and try again.','เกิดข้อผิดพลาด ลองอีกครั้ง':'Something went wrong. Try again.',
'ยังไม่ได้เชื่อมต่อ Supabase':'Supabase is not connected yet','บัญชี':'Account','เก็บแบบส่วนตัวในฐานข้อมูล Supabase เปิดจากเครื่องไหนก็เห็นข้อมูลเดิม':'Stored privately in your Supabase database — open it on any device and see the same data',
'เปลี่ยนรหัสผ่านที่ใช้เข้าสู่ระบบ':'Change the password you log in with','ครั้งหน้าจะต้องเข้าสู่ระบบอีกครั้ง':'You’ll need to log in again next time','รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)':'New password (at least 6 characters)',
'ยืนยันรหัสผ่านใหม่':'Confirm new password','ตั้งรหัสผ่านใหม่':'Set a new password','รหัสผ่าน':'Password','ยืนยันรหัสผ่าน':'Confirm password'
});
Object.assign(DICT, {
'เกมคีบตุ๊กตา':'Claw machine',
'ท้องฟ้าแจ่มใส':'Clear sky',
'มีเมฆบางส่วน':'Partly cloudy',
'เมฆมาก':'Cloudy',
'มีหมอก':'Foggy',
'ฝนตก':'Rainy',
'ฝนฟ้าคะนอง':'Thunderstorm',
'กำลังดูสภาพอากาศ…':'Checking the weather…',
'ดูสภาพอากาศไม่ได้':'Weather unavailable',
'อัตโนมัติ':'Auto',
'โหมดแดดดี':'Sunny mode',
'โหมดฝนตก':'Rainy mode',
'สภาพอากาศตามจริง':'Showing real weather',
'เปลี่ยนเป็นวันแดดดี':'Switched to a sunny day',
'เปลี่ยนเป็นวันฝนตก':'Switched to a rainy day',
'ฝนตกอยู่ พกร่มด้วยนะ':'It’s raining — bring an umbrella',
'วันนี้อากาศดี ออกไปเดินเล่นกัน':'Lovely weather today — go for a walk',
'ดึกแล้ว พักผ่อนเยอะ ๆ นะ':'It’s late — get some rest',
'คำศัพท์วันนี้':'Word of the day',
'เลื่อนลงเพื่อเปิดแฟ้ม':'Scroll down to your folders',
'เลื่อนลงไปที่แฟ้ม':'Scroll to folders',
'หน้าแรก':'Home',
'ได้เหรียญฟรีวันละ 5 เหรียญ คีบให้ได้แล้วเก็บไว้บนชั้นของสะสม':'5 free coins every day — catch a plush and keep it on your shelf',
'ตู้คีบตุ๊กตา':'Claw machine',
'ใส่เหรียญ':'Insert coin',
'เลื่อนซ้าย':'Move left',
'เลื่อนขวา':'Move right',
'กดคีบ':'Grab',
'เหรียญวันนี้':'Today’s coins',
'ชั้นของสะสม':'Collection shelf',
'ยังว่างอยู่ คีบตัวแรกให้ได้กัน':'Still empty — catch your first one!',
'กด':'Press',
'เพื่อเริ่ม เลื่อนที่คีบด้วยปุ่มลูกศร แล้วกดปุ่มแดงเพื่อคีบ ใช้คีย์บอร์ดได้ด้วย ← → เลื่อน และ Space คีบ':'to start, move the claw with the arrow buttons, then press the red button to grab. Keyboard works too: ← → to move and Space to grab.',
'พลาดไปนิดเดียว ลองใหม่นะ':'So close! Try again',
'โอ๊ะ หลุดมือ ลองใหม่นะ':'Oops, it slipped! Try again',
'ใส่เหรียญเพื่อเล่นอีกครั้ง':'Insert a coin to play again',
'เหรียญวันนี้หมดแล้ว พรุ่งนี้มาใหม่นะ':'No coins left today — come back tomorrow',
'เลื่อนที่คีบแล้วกดปุ่มแดง':'Move the claw, then press the red button',
'กด 1 coin เพื่อเริ่มเล่น':'Press 1 coin to start',
'กระต่าย':'Bunny',
'หมี':'Bear',
'หมูน้อย':'Piglet',
'ลูกเจี๊ยบ':'Chick',
'แกะ':'Lamb',
'แมว':'Kitty',
'กรุงเทพฯ':'Bangkok'
});
const T = s => LANG === 'en' && DICT[s] !== undefined ? DICT[s] : s;
const THAI = /[\u0E00-\u0E7F]/;
const THAI_RUN = /[\u0E00-\u0E7F]+(?:[ \u00A0]+[\u0E00-\u0E7F]+)*/g;
function trStr(str){
  if(LANG !== 'en' || !str || !THAI.test(str)) return str;
  const parts = str.split(MK);
  for(let i = 0; i < parts.length; i += 2){
    const p = parts[i]; if(!THAI.test(p)) continue;
    const trimmed = p.trim();
    if(DICT[trimmed] !== undefined){ parts[i] = p.replace(trimmed, DICT[trimmed]); continue; }
    parts[i] = p.replace(THAI_RUN, r => DICT[r] !== undefined ? DICT[r] : r.split(/[ \u00A0]+/).map(w => DICT[w] !== undefined ? DICT[w] : w).join(' '));
  }
  return parts.join(MK);
}
const TR_ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
function trNode(n){
  const p = n.parentNode; if(!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
  const v = trStr(n.nodeValue); if(v !== n.nodeValue) n.nodeValue = v;
}
function trEl(el){ for(const a of TR_ATTRS){ const v = el.getAttribute(a); if(v && THAI.test(v)){ const t = trStr(v); if(t !== v) el.setAttribute(a, t); } } }
function trTree(root){
  if(LANG !== 'en' || !root) return;
  if(root.nodeType === 3) return trNode(root);
  if(root.nodeType !== 1 && root.nodeType !== 11) return;
  if(root.nodeType === 1) trEl(root);
  root.querySelectorAll && root.querySelectorAll('*').forEach(trEl);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; const list = [];
  while((n = w.nextNode())) list.push(n);
  list.forEach(trNode);
}
new MutationObserver(ms => {
  if(LANG !== 'en') return;
  for(const m of ms){
    if(m.type === 'characterData') trNode(m.target);
    else if(m.type === 'attributes') trEl(m.target);
    else m.addedNodes.forEach(trTree);
  }
}).observe(document.body, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:TR_ATTRS});
async function setLang(l){
  LANG = l === 'en' ? 'en' : 'th';
  ls('bubble:lang', LANG);
  document.documentElement.lang = LANG;
  if(Auth.logged()){ META.lang = LANG; try{ await Store.setMeta(META); }catch(e){} renderShell(); route(); } else if(Store.mode === 'unconfigured') showSetup(); else showAuth('login');
}
function langToggle(){
  const b = h(`<div class="lang-row" role="group" aria-label="ภาษา"><button class="opt ${LANG === 'th' ? 'on' : ''}" data-l="th">ไทย</button><button class="opt ${LANG === 'en' ? 'on' : ''}" data-l="en">English</button></div>`);
  $$('button', b).forEach(x => x.onclick = () => { if(x.dataset.l !== LANG) setLang(x.dataset.l); });
  return b;
}
