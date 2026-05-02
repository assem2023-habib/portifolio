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
        // Send to PHP API
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
        console.error('Error submitting testimonial:', error);
        showMessage('error', 'Server error. Please try again later.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Reset form when modal is closed
  if (modal) {
    modal.addEventListener('hidden.bs.modal', function() {
      form.reset();
      messageDiv.innerHTML = '';
      imageInput.value = '';
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
