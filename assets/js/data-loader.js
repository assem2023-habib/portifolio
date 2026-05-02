/**
 * Data Loader - تحميل البيانات من JSON
 * يتحكم بجلب البيانات والفلترة دعم اللغات
 */

let projectsData = null;
let testimonialsData = null;
let currentLanguage = 'en';
let currentFilter = '*';

/**
 * تحميل بيانات المشاريع من JSON
 */
async function loadProjectsData() {
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error('Failed to load projects.json');
    const data = await response.json();
    projectsData = data;
    return data;
  } catch (error) {
    console.error('Error loading projects:', error);
    return null;
  }
}

/**
 * الحصول على جميع المشاريع
 */
function getAllProjects() {
  if (!projectsData) return [];
  return projectsData.projects || [];
}

/**
 *فلترة المشاريع حسب الفئة
 */
function filterProjectsByCategory(category) {
  const projects = getAllProjects();
  if (category === '*') return projects;
  return projects.filter(p => {
    if (p.category === category) return true;
    if (p.categories && p.categories.includes(category)) return true;
    return false;
  });
}

/**
 * الحصول على الفئات
 */
function getCategories() {
  if (!projectsData) return [];
  return projectsData.categories || [];
}

/**
 * الحصول على مشروع معين بالمعرف
 */
function getProjectById(id) {
  const projects = getAllProjects();
  return projects.find(p => p.id === id);
}

/**
 * تحميل بيانات التوصيات من JSON
 */
async function loadTestimonialsData() {
  try {
    console.log('📥 [DataLoader] Step 1: Fetching testimonials.json...');
    const response = await fetch('data/testimonials.json');
    if (!response.ok) throw new Error('Failed to load testimonials.json');
    const data = await response.json();
    console.log('✅ [DataLoader] Step 2: Testimonials JSON loaded successfully');
    console.log('📊 [DataLoader] Raw data:', data);
    console.log('📋 [DataLoader] Number of testimonials:', data.testimonials?.length || 0);
    
    testimonialsData = data;
    console.log('💾 [DataLoader] Step 3: Data saved to testimonialsData variable');
    console.log('🎯 [DataLoader] Step 4: First testimonial sample:', data.testimonials?.[0]);
    
    return data;
  } catch (error) {
    console.error('❌ [DataLoader] Error loading testimonials:', error);
    return null;
  }
}

/**
 * الحصول على جميع التوصيات
 */
function getAllTestimonials() {
  if (!testimonialsData) return [];
  return testimonialsData.testimonials || [];
}

/**
 * الحصول على توصية معينة بالمعرف
 */
function getTestimonialById(id) {
  const testimonials = getAllTestimonials();
  return testimonials.find(t => t.id === id);
}

/**
 * الحصول على الحقل بلغة محددة
 */
function getLocalizedField(project, field, lang = null) {
  const language = lang || currentLanguage;
  const localizedField = field + (language === 'ar' ? 'Ar' : '');
  return project[localizedField] || project[field] || '';
}

/**
 * إنشاء عنصر مشروع DOM
 */
function createProjectElement(project, isTemplate = true) {
  const language = currentLanguage;
  
  const title = getLocalizedField(project, 'title', language);
  const description = getLocalizedField(project, 'description', language);
  const image = project.thumbnail || project.image;
  const category = project.category;
  
  return {
    id: project.id,
    title: title,
    description: description,
    image: image,
    category: category,
    technologies: project.technologies || [],
    year: project.year,
    duration: project.duration || '',
    role: project.role || '',
    client: project.client || '',
    features: language === 'ar' ? (project.featuresAr || project.features) : (project.features || []),
    challenges: language === 'ar' ? (project.challengesAr || project.challenges) : (project.challenges || ''),
    status: project.status,
    highlights: project.highlights || {}
  };
}

/**
 * عرض المشاريع في عنصر DOM معين
 */
function renderProjects(container, projects, options = {}) {
  if (!container) {
    console.error('Container not found');
    return;
  }

  const {
    showFilters = false,
    maxProjects = null,
    useAnimation = true,
    itemClass = 'portfolio-item'
  } = options;

  // مسح المحتوى الحالي
  container.innerHTML = '';

  // تحديد عدد المشاريع للعرض
  const projectsToShow = maxProjects ? projects.slice(0, maxProjects) : projects;

  projectsToShow.forEach((project, index) => {
    const projectData = createProjectElement(project);
    
    const col = document.createElement('div');
    col.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${projectData.category}`;
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', useAnimation ? (100 + index * 100) : 0);

    col.innerHTML = `
      <img src="${projectData.image}" class="img-fluid" alt="${projectData.title}">
      <div class="portfolio-info">
        <h4 class="portfolio-title">${projectData.title}</h4>
        <p class="portfolio-description">${projectData.description}</p>
        <p class="portfolio-meta">
          <span class="portfolio-year">${projectData.year}</span> · 
          <span class="portfolio-technologies">${projectData.technologies.slice(0, 3).join(', ')}</span>
        </p>
        <a href="${projectData.image}" title="${projectData.title}" data-gallery="portfolio-gallery" class="glightbox preview-link">
          <i class="bi bi-zoom-in"></i>
        </a>
        <a href="project.html?project=${project.id}" title="More Details" class="details-link">
          <i class="bi bi-link-45deg"></i>
        </a>
      </div>
    `;

    container.appendChild(col);
  });

  return projectsToShow.length;
}

/**
 * تفعيل أزرار الفلترة
 */
function setupFilters(filterContainer, onFilterChange) {
  const filterButtons = filterContainer.querySelectorAll('li[data-filter]');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // إزالة الـ active من كل الأزرار
      filterButtons.forEach(b => b.classList.remove('filter-active'));
      
      // إضافة الـ active للزر المحدد
      this.classList.add('filter-active');
      
      // استدعاء الدالة callback
      if (onFilterChange) {
        onFilterChange(filter);
      }
    });
  });
}

/**
 * تحديث计数器 المشاريع
 */
function updateProjectCounts(filterButtons, projects) {
  if (!projects || !projects.length) return;
  
  const categories = getCategories();
  
  filterButtons.forEach(btn => {
    const filter = btn.getAttribute('data-filter');
    let count = 0;
    
    if (filter === '*') {
      count = projects.length;
    } else {
      count = projects.filter(p => p.category === filter).length;
    }
    
    // إزالة الرقم القديم
    const existingCount = btn.querySelector('.filter-count');
    if (existingCount) existingCount.remove();
    
    // إضافة الرقم الجديد
    const countSpan = document.createElement('span');
    countSpan.className = 'filter-count';
    countSpan.textContent = ` (${count})`;
    btn.appendChild(countSpan);
  });
}

/**
 * حفظ اللغة المختارة
 */
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('portfolio_language', lang);
}

/**
 * استعادة اللغة المحفوظة
 */
function loadSavedLanguage() {
  const saved = localStorage.getItem('portfolio_language');
  if (saved) {
    currentLanguage = saved;
  }
  return currentLanguage;
}

/**
 * تهيئة تحميل البيانات
 */
async function initDataLoader() {
  // استعادة اللغة
  loadSavedLanguage();
  
  // تحميل البيانات
  await loadProjectsData();
  
  console.log('✅ Data Loader initialized');
  console.log('📁 Projects loaded:', getAllProjects().length);
  console.log('🌐 Language:', currentLanguage);
}

/**
 * تصدير للدوال للاستخدام العام
 */
window.DataLoader = {
  loadProjectsData,
  getAllProjects,
  filterProjectsByCategory,
  getCategories,
  getProjectById,
  getLocalizedField,
  createProjectElement,
  renderProjects,
  setupFilters,
  updateProjectCounts,
  setLanguage,
  loadSavedLanguage,
  initDataLoader,
  // Testimonials functions
  loadTestimonialsData,
  getAllTestimonials,
  getTestimonialById,
  get testimonialsData() { return testimonialsData; },
  set testimonialsData(val) { testimonialsData = val; },
  get currentLanguage() { return currentLanguage; },
  set currentLanguage(val) { currentLanguage = val; },
  get currentFilter() { return currentFilter; },
  set currentFilter(val) { currentFilter = val; }
};