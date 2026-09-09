/** 
 * تطبيق آيات - الملف البرمجي الشامل (النسخة 3.0)
 * الكود الكامل والمرتب (غير مضغوط)
 */ 

let APP_CURRENT_VERSION = 3.0; 
const versionMatch = window.location.href.match(/[?&]v=([0-9.]+)/); 
if (versionMatch && versionMatch[1]) { APP_CURRENT_VERSION = parseFloat(versionMatch[1]); } 

let dynamicUpdateUrl = ""; 

// ==========================================
// 🌟 1. إعدادات فايربيس (Firebase)
// ==========================================
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

try { 
    firebase.initializeApp(firebaseConfig); 
} catch (e) {} 
const database = typeof firebase !== "undefined" ? firebase.database() : null; 

function checkForUpdates() { 
  if (typeof window.AndroidBridge === "undefined") return; 
  if (!database) return; 
  database.ref("app_settings").once("value").then((snapshot) => { 
    const data = snapshot.val(); 
    if (data && parseFloat(data.latest_version) > APP_CURRENT_VERSION) { 
      dynamicUpdateUrl = data.update_url; 
      const updatePopup = document.getElementById("update-popup-overlay"); 
      if (updatePopup) updatePopup.classList.remove("hidden-popup"); 
    } 
  }).catch((error) => console.error("Error checking for updates:", error)); 
} 

function closeUpdatePopup() { 
  triggerHaptic(); 
  const popup = document.getElementById("update-popup-overlay"); 
  if (popup) popup.classList.add("hidden-popup"); 
} 

function executeAppUpdate() { 
  triggerHaptic(); 
  if (dynamicUpdateUrl) { 
    try { 
      if (window.AndroidBridge && typeof window.AndroidBridge.openUpdateLink === "function") { 
        window.AndroidBridge.openUpdateLink(dynamicUpdateUrl); 
      } else { 
        window.location.href = dynamicUpdateUrl; 
      } 
    } catch (e) { 
        window.location.href = dynamicUpdateUrl; 
    } 
  } 
  closeUpdatePopup(); 
} 

// ==========================================
// 🌟 2. المتغيرات الأساسية والدوال المساعدة
// ==========================================
let allSurahs = []; 
let pages = []; 
let currentPage = 0; 
let currentSurah = 1; 
let currentSurahName = ""; 
let defaultFontSize = 26; 
let misbahaCounter = 0; 
let currentAzkarCategory = "sabah"; 
let tempSelectedVerseText = ""; 
let tempSelectedVerseInfo = ""; 
let currentLanguage = "ar"; 
let currentLayout = "compact"; 
let deleteActionTarget = null; 
let deleteTargetIndex = null; 
let allStoriesData = []; 
let currentPlayingVideo = null; 
let downloadAbortController = null; 

function triggerHaptic() { 
    if (navigator.vibrate) navigator.vibrate(15); 
} 

function showToast(message) { 
  let toast = document.getElementById("toast-notification"); 
  if (!toast) { 
    toast = document.createElement("div"); 
    toast.id = "toast-notification"; 
    toast.className = "floating-toast-capsule"; 
    document.body.appendChild(toast); 
  } 
  toast.innerText = message; 
  toast.style.opacity = "1"; 
  setTimeout(() => { toast.style.opacity = "0"; }, 2500); 
} 

function cleanSurahName(name) { 
    return name ? name.replace(/[ًٌٍَُِّْـٰ]/g, "").replace(/سورة/g, "").trim() : ""; 
} 

function calculateHijriDate() { 
  const h = document.getElementById("hijri-date"); 
  if (!h) return; 
  try { 
    let d = new Date(); 
    h.innerText = new Intl.DateTimeFormat("ar-SA", { 
        calendar: "islamic-civil", day: "numeric", month: "long", year: "numeric" 
    }).format(d); 
  } catch (e) { 
      h.innerText = "١ محرم ١٤٤٨ هـ"; 
  } 
} 

// ==========================================
// 🌟 3. تشغيل التطبيق والتنقل
// ==========================================
window.startApp = function () { 
  triggerHaptic(); 
  const splash = document.getElementById("splash-screen"); 
  if (splash) { 
    splash.style.opacity = "0"; 
    setTimeout(() => { 
      splash.classList.add("hidden"); 
      const appC = document.getElementById("app-content"); 
      if (appC) appC.classList.remove("hidden"); 
      
      try { updateWardDashboardProgress(); } catch(e){}
      try { checkKhatmaStatusOnDashboard(); } catch(e){}
      
      // تهيئة صامتة للصوت لدعم الخلفية
      try { 
          if(quranAudioEl) { quranAudioEl.load(); }
          if(libAudioEl) { libAudioEl.load(); }
      } catch(e){}
    }, 500); 
  } 
}; 

function toggleSidebar() { 
  triggerHaptic(); 
  const sb = document.getElementById("sidebar"); 
  const sbo = document.getElementById("sidebar-overlay"); 
  if (sb) sb.classList.toggle("close"); 
  if (sbo) sbo.classList.toggle("hidden"); 
} 

window.showSection = function (id) { 
  triggerHaptic(); 
  const sb = document.getElementById("sidebar"); 
  if (sb && !sb.classList.contains("close")) toggleSidebar(); 
  
  if (id !== "stories-section") { 
    document.querySelectorAll(".story-video").forEach((vid) => { 
      vid.pause(); 
      const overlay = document.getElementById(vid.id.replace("story-vid", "story-overlay")); 
      if (overlay) overlay.classList.remove("playing"); 
      const miniBtn = document.getElementById(vid.id.replace("story-vid-", "vid-play-btn-")); 
      if (miniBtn) miniBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; 
    }); 
  } else { 
      if (allStoriesData.length > 0) renderStories("all"); 
  } 
  
  document.querySelectorAll(".dashboard-view").forEach((s) => s.classList.add("hidden")); 
  const target = document.getElementById(id); 
  if (target) target.classList.remove("hidden"); 
  
  if (id === "azkar-section") switchAzkarCategory("sabah"); 
  if (id === "home-dashboard") { updateWardDashboardProgress(); checkKhatmaStatusOnDashboard(); } 
  if (id === "financial-section") switchFinancialTab("zakat"); 
  if (id === "family-khatma-section") switchFkTab("current"); 
  if (id === "audio-library-section") renderAudioLibrary(); 
  
  window.scrollTo(0, 0); 
}; 

function backToHome() { triggerHaptic(); showSection("home-dashboard"); } 
function backToList() { 
    triggerHaptic(); 
    const panel = document.getElementById("surah-selector-panel"); 
    const zone = document.getElementById("reading-zone"); 
    if (panel) panel.classList.remove("hidden"); 
    if (zone) zone.classList.add("hidden"); 
} 

// ==========================================
// 🌟 4. إعدادات المظهر والواجهة
// ==========================================
function toggleColorSlider() { 
    triggerHaptic(); 
    const hc = document.getElementById("hue-slider-container"); 
    if (hc) hc.classList.toggle("hidden"); 
} 

function setAppMode(mode) { 
  triggerHaptic(); 
  const nBtn = document.getElementById("mode-night-btn"); 
  const dBtn = document.getElementById("mode-day-btn"); 
  const hc = document.getElementById("hue-slider-container"); 
  
  if (mode === "night") { 
      document.body.classList.add("dark-mode"); 
      localStorage.setItem("ayat_darkmode", "true"); 
      if (nBtn) nBtn.classList.add("active"); 
      if (dBtn) dBtn.classList.remove("active"); 
      if (hc) hc.classList.add("hidden"); 
  } else { 
      document.body.classList.remove("dark-mode"); 
      localStorage.setItem("ayat_darkmode", "false"); 
      if (dBtn) dBtn.classList.add("active"); 
      if (nBtn) nBtn.classList.remove("active"); 
      applyHueColor(localStorage.getItem("ayat_hue") || 345, false); 
  } 
} 

function hslToHex(h, s, l) { 
  l /= 100; 
  const a = (s * Math.min(l, 1 - l)) / 100; 
  const f = (n) => { 
      const k = (n + h / 30) % 12; 
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); 
      return Math.round(255 * color).toString(16).padStart(2, "0"); 
  }; 
  return `#${f(0)}${f(8)}${f(4)}`; 
} 

function applyHueColor(hue, isUserInteraction = true) { 
  if (isUserInteraction) triggerHaptic(); 
  localStorage.setItem("ayat_hue", hue); 
  const hueSlider = document.getElementById("hue-slider"); 
  if (hueSlider) hueSlider.value = hue; 
  if (document.body.classList.contains("dark-mode")) return; 
  
  document.documentElement.style.setProperty("--primary", hslToHex(hue, 80, 35)); 
  document.documentElement.style.setProperty("--secondary", hslToHex(hue, 80, 25)); 
} 

const hueSlider = document.getElementById("hue-slider"); 
if (hueSlider) { hueSlider.addEventListener("input", function (e) { applyHueColor(e.target.value, false); }); } 

function changeLayout(layoutType) { 
  triggerHaptic(); 
  currentLayout = layoutType; 
  document.body.classList.remove("layout-compact", "layout-list", "layout-cards", "layout-minimal", "layout-comfortable"); 
  
  if (layoutType !== "comfortable") { 
      document.body.classList.add(`layout-${layoutType}`); 
  } else { 
      document.body.classList.add(`layout-comfortable`); 
  } 
  
  localStorage.setItem("ayat_layout", layoutType); 
  document.querySelectorAll(".layout-btn").forEach((btn) => btn.classList.remove("active")); 
  const btn = document.getElementById(`layout-${layoutType}-btn`); 
  if (btn) btn.classList.add("active"); 
} 

function changeLanguage(lang) { 
  triggerHaptic(); 
  currentLanguage = lang; 
  localStorage.setItem("ayat_lang", lang); 
  document.documentElement.lang = lang; 
  document.documentElement.dir = lang === "en" ? "ltr" : "rtl"; 
  document.querySelectorAll(".lang-group button").forEach((b) => b.classList.remove("active")); 
  const langBtn = document.getElementById(`lang-${lang}-btn`); 
  if (langBtn) langBtn.classList.add("active"); 
} 

function loadPreferences() { 
  changeLanguage(localStorage.getItem("ayat_lang") || "ar"); 
  changeLayout(localStorage.getItem("ayat_layout") || "compact"); 
  if (localStorage.getItem("ayat_darkmode") === "true") setAppMode("night"); 
  else setAppMode("day"); 
} 

// ==========================================
// 🌟 5. نظام إشعارات شاشة القفل (Media Session)
// ==========================================
let currentPlayingType = null;

function updateExternalMediaSession(title, artist, coverUrl) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            album: 'تطبيق آيات',
            artwork: [ { src: coverUrl || 'https://i.ibb.co/yFY29WhK/image.jpg', sizes: '512x512', type: 'image/jpeg' } ]
        });
        
        navigator.mediaSession.setActionHandler('play', () => {
            if (currentPlayingType === 'quran' && quranAudioEl) { quranAudioEl.play(); }
            else if (currentPlayingType === 'dua' && libAudioEl) { libAudioEl.play(); }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (currentPlayingType === 'quran' && quranAudioEl) { quranAudioEl.pause(); }
            else if (currentPlayingType === 'dua' && libAudioEl) { libAudioEl.pause(); }
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            if (currentPlayingType === 'quran') stopQuranAudio();
            else if (currentPlayingType === 'dua') stopLibAudio();
        });
    }
}

// ==========================================
// 🌟 6. نظام مواقيت الصلاة والأذان (المفلتر والآمن)
// ==========================================
let currentCityKey = localStorage.getItem("ayat_city") || "Basra"; 
let prayerTimesData = null; 
let prayerInterval = null; 
let lastScheduledPrayer = ""; 
let lastAdhanPlayed = ""; 
let lastAdhanPlayedDay = ""; 

let adhanToggles = { 
  الفجر: localStorage.getItem("ayat_adhan_fajr") !== "false", 
  الظهر: localStorage.getItem("ayat_adhan_dhuhr") !== "false", 
  المغرب: localStorage.getItem("ayat_adhan_maghrib") !== "false", 
}; 

const iraqCitiesCoords = { 
  Basra: { lat: 30.5081, lng: 47.7835 }, Baghdad: { lat: 33.3152, lng: 44.3661 }, Najaf: { lat: 31.9925, lng: 44.3258 }, 
  Karbala: { lat: 32.616, lng: 44.0249 }, Babil: { lat: 32.4682, lng: 44.4009 }, "Dhi Qar": { lat: 31.058, lng: 46.2573 }, 
  Maysan: { lat: 31.841, lng: 47.1432 }, "Al Qadisiyyah": { lat: 31.9868, lng: 44.9215 }, "Al Muthanna": { lat: 31.3129, lng: 45.2818 }, 
  Wasit: { lat: 32.5065, lng: 45.8231 }, Diyala: { lat: 33.7431, lng: 44.6074 }, Kirkuk: { lat: 35.4674, lng: 44.3828 }, 
  Mosul: { lat: 36.34, lng: 43.13 }, Erbil: { lat: 36.1901, lng: 44.0092 }, Sulaymaniyah: { lat: 35.55, lng: 45.4333 }, 
  Saladin: { lat: 34.6071, lng: 43.6844 }, Anbar: { lat: 33.4215, lng: 43.3006 }, 
}; 

async function fetchPrayerTimes() { 
  try { 
    const coords = iraqCitiesCoords[currentCityKey] || iraqCitiesCoords["Basra"]; 
    const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=0`); 
    const data = await res.json(); 
    if (data.code === 200) { 
      prayerTimesData = data.data.timings; 
      const cleanTime = (t) => t ? t.split(" ")[0] : "--:--";
      document.getElementById("pt-fajr").innerText = format12Hour(cleanTime(prayerTimesData.Fajr)); 
      document.getElementById("pt-dhuhr").innerText = format12Hour(cleanTime(prayerTimesData.Dhuhr)); 
      document.getElementById("pt-maghrib").innerText = format12Hour(cleanTime(prayerTimesData.Maghrib)); 
      startPrayerCountdown(); 
    } 
  } catch (e) { console.error("Error fetching prayer times", e); } 
} 

function format12Hour(timeStr) { 
  if (!timeStr || timeStr === "--:--") return "--:--"; 
  let [h, m] = timeStr.split(":"); h = parseInt(h); let ampm = h >= 12 ? "م" : "ص"; h = h % 12 || 12; return `${h}:${m} ${ampm}`; 
} 

function parseTime(timeStr) { 
  if (!timeStr || timeStr === "--:--") return 0; 
  let [h, m] = timeStr.split(":"); return parseInt(h) * 60 + parseInt(m); 
} 

function startPrayerCountdown() { 
  if (prayerInterval) clearInterval(prayerInterval); 
  prayerInterval = setInterval(calculateNextPrayer, 1000); 
  calculateNextPrayer(); 
} 

function calculateNextPrayer() { 
  if (!prayerTimesData) return; 
  const now = new Date(); 
  const currentHHMM = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2); 
  const currentTimeMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60; 

  const cleanPrayerTime = (timeStr) => timeStr ? timeStr.split(" ")[0] : "00:00";
  const prayersToAlert = { "الفجر": cleanPrayerTime(prayerTimesData.Fajr), "الظهر": cleanPrayerTime(prayerTimesData.Dhuhr), "المغرب": cleanPrayerTime(prayerTimesData.Maghrib) }; 
  const currentDay = now.getDate();

  for (let [prayerName, prayerTime] of Object.entries(prayersToAlert)) { 
    if (adhanToggles[prayerName] && currentHHMM === prayerTime && (lastAdhanPlayed !== prayerTime || lastAdhanPlayedDay !== currentDay)) { 
      lastAdhanPlayed = prayerTime; lastAdhanPlayedDay = currentDay; triggerAdhanAlert(prayerName); 
    } 
  } 

  const uiPrayers = [ 
    { name: "الفجر", timeStr: prayersToAlert["الفجر"], time: parseTime(prayersToAlert["الفجر"]) }, 
    { name: "الظهر", timeStr: prayersToAlert["الظهر"], time: parseTime(prayersToAlert["الظهر"]) }, 
    { name: "المغرب", timeStr: prayersToAlert["المغرب"], time: parseTime(prayersToAlert["المغرب"]) }, 
  ]; 

  let nextPrayerUI = null; let isTomorrowUI = false; 
  for (let i = 0; i < uiPrayers.length; i++) { if (uiPrayers[i].time > currentTimeMins) { nextPrayerUI = uiPrayers[i]; break; } } 
  if (!nextPrayerUI) { nextPrayerUI = uiPrayers[0]; isTomorrowUI = true; } 

  let targetTime = nextPrayerUI.time; if (isTomorrowUI) targetTime += 24 * 60; 

  let diff = targetTime - currentTimeMins; 
  let hrs = Math.floor(diff / 60); let mins = Math.floor(diff % 60); let secs = Math.floor((diff % 1) * 60); 

  const elName = document.getElementById("next-prayer-name"); 
  const elCount = document.getElementById("prayer-countdown"); 
  
  if (elName) elName.innerText = `الصلاة القادمة: ${nextPrayerUI.name}`; 
  if (elCount) { 
      let timeText = `متبقي: `; 
      if (hrs > 0) timeText += `${hrs}س و `; 
      timeText += `${mins}د و ${secs}ث`; 
      elCount.innerText = timeText; 
  } 

  const alarmPrayers = []; 
  if (adhanToggles["الفجر"]) alarmPrayers.push({ name: "الفجر", timeStr: prayersToAlert["الفجر"], time: parseTime(prayersToAlert["الفجر"]) }); 
  if (adhanToggles["الظهر"]) alarmPrayers.push({ name: "الظهر", timeStr: prayersToAlert["الظهر"], time: parseTime(prayersToAlert["الظهر"]) }); 
  if (adhanToggles["المغرب"]) alarmPrayers.push({ name: "المغرب", timeStr: prayersToAlert["المغرب"], time: parseTime(prayersToAlert["المغرب"]) }); 

  if (alarmPrayers.length > 0) { 
    let nextAlarm = null; let isTomorrowAlarm = false; 
    for (let i = 0; i < alarmPrayers.length; i++) { if (alarmPrayers[i].time > currentTimeMins) { nextAlarm = alarmPrayers[i]; break; } } 
    if (!nextAlarm) { nextAlarm = alarmPrayers[0]; isTomorrowAlarm = true; } 

    if (nextAlarm.name !== lastScheduledPrayer) { 
      lastScheduledPrayer = nextAlarm.name; 
      let [h, m] = nextAlarm.timeStr.split(":"); 
      let alarmDate = new Date(); 
      alarmDate.setHours(parseInt(h), parseInt(m), 0, 0); 
      if (isTomorrowAlarm) { alarmDate.setDate(alarmDate.getDate() + 1); } 
      let timeInMillis = alarmDate.getTime(); 

      if (typeof AndroidBridge !== "undefined" && typeof AndroidBridge.schedulePrayerAlarm === "function") { 
        AndroidBridge.schedulePrayerAlarm(nextAlarm.name, timeInMillis); 
      } 
    } 
  } 
} 

function updateCity() { 
  const select = document.getElementById("city-select"); 
  currentCityKey = select.value; 
  localStorage.setItem("ayat_city", currentCityKey); 
  document.getElementById("current-city-name").innerText = select.options[select.selectedIndex].text; 
  lastScheduledPrayer = ""; 
  fetchPrayerTimes(); 
} 

function initPrayerSettings() { 
  const select = document.getElementById("city-select"); 
  if (select) { 
      select.value = currentCityKey; 
      document.getElementById("current-city-name").innerText = select.options[select.selectedIndex].text; 
  } 
  const tFajr = document.getElementById("toggle-fajr"); if (tFajr) tFajr.checked = adhanToggles["الفجر"]; 
  const tDhuhr = document.getElementById("toggle-dhuhr"); if (tDhuhr) tDhuhr.checked = adhanToggles["الظهر"]; 
  const tMaghrib = document.getElementById("toggle-maghrib"); if (tMaghrib) tMaghrib.checked = adhanToggles["المغرب"]; 
} 

function updateAdhanToggles() { 
  triggerHaptic(); 
  const tFajr = document.getElementById("toggle-fajr"); 
  const tDhuhr = document.getElementById("toggle-dhuhr"); 
  const tMaghrib = document.getElementById("toggle-maghrib"); 
  
  if (tFajr) adhanToggles["الفجر"] = tFajr.checked; 
  if (tDhuhr) adhanToggles["الظهر"] = tDhuhr.checked; 
  if (tMaghrib) adhanToggles["المغرب"] = tMaghrib.checked; 
  
  localStorage.setItem("ayat_adhan_fajr", adhanToggles["الفجر"]); 
  localStorage.setItem("ayat_adhan_dhuhr", adhanToggles["الظهر"]); 
  localStorage.setItem("ayat_adhan_maghrib", adhanToggles["المغرب"]); 

  if (typeof AndroidBridge !== "undefined" && typeof AndroidBridge.cancelPrayerAlarm === "function") { 
      AndroidBridge.cancelPrayerAlarm(); 
  } 
  lastScheduledPrayer = ""; 
  fetchPrayerTimes(); 
  showToast("تم تحديث إعدادات الأذان بنجاح"); 
} 

function triggerAdhanAlert(prayerName) { 
  triggerHaptic(); 
  const popup = document.getElementById("adhan-alert-popup"); 
  const nameEl = document.getElementById("adhan-prayer-name"); 
  if (popup) popup.classList.remove("hidden-popup"); 
  if (nameEl) nameEl.innerText = `لصلاة ${prayerName}`; 
  
  try { stopQuranAudio(); } catch (e) {} 
  try { stopLibAudio(); } catch (e) {} 
  
  const adhanAudio = document.getElementById("adhan-audio"); 
  if (adhanAudio) { 
      adhanAudio.currentTime = 0; 
      adhanAudio.play().catch((e) => console.log("المتصفح منع التشغيل التلقائي")); 
  } 
} 

function stopAdhan() { 
  triggerHaptic(); 
  const popup = document.getElementById("adhan-alert-popup"); 
  if (popup) popup.classList.add("hidden-popup"); 
  
  const adhanAudio = document.getElementById("adhan-audio"); 
  if (adhanAudio) { adhanAudio.pause(); adhanAudio.currentTime = 0; } 
} 

// ==========================================
// 🌟 7. دوال مساعدة للصوت وتلوين الشريط
// ==========================================
function formatTime(seconds) { 
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00"; 
  const m = Math.floor(seconds / 60); 
  const s = Math.floor(seconds % 60); 
  return `${m}:${s < 10 ? "0" : ""}${s}`; 
} 

function updateSliderTrackBackground(slider, color) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0; 
    const max = parseFloat(slider.max) || 100; 
    const val = parseFloat(slider.value) || 0;
    let percent = ((val - min) / (max - min)) * 100; 
    if (isNaN(percent)) percent = 0;
    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, rgba(255, 255, 255, 0.2) ${percent}%, rgba(255, 255, 255, 0.2) 100%)`;
}

// ==========================================
// 🌟 8. زر مشاركة التطبيق
// ==========================================
window.shareApp = function () { 
    triggerHaptic(); 
    const shareText = "تطبيق آيات: رحلة إيمانية متكاملة في القرآن الكريم، الأذكار، والستوريات.\nhttps://hassanfadel99.github.io/maayat/"; 
    
    if (typeof window.AndroidBridge !== "undefined" && typeof window.AndroidBridge.shareApp === "function") { 
        window.AndroidBridge.shareApp(shareText); 
    } else if (navigator.share) { 
        navigator.share({ title: "تطبيق آيات", text: shareText }).catch((e) => console.log(e)); 
    } else { 
        navigator.clipboard.writeText(shareText).then(() => showToast("تم نسخ الرابط للحافظة")); 
    } 
}; 

// ==========================================
// 🌟 9. البث المرئي المباشر (HLS)
// ==========================================
let hlsInstance = null;

window.playLiveChannel = function(url, btnElement) {
    triggerHaptic();
    document.querySelectorAll('.tv-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const video = document.getElementById('live-video-player');
    const loader = document.getElementById('live-tv-loader');
    
    try { stopQuranAudio(); stopLibAudio(); } catch(e){}
    
    loader.classList.remove('hidden');
    video.pause();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().then(() => { loader.classList.add('hidden'); }).catch(() => {
            loader.innerHTML = "اضغط على الفيديو لتشغيل البث";
        });
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        if (hlsInstance) { hlsInstance.destroy(); }
        hlsInstance = new Hls();
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
            loader.classList.add('hidden'); 
            video.play().catch(() => loader.innerHTML = "انقر لتشغيل البث");
        });
    } else {
        loader.innerHTML = "جهازك لا يدعم هذا البث.";
    }
}

window.stopLiveTV = function() {
    const video = document.getElementById('live-video-player');
    if (video) { video.pause(); video.src = ""; }
    if (hlsInstance) { hlsInstance.destroy(); }
}

// ==========================================
// 🌟 10. مشغل القرآن الكريم (الشريط العائم)
// ==========================================
const quranAudioEl = document.getElementById("quran-audio"); 
const quranSeekbar = document.getElementById("quran-audio-seekbar"); 
const quranCurrentTimeEl = document.getElementById("quran-audio-current"); 
const quranDurationEl = document.getElementById("quran-audio-duration"); 
let quranAnimationFrameId; 
const quranTrackColor = "#ff9f1c"; 

function updateQuranSeekbarSmoothly() { 
  if (quranAudioEl && !quranAudioEl.paused) { 
    if (quranSeekbar && !quranSeekbar.isDragging) { 
        quranSeekbar.value = quranAudioEl.currentTime; 
        if (quranCurrentTimeEl) quranCurrentTimeEl.innerText = formatTime(quranAudioEl.currentTime); 
        updateSliderTrackBackground(quranSeekbar, quranTrackColor);
    } 
    quranAnimationFrameId = requestAnimationFrame(updateQuranSeekbarSmoothly); 
  } 
} 

window.startQuranAudio = function() { 
  triggerHaptic(); 
  stopLibAudio(); 
  currentPlayingType = 'quran';
  const readerSelect = document.getElementById("reader-select"); 
  if (!quranAudioEl || !readerSelect) return; 
  
  quranAudioEl.src = `https://cdn.islamic.network/quran/audio-surah/128/${readerSelect.value}/${currentSurah}.mp3`; 
  quranAudioEl.play().then(() => {
      const readerName = readerSelect.options[readerSelect.selectedIndex].text;
      updateExternalMediaSession(`سورة ${currentSurahName}`, readerName, 'https://i.ibb.co/yFY29WhK/image.jpg');
  }).catch(e => console.error("Error playing Quran")); 
} 

if (quranAudioEl) { 
  quranAudioEl.onloadedmetadata = () => { 
      if (quranSeekbar) { 
          quranSeekbar.max = quranAudioEl.duration; 
          updateSliderTrackBackground(quranSeekbar, quranTrackColor); 
      } 
      if (quranDurationEl) quranDurationEl.innerText = formatTime(quranAudioEl.duration); 
  }; 
  
  if (quranSeekbar) { 
    const startDrag = () => { quranSeekbar.isDragging = true; }; 
    const endDrag = () => { 
        quranSeekbar.isDragging = false; 
        quranAudioEl.currentTime = quranSeekbar.value; 
        updateSliderTrackBackground(quranSeekbar, quranTrackColor); 
    }; 
    quranSeekbar.addEventListener("mousedown", startDrag); 
    quranSeekbar.addEventListener("touchstart", startDrag, { passive: true }); 
    quranSeekbar.addEventListener("mouseup", endDrag); 
    quranSeekbar.addEventListener("touchend", endDrag); 
    quranSeekbar.oninput = () => { 
        if (quranCurrentTimeEl) quranCurrentTimeEl.innerText = formatTime(quranSeekbar.value); 
        updateSliderTrackBackground(quranSeekbar, quranTrackColor); 
    }; 
  } 
  
  quranAudioEl.onplay = () => { 
    const player = document.getElementById("floating-quran-player"); 
    if (player) player.classList.remove("hidden"); 
    const surahEl = document.getElementById("quran-audio-surah"); 
    if (surahEl) surahEl.innerText = `سورة ${currentSurahName}`; 
    const btnPlay = document.getElementById("quran-btn-play"); 
    if (btnPlay) btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
    const icon = document.getElementById("quran-audio-icon"); 
    if (icon) icon.classList.add("fa-spin"); 
    quranAnimationFrameId = requestAnimationFrame(updateQuranSeekbarSmoothly); 
  }; 
  
  quranAudioEl.onpause = () => { 
    const btnPlay = document.getElementById("quran-btn-play"); 
    if (btnPlay) btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>'; 
    const icon = document.getElementById("quran-audio-icon"); 
    if (icon) icon.classList.remove("fa-spin"); 
    cancelAnimationFrame(quranAnimationFrameId); 
  }; 
  
  quranAudioEl.onended = () => { stopQuranAudio(); }; 
} 

window.toggleQuranPlayPause = function() { 
    triggerHaptic(); 
    if (quranAudioEl && quranAudioEl.paused) quranAudioEl.play(); 
    else if (quranAudioEl) quranAudioEl.pause(); 
} 

window.stopQuranAudio = function() { 
  triggerHaptic(); 
  if (quranAudioEl) { 
      quranAudioEl.pause(); 
      quranAudioEl.currentTime = 0; 
      cancelAnimationFrame(quranAnimationFrameId); 
      if (quranSeekbar) { 
          quranSeekbar.value = 0; 
          updateSliderTrackBackground(quranSeekbar, quranTrackColor); 
      } 
  } 
  const player = document.getElementById("floating-quran-player"); 
  if (player) player.classList.add("hidden"); 
} 

// ==========================================
// 🌟 11. مكتبة الأدعية والمشغل الكامل (Lark Style)
// ==========================================
const libAudioEl = document.getElementById("lib-audio"); 
const fpSeekbar = document.getElementById("fp-seekbar");
let fpAnimationFrameId;
const libTrackColor = "#d2b4de";
const defaultCover = "https://i.ibb.co/yFY29WhK/image.jpg"; 

const audioLibraryData = {
    athkar: [
        { title: "أذكار الصباح", reader: "مرتضى قريش", fileName: "sabah.mp3", cover: defaultCover },
        { title: "أذكار المساء", reader: "حسين خليل", fileName: "massa.mp3", cover: defaultCover }
    ],
    duaa_days: [
        { title: "دعاء يوم السبت", reader: "مرتضى قريش", fileName: "dye1.mp3", cover: defaultCover },
        { title: "دعاء يوم الأحد", reader: "مرتضى قريش", fileName: "dye2.mp3", cover: defaultCover },
        { title: "دعاء يوم الإثنين", reader: "مرتضى قريش", fileName: "dye3.mp3", cover: defaultCover },
        { title: "دعاء يوم الثلاثاء", reader: "مرتضى قريش", fileName: "dye4.mp3", cover: defaultCover },
        { title: "دعاء يوم الأربعاء", reader: "مرتضى قريش", fileName: "dye5.mp3", cover: defaultCover },
        { title: "دعاء يوم الخميس", reader: "مرتضى قريش", fileName: "dye6.mp3", cover: defaultCover },
        { title: "دعاء يوم الجمعة", reader: "مرتضى قريش", fileName: "dye7.mp3", cover: defaultCover }
    ],
    duaa_general: [
        { title: "دعاء التوسل", reader: "مرتضى قريش", fileName: "duaa1.mp3", cover: defaultCover },
        { title: "دعاء الندبة", reader: "مرتضى قريش", fileName: "duaa2.mp3", cover: defaultCover },
        { title: "دعاء أبي حمزة الثمالي", reader: "مرتضى قريش", fileName: "duaa3.mp3", cover: defaultCover },
        { title: "دعاء الإمام السجاد", reader: "مرتضى قريش", fileName: "duaa4.mp3", cover: defaultCover },
        { title: "دعاء السمات", reader: "مرتضى قريش", fileName: "duaa5.mp3", cover: defaultCover },
        { title: "دعاء العهد", reader: "مرتضى قريش", fileName: "duaa6.mp3", cover: defaultCover },
        { title: "دعاء الفرج", reader: "مرتضى قريش", fileName: "duaa7.mp3", cover: defaultCover },
        { title: "دعاء المجير", reader: "مرتضى قريش", fileName: "duaa8.mp3", cover: defaultCover },
        { title: "دعاء زمن الغيبة", reader: "مرتضى قريش", fileName: "duaa9.mp3", cover: defaultCover },
        { title: "دعاء كميل بن زياد", reader: "مرتضى قريش", fileName: "duaa10.mp3", cover: defaultCover },
        { title: "دعاء مكارم الأخلاق", reader: "مرتضى قريش", fileName: "duaa11.mp3", cover: defaultCover },
        { title: "دعاء يا عدتي", reader: "مرتضى قريش", fileName: "duaa12.mp3", cover: defaultCover }
    ],
    mnajat: [
        { title: "اعتراف", reader: "مرتضى قريش", fileName: "mnajat1.mp3", cover: defaultCover },
        { title: "مناجاة الخائفين", reader: "مرتضى قريش", fileName: "mnajat2.mp3", cover: defaultCover },
        { title: "مناجاة الشاكين", reader: "مرتضى قريش", fileName: "mnajat3.mp3", cover: defaultCover },
        { title: "مناجاة المريدين", reader: "مرتضى قريش", fileName: "mnajat4.mp3", cover: defaultCover },
        { title: "مناجاة المفتقرين", reader: "مرتضى قريش", fileName: "mnajat5.mp3", cover: defaultCover },
        { title: "مناجاة أمير المؤمنين", reader: "مرتضى قريش", fileName: "mnajat6.mp3", cover: defaultCover }
    ],
    ziyarats: [
        { title: "الزيارة الجامعة الكبيرة", reader: "مرتضى قريش", fileName: "ziyarat1.mp3", cover: defaultCover },
        { title: "زيارة آل ياسين", reader: "مرتضى قريش", fileName: "ziyarat2.mp3", cover: defaultCover },
        { title: "زيارة الإمام الحسين (ع)", reader: "مرتضى قريش", fileName: "ziyarat3.mp3", cover: defaultCover },
        { title: "زيارة الإمام المهدي (عج)", reader: "مرتضى قريش", fileName: "ziyarat4.mp3", cover: defaultCover },
        { title: "زيارة الإمام علي (ع)", reader: "مرتضى قريش", fileName: "ziyarat5.mp3", cover: defaultCover },
        { title: "زيارة الناحية المقدسة", reader: "مرتضى قريش", fileName: "ziyarat6.mp3", cover: defaultCover },
        { title: "زيارة عاشوراء", reader: "مرتضى قريش", fileName: "ziyarat7.mp3", cover: defaultCover },
        { title: "زيارة وارث", reader: "مرتضى قريش", fileName: "ziyarat8.mp3", cover: defaultCover }
    ]
};

let currentLibSubTab = 'athkar';

window.switchLibrarySubTab = function(subTab) { 
    triggerHaptic(); 
    currentLibSubTab = subTab; 
    document.querySelectorAll('.lark-tab').forEach(btn => btn.classList.remove('active')); 
    const activeTab = document.getElementById(`lib-subtab-${subTab}`); 
    if(activeTab) activeTab.classList.add('active'); 
    renderAudioLibrary(); 
} 

function renderAudioLibrary() { 
    const container = document.getElementById('audio-library-list'); 
    if (!container) return; 
    container.innerHTML = ''; 
    let listToRender = audioLibraryData[currentLibSubTab] || []; 
    if (listToRender.length === 0) { 
        container.innerHTML = `<div style="text-align:center; padding:30px; opacity:0.6;">القسم فارغ حالياً.</div>`; 
        return; 
    } 

    listToRender.forEach(item => { 
        const div = document.createElement('div'); 
        div.className = "audio-track-card haptic-btn"; 
        div.innerHTML = ` 
            <div class="track-thumb-wrapper" onclick="playCustomAudioFile('${item.fileName}', '${item.title}', '${item.reader}', '${item.cover}')"> 
                <img src="${item.cover}" class="track-thumb" alt="cover"> 
                <div class="track-play-overlay"><i class="fa-solid fa-play"></i></div> 
            </div> 
            <div class="track-info" onclick="playCustomAudioFile('${item.fileName}', '${item.title}', '${item.reader}', '${item.cover}')"> 
                <h4>${item.title}</h4> 
                <p>${item.reader}</p> 
            </div> 
            <div class="track-actions"> 
                <button class="track-download-btn haptic-btn" onclick="downloadAudioFile(event, '${item.fileName}', '${item.title}')"> 
                    <i class="fa-solid fa-download"></i> 
                </button> 
            </div> 
        `; 
        container.appendChild(div); 
    }); 
} 

window.playCustomAudioFile = function(fileName, title, reader, cover) { 
    triggerHaptic(); 
    stopQuranAudio(); 
    currentPlayingType = 'dua'; 
    if (!libAudioEl) return; 
    
    libAudioEl.src = fileName; 
    libAudioEl.play().then(() => { 
        updateExternalMediaSession(title, reader, cover); 
    }).catch(e => showToast("عذراً، الملف غير متاح للتشغيل حالياً")); 
    
    document.getElementById("fp-title").innerText = title; 
    document.getElementById("fp-reader").innerText = reader; 
    document.getElementById("fp-cover-image").src = cover; 
    openFullPlayer(); 
} 

window.openFullPlayer = function() { 
    triggerHaptic(); 
    document.getElementById("full-audio-player-modal").classList.remove("hidden"); 
} 

window.closeFullPlayer = function() { 
    triggerHaptic(); 
    document.getElementById("full-audio-player-modal").classList.add("hidden"); 
    if (!libAudioEl.paused) { 
        document.getElementById("floating-lib-player").classList.remove("hidden"); 
        document.getElementById("lib-audio-title").innerText = document.getElementById("fp-title").innerText; 
    } 
} 

window.toggleLibPlayPause = function() { 
    triggerHaptic(); 
    if (libAudioEl.paused) libAudioEl.play(); 
    else libAudioEl.pause(); 
} 

window.stopLibAudio = function() { 
    triggerHaptic(); 
    if (libAudioEl) { 
        libAudioEl.pause(); 
        libAudioEl.currentTime = 0; 
    } 
    document.getElementById("full-audio-player-modal").classList.add("hidden"); 
    document.getElementById("floating-lib-player").classList.add("hidden"); 
} 

window.seekAudio = function(seconds) { 
    triggerHaptic(); 
    if (libAudioEl) libAudioEl.currentTime += seconds; 
} 

function updateFullPlayerUI() { 
    if (libAudioEl && !libAudioEl.paused) { 
        if (!fpSeekbar.isDragging) { 
            fpSeekbar.max = libAudioEl.duration || 100; 
            fpSeekbar.value = libAudioEl.currentTime; 
            document.getElementById("fp-current-time").innerText = formatTime(libAudioEl.currentTime); 
            document.getElementById("fp-duration").innerText = formatTime(libAudioEl.duration); 
            
            const percent = (libAudioEl.currentTime / libAudioEl.duration) * 100; 
            fpSeekbar.style.background = `linear-gradient(to right, ${libTrackColor} 0%, ${libTrackColor} ${percent}%, rgba(255,255,255,0.2) ${percent}%, rgba(255,255,255,0.2) 100%)`; 
            
            const libSeekbar = document.getElementById("lib-audio-seekbar"); 
            if(libSeekbar && !document.getElementById("floating-lib-player").classList.contains("hidden")){ 
                libSeekbar.max = libAudioEl.duration; 
                libSeekbar.value = libAudioEl.currentTime; 
                document.getElementById("lib-audio-current").innerText = formatTime(libAudioEl.currentTime); 
                updateSliderTrackBackground(libSeekbar, libTrackColor); 
            } 
        } 
        document.getElementById("fp-btn-play").innerHTML = '<i class="fa-solid fa-pause"></i>'; 
        const floatBtn = document.getElementById("lib-btn-play"); 
        if(floatBtn) floatBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
        const icon = document.getElementById("lib-audio-icon"); 
        if(icon) icon.classList.add("fa-spin"); 
        
        fpAnimationFrameId = requestAnimationFrame(updateFullPlayerUI); 
    } else { 
        document.getElementById("fp-btn-play").innerHTML = '<i class="fa-solid fa-play"></i>'; 
        const floatBtn = document.getElementById("lib-btn-play"); 
        if(floatBtn) floatBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; 
        const icon = document.getElementById("lib-audio-icon"); 
        if(icon) icon.classList.remove("fa-spin"); 
    } 
} 

if (libAudioEl) { 
    libAudioEl.onplay = () => { updateFullPlayerUI(); }; 
    libAudioEl.onpause = () => { updateFullPlayerUI(); cancelAnimationFrame(fpAnimationFrameId); }; 
    libAudioEl.onended = () => { stopLibAudio(); }; 
    
    if(fpSeekbar){ 
        fpSeekbar.oninput = (e) => { 
            fpSeekbar.isDragging = true; 
            document.getElementById("fp-current-time").innerText = formatTime(e.target.value); 
        }; 
        fpSeekbar.onchange = (e) => { 
            fpSeekbar.isDragging = false; 
            libAudioEl.currentTime = e.target.value; 
        }; 
    } 
    const miniSeekbar = document.getElementById("lib-audio-seekbar"); 
    if(miniSeekbar){ 
        miniSeekbar.oninput = (e) => { 
            miniSeekbar.isDragging = true; 
            document.getElementById("lib-audio-current").innerText = formatTime(e.target.value); 
        }; 
        miniSeekbar.onchange = (e) => { 
            miniSeekbar.isDragging = false; 
            libAudioEl.currentTime = e.target.value; 
        }; 
    } 
} 

window.downloadAudioFile = function(event, url, title) { 
    event.stopPropagation(); 
    triggerHaptic(); 
    showToast("بدأ تحميل " + title + "..."); 
    
    fetch(url).then(response => response.blob()).then(blob => { 
        const blobUrl = window.URL.createObjectURL(blob); 
        const a = document.createElement("a"); 
        a.style.display = "none"; 
        a.href = blobUrl; 
        a.download = title + ".mp3"; 
        document.body.appendChild(a); 
        a.click(); 
        window.URL.revokeObjectURL(blobUrl); 
        showToast("✅ تم حفظ الملف بنجاح"); 
    }).catch(e => { 
        showToast("تعذر التحميل المباشر، سيتم فتح الرابط"); 
        window.open(url, '_blank'); 
    }); 
} 

// ==========================================
// 🌟 12. دوال القرآن الكريم والتلاوة
// ==========================================
async function loadSurahs() { 
  try { 
    const response = await fetch("https://api.alquran.cloud/v1/surah"); 
    const data = await response.json(); 
    allSurahs = data.data; 
    renderSurahs(allSurahs); 
  } catch (e) { 
      console.error(e); 
  } 
} 

function renderSurahs(list) { 
  const container = document.getElementById("surah-grid-container"); 
  if (!container) return; 
  container.innerHTML = ""; 
  list.forEach((s) => { 
    const btn = document.createElement("button"); 
    btn.className = "surah-grid-item haptic-btn"; 
    btn.innerHTML = `<div class="surah-number">${s.number}</div><div class="surah-name">سورة ${cleanSurahName(s.name)}</div>`; 
    btn.onclick = () => { triggerHaptic(); selectSurah(s.number, s.name); }; 
    container.appendChild(btn); 
  }); 
} 

window.filterSurahs = function() { 
  const s = document.getElementById("surah-search"); 
  if (!s) return; 
  const q = s.value.trim().toLowerCase(); 
  if (!q) { renderSurahs(allSurahs); return; } 
  renderSurahs(allSurahs.filter((s) => s.name.toLowerCase().includes(q) || cleanSurahName(s.name).includes(q))); 
} 

window.selectSurah = async function(number, name, savedPage = 0) { 
  currentSurah = number; 
  currentSurahName = cleanSurahName(name); 
  const panel = document.getElementById("surah-selector-panel"); 
  const zone = document.getElementById("reading-zone"); 
  if (panel) panel.classList.add("hidden"); 
  if (zone) zone.classList.remove("hidden"); 
  
  const st = document.getElementById("surah-title"); 
  if (st) st.innerHTML = `سورة ${currentSurahName}`; 
  const sTxt = document.getElementById("surah-text"); 
  if (sTxt) sTxt.innerHTML = "جاري تحميل الآيات..."; 
  
  try { 
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`); 
    const data = await res.json(); 
    createPages(data.data.ayahs); 
    currentPage = savedPage; 
    renderPage(); 
    saveReadingProgress(number, currentSurahName, savedPage); 
  } catch (error) { 
      if (sTxt) sTxt.innerHTML = "حدث خطأ أثناء تحميل السورة."; 
  } 
} 

function createPages(ayahs) { 
  pages = []; 
  let temp = []; 
  ayahs.forEach((a, i) => { 
      temp.push({ text: a.text, number: i + 1 }); 
      if (temp.length >= 7) { pages.push(temp); temp = []; } 
  }); 
  if (temp.length > 0) pages.push(temp); 
} 

function renderPage() { 
  const txt = document.getElementById("surah-text"); 
  if (!txt || !pages.length) return; 
  txt.innerHTML = ""; 
  const p = pages[currentPage]; 
  if (!p) return; 
  
  p.forEach((a) => { 
    const sp = document.createElement("span"); 
    sp.className = "ayah-box"; 
    sp.style.fontSize = defaultFontSize + "px"; 
    sp.innerHTML = ` ${a.text} ﴿${a.number}﴾ `; 
    sp.onclick = () => { triggerHaptic(); triggerVersePopup(a.text, `سورة ${currentSurahName} - آية ${a.number}`); }; 
    txt.appendChild(sp); 
  }); 
  
  txt.style.fontSize = defaultFontSize + "px"; 
  const ind = document.getElementById("page-indicator"); 
  if (ind) ind.innerHTML = `صفحة ${currentPage + 1} من ${pages.length}`; 
  
  const prevBtn = document.getElementById("prev-page-btn"); 
  if (prevBtn) prevBtn.disabled = currentPage === 0; 
  const nextBtn = document.getElementById("next-page-btn"); 
  if (nextBtn) nextBtn.disabled = currentPage === pages.length - 1; 
  
  saveReadingProgress(currentSurah, currentSurahName, currentPage); 
  trackPageReadProgress(); 
} 

window.navigatePage = function(dir) { 
    triggerHaptic(); 
    if (dir === 1 && currentPage < pages.length - 1) { currentPage++; renderPage(); } 
    else if (dir === -1 && currentPage > 0) { currentPage--; renderPage(); } 
} 

window.changeFontSize = function(amt) { 
    triggerHaptic(); 
    defaultFontSize += amt; 
    if (defaultFontSize < 18) defaultFontSize = 18; 
    if (defaultFontSize > 48) defaultFontSize = 48; 
    const t = document.getElementById("surah-text"); 
    if (t) t.style.fontSize = defaultFontSize + "px"; 
    document.querySelectorAll(".ayah-box").forEach((s) => (s.style.fontSize = defaultFontSize + "px")); 
} 

function saveReadingProgress(num, name, idx) { 
    localStorage.setItem("lastQuranProgress", JSON.stringify({ surahNum: num, surahName: cleanSurahName(name), pageIndex: idx })); 
} 

window.resumeLastReading = function() { 
    const d = localStorage.getItem("lastQuranProgress"); 
    if (d) { 
        const p = JSON.parse(d); 
        showSection("quran-section"); 
        selectSurah(p.surahNum, p.surahName, p.pageIndex); 
    } 
} 

window.updateWardGoal = function() { 
    triggerHaptic(); 
    const gInp = document.getElementById("setting-ward-goal"); 
    const g = gInp ? parseInt(gInp.value) || 5 : 5; 
    localStorage.setItem("ward_pages_goal", g); 
    updateWardDashboardProgress(); 
    showToast("تم الحفظ"); 
} 

function updateWardDashboardProgress() { 
  const dKey = "ward_read_" + new Date().toISOString().split("T")[0]; 
  let rd = []; 
  try { 
      let stored = localStorage.getItem(dKey); 
      if (stored) { let parsed = JSON.parse(stored); if (Array.isArray(parsed)) rd = parsed; } 
  } catch (e) { localStorage.removeItem(dKey); } 
  
  const g = parseInt(localStorage.getItem("ward_pages_goal")) || 5; 
  const wGoal = document.getElementById("setting-ward-goal"); 
  if (wGoal) wGoal.value = g; 
  
  let p = Math.round((rd.length / g) * 100); 
  if (p > 100) p = 100; 
  
  const wStatus = document.getElementById("ward-status-text"); 
  if (wStatus) wStatus.innerText = `تم قراءة ${rd.length} صفحات`; 
  const wPercent = document.getElementById("ward-percent-badge"); 
  if (wPercent) wPercent.innerText = `${p}%`; 
  const wBar = document.getElementById("ward-bar-fill"); 
  if (wBar) wBar.style.width = `${p}%`; 
  
  const svd = localStorage.getItem("lastQuranProgress"); 
  const resBox = document.getElementById("resume-reading-box"); 
  if (svd && resBox) { 
      const pr = JSON.parse(svd); 
      const resTxt = document.getElementById("resume-text"); 
      if (resTxt) resTxt.innerHTML = `سورة ${cleanSurahName(pr.surahName)} - صفحة ${pr.pageIndex + 1}`; 
      resBox.classList.remove("hidden"); 
  } 
} 

function trackPageReadProgress() { 
  const dKey = "ward_read_" + new Date().toISOString().split("T")[0]; 
  let rd = []; 
  try { 
      let stored = localStorage.getItem(dKey); 
      if (stored) { let parsed = JSON.parse(stored); if (Array.isArray(parsed)) rd = parsed; } 
  } catch (e) { localStorage.removeItem(dKey); } 
  
  const uid = `${currentSurah}_${currentPage}`; 
  if (!rd.includes(uid)) { 
      rd.push(uid); 
      localStorage.setItem(dKey, JSON.stringify(rd)); 
      updateWardDashboardProgress(); 
  } 
} 

// ==========================================
// 🌟 13. باقي الميزات (الستوريات، المسبحة، الحاسبة، الختمة العائلية)
// ==========================================
window.incrementMisbaha = function() { 
    misbahaCounter++; 
    const num = document.getElementById("misbaha-count-number"); 
    if (num) num.innerText = misbahaCounter; 
    if (navigator.vibrate) navigator.vibrate(45); 
} 

window.resetMisbaha = function() { 
    triggerHaptic(); 
    misbahaCounter = 0; 
    const num = document.getElementById("misbaha-count-number"); 
    if (num) num.innerText = misbahaCounter; 
} 

window.calculateKhatmaPlan = function() { 
    const input = document.getElementById("khatma-days-input"); 
    const needed = document.getElementById("khatma-pages-needed"); 
    if (!input || !needed) return; 
    const d = parseInt(input.value); 
    if (isNaN(d) || d <= 0) { needed.innerText = "0 صفحة"; return; } 
    needed.innerText = `${Math.ceil(604 / d)} صفحة`; 
} 

window.activateKhatmaChallenge = function() { 
    triggerHaptic(); 
    const inp = document.getElementById("khatma-days-input"); 
    if (!inp) return; 
    const d = parseInt(inp.value); 
    if (isNaN(d) || d <= 0) { showToast("الرجاء إدخال مدة صحيحة"); return; } 
    localStorage.setItem("active_khatma_challenge", JSON.stringify({ days: d, pagesPerDay: Math.ceil(604 / d) })); 
    showToast("تم الاعتماد"); 
    showSection("home-dashboard"); 
} 

function checkKhatmaStatusOnDashboard() { 
    const k = localStorage.getItem("active_khatma_challenge"); 
    const dText = document.getElementById("dashboard-khatma-text"); 
    const dAlert = document.getElementById("dashboard-khatma-alert"); 
    if (k && dText && dAlert) { 
        const pk = JSON.parse(k); 
        dText.innerText = `المطلوب: ${pk.pagesPerDay} صفحة يومياً`; 
        dAlert.classList.remove("hidden"); 
    } 
} 

window.switchFinancialTab = function(t) { 
    triggerHaptic(); 
    document.querySelectorAll(".f-capsule-btn").forEach((b) => b.classList.remove("active")); 
    document.querySelectorAll(".sub-financial-panel").forEach((p) => p.classList.add("hidden")); 
    const tBtn = document.getElementById(`f-tab-${t}`); 
    if (tBtn) tBtn.classList.add("active"); 
    const tCon = document.getElementById(`financial-${t}-content`); 
    if (tCon) tCon.classList.remove("hidden"); 
    if (t === "records") renderFinancialHistory(); 
} 

window.calculateZakat = function() { 
    const inp = document.getElementById("zakat-amount-input"); 
    if (!inp) return; 
    const a = parseFloat(inp.value); 
    if (isNaN(a) || a <= 0) return; 
    const z = a * 0.025; 
    const zOut = document.getElementById("zakat-output"); 
    if (zOut) zOut.innerText = z.toFixed(2); 
} 

window.calculateKhums = function() { 
    const inp = document.getElementById("khums-amount-input"); 
    if (!inp) return; 
    const a = parseFloat(inp.value); 
    if (isNaN(a) || a <= 0) return; 
    const k = a * 0.2; 
    const kOut = document.getElementById("khums-total-output"); 
    if (kOut) kOut.innerText = k.toFixed(2); 
    const kImam = document.getElementById("khums-imam-output"); 
    if (kImam) kImam.innerText = (k / 2).toFixed(2); 
    const kSad = document.getElementById("khums-sadah-output"); 
    if (kSad) kSad.innerText = (k / 2).toFixed(2); 
} 

window.saveToFinancialHistory = function(type) { 
    triggerHaptic(); 
    let amt, right; 
    if (type === "زكاة") { 
        const zInp = document.getElementById("zakat-amount-input"); 
        const zOut = document.getElementById("zakat-output"); 
        amt = zInp ? parseFloat(zInp.value) : 0; right = zOut ? parseFloat(zOut.innerText) : 0; 
    } else { 
        const kInp = document.getElementById("khums-amount-input"); 
        const kOut = document.getElementById("khums-total-output"); 
        amt = kInp ? parseFloat(kInp.value) : 0; right = kOut ? parseFloat(kOut.innerText) : 0; 
    } 
    if (isNaN(amt) || amt <= 0) { showToast("أدخل مبلغ صحيح"); return; } 
    
    const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; 
    h.push({ type, right, date: new Date().toLocaleDateString("ar-SA") }); 
    localStorage.setItem("financial_history_records", JSON.stringify(h)); 
    showToast("تم الحفظ"); 
} 

function renderFinancialHistory() { 
    const c = document.getElementById("financial-history-list"); 
    if (!c) return; 
    c.innerHTML = ""; 
    const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; 
    if (h.length === 0) { 
        c.innerHTML = `<div style="text-align: center; opacity: 0.7; padding: 20px; font-family: 'Cairo'; color: var(--text);">لا توجد سجلات محفوظة حالياً</div>`; 
        return; 
    } 
    h.forEach((i, index) => { 
        const safeRight = Number(i.right) || 0; 
        c.innerHTML += `<div class="history-item-row" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg); padding: 12px 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border);"><div class="history-meta-info"><h5 style="margin: 0 0 5px 0; font-size: 1rem; color: var(--primary);">${ i.type }</h5><span style="font-size: 0.8rem; opacity: 0.8; color: var(--text);">${ i.date }</span></div><div style="display: flex; align-items: center; gap: 15px;"><div class="history-val" style="font-weight: bold; color: var(--text); font-size: 1.1rem;">★ ${safeRight.toFixed( 2 )}</div><button onclick="deleteFinancialRecord(${index})" class="haptic-btn" style="background: transparent; border: none; color: #e63946; font-size: 1.2rem; cursor: pointer; padding: 5px;"><i class="fa-solid fa-trash-can"></i></button></div></div>`; 
    }); 
    c.innerHTML += `<button onclick="clearFinancialHistory()" class="clear-history-btn haptic-btn" style="width: 100%; padding: 12px; background: rgba(230, 57, 70, 0.08); color: #e63946; border: 1px solid rgba(230, 57, 70, 0.2); border-radius: 12px; font-family: 'Cairo'; font-size: 0.95rem; font-weight: bold; margin-top: 15px; cursor: pointer;"><i class="fa-solid fa-trash"></i> مسح جميع السجلات</button>`; 
} 

window.deleteFinancialRecord = function(index) { 
    triggerHaptic(); deleteActionTarget = "single"; deleteTargetIndex = index; 
    const msg = document.getElementById("delete-popup-msg"); 
    if (msg) msg.innerText = "هل أنت متأكد من حذف هذا السجل بشكل نهائي؟"; 
    const popup = document.getElementById("delete-confirm-popup"); 
    if (popup) popup.classList.remove("hidden-popup"); 
} 

window.clearFinancialHistory = function() { 
    triggerHaptic(); deleteActionTarget = "all"; deleteTargetIndex = null; 
    const msg = document.getElementById("delete-popup-msg"); 
    if (msg) msg.innerText = "هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذه الخطوة."; 
    const popup = document.getElementById("delete-confirm-popup"); 
    if (popup) popup.classList.remove("hidden-popup"); 
} 

window.closeDeletePopup = function() { 
    triggerHaptic(); 
    const p = document.getElementById("delete-confirm-popup"); 
    if (p) p.classList.add("hidden-popup"); 
    deleteActionTarget = null; deleteTargetIndex = null; 
} 

window.executeDelete = function() { 
    triggerHaptic(); 
    if (deleteActionTarget === "single" && deleteTargetIndex !== null) { 
        const h = JSON.parse(localStorage.getItem("financial_history_records")) || []; 
        h.splice(deleteTargetIndex, 1); 
        localStorage.setItem("financial_history_records", JSON.stringify(h)); 
        renderFinancialHistory(); showToast("تم حذف السجل"); 
    } else if (deleteActionTarget === "all") { 
        localStorage.removeItem("financial_history_records"); 
        renderFinancialHistory(); showToast("تم المسح بالكامل"); 
    } else if (deleteActionTarget === "leave_fk_room") { 
        if (currentFkRoomId && database) { 
            database.ref('family_khatmas/' + currentFkRoomId).once('value').then(snapshot => { 
                const room = snapshot.val(); 
                if (room && room.creator === fkMyUid) { database.ref('family_khatmas/' + currentFkRoomId).remove(); } 
                else if (room) { database.ref('family_khatmas/' + currentFkRoomId + '/participants/' + fkMyUid).remove(); } 
                currentFkRoomId = null; localStorage.removeItem('fk_current_room'); showToast("تم الخروج من الختمة بنجاح"); switchFkTab('create'); 
            }); 
        } 
    } else if (deleteActionTarget === "single_fk_history" && deleteTargetIndex !== null) { 
        let history = JSON.parse(localStorage.getItem('fk_history')) || []; 
        history.splice(deleteTargetIndex, 1); 
        localStorage.setItem('fk_history', JSON.stringify(history)); 
        loadFkHistory(); showToast("تم مسح السجل بنجاح"); 
    } 
    closeDeletePopup(); 
} 

function triggerVersePopup(text, info) { 
    tempSelectedVerseText = text; tempSelectedVerseInfo = info; 
    const pTxt = document.getElementById("popup-verse-text"); if (pTxt) pTxt.innerText = `﴿ ${text} ﴾`; 
    const pInfo = document.getElementById("popup-verse-info"); if (pInfo) pInfo.innerText = info; 
    const vPopup = document.getElementById("verse-action-popup"); if (vPopup) vPopup.classList.remove("hidden-popup"); 
} 

window.closeVersePopup = function() { 
    triggerHaptic(); const vPopup = document.getElementById("verse-action-popup"); if (vPopup) vPopup.classList.add("hidden-popup"); 
} 

window.copySelectedVerse = function() { 
    triggerHaptic(); navigator.clipboard.writeText(`﴿ ${tempSelectedVerseText} ﴾ [ ${tempSelectedVerseInfo} ]`).then(() => { showToast("تم النسخ"); closeVersePopup(); }); 
} 

function setupNotificationsListener() { 
    const container = document.getElementById("notifications-list"); if (!container || !database) return; 
    database.ref("notifications").on("value", (snapshot) => { 
        container.innerHTML = ""; const data = snapshot.val(); 
        if (!data) { container.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6; font-size: 0.9rem; color: var(--text);">لا توجد إشعارات حالياً</div>`; return; } 
        const messages = []; for (let key in data) { messages.push(data[key]); } 
        messages.reverse().forEach((msg) => { container.innerHTML += `<div style="background: var(--bg); border: 1px solid var(--border); padding: 12px 15px; border-radius: 14px; margin-bottom: 10px;"><div style="font-weight: bold; color: var(--primary); font-size: 0.85rem; margin-bottom: 5px; display: flex; justify-content: space-between;"><span>إدارة التطبيق</span><span style="opacity: 0.7; font-size: 0.75rem;">${ msg.time || "" }</span></div><p style="margin: 0; font-size: 0.95rem; color: var(--text); line-height: 1.5;">${ msg.text }</p></div>`; }); 
    }); 
} 

function setupStoriesListener() { 
    const container = document.getElementById("stories-container"); if (!container || !database) return; 
    database.ref("stories").on("value", (snapshot) => { 
        allStoriesData = []; const data = snapshot.val(); 
        if (data) { for (let key in data) { allStoriesData.push({ id: key, url: data[key].url }); } } 
    }); 
} 

window.renderStories = function (filterType) { 
    triggerHaptic(); const container = document.getElementById("stories-container"); if (!container) return; container.innerHTML = ""; 
    const tabAll = document.getElementById("tab-all-stories"); if (tabAll) tabAll.classList.remove("active"); 
    const tabFav = document.getElementById("tab-fav-stories"); if (tabFav) tabFav.classList.remove("active"); 
    const tabActive = document.getElementById(`tab-${filterType}-stories`); if (tabActive) tabActive.classList.add("active"); 
    
    let favs = JSON.parse(localStorage.getItem("ayat_fav_stories")) || []; let storiesToRender = [...allStoriesData]; 
    if (filterType === "fav") { 
        storiesToRender = storiesToRender.filter((s) => favs.includes(s.url)); 
        if (storiesToRender.length === 0) { container.innerHTML = `<div style="text-align: center; padding: 150px 20px; opacity: 0.7; font-weight: bold; color: white;">لا توجد ستوريات في المفضلة حالياً ❤️</div>`; return; } 
    } 
    let shuffled = [...storiesToRender]; 
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; } 
    
    shuffled.forEach((vid, index) => { 
        const isFav = favs.includes(vid.url); const heartClass = isFav ? "fa-solid text-red" : "fa-regular"; const favActiveClass = isFav ? "active" : ""; const heartStyle = isFav ? 'style="color: #e63946;"' : ""; 
        const srcAttr = index === 0 ? `src="${vid.url}"` : `data-src="${vid.url}"`; const preloadAttr = index === 0 ? "auto" : "none"; const autoPlayAttr = index === 0 ? "autoplay" : ""; 
        container.innerHTML += ` <div class="story-card"> <div class="story-video-container"> <video id="story-vid-${index}" class="story-video" ${srcAttr} loop playsinline webkit-playsinline preload="${preloadAttr}" ${autoPlayAttr}></video> <div id="story-overlay-${index}" class="story-overlay-play" onclick="toggleStoryVideo(${index})"> <i class="fa-solid fa-play"></i> </div> <div class="video-progress-container"> <button id="vid-play-btn-${index}" class="vid-play-pause-btn haptic-btn" onclick="toggleStoryVideo(${index})"> <i class="fa-solid fa-play"></i> </button> <span id="vid-curr-${index}" class="video-time-text">0:00</span> <input type="range" id="vid-seek-${index}" class="video-seekbar-input" value="0" min="0" max="100" step="0.1"> <span id="vid-dur-${index}" class="video-time-text">0:00</span> </div> <div class="story-overlay-ui"> <div class="story-info-text">تلاوة عطرة</div> <div class="story-side-actions"> <button id="fav-btn-${index}" class="story-action-fav ${favActiveClass}" onclick="toggleFavorite(event, '${vid.url}', ${index})"> <i class="${heartClass} fa-heart" ${heartStyle}></i> </button> <button class="story-action-btn haptic-btn" onclick="directDownloadVideo(event, '${vid.url}')"> <i class="fa-solid fa-download"></i> <span>تنزيل</span> </button> </div> </div> </div> </div> `; 
    }); 
    setTimeout(() => { shuffled.forEach((vid, index) => setupVideoControls(index)); setupAutoPlayObserver(); }, 500); 
}; 

window.toggleFavorite = function (event, url, index) { 
    if (event) event.stopPropagation(); triggerHaptic(); 
    try { 
        let favs = JSON.parse(localStorage.getItem("ayat_fav_stories")) || []; const btn = document.getElementById(`fav-btn-${index}`); if (!btn) return; 
        if (favs.includes(url)) { favs = favs.filter((u) => u !== url); btn.classList.remove("active"); btn.innerHTML = `<i class="fa-regular fa-heart"></i>`; showToast("تم الإزالة من المفضلة"); } 
        else { favs.push(url); btn.classList.add("active"); btn.innerHTML = `<i class="fa-solid fa-heart text-red" style="color: #e63946;"></i>`; showToast("تمت الإضافة للمفضلة ❤️"); } 
        localStorage.setItem("ayat_fav_stories", JSON.stringify(favs)); 
    } catch (e) {} 
}; 

function setupVideoControls(index) { 
    const video = document.getElementById(`story-vid-${index}`); const seekbar = document.getElementById(`vid-seek-${index}`); const currTimeText = document.getElementById(`vid-curr-${index}`); const durTimeText = document.getElementById(`vid-dur-${index}`); 
    if (!video || !seekbar) return; 
    video.addEventListener("loadedmetadata", () => { if (durTimeText) durTimeText.innerText = formatTime(video.duration); }); 
    video.addEventListener("timeupdate", () => { if (!seekbar.isDragging) { const progress = (video.currentTime / video.duration) * 100; seekbar.value = progress || 0; if (currTimeText) currTimeText.innerText = formatTime(video.currentTime); } }); 
    seekbar.addEventListener("input", (e) => { seekbar.isDragging = true; const seekTo = (e.target.value / 100) * video.duration; if (currTimeText) currTimeText.innerText = formatTime(seekTo); }); 
    seekbar.addEventListener("change", (e) => { seekbar.isDragging = false; video.currentTime = (e.target.value / 100) * video.duration; }); 
} 

window.toggleStoryVideo = function (index) { 
    triggerHaptic(); const video = document.getElementById(`story-vid-${index}`); const overlay = document.getElementById(`story-overlay-${index}`); const miniPlayBtn = document.getElementById(`vid-play-btn-${index}`); if (!video) return; 
    if (video.paused) { 
        document.querySelectorAll(".story-video").forEach((vid) => { if (vid !== video) { vid.pause(); const ov = document.getElementById(vid.id.replace("vid", "overlay")); if (ov) ov.classList.remove("playing"); const mb = document.getElementById(vid.id.replace("story-vid-", "vid-play-btn-")); if (mb) mb.innerHTML = '<i class="fa-solid fa-play"></i>'; } }); 
        video.play().catch((e) => console.log("Play blocked")); if (overlay) overlay.classList.add("playing"); if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; currentPlayingVideo = video; 
    } else { 
        video.pause(); if (overlay) overlay.classList.remove("playing"); if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; currentPlayingVideo = null; 
    } 
}; 

function setupAutoPlayObserver() { 
    const videos = document.querySelectorAll(".story-video"); 
    if ("IntersectionObserver" in window) { 
        const observer = new IntersectionObserver((entries) => { 
            entries.forEach((entry) => { 
                const vid = entry.target; const overlay = document.getElementById(vid.id.replace("story-vid", "story-overlay")); const miniPlayBtn = document.getElementById(vid.id.replace("story-vid-", "vid-play-btn-")); 
                if (entry.isIntersecting) { 
                    if (!vid.getAttribute("src") && vid.getAttribute("data-src")) { vid.setAttribute("src", vid.getAttribute("data-src")); vid.load(); } 
                    vid.play().then(() => { if (overlay) overlay.classList.add("playing"); if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; currentPlayingVideo = vid; const currentIdNum = parseInt(vid.id.replace("story-vid-", "")); const nextVid = document.getElementById(`story-vid-${currentIdNum + 1}`); if (nextVid && !nextVid.getAttribute("src") && nextVid.getAttribute("data-src")) { nextVid.setAttribute("src", nextVid.getAttribute("data-src")); nextVid.setAttribute("preload", "metadata"); } }).catch((e) => { vid.pause(); if (overlay) overlay.classList.remove("playing"); if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; }); 
                } else { 
                    vid.pause(); vid.currentTime = 0; if (overlay) overlay.classList.remove("playing"); if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; if (vid.getAttribute("src")) { vid.removeAttribute("src"); vid.load(); } 
                } 
            }); 
        }, { threshold: 0.5 }); 
        videos.forEach((vid) => observer.observe(vid)); 
    } 
} 

window.directDownloadVideo = async function (event, url) { 
  if (event) event.stopPropagation(); triggerHaptic(); 
  const overlay = document.getElementById("download-progress-overlay"); const textEl = document.getElementById("download-text"); const barEl = document.getElementById("download-bar-fill"); 
  if (overlay) overlay.classList.remove("hidden-popup"); if (textEl) textEl.innerText = "بدأ التحميل... 0%"; if (barEl) barEl.style.width = "0%"; 
  if (typeof window.AndroidBridge !== "undefined" && typeof window.AndroidBridge.downloadVideo === "function") { window.AndroidBridge.downloadVideo(url); return; } 
  downloadAbortController = new AbortController(); const signal = downloadAbortController.signal; 
  try { 
      const response = await fetch(url, { signal }); const contentLength = response.headers.get("content-length"); const total = parseInt(contentLength, 10); let loaded = 0; const reader = response.body.getReader(); const chunks = []; 
      while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); loaded += value.length; if (total && window.updateDownloadProgress) { window.updateDownloadProgress(Math.round((loaded / total) * 100)); } } 
      const blobUrl = window.URL.createObjectURL(new Blob(chunks, { type: "video/mp4" })); const a = document.createElement("a"); a.style.display = "none"; a.href = blobUrl; a.download = "ستوريات_تطبيق_آيات_" + new Date().getTime() + ".mp4"; document.body.appendChild(a); a.click(); setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(blobUrl); }, 100); 
  } catch (error) { 
      if (error.name === "AbortError") { console.log("Download cancelled"); } else { if (overlay) overlay.classList.add("hidden-popup"); window.open(url, "_blank"); } 
  } 
}; 

window.cancelDownload = function () { 
  triggerHaptic(); 
  if (typeof window.AndroidBridge !== "undefined" && typeof window.AndroidBridge.cancelDownloadVideo === "function") { window.AndroidBridge.cancelDownloadVideo(); } else if (downloadAbortController) { downloadAbortController.abort(); } 
  const overlay = document.getElementById("download-progress-overlay"); if (overlay) overlay.classList.add("hidden-popup"); const barEl = document.getElementById("download-bar-fill"); if (barEl) barEl.style.width = "0%"; showToast("تم إيقاف التنزيل"); 
}; 

window.updateDownloadProgress = function (percent) { 
  const overlay = document.getElementById("download-progress-overlay"); const textEl = document.getElementById("download-text"); const barEl = document.getElementById("download-bar-fill"); 
  if (overlay && overlay.classList.contains("hidden-popup")) overlay.classList.remove("hidden-popup"); 
  if (textEl) textEl.innerText = `جاري التحميل... ${percent}%`; if (barEl) barEl.style.width = `${percent}%`; 
  if (percent >= 100) { if (textEl) textEl.innerText = "تم الحفظ بنجاح! ✅"; setTimeout(() => { if (overlay) overlay.classList.add("hidden-popup"); }, 2500); } 
}; 

// ==========================================
// 🌟 14. الختمة العائلية (الفايربيس)
// ==========================================
let fkMyUid = localStorage.getItem("fk_my_uid"); 
if (!fkMyUid) { fkMyUid = "user_" + Math.random().toString(36).substr(2, 9); localStorage.setItem("fk_my_uid", fkMyUid); } 
let currentFkRoomId = localStorage.getItem("fk_current_room") || null; 
let fkRoomListener = null; 

const quranSurahsNamesList = [ "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس" ]; 
const quranAjzaNamesList = [ "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر", "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون", "الحادي والعشرين", "الثاني والعشرين", "الثالث والعشرين", "الرابع والعشرين", "الخامس والعشرين", "السادس والعشرين", "السابع والعشرين", "الثامن والعشرين", "التاسع والعشرين", "الثلاثون" ]; 

function getPortionTrueName(type, id) { if (type === "ajza") return `الجزء ${quranAjzaNamesList[id - 1]}`; return `سورة ${quranSurahsNamesList[id - 1]}`; } 

window.switchFkTab = function(tabName) { 
    triggerHaptic(); 
    if ((tabName === "create" || tabName === "join") && currentFkRoomId) { showToast("أنت منضم لختمة حالياً! لا يمكنك إنشاء أو الانضمام لأخرى."); tabName = "current"; } 
    document.querySelectorAll("#family-khatma-section .tab-btn").forEach((b) => b.classList.remove("active")); 
    document.getElementById(`fktab-${tabName}`).classList.add("active"); 
    document.querySelectorAll(".fk-view-panel").forEach((p) => p.classList.add("hidden")); 
    document.getElementById(`fk-view-${tabName}`).classList.remove("hidden"); 
    if (tabName === "current") checkCurrentRoom(); 
    if (tabName === "history") loadFkHistory(); 
} 

window.switchFkActiveTab = function(tabName) { 
    triggerHaptic(); 
    document.getElementById("fk-subtab-mine").classList.remove("active"); 
    document.getElementById("fk-subtab-all").classList.remove("active"); 
    document.getElementById(`fk-subtab-${tabName}`).classList.add("active"); 
    if (tabName === "mine") { 
        document.getElementById("fk-view-mine").classList.remove("hidden"); document.getElementById("fk-view-all").classList.add("hidden"); 
    } else { 
        document.getElementById("fk-view-mine").classList.add("hidden"); document.getElementById("fk-view-all").classList.remove("hidden"); 
    } 
} 

function generateFkRoomCode() { return Math.floor(100000 + Math.random() * 900000).toString(); } 

window.createFamilyRoom = function() { 
    triggerHaptic(); if (currentFkRoomId) return showToast("أنت في غرفة حالياً!"); 
    const name = document.getElementById("fk-create-name").value.trim(); 
    const khatmaName = document.getElementById("fk-create-khatma-name").value.trim(); 
    const type = document.getElementById("fk-create-type").value; 
    if (!name) return showToast("يرجى إدخال اسمك"); if (!database) return showToast("لا يوجد اتصال بالسيرفر"); 
    const roomId = generateFkRoomCode(); const finalKhatmaName = khatmaName || "ختمة عائلية مشتركة"; 
    const roomData = { code: roomId, creator: fkMyUid, khatmaName: finalKhatmaName, type: type, status: "waiting", participants: {} }; roomData.participants[fkMyUid] = { name: name }; 
    database.ref("family_khatmas/" + roomId).set(roomData).then(() => { localStorage.setItem("fk_my_name", name); localStorage.setItem("fk_current_room", roomId); currentFkRoomId = roomId; showToast("تم إنشاء الغرفة بنجاح!"); switchFkTab("current"); }).catch((e) => { showToast("حدث خطأ في الاتصال، حاول مجدداً"); }); 
} 

window.joinFamilyRoom = function() { 
    triggerHaptic(); if (currentFkRoomId) return showToast("أنت في غرفة حالياً!"); 
    const name = document.getElementById("fk-join-name").value.trim(); 
    const code = document.getElementById("fk-join-code").value.trim(); 
    if (!name || !code) return showToast("يرجى إدخال الاسم وكود الغرفة"); if (!database) return; 
    database.ref("family_khatmas/" + code).once("value").then((snapshot) => { 
        if (!snapshot.exists()) return showToast("كود الغرفة غير صحيح!"); const room = snapshot.val(); if (room.status !== "waiting") return showToast("عذراً، الختمة بدأت بالفعل وتم توزيعها!"); 
        database.ref("family_khatmas/" + code + "/participants/" + fkMyUid).set({ name: name }).then(() => { localStorage.setItem("fk_my_name", name); localStorage.setItem("fk_current_room", code); currentFkRoomId = code; showToast("تم الانضمام بنجاح!"); switchFkTab("current"); }); 
    }); 
} 

function checkCurrentRoom() { 
    if (!currentFkRoomId) { document.getElementById("fk-no-room-msg").classList.remove("hidden"); document.getElementById("fk-active-room-container").classList.add("hidden"); return; } 
    document.getElementById("fk-no-room-msg").classList.add("hidden"); document.getElementById("fk-active-room-container").classList.remove("hidden"); document.getElementById("fk-room-code-display").innerText = currentFkRoomId; 
    if (fkRoomListener) database.ref("family_khatmas/" + currentFkRoomId).off("value", fkRoomListener); 
    fkRoomListener = database.ref("family_khatmas/" + currentFkRoomId).on("value", (snapshot) => { 
        const room = snapshot.val(); if (!room) { currentFkRoomId = null; localStorage.removeItem("fk_current_room"); checkCurrentRoom(); return; } 
        const kNameDisplay = document.getElementById("fk-khatma-name-display"); if (kNameDisplay) kNameDisplay.innerText = room.khatmaName || "ختمة عائلية"; 
        if (room.status === "finished") { saveToFkHistory(room); currentFkRoomId = null; localStorage.removeItem("fk_current_room"); showToast("🎉 مبارك! تمت الختمة العائلية بنجاح وتقبل الله أعمالكم."); setTimeout(() => switchFkTab("history"), 2000); return; } 
        const statusBadge = document.getElementById("fk-room-status-badge"); const distBtn = document.getElementById("fk-start-distribution-btn"); const distContainer = document.getElementById("fk-distribution-container"); const instructionNote = document.getElementById("fk-instruction-note"); const waitingContainer = document.getElementById("fk-waiting-container"); 
        if (room.status === "waiting") { statusBadge.innerText = "قيد الإنشاء (بانتظار اكتمال العدد)"; statusBadge.style.background = "var(--accent)"; instructionNote.classList.add("hidden"); distContainer.classList.add("hidden"); waitingContainer.classList.remove("hidden"); if (room.creator === fkMyUid) distBtn.classList.remove("hidden"); else distBtn.classList.add("hidden"); } 
        else if (room.status === "active") { statusBadge.innerText = "الختمة جارية الآن"; statusBadge.style.background = "#2ecc71"; distBtn.classList.add("hidden"); waitingContainer.classList.add("hidden"); instructionNote.classList.remove("hidden"); distContainer.classList.remove("hidden"); renderPortionsGrid(room); } 
        const pList = document.getElementById("fk-participants-list"); pList.innerHTML = ""; if (room.participants) { Object.values(room.participants).forEach((p) => { pList.innerHTML += `<div class="participant-badge"><i class="fa-solid fa-user"></i> ${p.name}</div>`; }); } 
    }); 
} 

window.promptLeaveFkRoom = function() { triggerHaptic(); deleteActionTarget = "leave_fk_room"; document.getElementById("delete-popup-msg").innerText = "هل أنت متأكد من الخروج من الختمة الحالية؟"; document.getElementById("delete-confirm-popup").classList.remove("hidden-popup"); } 
window.shareRoomCode = function() { triggerHaptic(); if (currentFkRoomId) { const text = `انضم إلينا في الختمة العائلية على تطبيق آيات!\nكود الغرفة هو: ${currentFkRoomId}`; if (typeof window.AndroidBridge !== "undefined" && typeof window.AndroidBridge.shareApp === "function") { window.AndroidBridge.shareApp(text); } else if (navigator.share) { navigator.share({ title: "الختمة العائلية", text: text }).catch((e) => {}); } else { navigator.clipboard.writeText(currentFkRoomId).then(() => { showToast("تم نسخ كود الغرفة للمشاركة"); }); } } } 
window.startFamilyDistribution = function() { triggerHaptic(); if (!database || !currentFkRoomId) return; database.ref("family_khatmas/" + currentFkRoomId).once("value").then((snapshot) => { const room = snapshot.val(); const pKeys = Object.keys(room.participants); if (pKeys.length < 1) return showToast("لا يوجد مشاركون!"); const totalItems = room.type === "ajza" ? 30 : 114; let portions = {}; let pIndex = 0; for (let i = 1; i <= totalItems; i++) { let uid = pKeys[pIndex]; portions[i] = { id: i, assignedToUid: uid, assignedToName: room.participants[uid].name, status: "pending" }; pIndex++; if (pIndex >= pKeys.length) pIndex = 0; } database.ref("family_khatmas/" + currentFkRoomId).update({ status: "active", portions: portions }).then(() => showToast("تم التوزيع.. بسم الله نبدأ!")); }); } 

function renderPortionsGrid(room) { 
    const gridMine = document.getElementById("fk-portions-grid-mine"); const listAll = document.getElementById("fk-participants-progress-list"); gridMine.innerHTML = ""; listAll.innerHTML = ""; const totalItems = room.type === "ajza" ? 30 : 114; let allCompleted = true; let myPortionsCount = 0; let userStats = {}; 
    Object.keys(room.participants).forEach((uid) => { userStats[uid] = { name: room.participants[uid].name, total: 0, completed: 0, portions: [] }; }); 
    for (let i = 1; i <= totalItems; i++) { 
        if (!room.portions || !room.portions[i]) { allCompleted = false; continue; } 
        const portion = room.portions[i]; if (portion.status !== "completed") allCompleted = false; let portionTrueName = getPortionTrueName(room.type, i); 
        if (userStats[portion.assignedToUid]) { userStats[portion.assignedToUid].total++; if (portion.status === "completed") userStats[portion.assignedToUid].completed++; userStats[portion.assignedToUid].portions.push({ name: portionTrueName, status: portion.status }); } 
        if (portion.assignedToUid === fkMyUid) { myPortionsCount++; let cardClass = portion.status === "completed" ? "portion-completed" : "portion-mine haptic-btn"; let badgeClass = portion.status === "completed" ? "completed-badge" : "mine-badge"; let badgeText = portion.status === "completed" ? "تمت القراءة <i class='fa-solid fa-check'></i>" : "لم يُقرأ"; let clickAction = portion.status === "completed" ? "" : `onclick="markPortionDone(${i})"`; gridMine.innerHTML += ` <div class="portion-card ${cardClass}" ${clickAction}> <div class="portion-title" style="font-size:1.1rem; font-family:'Amiri';">${portionTrueName}</div> <div class="portion-status-badge ${badgeClass}">${badgeText}</div> </div> `; } 
    } 
    if (myPortionsCount === 0) { gridMine.innerHTML = `<div style="text-align:center; grid-column:1/-1; opacity:0.7; padding: 20px;">لا توجد حصص مخصصة لك في هذا التوزيع.</div>`; } 
    Object.values(userStats).forEach((stat) => { let p = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0; let chipsHtml = ""; stat.portions.forEach((portion) => { let chipClass = portion.status === "completed" ? "pp-chip done" : "pp-chip"; let icon = portion.status === "completed" ? '<i class="fa-solid fa-check-double"></i> ' : '<i class="fa-solid fa-book-open"></i> '; chipsHtml += `<div class="${chipClass}">${icon}${portion.name}</div>`; }); if (stat.total > 0) { listAll.innerHTML += ` <div class="participant-progress-card"> <div class="pp-header"> <div class="pp-name"><i class="fa-solid fa-user-pen"></i> ${stat.name}</div> <div class="pp-stats">أكمل ${stat.completed} من ${stat.total}</div> </div> <div class="progress-bar-container" style="height: 8px; margin-bottom: 15px; background: rgba(0,0,0,0.05);"> <div class="progress-bar-fill" style="width:${p}%; border-radius: 10px;"></div> </div> <div style="font-size: 0.85rem; font-weight: bold; color: var(--text); opacity: 0.8; margin-bottom: 12px;"> الحصص المخصصة: </div> <div class="pp-portions-container"> ${chipsHtml} </div> </div> `; } }); 
    if (allCompleted) { database.ref("family_khatmas/" + currentFkRoomId).update({ status: "finished" }); } 
} 

window.markPortionDone = function(portionId) { triggerHaptic(); if (!database || !currentFkRoomId) return; database.ref(`family_khatmas/${currentFkRoomId}/portions/${portionId}`).update({ status: "completed" }).then(() => showToast("تقبل الله طاعتك!")); } 
function saveToFkHistory(room) { let history = JSON.parse(localStorage.getItem("fk_history")) || []; const date = new Date().toLocaleDateString("ar-SA"); const typeName = room.khatmaName || (room.type === "ajza" ? "ختمة أجزاء" : "ختمة سور"); history.push({ date: date, type: typeName, participantsCount: Object.keys(room.participants).length }); localStorage.setItem("fk_history", JSON.stringify(history)); } 
function loadFkHistory() { const list = document.getElementById("fk-history-list"); list.innerHTML = ""; let history = JSON.parse(localStorage.getItem("fk_history")) || []; if (history.length === 0) { list.innerHTML = `<div style="text-align:center; padding:30px 20px; opacity:0.7;">لا توجد ختمات مكتملة حتى الآن.</div>`; return; } history.slice().reverse().forEach((h, reverseIndex) => { const actualIndex = history.length - 1 - reverseIndex; list.innerHTML += ` <div style="background:var(--bg); border:1px solid var(--border); padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;"> <div> <h4 style="color:var(--primary); margin-bottom:5px; font-size:1.05rem;">${h.type} <i class="fa-solid fa-check-circle" style="color:#2ecc71;"></i></h4> <span style="font-size:0.85rem; opacity:0.8;">عدد المشاركين: ${h.participantsCount}</span> </div> <div style="display:flex; align-items:center; gap: 15px;"> <div style="font-weight:bold; font-size:0.85rem; color:var(--text); opacity:0.7;">${h.date}</div> <button onclick="deleteFkHistoryRecord(${actualIndex})" class="haptic-btn" style="background:transparent; border:none; color:#e63946; font-size:1.3rem; cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button> </div> </div> `; }); } 
window.deleteFkHistoryRecord = function(index) { triggerHaptic(); deleteActionTarget = "single_fk_history"; deleteTargetIndex = index; const msg = document.getElementById("delete-popup-msg"); if (msg) msg.innerText = "هل تؤكد مسح الختمة المكتملة من السجل بالفعل؟"; const popup = document.getElementById("delete-confirm-popup"); if (popup) popup.classList.remove("hidden-popup"); } 

// ==========================================
// 🌟 تحميل مبدئي للبيانات
// ==========================================
window.addEventListener("DOMContentLoaded", () => { 
  try { loadPreferences(); } catch (e) {} 
  try { calculateHijriDate(); } catch (e) {} 
  try { loadSurahs(); } catch (e) {} 
  try { setupNotificationsListener(); } catch (e) {} 
  try { setupStoriesListener(); } catch (e) {} 
  try { checkForUpdates(); } catch (e) {} 
  try { fetchPrayerTimes(); initPrayerSettings(); } catch (e) {} 
  try { if (currentFkRoomId) checkCurrentRoom(); } catch (e) {} 
});
