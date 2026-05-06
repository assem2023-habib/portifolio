/**
 * Project Details Loader
 * Handles dynamic content population for the project.html page based on URL parameters.
 * Updated to use Tailwind CSS classes (Bento Grid design)
 */

// Function to get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to update projects list sidebar (Bento Style)
function updateProjectsList(activeProject) {
    const projectsList = document.querySelector('.projects-list ul');
    if (projectsList && typeof portfolioData !== 'undefined') {
        projectsList.innerHTML = '';

        Object.keys(portfolioData).forEach(projectId => {
            const project = portfolioData[projectId];
            const li = document.createElement('li');
            li.className = `mb-sm ${projectId === activeProject ? 'opacity-100' : 'opacity-80'}`;
            
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

        // Update breadcrumb and main title
        const projectTitleElements = document.querySelectorAll('.project-title');
        projectTitleElements.forEach(element => {
            element.textContent = project.title;
        });

        // Update project image
        const projectImage = document.querySelector('.project-image');
        if (projectImage) {
            projectImage.src = project.image;
            projectImage.alt = project.title;
        }

        // Update project category
        const projectCategory = document.querySelector('.project-category');
        if (projectCategory) {
            projectCategory.textContent = project.category.charAt(0).toUpperCase() + project.category.slice(1);
        }

        // Update project description
        const projectDescription = document.querySelector('.project-description');
        if (projectDescription) {
            projectDescription.textContent = project.description;
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

        // Update project URL (View Project button)
        const projectUrl = document.querySelector('.project-url');
        if (projectUrl) {
            const url = project.repoUrl || project.url || '#';
            projectUrl.href = url;
            if (project.repoUrl) {
                projectUrl.innerHTML = '<span class="material-symbols-outlined align-middle mr-xs">code</span> View Code';
            } else if (project.url) {
                projectUrl.innerHTML = '<span class="material-symbols-outlined align-middle mr-xs">open_in_new</span> Visit Project';
            } else {
                projectUrl.innerHTML = '<span class="material-symbols-outlined align-middle mr-xs">info</span> View Details';
            }
        }

        // Update mobile download URL (APK)
        const mobileUrl = document.querySelector('.project-mobile-url');
        if (mobileUrl) {
            if (project.mobileUrl) {
                mobileUrl.href = project.mobileUrl;
                mobileUrl.style.display = 'block';
                mobileUrl.innerHTML = '<span class="material-symbols-outlined align-middle mr-xs">download</span> Download Mobile App';
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
                desktopUrl.style.display = 'block';
                desktopUrl.innerHTML = '<span class="material-symbols-outlined align-middle mr-xs">computer</span> Download Desktop App';
                console.log('💻 Desktop URL added:', project.desktopUrl);
            } else {
                desktopUrl.style.display = 'none';
            }
        }

        // Update project features
        const featureElements = document.querySelectorAll('.project-features .list-unstyled li span');
        if (project.features && featureElements.length > 0) {
            project.features.forEach((feature, index) => {
                if (featureElements[index]) {
                    featureElements[index].textContent = feature;
                }
            });
        }

        // Update project gallery images
        const galleryImages = document.querySelectorAll('.project-gallery-image');
        const projectImages = project.screenshots || project.galleryImages || [];
        if (projectImages.length > 0) {
            galleryImages.forEach((img, index) => {
                if (projectImages[index]) {
                    img.src = projectImages[index];
                    img.alt = `${project.title} - Image ${index + 1}`;
                    img.style.display = 'block';
                }
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
