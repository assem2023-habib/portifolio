// Service data object and functions for dynamic service details
// Note: servicesData is loaded from services-data.js file
// Make sure services-data.js is loaded before this file in HTML

// Function to get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to update service details
function updateServiceDetails() {
    const serviceId = getURLParameter('service');
    const serviceData = servicesData[serviceId];

    if (serviceData) {
        // Update page title
        document.title = serviceData.title + " - MyResume Bootstrap Template";

        // Update breadcrumb
        const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = serviceData.title;
        }

        // Update main content
        const serviceImage = document.querySelector('.services-img');
        const serviceTitle = document.querySelector('#service-details h3');
        const serviceDescription = document.querySelector('#service-details .col-lg-8 p');
        const featuresList = document.querySelector('#service-details ul');
        const detailsParagraph = document.querySelector('#service-details .col-lg-8 p:nth-of-type(2)');

        if (serviceImage) serviceImage.src = serviceData.image;
        if (serviceTitle) serviceTitle.textContent = serviceData.title;
        if (serviceDescription) serviceDescription.textContent = serviceData.description;

        if (featuresList && serviceData.features) {
            featuresList.innerHTML = '';
            serviceData.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-check-circle"></i> <span>${feature}</span>`;
                featuresList.appendChild(li);
            });
        }

        if (detailsParagraph && serviceData.details) {
            detailsParagraph.textContent = serviceData.details;
        }

        // Update services list sidebar
        updateServicesList(serviceId);
    } else {
        // Default to first service if no valid service ID
        window.location.href = 'service-details.html?service=fullstack';
    }
}

// Function to update services list sidebar
function updateServicesList(activeService) {
    const servicesList = document.querySelector('.services-list');
    if (servicesList) {
        servicesList.innerHTML = '';

        Object.keys(servicesData).forEach(serviceId => {
            const service = servicesData[serviceId];
            const li = document.createElement('a');
            li.href = `service-details.html?service=${serviceId}`;
            li.className = serviceId === activeService ? 'active' : '';
            li.innerHTML = `<i class="bi bi-arrow-right-circle"></i><span>${service.title}</span>`;
            servicesList.appendChild(li);
        });
    }
}

// Function to populate services section in index.html
function populateIndexServices() {
  // Check if we're on index.html page (has services section)
  const servicesSection = document.querySelector('#services .container .row');
  if (servicesSection) {
    // Get all service items (6 items)
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
