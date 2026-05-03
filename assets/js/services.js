// Service data object and functions for dynamic service details
let servicesData = null;
let currentLang = localStorage.getItem('portfolio_language') || 'en';

// Function to get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load services from JSON
async function loadServicesData() {
    try {
        const response = await fetch('data/services.json');
        if (!response.ok) throw new Error('Failed to load services.json');
        const data = await response.json();
        // Convert array to object for easier lookup by ID
        servicesData = {};
        data.services.forEach(s => {
            servicesData[s.id] = s;
        });
        return servicesData;
    } catch (error) {
        console.error('Error loading services data:', error);
        return null;
    }
}

// Function to update service details
async function updateServiceDetails() {
    if (!servicesData) {
        await loadServicesData();
    }

    const serviceId = getURLParameter('service');
    const serviceData = servicesData ? servicesData[serviceId] : null;

    if (serviceData) {
        // Localized fields
        const title = currentLang === 'ar' ? (serviceData.titleAr || serviceData.title) : serviceData.title;
        const description = currentLang === 'ar' ? (serviceData.descriptionAr || serviceData.description) : serviceData.description;
        const features = currentLang === 'ar' ? (serviceData.featuresAr || serviceData.features) : serviceData.features;
        const details = currentLang === 'ar' ? (serviceData.detailsAr || serviceData.details) : (serviceData.details || serviceData.description);

        // Update page title
        document.title = title + " - MyResume Portfolio";

        // Update breadcrumb
        const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = title;
        }

        // Update main content
        const serviceImage = document.querySelector('.services-img');
        const serviceTitle = document.querySelector('#service-details h3');
        const serviceDescription = document.querySelector('#service-details .col-lg-8 p');
        const featuresList = document.querySelector('#service-details ul');
        const detailsParagraph = document.querySelector('#service-details .col-lg-8 p:nth-of-type(2)');

        if (serviceImage) serviceImage.src = serviceData.image || 'assets/img/services.jpg';
        if (serviceTitle) serviceTitle.textContent = title;
        if (serviceDescription) serviceDescription.textContent = description;

        if (featuresList && features) {
            featuresList.innerHTML = '';
            features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-check-circle"></i> <span>${feature}</span>`;
                featuresList.appendChild(li);
            });
        }

        if (detailsParagraph) {
            detailsParagraph.textContent = details;
        }

        // Update services list sidebar
        updateServicesList(serviceId);
    } else {
        // Default to first service if no valid service ID or data
        if (servicesData) {
            const firstId = Object.keys(servicesData)[0];
            if (serviceId !== firstId) {
                window.location.href = `service-details.html?service=${firstId}`;
            }
        }
    }
}

// Function to update services list sidebar
function updateServicesList(activeService) {
    const servicesList = document.querySelector('.services-list');
    if (servicesList && servicesData) {
        servicesList.innerHTML = '';

        Object.keys(servicesData).forEach(serviceId => {
            const service = servicesData[serviceId];
            const title = currentLang === 'ar' ? (service.titleAr || service.title) : service.title;
            const a = document.createElement('a');
            a.href = `service-details.html?service=${serviceId}`;
            a.className = serviceId === activeService ? 'active' : '';
            a.innerHTML = `<i class="bi bi-arrow-right-circle"></i><span>${title}</span>`;
            servicesList.appendChild(a);
        });
    }
}

// Function to populate services section in index.html
function populateIndexServices() {
    // Check if we're on index.html page (has services section)
    const servicesSection = document.querySelector('#services .container .row');
    if (servicesSection && servicesData) {
        // Get all service items
        const serviceItems = servicesSection.querySelectorAll('.service-item');
        // Map service data to array for easier iteration
        const servicesArray = Object.keys(servicesData).map(key => ({
            id: key,
            ...servicesData[key]
        }));

        // Update each service element with data
        serviceItems.forEach((element, index) => {
            if (index < servicesArray.length) {
                const serviceData = servicesArray[index];

                // Update the title
                const titleElement = element.querySelector('h3');
                if (titleElement) {
                    titleElement.textContent = serviceData.title;
                }

                // Update the description
                const descElement = element.querySelector('p');
                if (descElement) {
                    descElement.textContent = serviceData.description;
                }

                // Update the link href
                const linkElement = element.querySelector('a.stretched-link');
                if (linkElement) {
                    linkElement.href = `service-details.html?service=${serviceData.id}`;
                }
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateServiceDetails();
    populateIndexServices();
});
