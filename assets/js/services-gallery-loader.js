/**
 * Services Gallery Loader
 * Handles fetching services from JSON and rendering them into the services gallery in services.html.
 */

let currentLang = localStorage.getItem('portfolio_language') || 'en';

// Function to populate all services from JSON
async function populateAllServices() {
    console.log('🔍 Populating all services...');
    const servicesContainer = document.querySelector("#all-services .container .row");
    const serviceTemplate = document.querySelector('.service-item-template');

    if (!servicesContainer || !serviceTemplate) {
        console.error('❌ Services container or template not found');
        return;
    }

    try {
        const response = await fetch('data/services.json');
        if (!response.ok) throw new Error('Failed to load services.json');
        const data = await response.json();
        const services = data.services;

        // Clear existing content (including the hidden template)
        servicesContainer.innerHTML = '';

        // Colors for service items
        const colors = ["item-cyan", "item-orange", "item-teal", "item-red", "item-indigo", "item-pink"];

        // Populate with data
        services.forEach((service, index) => {
            const serviceClone = serviceTemplate.cloneNode(true);
            serviceClone.classList.remove('service-item-template');
            serviceClone.style.display = 'block';
            serviceClone.setAttribute('data-aos-delay', (100 + (index * 100)).toString());

            const color = colors[index % colors.length];
            const icon = service.icon || 'bi-activity';
            const title = currentLang === 'ar' ? (service.titleAr || service.title) : service.title;
            const description = currentLang === 'ar' ? (service.descriptionAr || service.description) : service.description;
            const features = currentLang === 'ar' ? (service.featuresAr || service.features) : service.features;

            const serviceItem = serviceClone.querySelector('.service-item');
            if (serviceItem) serviceItem.className = `service-item ${color} position-relative`;

            const iconElement = serviceClone.querySelector('.service-icon');
            if (iconElement) iconElement.className = `bi ${icon}`;

            const linkElement = serviceClone.querySelector('.service-link');
            if (linkElement) linkElement.href = `service-details.html?service=${service.id}`;

            const titleElement = serviceClone.querySelector('.service-title');
            if (titleElement) titleElement.textContent = title;

            const descElement = serviceClone.querySelector('.service-description');
            if (descElement) descElement.textContent = description;

            // Update service features
            if (features && features.length > 0) {
                const featuresUl = serviceClone.querySelector('.service-features ul');
                if (featuresUl) {
                    featuresUl.innerHTML = '';
                    features.slice(0, 4).forEach(feature => {
                        const li = document.createElement('li');
                        li.className = 'mb-2';
                        li.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i><span>${feature}</span>`;
                        featuresUl.appendChild(li);
                    });
                }
            }

            const detailsBtn = serviceClone.querySelector('.service-details-btn');
            if (detailsBtn) detailsBtn.href = `service-details.html?service=${service.id}`;

            servicesContainer.appendChild(serviceClone);
        });

        // Refresh AOS
        if (typeof AOS !== 'undefined') AOS.refresh();

    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    populateAllServices();
});
