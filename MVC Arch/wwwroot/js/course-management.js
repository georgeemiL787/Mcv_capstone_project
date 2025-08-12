// Course Management JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCourseManagement();
});

function initializeCourseManagement() {
    // Initialize all components
    initializeAlerts();
    initializeCourseCards();
    initializeActionButtons();
    initializeSearchAndFilters();
    initializeAnimations();
}

// Auto-dismiss alerts with enhanced styling
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Add entrance animation
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            alert.style.transition = 'all 0.5s ease-out';
            alert.style.opacity = '1';
            alert.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert && alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
        
        // Add click to dismiss functionality
        alert.addEventListener('click', function() {
            const bsAlert = new bootstrap.Alert(this);
            bsAlert.close();
        });
    });
}

// Enhanced course card interactions
function initializeCourseCards() {
    const courseCards = document.querySelectorAll('.course-management-card');
    
    courseCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
            
            // Add subtle glow effect
            this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
            this.style.borderColor = 'rgba(0,0,0,0.125)';
        });
        
        // Add click effect
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons or forms
            if (e.target.closest('button') || e.target.closest('form') || e.target.closest('a')) {
                return;
            }
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Enhanced action buttons with confirmations and feedback
function initializeActionButtons() {
    // Delete confirmation
    const deleteButtons = document.querySelectorAll('a[asp-action="Delete"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('⚠️ Are you sure you want to delete this course?\n\nThis action cannot be undone and will remove all course data permanently.')) {
                e.preventDefault();
                return false;
            }
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
            this.style.pointerEvents = 'none';
            
            // Reset after a delay (in case of navigation)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
    });
    
    // Toggle publish confirmation
    const toggleButtons = document.querySelectorAll('form[asp-action="TogglePublish"] button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const action = this.title === 'Publish' ? 'publish' : 'unpublish';
            const actionText = action === 'publish' ? 'make this course visible to students' : 'hide this course from students';
            
            if (!confirm(`Are you sure you want to ${action} this course?\n\nThis will ${actionText}.`)) {
                e.preventDefault();
                return false;
            }
            
            // Add loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Reset after form submission
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 2000);
        });
    });
    
    // Edit button enhancement
    const editButtons = document.querySelectorAll('a[asp-action="Edit"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Search and filter functionality (if needed)
function initializeSearchAndFilters() {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-management-card');
            
            courseCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();
                const category = card.querySelector('.text-muted').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.4s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Enhanced animations and effects
function initializeAnimations() {
    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe course cards for scroll animations
    document.querySelectorAll('.course-management-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Export functions for global access
window.CourseManagement = {
    showNotification,
    initializeCourseManagement
};
