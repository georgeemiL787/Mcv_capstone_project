// Enroll Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeEnrollPage();
});

function initializeEnrollPage() {
    // Set up event listeners
    setupPaymentOptions();
    setupCouponCode();
    setupFormValidation();
    setupFormSubmission();
    
    // Initialize pricing
    updatePricing();
}

// Payment Options Handling
function setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll('input[name="paymentType"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePricing();
        });
    });
}

// Coupon Code Handling
function setupCouponCode() {
    const applyCouponBtn = document.querySelector('.apply-coupon-btn');
    const couponInput = document.getElementById('couponCode');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', function() {
            applyCoupon();
        });
        
        // Allow Enter key to apply coupon
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCoupon();
            }
        });
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }
    
    // Simulate coupon validation
    const validCoupons = {
        'WELCOME10': 10,
        'STUDENT20': 20,
        'NEWUSER15': 15
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        localStorage.setItem('appliedCoupon', JSON.stringify({
            code: couponCode,
            discount: discount
        }));
        
        updatePricing();
        showNotification(`Coupon applied! ${discount}% discount`, 'success');
        
        // Update coupon input styling
        couponInput.style.borderColor = '#8f7efc';
        couponInput.style.backgroundColor = 'rgba(143, 126, 252, 0.05)';
    } else {
        showNotification('Invalid coupon code', 'error');
        couponInput.style.borderColor = '#ff6b6b';
        couponInput.style.backgroundColor = 'rgba(255, 107, 107, 0.05)';
    }
}

// Pricing and Order Summary
function updatePricing() {
    const selectedPayment = document.querySelector('input[name="paymentType"]:checked');
    const basePrice = selectedPayment.value === 'premium' ? 99 : 0;
    
    // Get applied coupon
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const discountAmount = (basePrice * discount) / 100;
    const finalPrice = basePrice - discountAmount;
    
    // Update order summary
    updateOrderSummary(basePrice, discountAmount, finalPrice);
}

function updateOrderSummary(basePrice = 0, discountAmount = 0, finalPrice = 0) {
    // Update course price
    const coursePriceElement = document.getElementById('coursePrice');
    if (coursePriceElement) {
        coursePriceElement.textContent = formatCurrency(basePrice);
    }
    
    // Update discount
    const discountItem = document.getElementById('discountItem');
    const discountAmountElement = document.getElementById('discountAmount');
    
    if (discountAmount > 0) {
        if (discountItem) {
            discountItem.style.display = 'flex';
        }
        if (discountAmountElement) {
            discountAmountElement.textContent = `-${formatCurrency(discountAmount)}`;
        }
    } else {
        if (discountItem) {
            discountItem.style.display = 'none';
        }
    }
    
    // Update total price
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = formatCurrency(finalPrice);
    }
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('enrollForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#f44336';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('enrollForm');
    const enrollBtn = document.querySelector('.enroll-btn');
    
    if (form && enrollBtn) {
        enrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
}

function handleFormSubmission() {
    const form = document.getElementById('enrollForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const selectedPayment = document.querySelector('input[name="paymentType"]:checked');
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
    
    const enrollmentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        experience: formData.get('experience'),
        goals: formData.get('goals'),
        paymentType: selectedPayment.value,
        coupon: appliedCoupon,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const enrollBtn = document.querySelector('.enroll-btn');
    const originalText = enrollBtn.innerHTML;
    enrollBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Processing...';
    enrollBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        enrollBtn.innerHTML = originalText;
        enrollBtn.disabled = false;
        
        // Show success message
        showNotification('Enrollment successful! Welcome to the course!', 'success');
        
        // Clear form
        form.reset();
        localStorage.removeItem('appliedCoupon');
        updatePricing();
        
        // Reset coupon input styling
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.style.borderColor = '#e4defe';
            couponInput.style.backgroundColor = 'white';
        }
        
        console.log('Enrollment Data:', enrollmentData);
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info';
    let title = 'Information';
    
    switch (type) {
        case 'success':
            icon = 'check_circle';
            title = 'Success';
            break;
        case 'error':
            icon = 'error';
            title = 'Error';
            break;
        case 'info':
            icon = 'info';
            title = 'Information';
            break;
    }
    
    notification.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add notification close button styles
const style = document.createElement('style');
style.textContent = `
    .notification-close {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #333;
    }
    
    .field-error {
        color: #f44336;
        font-size: 0.85rem;
        margin-top: 5px;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #f44336;
        background-color: rgba(244, 67, 54, 0.05);
    }
`;
document.head.appendChild(style); 