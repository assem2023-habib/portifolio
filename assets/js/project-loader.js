/**
 * Project Details Loader
 * Handles dynamic content population for the project.html page based on URL parameters.
 * Updated for Bootstrap design
 */

// Function to get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to update projects list sidebar (Bento Style)
function updateProjectsList(activeProject) {
    const projectsList = document.getElementById('other-projects-list');
    if (projectsList && typeof portfolioData !== 'undefined') {
        projectsList.innerHTML = '';

        Object.keys(portfolioData).forEach(projectId => {
            const project = portfolioData[projectId];
            const li = document.createElement('li');
            li.className = 'mb-2';

            const isActive = projectId === activeProject;
            const activeClass = isActive ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'text-muted';
            const iconClass = isActive ? 'bi-dot-fill' : 'bi-circle';

            li.innerHTML = `
            <a href="project.html?project=${projectId}" class="d-flex align-items-center gap-3 p-2 rounded-2 text-decoration-none transition-colors ${activeClass}">
                <i class="bi ${iconClass} flex-shrink-0"></i>
                <div class="min-w-0">
                    <div class="fw-semibold" style="font-size: 0.875rem;">${project.title}</div>
                    <small class="text-muted d-block">${project.category}</small>
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

        // Update page title
        document.title = project.title + " - Assem Adel Habib";

        // Update all project title elements
        const projectTitleElements = document.querySelectorAll('.project-title');
        projectTitleElements.forEach(element => {
            element.textContent = project.title;
        });

        // Update project image with lazy loading
        const projectImage = document.querySelector('.project-image');
        if (projectImage) {
            projectImage.src = project.image || 'assets/img/portfolio-placeholder.jpg';
            projectImage.alt = project.title;
            projectImage.loading = 'lazy';
        }

        // Update project category and badges
        const categoryBadge = document.querySelector('#project-badges span');
        if (categoryBadge) {
            categoryBadge.textContent = project.category.charAt(0).toUpperCase() + project.category.slice(1);
        }

        // Update project description
        const projectDescription = document.querySelector('.project-description');
        if (projectDescription) {
            projectDescription.textContent = project.description || 'No description available.';
        }

        // Update project technologies
        const projectTechnologies = document.querySelector('.project-technologies');
        if (projectTechnologies) {
            projectTechnologies.textContent = project.technologies || 'Laravel, PHP, MySQL';
        }

        // Update project status
        const projectStatus = document.querySelector('.project-status');
        if (projectStatus) {
            projectStatus.textContent = project.status || 'Completed';
        }

        // Update project URL (Visit Project button)
        const projectUrl = document.querySelector('.project-url');
        if (projectUrl) {
            const url = project.repoUrl || project.url || '#';
            projectUrl.href = url;
            if (project.repoUrl) {
                projectUrl.innerHTML = '<i class="bi bi-code-slash"></i><span>View Code</span>';
            } else if (project.url) {
                projectUrl.innerHTML = '<i class="bi bi-box-arrow-up-right"></i><span>Visit Project</span>';
            } else {
                projectUrl.innerHTML = '<i class="bi bi-info-circle"></i><span>View Details</span>';
            }
        }

        // Update mobile download URL (APK)
        const mobileUrl = document.querySelector('.project-mobile-url');
        if (mobileUrl) {
            if (project.mobileUrl) {
                mobileUrl.href = project.mobileUrl;
                mobileUrl.style.display = 'flex';
                mobileUrl.innerHTML = '<i class="bi bi-download"></i><span>Download Mobile App</span>';
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
                desktopUrl.innerHTML = '<i class="bi bi-pc-display"></i><span>Download Desktop App</span>';
                console.log('Desktop URL added:', project.desktopUrl);
            } else {
                desktopUrl.style.display = 'none';
            }
        }

        // Update project features with proper icons
        const featuresContainer = document.getElementById('project-features');
        if (featuresContainer && project.features) {
            featuresContainer.innerHTML = '';

            // Icon mapping for features (Bootstrap Icons)
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

            project.features.forEach((feature) => {
                const featureDiv = document.createElement('div');
                featureDiv.className = 'col-md-6 col-lg-4';

                const iconName = featureIcons[feature.icon] || featureIcons.default;

                featureDiv.innerHTML = `
                    <div class="d-flex gap-3 align-items-start p-3 glass-card rounded-3 shadow-sm h-100">
                        <div class="feature-icon-box bg-primary bg-opacity-10">
                            <i class="bi ${iconName} text-primary"></i>
                        </div>
                        <div>
                            <small class="text-muted d-block lh-base">${feature.description || feature}</small>
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

            const projectImages = project.screenshots || project.galleryImages || [];

            if (projectImages.length > 0) {
                projectImages.forEach((imgSrc, index) => {
                    const imgDiv = document.createElement('div');
                    imgDiv.className = 'flex-shrink-0';

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `${project.title} - Screenshot ${index + 1}`;
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
                const projectDiv = document.createElement('a');
                projectDiv.href = `project.html?project=${pid}`;
                projectDiv.className = 'd-flex align-items-center p-3 glass-card rounded-3 text-decoration-none mb-2 transition-colors';

                projectDiv.innerHTML = `
                    <div class="d-flex align-items-center justify-content-center flex-shrink-0 me-3" style="width: 48px; height: 48px; border-radius: 0.5rem; background: var(--color-surface-container, #e9ecef);">
                        <i class="bi ${p.icon ? 'bi-' + p.icon : 'bi-code-slash'} text-muted"></i>
                    </div>
                    <div class="flex-grow-1 min-w-0">
                        <h6 class="fw-bold mb-0" style="font-size: 0.875rem;">${p.title}</h6>
                        <small class="text-muted d-block">${p.category}</small>
                    </div>
                    <i class="bi bi-chevron-right text-muted flex-shrink-0"></i>
                `;

                moreProjectsContainer.appendChild(projectDiv);
            });
        }

        // Update projects list sidebar
        updateProjectsList(projectId);

        console.log('Project loaded:', project.title);
    } else {
        console.log('No project data found, redirecting...');
        // Default to first project if no valid project ID
        if (typeof portfolioData !== 'undefined') {
            const firstProjectId = Object.keys(portfolioData)[0];
            window.location.href = `project.html?project=${firstProjectId}`;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateProjectDetails();
});
