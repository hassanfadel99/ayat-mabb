/**
 * تطبيق آيات - الملف البرمجي الكامل
 */

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

try { firebase.initializeApp(firebaseConfig); } catch(e) {}
const database = typeof firebase !== 'undefined' ? firebase.database() : null;

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
    about_desc: "تطبيق آيات هو رفيقك الرقمي لرحلة إيمانية متكاملة، يجمع بين بساطة التصميم وعمق المحتوى.",
    copy: "نسخ النص", close: "إغلاق", share: "مشاركة التطبيق", stories: "ستوريات قرآنية", stories_desc: "تلاوات قصيرة"
  }
};

// 🌟 استعادة الـ 99 اسم بالكامل
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

// 🌟 استعادة مصفوفة الأذكار بالكامل
const fullAzkarDatabase = {
  sabah: [
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1 },
    { text: "قُلْ هُوَ اللَّهُ أَحَدٌ... (ثلاث مرات)", count: 3 },
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ...", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: 1 },
    { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.", count: 1 }
  ],
  maseh: [
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1 },
    { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... (ثلاث مرات)", count: 3 },
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ...", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.", count: 1 },
    { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ...", count: 1 }
  ],
  travel: [
    { text: "اللهُ أَكْبَر، اللهُ أَكْبَر، اللهُ أَكْبَر، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ...", count: 1 },
    { text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى...", count: 1 }
  ],
  prayer: [
    { text: "أَسْتَغْفِرُ اللَّهَ (ثَلَاثاً). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ.", count: 1 },
    { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...", count: 1 },
    { text: "سُبْحَانَ اللَّهِ (33)، وَالْحَمْدُ لِلَّهِ (33)، وَاللَّهُ أَكْبَرُ (33)...", count: 1 }
  ]
};

let allSurahs = []; let pages = []; let currentPage = 0; let currentSurah = 1; let currentSurahName = "";
let defaultFontSize = 26; let misbahaCounter = 0; let currentAzkarCategory = "sabah";
let tempSelectedVerseText = ""; let tempSelectedVerseInfo = "";
let currentLanguage = "ar"; let currentLayout = "compact";

let deleteActionTarget = null; let deleteTargetIndex = null;
let allStoriesData = [];
let currentPlayingVideo = null; 
let downloadAbortController = null;

function triggerHaptic() { if (navigator.vibrate) navigator.vibrate(15); }

function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div"); toast.id = "toast-notification";
    toast.className = "floating-toast-capsule"; document.body.appendChild(toast);
  }
  toast.innerText = message; toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2500);
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
  if (isDark) { showToast("يرجى التبديل للوضع النهاري لتخصيص الألوان"); return; }
  const hc = document.getElementById('hue-slider-container');
  if(hc) hc.classList.toggle('hidden');
}

function setAppMode(mode) {
  triggerHaptic();
  const nBtn = document.getElementById("mode-night-btn");
  const dBtn = document.getElementById("mode-day-btn");
  const hc = document.getElementById('hue-slider-container');
  
  if(mode === 'night') {
    document.body.classList.add('dark-mode');
    localStorage.setItem("ayat_darkmode", "true");
    if(nBtn) nBtn.classList.add("active");
    if(dBtn) dBtn.classList.remove("active");
    if(hc) hc.classList.add('hidden');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem("ayat_darkmode", "false");
    if(dBtn) dBtn.classList.add("active");
    if(nBtn) nBtn.classList.remove("active");
    applyHueColor(localStorage.getItem("ayat_hue") || 345, false);
  }
}

function hslToHex(h, s, l) {
  l /= 100; const a = s * Math.min(l, 1 - l) / 100;
  const f = n => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function applyHueColor(hue, isUserInteraction = true) {
  if (isUserInteraction) triggerHaptic();
  localStorage.setItem("ayat_hue", hue);
  const hueSlider = document.getElementById('hue-slider');
  if(hueSlider) hueSlider.value = hue;
  if(document.body.classList.contains("dark-mode")) return; 
  document.documentElement.style.setProperty('--primary', hslToHex(hue, 80, 35));
  document.documentElement.style.setProperty('--secondary', hslToHex(hue, 80, 25));
}

const hueSlider = document.getElementById('hue-slider');
if(hueSlider) { hueSlider.addEventListener('input', function(e) { applyHueColor(e.target.value, false); }); }

function changeLayout(layoutType) {
  triggerHaptic(); currentLayout = layoutType;
  document.body.classList.remove("layout-compact", "layout-list", "layout-cards", "layout-minimal", "layout-comfortable");
  if(layoutType !== "comfortable") document.body.classList.add(`layout-${layoutType}`); else document.body.classList.add(`layout-comfortable`);
  localStorage.setItem("ayat_layout", layoutType);
  document.querySelectorAll(".layout-btn").forEach(btn => btn.classList.remove("active"));
  const btn = document.getElementById(`layout-${layoutType}-btn`);
  if(btn) btn.classList.add("active");
}

function changeLanguage(lang) {
  triggerHaptic(); currentLanguage = lang; localStorage.setItem("ayat_lang", lang);
  document.documentElement.lang = lang; document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
  document.querySelectorAll(".lang-group button").forEach(b => b.classList.remove("active"));
  const langBtn = document.getElementById(`lang-${lang}-btn`);
  if(langBtn) langBtn.classList.add("active");
  const dict = i18n[lang] || i18n['ar'];
  document.querySelectorAll("[data-i18n]").forEach(el => { const key = el.getAttribute("data-i18n"); if(dict[key] && el) el.innerText = dict[key]; });
}

function loadPreferences() {
  changeLanguage(localStorage.getItem("ayat_lang") || "ar");
  changeLayout(localStorage.getItem("ayat_layout") || "compact"); 
  if (localStorage.getItem("ayat_darkmode") === "true") setAppMode('night'); else setAppMode('day');
}

function renderAsmaMiniCards() {
  const grid = document.getElementById("asma-mini-grid"); if(!grid) return; grid.innerHTML = "";
  asmaUlHusna.forEach((asma) => {
    const chip = document.createElement("div"); chip.className = "asma-chip haptic-btn";
    chip.innerHTML = `<span class="asma-chip-name">${asma.name}</span>`;
    chip.onclick = () => openAsmaPopup(asma); grid.appendChild(chip);
  });
}

function openAsmaPopup(asma) {
  triggerHaptic(); 
  const n = document.getElementById("popup-asma-name"); if(n) n.innerText = asma.name;
  const m = document.getElementById("popup-asma-meaning"); if(m) m.innerText = asma.meaning;
  const a = document.getElementById("popup-asma-ayah"); if(a) a.innerText = asma.ayah;
  const s = document.getElementById("popup-asma-surah"); if(s) s.innerText = asma.quran;
  const p = document.getElementById("asma-info-popup"); if(p) p.classList.remove("hidden-popup");
}
function closeAsmaPopup() { triggerHaptic(); const p = document.getElementById("asma-info-popup"); if(p) p.classList.add("hidden-popup"); }

function setupNameOfDay() {
  const msInDay = 86400000; const dayOfYear = Math.floor(Date.now() / msInDay);
  const nod = asmaUlHusna[dayOfYear % asmaUlHusna.length];
  const el = document.getElementById("nod-name");
  if(el && nod) el.innerText = nod.name;
}

const quranAudioEl = document.getElementById("quran-audio");
const seekbar = document.getElementById("f-audio-seekbar");
const currentTimeEl = document.getElementById("f-audio-current");
const durationEl = document.getElementById("f-audio-duration");
let animationFrameId;

function formatTime(seconds) { if (isNaN(seconds) || !isFinite(seconds)) return "0:00"; const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60); return `${m}:${s < 10 ? '0' : ''}${s}`; }

function updateSeekbarSmoothly() {
  if (quranAudioEl && !quranAudioEl.paused) {
    if (seekbar && !seekbar.isDragging) { seekbar.value = quranAudioEl.currentTime; if (currentTimeEl) currentTimeEl.innerText = formatTime(quranAudioEl.currentTime); }
    animationFrameId = requestAnimationFrame(updateSeekbarSmoothly);
  }
}

function startAudio() {
  triggerHaptic(); 
  const readerSelect = document.getElementById("reader-select");
  if(!quranAudioEl || !readerSelect) return;
  quranAudioEl.src = `https://cdn.islamic.network/quran/audio-surah/128/${readerSelect.value}/${currentSurah}.mp3`;
  quranAudioEl.play();
}

if(quranAudioEl) {
  quranAudioEl.onloadedmetadata = () => { if(seekbar) seekbar.max = quranAudioEl.duration; if(durationEl) durationEl.innerText = formatTime(quranAudioEl.duration); };
  if(seekbar) {
    const startDrag = () => { seekbar.isDragging = true; };
    const endDrag = () => { seekbar.isDragging = false; quranAudioEl.currentTime = seekbar.value; };
    seekbar.addEventListener('mousedown', startDrag); seekbar.addEventListener('touchstart', startDrag, {passive: true});
    seekbar.addEventListener('mouseup', endDrag); seekbar.addEventListener('touchend', endDrag);
    seekbar.oninput = () => { if(currentTimeEl) currentTimeEl.innerText = formatTime(seekbar.value); };
  }
  quranAudioEl.onplay = () => { 
      const player = document.getElementById("floating-audio-player"); if(player) player.classList.remove("hidden"); 
      const surahEl = document.getElementById("f-audio-surah"); if(surahEl) surahEl.innerText = `سورة ${currentSurahName}`; 
      const btnPlay = document.getElementById("f-btn-play"); if(btnPlay) btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
      const icon = document.getElementById("f-audio-icon"); if(icon) icon.classList.add("fa-spin"); 
      animationFrameId = requestAnimationFrame(updateSeekbarSmoothly); 
  };
  quranAudioEl.onpause = () => { 
      const btnPlay = document.getElementById("f-btn-play"); if(btnPlay) btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>'; 
      const icon = document.getElementById("f-audio-icon"); if(icon) icon.classList.remove("fa-spin"); 
      cancelAnimationFrame(animationFrameId); 
  };
  quranAudioEl.onended = () => { stopAudio(); };
}

function togglePlayPause() { triggerHaptic(); if(quranAudioEl && quranAudioEl.paused) quranAudioEl.play(); else if(quranAudioEl) quranAudioEl.pause(); }
function stopAudio() { triggerHaptic(); if(quranAudioEl) { quranAudioEl.pause(); quranAudioEl.currentTime = 0; cancelAnimationFrame(animationFrameId);} const player = document.getElementById("floating-audio-player"); if(player) player.classList.add("hidden"); }

window.startApp = function() { 
    triggerHaptic(); 
    const splash = document.getElementById("splash-screen");
    if(splash) {
        splash.style.opacity = "0"; 
        setTimeout(() => { 
            splash.classList.add("hidden"); 
            const appC = document.getElementById("app-content");
            if(appC) appC.classList.remove("hidden"); 
            updateWardDashboardProgress(); 
            checkKhatmaStatusOnDashboard(); 
        }, 500); 
    }
}

function toggleSidebar() { 
    triggerHaptic(); 
    const sb = document.getElementById("sidebar");
    const sbo = document.getElementById("sidebar-overlay");
    if(sb) sb.classList.toggle("close"); 
    if(sbo) sbo.classList.toggle("hidden"); 
}

window.showSection = function(id) { 
  triggerHaptic(); 
  const sb = document.getElementById("sidebar");
  if (sb && !sb.classList.contains("close")) toggleSidebar(); 
  
  if (id !== 'stories-section') {
      document.querySelectorAll('.story-video').forEach(vid => { 
          vid.pause(); 
          const overlay = document.getElementById(vid.id.replace('story-vid', 'story-overlay')); 
          if (overlay) overlay.classList.remove('playing'); 
          const miniBtn = document.getElementById(vid.id.replace('story-vid-', 'vid-play-btn-'));
          if(miniBtn) miniBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      });
  } else {
      if(allStoriesData.length > 0) renderStories('all');
  }

  document.querySelectorAll(".dashboard-view").forEach(s => s.classList.add("hidden")); 
  const target = document.getElementById(id);
  if(target) target.classList.remove("hidden"); 
  
  if (id === 'azkar-section') switchAzkarCategory('sabah'); 
  if (id === 'home-dashboard') { updateWardDashboardProgress(); checkKhatmaStatusOnDashboard(); } 
  if (id === 'financial-section') switchFinancialTab('zakat'); 
  window.scrollTo(0,0); 
}

function backToHome() { triggerHaptic(); showSection("home-dashboard"); }
function backToList() { triggerHaptic(); const panel = document.getElementById("surah-selector-panel"); const zone = document.getElementById("reading-zone"); if(panel) panel.classList.remove("hidden"); if(zone) zone.classList.add("hidden"); }

async function loadSurahs() { try { const response = await fetch("https://api.alquran.cloud/v1/surah"); const data = await response.json(); allSurahs = data.data; renderSurahs(allSurahs); } catch { const c = document.getElementById("surah-grid-container"); if(c) c.innerHTML = "<div style='grid-column: 1/-1; text-align:center; padding:20px;'>تعذر التحميل، يرجى التحقق من الإنترنت.</div>"; } }
function renderSurahs(list) { const container = document.getElementById("surah-grid-container"); if(!container) return; container.innerHTML = ""; list.forEach(s => { const btn = document.createElement("button"); btn.className = "surah-grid-item haptic-btn"; btn.innerHTML = `<div class="surah-number">${s.number}</div><div class="surah-name">سورة ${cleanSurahName(s.name)}</div>`; btn.onclick = () => { triggerHaptic(); selectSurah(s.number, s.name); }; container.appendChild(btn); }); }
function filterSurahs() { const s = document.getElementById("surah-search"); if(!s) return; const q = s.value.trim().toLowerCase(); if (!q) { renderSurahs(allSurahs); return; } renderSurahs(allSurahs.filter(s => s.name.toLowerCase().includes(q) || cleanSurahName(s.name).includes(q))); }
async function selectSurah(number, name, savedPage = 0) { currentSurah = number; currentSurahName = cleanSurahName(name); const panel = document.getElementById("surah-selector-panel"); const zone = document.getElementById("reading-zone"); if(panel) panel.classList.add("hidden"); if(zone) zone.classList.remove("hidden"); const st = document.getElementById("surah-title"); if(st) st.innerHTML = `سورة ${currentSurahName}`; const sTxt = document.getElementById("surah-text"); if(sTxt) sTxt.innerHTML = "جاري تحميل الآيات..."; try { const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`); const data = await res.json(); createPages(data.data.ayahs); currentPage = savedPage; renderPage(); saveReadingProgress(number, currentSurahName, savedPage); } catch { if(sTxt) sTxt.innerHTML = "خطأ بالشبكة."; } }
function createPages(ayahs) { pages = []; let temp = []; ayahs.forEach((a, i) => { temp.push({ text: a.text, number: i + 1 }); if (temp.length >= 7) { pages.push(temp); temp = []; } }); if (temp.length > 0) pages.push(temp); }
function renderPage() { const txt = document.getElementById("surah-text"); if(!txt || !pages.length) return; txt.innerHTML = ""; const p = pages[currentPage]; if(!p) return; p.forEach((a) => { const sp = document.createElement("span"); sp.className = "ayah-box"; sp.style.fontSize = defaultFontSize + "px"; sp.innerHTML = ` ${a.text} ﴿${a.number}﴾ `; sp.onclick = () => { triggerHaptic(); triggerVersePopup(a.text, `سورة ${currentSurahName} - آية ${a.number}`); }; txt.appendChild(sp); }); txt.style.fontSize = defaultFontSize + "px"; const ind = document.getElementById("page-indicator"); if(ind) ind.innerHTML = `صفحة ${currentPage + 1} من ${pages.length}`; const prevBtn = document.getElementById("prev-page-btn"); if(prevBtn) prevBtn.disabled = currentPage === 0; const nextBtn = document.getElementById("next-page-btn"); if(nextBtn) nextBtn.disabled = currentPage === pages.length - 1; saveReadingProgress(currentSurah, currentSurahName, currentPage); trackPageReadProgress(); }
function navigatePage(dir) { triggerHaptic(); if (dir === 1 && currentPage < pages.length - 1) { currentPage++; renderPage(); } else if (dir === -1 && currentPage > 0) { currentPage--; renderPage(); } }
function changeFontSize(amt) { triggerHaptic(); defaultFontSize += amt; if (defaultFontSize < 18) defaultFontSize = 18; if (defaultFontSize > 48) defaultFontSize = 48; const t = document.getElementById("surah-text"); if(t) t.style.fontSize = defaultFontSize + "px"; document.querySelectorAll(".ayah-box").forEach(s => s.style.fontSize = defaultFontSize + "px"); }
function saveReadingProgress(num, name, idx) { localStorage.setItem("lastQuranProgress", JSON.stringify({ surahNum: num, surahName: cleanSurahName(name), pageIndex: idx })); }
function resumeLastReading() { const d = localStorage.getItem("lastQuranProgress"); if (d) { const p = JSON.parse(d); showSection('quran-section'); selectSurah(p.surahNum, p.surahName, p.pageIndex); } }
function updateWardGoal() { triggerHaptic(); const gInp = document.getElementById("setting-ward-goal"); const g = gInp ? parseInt(gInp.value) || 5 : 5; localStorage.setItem("ward_pages_goal", g); updateWardDashboardProgress(); showToast("تم الحفظ"); }
function updateWardDashboardProgress() { const dKey = "ward_read_" + new Date().toISOString().split('T')[0]; const rd = JSON.parse(localStorage.getItem(dKey)) || []; const g = parseInt(localStorage.getItem("ward_pages_goal")) || 5; const wGoal = document.getElementById("setting-ward-goal"); if(wGoal) wGoal.value = g; let p = Math.round((rd.length / g) * 100); if (p > 100) p = 100; const wStatus = document.getElementById("ward-status-text"); if (wStatus) wStatus.innerText = `تم قراءة ${rd.length} صفحات`; const wPercent = document.getElementById("ward-percent-badge"); if (wPercent) wPercent.innerText = `${p}%`; const wBar = document.getElementById("ward-bar-fill"); if (wBar) wBar.style.width = `${p}%`; const svd = localStorage.getItem("lastQuranProgress"); const resBox = document.getElementById("resume-reading-box"); if(svd && resBox) { const pr = JSON.parse(svd); const resTxt = document.getElementById("resume-text"); if(resTxt) resTxt.innerHTML = `سورة ${cleanSurahName(pr.surahName)} - صفحة ${pr.pageIndex + 1}`; resBox.classList.remove("hidden"); } }
function trackPageReadProgress() { const dKey = "ward_read_" + new Date().toISOString().split('T')[0]; let rd = JSON.parse(localStorage.getItem(dKey)) || []; const uid = `${currentSurah}_${currentPage}`; if (!rd.includes(uid)) { rd.push(uid); localStorage.setItem(dKey, JSON.stringify(rd)); updateWardDashboardProgress(); } }

function switchAzkarCategory(cat) { triggerHaptic(); currentAzkarCategory = cat; document.querySelectorAll(".azkar-category-tabs-scroll .tab-btn").forEach(b => b.classList.remove("active")); const t = document.getElementById(`tab-${cat}`); if(t) t.classList.add("active"); renderAzkarList(fullAzkarDatabase[cat]); }
function renderAzkarList(list) { const c = document.getElementById("azkar-container"); if(!c || !list) return; c.innerHTML = ""; list.forEach((z, i) => { const d = document.createElement("div"); d.className = "zekr-card"; d.innerHTML = `<div class="zekr-text">${z.text}</div><button id="counter-${currentAzkarCategory}-${i}" class="zekr-counter-btn haptic-btn">المتبقي: ${z.count}</button>`; const b = d.querySelector('button'); if(b) b.onclick = () => countZekr(currentAzkarCategory, i); c.appendChild(d); }); }
function filterAzkar() { const inp = document.getElementById("azkar-search-input"); if(!inp) return; const q = inp.value.trim().toLowerCase(); if(!q) renderAzkarList(fullAzkarDatabase[currentAzkarCategory]); else renderAzkarList(fullAzkarDatabase[currentAzkarCategory].filter(z => z.text.toLowerCase().includes(q))); }
function countZekr(cat, i) { triggerHaptic(); const b = document.getElementById(`counter-${cat}-${i}`); if(!b) return; let n = parseInt(b.innerText.replace(/[^\d]/g, '')); if (n > 1) { n--; b.innerText = `المتبقي: ${n}`; } else { b.innerText = "تمت القراءة ✓"; b.className = "zekr-counter-btn done"; b.disabled = true; } }
function incrementMisbaha() { misbahaCounter++; const num = document.getElementById("misbaha-count-number"); if(num) num.innerText = misbahaCounter; if (navigator.vibrate) navigator.vibrate(45); }
function resetMisbaha() { triggerHaptic(); misbahaCounter = 0; const num = document.getElementById("misbaha-count-number"); if(num) num.innerText = misbahaCounter; }

function calculateKhatmaPlan() { const input = document.getElementById("khatma-days-input"); const needed = document.getElementById("khatma-pages-needed"); if(!input || !needed) return; const d = parseInt(input.value); if(isNaN(d) || d <= 0) { needed.innerText = "0 صفحة"; return; } needed.innerText = `${Math.ceil(604 / d)} صفحة`; }
function activateKhatmaChallenge() { triggerHaptic(); const inp = document.getElementById("khatma-days-input"); if(!inp) return; const d = parseInt(inp.value); if(isNaN(d) || d <= 0) { showToast("الرجاء إدخال مدة صحيحة"); return; } localStorage.setItem("active_khatma_challenge", JSON.stringify({ days: d, pagesPerDay: Math.ceil(604 / d) })); showToast("تم الاعتماد"); showSection('home-dashboard'); }
function checkKhatmaStatusOnDashboard() { const k = localStorage.getItem("active_khatma_challenge"); const dText = document.getElementById("dashboard-khatma-text"); const dAlert = document.getElementById("dashboard-khatma-alert"); if(k && dText && dAlert) { const pk = JSON.parse(k); dText.innerText = `المطلوب: ${pk.pagesPerDay} صفحة يومياً`; dAlert.classList.remove("hidden"); } }

function switchFinancialTab(t) { triggerHaptic(); document.querySelectorAll(".f-capsule-btn").forEach(b => b.classList.remove("active")); document.querySelectorAll(".sub-financial-panel").forEach(p => p.classList.add("hidden")); const tBtn = document.getElementById(`f-tab-${t}`); if(tBtn) tBtn.classList.add("active"); const tCon = document.getElementById(`financial-${t}-content`); if(tCon) tCon.classList.remove("hidden"); if(t==='records') renderFinancialHistory(); }
function calculateZakat() { const inp = document.getElementById("zakat-amount-input"); if(!inp) return; const a = parseFloat(inp.value); if(isNaN(a) || a<=0) return; const z = a*0.025; const zOut = document.getElementById("zakat-output"); if(zOut) zOut.innerText = z.toFixed(2); }
function calculateKhums() { const inp = document.getElementById("khums-amount-input"); if(!inp) return; const a = parseFloat(inp.value); if(isNaN(a) || a<=0) return; const k = a*0.20; const kOut = document.getElementById("khums-total-output"); if(kOut) kOut.innerText = k.toFixed(2); const kImam = document.getElementById("khums-imam-output"); if(kImam) kImam.innerText = (k/2).toFixed(2); const kSad = document.getElementById("khums-sadah-output"); if(kSad) kSad.innerText = (k/2).toFixed(2); }
function saveToFinancialHistory(type) { triggerHaptic(); let amt, right; if(type==='زكاة'){ const zInp = document.getElementById("zakat-amount-input"); const zOut = document.getElementById("zakat-output"); amt = zInp ? parseFloat(zInp.value) : 0; right = zOut ? parseFloat(zOut.innerText) : 0; } else { const kInp = document.getElementById("khums-amount-input"); const kOut = document.getElementById("khums-total-output"); amt = kInp ? parseFloat(kInp.value) : 0; right = kOut ? parseFloat(kOut.innerText) : 0; } if(isNaN(amt)||amt<=0){showToast("أدخل مبلغ صحيح"); return;} const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; h.push({type, right, date: new Date().toLocaleDateString('ar-SA')}); localStorage.setItem("financial_history_records", JSON.stringify(h)); showToast("تم الحفظ"); }
function renderFinancialHistory() { const c = document.getElementById("financial-history-list"); if(!c) return; c.innerHTML = ""; const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; if (h.length === 0) { c.innerHTML = `<div style="text-align: center; opacity: 0.7; padding: 20px; font-family: 'Cairo'; color: var(--text);">لا توجد سجلات محفوظة حالياً</div>`; return; } h.forEach((i, index) => { const safeRight = Number(i.right) || 0; c.innerHTML += `<div class="history-item-row" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg); padding: 12px 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border);"><div class="history-meta-info"><h5 style="margin: 0 0 5px 0; font-size: 1rem; color: var(--primary);">${i.type}</h5><span style="font-size: 0.8rem; opacity: 0.8; color: var(--text);">${i.date}</span></div><div style="display: flex; align-items: center; gap: 15px;"><div class="history-val" style="font-weight: bold; color: var(--text); font-size: 1.1rem;">★ ${safeRight.toFixed(2)}</div><button onclick="deleteFinancialRecord(${index})" class="haptic-btn" style="background: transparent; border: none; color: #e63946; font-size: 1.2rem; cursor: pointer; padding: 5px;"><i class="fa-solid fa-trash-can"></i></button></div></div>`; }); c.innerHTML += `<button onclick="clearFinancialHistory()" class="clear-history-btn haptic-btn" style="width: 100%; padding: 12px; background: rgba(230, 57, 70, 0.08); color: #e63946; border: 1px solid rgba(230, 57, 70, 0.2); border-radius: 12px; font-family: 'Cairo'; font-size: 0.95rem; font-weight: bold; margin-top: 15px; cursor: pointer;"><i class="fa-solid fa-trash"></i> مسح جميع السجلات</button>`; }
function deleteFinancialRecord(index) { triggerHaptic(); deleteActionTarget = 'single'; deleteTargetIndex = index; const msg = document.getElementById("delete-popup-msg"); if(msg) msg.innerText = "هل أنت متأكد من حذف هذا السجل بشكل نهائي؟"; const popup = document.getElementById("delete-confirm-popup"); if(popup) popup.classList.remove("hidden-popup"); }
function clearFinancialHistory() { triggerHaptic(); deleteActionTarget = 'all'; deleteTargetIndex = null; const msg = document.getElementById("delete-popup-msg"); if(msg) msg.innerText = "هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذه الخطوة."; const popup = document.getElementById("delete-confirm-popup"); if(popup) popup.classList.remove("hidden-popup"); }
function closeDeletePopup() { triggerHaptic(); const p = document.getElementById("delete-confirm-popup"); if(p) p.classList.add("hidden-popup"); deleteActionTarget = null; deleteTargetIndex = null; }
function executeDelete() { triggerHaptic(); if (deleteActionTarget === 'single' && deleteTargetIndex !== null) { const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; h.splice(deleteTargetIndex, 1); localStorage.setItem("financial_history_records", JSON.stringify(h)); renderFinancialHistory(); showToast("تم حذف السجل"); } else if (deleteActionTarget === 'all') { localStorage.removeItem("financial_history_records"); renderFinancialHistory(); showToast("تم المسح بالكامل"); } closeDeletePopup(); }
function triggerVersePopup(text, info) { tempSelectedVerseText = text; tempSelectedVerseInfo = info; const pTxt = document.getElementById("popup-verse-text"); if(pTxt) pTxt.innerText = `﴿ ${text} ﴾`; const pInfo = document.getElementById("popup-verse-info"); if(pInfo) pInfo.innerText = info; const vPopup = document.getElementById("verse-action-popup"); if(vPopup) vPopup.classList.remove("hidden-popup"); }
function closeVersePopup() { triggerHaptic(); const vPopup = document.getElementById("verse-action-popup"); if(vPopup) vPopup.classList.add("hidden-popup"); }
function copySelectedVerse() { triggerHaptic(); navigator.clipboard.writeText(`﴿ ${tempSelectedVerseText} ﴾ [ ${tempSelectedVerseInfo} ]`).then(() => { showToast("تم النسخ"); closeVersePopup(); }); }

function setupNotificationsListener() {
  const container = document.getElementById("notifications-list");
  if (!container || !database) return;
  database.ref('notifications').on('value', (snapshot) => {
    container.innerHTML = ""; const data = snapshot.val();
    if (!data) { container.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6; font-size: 0.9rem; color: var(--text);">لا توجد إشعارات حالياً</div>`; return; }
    const messages = []; for (let key in data) { messages.push(data[key]); }
    messages.reverse().forEach(msg => {
      container.innerHTML += `<div style="background: var(--bg); border: 1px solid var(--border); padding: 12px 15px; border-radius: 14px; margin-bottom: 10px;"><div style="font-weight: bold; color: var(--primary); font-size: 0.85rem; margin-bottom: 5px; display: flex; justify-content: space-between;"><span>إدارة التطبيق</span><span style="opacity: 0.7; font-size: 0.75rem;">${msg.time || ''}</span></div><p style="margin: 0; font-size: 0.95rem; color: var(--text); line-height: 1.5;">${msg.text}</p></div>`;
    });
  });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupStoriesListener() {
  const container = document.getElementById("stories-container");
  if (!container || !database) return;

  database.ref('stories').on('value', (snapshot) => {
    allStoriesData = [];
    const data = snapshot.val();
    if (data) {
      for (let key in data) { allStoriesData.push({ id: key, url: data[key].url }); }
    }
  });
}

window.renderStories = function(filterType) {
  triggerHaptic();
  const container = document.getElementById("stories-container");
  if(!container) return;
  container.innerHTML = "";
  
  const tabAll = document.getElementById("tab-all-stories"); if(tabAll) tabAll.classList.remove("active");
  const tabFav = document.getElementById("tab-fav-stories"); if(tabFav) tabFav.classList.remove("active");
  const tabActive = document.getElementById(`tab-${filterType}-stories`); if(tabActive) tabActive.classList.add("active");

  let favs = JSON.parse(localStorage.getItem('ayat_fav_stories')) || [];
  let storiesToRender = [...allStoriesData]; 

  if (filterType === 'fav') {
      storiesToRender = storiesToRender.filter(s => favs.includes(s.url));
      if(storiesToRender.length === 0) {
          container.innerHTML = `<div style="text-align: center; padding: 150px 20px; opacity: 0.7; font-weight: bold; color: white;">لا توجد ستوريات في المفضلة حالياً ❤️</div>`;
          return;
      }
  }

  shuffleArray(storiesToRender);

  storiesToRender.forEach((vid, index) => {
    const isFav = favs.includes(vid.url);
    const heartClass = isFav ? "fa-solid text-red" : "fa-regular";
    const favActiveClass = isFav ? "active" : "";
    const heartStyle = isFav ? 'style="color: #e63946;"' : '';

    const preloadAttr = index === 0 ? "auto" : "metadata";
    const autoPlayAttr = index === 0 ? "autoplay" : "";

    container.innerHTML += `
      <div class="story-card">
        <div class="story-video-container">
          <video id="story-vid-${index}" class="story-video" src="${vid.url}" loop playsinline webkit-playsinline preload="${preloadAttr}" ${autoPlayAttr}></video>
          <div id="story-overlay-${index}" class="story-overlay-play" onclick="toggleStoryVideo(${index})">
            <i class="fa-solid fa-play"></i>
          </div>
          
          <div class="video-progress-container">
            <button id="vid-play-btn-${index}" class="vid-play-pause-btn haptic-btn" onclick="toggleStoryVideo(${index})">
              <i class="fa-solid fa-play"></i>
            </button>
            <span id="vid-curr-${index}" class="video-time-text">0:00</span>
            <input type="range" id="vid-seek-${index}" class="video-seekbar-input" value="0" min="0" max="100" step="0.1">
            <span id="vid-dur-${index}" class="video-time-text">0:00</span>
          </div>

          <div class="story-overlay-ui">
            <div class="story-info-text">تلاوة عطرة</div>
            <div class="story-side-actions">
              <button id="fav-btn-${index}" class="story-action-fav ${favActiveClass}" onclick="toggleFavorite(event, '${vid.url}', ${index})">
                <i class="${heartClass} fa-heart" ${heartStyle}></i>
              </button>
              <button class="story-action-btn haptic-btn" onclick="directDownloadVideo(event, '${vid.url}')">
                <i class="fa-solid fa-download"></i>
                <span>تنزيل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  setTimeout(() => {
      storiesToRender.forEach((vid, index) => setupVideoControls(index));
      setupAutoPlayObserver();
  }, 500);
}

window.toggleFavorite = function(event, url, index) {
    if(event) event.stopPropagation(); 
    triggerHaptic();
    
    try {
        let favs = JSON.parse(localStorage.getItem('ayat_fav_stories')) || [];
        const btn = document.getElementById(`fav-btn-${index}`);
        if(!btn) return;

        if (favs.includes(url)) {
            favs = favs.filter(u => u !== url);
            btn.classList.remove('active');
            btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
            showToast("تم الإزالة من المفضلة");
        } else {
            favs.push(url);
            btn.classList.add('active');
            btn.innerHTML = `<i class="fa-solid fa-heart text-red" style="color: #e63946;"></i>`;
            showToast("تمت الإضافة للمفضلة ❤️");
        }
        localStorage.setItem('ayat_fav_stories', JSON.stringify(favs));
    } catch(e) { console.error(e); }
}

function setupVideoControls(index) {
    const video = document.getElementById(`story-vid-${index}`);
    const seekbar = document.getElementById(`vid-seek-${index}`);
    const currTimeText = document.getElementById(`vid-curr-${index}`);
    const durTimeText = document.getElementById(`vid-dur-${index}`);

    if(!video || !seekbar) return;
    video.addEventListener('loadedmetadata', () => { if(durTimeText) durTimeText.innerText = formatTime(video.duration); });
    video.addEventListener('timeupdate', () => {
        if (!seekbar.isDragging) {
            const progress = (video.currentTime / video.duration) * 100;
            seekbar.value = progress || 0;
            if(currTimeText) currTimeText.innerText = formatTime(video.currentTime);
        }
    });
    seekbar.addEventListener('input', (e) => {
        seekbar.isDragging = true;
        const seekTo = (e.target.value / 100) * video.duration;
        if(currTimeText) currTimeText.innerText = formatTime(seekTo);
    });
    seekbar.addEventListener('change', (e) => {
        seekbar.isDragging = false;
        video.currentTime = (e.target.value / 100) * video.duration;
    });
}

window.toggleStoryVideo = function(index) {
  triggerHaptic();
  const video = document.getElementById(`story-vid-${index}`);
  const overlay = document.getElementById(`story-overlay-${index}`);
  const miniPlayBtn = document.getElementById(`vid-play-btn-${index}`);
  if(!video) return;
  
  if (video.paused) {
    document.querySelectorAll('.story-video').forEach(vid => { 
      if(vid !== video) { 
        vid.pause(); 
        const ov = document.getElementById(vid.id.replace('vid', 'overlay')); 
        if(ov) ov.classList.remove('playing'); 
        const mb = document.getElementById(vid.id.replace('story-vid-', 'vid-play-btn-'));
        if(mb) mb.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });
    video.play().catch(e => console.log("Play blocked"));
    if(overlay) overlay.classList.add('playing');
    if(miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    currentPlayingVideo = video;
  } else {
    video.pause();
    if(overlay) overlay.classList.remove('playing');
    if(miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    currentPlayingVideo = null;
  }
}

function setupAutoPlayObserver() {
  const videos = document.querySelectorAll('.story-video');
  if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        const overlay = document.getElementById(vid.id.replace('story-vid', 'story-overlay'));
        const miniPlayBtn = document.getElementById(vid.id.replace('story-vid-', 'vid-play-btn-'));

        if (entry.isIntersecting) {
          vid.play().then(() => {
             if(overlay) overlay.classList.add('playing');
             if(miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
             currentPlayingVideo = vid;

             const currentIdNum = parseInt(vid.id.replace('story-vid-', ''));
             const nextVid = document.getElementById(`story-vid-${currentIdNum + 1}`);
             if(nextVid && nextVid.getAttribute('preload') !== 'auto') {
                 nextVid.setAttribute('preload', 'auto');
             }

          }).catch(e => {
             vid.pause();
             if(overlay) overlay.classList.remove('playing');
             if(miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          });
        } else {
          vid.pause();
          vid.currentTime = 0;
          if(overlay) overlay.classList.remove('playing');
          if(miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
      });
    }, { threshold: 0.5 }); 
    videos.forEach(vid => observer.observe(vid));
  }
}

window.shareApp = function() {
  triggerHaptic();
  const shareText = 'تطبيق آيات: رحلة إيمانية متكاملة في القرآن الكريم، الأذكار، والستوريات.\nhttps://hassanfadel99.github.io/maayat/';
  if (typeof AndroidBridge !== "undefined") { AndroidBridge.shareApp(shareText); } 
  else if (navigator.share) { navigator.share({ title: 'تطبيق آيات', text: shareText }).catch(e => {}); } 
  else { navigator.clipboard.writeText(shareText).then(() => showToast("تم نسخ الرابط للحافظة")); }
}

window.directDownloadVideo = async function(event, url) {
  if(event) event.stopPropagation();
  triggerHaptic();
  
  const overlay = document.getElementById('download-progress-overlay');
  const textEl = document.getElementById('download-text');
  const barEl = document.getElementById('download-bar-fill');
  
  if(overlay) overlay.classList.remove('hidden-popup');
  if(textEl) textEl.innerText = "بدأ التحميل... 0%";
  if(barEl) barEl.style.width = "0%";

  if (typeof AndroidBridge !== "undefined") {
     AndroidBridge.downloadVideo(url);
     return; 
  }

  downloadAbortController = new AbortController();
  const signal = downloadAbortController.signal;

  try {
    const response = await fetch(url, { signal });
    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;
    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (total && window.updateDownloadProgress) {
         window.updateDownloadProgress(Math.round((loaded / total) * 100));
      }
    }
    const blobUrl = window.URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    const a = document.createElement('a');
    a.style.display = 'none'; a.href = blobUrl; a.download = "ستوريات_تطبيق_آيات_" + new Date().getTime() + ".mp4";
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(blobUrl); }, 100);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Download cancelled');
    } else {
      if(overlay) overlay.classList.add('hidden-popup');
      window.open(url, "_blank"); 
    }
  }
}

window.cancelDownload = function() {
    triggerHaptic();
    if (typeof AndroidBridge !== "undefined") {
        AndroidBridge.cancelDownloadVideo();
    } else if (downloadAbortController) {
        downloadAbortController.abort();
    }
    
    const overlay = document.getElementById('download-progress-overlay');
    if(overlay) overlay.classList.add('hidden-popup');
    
    const barEl = document.getElementById('download-bar-fill');
    if(barEl) barEl.style.width = "0%";
    
    showToast("تم إيقاف التنزيل");
}

window.updateDownloadProgress = function(percent) {
    const overlay = document.getElementById('download-progress-overlay');
    const textEl = document.getElementById('download-text');
    const barEl = document.getElementById('download-bar-fill');

    if(overlay && overlay.classList.contains('hidden-popup')) overlay.classList.remove('hidden-popup');
    if(textEl) textEl.innerText = `جاري التحميل... ${percent}%`;
    if(barEl) barEl.style.width = `${percent}%`;

    if (percent >= 100) {
        if(textEl) textEl.innerText = "تم الحفظ بنجاح! ✅";
        setTimeout(() => { if(overlay) overlay.classList.add('hidden-popup'); }, 2500);
    }
};

window.addEventListener("DOMContentLoaded", () => { 
  try { loadPreferences(); } catch(e){}
  try { renderAsmaMiniCards(); } catch(e){}
  try { setupNameOfDay(); } catch(e){}
  try { calculateHijriDate(); } catch(e){}
  try { loadSurahs(); } catch(e){}
  try { setupNotificationsListener(); } catch(e){} 
  try { setupStoriesListener(); } catch(e){} 
});
