/**
 * CV Loader - تحميل وت إدارة السير الذاتية
 * يدعم تحميل PDF/DOCX/كلاهما
 */

let cvsData = null;
let currentCVLang = 'en';

/**
 * تحميل بيانات الـ CVs
 */
async function loadCVsData() {
  try {
    const response = await fetch('data/cvs.json');
    if (!response.ok) throw new Error('Failed to load cvs.json');
    const data = await response.json();
    cvsData = data;
    return data;
  } catch (error) {
    console.error('Error loading CVs:', error);
    return null;
  }
}

/**
 * الحصول على جميع الـ CVs
 */
function getAllCVs() {
  if (!cvsData) return [];
  return cvsData.cvs || [];
}

/**
 * الحصول على CV معين
 */
function getCVById(id) {
  const cvs = getAllCVs();
  return cvs.find(cv => cv.id === id);
}

/**
 * الحصول على النصوص بلغة محددة
 */
function getCVLocalizedText(cv, lang = null) {
  const language = lang || currentCVLang;
  return {
    title: language === 'ar' ? (cv.titleAr || cv.title) : cv.title,
    specialization: language === 'ar' ? (cv.specializationAr || cv.specialization) : cv.specialization,
    description: language === 'ar' ? (cv.descriptionAr || cv.description) : cv.description,
    downloadBtn: language === 'ar' ? 'تحميل' : 'Download',
    selectFormat: language === 'ar' ? 'اختر الصيغة' : 'Select Format',
    pdf: language === 'ar' ? 'ملف PDF' : 'PDF File',
    docx: language === 'ar' ? 'ملف Word' : 'Word File',
    both: language === 'ar' ? 'تحميل كلاهما' : 'Download Both',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    downloadTitle: language === 'ar' ? 'تحميل السيرة الذاتية' : 'Download Resume',
    downloadMessage: language === 'ar' ? 'اختر صيغة الملف الذي تريد تحميله:' : 'Choose the file format you want to download:'
  };
}

/**
 * إنشاء عنصر CV DOM
 */
function createCVElement(cv) {
  const text = getCVLocalizedText(cv, currentCVLang);
  const hasPDF = cv.files && cv.files.pdf;
  const hasDOCX = cv.files && cv.files.docx;

  let downloadButtons = '';
  if (hasPDF) {
    downloadButtons += `
      <a href="${cv.files.pdf}" download class="btn btn-outline-primary btn-sm flex-grow-1" onclick="trackCVDownload('${cv.id}', 'pdf')">
        <i class="bi bi-file-earmark-pdf me-1"></i>PDF
      </a>
    `;
  }
  if (hasDOCX) {
    downloadButtons += `
      <a href="${cv.files.docx}" download class="btn btn-outline-primary btn-sm flex-grow-1" onclick="trackCVDownload('${cv.id}', 'docx')">
        <i class="bi bi-file-earmark-word me-1"></i>Word
      </a>
    `;
  }

  return `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
      <div class="cv-card d-flex flex-column h-100 p-4 glass-card rounded-4 shadow-sm">
        <div class="cv-icon-wrapper mb-3 text-center">
          <div class="cv-icon bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 64px; height: 64px;">
            <i class="bi bi-file-earmark-text fs-2 text-primary"></i>
          </div>
        </div>
        <div class="cv-content flex-grow-1 text-center">
          <h5 class="cv-title fw-bold mb-1">${text.title}</h5>
          <span class="cv-specialization text-muted small d-block mb-3">${text.specialization}</span>
          <p class="cv-description small mb-4">${text.description}</p>
        </div>
        <div class="cv-actions mt-auto">
          <div class="d-flex gap-2">
            ${downloadButtons}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * عرض الـ CVs في عنصر DOM
 */
function renderCVs(container) {
  if (!container) return;

  const cvs = getAllCVs();
  container.innerHTML = '';

  cvs.forEach((cv, index) => {
    container.innerHTML += createCVElement(cv);
  });

  console.log(`✅ Displayed ${cvs.length} CVs in ${container.id}`);
}

/**
 * إنشاء وعرض Modal لتحميل الـ CV
 */
function showCVDownloadModal(cvId) {
  // ... existing code ...
}

/**
 * تتبع تحميل الـ CV (إحصائيات)
 */
function trackCVDownload(cvId, format) {
  console.log(`📥 CV Downloaded: ${cvId}, Format: ${format}`);
}

/**
 * حفظ اللغة
 */
function setCVLanguage(lang) {
  currentCVLang = lang;
  localStorage.setItem('portfolio_language', lang);
}

/**
 * استعادة اللغة المحفوظة
 */
function loadSavedCVLanguage() {
  const saved = localStorage.getItem('portfolio_language');
  if (saved) {
    currentCVLang = saved;
  }
  return currentCVLang;
}

/**
 * تهيئة نظام الـ CVs
 */
async function initCVLoader() {
  loadSavedCVLanguage();
  await loadCVsData();
  console.log('✅ CV Loader initialized');
  
  const cvs = getAllCVs();
  
  // Render in Homepage Direct Container
  const directContainer = document.getElementById('cv-direct-container');
  if (directContainer) {
    renderCVs(directContainer);
  }

  // Render in Modal Container (if still used somewhere)
  const modalContainer = document.getElementById('cv-modal-container');
  if (modalContainer) {
    renderCVs(modalContainer);
  }
}

/**
 * تصدير للدوال للاستخدام العام
 */
window.CVLoader = {
  loadCVsData,
  getAllCVs,
  getCVById,
  getCVLocalizedText,
  createCVElement,
  renderCVs,
  showCVDownloadModal,
  trackCVDownload,
  setCVLanguage,
  loadSavedCVLanguage,
  initCVLoader,
  get currentCVLang() { return currentCVLang; },
  set currentCVLang(val) { currentCVLang = val; }
};