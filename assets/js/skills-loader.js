/**
 * Skills Loader
 * تحميل المهارات من JSON وعرضها مع زر عرض المزيد
 */

let skillsData = null;
let skillsLevels = null;
let currentSkillsLang = 'en';
const FEATURED_COUNT = 6;
let showAllSkills = false;

/**
 * تحميل بيانات المهارات من JSON
 */
async function loadSkillsData() {
  try {
    const response = await fetch('data/skills.json');
    if (!response.ok) throw new Error('Failed to load skills.json');
    const data = await response.json();
    skillsData = data.skills || [];
    skillsLevels = data.levels || {};
    return data;
  } catch (error) {
    console.error('Error loading skills:', error);
    return null;
  }
}

/**
 * الحصول على اللون المناسب للمستوى
 */
function getLevelColor(level) {
  const levelInfo = skillsLevels[level] || skillsLevels['good'];
  return levelInfo;
}

/**
 * إنشاء عنصر مهارة
 */
function createSkillElement(skill) {
  const isArabic = currentSkillsLang === 'ar';
  const name = isArabic ? (skill.nameAr || skill.name) : skill.name;
  const levelInfo = getLevelColor(skill.level);
  const levelText = isArabic ? (levelInfo.labelAr || skill.levelAr) : (levelInfo.label || skill.level);
  const color = isArabic ? levelInfo.colorDark : levelInfo.color;

  return `
    <div class="skill-box" data-aos="fade-up">
      <div class="skill-header">
        <span class="skill-name">${name}</span>
      </div>
      <div class="skill-level-badge" style="background-color: ${color}20; border-color: ${color}40; color: ${color}">
        <span class="badge-level">${levelText}</span>
      </div>
    </div>
  `;
}

/**
 * عرض المهارات في الحاوية
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  const toggleBtn = document.getElementById('showMoreSkills');
  
  if (!container || !skillsData) return;

  // Determine language
  currentSkillsLang = window.DataLoader?.currentLanguage || localStorage.getItem('portfolio_language') || 'en';

  // Get skills to display
  const featuredSkills = skillsData.filter(s => s.featured);
  const hiddenSkills = skillsData.filter(s => !s.featured);
  
  let skillsToShow = [...featuredSkills];
  if (showAllSkills) {
    skillsToShow = [...skillsToShow, ...hiddenSkills];
  }

  // Clear container
  container.innerHTML = '';

  // Create row structure
  let currentCol = 0;
  let colLeft = document.createElement('div');
  colLeft.className = 'col-lg-6';
  let colRight = document.createElement('div');
  colRight.className = 'col-lg-6';
  
  const skillsRow = document.createElement('div');
  skillsRow.className = 'row skills-content skills-animation';
  
  skillsToShow.forEach((skill, index) => {
    const skillHTML = createSkillElement(skill);
    
    if (index % 2 === 0) {
      colLeft.innerHTML += skillHTML;
    } else {
      colRight.innerHTML += skillHTML;
    }
  });
  
  skillsRow.appendChild(colLeft);
  skillsRow.appendChild(colRight);
  container.appendChild(skillsRow);

  // Toggle button visibility
  if (toggleBtn) {
    if (hiddenSkills.length > 0) {
      toggleBtn.style.display = 'inline-flex';
      const isArabic = currentSkillsLang === 'ar';
      
      if (showAllSkills) {
        toggleBtn.innerHTML = `
          <i class="bi bi-dash-circle me-1"></i>
          <span class="lang-en">Show Less</span>
          <span class="lang-ar" style="display: ${isArabic ? 'inline' : 'none'}">إخفاء البعض</span>
        `;
      } else {
        toggleBtn.innerHTML = `
          <i class="bi bi-plus-circle me-1"></i>
          <span class="lang-en">Show All Skills (${hiddenSkills.length} more)</span>
          <span class="lang-ar" style="display: ${isArabic ? 'inline' : 'none'}">عرض كل المهارات (${hiddenSkills.length} أكثر)</span>
        `;
      }
    } else {
      toggleBtn.style.display = 'none';
    }
  }

  // Refresh AOS
  if (typeof AOS !== 'undefined') {
    setTimeout(() => AOS.refresh(), 100);
  }

  console.log(`✅ Skills rendered: ${skillsToShow.length} total (${featuredSkills.length} featured, ${hiddenSkills.length} hidden)`);
}

/**
 * تهيئة محمل المهارات
 */
async function initSkillsLoader() {
  await loadSkillsData();
  renderSkills();

  // Setup toggle button
  const toggleBtn = document.getElementById('showMoreSkills');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      showAllSkills = !showAllSkills;
      renderSkills();
    });
  }

  // Listen for language changes
  window.addEventListener('languageChanged', function() {
    renderSkills();
  });

  console.log('✅ Skills Loader initialized');
}

// Export for external use
window.SkillsLoader = {
  loadSkillsData,
  renderSkills,
  initSkillsLoader,
  get featuredCount() { return FEATURED_COUNT; }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('skills')) {
    initSkillsLoader();
  }
});
