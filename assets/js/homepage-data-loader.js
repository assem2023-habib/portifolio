const homepageServicesData = {
    fullstack: servicesData.fullstack,
    api: servicesData.api,
    cms: servicesData.cms,
    performance: servicesData.performance,
    interactive: servicesData.interactive,
    maintenance: servicesData.maintenance
  };
  
  const homepagePortfolioData = {
    smartship: portfolioData.smartship,
    stitchhub: portfolioData.stitchhub,
    cutoptimizer: portfolioData.cutoptimizer,
    socialbackend: portfolioData.socialbackend,
    taskflow: portfolioData.taskflow,
    inventorypro: portfolioData.inventorypro
  };
  
  const homepageTestimonialsData = {
    saul: testimonialsData.saul,
    sarah: testimonialsData.sarah,
    mike: testimonialsData.mike,
    alex: testimonialsData.alex,
    emily: testimonialsData.emily,
    david: testimonialsData.david
  };
  
  function populateServiceItems() {
    const servicesContainer = document.querySelector("#services .container .row");
    const serviceTemplate = document.querySelector('.service-item-template');
  
    if (servicesContainer && serviceTemplate && homepageServicesData) {
      servicesContainer.innerHTML = '';
      const colors = ["item-cyan","item-orange","item-teal","item-red","item-indigo","item-pink"];
      const icons = ["bi-activity","bi-broadcast","bi-easel","bi-bounding-box-circles","bi-calendar4-week","bi-chat-square-text"];
  
      const servicesArray = Object.keys(homepageServicesData).map(key => ({ id: key, ...homepageServicesData[key] }));
  
      servicesArray.forEach((service, index) => {
        const serviceClone = serviceTemplate.cloneNode(true);
        serviceClone.classList.remove('service-item-template');
        serviceClone.style.display = 'block';
        serviceClone.setAttribute('data-aos-delay', 100 + (index * 100));
  
        const color = colors[index % colors.length];
        const icon = icons[index % icons.length];
  
        const serviceItem = serviceClone.querySelector('.service-item');
        if (serviceItem) serviceItem.className = `service-item ${color} position-relative`;
  
        const iconElement = serviceClone.querySelector('.service-icon');
        if (iconElement) iconElement.className = `bi ${icon}`;
  
        const linkElement = serviceClone.querySelector('.service-link');
        if (linkElement) linkElement.href = `service-details.html?service=${service.id}`;
  
        const titleElement = serviceClone.querySelector('.service-title');
        if (titleElement) titleElement.textContent = service.title;
  
        const descElement = serviceClone.querySelector('.service-description');
        if (descElement) descElement.textContent = service.description;
  
        servicesContainer.appendChild(serviceClone);
      });
    }
  }
  
  function populatePortfolioItems() {
    const portfolioContainer = document.querySelector("#portfolio .isotope-container");
    const portfolioTemplate = document.querySelector('.portfolio-template');
  
    if (portfolioContainer && portfolioTemplate && homepagePortfolioData) {
      portfolioContainer.innerHTML = '';
  
      const portfolioArray = Object.keys(homepagePortfolioData).map(key => ({ id: key, ...homepagePortfolioData[key] }));
  
      portfolioArray.forEach((project, index) => {
        const projectClone = portfolioTemplate.cloneNode(true);
        projectClone.classList.remove('portfolio-template');
        projectClone.style.display = 'block';
        projectClone.setAttribute('data-aos-delay', 100 + (index * 100));
  
        const imgElement = projectClone.querySelector('img');
        if (imgElement) {
          imgElement.src = project.image;
          imgElement.alt = `${project.title} - ${project.description}`;
        }
  
        const titleElement = projectClone.querySelector('.portfolio-title');
        if (titleElement) titleElement.textContent = project.title;
  
        const descElement = projectClone.querySelector('.portfolio-description');
        if (descElement) descElement.textContent = project.description;
  
        const previewLink = projectClone.querySelector('.glightbox.preview-link');
        if (previewLink) {
          previewLink.href = project.image;
          previewLink.title = `${project.title} - ${project.description}`;
          previewLink.setAttribute('data-gallery', project.gallery);
        }
  
        const detailsLink = projectClone.querySelector('.details-link');
        if (detailsLink) detailsLink.href = `${project.detailsUrl}?project=${project.id}`;
  
        portfolioContainer.appendChild(projectClone);
      });
    }
  }
  
  function populateTestimonials() {
    const testimonialsContainer = document.querySelector("#testimonials .swiper-wrapper");
    const testimonialTemplate = document.querySelector('.testimonial-template');
  
    if (testimonialsContainer && testimonialTemplate && homepageTestimonialsData) {
      testimonialsContainer.innerHTML = '';
  
      const testimonialsArray = Object.keys(homepageTestimonialsData).map(key => ({ id: key, ...homepageTestimonialsData[key] }));
  
      testimonialsArray.forEach((testimonial, index) => {
        const testimonialClone = testimonialTemplate.cloneNode(true);
        testimonialClone.classList.remove('testimonial-template');
        testimonialClone.style.display = 'block';
        testimonialClone.setAttribute('data-aos-delay', 100 + (index * 100));
  
        const contentElement = testimonialClone.querySelector('.testimonial-text');
        if (contentElement) contentElement.textContent = testimonial.content;
  
        const nameElement = testimonialClone.querySelector('.testimonial-name');
        if (nameElement) nameElement.textContent = testimonial.name;
  
        const roleElement = testimonialClone.querySelector('.testimonial-role');
        if (roleElement) roleElement.textContent = testimonial.role;
  
        const imgElement = testimonialClone.querySelector('.testimonial-img');
        if (imgElement) {
          imgElement.src = testimonial.image;
          imgElement.alt = `${testimonial.name} - ${testimonial.role}`;
        }
  
        const starsContainer = testimonialClone.querySelector('.stars');
        if (starsContainer && testimonial.rating) {
          const stars = starsContainer.querySelectorAll('i');
          stars.forEach((star, starIndex) => {
            if (starIndex < testimonial.rating) {
              star.classList.add('bi-star-fill');
              star.classList.remove('bi-star');
            } else {
              star.classList.add('bi-star');
              star.classList.remove('bi-star-fill');
            }
          });
        }
  
        testimonialsContainer.appendChild(testimonialClone);
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    populateServiceItems();
    populatePortfolioItems();
    populateTestimonials();
  
    setTimeout(() => {
      if (typeof GLightbox !== 'undefined') {
        if (window.glightboxInstance) {
          window.glightboxInstance.refresh();
        } else {
          const glightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            closeOnOutsideClick: true,
            loop: false
          });
          window.glightboxInstance = glightbox;
        }
      }
    }, 200);
  });
  