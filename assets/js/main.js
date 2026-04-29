

(function () {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function (direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    closeOnOutsideClick: true,
    loop: false
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
  /**
   * Dark Mode Toggle
   */
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    const body = document.body;
    const moonIcon = darkModeToggle.querySelector('i');

    // Check for saved dark mode preference or default to light mode
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      body.classList.toggle('dark-mode', currentTheme === 'dark');
    }

    // Update icon based on current theme
    function updateIcon() {
      if (body.classList.contains('dark-mode')) {
        moonIcon.classList.remove('bi-moon-fill');
        moonIcon.classList.add('bi-sun-fill');
        darkModeToggle.classList.add('active');
      } else {
        moonIcon.classList.remove('bi-sun-fill');
        moonIcon.classList.add('bi-moon-fill');
        darkModeToggle.classList.remove('active');
      }
    }

    // Initialize icon on page load
    updateIcon();

    darkModeToggle.addEventListener('click', function () {
      body.classList.toggle('dark-mode');

      // Save preference to localStorage
      const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);

      // Update icon
      updateIcon();

      // Reinitialize AOS for animations to work properly with theme change
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  }

  /**
   * Language Toggle
   */
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    const body = document.body;
    const langIcon = languageToggle.querySelector('i');

    const currentLang = localStorage.getItem('portfolio_language') || 'en';

    function updateLangIcon() {
      const lang = localStorage.getItem('portfolio_language') || 'en';
      if (lang === 'ar') {
        languageToggle.classList.add('active');
      } else {
        languageToggle.classList.remove('active');
      }
    }

    updateLangIcon();

    languageToggle.addEventListener('click', function() {
      const lang = localStorage.getItem('portfolio_language') || 'en';
      const newLang = lang === 'en' ? 'ar' : 'en';

      localStorage.setItem('portfolio_language', newLang);

      document.documentElement.lang = newLang;

      if (newLang === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }

      updateLangIcon();
      updateLanguageDisplay();

      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }

      location.reload();
    });
  }

  /**
   * Update language display for all elements
   */
  function updateLanguageDisplay() {
    const lang = localStorage.getItem('portfolio_language') || 'en';
    
    // Toggle filter buttons
    document.querySelectorAll('.lang-en').forEach(el => {
      el.style.display = lang === 'en' ? '' : 'none';
    });
    document.querySelectorAll('.lang-ar').forEach(el => {
      el.style.display = lang === 'ar' ? '' : 'none';
    });
    
    // Update portfolio filter text
    const filterItems = document.querySelectorAll('.portfolio-filters li');
    const filterTexts = {
      'en': ['All', 'Web App', 'Mobile Application', 'Desktop Application', 'Back-End', 'Front-End'],
      'ar': ['الكل', 'تطبيق ويب', 'تطبيق جوال', 'تطبيق سطح المكتب', 'الجزء الخلفي', 'الواجهة الأمامية']
    };
    
    filterItems.forEach((item, index) => {
      if (filterTexts[lang] && filterTexts[lang][index]) {
        const spanEn = item.querySelector('.lang-en');
        const spanAr = item.querySelector('.lang-ar');
        if (spanEn && spanAr) {
          spanEn.style.display = lang === 'en' ? '' : 'none';
          spanAr.style.display = lang === 'ar' ? '' : 'none';
        }
      }
    });
  }

  // Initialize language display
  updateLanguageDisplay();

  // Add hover event listeners for portfolio items (for console logging)
  const portfolioItems = document.querySelectorAll('.portfolio .portfolio-item');
  portfolioItems.forEach((item, index) => {
    item.addEventListener('mouseenter', function() {
      const title = this.querySelector('.portfolio-title')?.textContent || 'Unknown';
      console.log(`🖱️ Portfolio item hovered: ${title} (index: ${index})`);
      const previewLink = this.querySelector('.preview-link');
      const detailsLink = this.querySelector('.details-link');
      if (previewLink) {
        console.log(`📎 Preview link opacity: ${getComputedStyle(previewLink).opacity}, transform: ${getComputedStyle(previewLink).transform}`);
      }
      if (detailsLink) {
        console.log(`📎 Details link opacity: ${getComputedStyle(detailsLink).opacity}, transform: ${getComputedStyle(detailsLink).transform}`);
      }
    });
  });
  
  console.log(`✅ Added hover listeners to ${portfolioItems.length} portfolio items`);

})();