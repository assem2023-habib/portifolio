/**
 * Project Details Loader
 * Populates project.html with dynamic data from projects.json.
 */

(function () {
    let portfolioData = {};

    function getURLParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    async function fetchProjectsData() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Failed to load projects.json');
            const data = await response.json();
            portfolioData = {};
            data.projects.forEach(project => {
                project.imageDark = project.image_dark || project.imageDark;
                project.thumbnailDark = project.thumbnail_dark || project.thumbnailDark;
                project.galleryImages = project.screenshots || project.galleryImages || [];
                portfolioData[project.id] = project;
            });
            console.log('✅ Projects loaded dynamically');
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    function translateCategory(cat) {
        const cats = { 'web': 'تطوير ويب', 'mobile': 'تطبيق هاتف', 'desktop': 'تطبيق سطح مكتب', 'backend': 'نظام خلفي (Backend)' };
        return cats[cat.toLowerCase()] || cat;
    }

    function translateStatus(status) {
        if (status && status.toLowerCase() === 'completed') return 'مكتمل';
        return status;
    }

    function getLang() {
        return localStorage.getItem('portfolio_language') || 'en';
    }

    function isAr() {
        return getLang() === 'ar';
    }

    function getHighlights(project) {
        const lang = getLang();
        const isArabic = lang === 'ar';
        const rawDuration = isArabic ? (project.durationAr || project.duration) : project.duration;
        const featCount = Array.isArray(project.features) ? project.features.length : 0;
        const screenCount = Array.isArray(project.screenshots) ? project.screenshots.length : 0;
        const status = isArabic
            ? translateStatus(project.status || 'Completed')
            : (project.status || 'Completed');

        const labels = {
            duration: { en: 'Duration', ar: 'المدة' },
            features: { en: 'Features', ar: 'المميزات' },
            screenshots: { en: 'Screenshots', ar: 'لقطات' },
            status: { en: 'Status', ar: 'الحالة' }
        };

        return [
            { icon: '📅', label: isArabic ? labels.duration.ar : labels.duration.en, value: rawDuration || '—' },
            { icon: '⚡', label: isArabic ? labels.features.ar : labels.features.en, value: `${featCount}` },
            { icon: '📸', label: isArabic ? labels.screenshots.ar : labels.screenshots.en, value: `${screenCount}` },
            { icon: '✅', label: isArabic ? labels.status.ar : labels.status.en, value: status }
        ];
    }

    function getHighlightsForStats(project) {
        const lang = getLang();
        const isArabic = lang === 'ar';
        const rawDuration = isArabic ? (project.durationAr || project.duration) : project.duration;

        const durationNum = rawDuration ? parseInt(rawDuration) : 0;
        const featCount = Array.isArray(project.features) ? project.features.length : 0;
        const screenCount = Array.isArray(project.screenshots) ? project.screenshots.length : 0;
        const statusText = isArabic
            ? translateStatus(project.status || 'Completed')
            : (project.status || 'Completed');

        const labels = {
            months: { en: 'Months Dev', ar: 'شهر تطوير' },
            features: { en: 'Features', ar: 'ميزة' },
            screenshots: { en: 'Screenshots', ar: 'لقطة' },
            status: { en: 'Status', ar: 'الحالة' }
        };

        return [
            { num: durationNum || '—', label: isArabic ? labels.months.ar : labels.months.en },
            { num: featCount, label: isArabic ? labels.features.ar : labels.features.en },
            { num: screenCount, label: isArabic ? labels.screenshots.ar : labels.screenshots.en },
            { num: '✓', label: statusText }
        ];
    }

    function populateStats(project) {
        const container = document.getElementById('stats-container');
        if (!container) return;
        const stats = getHighlightsForStats(project);
        container.innerHTML = stats.map((s, i) => `
            <div class="stat-item reveal" style="transition-delay:${i * 0.1}s">
                <div class="stat-num" ${typeof s.num === 'number' ? `data-count="${s.num}"` : ''}>${s.num}</div>
                <div class="stat-label">${s.label}</div>
            </div>
        `).join('');
    }

    function populateHero(project, isArabic, projectTitle, projectDesc, projectCategory, projectStatus) {
        // Category eyebrow
        const eyebrow = document.querySelector('.hero-eyebrow');
        if (eyebrow) eyebrow.textContent = projectCategory;

        // Nav tag
        const navTag = document.querySelector('.project-category');
        if (navTag) navTag.textContent = projectCategory;

        // Title
        const titles = document.querySelectorAll('.project-title');
        titles.forEach(el => { el.textContent = projectTitle; });

        // Description
        const desc = document.querySelector('.project-description');
        if (desc) desc.textContent = projectDesc || '';

        // Hero image - theme-aware (phone mockup)
        const heroImg = document.querySelector('.phone-project-img');
        if (heroImg) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const lightImg = project.image || 'assets/img/portfolio-placeholder.jpg';
            const darkImg = project.imageDark || lightImg;
            heroImg.src = isDarkMode ? darkImg : lightImg;
            heroImg.alt = projectTitle;
        }

        // Phone mockup header
        const phoneName = document.querySelector('.phone-project-name');
        if (phoneName) phoneName.textContent = projectTitle;

        // Status dot + label
        const statusDot = document.querySelector('.phone-status-dot');
        const statusLabel = document.querySelector('.phone-status-label');
        const activeStatus = projectStatus || (isArabic ? 'نشط' : 'Active');
        const statusColor = projectStatus && projectStatus.toLowerCase() === 'completed'
            ? 'var(--accent-color)'
            : 'var(--accent-color)';
        if (statusDot) statusDot.style.background = statusColor;
        if (statusLabel) statusLabel.textContent = activeStatus;

        // Categories chips
        const catContainer = document.getElementById('phoneCategories');
        if (catContainer && project.category) {
            const chips = project.category.split(',').map(c => c.trim());
            catContainer.innerHTML = chips.map(c =>
                `<span class="phone-cat-chip">${c}</span>`
            ).join('');
        }

        // Floating badges
        const badgeCategory = document.getElementById('badgeCategory');
        const badgeStatus = document.getElementById('badgeStatus');
        if (badgeCategory) {
            badgeCategory.querySelector('.badge-text').textContent = projectCategory || project.category;
        }
        if (badgeStatus) {
            badgeStatus.querySelector('.badge-text').textContent = activeStatus;
        }

        // Page title
        document.title = projectTitle + ' - Assem Adel Habib';
    }

    function populateButtons(project, isArabic) {
        // Primary button (repo or URL)
        const btns = document.querySelectorAll('.project-url');
        btns.forEach(btn => {
            const url = project.repoUrl || project.url || '#';
            btn.href = url;
            if (project.repoUrl) {
                btn.innerHTML = `<i class="bi bi-code-slash"></i><span>${isArabic ? 'عرض الكود' : 'View Code'}</span>`;
            } else if (project.url && project.url !== '#') {
                btn.innerHTML = `<i class="bi bi-box-arrow-up-right"></i><span>${isArabic ? 'زيارة المشروع' : 'Visit Project'}</span>`;
            } else {
                btn.innerHTML = `<i class="bi bi-info-circle"></i><span>${isArabic ? 'عرض التفاصيل' : 'View Details'}</span>`;
            }
        });

        // Mobile button
        const mobileBtns = document.querySelectorAll('.project-mobile-url');
        mobileBtns.forEach(btn => {
            if (project.mobileUrl) {
                btn.href = project.mobileUrl;
                btn.style.display = 'flex';
                btn.innerHTML = `<i class="bi bi-download"></i><span>${isArabic ? 'تحميل تطبيق الهاتف' : 'Download Mobile App'}</span>`;
            } else {
                btn.style.display = 'none';
            }
        });

        // Desktop button
        const desktopBtns = document.querySelectorAll('.project-desktop-url');
        desktopBtns.forEach(btn => {
            if (project.desktopUrl) {
                btn.href = project.desktopUrl;
                btn.style.display = 'flex';
                btn.innerHTML = `<i class="bi bi-pc-display"></i><span>${isArabic ? 'تحميل تطبيق سطح المكتب' : 'Download Desktop App'}</span>`;
            } else {
                btn.style.display = 'none';
            }
        });
    }

    function populateInfoCard(project, isArabic) {
        const container = document.getElementById('info-rows');
        if (!container) return;

        const categoryLabel = isArabic ? 'التصنيف' : 'Category';
        const techLabel = isArabic ? 'التقنيات' : 'Technologies';
        const statusLabel = isArabic ? 'الحالة' : 'Status';
        const clientLabel = isArabic ? 'العميل' : 'Client';
        const roleLabel = isArabic ? 'الدور' : 'Role';
        const durationLabel = isArabic ? 'المدة' : 'Duration';

        const projectCategory = isArabic
            ? translateCategory(project.category)
            : project.category;
        const projectStatus = isArabic
            ? translateStatus(project.status || 'Completed')
            : (project.status || 'Completed');
        const clientVal = isArabic ? (project.clientAr || project.client) : project.client;
        const roleVal = isArabic ? (project.roleAr || project.role) : project.role;
        const durationVal = isArabic ? (project.durationAr || project.duration) : project.duration;

        const techStr = Array.isArray(project.technologies)
            ? project.technologies.join(', ')
            : (project.technologies || '');

        // Category
        container.innerHTML = `
            <div class="info-row">
                <div class="info-icon"><i class="bi bi-grid"></i></div>
                <div>
                    <div class="info-row-label">${categoryLabel}</div>
                    <div class="info-row-value">${projectCategory}</div>
                </div>
            </div>
            <div class="info-row">
                <div class="info-icon"><i class="bi bi-code-slash"></i></div>
                <div>
                    <div class="info-row-label">${techLabel}</div>
                    <div class="info-row-value" style="font-weight:400;font-size:12px">${techStr}</div>
                </div>
            </div>
            <div class="info-row">
                <div class="info-icon"><i class="bi bi-check-circle"></i></div>
                <div>
                    <div class="info-row-label">${statusLabel}</div>
                    <div style="margin-top:0.3rem">
                        <span class="status-badge"><span class="status-dot"></span>${projectStatus}</span>
                    </div>
                </div>
            </div>
        `;

        // Optional: Client
        if (clientVal) {
            container.insertAdjacentHTML('beforeend', `
                <div class="info-row">
                    <div class="info-icon"><i class="bi bi-building"></i></div>
                    <div>
                        <div class="info-row-label">${clientLabel}</div>
                        <div class="info-row-value">${clientVal}</div>
                    </div>
                </div>
            `);
        }

        // Optional: Role
        if (roleVal) {
            container.insertAdjacentHTML('beforeend', `
                <div class="info-row">
                    <div class="info-icon"><i class="bi bi-briefcase"></i></div>
                    <div>
                        <div class="info-row-label">${roleLabel}</div>
                        <div class="info-row-value">${roleVal}</div>
                    </div>
                </div>
            `);
        }

        // Optional: Duration
        if (durationVal) {
            container.insertAdjacentHTML('beforeend', `
                <div class="info-row">
                    <div class="info-icon"><i class="bi bi-calendar3"></i></div>
                    <div>
                        <div class="info-row-label">${durationLabel}</div>
                        <div class="info-row-value">${durationVal}</div>
                    </div>
                </div>
            `);
        }

        // Header
        const header = document.getElementById('info-card-header');
        if (header) header.textContent = isArabic ? 'معلومات المشروع' : 'Project Information';
    }

    function populateOverview(project, isArabic, projectDesc) {
        const fullDesc = document.querySelector('.project-description-full');
        if (fullDesc) {
            fullDesc.textContent = projectDesc || '';
        }

        // Eyebrow
        const eyebrow = document.getElementById('overview-eyebrow');
        if (eyebrow) eyebrow.textContent = isArabic ? 'نظرة عامة' : 'Overview';

        // Highlights
        const container = document.getElementById('highlights-container');
        if (!container) return;
        const highlights = getHighlights(project);
        container.innerHTML = highlights.map(h => `
            <div class="highlight-item">
                <div class="highlight-icon">${h.icon}</div>
                <div class="highlight-label">${h.label}</div>
                <div class="highlight-value">${h.value}</div>
            </div>
        `).join('');
    }

    function populateFeatures(project, isArabic) {
        const container = document.getElementById('project-features');
        if (!container) return;

        const features = isArabic ? (project.featuresAr || project.features) : project.features;
        if (!features || features.length === 0) {
            container.innerHTML = '<p class="text-muted">No features listed.</p>';
            return;
        }

        container.innerHTML = '';
        const featureIcons = ['🛒', '📦', '💰', '👥', '🔔', '📄', '⏰', '💱', '🔒', '📊', '⚡', '🎯', '🛡️', '🔗', '📱', '🖥️'];
        const featureGradients = [
            'rgba(79,142,247,0.1)', 'rgba(0,212,170,0.1)', 'rgba(245,166,35,0.1)',
            'rgba(108,99,255,0.1)', 'rgba(255,87,87,0.1)', 'rgba(0,212,170,0.1)',
            'rgba(79,142,247,0.1)', 'rgba(245,166,35,0.1)', 'rgba(108,99,255,0.1)',
            'rgba(0,212,170,0.1)', 'rgba(79,142,247,0.1)', 'rgba(245,166,35,0.1)',
            'rgba(255,87,87,0.1)', 'rgba(108,99,255,0.1)', 'rgba(0,212,170,0.1)', 'rgba(79,142,247,0.1)'
        ];

        features.forEach((feature, i) => {
            const desc = feature.description || feature;
            const icon = featureIcons[i % featureIcons.length];
            const bg = featureGradients[i % featureGradients.length];
            const delay = Math.min(i * 0.07, 2);

            const card = document.createElement('div');
            card.className = 'feature-card';
            card.style.transitionDelay = delay + 's';
            card.innerHTML = `
                <div class="feature-num">${String(i + 1).padStart(2, '0')}</div>
                <div class="feature-icon-wrap" style="background:${bg}">${icon}</div>
                <div class="feature-title">${desc}</div>
                <div class="feature-line"></div>
            `;
            container.appendChild(card);

            // Observe with staggered delay
            setTimeout(() => {
                const fcObs = new IntersectionObserver((entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            setTimeout(() => {
                                e.target.classList.add('visible');
                            }, parseFloat(e.target.style.transitionDelay) * 1000 || 0);
                            fcObs.unobserve(e.target);
                        }
                    });
                }, { threshold: 0.05 });
                fcObs.observe(card);
            }, 50);
        });
    }

    function populateGallery(project, isArabic, projectTitle) {
        const track = document.getElementById('galleryTrack');
        if (!track) return;

        const images = project.galleryImages || [];
        track.innerHTML = '';

        if (images.length > 0) {
            images.forEach((src, i) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.index = i;
                const img = document.createElement('img');
                img.src = src;
                img.alt = `${projectTitle} - ${i + 1}`;
                img.loading = 'lazy';
                item.appendChild(img);
                track.appendChild(item);
            });
        } else {
            track.innerHTML = `
                <div class="gallery-item">
                    <div class="gallery-item-placeholder" style="background:linear-gradient(135deg,rgba(79,142,247,0.1),rgba(108,99,255,0.08));gap:1rem">
                        <div style="font-size:2rem">📱</div>
                        <div>${isArabic ? 'لا توجد لقطات' : 'No screenshots available'}</div>
                    </div>
                </div>
            `;
        }
    }

    function populateChallenges(project, isArabic) {
        const el = document.querySelector('.project-challenges');
        if (!el) return;

        const challenges = isArabic ? (project.challengesAr || project.challenges) : project.challenges;
        if (challenges) {
            el.textContent = challenges;
        } else {
            el.textContent = isArabic
                ? 'لا تتوفر تفاصيل إضافية لهذا المشروع حالياً.'
                : 'No additional details are currently available for this project.';
        }
    }

    function updateStaticLabels(isArabic) {
        // Nav breadcrumbs
        const breadLinks = document.querySelectorAll('.nav-bread a');
        if (breadLinks.length >= 2) {
            breadLinks[0].textContent = isArabic ? 'الرئيسية' : 'Home';
            breadLinks[1].textContent = isArabic ? 'المعرض' : 'Portfolio';
        }

        // Section headers
        const sectionEyebrows = document.querySelectorAll('.section-eyebrow');
        sectionEyebrows.forEach(el => {
            const text = el.textContent.trim();
            if (isArabic) {
                if (text === 'Overview') el.textContent = 'نظرة عامة';
                else if (text === 'Features') el.textContent = 'المميزات';
                else if (text === 'Gallery') el.textContent = 'المعرض';
                else if (text === 'Details') el.textContent = 'التفاصيل';
            } else {
                if (text === 'نظرة عامة') el.textContent = 'Overview';
                else if (text === 'المميزات') el.textContent = 'Features';
                else if (text === 'المعرض') el.textContent = 'Gallery';
                else if (text === 'التفاصيل') el.textContent = 'Details';
            }
        });

        // Section titles
        const sectionTitles = document.querySelectorAll('h2.section-title');
        sectionTitles.forEach(el => {
            const text = el.textContent.trim();
            if (isArabic) {
                if (text === 'Key Features') el.textContent = 'المميزات الرئيسية';
                else if (text === 'Project Screenshots') el.textContent = 'لقطات المشروع';
                else if (text === 'Project Details') el.textContent = 'تفاصيل المشروع';
            } else {
                if (text === 'المميزات الرئيسية') el.textContent = 'Key Features';
                else if (text === 'لقطات المشروع') el.textContent = 'Project Screenshots';
                else if (text === 'تفاصيل المشروع') el.textContent = 'Project Details';
            }
        });

        // Gallery hint
        const hint = document.querySelector('.gallery-scroll-hint span:first-child');
        if (hint) {
            hint.textContent = isArabic ? 'اسحب للتصفح' : 'Drag to browse';
        }
    }

    function initScrollReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    }

    function initGalleryDrag() {
        const track = document.getElementById('galleryTrack');
        if (!track) return;

        let isDown = false, startX, scrollLeft;

        track.addEventListener('mousedown', e => {
            isDown = true;
            track.classList.add('grabbing');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.classList.remove('grabbing');
        });
        track.addEventListener('mouseup', () => {
            isDown = false;
            track.classList.remove('grabbing');
        });
        track.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            track.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });

        // Arrow buttons
        const prev = document.getElementById('gallPrev');
        const next = document.getElementById('gallNext');
        if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -290, behavior: 'smooth' }));
        if (next) next.addEventListener('click', () => track.scrollBy({ left: 290, behavior: 'smooth' }));
    }

    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-num[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const target = +e.target.dataset.count;
                if (!target || target <= 0) return;
                let current = 0;
                const inc = target / 30;
                const timer = setInterval(() => {
                    current = Math.min(current + inc, target);
                    e.target.textContent = Math.round(current);
                    if (current >= target) clearInterval(timer);
                }, 40);
                observer.unobserve(e.target);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    function initGalleryLightbox() {
        const lightbox = document.getElementById('galleryLightbox');
        const overlay = document.getElementById('lightboxOverlay');
        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');
        const imgEl = document.getElementById('lightboxImg');
        const counter = document.getElementById('lightboxCounter');
        const track = document.getElementById('galleryTrack');
        if (!lightbox || !track) return;

        let currentIndex = 0;
        const items = () => track.querySelectorAll('.gallery-item img');

        function open(index) {
            const imgs = items();
            if (!imgs[index]) return;
            currentIndex = index;
            imgEl.src = imgs[index].src;
            imgEl.alt = imgs[index].alt;
            counter.textContent = `${index + 1} / ${imgs.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function prev() {
            const imgs = items();
            currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
            open(currentIndex);
        }

        function next() {
            const imgs = items();
            currentIndex = (currentIndex + 1) % imgs.length;
            open(currentIndex);
        }

        track.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;
            const idx = parseInt(item.dataset.index);
            if (!isNaN(idx)) open(idx);
        });

        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', close);
        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
    }

    function initNavScroll() {
        const nav = document.getElementById('project-nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            const isDark = document.body.classList.contains('dark-mode');
            if (window.scrollY > 50) {
                nav.style.background = isDark ? 'rgba(26,26,46,0.95)' : 'rgba(255,255,255,0.95)';
            } else {
                nav.style.background = isDark ? 'rgba(26,26,46,0.7)' : 'rgba(255,255,255,0.7)';
            }
        });
    }

    function updateProjectDetails() {
        const projectId = getURLParameter('project');
        if (!projectId || !portfolioData[projectId]) {
            console.log('No project found, redirecting...');
            const firstId = Object.keys(portfolioData)[0];
            if (firstId) window.location.href = `project.html?project=${firstId}`;
            return;
        }

        const project = portfolioData[projectId];
        const lang = getLang();
        const arabic = lang === 'ar';

        const projectTitle = arabic ? (project.titleAr || project.title) : project.title;
        const projectDesc = arabic ? (project.descriptionAr || project.description) : project.description;
        const projectCategory = arabic ? translateCategory(project.category) : project.category;

        // 1. Hero
        populateHero(project, arabic, projectTitle, projectDesc, projectCategory, project.status);

        // 2. Buttons
        populateButtons(project, arabic);

        // 3. Stats
        populateStats(project);

        // 4. Info card
        populateInfoCard(project, arabic);

        // 5. Overview
        populateOverview(project, arabic, projectDesc);

        // 6. Features
        populateFeatures(project, arabic);

        // 7. Gallery
        populateGallery(project, arabic, projectTitle);

        // 8. Challenges
        populateChallenges(project, arabic);

        // 9. Static labels
        updateStaticLabels(arabic);

        // 10. Init interactions
        requestAnimationFrame(() => {
            initScrollReveal();
            initGalleryDrag();
            initGalleryLightbox();
            initCounterAnimation();
            initNavScroll();
        });

        console.log('✅ Project loaded:', projectTitle);
    }

    document.addEventListener('DOMContentLoaded', async () => {
        await fetchProjectsData();
        updateProjectDetails();
    });
})();
