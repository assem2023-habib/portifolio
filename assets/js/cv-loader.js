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

  return `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
      <div class="cv-card d-flex flex-column h-100">
        <div class="cv-icon-wrapper">
          <div class="cv-icon">
            <i class="bi bi-file-earmark-text"></i>
          </div>
        </div>
        <div class="cv-content flex-grow-1">
          <h5 class="cv-title">${text.title}</h5>
          <span class="cv-specialization">${text.specialization}</span>
          <p class="cv-description">${text.description}</p>
        </div>
        <div class="cv-actions">
          <button class="btn btn-download w-100" onclick="showCVDownloadModal('${cv.id}')">
            <i class="bi bi-download me-2"></i>${text.downloadBtn}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * عرض الـ CVs في عنصر DOM
 */
function renderCVs(container) {
  if (!container) {
    console.error('Container not found');
    return;
  }

  const cvs = getAllCVs();
  container.innerHTML = '';

  cvs.forEach((cv, index) => {
    container.innerHTML += createCVElement(cv);
  });

  console.log(`✅ Displayed ${cvs.length} CVs`);
}

/**
 * إنشاء وعرض Modal لتحميل الـ CV
 */
function showCVDownloadModal(cvId) {
  console.log(`🔽 CV download requested for: ${cvId}`);
  const cv = getCVById(cvId);
  if (!cv) {
    console.error(`❌ CV not found: ${cvId}`);
    return;
  }

  const text = getCVLocalizedText(cv, currentCVLang);
  const hasPDF = cv.files && cv.files.pdf;
  const hasDOCX = cv.files && cv.files.docx;

  let modalContent = `
    <div class="modal fade" id="cvDownloadModal" tabindex="-1" aria-labelledby="cvDownloadModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cvDownloadModalLabel">${text.downloadTitle}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3 fw-medium">${text.downloadMessage}</p>
            <div class="d-flex flex-column gap-3">
  `;

  if (hasPDF) {
    modalContent += `
      <a href="${cv.files.pdf}" download class="btn btn-download-option btn-outline-primary" onclick="trackCVDownload('${cvId}', 'pdf')">
        <i class="bi bi-file-earmark-pdf me-2 fs-5"></i>${text.pdf}
      </a>
    `;
  }

  if (hasDOCX) {
    modalContent += `
      <a href="${cv.files.docx}" download class="btn btn-download-option btn-outline-primary" onclick="trackCVDownload('${cvId}', 'docx')">
        <i class="bi bi-file-earmark-word me-2 fs-5"></i>${text.docx}
      </a>
    `;
  }

  if (hasPDF && hasDOCX) {
    modalContent += `
      <hr class="border-secondary opacity-25">
      <a href="${cv.files.pdf}" download class="btn btn-download-option btn-success" onclick="trackCVDownload('${cvId}', 'both')">
        <i class="bi bi-download me-2 fs-5"></i>${text.both}
      </a>
    `;
  }

  modalContent += `
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">${text.cancel}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const existingModal = document.getElementById('cvDownloadModal');
  if (existingModal) {
    existingModal.remove();
  }

  document.body.insertAdjacentHTML('beforeend', modalContent);

  const modal = new bootstrap.Modal(document.getElementById('cvDownloadModal'));
  modal.show();
  console.log(`📋 CV download modal shown for: ${cvId}`);
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
  console.log('📄 CVs loaded:', getAllCVs().length);

  // Render CVs in modal container
  const modalContainer = document.getElementById('cv-modal-container');
  if (modalContainer) {
    const cvs = getAllCVs();
    modalContainer.innerHTML = '';
    cvs.forEach((cv, index) => {
      modalContainer.innerHTML += createCVElement(cv);
      console.log(`🔄 CV item ${index + 1} displayed: ${cv.title}`);
    });
    console.log(`✅ Displayed ${cvs.length} CVs in modal`);
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