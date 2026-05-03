/**
 * Projects Gallery Loader
 * Handles fetching projects from JSON and rendering them into the isotope gallery in projects.html.
 */

let myProjectsData = null;
let currentLang = localStorage.getItem('portfolio_language') || 'en';

// Load projects from JSON
async function loadProjectsFromJSON() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error('Failed to load projects.json');
        const data = await response.json();
        myProjectsData = data;
        console.log('✅ Projects loaded:', data.projects.length);
        return data;
    } catch (error) {
        console.error('Error loading projects:', error);
        return null;
    }
}

// Get localized title
function getProjectTitle(project, lang) {
    return lang === 'ar' ? (project.titleAr || project.title) : project.title;
}

// Get localized description
function getProjectDescription(project, lang) {
    return lang === 'ar' ? (project.descriptionAr || project.description) : project.description;
}

// Create default template if not found
function createDefaultTemplate() {
    const template = document.createElement('div');
    template.className = 'col-lg-4 col-md-6 portfolio-item isotope-item filter-web portfolio-template';
    template.style.display = 'none';
    template.innerHTML = `
        <img src="" class="img-fluid" alt="">
        <div class="portfolio-info">
            <h4 class="portfolio-title">Project Title</h4>
            <p class="portfolio-description">Project description</p>
            <a href="" title="" data-gallery="" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
            <a href="" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
        </div>
    `;
    return template;
}

// Update filter counts
function updateFilterCounts(allProjects) {
    if (!allProjects) return;
    
    const filterButtons = document.querySelectorAll('.portfolio-filters li[data-filter]');
    
    filterButtons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        let count = 0;
        
        if (filter === '*') {
            count = allProjects.length;
        } else {
            const category = filter.replace('.filter-', '');
            count = allProjects.filter(p => {
                if (p.category === category) return true;
                if (p.categories && p.categories.includes(category)) return true;
                return false;
            }).length;
        }
        
        const existingCount = btn.querySelector('.filter-count');
        if (existingCount) existingCount.remove();
        
        const countSpan = document.createElement('span');
        countSpan.className = 'filter-count ms-1';
        countSpan.style.fontSize = '0.8em';
        countSpan.style.opacity = '0.7';
        countSpan.textContent = `(${count})`;
        btn.appendChild(countSpan);
    });
}

// Function to populate all portfolio items
async function populateAllPortfolioItems(category = '*') {
    console.log('🔍 Populating portfolio items...');
    const portfolioContainer = document.querySelector("#all-projects .isotope-container");
    
    let portfolioTemplate = document.querySelector('.portfolio-template');

    if (!portfolioTemplate && portfolioContainer) {
        portfolioTemplate = createDefaultTemplate();
    }

    if (!portfolioContainer) {
        console.error('❌ Container not found: #all-projects .isotope-container');
        return;
    }
    
    if (!portfolioTemplate) {
        console.error('❌ Template not found: .portfolio-template');
        portfolioTemplate = createDefaultTemplate();
    }

    if (!myProjectsData) {
        await loadProjectsFromJSON();
    }

    if (!myProjectsData || !myProjectsData.projects) {
        console.error('No projects data found');
        return;
    }

    let projects = myProjectsData.projects;
    if (category !== '*') {
        const categoryName = category.replace('.filter-', '');
        projects = projects.filter(p => {
            if (p.category === categoryName) return true;
            if (p.categories && p.categories.includes(categoryName)) return true;
            return false;
        });
    }

    portfolioContainer.innerHTML = '';
    updateFilterCounts(myProjectsData.projects);

    projects.forEach((project, index) => {
        const projectClone = portfolioTemplate.cloneNode(true);
        projectClone.classList.remove('portfolio-template');
        projectClone.classList.add(`filter-${project.category}`);
        
        if (project.categories && Array.isArray(project.categories)) {
            project.categories.forEach(cat => {
                projectClone.classList.add(`filter-${cat}`);
            });
        }
        
        projectClone.style.display = 'block';
        const delay = 100 + (index * 100);
        projectClone.setAttribute('data-aos-delay', delay);

        const imgElement = projectClone.querySelector('img');
        if (imgElement) {
            imgElement.src = project.thumbnail || project.image;
            imgElement.alt = `${project.title}`;
        }

        const titleElement = projectClone.querySelector('.portfolio-title');
        if (titleElement) {
            titleElement.textContent = getProjectTitle(project, currentLang);
        }

        const descElement = projectClone.querySelector('.portfolio-description');
        if (descElement) {
            descElement.textContent = getProjectDescription(project, currentLang);
        }

        const previewLink = projectClone.querySelector('.glightbox.preview-link');
        if (previewLink) {
            previewLink.href = project.thumbnail || project.image;
            previewLink.title = `${getProjectTitle(project, currentLang)}`;
        }

        const detailsLink = projectClone.querySelector('.details-link');
        if (detailsLink) {
            detailsLink.href = `project.html?project=${project.id}`;
        }

        portfolioContainer.appendChild(projectClone);
    });
}

// Setup filters
function setupFilters() {
    const filterContainer = document.querySelector('.portfolio-filters');
    if (!filterContainer) return;
    
    const filterButtons = filterContainer.querySelectorAll('li[data-filter]');
    
    filterButtons.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', async function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(b => b.classList.remove('filter-active'));
            this.classList.add('filter-active');
            
            await populateAllPortfolioItems(filter);
            
            setTimeout(() => {
                if (typeof Isotope !== 'undefined') {
                    const container = document.querySelector('#all-projects .isotope-container');
                    if (container && window.isotopeInstance) {
                        window.isotopeInstance.reloadItems();
                        window.isotopeInstance.arrange({ filter: filter });
                    }
                }
            }, 100);
        });
    });
}

// Initialize Isotope
function initIsotope() {
    const container = document.querySelector('#all-projects .isotope-container');
    if (container && typeof Isotope !== 'undefined') {
        window.isotopeInstance = new Isotope(container, {
            itemSelector: '.isotope-item',
            layoutMode: 'masonry'
        });
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await populateAllPortfolioItems();
    setupFilters();
    initIsotope();

    setTimeout(() => {
        if (typeof GLightbox !== 'undefined') {
            if (window.glightboxInstance) {
                window.glightboxInstance.refresh();
            } else {
                window.glightboxInstance = GLightbox({
                    selector: '.glightbox',
                    touchNavigation: true,
                    closeOnOutsideClick: true,
                    loop: false
                });
            }
        }

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 300);
});
