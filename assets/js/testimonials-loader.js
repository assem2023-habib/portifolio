/**
 * Testimonials Loader
 * Handles fetching testimonials from JSON and rendering them into the swiper wrapper.
 */

// Load and display testimonials from JSON
console.log('🚀 Starting testimonials loading process...');

async function loadTestimonialsFromJSON() {
    try {
        const response = await fetch('data/testimonials.json');
        if (!response.ok) throw new Error('Failed to load testimonials.json');
        const data = await response.json();
        
        if (window.DataLoader) {
            window.DataLoader.testimonialsData = data;
        }
        return data;
    } catch (error) {
        console.error('❌ Error loading testimonials:', error);
        return null;
    }
}

function getLocalizedText(item, field, lang) {
    const localizedField = field + (lang === 'ar' ? 'Ar' : '');
    return item[localizedField] || item[field];
}

document.addEventListener('DOMContentLoaded', async function() {
    const wrapper = document.getElementById('testimonials-wrapper');
    if (!wrapper) return;

    const data = await loadTestimonialsFromJSON();
    if (!data || !data.testimonials) return;

    wrapper.innerHTML = '';
    let testimonials = data.testimonials;
    const lang = window.DataLoader?.currentLanguage || localStorage.getItem('portfolio_language') || 'en';

    // Load local testimonials from localStorage (fallback for static hosting)
    try {
        const localTestimonials = JSON.parse(localStorage.getItem('localTestimonials') || '[]');
        if (localTestimonials.length > 0) {
            console.log(`📱 Loading ${localTestimonials.length} local testimonials`);
            testimonials = [...testimonials, ...localTestimonials];
        }
    } catch (error) {
        console.warn('Error loading local testimonials:', error);
    }

    testimonials.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.setAttribute('data-aos', 'fade-up');
        slide.setAttribute('data-aos-delay', (index * 100).toString());

        const name = getLocalizedText(testimonial, 'name', lang);
        const role = getLocalizedText(testimonial, 'role', lang);
        const content = getLocalizedText(testimonial, 'content', lang);
        const starsCount = testimonial.rating || 5;
        const stars = Array(starsCount).fill('<i class="bi bi-star-fill"></i>').join('');

        slide.innerHTML = `
        <div class="testimonial-item">
            <div class="testimonial-content">
            <i class="bi bi-quote quote-icon-left"></i>
            <p>${content}</p>
            <i class="bi bi-quote quote-icon-right"></i>
            </div>
            <div class="testimonial-author d-flex align-items-center mt-4">
            <img src="${testimonial.image}" class="testimonial-img" alt="${name}">
            <div class="ms-3">
                <h3>${name}</h3>
                <h4>${role}</h4>
                <div class="stars text-warning">${stars}</div>
            </div>
            </div>
        </div>
        `;
        wrapper.appendChild(slide);
    });

    console.log(`✅ Total testimonials loaded: ${testimonials.length}`);

    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 300);
    }
});
