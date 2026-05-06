/**
 * Project Details Loader
 * Handles dynamic content population for the project.html page based on URL parameters.
 * Updated for Bento Grid + Tailwind CSS design with icon fixes
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
            li.className = `mb-xs`;
            
            const isActive = projectId === activeProject;
            li.innerHTML = `
            <a href="project.html?project=${projectId}" class="flex items-center gap-md p-sm rounded-lg transition-all hover:bg-primary-container/20 ${isActive ? 'bg-primary-container/30 text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}">
                <span class="material-symbols-outlined text-sm">${isActive ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                <div>
                    <div class="font-label-md text-label-md">${project.title}</div>
                    <span class="font-body-sm text-body-sm text-on-surface-variant">${project.category}</span>
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
                projectUrl.innerHTML = '<span class="material-symbols-outlined">code</span><span>View Code</span>';
            } else if (project.url) {
                projectUrl.innerHTML = '<span class="material-symbols-outlined">open_in_new</span><span>Visit Project</span>';
            } else {
                projectUrl.innerHTML = '<span class="material-symbols-outlined">info</span><span>View Details</span>';
            }
        }

        // Update mobile download URL (APK)
        const mobileUrl = document.querySelector('.project-mobile-url');
        if (mobileUrl) {
            if (project.mobileUrl) {
                mobileUrl.href = project.mobileUrl;
                mobileUrl.style.display = 'flex';
                mobileUrl.innerHTML = '<span class="material-symbols-outlined">download</span><span>Download Mobile App</span>';
                console.log('📱 Mobile URL added:', project.mobileUrl);
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
                desktopUrl.innerHTML = '<span class="material-symbols-outlined">computer</span><span>Download Desktop App</span>';
                console.log('💻 Desktop URL added:', project.desktopUrl);
            } else {
                desktopUrl.style.display = 'none';
            }
        }

        // Update project features with proper icons
        const featuresContainer = document.getElementById('project-features');
        if (featuresContainer && project.features) {
            featuresContainer.innerHTML = '';
            
            // Icon mapping for features
            const featureIcons = {
                'translate': 'translate',
                'language': 'language',
                'settings': 'settings',
                'dashboard': 'dashboard',
                'security': 'security',
                'analytics': 'analytics',
                'payment': 'payment',
                'search': 'search',
                'default': 'check_circle'
            };
            
            project.features.forEach((feature, index) => {
                const featureDiv = document.createElement('div');
                featureDiv.className = 'flex gap-md items-start p-md bg-white/80 backdrop-blur-xl rounded-xl shadow-[0_4px_12px_rgba(0,88,188,0.08)] border border-outline-variant/20 hover:border-primary/30 transition-all';
                
                const iconName = feature.icon || featureIcons.default;
                
                featureDiv.innerHTML = `
                    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-primary">${iconName}</span>
                    </div>
                    <div>
                        <h3 class="font-headline-sm text-headline-sm text-on-surface mb-xs">${feature.title || 'Feature'}</h3>
                        <p class="font-body-sm text-body-sm text-on-surface-variant">${feature.description || feature}</p>
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
                    imgDiv.className = 'shrink-0 w-72 md:w-80 h-48 md:h-56 bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow';
                    
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `${project.title} - Screenshot ${index + 1}`;
                    img.className = 'w-full h-full object-cover';
                    img.loading = 'lazy';
                    
                    imgDiv.appendChild(img);
                    galleryContainer.appendChild(imgDiv);
                });
            } else {
                // Add placeholder if no images
                const placeholderDiv = document.createElement('div');
                placeholderDiv.className = 'shrink-0 w-72 h-48 bg-surface-container rounded-xl flex items-center justify-center';
                placeholderDiv.innerHTML = '<span class="material-symbols-outlined text-4xl text-outline-variant">image</span>';
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
                projectDiv.className = 'flex items-center p-md bg-white/80 backdrop-blur-xl rounded-xl hover:bg-primary-container/5 transition-colors border border-outline-variant/20 hover:border-primary/30';
                
                projectDiv.innerHTML = `
                    <div class="w-12 h-12 bg-surface-container rounded-lg mr-md flex items-center justify-center">
                        <span class="material-symbols-outlined text-outline">${p.icon || 'code'}</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-label-md text-label-md font-bold text-on-surface">${p.title}</h4>
                        <p class="text-body-sm text-on-surface-variant">${p.category}</p>
                    </div>
                    <span class="material-symbols-outlined text-outline-variant">chevron_right</span>
                `;
                
                moreProjectsContainer.appendChild(projectDiv);
            });
        }

        // Update projects list sidebar
        updateProjectsList(projectId);
        
        console.log('✅ Project loaded:', project.title);
    } else {
        console.log('❌ No project data found, redirecting...');
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
