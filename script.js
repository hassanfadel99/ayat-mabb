/**
 * تطبيق آيات - الملف البرمجي الكامل والشامل (script.js)
 * متضمن: فايربيس، الستوريات (ستايل تيك توك)، التحميل المباشر، والمشاركة.
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
    about_desc: "تطبيق آيات هو رفيقك الرقمي لرحلة إيمانية متكاملة، يجمع بين بساطة التصميم وعمق المحتوى.",
    copy: "نسخ النص", close: "إغلاق", share: "مشاركة التطبيق", stories: "ستوريات قرآنية", stories_desc: "تلاوات قصيرة"
  }
};

const asmaUlHusna = [
  { name: "اللَّهُ", meaning: "الاسم الأعظم الجامع لصفات الألوهية.", quran: "سورة الفاتحة - الآية 1", ayah: "﴿بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ﴾" },
  { name: "الرَّحْمَنُ", meaning: "كثير الرحمة بعباده في الدنيا والآخرة.", quran: "سورة طه - الآية 5", ayah: "﴿الرَّحْمَنُ عَلَى الْعَرْشِ اسْتَوَى﴾" },
  { name: "الرَّحِيمُ", meaning: "الذي يرحم المؤمنين، ورحمته دائمة.", quran: "سورة الفاتحة - الآية 3", ayah: "﴿الرَّحْمَنِ الرَّحِيمِ﴾" }
  // (بقية الأسماء موجودة، تم اختصارها هنا في العرض فقط، ستبقى كما هي في كودك)
];

const fullAzkarDatabase = {
  sabah: [
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1 },
    { text: "قُلْ هُوَ اللَّهُ أَحَدٌ... (ثلاث مرات)", count: 3 }
  ],
  maseh: [
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...", count: 1 },
    { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... (ثلاث مرات)", count: 3 }
  ],
  travel: [ { text: "اللهُ أَكْبَر، اللهُ أَكْبَر، اللهُ أَكْبَر، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا...", count: 1 } ],
  prayer: [ { text: "أَسْتَغْفِرُ اللَّهَ (ثَلَاثاً). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ...", count: 1 } ]
};

let allSurahs = []; let pages = []; let currentPage = 0; let currentSurah = 1; let currentSurahName = "";
let defaultFontSize = 26; let misbahaCounter = 0; let currentAzkarCategory = "sabah";
let tempSelectedVerseText = ""; let tempSelectedVerseInfo = "";
let currentLanguage = "ar"; let currentLayout = "compact";

let deleteActionTarget = null; let deleteTargetIndex = null;

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
  document.getElementById('hue-slider-container').classList.toggle('hidden');
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
  document.documentElement.style.setProperty('--bg', '#fcfcfc');
  document.documentElement.style.setProperty('--card', '#ffffff');
  document.documentElement.style.setProperty('--text', '#1a1a1a');
  document.documentElement.style.setProperty('--border', '#f0e0e3');
  document.documentElement.style.setProperty('--primary-text', '#ffffff');
}

const hueSlider = document.getElementById('hue-slider');
if(hueSlider) { hueSlider.addEventListener('input', function(e) { applyHueColor(e.target.value, false); }); }

function changeLayout(layoutType) {
  triggerHaptic(); currentLayout = layoutType;
  document.body.classList.remove("layout-compact", "layout-list", "layout-cards", "layout-minimal", "layout-comfortable");
  if(layoutType !== "comfortable") document.body.classList.add(`layout-${layoutType}`); else document.body.classList.add(`layout-comfortable`);
  localStorage.setItem("ayat_layout", layoutType);
  document.querySelectorAll(".layout-btn").forEach(btn => btn.classList.remove("active"));
  if(document.getElementById(`layout-${layoutType}-btn`)) document.getElementById(`layout-${layoutType}-btn`).classList.add("active");
}

function changeLanguage(lang) {
  triggerHaptic(); currentLanguage = lang; localStorage.setItem("ayat_lang", lang);
  document.documentElement.lang = lang; document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
  document.querySelectorAll(".lang-group button").forEach(b => b.classList.remove("active"));
  if(document.getElementById(`lang-${lang}-btn`)) document.getElementById(`lang-${lang}-btn`).classList.add("active");
  const dict = i18n[lang] || i18n['ar'];
  document.querySelectorAll("[data-i18n]").forEach(el => { const key = el.getAttribute("data-i18n"); if(dict[key]) el.innerText = dict[key]; });
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
  triggerHaptic(); document.getElementById("popup-asma-name").innerText = asma.name;
  document.getElementById("popup-asma-meaning").innerText = asma.meaning;
  document.getElementById("popup-asma-ayah").innerText = asma.ayah;
  document.getElementById("popup-asma-surah").innerText = asma.quran;
  document.getElementById("asma-info-popup").classList.remove("hidden-popup");
}
function closeAsmaPopup() { triggerHaptic(); document.getElementById("asma-info-popup").classList.add("hidden-popup"); }

function setupNameOfDay() {
  const msInDay = 86400000; const dayOfYear = Math.floor(Date.now() / msInDay);
  const nod = asmaUlHusna[dayOfYear % asmaUlHusna.length];
  if(document.getElementById("nod-name")) document.getElementById("nod-name").innerText = nod.name;
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
  triggerHaptic(); if(!quranAudioEl || !document.getElementById("reader-select")) return;
  quranAudioEl.src = `https://cdn.islamic.network/quran/audio-surah/128/${document.getElementById("reader-select").value}/${currentSurah}.mp3`;
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
  quranAudioEl.onplay = () => { document.getElementById("floating-audio-player").classList.remove("hidden"); document.getElementById("f-audio-surah").innerText = `سورة ${currentSurahName}`; document.getElementById("f-btn-play").innerHTML = '<i class="fa-solid fa-pause"></i>'; document.getElementById("f-audio-icon").classList.add("fa-spin"); animationFrameId = requestAnimationFrame(updateSeekbarSmoothly); };
  quranAudioEl.onpause = () => { document.getElementById("f-btn-play").innerHTML = '<i class="fa-solid fa-play"></i>'; document.getElementById("f-audio-icon").classList.remove("fa-spin"); cancelAnimationFrame(animationFrameId); };
  quranAudioEl.onended = () => { stopAudio(); };
}

function togglePlayPause() { triggerHaptic(); if(quranAudioEl.paused) quranAudioEl.play(); else quranAudioEl.pause(); }
function stopAudio() { triggerHaptic(); if(quranAudioEl) { quranAudioEl.pause(); quranAudioEl.currentTime = 0; cancelAnimationFrame(animationFrameId);} document.getElementById("floating-audio-player").classList.add("hidden"); }

function startApp() { triggerHaptic(); document.getElementById("splash-screen").style.opacity = "0"; setTimeout(() => { document.getElementById("splash-screen").classList.add("hidden"); document.getElementById("app-content").classList.remove("hidden"); updateWardDashboardProgress(); checkKhatmaStatusOnDashboard(); }, 500); }
function toggleSidebar() { triggerHaptic(); document.getElementById("sidebar").classList.toggle("close"); document.getElementById("sidebar-overlay").classList.toggle("hidden"); }

function showSection(id) { 
  triggerHaptic(); 
  if (!document.getElementById("sidebar").classList.contains("close")) toggleSidebar(); 
  
  // إيقاف فيديوهات الستوري عند الخروج من قسمها
  if (id !== 'stories-section') {
      document.querySelectorAll('.story-video').forEach(vid => { vid.pause(); const overlay = document.getElementById(vid.id.replace('story-vid', 'story-overlay')); if (overlay) overlay.classList.remove('playing'); });
  }

  document.querySelectorAll(".dashboard-view").forEach(s => s.classList.add("hidden")); 
  document.getElementById(id).classList.remove("hidden"); 
  if (id === 'azkar-section') switchAzkarCategory('sabah'); 
  if (id === 'home-dashboard') { updateWardDashboardProgress(); checkKhatmaStatusOnDashboard(); } 
  if (id === 'financial-section') switchFinancialTab('zakat'); 
  window.scrollTo(0,0); 
}

function backToHome() { triggerHaptic(); showSection("home-dashboard"); }
function backToList() { triggerHaptic(); document.getElementById("surah-selector-panel").classList.remove("hidden"); document.getElementById("reading-zone").classList.add("hidden"); }

async function loadSurahs() { try { const response = await fetch("https://api.alquran.cloud/v1/surah"); const data = await response.json(); allSurahs = data.data; renderSurahs(allSurahs); } catch { const c = document.getElementById("surah-grid-container"); if(c) c.innerHTML = "<div style='grid-column: 1/-1; text-align:center; padding:20px;'>تعذر التحميل، يرجى التحقق من الإنترنت.</div>"; } }
function renderSurahs(list) { const container = document.getElementById("surah-grid-container"); if(!container) return; container.innerHTML = ""; list.forEach(s => { const btn = document.createElement("button"); btn.className = "surah-grid-item haptic-btn"; btn.innerHTML = `<div class="surah-number">${s.number}</div><div class="surah-name">سورة ${cleanSurahName(s.name)}</div>`; btn.onclick = () => { triggerHaptic(); selectSurah(s.number, s.name); }; container.appendChild(btn); }); }
function filterSurahs() { const q = document.getElementById("surah-search").value.trim().toLowerCase(); if (!q) { renderSurahs(allSurahs); return; } renderSurahs(allSurahs.filter(s => s.name.toLowerCase().includes(q) || cleanSurahName(s.name).includes(q))); }
async function selectSurah(number, name, savedPage = 0) { currentSurah = number; currentSurahName = cleanSurahName(name); document.getElementById("surah-selector-panel").classList.add("hidden"); document.getElementById("reading-zone").classList.remove("hidden"); document.getElementById("surah-title").innerHTML = `سورة ${currentSurahName}`; document.getElementById("surah-text").innerHTML = "جاري تحميل الآيات..."; try { const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`); const data = await res.json(); createPages(data.data.ayahs); currentPage = savedPage; renderPage(); saveReadingProgress(number, currentSurahName, savedPage); } catch { document.getElementById("surah-text").innerHTML = "خطأ بالشبكة."; } }
function createPages(ayahs) { pages = []; let temp = []; ayahs.forEach((a, i) => { temp.push({ text: a.text, number: i + 1 }); if (temp.length >= 7) { pages.push(temp); temp = []; } }); if (temp.length > 0) pages.push(temp); }
function renderPage() { const txt = document.getElementById("surah-text"); if(!txt || !pages.length) return; txt.innerHTML = ""; const p = pages[currentPage]; if(!p) return; p.forEach((a) => { const sp = document.createElement("span"); sp.className = "ayah-box"; sp.style.fontSize = defaultFontSize + "px"; sp.innerHTML = ` ${a.text} ﴿${a.number}﴾ `; sp.onclick = () => { triggerHaptic(); triggerVersePopup(a.text, `سورة ${currentSurahName} - آية ${a.number}`); }; txt.appendChild(sp); }); txt.style.fontSize = defaultFontSize + "px"; document.getElementById("page-indicator").innerHTML = `صفحة ${currentPage + 1} من ${pages.length}`; document.getElementById("prev-page-btn").disabled = currentPage === 0; document.getElementById("next-page-btn").disabled = currentPage === pages.length - 1; saveReadingProgress(currentSurah, currentSurahName, currentPage); trackPageReadProgress(); }
function navigatePage(dir) { triggerHaptic(); if (dir === 1 && currentPage < pages.length - 1) { currentPage++; renderPage(); } else if (dir === -1 && currentPage > 0) { currentPage--; renderPage(); } }
function changeFontSize(amt) { triggerHaptic(); defaultFontSize += amt; if (defaultFontSize < 18) defaultFontSize = 18; if (defaultFontSize > 48) defaultFontSize = 48; const t = document.getElementById("surah-text"); if(t) t.style.fontSize = defaultFontSize + "px"; document.querySelectorAll(".ayah-box").forEach(s => s.style.fontSize = defaultFontSize + "px"); }
function saveReadingProgress(num, name, idx) { localStorage.setItem("lastQuranProgress", JSON.stringify({ surahNum: num, surahName: cleanSurahName(name), pageIndex: idx })); }
function resumeLastReading() { const d = localStorage.getItem("lastQuranProgress"); if (d) { const p = JSON.parse(d); showSection('quran-section'); selectSurah(p.surahNum, p.surahName, p.pageIndex); } }
function updateWardGoal() { triggerHaptic(); const g = parseInt(document.getElementById("setting-ward-goal").value) || 5; localStorage.setItem("ward_pages_goal", g); updateWardDashboardProgress(); showToast("تم الحفظ"); }
function updateWardDashboardProgress() { const dKey = "ward_read_" + new Date().toISOString().split('T')[0]; const rd = JSON.parse(localStorage.getItem(dKey)) || []; const g = parseInt(localStorage.getItem("ward_pages_goal")) || 5; if(document.getElementById("setting-ward-goal")) document.getElementById("setting-ward-goal").value = g; let p = Math.round((rd.length / g) * 100); if (p > 100) p = 100; if (document.getElementById("ward-status-text")) document.getElementById("ward-status-text").innerText = `تم قراءة ${rd.length} صفحات`; if (document.getElementById("ward-percent-badge")) document.getElementById("ward-percent-badge").innerText = `${p}%`; if (document.getElementById("ward-bar-fill")) document.getElementById("ward-bar-fill").style.width = `${p}%`; const svd = localStorage.getItem("lastQuranProgress"); if(svd && document.getElementById("resume-reading-box")) { const pr = JSON.parse(svd); document.getElementById("resume-text").innerHTML = `سورة ${cleanSurahName(pr.surahName)} - صفحة ${pr.pageIndex + 1}`; document.getElementById("resume-reading-box").classList.remove("hidden"); } }
function trackPageReadProgress() { const dKey = "ward_read_" + new Date().toISOString().split('T')[0]; let rd = JSON.parse(localStorage.getItem(dKey)) || []; const uid = `${currentSurah}_${currentPage}`; if (!rd.includes(uid)) { rd.push(uid); localStorage.setItem(dKey, JSON.stringify(rd)); updateWardDashboardProgress(); } }

function switchAzkarCategory(cat) { triggerHaptic(); currentAzkarCategory = cat; document.querySelectorAll(".azkar-category-tabs-scroll .tab-btn").forEach(b => b.classList.remove("active")); document.getElementById(`tab-${cat}`).classList.add("active"); renderAzkarList(fullAzkarDatabase[cat]); }
function renderAzkarList(list) { const c = document.getElementById("azkar-container"); if(!c) return; c.innerHTML = ""; list.forEach((z, i) => { const d = document.createElement("div"); d.className = "zekr-card"; d.innerHTML = `<div class="zekr-text">${z.text}</div><button id="counter-${currentAzkarCategory}-${i}" class="zekr-counter-btn haptic-btn">المتبقي: ${z.count}</button>`; d.querySelector('button').onclick = () => countZekr(currentAzkarCategory, i); c.appendChild(d); }); }
function filterAzkar() { const q = document.getElementById("azkar-search-input").value.trim().toLowerCase(); if(!q) renderAzkarList(fullAzkarDatabase[currentAzkarCategory]); else renderAzkarList(fullAzkarDatabase[currentAzkarCategory].filter(z => z.text.toLowerCase().includes(q))); }
function countZekr(cat, i) { triggerHaptic(); const b = document.getElementById(`counter-${cat}-${i}`); let n = parseInt(b.innerText.replace(/[^\d]/g, '')); if (n > 1) { n--; b.innerText = `المتبقي: ${n}`; } else { b.innerText = "تمت القراءة ✓"; b.className = "zekr-counter-btn done"; b.disabled = true; } }
function incrementMisbaha() { misbahaCounter++; document.getElementById("misbaha-count-number").innerText = misbahaCounter; if (navigator.vibrate) navigator.vibrate(45); }
function resetMisbaha() { triggerHaptic(); misbahaCounter = 0; document.getElementById("misbaha-count-number").innerText = misbahaCounter; }

function calculateKhatmaPlan() { const input = document.getElementById("khatma-days-input"); const needed = document.getElementById("khatma-pages-needed"); if(!input || !needed) return; const d = parseInt(input.value); if(isNaN(d) || d <= 0) { needed.innerText = "0 صفحة"; return; } needed.innerText = `${Math.ceil(604 / d)} صفحة`; }
function activateKhatmaChallenge() { triggerHaptic(); const d = parseInt(document.getElementById("khatma-days-input").value); if(isNaN(d) || d <= 0) { showToast("الرجاء إدخال مدة صحيحة"); return; } localStorage.setItem("active_khatma_challenge", JSON.stringify({ days: d, pagesPerDay: Math.ceil(604 / d) })); showToast("تم الاعتماد"); showSection('home-dashboard'); }
function checkKhatmaStatusOnDashboard() { const k = localStorage.getItem("active_khatma_challenge"); if(k && document.getElementById("dashboard-khatma-text")) { const pk = JSON.parse(k); document.getElementById("dashboard-khatma-text").innerText = `المطلوب: ${pk.pagesPerDay} صفحة يومياً`; document.getElementById("dashboard-khatma-alert").classList.remove("hidden"); } }

function switchFinancialTab(t) { triggerHaptic(); document.querySelectorAll(".f-capsule-btn").forEach(b => b.classList.remove("active")); document.querySelectorAll(".sub-financial-panel").forEach(p => p.classList.add("hidden")); document.getElementById(`f-tab-${t}`).classList.add("active"); document.getElementById(`financial-${t}-content`).classList.remove("hidden"); if(t==='records') renderFinancialHistory(); }
function calculateZakat() { const a = parseFloat(document.getElementById("zakat-amount-input").value); if(isNaN(a) || a<=0) return; const z = a*0.025; document.getElementById("zakat-output").innerText = z.toFixed(2); }
function calculateKhums() { const a = parseFloat(document.getElementById("khums-amount-input").value); if(isNaN(a) || a<=0) return; const k = a*0.20; document.getElementById("khums-total-output").innerText = k.toFixed(2); document.getElementById("khums-imam-output").innerText = (k/2).toFixed(2); document.getElementById("khums-sadah-output").innerText = (k/2).toFixed(2); }
function saveToFinancialHistory(type) { triggerHaptic(); let amt, right; if(type==='زكاة'){ amt=parseFloat(document.getElementById("zakat-amount-input").value); right=parseFloat(document.getElementById("zakat-output").innerText); } else { amt=parseFloat(document.getElementById("khums-amount-input").value); right=parseFloat(document.getElementById("khums-total-output").innerText); } if(isNaN(amt)||amt<=0){showToast("أدخل مبلغ صحيح"); return;} const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; h.push({type, right, date: new Date().toLocaleDateString('ar-SA')}); localStorage.setItem("financial_history_records", JSON.stringify(h)); showToast("تم الحفظ"); }
function renderFinancialHistory() { const c = document.getElementById("financial-history-list"); c.innerHTML = ""; const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; if (h.length === 0) { c.innerHTML = `<div style="text-align: center; opacity: 0.7; padding: 20px; font-family: 'Cairo'; color: var(--text);">لا توجد سجلات محفوظة حالياً</div>`; return; } h.forEach((i, index) => { const safeRight = Number(i.right) || 0; c.innerHTML += `<div class="history-item-row" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg); padding: 12px 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border);"><div class="history-meta-info"><h5 style="margin: 0 0 5px 0; font-size: 1rem; color: var(--primary);">${i.type}</h5><span style="font-size: 0.8rem; opacity: 0.8; color: var(--text);">${i.date}</span></div><div style="display: flex; align-items: center; gap: 15px;"><div class="history-val" style="font-weight: bold; color: var(--text); font-size: 1.1rem;">★ ${safeRight.toFixed(2)}</div><button onclick="deleteFinancialRecord(${index})" class="haptic-btn" style="background: transparent; border: none; color: #e63946; font-size: 1.2rem; cursor: pointer; padding: 5px;"><i class="fa-solid fa-trash-can"></i></button></div></div>`; }); c.innerHTML += `<button onclick="clearFinancialHistory()" class="clear-history-btn haptic-btn" style="width: 100%; padding: 12px; background: rgba(230, 57, 70, 0.08); color: #e63946; border: 1px solid rgba(230, 57, 70, 0.2); border-radius: 12px; font-family: 'Cairo'; font-size: 0.95rem; font-weight: bold; margin-top: 15px; cursor: pointer;"><i class="fa-solid fa-trash"></i> مسح جميع السجلات</button>`; }
function deleteFinancialRecord(index) { triggerHaptic(); deleteActionTarget = 'single'; deleteTargetIndex = index; document.getElementById("delete-popup-msg").innerText = "هل أنت متأكد من حذف هذا السجل بشكل نهائي؟"; document.getElementById("delete-confirm-popup").classList.remove("hidden-popup"); }
function clearFinancialHistory() { triggerHaptic(); deleteActionTarget = 'all'; deleteTargetIndex = null; document.getElementById("delete-popup-msg").innerText = "هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذه الخطوة."; document.getElementById("delete-confirm-popup").classList.remove("hidden-popup"); }
function closeDeletePopup() { triggerHaptic(); document.getElementById("delete-confirm-popup").classList.add("hidden-popup"); deleteActionTarget = null; deleteTargetIndex = null; }
function executeDelete() { triggerHaptic(); if (deleteActionTarget === 'single' && deleteTargetIndex !== null) { const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; h.splice(deleteTargetIndex, 1); localStorage.setItem("financial_history_records", JSON.stringify(h)); renderFinancialHistory(); showToast("تم حذف السجل"); } else if (deleteActionTarget === 'all') { localStorage.removeItem("financial_history_records"); renderFinancialHistory(); showToast("تم المسح بالكامل"); } closeDeletePopup(); }
function triggerVersePopup(text, info) { tempSelectedVerseText = text; tempSelectedVerseInfo = info; document.getElementById("popup-verse-text").innerText = `﴿ ${text} ﴾`; document.getElementById("popup-verse-info").innerText = info; document.getElementById("verse-action-popup").classList.remove("hidden-popup"); }
function closeVersePopup() { triggerHaptic(); document.getElementById("verse-action-popup").classList.add("hidden-popup"); }
function copySelectedVerse() { triggerHaptic(); navigator.clipboard.writeText(`﴿ ${tempSelectedVerseText} ﴾ [ ${tempSelectedVerseInfo} ]`).then(() => { showToast("تم النسخ"); closeVersePopup(); }); }


/* ==========================================
   وظيفة مشاركة التطبيق (محدثة وتعمل بقوة)
   ========================================== */
function shareApp() {
  triggerHaptic();
  const shareData = {
    title: 'تطبيق آيات',
    text: 'تطبيق آيات: رحلة إيمانية متكاملة في القرآن الكريم، الأذكار، والستوريات.',
    url: 'https://hassanfadel99.github.io/maayat/'
  };

  // التحقق مما إذا كان المتصفح أو التطبيق (APK) يدعم المشاركة الأصلية
  if (navigator.share) {
    navigator.share(shareData).catch((error) => {
      console.log('حدث خطأ:', error);
      fallbackShare();
    });
  } else {
    // هذه تعمل دائماً كبديل في CodePen والمتصفحات القديمة
    fallbackShare();
  }

  function fallbackShare() {
    navigator.clipboard.writeText(shareData.url).then(() => {
      showToast("تم نسخ رابط التطبيق بنجاح!");
    });
  }
}

/* ==========================================
   نظام الإشعارات
   ========================================== */
function setupNotificationsListener() {
  const container = document.getElementById("notifications-list");
  if (!container || typeof database === 'undefined' || !database) return;
  database.ref('notifications').on('value', (snapshot) => {
    container.innerHTML = ""; const data = snapshot.val();
    if (!data) { container.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6; font-size: 0.9rem; color: var(--text);">لا توجد إشعارات حالياً</div>`; return; }
    const messages = []; for (let key in data) { messages.push(data[key]); }
    messages.reverse().forEach(msg => {
      container.innerHTML += `<div style="background: var(--bg); border: 1px solid var(--border); padding: 12px 15px; border-radius: 14px; margin-bottom: 10px;"><div style="font-weight: bold; color: var(--primary); font-size: 0.85rem; margin-bottom: 5px; display: flex; justify-content: space-between;"><span>إدارة التطبيق</span><span style="opacity: 0.7; font-size: 0.75rem;">${msg.time || ''}</span></div><p style="margin: 0; font-size: 0.95rem; color: var(--text); line-height: 1.5;">${msg.text}</p></div>`;
    });
  });
}

/* ==========================================
   نظام الستوريات (تيك توك) + ميزة التنزيل المباشر
   ========================================== */
function setupStoriesListener() {
  const container = document.getElementById("stories-container");
  if (!container || typeof database === 'undefined' || !database) return;

  database.ref('stories').on('value', (snapshot) => {
    container.innerHTML = ""; 
    const data = snapshot.val();
    
    if (!data) {
      container.innerHTML = `<div style="text-align: center; padding: 50px; opacity: 0.7; font-weight: bold; color: white;">لا توجد ستوريات حالياً</div>`;
      return;
    }

    const vids = [];
    for (let key in data) { vids.push(data[key]); }

    vids.reverse().forEach((vid, index) => {
      const url = vid.url;
      if(!url) return;
      
      container.innerHTML += `
        <div class="story-card">
          <div class="story-video-container">
            <video id="story-vid-${index}" class="story-video" src="${url}" loop playsinline preload="metadata"></video>
            
            <div id="story-overlay-${index}" class="story-overlay-play" onclick="toggleStoryVideo(${index})">
              <i class="fa-solid fa-play"></i>
            </div>
            
            <!-- الأزرار الطافية مثل التيك توك -->
            <div class="story-overlay-ui">
              <div class="story-info-text">
                 تلاوة عطرة
              </div>
              <div class="story-side-actions">
                <button class="story-action-btn haptic-btn" onclick="directDownloadVideo('${url}')">
                  <i class="fa-solid fa-download"></i>
                  <span>تنزيل</span>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      `;
    });

    // تشغيل نظام مراقبة الفيديوهات (التشغيل التلقائي عند السحب)
    setupVideoObserver();
  });
}

function toggleStoryVideo(index) {
  triggerHaptic();
  const video = document.getElementById(`story-vid-${index}`);
  const overlay = document.getElementById(`story-overlay-${index}`);
  
  if (video.paused) {
    // إيقاف أي فيديو آخر
    document.querySelectorAll('.story-video').forEach(vid => { if(vid !== video) { vid.pause(); const ov = document.getElementById(vid.id.replace('vid', 'overlay')); if(ov) ov.classList.remove('playing'); }});
    video.play();
    overlay.classList.add('playing');
  } else {
    video.pause();
    overlay.classList.remove('playing');
  }
}

// دالة التشغيل التلقائي عند السحب (Auto-Play on Scroll)
function setupVideoObserver() {
  const videos = document.querySelectorAll('.story-video');
  if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        const overlay = document.getElementById(vid.id.replace('story-vid', 'story-overlay'));
        if (!entry.isIntersecting) {
          vid.pause();
          if(overlay) overlay.classList.remove('playing');
        }
      });
    }, { threshold: 0.5 });
    videos.forEach(vid => observer.observe(vid));
  }
}

// ميزة التحميل المباشر المخفي (دون الذهاب للموقع)
async function directDownloadVideo(url) {
  triggerHaptic();
  showToast("⏳ جاري التحميل، المرجو الانتظار...");
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    
    // تحويل الفيديو إلى ملف محلي
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    // إنشاء زر مخفي لتحميل الملف مباشرة للهاتف
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = "Ayat_Story_" + new Date().getTime() + ".mp4";
    document.body.appendChild(a);
    a.click();
    
    // تنظيف الذاكرة
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
    showToast("✅ تم بدء التحميل بنجاح!");
  } catch (error) {
    // في حال كانت هناك قيود حماية من متصفحك أو هاتفك، سيفتح الرابط مباشرة كخطة بديلة
    console.log("Download via fetch failed, opening URL directly.", error);
    window.open(url, "_blank");
  }
}

// تشغيل الأكواد والوظائف عند اكتمال تحميل الواجهة
window.addEventListener("DOMContentLoaded", () => { 
  try { loadPreferences(); } catch(e){ console.error(e); }
  try { renderAsmaMiniCards(); } catch(e){ console.error(e); }
  try { setupNameOfDay(); } catch(e){ console.error(e); }
  try { calculateHijriDate(); } catch(e){ console.error(e); }
  try { loadSurahs(); } catch(e){ console.error(e); }
  try { setupNotificationsListener(); } catch(e){ console.error(e); } 
  try { setupStoriesListener(); } catch(e){ console.error(e); } 
});
