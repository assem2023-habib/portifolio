// Testimonial Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addTestimonialForm');
  const modal = document.getElementById('addTestimonialModal');
  const toggleBtn = document.getElementById('toggleFormLanguage');
  const englishFields = document.querySelector('.english-fields');
  const arabicFields = document.querySelector('.arabic-fields');
  const messageDiv = document.getElementById('formMessage');
  const imageInput = document.getElementById('testimonialImage');

  let currentFormLang = 'en';

  // Image Upload - Drag & Drop + Preview
  const imageUploadArea = document.getElementById('imageUploadArea');
  const imagePreview = document.getElementById('imagePreview');
  
  if (imageUploadArea && imageInput) {
    // Click to upload
    imageUploadArea.addEventListener('click', function(e) {
      if (e.target !== imagePreview || imagePreview.style.display === 'none') {
        imageInput.click();
      }
    });

    // File input change
    imageInput.addEventListener('change', function() {
      previewImage(this.files[0]);
    });

    // Drag events
    imageUploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('drag-over');
    });

    imageUploadArea.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
    });

    imageUploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        imageInput.files = e.dataTransfer.files;
        previewImage(file);
      }
    });

    // Preview image function
    function previewImage(file) {
      if (!file) return;

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG and PNG images are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        imageUploadArea.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    }

    console.log('✅ Image upload with drag & drop initialized');
  }

  // Interactive Star Rating
  const starRating = document.getElementById('starRating');
  const ratingInput = document.getElementById('testimonialRating');
  
  if (starRating && ratingInput) {
    const stars = starRating.querySelectorAll('i');
    
    // Initialize stars
    stars.forEach((star, index) => {
      // Click event with staggered animation
      star.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        ratingInput.value = rating;
        
        // Update star display with staggered animation
        stars.forEach((s, i) => {
          // Remove existing animation classes
          s.classList.remove('animate-pop', 'animate-glow');
          
          if (i < rating) {
            // Fill this star
            s.classList.remove('bi-star');
            s.classList.add('bi-star-fill', 'filled');
            
            // Add staggered animation with delay
            const delay = i * 80; // 80ms delay per star
            setTimeout(() => {
              s.classList.add('animate-pop', 'animate-glow');
              
              // Create sparkle effect for each star
              createSparkles(s, 4);
              
              // Remove animation classes after animation completes
              setTimeout(() => {
                s.classList.remove('animate-pop', 'animate-glow');
              }, 500);
            }, delay);
          } else {
            // Empty this star
            s.classList.remove('bi-star-fill', 'filled');
            s.classList.add('bi-star');
          }
        });
        
        console.log('⭐ Rating selected:', rating);
      });

      // Sparkle effect function
      function createSparkles(starElement, count) {
        const container = starRating.querySelector('.sparkles-container');
        if (!container) return;
        
        const starRect = starElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const centerX = starRect.left - containerRect.left + starRect.width / 2;
        const centerY = starRect.top - containerRect.top + starRect.height / 2;
        
        for (let j = 0; j < count; j++) {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';
          
          // Random direction
          const angle = (Math.PI * 2 * j) / count + (Math.random() - 0.5) * 0.5;
          const distance = 15 + Math.random() * 15;
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;
          
          sparkle.style.left = `${centerX}px`;
          sparkle.style.top = `${centerY}px`;
          sparkle.style.setProperty('--tx', `${tx}px`);
          sparkle.style.setProperty('--ty', `${ty}px`);
          
          container.appendChild(sparkle);
          
          // Remove sparkle after animation
          setTimeout(() => {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          }, 600);
        }
      }
      
      // Hover effect
      star.addEventListener('mouseenter', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        stars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add('hover');
          } else {
            s.classList.remove('hover');
          }
        });
      });
    });
    
    // Reset on mouse leave
    starRating.addEventListener('mouseleave', function() {
      const currentRating = parseInt(ratingInput.value) || 0;
      stars.forEach((s, i) => {
        s.classList.remove('hover');
        if (i < currentRating) {
          s.classList.add('filled');
        } else {
          s.classList.remove('filled');
        }
      });
    });
    
    console.log('✅ Interactive star rating initialized');
  }

  // Language toggle for form
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      currentFormLang = currentFormLang === 'en' ? 'ar' : 'en';
      
      if (currentFormLang === 'ar') {
        englishFields.style.display = 'none';
        arabicFields.style.display = 'block';
        toggleBtn.querySelector('.lang-en').style.display = 'none';
        toggleBtn.querySelector('.lang-ar').style.display = 'inline';
      } else {
        englishFields.style.display = 'block';
        arabicFields.style.display = 'none';
        toggleBtn.querySelector('.lang-en').style.display = 'inline';
        toggleBtn.querySelector('.lang-ar').style.display = 'none';
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Clear previous messages
      messageDiv.innerHTML = '';

      // Get form values
      const name = document.getElementById('testimonialName').value.trim();
      const role = document.getElementById('testimonialRole').value.trim();
      const content = document.getElementById('testimonialContent').value.trim();
      const rating = document.getElementById('testimonialRating').value;

      // Arabic fields (optional)
      const nameAr = document.getElementById('testimonialNameAr')?.value.trim() || '';
      const roleAr = document.getElementById('testimonialRoleAr')?.value.trim() || '';
      const contentAr = document.getElementById('testimonialContentAr')?.value.trim() || '';

      // Validate required fields
      if (!name || !role || !content) {
        showMessage('error', 'Please fill in all required fields (Name, Role, Content)');
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      formData.append('content', content);
      formData.append('rating', rating);
      formData.append('nameAr', nameAr);
      formData.append('roleAr', roleAr);
      formData.append('contentAr', contentAr);

      // Add image if provided
      if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
          showMessage('error', 'Image size must be less than 2MB');
          return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          showMessage('error', 'Only JPG and PNG images are allowed');
          return;
        }

        formData.append('image', file);
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
      submitBtn.disabled = true;

      try {
        // Try PHP API first (works on servers with PHP support)
        const response = await fetch('api/save-testimonial.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showMessage('success', result.message || 'Testimonial submitted successfully! It will appear after approval.');
          
          // Reset form
          form.reset();
          imageInput.value = '';
          if (imagePreview) {
            imagePreview.style.display = 'none';
            imagePreview.src = '';
          }
          if (imageUploadArea) {
            imageUploadArea.classList.remove('has-image');
          }
          
          // Close modal after 2 seconds
          setTimeout(() => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }, 2000);
        } else {
          showMessage('error', result.message || 'Failed to submit testimonial');
        }
      } catch (error) {
        // Fallback to localStorage (for GitHub Pages / static hosting)
        console.warn('PHP API not available, saving to localStorage...');
        saveTestimonialToLocal(name, role, content, rating, nameAr, roleAr, contentAr);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Save testimonial to localStorage (fallback for static hosting)
  function saveTestimonialToLocal(name, role, content, rating, nameAr, roleAr, contentAr) {
    try {
      // Get existing local testimonials
      let localTestimonials = JSON.parse(localStorage.getItem('localTestimonials') || '[]');
      
      // Create new testimonial object
      const newTestimonial = {
        id: 'local_' + Date.now(),
        name: name,
        role: role,
        content: content,
        rating: parseInt(rating),
        nameAr: nameAr,
        roleAr: roleAr,
        contentAr: contentAr,
        image: 'assets/img/testimonials/testimonials-1.jpg', // Default image
        date: new Date().toISOString(),
        approved: true // Auto-approve for local display
      };

      // Add to array
      localTestimonials.push(newTestimonial);
      
      // Save back to localStorage
      localStorage.setItem('localTestimonials', JSON.stringify(localTestimonials));
      
      console.log('✅ Testimonial saved to localStorage:', newTestimonial);
      
      // Show success message
      showMessage('success', '✅ Testimonial saved locally! It will appear immediately.');
      
      // Reset form
      form.reset();
      imageInput.value = '';
      if (imagePreview) {
        imagePreview.style.display = 'none';
        imagePreview.src = '';
      }
      if (imageUploadArea) {
        imageUploadArea.classList.remove('has-image');
      }
      
      // Reload testimonials to show the new one
      if (typeof loadTestimonialsFromJSON === 'function') {
        loadTestimonialsFromJSON();
      }
      
      // Close modal after 2 seconds
      setTimeout(() => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      showMessage('error', 'Error saving testimonial. Please try again.');
    }
  }

  // Reset form when modal is closed
  if (modal) {
    modal.addEventListener('hidden.bs.modal', function() {
      form.reset();
      messageDiv.innerHTML = '';
      imageInput.value = '';
      if (imagePreview) {
        imagePreview.style.display = 'none';
        imagePreview.src = '';
      }
      if (imageUploadArea) {
        imageUploadArea.classList.remove('has-image');
        imageUploadArea.classList.remove('drag-over');
      }
      currentFormLang = 'en';
      englishFields.style.display = 'block';
      arabicFields.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.querySelector('.lang-en').style.display = 'inline';
        toggleBtn.querySelector('.lang-ar').style.display = 'none';
      }
    });
  }

  // Helper function to show messages
  function showMessage(type, message) {
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    
    messageDiv.innerHTML = `
      <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        <i class="bi bi-${icon} me-2"></i>
        <span class="lang-en">${type === 'success' ? message : 'Error: ' + message}</span>
        <span class="lang-ar" style="display:none;">${type === 'success' ? 'تم الإرسال بنجاح! سيظهر بعد الموافقة.' : 'خطأ: ' + message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
});
