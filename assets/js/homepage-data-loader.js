/**
 * Home Page Data Loader
 * تحميل بيانات الصفحة الرئيسية من JSON
 */

const HOMEPAGE_PROJECTS_LIMIT = 6;
const HOMEPAGE_SERVICES_LIMIT = 6;

let loadedData = null;
let currentLang = localStorage.getItem('portfolio_language') || 'en';

// Get localized title
function getLocalizedTitle(project) {
  return currentLang === 'ar' ? (project.titleAr || project.title) : project.title;
}

// Get localized description
function getLocalizedDescription(project) {
  return currentLang === 'ar' ? (project.descriptionAr || project.description) : project.description;
}

/**
 * تهيئة تحميل البيانات
 */
async function initHomepageData() {
  try {
    // تحميل المشاريع
    const projectsResponse = await fetch('data/projects.json');
    if (!projectsResponse.ok) {
      throw new Error('Failed to load projects.json');
    }
    const projectsData = await projectsResponse.json();
    loadedData = { projects: projectsData.projects };
    console.log('✅ Projects loaded:', loadedData.projects.length);
    
    // تحميل الخدمات
    const servicesResponse = await fetch('data/services.json');
    if (servicesResponse.ok) {
      const servicesData = await servicesResponse.json();
      loadedData.services = servicesData.services;
      console.log('✅ Services loaded:', loadedData.services.length);
    } else {
      console.warn('Could not load services.json, trying fallback');
      if (typeof servicesData !== 'undefined') {
        loadedData.services = Object.values(servicesData);
      }
    }

    // تحميل الآراء
    if (window.DataLoader && window.DataLoader.testimonialsData) {
      loadedData.testimonials = window.DataLoader.testimonialsData;
    }

    // تشغيل الدوال
    populatePortfolioItems();
    populateServiceItems();
    updateFilterCounts();
    updateProjectCounter();
    
  } catch (error) {
    console.error('Error loading data:', error);
    if (typeof populatePortfolioItemsOld === 'function') {
      populatePortfolioItemsOld();
    }
    if (typeof populateServiceItemsOld === 'function') {
      populateServiceItemsOld();
    }
  }
}

/**
 * تحديث计数器 المشاريع في أزرار الفلتر
 */
function updateFilterCounts() {
  if (!loadedData || !loadedData.projects) return;
  
  const projects = loadedData.projects;
  const filterButtons = document.querySelectorAll('.portfolio-filters [data-filter]');
  
  console.log('🔢 Updating filter counts for', projects.length, 'projects');
  
  filterButtons.forEach(btn => {
    const filter = btn.getAttribute('data-filter');
    let count = 0;
    
    if (filter === '*') {
      count = projects.length;
    } else {
      const category = filter.replace('.filter-', '');
      count = projects.filter(p => {
        if (p.category === category) return true;
        if (p.categories && p.categories.includes(category)) return true;
        return false;
      }).length;
    }
    
    console.log('🔢 Filter', filter, 'has', count, 'projects');
    
    // إزالة العداد القديم
    const existingCount = btn.querySelector('.filter-count');
    if (existingCount) existingCount.remove();
    
    // إضافة العداد الجديد
    const countSpan = document.createElement('span');
    countSpan.className = 'filter-count ms-1';
    countSpan.style.fontSize = '0.8em';
    countSpan.style.opacity = '0.7';
    countSpan.textContent = `(${count})`;
    btn.appendChild(countSpan);
  });
}

/**
 * تحديث计数器 المشاريع في زر "عرض الكل"
 */
function updateProjectCounter() {
  if (!loadedData || !loadedData.projects) return;
  
  const projects = loadedData.projects;
  const counterText = document.querySelector('#portfolio .text-muted');
  
  if (counterText) {
    counterText.textContent = `Discover all ${projects.length} projects with detailed case studies`;
  }
}

/**
 * عرض المشاريع في الصفحة الرئيسية
 */
function populatePortfolioItems() {
  const portfolioContainer = document.querySelector('#portfolio .isotope-container');
  const portfolioTemplate = document.querySelector('#portfolio .portfolio-template');
  
  if (!portfolioContainer || !portfolioTemplate || !loadedData || !loadedData.projects) {
    console.warn('Portfolio container or data not found, using fallback');
    return;
  }
  
// مسح المحتوى
  portfolioContainer.innerHTML = '';
  
  // الحصول على المشاريع (المحدود بـ 6 للصفحة الرئيسية)
  const projects = loadedData.projects.slice(0, HOMEPAGE_PROJECTS_LIMIT);
  console.log('🎨 Displaying projects on homepage:', projects.length);
  console.log('📊 Projects being displayed:', projects);
  
  projects.forEach((project, index) => {
    // تحديد الـ layout بناءً على الترتيب (فردي = عريض، زوجي = طبيعي)
    const isWide = (index + 1) % 2 === 1; // 1st, 3rd, 5th gets wide
    
    const projectClone = portfolioTemplate.cloneNode(true);
    
    projectClone.classList.remove('portfolio-template');
    projectClone.classList.add(`filter-${project.category}`);
    
    // إضافة التصنيفات المتعددة إذا كانت موجودة
    if (project.categories && Array.isArray(project.categories)) {
      project.categories.forEach(cat => {
        projectClone.classList.add(`filter-${cat}`);
      });
    }
    
    // إضافة كلاس للعنصر العريض
    if (isWide) {
      projectClone.classList.add('wide-item');
    }
    
    projectClone.style.display = 'block';
    projectClone.setAttribute('data-aos-delay', 100 + index * 100);
    
    // الصورة (مع دعم الوضع الليلي)
    const imgElement = projectClone.querySelector('img');
    if (imgElement) {
      const isDarkMode = document.body.classList.contains('dark-mode');
      const lightImg = project.thumbnail || project.image;
      const darkImg = project.thumbnail_dark || project.image_dark || lightImg;
      
      imgElement.src = isDarkMode ? darkImg : lightImg;
      imgElement.alt = `${getLocalizedTitle(project)} - ${getLocalizedDescription(project)}`;
    }
    
    // العنوان
    const titleElement = projectClone.querySelector('.portfolio-title');
    if (titleElement) {
      titleElement.textContent = getLocalizedTitle(project);
    }
    
    // الوصف
    const descElement = projectClone.querySelector('.portfolio-description');
    if (descElement) {
      descElement.textContent = getLocalizedDescription(project);
    }
    
    // رابط المعاينة
    const previewLink = projectClone.querySelector('.glightbox.preview-link');
    if (previewLink) {
      previewLink.href = project.thumbnail || project.image;
      previewLink.title = `${getLocalizedTitle(project)} - ${getLocalizedDescription(project)}`;
      previewLink.setAttribute('data-gallery', project.gallery || 'portfolio-gallery');
    }
    
    // رابط التفاصيل
    const detailsLink = projectClone.querySelector('.details-link');
    if (detailsLink) {
      detailsLink.href = `project.html?project=${project.id}`;
    }
    
    portfolioContainer.appendChild(projectClone);
  });
  
  // Debug: Check how many elements were added
  const addedElements = portfolioContainer.querySelectorAll('.portfolio-item:not(.portfolio-template)');
  console.log('🔍 DOM elements added:', addedElements.length);
  console.log('🔍 Container innerHTML:', portfolioContainer.innerHTML.substring(0, 200));
  
  // Try to reinitialize Isotope to show all items
  setTimeout(() => {
    if (typeof Isotope !== 'undefined') {
      const container = document.querySelector('#portfolio .isotope-container');
      if (container) {
        console.log('🔄 Reinitializing Isotope...');
        const iso = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: 'masonry'
        });
        window.iso = iso;
      }
    }
  }, 100);
  
  console.log(`✅ Displayed ${projects.length} projects on homepage`);
}

/**
 * عرض الخدمات في الصفحة الرئيسية
 */
// ── Carousel State ──
let serviceCarouselState = {
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
 * عرض الخدمات في الصفحة الرئيسية باستخدام Carousel 3D
 */
function populateServiceItems() {
  const ring = document.getElementById('services-ring');
  const dotsEl = document.getElementById('service-dots');
  const template = document.getElementById('service-card-template');
  
  if (!ring || !template || !loadedData || !loadedData.services) {
    console.warn('Carousel elements or data not found');
    return;
  }
  
  const services = Array.isArray(loadedData.services) ? loadedData.services : Object.values(loadedData.services);
  const N = services.length;
  
  // مسح المحتوى
  ring.innerHTML = '';
  if (dotsEl) dotsEl.innerHTML = '';
  
  services.forEach((service, i) => {
    const cardClone = template.querySelector('.service-carousel-card').cloneNode(true);
    const serviceTitle = currentLang === 'ar' ? (service.titleAr || service.title) : service.title;
    const serviceDesc = currentLang === 'ar' ? (service.descriptionAr || service.description) : service.description;
    const serviceTag = currentLang === 'ar' ? 'خدمة متميزة' : 'Professional Service';
    const serviceIcon = service.icon || 'bi-activity';

    const colorClasses = ['item-orange', 'item-cyan', 'item-red', 'item-green', 'item-purple', 'item-blue'];
    const colorClass = colorClasses[i % colorClasses.length];

    const cardInner = cardClone.querySelector('.card-inner');
    cardInner.classList.add(colorClass);

    // Populate Front Face — preserve template structure
    const cardNumber = cardClone.querySelector('.card-number');
    const cardIcon = cardClone.querySelector('.card-icon-wrap i');
    const cardTitle = cardClone.querySelector('.cv-title');
    const cardSpec = cardClone.querySelector('.cv-specialization');
    const cardDesc = cardClone.querySelector('.cv-description');
    const cardTag = cardClone.querySelector('.card-tag');

    if (cardNumber) cardNumber.textContent = (i + 1).toString().padStart(2, '0');
    if (cardIcon) cardIcon.className = `bi ${service.icon}`;
    if (cardTitle) cardTitle.textContent = serviceTitle;
    if (cardSpec) cardSpec.textContent = currentLang === 'ar' ? 'خدمة متميزة' : 'Professional Service';
    if (cardDesc) cardDesc.textContent = serviceDesc;
    if (cardTag) cardTag.textContent = service.id.toUpperCase();

    // Add stretched link
    const stretchedLink = document.createElement('a');
    stretchedLink.href = `service-details.html?service=${service.id}`;
    stretchedLink.className = 'stretched-link-arrow';
    cardInner.appendChild(stretchedLink);

    // Populate Back Side
    const backLogo = cardClone.querySelector('.back-logo i');
    if (backLogo) backLogo.className = `bi ${service.icon || 'bi-activity'}`;
    
    const backTitle = cardClone.querySelector('.back-title');
    if (backTitle) backTitle.textContent = serviceTitle;
    
    const backTag = cardClone.querySelector('.back-tag');
    if (backTag) backTag.textContent = service.id.toUpperCase();
    
    const backNum = cardClone.querySelector('.back-num');
    if (backNum) backNum.textContent = (i + 1).toString().padStart(2, '0');

    cardClone.addEventListener('click', () => {
      if (Math.abs(serviceCarouselState.dragDelta) < 1) {
        goToService(i);
      }
    });

    ring.appendChild(cardClone);

    // Dots
    if (dotsEl) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.addEventListener('click', () => goToService(i));
      dotsEl.appendChild(dot);
    }
  });

  // Setup Controls
  setupCarouselControls();
  
  // Initial position
  positionServiceCards();
  
  // Start Auto Play
  if (serviceCarouselState.isPlaying) startServiceAuto();
}

function getCarouselRadius() {
  return window.innerWidth <= 768 ? 260 : 420;
}

function positionServiceCards() {
  const ring = document.getElementById('services-ring');
  const dotsEl = document.getElementById('service-dots');
  if (!ring) return;

  const cards = ring.querySelectorAll('.service-carousel-card');
  const N = cards.length;
  const angleStep = 360 / N;
  const r = getCarouselRadius();

  const activeTilt = serviceCarouselState.isDragging
    ? -serviceCarouselState.dragDelta * 0.45
    : serviceCarouselState.tiltAngle;

  cards.forEach((card, i) => {
    const relAngle = ((i - serviceCarouselState.currentIndex) * angleStep + serviceCarouselState.dragDelta) % 360;
    const rad      = relAngle * Math.PI / 180;
    const x        = Math.sin(rad) * r;
    const z        = Math.cos(rad) * r;
    const scale    = (z + r) / (r * 2);
    const opacity  = 0.3 + scale * 0.7;
    const isActive = i === serviceCarouselState.currentIndex && serviceCarouselState.dragDelta === 0;

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
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === serviceCarouselState.currentIndex);
    });
  }
}

function animateServiceTilt() {
  serviceCarouselState.tiltAngle += (serviceCarouselState.tiltTarget - serviceCarouselState.tiltAngle) * serviceCarouselState.TILT_EASE;
  positionServiceCards();
  
  if (Math.abs(serviceCarouselState.tiltAngle - serviceCarouselState.tiltTarget) > 0.05) {
    serviceCarouselState.tiltRaf = requestAnimationFrame(animateServiceTilt);
  } else {
    serviceCarouselState.tiltAngle = serviceCarouselState.tiltTarget;
    positionServiceCards();
    serviceCarouselState.tiltRaf = null;
  }
}

function triggerServiceTilt(dir) {
  serviceCarouselState.tiltTarget = dir * serviceCarouselState.TILT_MAX;
  if (serviceCarouselState.tiltRaf) cancelAnimationFrame(serviceCarouselState.tiltRaf);
  serviceCarouselState.tiltRaf = requestAnimationFrame(animateServiceTilt);
  setTimeout(() => { serviceCarouselState.tiltTarget = 0; }, 180);
}

function goToService(index, dir) {
  const cards = document.querySelectorAll('.service-carousel-card');
  const N = cards.length;
  if (N === 0) return;
  
  serviceCarouselState.currentIndex = ((index % N) + N) % N;
  serviceCarouselState.dragDelta = 0;
  if (dir !== undefined) triggerServiceTilt(dir);
  positionServiceCards();
}

function nextService() { goToService(serviceCarouselState.currentIndex + 1, -1); }
function prevService() { goToService(serviceCarouselState.currentIndex - 1, +1); }

function startServiceAuto() {
  stopServiceAuto();
  serviceCarouselState.autoTimer = setInterval(nextService, 2800);
}

function stopServiceAuto() {
  if (serviceCarouselState.autoTimer) clearInterval(serviceCarouselState.autoTimer);
}

function setupCarouselControls() {
  const nextBtn = document.getElementById('nextServiceBtn');
  const prevBtn = document.getElementById('prevServiceBtn');
  const playBtn = document.getElementById('playServiceBtn');
  const ring = document.getElementById('services-ring');

  if (nextBtn) nextBtn.onclick = nextService;
  if (prevBtn) prevBtn.onclick = prevService;
  
  if (playBtn) {
    playBtn.onclick = () => {
      serviceCarouselState.isPlaying = !serviceCarouselState.isPlaying;
      const icon = playBtn.querySelector('i');
      if (serviceCarouselState.isPlaying) {
        if (icon) icon.className = 'bi bi-pause-fill';
        startServiceAuto();
      } else {
        if (icon) icon.className = 'bi bi-play-fill';
        stopServiceAuto();
      }
    };
  }

  if (ring) {
    // Mouse Drag
    ring.onmousedown = e => {
      serviceCarouselState.isDragging = true;
      serviceCarouselState.dragStartX = e.clientX;
      serviceCarouselState.tiltAngle = 0;
      serviceCarouselState.tiltTarget = 0;
      if (serviceCarouselState.tiltRaf) cancelAnimationFrame(serviceCarouselState.tiltRaf);
      stopServiceAuto();
    };

    window.onmousemove = e => {
      if (!serviceCarouselState.isDragging) return;
      serviceCarouselState.dragDelta = (e.clientX - serviceCarouselState.dragStartX) * 0.1;
      positionServiceCards();
    };

    window.onmouseup = e => {
      if (!serviceCarouselState.isDragging) return;
      serviceCarouselState.isDragging = false;
      const moved = e.clientX - serviceCarouselState.dragStartX;
      if (Math.abs(moved) > 60) {
        moved < 0 ? nextService() : prevService();
      } else {
        serviceCarouselState.dragDelta = 0;
        positionServiceCards();
      }
      if (serviceCarouselState.isPlaying) startServiceAuto();
    };

    // Touch
    ring.ontouchstart = e => {
      serviceCarouselState.dragStartX = e.touches[0].clientX;
      serviceCarouselState.isDragging = true;
      stopServiceAuto();
    };

    ring.ontouchmove = e => {
      if (!serviceCarouselState.isDragging) return;
      serviceCarouselState.dragDelta = (e.touches[0].clientX - serviceCarouselState.dragStartX) * 0.1;
      positionServiceCards();
    };

    ring.ontouchend = e => {
      if (!serviceCarouselState.isDragging) return;
      serviceCarouselState.isDragging = false;
      const moved = e.changedTouches[0].clientX - serviceCarouselState.dragStartX;
      if (Math.abs(moved) > 60) {
        moved < 0 ? nextService() : prevService();
      } else {
        serviceCarouselState.dragDelta = 0;
        positionServiceCards();
      }
      if (serviceCarouselState.isPlaying) startServiceAuto();
    };
  }
}

/**
 * تفعيل نظام الفلترة
 */
function setupPortfolioFilters() {
  const filterContainer = document.querySelector('.portfolio-filters');
  if (!filterContainer) return;
  
  const filterButtons = filterContainer.querySelectorAll('[data-filter]');
  const portfolioContainer = document.querySelector('#portfolio .isotope-container');
  
  if (!portfolioContainer) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      console.log('🔽 Filter clicked:', filter);
      
      if (!loadedData || !loadedData.projects) return;
      
      // تحديث الـ active
      filterButtons.forEach(b => b.classList.remove('filter-active'));
      this.classList.add('filter-active');
      console.log('🎯 Active filter:', filter);
      
      // الفلترة
      let filteredProjects = loadedData.projects;
      if (filter !== '*') {
        const category = filter.replace('.filter-', '');
        filteredProjects = loadedData.projects.filter(p => {
          if (p.category === category) return true;
          if (p.categories && p.categories.includes(category)) return true;
          return false;
        });
        console.log('📂 Category filtered:', category);
      } else {
        console.log('📂 Showing all projects');
      }
      
      console.log('📊 Filtered projects count:', filteredProjects.length);
      console.log('📋 Filtered projects:', filteredProjects);
      
      // إعادة العرض
      portfolioContainer.innerHTML = '';
      
      filteredProjects.forEach((project, index) => {
        const projectClone = portfolioTemplateClone(project, index);
        portfolioContainer.appendChild(projectClone);
      });
      
      console.log('✅ Displaying filtered projects:', filteredProjects.length);
      
      // إعادة تهيئة Isotope
      reinitializeIsotope();
      
      // تحديث计数器
      updateFilterCounts();
    });
  });
}

/**
 * إنشاء clone للمشروع
 */
function portfolioTemplateClone(project, index) {
  const template = document.querySelector('#portfolio .portfolio-template');
  if (!template) return document.createElement('div');
  
  const clone = template.cloneNode(true);
  clone.classList.remove('portfolio-template');
  clone.classList.add(`filter-${project.category}`);
  
  // إضافة التصنيفات المتعددة إذا كانت موجودة
  if (project.categories && Array.isArray(project.categories)) {
    project.categories.forEach(cat => {
      clone.classList.add(`filter-${cat}`);
    });
  }
  
  clone.style.display = 'block';
  clone.setAttribute('data-aos-delay', 100 + index * 100);
  
  const imgElement = clone.querySelector('img');
  if (imgElement) {
    imgElement.src = project.thumbnail || project.image;
    imgElement.alt = `${getLocalizedTitle(project)} - ${getLocalizedDescription(project)}`;
  }
  
  const titleElement = clone.querySelector('.portfolio-title');
  if (titleElement) {
    titleElement.textContent = getLocalizedTitle(project);
  }
  
  const descElement = clone.querySelector('.portfolio-description');
  if (descElement) {
    descElement.textContent = getLocalizedDescription(project);
  }
  
  const previewLink = clone.querySelector('.glightbox.preview-link');
  if (previewLink) {
    previewLink.href = project.thumbnail || project.image;
    previewLink.title = `${getLocalizedTitle(project)} - ${getLocalizedDescription(project)}`;
  }
  
  const detailsLink = clone.querySelector('.details-link');
  if (detailsLink) {
    detailsLink.href = `project.html?project=${project.id}`;
  }
  
  return clone;
}

/**
 * إعادة تهيئة Isotope بعد الفلترة
 */
function reinitializeIsotope() {
  if (typeof Isotope !== 'undefined') {
    const container = document.querySelector('#portfolio .isotope-container');
    if (container) {
      const iso = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: 'masonry'
      });
    }
  }
  
  // إعادة تهيئة الـ animations
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
  
  // إعادة تهيئة GLightbox
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      closeOnOutsideClick: true,
      loop: false
    });
  }
}

/**
 * تفعيل language toggle
 */
function setupLanguageToggle() {
  const langToggle = document.getElementById('language-toggle');
  if (!langToggle) return;
  
  langToggle.addEventListener('click', function() {
    const currentLang = localStorage.getItem('portfolio_language') || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    localStorage.setItem('portfolio_language', newLang);
    
    // إعادة تحميل الصفحة لتطبيق اللغة
    location.reload();
  });
}

/**
 *初始化 عند تحميل الصفحة
 */
document.addEventListener('DOMContentLoaded', async () => {
  await initHomepageData();
  await initCVLoader();
  renderCVs(document.getElementById('cv-container'));
  setupPortfolioFilters();
  setupLanguageToggle();
  
  setTimeout(() => {
    if (typeof GLightbox !== 'undefined') {
      const glightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        closeOnOutsideClick: true,
        loop: false
      });
      window.glightboxInstance = glightbox;
    }
  }, 300);
});