// Profile page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Ensure only the profile-content scrolls
  const profileContent = document.querySelector('.profile-content');
  const profileLayout = document.querySelector('.profile-layout');
  
  if (profileContent && profileLayout) {
    // Ensure profile-content can scroll properly
    profileContent.style.overflowY = 'auto';
    profileContent.style.overflowX = 'hidden';
    
    // Allow the page to scroll naturally
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Handle sidebar scrolling separately if needed
    const profileSidebar = document.querySelector('.profile-sidebar');
    if (profileSidebar) {
      profileSidebar.style.overflowY = 'auto';
      profileSidebar.style.overflowX = 'hidden';
    }
  }

  // Initialize photo upload functionality if on photo page
  if (document.querySelector('.photo-container')) {
    initializePhotoUpload();
  }
  
  // Initialize form handling
  initializeFormHandling();
  
  // Clean up when leaving the page
  window.addEventListener('beforeunload', () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });
});

// Photo upload functionality
function initializePhotoUpload() {
  const photoPreview = document.querySelector('.photo-preview');
  const uploadArea = document.querySelector('.upload-area');
  const photoInput = document.getElementById('photoInput');
  const browseButton = document.getElementById('browseButton');
  const removePhoto = document.getElementById('removePhoto');
  const currentPhoto = document.getElementById('currentPhoto');
  const editorPreview = document.getElementById('editorPreview');
  
  if (photoPreview) {
    photoPreview.addEventListener('click', () => {
      photoInput.click();
    });
  }
  
  if (uploadArea) {
    uploadArea.addEventListener('click', () => {
      photoInput.click();
    });
  }
  
  if (browseButton) {
    browseButton.addEventListener('click', () => {
      photoInput.click();
    });
  }
  
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handlePhotoUpload(file);
      }
    });
  }
  
  if (removePhoto) {
    removePhoto.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove your profile photo?')) {
        removeProfilePhoto();
      }
    });
  }
  
  // Initialize photo editor controls
  initializePhotoEditor();
}

function handlePhotoUpload(file) {
  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    showNotification('Please select a valid image file (JPG, PNG, or GIF)', 'error');
    return;
  }
  
  if (file.size > maxSize) {
    showNotification('File size must be less than 5MB', 'error');
    return;
  }
  
  // Create preview
  const reader = new FileReader();
  reader.onload = function(e) {
    const currentPhoto = document.getElementById('currentPhoto');
    const editorPreview = document.getElementById('editorPreview');
    
    if (currentPhoto) {
      currentPhoto.src = e.target.result;
    }
    if (editorPreview) {
      editorPreview.src = e.target.result;
    }
    
    showNotification('Photo uploaded successfully!', 'success');
  };
  
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  const currentPhoto = document.getElementById('currentPhoto');
  const editorPreview = document.getElementById('editorPreview');
  const defaultAvatar = '~/assets/images/default-avatar.jpg';
  
  if (currentPhoto) {
    currentPhoto.src = defaultAvatar;
  }
  if (editorPreview) {
    editorPreview.src = defaultAvatar;
  }
  
  showNotification('Profile photo removed', 'info');
}

function initializePhotoEditor() {
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const saturationSlider = document.getElementById('saturation');
  const resetButton = document.getElementById('resetEditor');
  const applyButton = document.getElementById('applyChanges');
  
  if (brightnessSlider) {
    brightnessSlider.addEventListener('input', updatePhotoEditor);
  }
  
  if (contrastSlider) {
    contrastSlider.addEventListener('input', updatePhotoEditor);
  }
  
  if (saturationSlider) {
    saturationSlider.addEventListener('input', updatePhotoEditor);
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', resetPhotoEditor);
  }
  
  if (applyButton) {
    applyButton.addEventListener('click', applyPhotoChanges);
  }
}

function updatePhotoEditor() {
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const saturationSlider = document.getElementById('saturation');
  const editorPreview = document.getElementById('editorPreview');
  
  if (brightnessSlider && contrastSlider && saturationSlider && editorPreview) {
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    const saturation = saturationSlider.value;
    
    editorPreview.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  }
}

function resetPhotoEditor() {
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const saturationSlider = document.getElementById('saturation');
  const editorPreview = document.getElementById('editorPreview');
  
  if (brightnessSlider) brightnessSlider.value = 100;
  if (contrastSlider) contrastSlider.value = 100;
  if (saturationSlider) saturationSlider.value = 100;
  
  if (editorPreview) {
    editorPreview.style.filter = 'none';
  }
}

function applyPhotoChanges() {
  // Here you would typically save the edited photo
  showNotification('Photo changes applied successfully!', 'success');
}

function initializeFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(form);
    });
  });
}

function handleFormSubmission(form) {
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
  }
  
  // Simulate form submission
  setTimeout(() => {
    showNotification('Changes saved successfully!', 'success');
    
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Save Changes';
    }
  }, 1000);
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 300px;
  `;
  
  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
  `;
  
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}



