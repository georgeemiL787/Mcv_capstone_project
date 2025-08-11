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
            
            setTimeout(() => {
                console.log(`Continuing course: ${courseTitle}`);
                // Here you would typically navigate to the course
                this.innerHTML = 'Continue Learning';
                this.style.pointerEvents = 'auto';
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
            } else {
                icon.textContent = 'favorite_border';
                icon.style.color = '#e74c3c';
                console.log(`Removed ${courseTitle} from favorites`);
            }
            
            // Add pulse animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
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
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .rating-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .rating-modal-content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(139, 126, 252, 0.1);
            border: 2px solid #e4defe;
        }
        .rating-modal-content h3 {
            color: #333446;
            margin: 0 0 20px 0;
            font-family: "Josefin Sans", sans-serif;
            font-weight: 600;
        }
        .rating-stars {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        }
        .star {
            font-size: 2rem;
            color: #ddd;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .star:hover,
        .star.active {
            color: #FFD700;
        }
        .rating-modal-content textarea {
            width: 100%;
            height: 100px;
            border: 1px solid #e4defe;
            border-radius: 8px;
            padding: 10px;
            font-family: "Source Sans 3", sans-serif;
            resize: vertical;
            margin-bottom: 20px;
        }
        .rating-actions {
            display: flex;
            gap: 10px;
        }
        .rating-actions button {
            flex: 1;
        }
    `;
    document.head.appendChild(style);
    
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
    });
    
    modal.querySelector('.cancel-rating').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.submit-rating').addEventListener('click', () => {
        if (selectedRating > 0) {
            console.log(`Rated "${courseTitle}" with ${selectedRating} stars`);
            document.body.removeChild(modal);
        }
    });
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
}

function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Add loading effect
            this.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Loading...';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = '<span class="material-symbols-outlined">expand_more</span> Load More Courses';
                this.style.pointerEvents = 'auto';
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
        searchInput.focus();
    }
    
    // Clear search on Escape
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
});

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
        const inProgressCards = document.querySelectorAll('.course-card.in-progress');
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
            }
        }
    }, 10000); // Update every 10 seconds
}

// Initialize real-time updates
setTimeout(simulateProgressUpdates, 5000);

// Export functions for potential external use
window.MyCourses = {
    initMyCourses,
    applyFilter,
    showRatingModal,
    smoothScrollTo
}; 