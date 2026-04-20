/**
 * Home Page Data Loader
 * تحميل بيانات الصفحة الرئيسية من JSON
 */

const HOMEPAGE_PROJECTS_LIMIT = 6;
const HOMEPAGE_SERVICES_LIMIT = 6;

let loadedData = null;

/**
 * تهيئة تحميل البيانات
 */
async function initHomepageData() {
  try {
    // تحميل JSON
    const response = await fetch('data/projects.json');
    if (!response.ok) {
      throw new Error('Failed to load projects.json');
    }
    
    loadedData = await response.json();
    console.log('✅ Data loaded:', loadedData);
    
    // تحميل الخدمات
    if (typeof servicesData !== 'undefined') {
      loadedData.services = servicesData;
    }
    
    // تحميل الآراء
    if (typeof testimonialsData !== 'undefined') {
      loadedData.testimonials = testimonialsData;
    }
    
    // تشغيل الدوال
    populatePortfolioItems();
    populateServiceItems();
    updateFilterCounts();
    updateProjectCounter();
    
  } catch (error) {
    console.error('Error loading data:', error);
    //Fallback للبيانات القديمة
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
  const filterButtons = document.querySelectorAll('.portfolio-filters li[data-filter]');
  
  filterButtons.forEach(btn => {
    const filter = btn.getAttribute('data-filter');
    let count = 0;
    
    if (filter === '*') {
      count = projects.length;
    } else {
      const category = filter.replace('.filter-', '');
      count = projects.filter(p => p.category === category).length;
    }
    
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
  
  projects.forEach((project, index) => {
    const projectClone = portfolioTemplate.cloneNode(true);
    
    projectClone.classList.remove('portfolio-template');
    projectClone.classList.add(`filter-${project.category}`);
    projectClone.style.display = 'block';
    projectClone.setAttribute('data-aos-delay', 100 + index * 100);
    
    // الصورة
    const imgElement = projectClone.querySelector('img');
    if (imgElement) {
      imgElement.src = project.thumbnail || project.image;
      imgElement.alt = `${project.title} - ${project.description}`;
    }
    
    // العنوان
    const titleElement = projectClone.querySelector('.portfolio-title');
    if (titleElement) {
      titleElement.textContent = project.title;
    }
    
    // الوصف
    const descElement = projectClone.querySelector('.portfolio-description');
    if (descElement) {
      descElement.textContent = project.description;
    }
    
    // رابط المعاينة
    const previewLink = projectClone.querySelector('.glightbox.preview-link');
    if (previewLink) {
      previewLink.href = project.thumbnail || project.image;
      previewLink.title = `${project.title} - ${project.description}`;
      previewLink.setAttribute('data-gallery', project.gallery || 'portfolio-gallery');
    }
    
    // رابط التفاصيل
    const detailsLink = projectClone.querySelector('.details-link');
    if (detailsLink) {
      detailsLink.href = `project.html?project=${project.id}`;
    }
    
    portfolioContainer.appendChild(projectClone);
  });
  
  console.log(`✅ Displayed ${projects.length} projects on homepage`);
}

/**
 * عرض الخدمات في الصفحة الرئيسية
 */
function populateServiceItems() {
  const servicesContainer = document.querySelector('#services .container .row');
  const serviceTemplate = document.querySelector('#services .service-item-template');
  
  if (!servicesContainer || !serviceTemplate) {
    console.warn('Services container or template not found');
    return;
  }
  
  // استخدام servicesData من الملف القديم إذا كان موجوداً
  let services = null;
  
  if (loadedData && loadedData.services) {
    services = Object.values(loadedData.services);
  } else if (typeof servicesData !== 'undefined') {
    services = Object.values(servicesData);
  }
  
  if (!services) {
    console.warn('Services data not found');
    return;
  }
  
  // مسح المحتوى
  servicesContainer.innerHTML = '';
  
  const colors = ['item-cyan', 'item-orange', 'item-teal', 'item-red', 'item-indigo', 'item-pink'];
  const icons = ['bi-activity', 'bi-broadcast', 'bi-easel', 'bi-bounding-box-circles', 'bi-calendar4-week', 'bi-chat-square-text'];
  
  services.slice(0, HOMEPAGE_SERVICES_LIMIT).forEach((service, index) => {
    const serviceClone = serviceTemplate.cloneNode(true);
    
    serviceClone.classList.remove('service-item-template');
    serviceClone.style.display = 'block';
    serviceClone.setAttribute('data-aos-delay', 100 + index * 100);
    
    const color = colors[index % colors.length];
    const icon = icons[index % icons.length];
    
    const serviceItem = serviceClone.querySelector('.service-item');
    if (serviceItem) {
      serviceItem.className = `service-item ${color} position-relative`;
    }
    
    const iconElement = serviceClone.querySelector('.service-icon');
    if (iconElement) {
      iconElement.className = `bi ${icon}`;
    }
    
    const linkElement = serviceClone.querySelector('.service-link');
    if (linkElement) {
      linkElement.href = `service-details.html?service=${service.id || index}`;
    }
    
    const titleElement = serviceClone.querySelector('.service-title');
    if (titleElement) {
      titleElement.textContent = service.title;
    }
    
    const descElement = serviceClone.querySelector('.service-description');
    if (descElement) {
      descElement.textContent = service.description;
    }
    
    servicesContainer.appendChild(serviceClone);
  });
  
  console.log(`✅ Displayed ${Math.min(services.length, HOMEPAGE_SERVICES_LIMIT)} services on homepage`);
}

/**
 * تفعيل نظام الفلترة
 */
function setupPortfolioFilters() {
  const filterContainer = document.querySelector('.portfolio-filters');
  if (!filterContainer) return;
  
  const filterButtons = filterContainer.querySelectorAll('li[data-filter]');
  const portfolioContainer = document.querySelector('#portfolio .isotope-container');
  
  if (!portfolioContainer) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      if (!loadedData || !loadedData.projects) return;
      
      // تحديث الـ active
      filterButtons.forEach(b => b.classList.remove('filter-active'));
      this.classList.add('filter-active');
      
      // الفلترة
      let filteredProjects = loadedData.projects;
      if (filter !== '*') {
        const category = filter.replace('.filter-', '');
        filteredProjects = loadedData.projects.filter(p => p.category === category);
      }
      
      // إعادة العرض
      portfolioContainer.innerHTML = '';
      
      filteredProjects.forEach((project, index) => {
        const projectClone = portfolioTemplateClone(project, index);
        portfolioContainer.appendChild(projectClone);
      });
      
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
  clone.style.display = 'block';
  clone.setAttribute('data-aos-delay', 100 + index * 100);
  
  const imgElement = clone.querySelector('img');
  if (imgElement) {
    imgElement.src = project.thumbnail || project.image;
    imgElement.alt = `${project.title} - ${project.description}`;
  }
  
  const titleElement = clone.querySelector('.portfolio-title');
  if (titleElement) {
    titleElement.textContent = project.title;
  }
  
  const descElement = clone.querySelector('.portfolio-description');
  if (descElement) {
    descElement.textContent = project.description;
  }
  
  const previewLink = clone.querySelector('.glightbox.preview-link');
  if (previewLink) {
    previewLink.href = project.thumbnail || project.image;
    previewLink.title = `${project.title} - ${project.description}`;
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