/**
 * Skills Loader
 * تحميل المهارات من JSON وعرضها في شريط متحرك
 */

let skillsData = null;
let currentSkillsLang = 'en';

/**
 * تحميل بيانات المهارات من JSON
 */
async function loadSkillsData() {
  try {
    const response = await fetch('data/skills.json');
    if (!response.ok) throw new Error('Failed to load skills.json');
    const data = await response.json();
    skillsData = data.skills || [];
    return data;
  } catch (error) {
    console.error('Error loading skills:', error);
    return null;
  }
}

/**
 * إنشاء شريط المهارات المتحرك (marquee)
 */
function renderSkillsMarquee() {
  const container = document.getElementById('skills-container');
  if (!container || !skillsData) return;

  const isArabic = currentSkillsLang === 'ar';

  function buildItem(skill) {
    const name = isArabic ? (skill.nameAr || skill.name) : skill.name;
    const logo = skill.logo || '';
    return `
      <div class="skills-marquee-item">
        <img src="${logo}" alt="${name}" class="skill-logo" loading="lazy">
        <span>${name}</span>
      </div>
    `;
  }

  let itemsHtml = skillsData.map(s => buildItem(s)).join('');
  let itemsReversedHtml = skillsData.slice().reverse().map(s => buildItem(s)).join('');

  container.innerHTML = `
    <div class="skills-marquee">
      <div class="skills-marquee-track ltr">
        ${itemsHtml}${itemsHtml}
      </div>
      <div class="skills-marquee-track rtl">
        ${itemsReversedHtml}${itemsReversedHtml}
      </div>
    </div>
  `;

  // Staggered bubble pop animation for marquee items
  const interval = 120;
  const duration = 450;
  const totalSkills = skillsData.length; // 18

  // Pause tracks while items animate in
  const tracks = container.querySelectorAll('.skills-marquee-track');
  tracks.forEach(t => { t.style.animationPlayState = 'paused'; });

  // Pop items in sync across all 4 groups (LTR-orig, LTR-dupe, RTL-orig, RTL-dupe)
  const items = container.querySelectorAll('.skills-marquee-item');
  items.forEach((item, i) => {
    const delay = (i % totalSkills) * interval;
    setTimeout(() => item.classList.add('bubble-animate'), delay);
  });

  // Resume tracks after last item finishes animating
  const resumeAt = (totalSkills - 1) * interval + duration + 50;
  setTimeout(() => {
    tracks.forEach(t => { t.style.animationPlayState = 'running'; });
  }, resumeAt);
}

/**
 * عرض المهارات في الحاوية
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !skillsData) return;

  currentSkillsLang = window.DataLoader?.currentLanguage || localStorage.getItem('portfolio_language') || 'en';

  renderSkillsMarquee();
}

/**
 * تهيئة محمل المهارات
 */
async function initSkillsLoader() {
  await loadSkillsData();
  renderSkills();

  window.addEventListener('languageChanged', function() {
    renderSkills();
  });

  console.log('✅ Skills Loader initialized');
}
