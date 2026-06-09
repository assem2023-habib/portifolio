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

// ── CV Carousel State ──
let cvCarouselState = {
  currentIndex: 0,
  isPlaying: true,
  autoTimer: null,
  isDragging: false,
  dragStartX: 0,
  dragDelta: 0,
  tiltAngle: 0,
  tiltTarget: 0,
  tiltRaf: null,
  TILT_MAX: 14,
  TILT_EASE: 0.10
};

/**
 * إنشاء عنصر CV DOM للـ Carousel
 */
function createCVCarouselElement(cv, i) {
  const text = getCVLocalizedText(cv, currentCVLang);
  const template = document.getElementById('cv-card-template');
  if (!template) return '';
  
  const cardClone = template.querySelector('.cv-carousel-card').cloneNode(true);
  const hasPDF = cv.files && cv.files.pdf;
  const hasDOCX = cv.files && cv.files.docx;

  // Populate Card
  cardClone.querySelector('.card-number').textContent = (i + 1).toString().padStart(2, '0');
  cardClone.querySelector('.cv-title').textContent = text.title;
  cardClone.querySelector('.cv-specialization').textContent = text.specialization;
  cardClone.querySelector('.cv-description').textContent = text.description;
  
    const btnsContainer = cardClone.querySelector('#cv-download-btns');
    if (btnsContainer) {
      btnsContainer.innerHTML = '';
      if (hasPDF) {
        btnsContainer.innerHTML += `
          <a href="${cv.files.pdf}" download class="cv-download-btn" onclick="CVLoader.trackCVDownload('${cv.id}', 'pdf')">
            <i class="bi bi-file-earmark-pdf"></i>PDF
          </a>
        `;
      }
      if (hasDOCX) {
        btnsContainer.innerHTML += `
          <a href="${cv.files.docx}" download class="cv-download-btn" onclick="CVLoader.trackCVDownload('${cv.id}', 'docx')">
            <i class="bi bi-file-earmark-word"></i>Word
          </a>
        `;
      }
    }

    // View details link
    const detailsLink = cardClone.querySelector('#cv-details-link');
    if (detailsLink) {
      detailsLink.href = 'cv-details.html?id=' + cv.id;
      const lang = currentCVLang || localStorage.getItem('portfolio_language') || 'en';
      const textSpan = detailsLink.querySelector('.cv-details-text');
      if (textSpan) {
        textSpan.textContent = lang === 'ar' ? 'عرض التفاصيل' : 'View Details';
      }
    }

  // Back side
  cardClone.querySelector('.back-title').textContent = text.title;
  cardClone.querySelector('.back-num').textContent = (i + 1).toString().padStart(2, '0');

  cardClone.addEventListener('click', () => {
    if (Math.abs(cvCarouselState.dragDelta) < 1) {
      goToCV(i);
    }
  });

  return cardClone;
}

/**
 * عرض الـ CVs في عنصر DOM (Carousel)
 */
function renderCVsCarousel(container) {
  if (!container) return;

  const cvs = getAllCVs();
  container.innerHTML = '';

  cvs.forEach((cv, i) => {
    const el = createCVCarouselElement(cv, i);
    if (el) container.appendChild(el);
  });

  setupCVCarouselControls();
  positionCVCards();
  if (cvCarouselState.isPlaying) startCVAuto();
}

function getCVCarouselRadius() {
  return window.innerWidth <= 768 ? 260 : 420;
}

function positionCVCards() {
  const ring = document.getElementById('cv-ring');
  const dotsEl = document.getElementById('cv-dots');
  if (!ring) return;

  const cards = ring.querySelectorAll('.cv-carousel-card');
  const N = cards.length;
  if (N === 0) return;
  
  const angleStep = 360 / N;
  const r = getCVCarouselRadius();

  const activeTilt = cvCarouselState.isDragging
    ? -cvCarouselState.dragDelta * 0.45
    : cvCarouselState.tiltAngle;

  cards.forEach((card, i) => {
    const relAngle = ((i - cvCarouselState.currentIndex) * angleStep + cvCarouselState.dragDelta) % 360;
    const rad      = relAngle * Math.PI / 180;
    const x        = Math.sin(rad) * r;
    const z        = Math.cos(rad) * r;
    const scale    = (z + r) / (r * 2);
    const opacity  = 0.3 + scale * 0.7;
    const isActive = i === cvCarouselState.currentIndex && cvCarouselState.dragDelta === 0;

    const cardTilt = activeTilt * (0.5 + scale * 0.5);

    let normAngle = relAngle % 360;
    if (normAngle > 180)  normAngle -= 360;
    if (normAngle < -180) normAngle += 360;
    const rotY  = -normAngle;

    const skewVal = activeTilt * 0.38;

    card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) rotateZ(${cardTilt}deg) skewX(${skewVal}deg)`;
    card.style.zIndex     = Math.round(scale * 100);
    card.style.opacity    = opacity;
    card.style.filter     = isActive ? 'none' : `blur(${(1 - scale) * 2}px)`;
    card.classList.toggle('active', isActive);
  });

  if (dotsEl) {
    dotsEl.innerHTML = '';
    for(let i=0; i<N; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === cvCarouselState.currentIndex ? 'active' : ''}`;
      dot.onclick = () => goToCV(i);
      dotsEl.appendChild(dot);
    }
  }
}

function animateCVTilt() {
  cvCarouselState.tiltAngle += (cvCarouselState.tiltTarget - cvCarouselState.tiltAngle) * cvCarouselState.TILT_EASE;
  positionCVCards();
  
  if (Math.abs(cvCarouselState.tiltAngle - cvCarouselState.tiltTarget) > 0.05) {
    cvCarouselState.tiltRaf = requestAnimationFrame(animateCVTilt);
  } else {
    cvCarouselState.tiltAngle = cvCarouselState.tiltTarget;
    positionCVCards();
    cvCarouselState.tiltRaf = null;
  }
}

function triggerCVTilt(dir) {
  cvCarouselState.tiltTarget = dir * cvCarouselState.TILT_MAX;
  if (cvCarouselState.tiltRaf) cancelAnimationFrame(cvCarouselState.tiltRaf);
  cvCarouselState.tiltRaf = requestAnimationFrame(animateCVTilt);
  setTimeout(() => { cvCarouselState.tiltTarget = 0; }, 180);
}

function goToCV(index, dir) {
  const cards = document.querySelectorAll('.cv-carousel-card');
  const N = cards.length;
  if (N === 0) return;
  
  cvCarouselState.currentIndex = ((index % N) + N) % N;
  cvCarouselState.dragDelta = 0;
  if (dir !== undefined) triggerCVTilt(dir);
  positionCVCards();
}

function nextCV() { goToCV(cvCarouselState.currentIndex + 1, -1); }
function prevCV() { goToCV(cvCarouselState.currentIndex - 1, +1); }

function startCVAuto() {
  stopCVAuto();
  cvCarouselState.autoTimer = setInterval(nextCV, 3000);
}

function stopCVAuto() {
  if (cvCarouselState.autoTimer) clearInterval(cvCarouselState.autoTimer);
}

function setupCVCarouselControls() {
  const nextBtn = document.getElementById('nextCVBtn');
  const prevBtn = document.getElementById('prevCVBtn');
  const playBtn = document.getElementById('playCVBtn');
  const ring = document.getElementById('cv-ring');

  if (nextBtn) nextBtn.onclick = nextCV;
  if (prevBtn) prevBtn.onclick = prevCV;
  
  if (playBtn) {
    playBtn.onclick = () => {
      cvCarouselState.isPlaying = !cvCarouselState.isPlaying;
      const icon = playBtn.querySelector('i');
      if (cvCarouselState.isPlaying) {
        if (icon) icon.className = 'bi bi-pause-fill';
        startCVAuto();
      } else {
        if (icon) icon.className = 'bi bi-play-fill';
        stopCVAuto();
      }
    };
  }

  if (ring) {
    ring.onmousedown = e => {
      cvCarouselState.isDragging = true;
      cvCarouselState.dragStartX = e.clientX;
      cvCarouselState.tiltAngle = 0;
      cvCarouselState.tiltTarget = 0;
      if (cvCarouselState.tiltRaf) cancelAnimationFrame(cvCarouselState.tiltRaf);
      stopCVAuto();
    };

    window.onmousemove = e => {
      if (!cvCarouselState.isDragging) return;
      cvCarouselState.dragDelta = (e.clientX - cvCarouselState.dragStartX) * 0.1;
      positionCVCards();
    };

    window.onmouseup = e => {
      if (!cvCarouselState.isDragging) return;
      cvCarouselState.isDragging = false;
      const moved = e.clientX - cvCarouselState.dragStartX;
      if (Math.abs(moved) > 60) {
        moved < 0 ? nextCV() : prevCV();
      } else {
        cvCarouselState.dragDelta = 0;
        positionCVCards();
      }
      if (cvCarouselState.isPlaying) startCVAuto();
    };
  }
}

/**
 * عرض الـ CVs في عنصر DOM (الوضع التقليدي)
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
 * إنشاء عنصر CV DOM التقليدي
 */
function createCVElement(cv) {
  const text = getCVLocalizedText(cv, currentCVLang);
  const hasPDF = cv.files && cv.files.pdf;
  const hasDOCX = cv.files && cv.files.docx;

  let downloadButtons = '';
  if (hasPDF) {
    downloadButtons += `
      <a href="${cv.files.pdf}" download class="cv-download-btn" onclick="trackCVDownload('${cv.id}', 'pdf')">
        <i class="bi bi-file-earmark-pdf"></i>PDF
      </a>
    `;
  }
  if (hasDOCX) {
    downloadButtons += `
      <a href="${cv.files.docx}" download class="cv-download-btn" onclick="trackCVDownload('${cv.id}', 'docx')">
        <i class="bi bi-file-earmark-word"></i>Word
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
 * تتبع عمليات تحميل الـ CV
 */
function trackCVDownload(cvId, format) {
  console.log(`📥 CV Download Tracked: [ID: ${cvId}] [Format: ${format}]`);
  // يمكن إضافة كود Google Analytics أو Firebase هنا لاحقاً
}

/**
 * تهيئة نظام الـ CVs
 */
async function initCVLoader() {
  loadSavedCVLanguage();
  await loadCVsData();
  console.log('✅ CV Loader initialized');
  
  const cvs = getAllCVs();
  
  // Render in Homepage Direct Container (Carousel Mode)
  const directContainer = document.getElementById('cv-ring');
  if (directContainer) {
    renderCVsCarousel(directContainer);
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
  renderCVsCarousel,
  trackCVDownload,
  setCVLanguage,
  loadSavedCVLanguage,
  initCVLoader,
  get currentCVLang() { return currentCVLang; },
  set currentCVLang(val) { currentCVLang = val; }
};