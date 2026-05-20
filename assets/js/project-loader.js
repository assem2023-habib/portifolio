/**
 * Project Details Loader
 * Handles dynamic content population for the project.html page based on URL parameters.
 * Updated to fetch data dynamically from projects.json and support full localization.
 * Wrapped in an IIFE to avoid global scope identifier conflicts.
 */

(function () {
    let portfolioData = {};

    // Function to get URL parameter
    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to fetch projects data dynamically
    async function fetchProjectsData() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Failed to load projects.json');
            const data = await response.json();
            portfolioData = {};
            data.projects.forEach(project => {
                // Map snake_case to camelCase where necessary for backward compatibility
                project.imageDark = project.image_dark || project.imageDark;
                project.thumbnailDark = project.thumbnail_dark || project.thumbnailDark;
                project.galleryImages = project.screenshots || project.galleryImages || [];
                
                portfolioData[project.id] = project;
            });
            console.log('✅ Projects loaded dynamically into portfolioData');
        } catch (error) {
            console.error('Error loading projects dynamically:', error);
        }
    }

    // Translation helpers
    function translateCategory(cat) {
        const cats = {
            'web': 'تطوير ويب',
            'mobile': 'تطبيق هاتف',
            'desktop': 'تطبيق سطح مكتب',
            'backend': 'نظام خلفي (Backend)'
        };
        return cats[cat.toLowerCase()] || cat;
    }

    // Status translation helper
    function translateStatus(status) {
        if (status && status.toLowerCase() === 'completed') return 'مكتمل';
        return status;
    }

    // Translate static UI labels based on language
    function translateStaticLabels(isAr) {
        // Translate Page title breadcrumbs
        const breadcrumbs = document.querySelectorAll('.breadcrumbs ol li a');
        if (breadcrumbs.length >= 2) {
            breadcrumbs[0].textContent = isAr ? 'الرئيسية' : 'Home';
            breadcrumbs[1].textContent = isAr ? 'المعرض' : 'Portfolio';
        }

        // Info header
        const infoHeader = document.querySelector('.glass-card h4');
        if (infoHeader) {
            infoHeader.textContent = isAr ? 'معلومات المشروع' : 'Project Information';
        }

        // Small labels in Project Information
        const smallLabels = document.querySelectorAll('.glass-card small.text-muted');
        smallLabels.forEach(label => {
            const text = label.textContent.trim();
            if (isAr) {
                if (text === 'Category') label.textContent = 'التصنيف';
                else if (text === 'Technologies') label.textContent = 'التقنيات';
                else if (text === 'Status') label.textContent = 'الحالة';
                else if (text === 'Client') label.textContent = 'العميل';
                else if (text === 'Role') label.textContent = 'الدور';
                else if (text === 'Duration') label.textContent = 'المدة';
            } else {
                if (text === 'التصنيف') label.textContent = 'Category';
                else if (text === 'التقنيات') label.textContent = 'Technologies';
                else if (text === 'الحالة') label.textContent = 'Status';
                else if (text === 'العميل') label.textContent = 'Client';
                else if (text === 'الدور') label.textContent = 'Role';
                else if (text === 'المدة') label.textContent = 'Duration';
            }
        });

        // Overview, Features, Gallery, Project Details section headers
        const h2Elements = document.querySelectorAll('main h2');
        h2Elements.forEach(h2 => {
            const text = h2.textContent.trim();
            if (isAr) {
                if (text === 'Overview') h2.textContent = 'نظرة عامة';
                else if (text === 'Key Features') h2.textContent = 'المميزات الرئيسية';
                else if (text === 'Gallery') h2.textContent = 'معرض الصور';
                else if (text === 'Project Details') h2.textContent = 'التحديات والحلول';
            } else {
                if (text === 'نظرة عامة') h2.textContent = 'Overview';
                else if (text === 'المميزات الرئيسية') h2.textContent = 'Key Features';
                else if (text === 'معرض الصور') h2.textContent = 'Gallery';
                else if (text === 'التحديات والحلول') h2.textContent = 'Project Details';
            }
        });

        // Scroll for more text
        const scrollText = document.querySelector('small.text-primary.fw-medium');
        if (scrollText) {
            if (isAr) {
                if (scrollText.textContent.includes('Scroll')) scrollText.textContent = 'اسحب للمزيد';
            } else {
                if (scrollText.textContent.includes('اسحب')) scrollText.textContent = 'Scroll for more';
            }
        }
    }

    // Dynamic info list items injector
    function insertInfoItem(label, value, iconClass, referenceElement) {
        const id = `project-info-${label.toLowerCase().replace(/\s+/g, '-')}`;
        let item = document.getElementById(id);
        if (!item) {
            item = document.createElement('div');
            item.id = id;
            item.className = 'd-flex align-items-center gap-3 p-2 rounded-2 mb-2';
            item.style.transition = 'background 0.2s';
            referenceElement.parentNode.insertBefore(item, referenceElement);
        }
        
        item.innerHTML = `
            <span class="text-primary icon-container flex-shrink-0"><i class="bi ${iconClass}"></i></span>
            <div>
                <small class="text-muted d-block">${label}</small>
                <strong class="info-value">${value}</strong>
            </div>
        `;
        item.style.display = 'flex';
    }

    // Remove dynamic info list items helper
    function removeInfoItem(label) {
        const id = `project-info-${label.toLowerCase().replace(/\s+/g, '-')}`;
        const item = document.getElementById(id);
        if (item) {
            item.remove();
        }
    }

    // Function to update projects list sidebar (Bento Style)
    function updateProjectsList(activeProject) {
        const projectsList = document.getElementById('other-projects-list');
        if (projectsList && typeof portfolioData !== 'undefined') {
            projectsList.innerHTML = '';
            const lang = localStorage.getItem('portfolio_language') || 'en';
            const isAr = lang === 'ar';

            Object.keys(portfolioData).forEach(projectId => {
                const project = portfolioData[projectId];
                const li = document.createElement('li');
                li.className = 'mb-2';

                const isActive = projectId === activeProject;
                const activeClass = isActive ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'text-muted';
                const iconClass = isActive ? 'bi-dot-fill' : 'bi-circle';
                const pTitle = isAr ? (project.titleAr || project.title) : project.title;
                const pCategory = isAr ? translateCategory(project.category) : project.category;

                li.innerHTML = `
                <a href="project.html?project=${projectId}" class="d-flex align-items-center gap-3 p-2 rounded-2 text-decoration-none transition-colors ${activeClass}">
                    <i class="bi ${iconClass} flex-shrink-0"></i>
                    <div class="min-w-0">
                        <div class="fw-semibold" style="font-size: 0.875rem;">${pTitle}</div>
                        <small class="text-muted d-block">${pCategory}</small>
                    </div>
                </a>
                `;
                projectsList.appendChild(li);
            });
        }
    }

    // Function to update project details
    function updateProjectDetails() {
        const projectId = getURLParameter('project');

        if (projectId && typeof portfolioData !== 'undefined' && portfolioData[projectId]) {
            const project = portfolioData[projectId];
            const lang = localStorage.getItem('portfolio_language') || 'en';
            const isAr = lang === 'ar';

            // 1. Translated details
            const projectTitle = isAr ? (project.titleAr || project.title) : project.title;
            const projectDesc = isAr ? (project.descriptionAr || project.description) : project.description;
            const projectCategory = isAr ? translateCategory(project.category) : project.category;
            const projectFeatures = isAr ? (project.featuresAr || project.features) : project.features;
            const projectChallenges = isAr ? (project.challengesAr || project.challenges) : project.challenges;
            const projectStatus = isAr ? translateStatus(project.status || 'Completed') : (project.status || 'Completed');
            const projectTechnologiesStr = Array.isArray(project.technologies) 
                ? project.technologies.join(', ') 
                : (project.technologies || 'Laravel, PHP, MySQL');

            // Update page title
            document.title = projectTitle + " - Assem Adel Habib";

            // Update all project title elements
            const projectTitleElements = document.querySelectorAll('.project-title');
            projectTitleElements.forEach(element => {
                element.textContent = projectTitle;
            });

            // Update project image with lazy loading (Theme-aware)
            const projectImage = document.querySelector('.project-image');
            if (projectImage) {
                const isDarkMode = document.body.classList.contains('dark-mode');
                const lightImg = project.image || 'assets/img/portfolio-placeholder.jpg';
                const darkImg = project.imageDark || lightImg;
                
                projectImage.src = isDarkMode ? darkImg : lightImg;
                projectImage.alt = projectTitle;
                projectImage.loading = 'lazy';
            }

            // Update project category and badges
            const categoryBadge = document.querySelector('#project-badges span');
            if (categoryBadge) {
                categoryBadge.textContent = projectCategory.charAt(0).toUpperCase() + projectCategory.slice(1);
            }

            // Update project description
            const projectDescription = document.querySelector('.project-description');
            if (projectDescription) {
                projectDescription.textContent = projectDesc || 'No description available.';
            }

            // Update project technologies
            const projectTechnologies = document.querySelector('.project-technologies');
            if (projectTechnologies) {
                projectTechnologies.textContent = projectTechnologiesStr;
            }

            // Update project status
            const projectStatusEl = document.querySelector('.project-status');
            if (projectStatusEl) {
                projectStatusEl.textContent = projectStatus;
            }

            // 2. Translate Static Labels on the page
            translateStaticLabels(isAr);

            // 3. Inject dynamic info items: Client, Role, Duration
            const statusContainer = document.querySelector('.project-status').closest('.d-flex');
            if (statusContainer) {
                // Client
                const clientVal = isAr ? (project.clientAr || project.client) : project.client;
                if (clientVal) {
                    insertInfoItem(isAr ? 'العميل' : 'Client', clientVal, 'bi-building', statusContainer);
                } else {
                    removeInfoItem('Client');
                }

                // Role
                const roleVal = isAr ? (project.roleAr || project.role) : project.role;
                if (roleVal) {
                    insertInfoItem(isAr ? 'الدور' : 'Role', roleVal, 'bi-briefcase', statusContainer);
                } else {
                    removeInfoItem('Role');
                }

                // Duration
                const durationVal = isAr ? (project.durationAr || project.duration) : project.duration;
                if (durationVal) {
                    insertInfoItem(isAr ? 'المدة' : 'Duration', durationVal, 'bi-calendar3', statusContainer);
                } else {
                    removeInfoItem('Duration');
                }
            }

            // 4. Update project details / challenges section
            const detailsContainer = document.querySelector('main section.mt-5:last-of-type p');
            if (detailsContainer) {
                if (projectChallenges) {
                    detailsContainer.textContent = projectChallenges;
                } else {
                    detailsContainer.textContent = isAr 
                        ? 'لا تتوفر تفاصيل إضافية لهذا المشروع حالياً.' 
                        : 'No additional details are currently available for this project.';
                }
            }

            // 5. Update project URL (Visit Project button / View Code button)
            const projectUrl = document.querySelector('.project-url');
            if (projectUrl) {
                const url = project.repoUrl || project.url || '#';
                projectUrl.href = url;
                if (project.repoUrl) {
                    projectUrl.innerHTML = `<i class="bi bi-code-slash"></i><span>${isAr ? 'عرض الكود' : 'View Code'}</span>`;
                } else if (project.url && project.url !== '#') {
                    projectUrl.innerHTML = `<i class="bi bi-box-arrow-up-right"></i><span>${isAr ? 'زيارة المشروع' : 'Visit Project'}</span>`;
                } else {
                    projectUrl.innerHTML = `<i class="bi bi-info-circle"></i><span>${isAr ? 'عرض التفاصيل' : 'View Details'}</span>`;
                }
            }

            // Update mobile download URL (APK)
            const mobileUrl = document.querySelector('.project-mobile-url');
            if (mobileUrl) {
                if (project.mobileUrl) {
                    mobileUrl.href = project.mobileUrl;
                    mobileUrl.style.display = 'flex';
                    mobileUrl.innerHTML = `<i class="bi bi-download"></i><span>${isAr ? 'تحميل تطبيق الهاتف' : 'Download Mobile App'}</span>`;
                    console.log('Mobile URL added:', project.mobileUrl);
                } else {
                    mobileUrl.style.display = 'none';
                }
            }

            // Update desktop download URL
            const desktopUrl = document.querySelector('.project-desktop-url');
            if (desktopUrl) {
                if (project.desktopUrl) {
                    desktopUrl.href = project.desktopUrl;
                    desktopUrl.style.display = 'flex';
                    desktopUrl.innerHTML = `<i class="bi bi-pc-display"></i><span>${isAr ? 'تحميل تطبيق سطح المكتب' : 'Download Desktop App'}</span>`;
                    console.log('Desktop URL added:', project.desktopUrl);
                } else {
                    desktopUrl.style.display = 'none';
                }
            }

            // Update project features
            const featuresContainer = document.getElementById('project-features');
            if (featuresContainer && projectFeatures) {
                featuresContainer.innerHTML = '';

                const featureIcons = {
                    'translate': 'bi-translate',
                    'language': 'bi-translate',
                    'settings': 'bi-gear',
                    'dashboard': 'bi-speedometer2',
                    'security': 'bi-shield-check',
                    'analytics': 'bi-graph-up-arrow',
                    'payment': 'bi-credit-card',
                    'search': 'bi-search',
                    'default': 'bi-check-circle'
                };

                projectFeatures.forEach((feature) => {
                    const featureDiv = document.createElement('div');
                    featureDiv.className = 'col-md-6 col-lg-4';

                    const desc = feature.description || feature;
                    const iconName = featureIcons[feature.icon] || featureIcons.default;

                    featureDiv.innerHTML = `
                        <div class="d-flex gap-3 align-items-start p-3 glass-card rounded-3 shadow-sm h-100">
                            <div class="feature-icon-box bg-primary bg-opacity-10">
                                <i class="bi ${iconName} text-primary"></i>
                            </div>
                            <div>
                                <small class="text-muted d-block lh-base">${desc}</small>
                            </div>
                        </div>
                    `;
                    featuresContainer.appendChild(featureDiv);
                });
            }

            // Update project gallery images with lazy loading
            const galleryContainer = document.getElementById('project-gallery');
            if (galleryContainer) {
                galleryContainer.innerHTML = '';

                const projectImages = project.galleryImages || [];

                if (projectImages.length > 0) {
                    projectImages.forEach((imgSrc, index) => {
                        const imgDiv = document.createElement('div');
                        imgDiv.className = 'flex-shrink-0';

                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = `${projectTitle} - Screenshot ${index + 1}`;
                        img.className = 'project-gallery-img shadow-sm border';
                        img.loading = 'lazy';

                        imgDiv.appendChild(img);
                        galleryContainer.appendChild(imgDiv);
                    });
                } else {
                    // Add placeholder if no images
                    const placeholderDiv = document.createElement('div');
                    placeholderDiv.className = 'flex-shrink-0 d-flex align-items-center justify-content-center';
                    placeholderDiv.style.cssText = 'width: 18rem; height: 12rem; background: var(--color-surface-container, #e9ecef); border-radius: 0.75rem;';
                    placeholderDiv.innerHTML = '<i class="bi bi-image text-muted" style="font-size: 2.5rem;"></i>';
                    galleryContainer.appendChild(placeholderDiv);
                }
            }

            // Update "More Projects" section
            const moreProjectsContainer = document.getElementById('more-projects');
            if (moreProjectsContainer && typeof portfolioData !== 'undefined') {
                moreProjectsContainer.innerHTML = '';

                Object.keys(portfolioData).forEach(pid => {
                    if (pid === projectId) return; // Skip current project

                    const p = portfolioData[pid];
                    const pTitle = isAr ? (p.titleAr || p.title) : p.title;
                    const pCategory = isAr ? translateCategory(p.category) : p.category;

                    const projectDiv = document.createElement('a');
                    projectDiv.href = `project.html?project=${pid}`;
                    projectDiv.className = 'd-flex align-items-center p-3 glass-card rounded-3 text-decoration-none mb-2 transition-colors';

                    projectDiv.innerHTML = `
                        <div class="d-flex align-items-center justify-content-center flex-shrink-0 me-3" style="width: 48px; height: 48px; border-radius: 0.5rem; background: var(--color-surface-container, #e9ecef);">
                            <i class="bi ${p.icon ? 'bi-' + p.icon : 'bi-code-slash'} text-muted"></i>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <h6 class="fw-bold mb-0" style="font-size: 0.875rem;">${pTitle}</h6>
                            <small class="text-muted d-block">${pCategory}</small>
                        </div>
                        <i class="bi bi-chevron-right text-muted flex-shrink-0"></i>
                    `;

                    moreProjectsContainer.appendChild(projectDiv);
                });
            }

            // Update projects list sidebar
            updateProjectsList(projectId);

            console.log('Project loaded:', projectTitle);
        } else {
            console.log('No project data found, redirecting...');
            // Default to first project if no valid project ID
            if (typeof portfolioData !== 'undefined') {
                const firstProjectId = Object.keys(portfolioData)[0];
                if (firstProjectId) {
                    window.location.href = `project.html?project=${firstProjectId}`;
                }
            }
        }
    }

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', async () => {
        await fetchProjectsData();
        updateProjectDetails();
    });
})();
