/**
 * تطبيق آيات - الملف البرمجي الكامل والشامل (script.js)
 * متضمن: لغات، 99 اسماً، مشغل سلس، تقويم سيستاني، فايربيس، والحذف عبر نافذة منبثقة.
 */

// إعدادات وتهيئة فايربيس
const firebaseConfig = {
  apiKey: "AIzaSyCbVBRJ3HWfa5JTwGmOB9dB5gGG5ZoCLSw",
  authDomain: "ayat-3ea6a.firebaseapp.com",
  databaseURL: "https://ayat-3ea6a-default-rtdb.firebaseio.com",
  projectId: "ayat-3ea6a",
  storageBucket: "ayat-3ea6a.firebasestorage.app",
  messagingSenderId: "193511043947",
  appId: "1:193511043947:web:4668484a64259d5df922e",
  measurementId: "G-C879FY4S63"
};

// تشغيل فايربيس وقاعدة البيانات
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const i18n = {
  ar: {
    app_title: "تطبيق آيات", app_subtitle: "رحلة إيمانية في عالم القرآن الكريم", enter_app: "دخول التطبيق",
    menu: "القائمة", home: "الرئيسية", settings: "التخصيص والإعدادات", about: "حول التطبيق", notifications: "الإشعارات",
    ward_title: "قراءة القرآن اليومية", ward_calc: "جاري الاحتساب...", resume_title: "متابعة القراءة", khatma_plan: "مخطط الختمة",
    nod_title: "اسم اليوم", hijri_date: "التاريخ الهجري الحالي",
    quran: "تلاوة القرآن", quran_desc: "قراءة واستماع", azkar: "حصن المسلم", azkar_desc: "موسوعة الأذكار",
    asma: "أسماء الله الحسنى", asma_desc: "معانيها في القرآن", misbaha: "المسبحة الذكية", misbaha_desc: "عداد الاستغفار",
    financial: "الحاسبة الشرعية", financial_desc: "الزكاة والخمس", settings_short: "التخصيص", settings_desc: "الواجهة واللغات",
    khatma: "الختمة", khatma_desc: "جدول القراءة",
    surah_list: "قائمة السور", choose_reader: "اختر القارئ", start_audio: "تشغيل التلاوة", copy_tip: "اضغط على الآية لنسخها",
    prev: "السابق", next: "التالي", playing: "جاري التلاوة...",
    morning: "الصباح", evening: "المساء", travel: "السفر", prayer: "الصلاة",
    asma_hero_desc: "انقر على أي اسم لتتعرف على معناه وموضع ذكره في القرآن الكريم.",
    tap_to_count: "انقر للتسبيح", reset: "تصفير",
    zakat: "الزكاة", khums: "الخمس", records: "السجل", zakat_title: "حاسبة الزكاة (2.5%)", total_money: "رأس المال المتوفر:", zakat_due: "الزكاة المستحقة:", save_record: "حفظ",
    khums_title: "حاسبة الخمس (20%)", surplus_money: "الأموال الزائدة:", khums_due: "الخمس الواجب:", imam_share: "سهم الإمام:", sadah_share: "سهم السادة:", history_title: "السجل المالي",
    khatma_duration: "أدخل المدة المستهدفة (بالأيام):", khatma_daily: "المطلوب يومياً:", khatma_start: "اعتماد",
    ward_goal_title: "قراءة القرآن اليومية", ward_goal_desc: "تحديد عدد الصفحات المطلوب قراءتها يومياً",
    lang_title: "لغة التطبيق", lang_desc: "اختر لغتك المفضلة",
    color_wheel_desc: "اسحب الشريط لتغيير لون الواجهة", pick_color: "اختر لون مخصص",
    template_theme: "تخصيص قالب المظهر", manual_theme: "تخصيص لون الواجهة",
    layout_title: "شكل وكثافة الواجهة", layout_desc: "5 أشكال احترافية",
    about_desc: "تطبيق آيات هو رفيقك الرقمي لرحلة إيمانية متكاملة، يجمع بين بساطة التصميم وعمق المحتوى. يتيح لك التطبيق تلاوة القرآن الكريم، مع إمكانية الاستماع لأعذب الأصوات، ونصوص الآيات بلمسة واحدة. كما يضم التطبيق أذكاراً يومية، وحاسبة شرعية، ومسبحة إلكترونية ذكية تعينك على الذكر.",
    copy: "نسخ النص", close: "إغلاق"
  },
  en: {
    app_title: "Ayat App", app_subtitle: "A spiritual journey in the Quran", enter_app: "Enter App",
    menu: "Menu", home: "Home", settings: "Settings & Customization", about: "About App", notifications: "Notifications",
    ward_title: "Daily Quran Reading", ward_calc: "Calculating...", resume_title: "Resume Reading", khatma_plan: "Khatma Plan",
    nod_title: "Name of the Day", hijri_date: "Current Hijri Date",
    quran: "Quran", quran_desc: "Read & Listen", azkar: "Azkar", azkar_desc: "Supplications",
    asma: "Allah's Names", asma_desc: "Meanings in Quran", misbaha: "Smart Misbaha", misbaha_desc: "Tasbeeh Counter",
    financial: "Financial Calc", financial_desc: "Zakat & Khums", settings_short: "Themes", settings_desc: "Appearance & Lang",
    khatma: "Khatma", khatma_desc: "Reading Schedule",
    surah_list: "Surahs List", choose_reader: "Choose Reciter", start_audio: "Play Recitation", copy_tip: "Tap a verse to copy",
    prev: "Previous", next: "Next", playing: "Playing...",
    morning: "Morning", evening: "Evening", travel: "Travel", prayer: "Prayer",
    asma_hero_desc: "Tap any name to learn its meaning and where it is mentioned in the Quran.",
    tap_to_count: "Tap to count", reset: "Reset",
    zakat: "Zakat", khums: "Khums", records: "Records", zakat_title: "Zakat Calculator (2.5%)", total_money: "Available Capital:", zakat_due: "Zakat Due:", save_record: "Save",
    khums_title: "Khums Calculator (20%)", surplus_money: "Surplus Funds:", khums_due: "Khums Due:", imam_share: "Imam Share:", sadah_share: "Sadah Share:", history_title: "Financial History",
    khatma_duration: "Target Duration (Days):", khatma_daily: "Daily Required:", khatma_start: "Apply",
    ward_goal_title: "Daily Quran Reading", ward_goal_desc: "Set the number of pages to read daily",
    lang_title: "App Language", lang_desc: "Choose your language",
    color_wheel_desc: "Drag slider to change UI color", pick_color: "Pick Custom Color",
    template_theme: "Theme Template", manual_theme: "Custom Theme Color",
    layout_title: "Layout Density", layout_desc: "5 Professional Layouts",
    about_desc: "Ayat is your digital companion for an integrated spiritual journey. It offers Quran recitation, daily Azkar, a Sharia calculator, and a smart electronic Misbaha.",
    copy: "Copy Text", close: "Close"
  },
  ku: {
    app_title: "ئەپی ئایەت", app_subtitle: "گەشتێکی ڕۆحی لە قورئاندا", enter_app: "چوونە ژوورەوە",
    menu: "لیست", home: "سەرەکی", settings: "ڕێکخستنەکان", about: "دەربارە", notifications: "ئاگادارکردنەوەکان",
    ward_title: "خوێندنی قورئانی ڕۆژانە", ward_calc: "هەژمار دەکرێت...", resume_title: "بەردەوام بوون", khatma_plan: "پلان خەتم",
    nod_title: "ناوی ئەمڕۆ", hijri_date: "بەرواری کۆچی",
    quran: "قورئانی پیرۆز", quran_desc: "خوێندن و گوێگرتن", azkar: "زیکرەکان", azkar_desc: "قەڵغانی موسڵمان",
    asma: "ناوەکانی خوا", asma_desc: "ماناکانی لە قورئاندا", misbaha: "تەزبیحی زیرەک", misbaha_desc: "ژمێرەری زیکر",
    financial: "ژمێرەری شەرعی", financial_desc: "زەکات و خمس", settings_short: "ڕووکار", settings_desc: "ڕەنگ و زمان",
    khatma: "خەتم", khatma_desc: "خشتەی خوێندن",
    surah_list: "لیستی سوورەتەکان", choose_reader: "خوێنەر هەڵبژێرە", start_audio: "پێکردنی دەنگ", copy_tip: "بۆ کۆپیکردن کرتە بکە",
    prev: "پێشوو", next: "دواتر", playing: "دەخوێنرێتەوە...",
    morning: "بەیانیان", evening: "ئێواران", travel: "سەفەر", prayer: "نوێژ",
    asma_hero_desc: "کرتە لە هەر ناوێک بکە بۆ زانینی ماناکەی و شوێنی لە قورئاندا.",
    tap_to_count: "کرتە بکە بۆ ژماردن", reset: "سفرکردنەوە",
    zakat: "زەکات", khums: "خمس", records: "تۆمارەکان", zakat_title: "زەکات (2.5%)", total_money: "کۆی پارە:", zakat_due: "زەکاتی پێویست:", save_record: "پاشەکەوت",
    khums_title: "خمس (20%)", surplus_money: "پارەی زیادە:", khums_due: "خمسی پێویست:", imam_share: "بەشی ئیمام:", sadah_share: "بەشی سادە:", history_title: "مێژووی دارایی",
    khatma_duration: "ماوەی دیاریکراو (ڕۆژ):", khatma_daily: "خوێندنی ڕۆژانە:", khatma_start: "جێبەجێکردن",
    ward_goal_title: "خوێندنی قورئانی ڕۆژانە", ward_goal_desc: "دیاریکردنی ژمارەی لاپەڕەکان بۆ خوێندنەوە",
    lang_title: "زمانی ئەپ", lang_desc: "زمانەکەت هەڵبژێرە",
    color_wheel_desc: "سلایدەرەکە ڕابکێشە بۆ گۆڕینی ڕەنگ", pick_color: "ڕەنگێک هەڵبژێرە",
    template_theme: "ڕووکاری ئامادە", manual_theme: "گۆڕینی ڕەنگی دوگمەکان",
    layout_title: "شێوازی ڕووکار", layout_desc: "٥ شێوازی جیاواز",
    about_desc: "ئایەت هاوڕێی دیجیتاڵی تۆیە بۆ گەشتێکی ڕۆحی.",
    copy: "کۆپی کردن", close: "داخستن"
  },
  fa: {
    app_title: "برنامه آیات", app_subtitle: "سفر معنوی در قرآن", enter_app: "ورود به برنامه",
    menu: "منو", home: "خانه", settings: "تنظیمات", about: "درباره ما", notifications: "اعلان‌ها",
    ward_title: "تلاوت روزانه قرآن", ward_calc: "در حال محاسبه...", resume_title: "ادامه تلاوت", khatma_plan: "برنامه ختم",
    nod_title: "نام امروز", hijri_date: "تاریخ هجری",
    quran: "تلاوت قرآن", quran_desc: "خواندن و شنیدن", azkar: "اذکار", azkar_desc: "حصار مسلمان",
    asma: "اسماء الحسنی", asma_desc: "معانی در قرآن", misbaha: "تسبیح هوشمند", misbaha_desc: "شمارنده ذکر",
    financial: "ماشین حساب", financial_desc: "زکات و خمس", settings_short: "ظاهر", settings_desc: "رنگ و زبان",
    khatma: "ختم قرآن", khatma_desc: "جدول خواندن",
    surah_list: "لیست سوره‌ها", choose_reader: "انتخاب قاری", start_audio: "پخش تلاوت", copy_tip: "برای کپی کلیک کنید",
    prev: "قبلی", next: "بعدی", playing: "در حال پخش...",
    morning: "صبح", evening: "عصر", travel: "سفر", prayer: "نماز",
    asma_hero_desc: "برای دانستن معنی هر نام و جایگاه آن در قرآن کلیک کنید.",
    tap_to_count: "برای شمارش کلیک کنید", reset: "صفر کردن",
    zakat: "زکات", khums: "خمس", records: "سوابق", zakat_title: "محاسبه زکات (2.5%)", total_money: "سرمایه کل:", zakat_due: "زکات واجب:", save_record: "ذخیره",
    khums_title: "محاسبه خمس (20%)", surplus_money: "وجوه مازاد:", khums_due: "خمس واجب:", imam_share: "سهم امام:", sadah_share: "سهم سادات:", history_title: "سوابق مالی",
    khatma_duration: "مدت زمان هدف (روز):", khatma_daily: "نیاز روزانه:", khatma_start: "تایید",
    ward_goal_title: "تلاوت روزانه قرآن", ward_goal_desc: "تعداد صفحات برای خواندن",
    lang_title: "زبان برنامه", lang_desc: "زبان خود را انتخاب کنید",
    color_wheel_desc: "برای تغییر رنگ نوار را بکشید", pick_color: "انتخاب رنگ",
    template_theme: "قالب آماده", manual_theme: "رنگ سفارشی دکمه ها",
    layout_title: "تراکم رابط کاربری", layout_desc: "5 ظاهر حرفه ای",
    about_desc: "آیات همراه دیجیتال شما برای یک سفر معنوی یکپارچه است.",
    copy: "کپی متن", close: "بستن"
  }
};

const asmaUlHusna = [
  { name: "اللَّهُ", meaning: "الاسم الأعظم الجامع لصفات الألوهية.", quran: "سورة الفاتحة - الآية 1", ayah: "﴿بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ﴾" },
  { name: "الرَّحْمَنُ", meaning: "كثير الرحمة بعباده في الدنيا والآخرة.", quran: "سورة طه - الآية 5", ayah: "﴿الرَّحْمَنُ عَلَى الْعَرْشِ اسْتَوَى﴾" },
  { name: "الرَّحِيمُ", meaning: "الذي يرحم المؤمنين، ورحمته دائمة.", quran: "سورة الفاتحة - الآية 3", ayah: "﴿الرَّحْمَنِ الرَّحِيمِ﴾" },
  { name: "الْمَلِكُ", meaning: "صاحب المُلك، المتصرف في خلقه.", quran: "سورة طه - الآية 114", ayah: "﴿فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ﴾" },
  { name: "الْقُدُّوسُ", meaning: "الطاهر المنزه عن العيوب والنقائص.", quran: "سورة الجمعة - الآية 1", ayah: "﴿يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ﴾" },
  { name: "السَّلَامُ", meaning: "الذي سلم من كل عيب ونقص وآفة.", quran: "سورة الحشر - الآية 23", ayah: "﴿هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ﴾" },
  { name: "الْمُؤْمِنُ", meaning: "المصدق رسله وأنبياءه، والذي يهب الأمن.", quran: "سورة الحشر - الآية 23", ayah: "﴿الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ﴾" },
  { name: "الْمُهَيْمِنُ", meaning: "المطلع على خفايا الأمور والمسيطر عليها.", quran: "سورة الحشر - الآية 23", ayah: "﴿الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ﴾" },
  { name: "الْعَزِيزُ", meaning: "القوي الغالب الذي لا يُقهر.", quran: "سورة آل عمران - الآية 62", ayah: "﴿وَإِنَّ اللَّهَ لَهُوَ الْعَزِيزُ الْحَكِيمُ﴾" },
  { name: "الْجَبَّارُ", meaning: "الذي يجبر الكسير، وتنفذ مشيئته.", quran: "سورة الحشر - الآية 23", ayah: "﴿الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ﴾" },
  { name: "الْمُتَكَبِّرُ", meaning: "المتعالي عن صفات النقص والمخلوقين.", quran: "سورة الحشر - الآية 23", ayah: "﴿الْجَبَّارُ الْمُتَكَبِّرُ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ﴾" },
  { name: "الْخَالِقُ", meaning: "المبدع للأشياء والمخترع لها على غير مثال.", quran: "سورة الحشر - الآية 24", ayah: "﴿هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ﴾" },
  { name: "الْبَارِئُ", meaning: "الذي خلق الخلق بريئاً من التفاوت.", quran: "سورة الحشر - الآية 24", ayah: "﴿هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ﴾" },
  { name: "الْمُصَوِّرُ", meaning: "الذي صور جميع الموجودات ورتبها.", quran: "سورة الحشر - الآية 24", ayah: "﴿الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ لَهُ الْأَسْمَاءُ الْحُسْنَى﴾" },
  { name: "الْغَفَّارُ", meaning: "الذي يغفر الذنوب ويستر العيوب مراراً.", quran: "سورة ص - الآية 66", ayah: "﴿رَبُّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا الْعَزِيزُ الْغَفَّارُ﴾" },
  { name: "الْقَهَّارُ", meaning: "الذي قهر جميع الكائنات وذلت له.", quran: "سورة الرعد - الآية 16", ayah: "﴿قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ وَهُوَ الْوَاحِدُ الْقَهَّارُ﴾" },
  { name: "الْوَهَّابُ", meaning: "الكثير العطاء بغير عوض.", quran: "سورة آل عمران - الآية 8", ayah: "﴿إِنَّكَ أَنْتَ الْوَهَّابُ﴾" },
  { name: "الرَّزَّاقُ", meaning: "المتكفل بالرزق لجميع الكائنات.", quran: "سورة الذاريات - الآية 58", ayah: "﴿إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ﴾" },
  { name: "الْفَتَّاحُ", meaning: "الذي يفتح مغاليق الأمور ويحكم بين العباد.", quran: "سورة سبأ - الآية 26", ayah: "﴿وَهُوَ الْفَتَّاحُ الْعَلِيمُ﴾" },
  { name: "الْعَلِيمُ", meaning: "الذي أحاط علمه بالظواهر والبواطن.", quran: "سورة البقرة - الآية 32", ayah: "﴿إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ﴾" },
  { name: "الْقَابِضُ", meaning: "الذي يقبض الأرواح والأرزاق بحكمته.", quran: "سورة البقرة - الآية 245", ayah: "﴿وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ﴾" },
  { name: "الْبَاسِطُ", meaning: "الذي يبسط الرزق لمن يشاء.", quran: "سورة البقرة - الآية 245", ayah: "﴿وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ﴾" },
  { name: "الْخَافِضُ", meaning: "الذي يخفض الجبابرة والمتكبرين.", quran: "سورة الواقعة - الآية 3", ayah: "﴿خَافِضَةٌ رَافِعَةٌ﴾" },
  { name: "الرَّافِعُ", meaning: "الذي يرفع درجات المؤمنين.", quran: "سورة غافر - الآية 15", ayah: "﴿رَفِيعُ الدَّرَجَاتِ ذُو الْعَرْشِ﴾" },
  { name: "الْمُعِزُّ", meaning: "الذي يعز من يشاء بطاعته.", quran: "سورة آل عمران - الآية 26", ayah: "﴿وَتُعِزُّ مَنْ تَشَاءُ﴾" },
  { name: "الْمُذِلُّ", meaning: "الذي يذل من يشاء بمعصيته.", quran: "سورة آل عمران - الآية 26", ayah: "﴿وَتُذِلُّ مَنْ تَشَاءُ﴾" },
  { name: "السَّمِيعُ", meaning: "الذي يسمع السر والنجوى.", quran: "سورة البقرة - الآية 127", ayah: "﴿وَهُوَ السَّمِيعُ الْعَلِيمُ﴾" },
  { name: "الْبَصِيرُ", meaning: "الذي يرى كل شيء وإن دق.", quran: "سورة الإسراء - الآية 1", ayah: "﴿إِنَّهُ هُوَ السَّمِيعُ الْبَصِيرُ﴾" },
  { name: "الْحَكَمُ", meaning: "الذي يحكم بين الخلائق بالعدل.", quran: "سورة الأنعام - الآية 114", ayah: "﴿أَفَغَيْرَ اللَّهِ أَبْتَغِي حَكَمًا﴾" },
  { name: "الْعَدْلُ", meaning: "المنزه عن الظلم والجور.", quran: "سورة الأنعام - الآية 115", ayah: "﴿وَتَمَّتْ كَلِمَتُ رَبِّكَ صِدْقًا وَعَدْلًا﴾" },
  { name: "اللَّطِيفُ", meaning: "البر بعباده، الخبير بدقائق الأمور.", quran: "سورة الأنعام - الآية 103", ayah: "﴿وَهُوَ اللَّطِيفُ الْخَبِيرُ﴾" },
  { name: "الْخَبِيرُ", meaning: "العالم بما كان وما يكون.", quran: "سورة الأنعام - الآية 18", ayah: "﴿وَهُوَ الْحَكِيمُ الْخَبِيرُ﴾" },
  { name: "الْحَلِيمُ", meaning: "الذي لا يعجل بالعقوبة على عباده.", quran: "سورة البقرة - الآية 225", ayah: "﴿وَاللَّهُ غَنِيٌّ حَلِيمٌ﴾" },
  { name: "الْعَظِيمُ", meaning: "الذي ليس لعظمته بداية ولا نهاية.", quran: "سورة الشورى - الآية 4", ayah: "﴿وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾" },
  { name: "الْغَفُورُ", meaning: "المتجاوز عن الذنوب.", quran: "سورة طه - الآية 82", ayah: "﴿وَإِنِّي لَغَفَّارٌ لِمَنْ تَابَ وَآمَنَ وَعَمِلَ صَالِحًا﴾" },
  { name: "الشَّكُورُ", meaning: "الذي يزكو عنده القليل من العمل فيضاعف الأجر.", quran: "سورة فاطر - الآية 30", ayah: "﴿إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ﴾" },
  { name: "الْعَلِيُّ", meaning: "المرتفع قدراً ومكانة.", quran: "سورة البقرة - الآية 255", ayah: "﴿وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾" },
  { name: "الْكَبِيرُ", meaning: "الذي صغر كل شيء دونه.", quran: "سورة الرعد - الآية 9", ayah: "﴿عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ﴾" },
  { name: "الْحَفِيظُ", meaning: "الذي يحفظ السماوات والأرض وما فيهما.", quran: "سورة هود - الآية 57", ayah: "﴿إِنَّ رَبِّي عَلَى كُلِّ شَيْءٍ حَفِيظٌ﴾" },
  { name: "الْمُقِيتُ", meaning: "خالق الأقوات وموصلها للخلائق.", quran: "سورة النساء - الآية 85", ayah: "﴿وَكَانَ اللَّهُ عَلَى كُلِّ شَيْءٍ مُقِيتًا﴾" },
  { name: "الْحَسِيبُ", meaning: "الكافي عباده جميع ما يحتاجونه.", quran: "سورة النساء - الآية 86", ayah: "﴿إِنَّ اللَّهَ كَانَ عَلَى كُلِّ شَيْءٍ حَسِيبًا﴾" },
  { name: "الْجَلِيلُ", meaning: "المتصف بصفات الجلال والكبرياء.", quran: "سورة الرحمن - الآية 27", ayah: "﴿وَيَبْقَى وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ﴾" },
  { name: "الْكَرِيمُ", meaning: "كثير الخير والعطاء.", quran: "سورة النمل - الآية 40", ayah: "﴿فَإِنَّ رَبِّي غَنِيٌّ كَرِيمٌ﴾" },
  { name: "الرَّقِيبُ", meaning: "المطلع على العباد الذي لا يغفل عنهم.", quran: "سورة النساء - الآية 1", ayah: "﴿إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا﴾" },
  { name: "الْمُجِيبُ", meaning: "الذي يجيب دعاء من دعاه.", quran: "سورة هود - الآية 61", ayah: "﴿إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ﴾" },
  { name: "الْوَاسِعُ", meaning: "الذي وسع رزقه ورحمته جميع خلقه.", quran: "سورة البقرة - الآية 115", ayah: "﴿إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ﴾" },
  { name: "الْحَكِيمُ", meaning: "الذي يضع الأشياء في مواضعها.", quran: "سورة الأنعام - الآية 18", ayah: "﴿وَهُوَ الْحَكِيمُ الْخَبِيرُ﴾" },
  { name: "الْوَدُودُ", meaning: "المحب لعباده الصالحين والمحبوب لهم.", quran: "سورة البروج - الآية 14", ayah: "﴿وَهُوَ الْغَفُورُ الْوَدُودُ﴾" },
  { name: "الْمَجِيدُ", meaning: "البالغ في المجد أقصاه.", quran: "سورة هود - الآية 73", ayah: "﴿إِنَّهُ حَمِيدٌ مَجِيدٌ﴾" },
  { name: "الْبَاعِثُ", meaning: "الذي يبعث الموتى يوم القيامة.", quran: "سورة الحج - الآية 7", ayah: "﴿وَأَنَّ اللَّهَ يَبْعَثُ مَنْ فِي الْقُبُورِ﴾" },
  { name: "الشَّهِيدُ", meaning: "المطلع على كل شيء.", quran: "سورة آل عمران - الآية 98", ayah: "﴿وَاللَّهُ شَهِيدٌ عَلَى مَا تَعْمَلُونَ﴾" },
  { name: "الْحَقُّ", meaning: "الذي لا شك في وجوده وألوهيته.", quran: "سورة طه - الآية 114", ayah: "﴿فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ﴾" },
  { name: "الْوَكِيلُ", meaning: "الذي توكل بتدبير أمور خلقه.", quran: "سورة آل عمران - الآية 173", ayah: "﴿وَقَالُوا حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ﴾" },
  { name: "الْقَوِيُّ", meaning: "صاحب القدرة التامة.", quran: "سورة الأنفال - الآية 52", ayah: "﴿إِنَّ اللَّهَ قَوِيٌّ شَدِيدُ الْعِقَابِ﴾" },
  { name: "الْمَتِينُ", meaning: "الشديد القوة الذي لا يعجزه شيء.", quran: "سورة الذاريات - الآية 58", ayah: "﴿إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ﴾" },
  { name: "الْوَلِيُّ", meaning: "المتولي لأمور الخلائق والمحسن إليهم.", quran: "سورة الشورى - الآية 28", ayah: "﴿وَهُوَ الْوَلِيُّ الْحَمِيدُ﴾" },
  { name: "الْحَمِيدُ", meaning: "المستحق للحمد والثناء.", quran: "سورة البقرة - الآية 267", ayah: "﴿وَاعْلَمُوا أَنَّ اللَّهَ غَنِيٌّ حَمِيدٌ﴾" },
  { name: "الْمُحْصِي", meaning: "الذي أحصى كل شيء عدداً.", quran: "سورة مريم - الآية 94", ayah: "﴿لَقَدْ أَحْصَاهُمْ وَعَدَّهُمْ عَدًّا﴾" },
  { name: "الْمُبْدِئُ", meaning: "الذي أنشأ الأشياء من العدم.", quran: "سورة البروج - الآية 13", ayah: "﴿إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ﴾" },
  { name: "الْمُعِيدُ", meaning: "الذي يعيد الخلق بعد الموت.", quran: "سورة البروج - الآية 13", ayah: "﴿إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ﴾" },
  { name: "الْمُحْيِي", meaning: "الذي يحيي الموتى والأرض الميتة.", quran: "سورة الروم - الآية 50", ayah: "﴿إِنَّ ذَلِكَ لَمُحْيِي الْمَوْتَى﴾" },
  { name: "الْمُمِيتُ", meaning: "الذي يسلب الحياة متى شاء.", quran: "سورة الدخان - الآية 8", ayah: "﴿لَا إِلَهَ إِلَّا هُوَ يُحْيِي وَيُمِيتُ﴾" },
  { name: "الْحَيُّ", meaning: "الدائم البقاء الذي لا يموت.", quran: "سورة البقرة - الآية 255", ayah: "﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾" },
  { name: "الْقَيُّومُ", meaning: "القائم بنفسه والمقيم لغيره.", quran: "سورة البقرة - الآية 255", ayah: "﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾" },
  { name: "الْوَاجِدُ", meaning: "الذي لا يعوزه شيء.", quran: "سورة الضحى - الآية 3", ayah: "﴿مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى﴾" },
  { name: "الْمَاجِدُ", meaning: "عظيم الشأن والمجد.", quran: "سورة هود - الآية 73", ayah: "﴿إِنَّهُ حَمِيدٌ مَجِيدٌ﴾" },
  { name: "الْوَاحِدُ", meaning: "المتفرد الذي لا شريك له.", quran: "سورة الرعد - الآية 16", ayah: "﴿وَهُوَ الْوَاحِدُ الْقَهَّارُ﴾" },
  { name: "الْأَحَدُ", meaning: "الذي لا شبيه له ولا نظير.", quran: "سورة الإخلاص - الآية 1", ayah: "﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾" },
  { name: "الصَّمَدُ", meaning: "السيد المقصود في الحوائج كلها.", quran: "سورة الإخلاص - الآية 2", ayah: "﴿اللَّهُ الصَّمَدُ﴾" },
  { name: "الْقَادِرُ", meaning: "الذي يفعل ما يشاء بلا عجز.", quran: "سورة البقرة - الآية 148", ayah: "﴿إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ﴾" },
  { name: "الْمُقْتَدِرُ", meaning: "التام القدرة الذي لا يمتنع عليه شيء.", quran: "سورة الكهف - الآية 45", ayah: "﴿وَكَانَ اللَّهُ عَلَى كُلِّ شَيْءٍ مُقْتَدِرًا﴾" },
  { name: "الْمُقَدِّمُ", meaning: "الذي يقدم الأشياء ويضعها في مواضعها.", quran: "سورة ق - الآية 28", ayah: "﴿مَا يُبَدَّلُ الْقَوْلُ لَدَيَّ﴾" },
  { name: "الْمُؤَخِّرُ", meaning: "الذي يؤخر الأشياء بحكمته.", quran: "سورة إبراهيم - الآية 104", ayah: "﴿إِنَّمَا يُؤَخِّرُهُمْ لِيَوْمٍ تَشْخَصُ فِيهِ الْأَبْصَارُ﴾" },
  { name: "الْأَوَّلُ", meaning: "الذي ليس قبله شيء.", quran: "سورة الحديد - الآية 3", ayah: "﴿هُوَ الْأَوَّلُ وَالْآخِرُ﴾" },
  { name: "الْآخِرُ", meaning: "الذي ليس بعده شيء.", quran: "سورة الحديد - الآية 3", ayah: "﴿هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ﴾" },
  { name: "الظَّاهِرُ", meaning: "الذي ليس فوقه شيء.", quran: "سورة الحديد - الآية 3", ayah: "﴿وَالظَّاهِرُ وَالْبَاطِنُ﴾" },
  { name: "الْبَاطِنُ", meaning: "الذي ليس دونه شيء.", quran: "سورة الحديد - الآية 3", ayah: "﴿وَالظَّاهِرُ وَالْبَاطِنُ﴾" },
  { name: "الْوَالِي", meaning: "المتصرف في الأشياء.", quran: "سورة الرعد - الآية 11", ayah: "﴿وَمَا لَهُمْ مِنْ دُونِهِ مِنْ وَالٍ﴾" },
  { name: "الْمُتَعَالِي", meaning: "المرتفع عن صفات المخلوقين.", quran: "سورة الرعد - الآية 9", ayah: "﴿الْكَبِيرُ الْمُتَعَالِ﴾" },
  { name: "الْبَرُّ", meaning: "العطوف المحسن إلى عباده.", quran: "سورة الطور - الآية 28", ayah: "﴿إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ﴾" },
  { name: "التَّوَّابُ", meaning: "يقبل توبة عباده مراراً.", quran: "سورة البقرة - الآية 37", ayah: "﴿إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ﴾" },
  { name: "الْمُنْتَقِمُ", meaning: "الذي يعاقب المصرين على الظلم.", quran: "سورة السجدة - الآية 22", ayah: "﴿إِنَّا مِنَ الْمُجْرِمِينَ مُنْتَقِمُونَ﴾" },
  { name: "الْعَفُوُّ", meaning: "الذي يمحو السيئات.", quran: "سورة النساء - الآية 43", ayah: "﴿فَإِنَّ اللَّهَ كَانَ عَفُوًّا قَدِيرًا﴾" },
  { name: "الرَّؤُوفُ", meaning: "شديد الرحمة والشفقة.", quran: "سورة النور - الآية 20", ayah: "﴿وَأَنَّ اللَّهَ رَءُوفٌ رَحِيمٌ﴾" },
  { name: "مَالِكُ الْمُلْكِ", meaning: "الذي ينفذ أمره في ملكه.", quran: "سورة آل عمران - الآية 26", ayah: "﴿قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ﴾" },
  { name: "ذُو الْجَلَالِ وَالْإِكْرَامِ", meaning: "المستحق للتعظيم والإكرام.", quran: "سورة الرحمن - الآية 27", ayah: "﴿وَيَبْقَى وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ﴾" },
  { name: "الْمُقْسِطُ", meaning: "العادل في حكمه.", quran: "سورة آل عمران - الآية 18", ayah: "﴿قَائِمًا بِالْقِسْطِ﴾" },
  { name: "الْجَامِعُ", meaning: "الذي يجمع الخلائق ليوم الحساب.", quran: "سورة آل عمران - الآية 9", ayah: "﴿رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَا رَيْبَ فِيهِ﴾" },
  { name: "الْغَنِيُّ", meaning: "المستغني عن كل ما سواه.", quran: "سورة البقرة - الآية 267", ayah: "﴿وَاعْلَمُوا أَنَّ اللَّهَ غَنِيٌّ حَمِيدٌ﴾" },
  { name: "الْمُغْنِي", meaning: "الذي يغني من يشاء.", quran: "سورة النجم - الآية 48", ayah: "﴿وَأَنَّهُ هُوَ أَغْنَى وَأَقْنَى﴾" },
  { name: "الْمَانِعُ", meaning: "الذي يمنع البلاء عن من يشاء.", quran: "حديث شريف", ayah: "﴿لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ﴾" },
  { name: "الضَّارُّ", meaning: "مقدر الضر لمن يشاء.", quran: "سورة الأنعام - الآية 17", ayah: "﴿وَإِنْ يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ﴾" },
  { name: "النَّافِعُ", meaning: "مقدر النفع لمن يشاء.", quran: "سورة الأنعام - الآية 17", ayah: "﴿وَإِنْ يُرِدْكَ بِخَيْرٍ فَلَا رَادَّ لِفَضْلِهِ﴾" },
  { name: "النُّورُ", meaning: "الذي بنوره تستنير العقول.", quran: "سورة النور - الآية 35", ayah: "﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ﴾" },
  { name: "الْهَادِي", meaning: "الذي يهدي القلوب للحق.", quran: "سورة الحج - الآية 54", ayah: "﴿وَإِنَّ اللَّهَ لَهَادِ الَّذِينَ آمَنُوا إِلَى صِرَاطٍ مُسْتَقِيمٍ﴾" },
  { name: "الْبَدِيعُ", meaning: "خالق الأشياء على غير مثال سابق.", quran: "سورة البقرة - الآية 117", ayah: "﴿بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ﴾" },
  { name: "الْبَاقِي", meaning: "الذي لا يزول.", quran: "سورة طه - الآية 73", ayah: "﴿وَاللَّهُ خَيْرٌ وَأَبْقَى﴾" },
  { name: "الْوَارِثُ", meaning: "الذي يؤول إليه كل شيء بعد فناء خلقه.", quran: "سورة الحجر - الآية 23", ayah: "﴿وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ﴾" },
  { name: "الرَّشِيدُ", meaning: "المرشد لخلقه إلى مصالحهم.", quran: "سورة هود - الآية 87", ayah: "﴿إِنَّكَ لَأَنْتَ الْحَلِيمُ الرَّشِيدُ﴾" },
  { name: "الصَّبُورُ", meaning: "الذي لا يعاجل العصاة بالعقوبة.", quran: "سورة الأعراف - الآية 137", ayah: "﴿وَاصْبِرْ حَتَّى يَحْكُمَ اللَّهُ﴾" }
];

const fullAzkarDatabase = {
  sabah: [
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1 },
    { text: "قُلْ هُوَ اللَّهُ أَحَدٌ... (ثلاث مرات)", count: 3 },
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ...", count: 1 }
  ],
  maseh: [
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1 },
    { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... (ثلاث مرات)", count: 3 },
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ...", count: 1 }
  ],
  travel: [
    { text: "اللهُ أَكْبَر، اللهُ أَكْبَر، اللهُ أَكْبَر، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ...", count: 1 }
  ],
  prayer: [
    { text: "أَسْتَغْفِرُ اللَّهَ (ثَلَاثاً). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ.", count: 1 }
  ]
};

let allSurahs = []; let pages = []; let currentPage = 0; let currentSurah = 1; let currentSurahName = "";
let defaultFontSize = 26; let misbahaCounter = 0; let currentAzkarCategory = "sabah";
let tempSelectedVerseText = ""; let tempSelectedVerseInfo = "";
let currentLanguage = "ar"; let currentLayout = "compact";

// متغيرات للتحكم بالنافذة المنبثقة الخاصة بالحذف
let deleteActionTarget = null; 
let deleteTargetIndex = null;

function triggerHaptic() { if (navigator.vibrate) navigator.vibrate(15); }

function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div"); toast.id = "toast-notification";
    toast.className = "floating-toast-capsule"; document.body.appendChild(toast);
  }
  toast.innerText = message; toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}

function cleanSurahName(name) { return name ? name.replace(/[ًٌٍَُِّْـٰ]/g, "").replace(/سورة/g, "").trim() : ""; }

function calculateHijriDate() {
  const h = document.getElementById("hijri-date");
  if (!h) return;
  try {
    let d = new Date();
    h.innerText = new Intl.DateTimeFormat('ar-SA', { calendar: 'islamic-civil', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch (e) {
    h.innerText = "١ محرم ١٤٤٨ هـ"; 
  }
}

function toggleColorSlider() {
  triggerHaptic();
  const isDark = document.body.classList.contains('dark-mode');
  if (isDark) {
    showToast("يرجى التبديل للوضع النهاري لتخصيص الألوان");
    return;
  }
  const sliderContainer = document.getElementById('hue-slider-container');
  sliderContainer.classList.toggle('hidden');
}

function setAppMode(mode) {
  triggerHaptic();
  if(mode === 'night') {
    document.body.classList.add('dark-mode');
    localStorage.setItem("ayat_darkmode", "true");
    document.getElementById("mode-night-btn").classList.add("active");
    document.getElementById("mode-day-btn").classList.remove("active");
    document.getElementById('hue-slider-container').classList.add('hidden');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem("ayat_darkmode", "false");
    document.getElementById("mode-day-btn").classList.add("active");
    document.getElementById("mode-night-btn").classList.remove("active");
    const savedHue = localStorage.getItem("ayat_hue");
    applyHueColor(savedHue || 345, false);
  }
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function applyHueColor(hue, isUserInteraction = true) {
  if (isUserInteraction) triggerHaptic();
  localStorage.setItem("ayat_hue", hue);
  const hueSlider = document.getElementById('hue-slider');
  if(hueSlider) hueSlider.value = hue;

  const isDark = document.body.classList.contains("dark-mode");
  if(isDark) return; 
  
  const primaryHex = hslToHex(hue, 80, 35);
  document.documentElement.style.setProperty('--primary', primaryHex);
  const secondaryHex = hslToHex(hue, 80, 25);
  document.documentElement.style.setProperty('--secondary', secondaryHex);

  document.documentElement.style.setProperty('--bg', '#fcfcfc');
  document.documentElement.style.setProperty('--card', '#ffffff');
  document.documentElement.style.setProperty('--text', '#1a1a1a');
  document.documentElement.style.setProperty('--border', '#f0e0e3');
  document.documentElement.style.setProperty('--primary-text', '#ffffff');
}

const hueSlider = document.getElementById('hue-slider');
if(hueSlider) {
  hueSlider.addEventListener('input', function(e) {
    applyHueColor(e.target.value, false);
  });
}

function changeLayout(layoutType) {
  triggerHaptic(); currentLayout = layoutType;
  document.body.classList.remove("layout-compact", "layout-list", "layout-cards", "layout-minimal", "layout-comfortable");
  if(layoutType !== "comfortable") document.body.classList.add(`layout-${layoutType}`);
  else document.body.classList.add(`layout-comfortable`);
  
  localStorage.setItem("ayat_layout", layoutType);
  document.querySelectorAll(".layout-btn").forEach(btn => btn.classList.remove("active"));
  if(document.getElementById(`layout-${layoutType}-btn`)) document.getElementById(`layout-${layoutType}-btn`).classList.add("active");
}

function changeLanguage(lang) {
  triggerHaptic(); currentLanguage = lang; localStorage.setItem("ayat_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
  
  document.querySelectorAll(".lang-group button").forEach(b => b.classList.remove("active"));
  const activeLangBtn = document.getElementById(`lang-${lang}-btn`);
  if(activeLangBtn) activeLangBtn.classList.add("active");
  
  const dict = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(dict && dict[key]) el.innerText = dict[key];
  });
}

function loadPreferences() {
  changeLanguage(localStorage.getItem("ayat_lang") || "ar");
  changeLayout(localStorage.getItem("ayat_layout") || "compact"); 
  
  const isDark = localStorage.getItem("ayat_darkmode") === "true";
  const savedHue = localStorage.getItem("ayat_hue");
  
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.getElementById("mode-night-btn").classList.add("active");
    document.getElementById("mode-day-btn").classList.remove("active");
  } else {
    document.body.classList.remove('dark-mode');
    document.getElementById("mode-day-btn").classList.add("active");
    document.getElementById("mode-night-btn").classList.remove("active");
    applyHueColor(savedHue || 345, false);
  }
}

function renderAsmaMiniCards() {
  const grid = document.getElementById("asma-mini-grid");
  if(!grid) return; grid.innerHTML = "";
  asmaUlHusna.forEach((asma) => {
    const chip = document.createElement("div");
    chip.className = "asma-chip haptic-btn";
    chip.innerHTML = `<span class="asma-chip-name">${asma.name}</span>`;
    chip.onclick = () => openAsmaPopup(asma);
    grid.appendChild(chip);
  });
}

function openAsmaPopup(asma) {
  triggerHaptic();
  document.getElementById("popup-asma-name").innerText = asma.name;
  document.getElementById("popup-asma-meaning").innerText = asma.meaning;
  document.getElementById("popup-asma-ayah").innerText = asma.ayah;
  document.getElementById("popup-asma-surah").innerText = asma.quran;
  document.getElementById("asma-info-popup").classList.remove("hidden-popup");
}

function closeAsmaPopup() {
  triggerHaptic(); document.getElementById("asma-info-popup").classList.add("hidden-popup");
}

function setupNameOfDay() {
  const msInDay = 86400000; const dayOfYear = Math.floor(Date.now() / msInDay);
  const dayIndex = dayOfYear % asmaUlHusna.length;
  const nod = asmaUlHusna[dayIndex];
  if(document.getElementById("nod-name")) {
    document.getElementById("nod-name").innerText = nod.name;
    document.getElementById("nod-desc").innerText = nod.meaning.substring(0, 30) + "...";
  }
}

const quranAudioEl = document.getElementById("quran-audio");
const seekbar = document.getElementById("f-audio-seekbar");
const currentTimeEl = document.getElementById("f-audio-current");
const durationEl = document.getElementById("f-audio-duration");
let animationFrameId;

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateSeekbarSmoothly() {
  if (quranAudioEl && !quranAudioEl.paused) {
    if (seekbar && !seekbar.isDragging) {
      seekbar.value = quranAudioEl.currentTime;
      if (currentTimeEl) currentTimeEl.innerText = formatTime(quranAudioEl.currentTime);
    }
    animationFrameId = requestAnimationFrame(updateSeekbarSmoothly);
  }
}

function startAudio() {
  triggerHaptic();
  if(!quranAudioEl || !document.getElementById("reader-select")) return;
  const reader = document.getElementById("reader-select").value;
  quranAudioEl.src = `https://cdn.islamic.network/quran/audio-surah/128/${reader}/${currentSurah}.mp3`;
  quranAudioEl.play();
}

if(quranAudioEl) {
  quranAudioEl.onloadedmetadata = () => {
    if(seekbar) seekbar.max = quranAudioEl.duration;
    if(durationEl) durationEl.innerText = formatTime(quranAudioEl.duration);
  };
  
  if(seekbar) {
    const startDrag = () => { seekbar.isDragging = true; };
    const endDrag = () => { seekbar.isDragging = false; quranAudioEl.currentTime = seekbar.value; };
    
    seekbar.addEventListener('mousedown', startDrag);
    seekbar.addEventListener('touchstart', startDrag, {passive: true});
    seekbar.addEventListener('mouseup', endDrag);
    seekbar.addEventListener('touchend', endDrag);
    
    seekbar.oninput = () => {
      if(currentTimeEl) currentTimeEl.innerText = formatTime(seekbar.value);
    };
  }

  quranAudioEl.onplay = () => {
    document.getElementById("floating-audio-player").classList.remove("hidden");
    document.getElementById("f-audio-surah").innerText = `سورة ${currentSurahName}`;
    document.getElementById("f-btn-play").innerHTML = '<i class="fa-solid fa-pause"></i>';
    document.getElementById("f-audio-icon").classList.add("fa-spin");
    animationFrameId = requestAnimationFrame(updateSeekbarSmoothly);
  };
  
  quranAudioEl.onpause = () => {
    document.getElementById("f-btn-play").innerHTML = '<i class="fa-solid fa-play"></i>';
    document.getElementById("f-audio-icon").classList.remove("fa-spin");
    cancelAnimationFrame(animationFrameId);
  };
  
  quranAudioEl.onended = () => { stopAudio(); };
}

function togglePlayPause() { triggerHaptic(); if(quranAudioEl.paused) quranAudioEl.play(); else quranAudioEl.pause(); }
function stopAudio() { triggerHaptic(); if(quranAudioEl) { quranAudioEl.pause(); quranAudioEl.currentTime = 0; cancelAnimationFrame(animationFrameId);} document.getElementById("floating-audio-player").classList.add("hidden"); }

function startApp() {
  triggerHaptic(); document.getElementById("splash-screen").style.opacity = "0";
  setTimeout(() => { document.getElementById("splash-screen").classList.add("hidden"); document.getElementById("app-content").classList.remove("hidden"); updateWardDashboardProgress(); checkKhatmaStatusOnDashboard(); }, 500);
}
function toggleSidebar() { triggerHaptic(); document.getElementById("sidebar").classList.toggle("close"); document.getElementById("sidebar-overlay").classList.toggle("hidden"); }
function showSection(id) { 
  triggerHaptic(); 
  if (!document.getElementById("sidebar").classList.contains("close")) toggleSidebar(); 
  document.querySelectorAll(".dashboard-view").forEach(s => s.classList.add("hidden")); 
  document.getElementById(id).classList.remove("hidden"); 
  if (id === 'azkar-section') switchAzkarCategory('sabah'); 
  if (id === 'home-dashboard') { updateWardDashboardProgress(); checkKhatmaStatusOnDashboard(); } 
  if (id === 'financial-section') switchFinancialTab('zakat'); 
  if (id === 'notifications-page') renderNotifications(); 
  window.scrollTo(0,0); 
}
function backToHome() { triggerHaptic(); showSection("home-dashboard"); }
function backToList() { triggerHaptic(); document.getElementById("surah-selector-panel").classList.remove("hidden"); document.getElementById("reading-zone").classList.add("hidden"); }

async function loadSurahs() {
  try { const response = await fetch("https://api.alquran.cloud/v1/surah"); const data = await response.json(); allSurahs = data.data; renderSurahs(allSurahs); } 
  catch { 
    const c = document.getElementById("surah-grid-container");
    if(c) c.innerHTML = "<div style='grid-column: 1/-1; text-align:center; padding:20px;'>تعذر التحميل، يرجى التحقق من الإنترنت.</div>"; 
  }
}
function renderSurahs(list) {
  const container = document.getElementById("surah-grid-container"); if(!container) return; container.innerHTML = "";
  list.forEach(s => { const btn = document.createElement("button"); btn.className = "surah-grid-item haptic-btn"; btn.innerHTML = `<div class="surah-number">${s.number}</div><div class="surah-name">سورة ${cleanSurahName(s.name)}</div>`; btn.onclick = () => { triggerHaptic(); selectSurah(s.number, s.name); }; container.appendChild(btn); });
}
function filterSurahs() { const q = document.getElementById("surah-search").value.trim().toLowerCase(); if (!q) { renderSurahs(allSurahs); return; } renderSurahs(allSurahs.filter(s => s.name.toLowerCase().includes(q) || cleanSurahName(s.name).includes(q))); }

async function selectSurah(number, name, savedPage = 0) {
  currentSurah = number; currentSurahName = cleanSurahName(name); 
  document.getElementById("surah-selector-panel").classList.add("hidden"); document.getElementById("reading-zone").classList.remove("hidden");
  document.getElementById("surah-title").innerHTML = `سورة ${currentSurahName}`; document.getElementById("surah-text").innerHTML = "جاري تحميل الآيات...";
  try { const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`); const data = await res.json(); createPages(data.data.ayahs); currentPage = savedPage; renderPage(); saveReadingProgress(number, currentSurahName, savedPage); } catch { document.getElementById("surah-text").innerHTML = "خطأ بالشبكة."; }
}
function createPages(ayahs) { pages = []; let temp = []; ayahs.forEach((a, i) => { temp.push({ text: a.text, number: i + 1 }); if (temp.length >= 7) { pages.push(temp); temp = []; } }); if (temp.length > 0) pages.push(temp); }
function renderPage() {
  const txt = document.getElementById("surah-text"); if(!txt || !pages.length) return; txt.innerHTML = ""; const p = pages[currentPage]; if(!p) return;
  p.forEach((a) => { const sp = document.createElement("span"); sp.className = "ayah-box"; sp.style.fontSize = defaultFontSize + "px"; sp.innerHTML = ` ${a.text} ﴿${a.number}﴾ `; sp.onclick = () => { triggerHaptic(); triggerVersePopup(a.text, `سورة ${currentSurahName} - آية ${a.number}`); }; txt.appendChild(sp); });
  txt.style.fontSize = defaultFontSize + "px"; document.getElementById("page-indicator").innerHTML = `صفحة ${currentPage + 1} من ${pages.length}`; document.getElementById("prev-page-btn").disabled = currentPage === 0; document.getElementById("next-page-btn").disabled = currentPage === pages.length - 1; saveReadingProgress(currentSurah, currentSurahName, currentPage); trackPageReadProgress();
}
function navigatePage(dir) { triggerHaptic(); if (dir === 1 && currentPage < pages.length - 1) { currentPage++; renderPage(); } else if (dir === -1 && currentPage > 0) { currentPage--; renderPage(); } }
function changeFontSize(amt) { triggerHaptic(); defaultFontSize += amt; if (defaultFontSize < 18) defaultFontSize = 18; if (defaultFontSize > 48) defaultFontSize = 48; const t = document.getElementById("surah-text"); if(t) t.style.fontSize = defaultFontSize + "px"; document.querySelectorAll(".ayah-box").forEach(s => s.style.fontSize = defaultFontSize + "px"); }

function saveReadingProgress(num, name, idx) { localStorage.setItem("lastQuranProgress", JSON.stringify({ surahNum: num, surahName: cleanSurahName(name), pageIndex: idx })); }
function resumeLastReading() { const d = localStorage.getItem("lastQuranProgress"); if (d) { const p = JSON.parse(d); showSection('quran-section'); selectSurah(p.surahNum, p.surahName, p.pageIndex); } }
function updateWardGoal() { triggerHaptic(); const g = parseInt(document.getElementById("setting-ward-goal").value) || 5; localStorage.setItem("ward_pages_goal", g); updateWardDashboardProgress(); showToast("تم الحفظ"); }
function updateWardDashboardProgress() {
  const dKey = "ward_read_" + new Date().toISOString().split('T')[0]; const rd = JSON.parse(localStorage.getItem(dKey)) || []; const g = parseInt(localStorage.getItem("ward_pages_goal")) || 5;
  if(document.getElementById("setting-ward-goal")) document.getElementById("setting-ward-goal").value = g;
  let p = Math.round((rd.length / g) * 100); if (p > 100) p = 100;
  if (document.getElementById("ward-status-text")) document.getElementById("ward-status-text").innerText = `تم قراءة ${rd.length} صفحات`;
  if (document.getElementById("ward-percent-badge")) document.getElementById("ward-percent-badge").innerText = `${p}%`;
  if (document.getElementById("ward-bar-fill")) document.getElementById("ward-bar-fill").style.width = `${p}%`;
  const svd = localStorage.getItem("lastQuranProgress");
  if(svd && document.getElementById("resume-reading-box")) { const pr = JSON.parse(svd); document.getElementById("resume-text").innerHTML = `سورة ${cleanSurahName(pr.surahName)} - صفحة ${pr.pageIndex + 1}`; document.getElementById("resume-reading-box").classList.remove("hidden"); }
}
function trackPageReadProgress() { const dKey = "ward_read_" + new Date().toISOString().split('T')[0]; let rd = JSON.parse(localStorage.getItem(dKey)) || []; const uid = `${currentSurah}_${currentPage}`; if (!rd.includes(uid)) { rd.push(uid); localStorage.setItem(dKey, JSON.stringify(rd)); updateWardDashboardProgress(); } }

function switchAzkarCategory(cat) { triggerHaptic(); currentAzkarCategory = cat; document.querySelectorAll(".azkar-category-tabs-scroll .tab-btn").forEach(b => b.classList.remove("active")); document.getElementById(`tab-${cat}`).classList.add("active"); renderAzkarList(fullAzkarDatabase[cat]); }
function renderAzkarList(list) { const c = document.getElementById("azkar-container"); if(!c) return; c.innerHTML = ""; list.forEach((z, i) => { const d = document.createElement("div"); d.className = "zekr-card"; d.innerHTML = `<div class="zekr-text">${z.text}</div><button id="counter-${currentAzkarCategory}-${i}" class="zekr-counter-btn haptic-btn">المتبقي: ${z.count}</button>`; d.querySelector('button').onclick = () => countZekr(currentAzkarCategory, i); c.appendChild(d); }); }
function filterAzkar() { const q = document.getElementById("azkar-search-input").value.trim().toLowerCase(); if(!q) renderAzkarList(fullAzkarDatabase[currentAzkarCategory]); else renderAzkarList(fullAzkarDatabase[currentAzkarCategory].filter(z => z.text.toLowerCase().includes(q))); }
function countZekr(cat, i) { triggerHaptic(); const b = document.getElementById(`counter-${cat}-${i}`); let n = parseInt(b.innerText.replace(/[^\d]/g, '')); if (n > 1) { n--; b.innerText = `المتبقي: ${n}`; } else { b.innerText = "تمت القراءة ✓"; b.className = "zekr-counter-btn done"; b.disabled = true; } }

function incrementMisbaha() { misbahaCounter++; document.getElementById("misbaha-count-number").innerText = misbahaCounter; if (navigator.vibrate) navigator.vibrate(45); }
function resetMisbaha() { triggerHaptic(); misbahaCounter = 0; document.getElementById("misbaha-count-number").innerText = misbahaCounter; }

function calculateKhatmaPlan() { 
  const input = document.getElementById("khatma-days-input");
  const needed = document.getElementById("khatma-pages-needed");
  if(!input || !needed) return;
  const d = parseInt(input.value);
  if(isNaN(d) || d <= 0) { needed.innerText = "0 صفحة"; return; }
  needed.innerText = `${Math.ceil(604 / d)} صفحة`; 
}
function activateKhatmaChallenge() { 
  triggerHaptic(); 
  const d = parseInt(document.getElementById("khatma-days-input").value);
  if(isNaN(d) || d <= 0) { showToast("الرجاء إدخال مدة صحيحة"); return; }
  localStorage.setItem("active_khatma_challenge", JSON.stringify({ days: d, pagesPerDay: Math.ceil(604 / d) })); 
  showToast("تم الاعتماد"); showSection('home-dashboard'); 
}
function checkKhatmaStatusOnDashboard() { 
  const k = localStorage.getItem("active_khatma_challenge"); 
  if(k && document.getElementById("dashboard-khatma-text")) { 
    const pk = JSON.parse(k); 
    document.getElementById("dashboard-khatma-text").innerText = `المطلوب: ${pk.pagesPerDay} صفحة يومياً`; 
    document.getElementById("dashboard-khatma-alert").classList.remove("hidden"); 
  } 
}

function switchFinancialTab(t) { triggerHaptic(); document.querySelectorAll(".f-capsule-btn").forEach(b => b.classList.remove("active")); document.querySelectorAll(".sub-financial-panel").forEach(p => p.classList.add("hidden")); document.getElementById(`f-tab-${t}`).classList.add("active"); document.getElementById(`financial-${t}-content`).classList.remove("hidden"); if(t==='records') renderFinancialHistory(); }
function calculateZakat() { const a = parseFloat(document.getElementById("zakat-amount-input").value); if(isNaN(a) || a<=0) return; const z = a*0.025; document.getElementById("zakat-output").innerText = z.toFixed(2); }
function calculateKhums() { const a = parseFloat(document.getElementById("khums-amount-input").value); if(isNaN(a) || a<=0) return; const k = a*0.20; document.getElementById("khums-total-output").innerText = k.toFixed(2); document.getElementById("khums-imam-output").innerText = (k/2).toFixed(2); document.getElementById("khums-sadah-output").innerText = (k/2).toFixed(2); }
function saveToFinancialHistory(type) { triggerHaptic(); let amt, right; if(type==='زكاة'){ amt=parseFloat(document.getElementById("zakat-amount-input").value); right=parseFloat(document.getElementById("zakat-output").innerText); } else { amt=parseFloat(document.getElementById("khums-amount-input").value); right=parseFloat(document.getElementById("khums-total-output").innerText); } if(isNaN(amt)||amt<=0){showToast("أدخل مبلغ صحيح"); return;} const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; h.push({type, right, date: new Date().toLocaleDateString('ar-SA')}); localStorage.setItem("financial_history_records", JSON.stringify(h)); showToast("تم الحفظ"); }

function renderFinancialHistory() { 
  const c = document.getElementById("financial-history-list"); 
  c.innerHTML = ""; 
  const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; 
  
  if (h.length === 0) {
    c.innerHTML = `<div style="text-align: center; opacity: 0.7; padding: 20px; font-family: 'Cairo'; color: var(--text);">لا توجد سجلات محفوظة حالياً</div>`;
    return;
  }
  
  h.forEach((i, index) => { 
    c.innerHTML += `
    <div class="history-item-row" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg); padding: 12px 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border);">
      <div class="history-meta-info">
        <h5 style="margin: 0 0 5px 0; font-size: 1rem; color: var(--primary);">${i.type}</h5>
        <span style="font-size: 0.8rem; opacity: 0.8; color: var(--text);">${i.date}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div class="history-val" style="font-weight: bold; color: var(--text); font-size: 1.1rem;">★ ${i.right.toFixed(2)}</div>
        <button onclick="deleteFinancialRecord(${index})" class="haptic-btn" style="background: transparent; border: none; color: #e63946; font-size: 1.2rem; cursor: pointer; padding: 5px;"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>`; 
  }); 
  
  c.innerHTML += `<button onclick="clearFinancialHistory()" class="clear-history-btn haptic-btn" style="width: 100%; padding: 12px; background: rgba(230, 57, 70, 0.08); color: #e63946; border: 1px solid rgba(230, 57, 70, 0.2); border-radius: 12px; font-family: 'Cairo'; font-size: 0.95rem; font-weight: bold; margin-top: 15px; cursor: pointer;"><i class="fa-solid fa-trash"></i> مسح جميع السجلات</button>`;
}

// الدوال الجديدة المخصصة للنافذة المنبثقة بدلاً من رسائل التحذير الافتراضية
function deleteFinancialRecord(index) { 
  triggerHaptic(); 
  deleteActionTarget = 'single';
  deleteTargetIndex = index;
  document.getElementById("delete-popup-msg").innerText = "هل أنت متأكد من حذف هذا السجل بشكل نهائي؟";
  document.getElementById("delete-confirm-popup").classList.remove("hidden-popup");
}

function clearFinancialHistory() { 
  triggerHaptic();
  deleteActionTarget = 'all';
  deleteTargetIndex = null;
  document.getElementById("delete-popup-msg").innerText = "هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذه الخطوة.";
  document.getElementById("delete-confirm-popup").classList.remove("hidden-popup");
}

function closeDeletePopup() {
  triggerHaptic();
  document.getElementById("delete-confirm-popup").classList.add("hidden-popup");
  deleteActionTarget = null;
  deleteTargetIndex = null;
}

function executeDelete() {
  triggerHaptic();
  if (deleteActionTarget === 'single' && deleteTargetIndex !== null) {
    const h = JSON.parse(localStorage.getItem("financial_history_records")) || [];
    h.splice(deleteTargetIndex, 1);
    localStorage.setItem("financial_history_records", JSON.stringify(h));
    renderFinancialHistory();
    showToast("تم حذف السجل");
  } else if (deleteActionTarget === 'all') {
    localStorage.removeItem("financial_history_records");
    renderFinancialHistory();
    showToast("تم المسح بالكامل");
  }
  closeDeletePopup();
}

function triggerVersePopup(text, info) { tempSelectedVerseText = text; tempSelectedVerseInfo = info; document.getElementById("popup-verse-text").innerText = `﴿ ${text} ﴾`; document.getElementById("popup-verse-info").innerText = info; document.getElementById("verse-action-popup").classList.remove("hidden-popup"); }
function closeVersePopup() { triggerHaptic(); document.getElementById("verse-action-popup").classList.add("hidden-popup"); }
function copySelectedVerse() { triggerHaptic(); navigator.clipboard.writeText(`﴿ ${tempSelectedVerseText} ﴾ [ ${tempSelectedVerseInfo} ]`).then(() => { showToast("تم النسخ"); closeVersePopup(); }); }

/* ==========================================
   الاستماع الفوري (اللحظي) للإشعارات من فايربيس
   ========================================== */
function setupNotificationsListener() {
  const container = document.getElementById("notifications-list");
  if (!container) return;

  database.ref('notifications').on('value', (snapshot) => {
    container.innerHTML = ""; 
    const data = snapshot.val();
    
    if (!data) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6; font-size: 0.9rem; color: var(--text);">لا توجد إشعارات حالياً من إدارة التطبيق</div>`;
      return;
    }

    const messages = [];
    for (let key in data) { messages.push(data[key]); }

    messages.reverse().forEach(msg => {
      container.innerHTML += `
        <div style="background: var(--bg); border: 1px solid var(--border); padding: 12px 15px; border-radius: 14px; position: relative; margin-bottom: 10px;">
          <div style="font-weight: bold; color: var(--primary); font-size: 0.85rem; margin-bottom: 5px; display: flex; justify-content: space-between;">
            <span>إدارة التطبيق</span>
            <span style="opacity: 0.7; font-size: 0.75rem;">${msg.time || ''}</span>
          </div>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text); line-height: 1.5;">${msg.text}</p>
        </div>
      `;
    });
  });
}

// تشغيل الأكواد والوظائف عند اكتمال تحميل الواجهة
window.addEventListener("DOMContentLoaded", () => { 
  try { loadPreferences(); } catch(e){ console.error(e); }
  try { renderAsmaMiniCards(); } catch(e){ console.error(e); }
  try { setupNameOfDay(); } catch(e){ console.error(e); }
  try { calculateHijriDate(); } catch(e){ console.error(e); }
  try { loadSurahs(); } catch(e){ console.error(e); }
  try { setupNotificationsListener(); } catch(e){ console.error(e); } 
});
