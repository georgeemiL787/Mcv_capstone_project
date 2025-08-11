// My Courses JavaScript - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize My Courses functionality
    initMyCourses();
});

function initMyCourses() {
    // Filter functionality
    initFilters();
    
    // Search functionality
    initSearch();
    
    // Course actions functionality
    initCourseActions();
    
    // Add hover effects and animations
    initAnimations();
    
    // Load more functionality
    initLoadMore();
    
    // Initialize real-time updates
    setTimeout(simulateProgressUpdates, 5000);
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            
            // Apply filter
            applyFilter(filterType, courseCards);
        });
    });
}

function applyFilter(filterType, cards) {
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        switch(filterType) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'in-progress':
                if (category === 'in-progress') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
            case 'completed':
                if (category === 'completed') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
            case 'favorites':
                // Check if course has favorite icon filled
                const favoriteBtn = card.querySelector('.favorite-btn .material-symbols-outlined');
                if (favoriteBtn && favoriteBtn.textContent === 'favorite') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
        }
    });
    
    // Add animation effect
    animateFilterTransition();
}

function animateFilterTransition() {
    const visibleCards = document.querySelectorAll('.course-card[style*="block"]');
    
    visibleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initSearch() {
    const searchInput = document.querySelector('.course-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-card');
            
            courseCards.forEach(card => {
                const courseTitle = card.querySelector('.course-header h3').textContent.toLowerCase();
                const instructor = card.querySelector('.instructor').textContent.toLowerCase();
                
                if (courseTitle.includes(searchTerm) || instructor.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0.3';
                }
            });
        });
        
        // Clear search functionality
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.dispatchEvent(new Event('input'));
            }
        });
    }
}

function initCourseActions() {
    // Continue Learning buttons
    const continueButtons = document.querySelectorAll('.btn-primary');
    continueButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('.course-header h3').textContent;
            
            // Add loading effect
            this.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Loading...';
            this.style.pointerEvents = 'none';
            this.classList.add('loading');
            
            setTimeout(() => {
                console.log(`Continuing course: ${courseTitle}`);
                // Here you would typically navigate to the course
                this.innerHTML = 'Continue Learning';
                this.style.pointerEvents = 'auto';
                this.classList.remove('loading');
            }, 1000);
        });
    });
    
    // Favorite buttons
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const icon = this.querySelector('.material-symbols-outlined');
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('.course-header h3').textContent;
            
            if (icon.textContent === 'favorite_border') {
                icon.textContent = 'favorite';
                icon.style.color = '#e74c3c';
                console.log(`Added ${courseTitle} to favorites`);
                
                // Add success animation
                this.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => {
                    this.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            } else {
                icon.textContent = 'favorite_border';
                icon.style.color = '#e74c3c';
                console.log(`Removed ${courseTitle} from favorites`);
                
                // Add removal animation
                this.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Certificate buttons
    const certificateButtons = document.querySelectorAll('.certificate-btn');
    certificateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('.course-header h3').textContent;
            
            console.log(`Viewing certificate for: ${courseTitle}`);
            // Here you would typically open a certificate modal or download
            showCertificateModal(courseTitle);
        });
    });
    
    // Rate Course buttons
    const rateButtons = document.querySelectorAll('.btn-secondary');
    rateButtons.forEach(button => {
        if (button.textContent === 'Rate Course') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const courseCard = this.closest('.course-card');
                const courseTitle = courseCard.querySelector('.course-header h3').textContent;
                
                console.log(`Rating course: ${courseTitle}`);
                // Here you would typically open a rating modal
                showRatingModal(courseTitle);
            });
        }
    });
}

function showCertificateModal(courseTitle) {
    // Create certificate modal
    const modal = document.createElement('div');
    modal.className = 'rating-modal';
    modal.innerHTML = `
        <div class="rating-modal-content">
            <h3>Certificate for "${courseTitle}"</h3>
            <div style="text-align: center; margin: 20px 0;">
                <span class="material-symbols-outlined" style="font-size: 4rem; color: #8f7efc;">verified</span>
                <p style="color: #666; margin: 10px 0;">Congratulations! You've completed this course.</p>
            </div>
            <div class="rating-actions">
                <button class="btn-secondary cancel-certificate">Close</button>
                <button class="btn-primary download-certificate">Download PDF</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.cancel-certificate').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.download-certificate').addEventListener('click', () => {
        console.log(`Downloading certificate for: ${courseTitle}`);
        // Here you would typically trigger a download
        document.body.removeChild(modal);
    });
}

function showRatingModal(courseTitle) {
    // Create rating modal
    const modal = document.createElement('div');
    modal.className = 'rating-modal';
    modal.innerHTML = `
        <div class="rating-modal-content">
            <h3>Rate "${courseTitle}"</h3>
            <div class="rating-stars">
                <span class="star" data-rating="1">★</span>
                <span class="star" data-rating="2">★</span>
                <span class="star" data-rating="3">★</span>
                <span class="star" data-rating="4">★</span>
                <span class="star" data-rating="5">★</span>
            </div>
            <textarea placeholder="Write your review (optional)"></textarea>
            <div class="rating-actions">
                <button class="btn-secondary cancel-rating">Cancel</button>
                <button class="btn-primary submit-rating">Submit Rating</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const stars = modal.querySelectorAll('.star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        // Add hover effects
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#FFD700';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    modal.querySelector('.cancel-rating').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.submit-rating').addEventListener('click', () => {
        if (selectedRating > 0) {
            const review = modal.querySelector('textarea').value;
            console.log(`Rated "${courseTitle}" with ${selectedRating} stars`);
            console.log(`Review: ${review}`);
            document.body.removeChild(modal);
            
            // Show success message
            showSuccessMessage(`Thank you for rating "${courseTitle}"!`);
        }
    });
}

function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #8f7efc 0%, #7a6afc 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(143, 126, 252, 0.3);
        z-index: 1001;
        font-family: "Source Sans 3", sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    successMsg.textContent = message;
    
    // Add animation styles
    if (!document.querySelector('#success-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'success-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 300);
    }, 3000);
}

function initAnimations() {
    // Add entrance animations for course cards
    const courseCards = document.querySelectorAll('.course-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    courseCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(card);
    });
    
    // Add hover effects for progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            const fill = this.querySelector('.progress-fill');
            fill.style.transform = 'scaleY(1.2)';
        });
        
        bar.addEventListener('mouseleave', function() {
            const fill = this.querySelector('.progress-fill');
            fill.style.transform = 'scaleY(1)';
        });
    });
    
    // Add click effects for course images
    const courseImages = document.querySelectorAll('.course-image');
    
    courseImages.forEach(image => {
        image.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('.course-header h3').textContent;
            
            // Add pulse effect
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            console.log(`Clicked on course: ${courseTitle}`);
        });
    });
    
    // Add hover effects for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Add loading effect
            this.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Loading...';
            this.style.pointerEvents = 'none';
            this.classList.add('loading');
            
            setTimeout(() => {
                this.innerHTML = '<span class="material-symbols-outlined">expand_more</span> Load More Courses';
                this.style.pointerEvents = 'auto';
                this.classList.remove('loading');
                console.log('Loading more courses...');
                // Here you would typically load more courses from an API
            }, 1500);
        });
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const searchInput = document.querySelector('.course-search');
    
    // Focus search on Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Clear search on Escape
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
    
    // Navigate courses with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateCourses(e.key);
    }
});

function navigateCourses(direction) {
    const visibleCards = Array.from(document.querySelectorAll('.course-card[style*="block"]'));
    const currentFocus = document.activeElement;
    let currentIndex = -1;
    
    // Find current focused item
    if (currentFocus.closest('.course-card')) {
        currentIndex = visibleCards.indexOf(currentFocus.closest('.course-card'));
    }
    
    let nextIndex;
    if (direction === 'ArrowDown') {
        nextIndex = currentIndex < visibleCards.length - 1 ? currentIndex + 1 : 0;
    } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : visibleCards.length - 1;
    }
    
    // Focus next item
    const nextCard = visibleCards[nextIndex];
    if (nextCard) {
        const focusableElement = nextCard.querySelector('.course-image, .course-header h3, .btn-primary');
        if (focusableElement) {
            focusableElement.focus();
            smoothScrollTo(nextCard);
        }
    }
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Simulate real-time progress updates
function simulateProgressUpdates() {
    setInterval(() => {
        const inProgressCards = document.querySelectorAll('.course-card[data-category="in-progress"]');
        const randomCard = inProgressCards[Math.floor(Math.random() * inProgressCards.length)];
        
        if (randomCard) {
            const progressFill = randomCard.querySelector('.progress-fill');
            const progressText = randomCard.querySelector('.progress-text');
            const currentWidth = parseInt(progressFill.style.width) || 0;
            
            if (currentWidth < 100) {
                const newWidth = Math.min(currentWidth + Math.random() * 2, 100);
                progressFill.style.width = newWidth + '%';
                progressText.textContent = Math.round(newWidth) + '% Complete';
                
                // Add subtle animation
                progressFill.style.transition = 'width 0.5s ease';
                setTimeout(() => {
                    progressFill.style.transition = 'width 0.3s ease';
                }, 500);
                
                // Check if course is completed
                if (newWidth >= 100) {
                    randomCard.setAttribute('data-category', 'completed');
                    const statusElement = randomCard.querySelector('.course-status');
                    if (statusElement) {
                        statusElement.textContent = 'Completed';
                        statusElement.classList.add('completed');
                    }
                }
            }
        }
    }, 10000); // Update every 10 seconds
}

// Add accessibility improvements
function improveAccessibility() {
    // Add ARIA labels
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach((card, index) => {
        const courseTitle = card.querySelector('.course-header h3');
        const progress = card.querySelector('.progress-text');
        
        if (courseTitle && progress) {
            card.setAttribute('aria-label', `${courseTitle.textContent}: ${progress.textContent}`);
        }
    });
    
    // Add keyboard navigation support
    const interactiveElements = document.querySelectorAll('.course-image, .course-header h3, .btn-primary, .btn-secondary');
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(improveAccessibility, 1000);
});

// Export functions for potential external use
window.MyCourses = {
    initMyCourses,
    applyFilter,
    showRatingModal,
    showCertificateModal,
    showSuccessMessage,
    smoothScrollTo,
    navigateCourses
}; 