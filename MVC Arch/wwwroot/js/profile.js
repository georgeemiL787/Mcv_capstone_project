// Profile page functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  
  // Ensure only the profile-content scrolls
  const profileContent = document.querySelector('.profile-content');
  const profileLayout = document.querySelector('.profile-layout');
  
  console.log('Profile layout elements found:', {
    profileContent: !!profileContent,
    profileLayout: !!profileLayout
  });
  
  if (profileContent && profileLayout) {
    console.log('Setting up profile layout scrolling...');
    // Ensure profile-content can scroll properly
    profileContent.style.overflowY = 'auto';
    profileContent.style.overflowX = 'hidden';
    
    // Ensure content is visible
    profileContent.style.display = 'block';
    profileContent.style.visibility = 'visible';
    profileContent.style.opacity = '1';
    
    // Allow the page to scroll naturally
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Handle sidebar scrolling separately if needed
    const profileSidebar = document.querySelector('.profile-sidebar');
    if (profileSidebar) {
      console.log('Setting up sidebar scrolling...');
      profileSidebar.style.overflowY = 'auto';
      profileSidebar.style.overflowX = 'hidden';
    } else {
      console.log('Profile sidebar not found');
    }
    
    console.log('Profile layout scrolling setup complete');
  } else {
    console.log('Profile layout elements not found, cannot setup scrolling');
  }

  // Initialize photo upload functionality if on photo page
  const photoContainer = document.querySelector('.photo-container');
  if (photoContainer) {
    console.log('Photo container detected, initializing photo upload...');
    console.log('Photo container details:', {
      id: photoContainer.id,
      className: photoContainer.className,
      children: photoContainer.children.length
    });
    initializePhotoUpload();
  } else {
    console.log('Photo container not detected, skipping photo upload initialization');
  }
  
  // Initialize form handling
  console.log('Calling initializeFormHandling...');
  initializeFormHandling();
  
  // Check if forms were found and initialized
  const forms = document.querySelectorAll('form');
  console.log(`Total forms found on page: ${forms.length}`);
  forms.forEach((form, index) => {
    console.log(`Form ${index}: ${form.id || 'no-id'} (${form.className})`);
    console.log(`Form ${index} details:`, {
      action: form.action,
      method: form.method,
      enctype: form.enctype,
      id: form.id,
      className: form.className
    });
    
    // Check for inputs in this form
    const inputs = form.querySelectorAll('input, textarea');
    console.log(`Form ${index} has ${inputs.length} inputs`);
  });
  
  // Initialize form validation
  console.log('Calling initializeFormValidation...');
  initializeFormValidation();
  
  // Initialize character counter
  console.log('Calling initializeCharacterCounter...');
  initializeCharacterCounter();
  
  // Check if we're on the profile page
  const profileForm = document.querySelector('.profile-form');
  if (profileForm) {
    console.log('Profile form detected, form functionality initialized');
    const inputs = profileForm.querySelectorAll('input, textarea');
    console.log(`Profile form has ${inputs.length} inputs`);
    
    // Log all input details
    inputs.forEach((input, index) => {
      console.log(`Profile form input ${index}:`, {
        name: input.name,
        id: input.id,
        type: input.type,
        required: input.hasAttribute('required'),
        maxlength: input.getAttribute('maxlength'),
        value: input.value,
        placeholder: input.placeholder
      });
    });
  } else {
    console.log('Profile form not detected, form functionality initialized but may not be needed');
  }
  
  // Ensure all content sections are visible
  console.log('Ensuring content visibility...');
  ensureContentVisibility();
  
  // Force visibility check after a short delay
  console.log('Setting up delayed visibility check...');
  setTimeout(() => {
    console.log('Executing delayed visibility check...');
    forceContentVisibility();
  }, 100);
  
  // Clean up when leaving the page
  console.log('Setting up page cleanup...');
  window.addEventListener('beforeunload', () => {
    console.log('Page unloading, cleaning up...');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });
  
  console.log('Profile page initialization complete');
});

// Function to ensure all content sections are visible
function ensureContentVisibility() {
  console.log('ensureContentVisibility called');
  const contentSections = document.querySelectorAll('.content-section');
  const formSections = document.querySelectorAll('.form-section');
  const profileContent = document.querySelector('.profile-content');
  
  console.log('Found content sections:', contentSections.length);
  console.log('Found form sections:', formSections.length);
  console.log('Profile content element:', profileContent);
  
  contentSections.forEach((section, index) => {
    section.style.display = 'block';
    section.style.visibility = 'visible';
    section.style.opacity = '1';
    section.style.zIndex = '10';
    console.log(`Made content section ${index} visible:`, section);
  });
  
  formSections.forEach((section, index) => {
    section.style.display = 'block';
    section.style.visibility = 'visible';
    section.style.opacity = '1';
    section.style.zIndex = '10';
    console.log(`Made form section ${index} visible:`, section);
  });
  
  if (profileContent) {
    profileContent.style.display = 'block';
    profileContent.style.visibility = 'visible';
    profileContent.style.opacity = '1';
    profileContent.style.zIndex = '10';
    console.log('Made profile content visible');
  } else {
    console.log('Profile content element not found');
  }
}

// Function to force content visibility with more aggressive approach
function forceContentVisibility() {
  console.log('forceContentVisibility called');
  const allElements = document.querySelectorAll('*');
  console.log(`Found ${allElements.length} elements on the page`);
  
  let hiddenElements = 0;
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'none' || 
        computedStyle.visibility === 'hidden' || 
        computedStyle.opacity === '0') {
      
      // Check if it's a profile-related element
      if (element.classList.contains('profile-content') ||
          element.classList.contains('content-section') ||
          element.classList.contains('form-section') ||
          element.classList.contains('profile-layout')) {
        
        element.style.setProperty('display', 'block', 'important');
        element.style.setProperty('visibility', 'visible', 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('z-index', '10', 'important');
        
        console.log('Forced visibility for:', element);
        hiddenElements++;
      }
    }
  });
  
  console.log(`Made ${hiddenElements} hidden profile elements visible`);
}

// Photo upload functionality
function initializePhotoUpload() {
  console.log('initializePhotoUpload called');
  const photoPreview = document.querySelector('.photo-preview');
  const uploadArea = document.querySelector('.upload-area');
  const photoInput = document.getElementById('photoInput');
  const browseButton = document.getElementById('browseButton');
  const removePhoto = document.getElementById('removePhoto');
  const currentPhoto = document.getElementById('currentPhoto');
  const editorPreview = document.getElementById('editorPreview');
  
  console.log('Photo upload elements found:', {
    photoPreview: !!photoPreview,
    uploadArea: !!uploadArea,
    photoInput: !!photoInput,
    browseButton: !!browseButton,
    removePhoto: !!removePhoto,
    currentPhoto: !!currentPhoto,
    editorPreview: !!editorPreview
  });
  
  if (photoPreview) {
    console.log('Adding click listener to photo preview');
    photoPreview.addEventListener('click', () => {
      console.log('Photo preview clicked');
      photoInput.click();
    });
  }
  
  if (uploadArea) {
    console.log('Adding click listener to upload area');
    uploadArea.addEventListener('click', () => {
      console.log('Upload area clicked');
      photoInput.click();
    });
  }
  
  if (browseButton) {
    console.log('Adding click listener to browse button');
    browseButton.addEventListener('click', () => {
      console.log('Browse button clicked');
      photoInput.click();
    });
  }
  
  if (photoInput) {
    console.log('Adding change listener to photo input');
    photoInput.addEventListener('change', (e) => {
      console.log('Photo input changed');
      const file = e.target.files[0];
      if (file) {
        console.log('File selected:', file.name, file.size, file.type);
        handlePhotoUpload(file);
      } else {
        console.log('No file selected');
      }
    });
  }
  
  if (removePhoto) {
    console.log('Adding click listener to remove photo button');
    removePhoto.addEventListener('click', () => {
      console.log('Remove photo button clicked');
      if (confirm('Are you sure you want to remove your profile photo?')) {
        console.log('User confirmed photo removal');
        removeProfilePhoto();
      } else {
        console.log('User cancelled photo removal');
      }
    });
  }
  
  // Initialize photo editor controls
  console.log('Initializing photo editor...');
  initializePhotoEditor();
  console.log('Photo upload initialization complete');
  
  // Check if we're on the photo page
  if (document.querySelector('.photo-container')) {
    console.log('Photo page detected, photo upload functionality initialized');
  } else {
    console.log('Not on photo page, photo upload functionality initialized but may not be needed');
  }
}

function handlePhotoUpload(file) {
  console.log('handlePhotoUpload called with file:', file.name);
  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  console.log(`File validation: type=${file.type}, size=${file.size} bytes`);
  
  if (!validTypes.includes(file.type)) {
    console.log(`File type ${file.type} not valid`);
    showNotification('Please select a valid image file (JPG, PNG, or GIF)', 'error');
    return;
  }
  
  if (file.size > maxSize) {
    console.log(`File size ${file.size} exceeds limit ${maxSize}`);
    showNotification('File size must be less than 5MB', 'error');
    return;
  }
  
  console.log('File validation passed');
  
  // Create preview
  console.log('Creating file preview...');
  const reader = new FileReader();
  reader.onload = function(e) {
    console.log('File read complete, updating previews...');
    const currentPhoto = document.getElementById('currentPhoto');
    const editorPreview = document.getElementById('editorPreview');
    
    if (currentPhoto) {
      console.log('Updating current photo preview');
      currentPhoto.src = e.target.result;
    } else {
      console.log('Current photo element not found');
    }
    if (editorPreview) {
      console.log('Updating editor preview');
      editorPreview.src = e.target.result;
    } else {
      console.log('Editor preview element not found');
    }
    
    showNotification('Photo uploaded successfully!', 'success');
    console.log('Photo upload complete');
  };
  
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  console.log('removeProfilePhoto called');
  const currentPhoto = document.getElementById('currentPhoto');
  const editorPreview = document.getElementById('editorPreview');
  const defaultAvatar = '~/assets/images/default-avatar.jpg';
  
  if (currentPhoto) {
    console.log('Updating current photo to default avatar');
    currentPhoto.src = defaultAvatar;
  } else {
    console.log('Current photo element not found');
  }
  if (editorPreview) {
    console.log('Updating editor preview to default avatar');
    editorPreview.src = defaultAvatar;
  } else {
    console.log('Editor preview element not found');
  }
  
  showNotification('Profile photo removed', 'info');
  console.log('Profile photo removal complete');
}

function initializePhotoEditor() {
  console.log('initializePhotoEditor called');
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const saturationSlider = document.getElementById('saturation');
  const resetButton = document.getElementById('resetEditor');
  const applyButton = document.getElementById('applyChanges');
  
  console.log('Photo editor elements found:', {
    brightnessSlider: !!brightnessSlider,
    contrastSlider: !!contrastSlider,
    saturationSlider: !!saturationSlider,
    resetButton: !!resetButton,
    applyButton: !!applyButton
  });
  
  if (brightnessSlider) {
    console.log('Adding input listener to brightness slider');
    brightnessSlider.addEventListener('input', updatePhotoEditor);
  }
  
  if (contrastSlider) {
    console.log('Adding input listener to contrast slider');
    contrastSlider.addEventListener('input', updatePhotoEditor);
  }
  
  if (saturationSlider) {
    console.log('Adding input listener to saturation slider');
    saturationSlider.addEventListener('input', updatePhotoEditor);
  }
  
  if (resetButton) {
    console.log('Adding click listener to reset button');
    resetButton.addEventListener('click', resetPhotoEditor);
  }
  
  if (applyButton) {
    console.log('Adding click listener to apply button');
    applyButton.addEventListener('click', applyPhotoChanges);
  }
}

function updatePhotoEditor() {
  console.log('updatePhotoEditor called');
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const saturationSlider = document.getElementById('saturation');
  const editorPreview = document.getElementById('editorPreview');
  
  if (brightnessSlider && contrastSlider && saturationSlider && editorPreview) {
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    const saturation = saturationSlider.value;
    console.log(`Photo editor values: brightness=${brightness}, contrast=${contrast}, saturation=${saturation}`);
    
    const filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    editorPreview.style.filter = filter;
    console.log(`Applied filter: ${filter}`);
  } else {
    console.log('Some photo editor elements not found, cannot update');
  }
}

function resetPhotoEditor() {
  console.log('resetPhotoEditor called');
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const saturationSlider = document.getElementById('saturation');
  const editorPreview = document.getElementById('editorPreview');
  
  if (brightnessSlider) {
    console.log('Resetting brightness slider to 100');
    brightnessSlider.value = 100;
  }
  if (contrastSlider) {
    console.log('Resetting contrast slider to 100');
    contrastSlider.value = 100;
  }
  if (saturationSlider) {
    console.log('Resetting saturation slider to 100');
    saturationSlider.value = 100;
  }
  
  if (editorPreview) {
    console.log('Resetting editor preview filter');
    editorPreview.style.filter = 'none';
  }
  
  console.log('Photo editor reset complete');
}

function applyPhotoChanges() {
  console.log('applyPhotoChanges called');
  // Here you would typically save the edited photo
  showNotification('Photo changes applied successfully!', 'success');
  console.log('Photo changes applied notification shown');
}

function initializeFormHandling() {
  console.log('initializeFormHandling called');
  const forms = document.querySelectorAll('form');
  console.log(`Found ${forms.length} forms on the page`);
  
  forms.forEach((form, index) => {
    console.log(`Processing form ${index}:`, form);
    console.log(`Form action: ${form.action}`);
    console.log(`Form method: ${form.method}`);
    console.log(`Form ID: ${form.id}`);
    console.log(`Form class: ${form.className}`);
    
    // Store original values for comparison
    const originalValues = {};
    const inputs = form.querySelectorAll('input, textarea');
    console.log(`Found ${inputs.length} inputs in form ${index}`);
    
    inputs.forEach((input, inputIndex) => {
      originalValues[input.name] = input.value;
      console.log(`Input ${inputIndex}: ${input.name} = "${input.value}"`);
      console.log(`Input ${inputIndex} details:`, {
        name: input.name,
        id: input.id,
        type: input.type,
        required: input.hasAttribute('required'),
        maxlength: input.getAttribute('maxlength'),
        value: input.value
      });
    });
    
    // Check if form has been modified
    function checkFormChanges() {
      let hasChanges = false;
      inputs.forEach(input => {
        if (originalValues[input.name] !== input.value) {
          console.log(`Input ${input.name} changed from "${originalValues[input.name]}" to "${input.value}"`);
          hasChanges = true;
        }
      });
      
      const saveBtn = form.querySelector('button[type="submit"]');
      if (saveBtn) {
        saveBtn.disabled = !hasChanges;
        saveBtn.textContent = hasChanges ? 'Save Changes' : 'No Changes';
        console.log(`Save button state updated: disabled=${!hasChanges}, text="${saveBtn.textContent}"`);
        console.log(`Save button details:`, {
          disabled: saveBtn.disabled,
          textContent: saveBtn.textContent,
          type: saveBtn.type,
          id: saveBtn.id,
          className: saveBtn.className
        });
      } else {
        console.log(`No save button found in form ${index}`);
      }
    }
    
    // Add change listeners
    inputs.forEach(input => {
      console.log(`Adding change listeners to input: ${input.name}`);
      input.addEventListener('input', (e) => {
        console.log(`Input event on ${input.name}: "${e.target.value}"`);
        checkFormChanges();
      });
      input.addEventListener('change', (e) => {
        console.log(`Change event on ${input.name}: "${e.target.value}"`);
        checkFormChanges();
      });
    });
    
    // Initial check
    console.log('Performing initial form change check...');
    checkFormChanges();
    
    // Form submission handling
    console.log(`Adding submit event listener to form ${index}`);
    form.addEventListener('submit', async (e) => {
      console.log(`Form ${index} submit event triggered`);
      
      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';
      }
      
      try {
        // Submit form via AJAX
        const formData = new FormData(form);
        
        console.log(`Making fetch request to: ${form.action}`);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });
        
        if (response.redirected) {
          // If redirected, follow the redirect
          window.location.href = response.url;
        } else {
          // Handle response
          const result = await response.text();
          
          // Show success message
          showNotification('Profile updated successfully!', 'success');
          
          // Reload page to show updated data after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        console.error(`Form submission error:`, error);
        showNotification('An error occurred while saving. Please try again.', 'error');
        
        // Reset button state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Save Changes';
        }
      }
    });
    
    console.log(`Form ${index} handling setup complete`);
  });
  
  console.log('Form handling initialization complete');
}

// Form validation functionality
function initializeFormValidation() {
  console.log('initializeFormValidation called');
  const form = document.querySelector('.profile-form form');
  console.log('Form found for validation:', form);
  if (!form) {
    console.log('No form found for validation, returning');
    return;
  }

  console.log('Form validation form details:', {
    action: form.action,
    method: form.method,
    id: form.id,
    className: form.className
  });

  const inputs = form.querySelectorAll('input, textarea');
  console.log(`Found ${inputs.length} inputs for validation`);
  
  inputs.forEach((input, index) => {
    console.log(`Input ${index}: ${input.name} = "${input.value}"`);
    // Add validation on blur
    input.addEventListener('blur', () => validateField(input));
    
    // Add validation on input for real-time feedback
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
  
  console.log('Form validation initialization complete');
}

function validateField(field) {
  console.log(`validateField called for: ${field.name}`);
  const value = field.value.trim();
  console.log(`Field value: "${value}"`);
  let isValid = true;
  let errorMessage = '';

  // Remove existing error styling
  field.classList.remove('error');
  removeFieldError(field);
  
  console.log(`Field ${field.name} validation starting...`);

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    console.log(`Field ${field.name} is required but empty`);
    isValid = false;
    errorMessage = 'This field is required.';
  } else if (field.hasAttribute('required')) {
    console.log(`Field ${field.name} is required and has value`);
  }

  // Email validation
  if (field.type === 'email' && value) {
    console.log(`Field ${field.name} is email type, validating...`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      console.log(`Field ${field.name} email validation failed`);
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    } else {
      console.log(`Field ${field.name} email validation passed`);
    }
  }

  // Phone validation
  if (field.type === 'tel' && value) {
    console.log(`Field ${field.name} is phone type, validating...`);
    const phoneRegex = /^[\+]?[0-9][\d\s\-\(\)]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      console.log(`Field ${field.name} phone validation failed`);
      isValid = false;
      errorMessage = 'Please enter a valid phone number.';
    } else {
      console.log(`Field ${field.name} phone validation passed`);
    }
  }

  // Max length validation
  if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
    console.log(`Field ${field.name} exceeds max length: ${value.length} > ${field.getAttribute('maxlength')}`);
    isValid = false;
    errorMessage = `Maximum ${field.getAttribute('maxlength')} characters allowed.`;
  } else if (field.hasAttribute('maxlength')) {
    console.log(`Field ${field.name} length OK: ${value.length} <= ${field.getAttribute('maxlength')}`);
  }

  // Apply validation result
  if (!isValid) {
    console.log(`Field ${field.name} validation failed: ${errorMessage}`);
    field.classList.add('error');
    showFieldError(field, errorMessage);
  } else {
    console.log(`Field ${field.name} validation passed`);
  }

  console.log(`Field ${field.name} final validation result: ${isValid}`);
  return isValid;
}

function validateForm() {
  console.log('validateForm called');
  const form = document.querySelector('.profile-form form');
  if (!form) {
    console.log('No form found with selector ".profile-form form", returning true');
    return true;
  }

  console.log('Form found for validation:', form);
  console.log('Form action:', form.action);
  console.log('Form method:', form.method);
  console.log('Form ID:', form.id);

  const inputs = form.querySelectorAll('input, textarea');
  console.log(`Found ${inputs.length} form inputs`);
  let isValid = true;

  inputs.forEach((input, index) => {
    console.log(`Validating input ${index}: ${input.name} = "${input.value}"`);
    if (!validateField(input)) {
      console.log(`Input ${index} (${input.name}) failed validation`);
      isValid = false;
    } else {
      console.log(`Input ${index} (${input.name}) passed validation`);
    }
  });

  console.log(`Form validation result: ${isValid}`);
  return isValid;
}

function showFieldError(field, message) {
  console.log(`showFieldError called for ${field.name}: ${message}`);
  removeFieldError(field);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 5px;
    font-family: 'Source Sans 3', sans-serif;
  `;
  
  field.parentNode.appendChild(errorDiv);
  console.log(`Error div added for field ${field.name}`);
}

function removeFieldError(field) {
  console.log(`removeFieldError called for ${field.name}`);
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    console.log(`Removing existing error for field ${field.name}`);
    existingError.remove();
  } else {
    console.log(`No existing error found for field ${field.name}`);
  }
}

// Character counter for bio field
function initializeCharacterCounter() {
  console.log('initializeCharacterCounter called');
  const bioField = document.querySelector('#Bio');
  console.log('Bio field found:', bioField);
  if (!bioField) {
    console.log('No bio field found, returning');
    return;
  }

  console.log('Bio field details:', {
    name: bioField.name,
    id: bioField.id,
    maxlength: bioField.getAttribute('maxlength'),
    value: bioField.value,
    parentNode: bioField.parentNode
  });

  const counter = document.createElement('div');
  counter.className = 'char-counter';
  counter.style.cssText = `
    text-align: right;
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 5px;
    font-family: 'Source Sans 3', sans-serif;
  `;
  
  bioField.parentNode.appendChild(counter);
  console.log('Character counter added to bio field');
  
  const updateCounter = () => {
    const current = bioField.value.length;
    const max = bioField.getAttribute('maxlength');
    counter.textContent = `${current}/${max} characters`;
    
    if (current > max * 0.9) {
      counter.style.color = '#dc3545';
    } else if (current > max * 0.7) {
      counter.style.color = '#ffc107';
    } else {
      counter.style.color = '#6c757d';
    }
  };
  
  bioField.addEventListener('input', updateCounter);
  updateCounter(); // Initial count
  console.log('Character counter initialized for bio field');
}

function showNotification(message, type = 'info') {
  console.log(`showNotification called: ${message} (${type})`);
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
  
  console.log('Notification element created with styles');
  
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
    console.log('Close button clicked, removing notification');
    notification.remove();
  });
  
  // Add to page
  document.body.appendChild(notification);
  console.log('Notification added to DOM');
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
      console.log('Notification auto-removed');
    }
  }, 5000);
}



