/**
 * Project Details Loader
 * Handles dynamic content population for the project.html page based on URL parameters.
 */

// Function to get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to update projects list sidebar
function updateProjectsList(activeProject) {
    const projectsList = document.querySelector('.projects-list ul');
    if (projectsList && typeof portfolioData !== 'undefined') {
        projectsList.innerHTML = '';

        Object.keys(portfolioData).forEach(projectId => {
            const project = portfolioData[projectId];
            const li = document.createElement('li');
            li.className = `mb-2 ${projectId === activeProject ? 'active' : ''}`;
            li.innerHTML = `
            <a href="project.html?project=${projectId}" class="d-flex align-items-center p-2 rounded ${projectId === activeProject ? 'bg-primary text-white' : 'bg-light hover-bg-primary'}" style="transition: all 0.3s ease;">
                <i class="bi ${projectId === activeProject ? 'bi-circle-fill' : 'bi-circle'} me-2"></i>
                <div>
                <div class="fw-bold">${project.title}</div>
                <small class="text-muted">${project.category}</small>
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
        document.title = project.title + " - MyResume Bootstrap Template";

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

        // Update project technologies (if available in data)
        const projectTechnologies = document.querySelector('.project-technologies');
        if (projectTechnologies) {
            projectTechnologies.textContent = project.technologies || 'Laravel, PHP, MySQL';
        }

        // Update project status
        const projectStatus = document.querySelector('.project-status');
        if (projectStatus) {
            projectStatus.textContent = project.status || 'Completed';
        }

        // Update project URL
        const projectUrl = document.querySelector('.project-url');
        if (projectUrl) {
            const url = project.repoUrl || project.url || '#';
            projectUrl.href = url;
            if (project.repoUrl) {
                projectUrl.textContent = 'View Code';
                projectUrl.className = 'project-url btn btn-outline-primary btn-sm';
            } else if (project.url) {
                projectUrl.textContent = 'Visit Project';
                projectUrl.className = 'project-url btn btn-outline-primary btn-sm';
            } else {
                projectUrl.textContent = 'View Details';
                projectUrl.className = 'project-url btn btn-outline-secondary btn-sm';
            }
        }

        // Update mobile download URL (APK)
        const mobileUrl = document.querySelector('.project-mobile-url');
        if (mobileUrl) {
            if (project.mobileUrl) {
                mobileUrl.href = project.mobileUrl;
                mobileUrl.style.display = 'inline-block';
                mobileUrl.innerHTML = '<i class="bi bi-download me-1"></i> Download Mobile App';
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
                desktopUrl.style.display = 'inline-block';
                desktopUrl.innerHTML = '<i class="bi bi-laptop me-1"></i> Download Desktop App';
                console.log('💻 Desktop URL added:', project.desktopUrl);
            } else {
                desktopUrl.style.display = 'none';
            }
        }

        // Update project features (if available in data)
        const featureElements = document.querySelectorAll('.project-features .list-unstyled li span');
        if (project.features && featureElements.length > 0) {
            project.features.forEach((feature, index) => {
                if (featureElements[index]) {
                    featureElements[index].textContent = feature;
                }
            });
        }

        // Update project gallery images (if available in data)
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
