// Leaderboard JavaScript - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize leaderboard functionality
    initLeaderboard();
});

function initLeaderboard() {
    // Filter functionality
    initFilters();
    
    // Search functionality
    initSearch();
    
    // Pagination functionality
    initPagination();
    
    // Add hover effects and animations
    initAnimations();
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            
            // Apply filter
            applyFilter(filterType, leaderboardItems);
        });
    });
}

function applyFilter(filterType, items) {
    items.forEach(item => {
        const rank = parseInt(item.getAttribute('data-rank'));
        
        switch(filterType) {
            case 'all':
                item.style.display = 'grid';
                break;
            case 'top':
                if (rank <= 10) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
                break;
            case 'recent':
                // Show items with recent activity (online status)
                const activityStatus = item.querySelector('.activity-status');
                if (activityStatus && activityStatus.classList.contains('online')) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
                break;
        }
    });
    
    // Add animation effect
    animateFilterTransition();
}

function animateFilterTransition() {
    const visibleItems = document.querySelectorAll('.leaderboard-item[style*="grid"]');
    
    visibleItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initSearch() {
    const searchInput = document.querySelector('.student-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const leaderboardItems = document.querySelectorAll('.leaderboard-item');
            
            leaderboardItems.forEach(item => {
                const studentName = item.querySelector('.student-details h3').textContent.toLowerCase();
                const studentEmail = item.querySelector('.student-email').textContent.toLowerCase();
                
                if (studentName.includes(searchTerm) || studentEmail.includes(searchTerm)) {
                    item.style.display = 'grid';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0.3';
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

function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                // Remove active class from all buttons
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Simulate page change
                simulatePageChange();
            }
        });
    });
}

function simulatePageChange() {
    const leaderboardList = document.querySelector('.leaderboard-list');
    
    // Add loading effect
    leaderboardList.style.opacity = '0.5';
    leaderboardList.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        leaderboardList.style.transition = 'all 0.3s ease';
        leaderboardList.style.opacity = '1';
        leaderboardList.style.transform = 'translateY(0)';
    }, 300);
}

function initAnimations() {
    // Add entrance animations for leaderboard items
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
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
    
    leaderboardItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.3s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(item);
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
    
    // Add click effects for student avatars
    const studentAvatars = document.querySelectorAll('.student-avatar');
    
    studentAvatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            // Add pulse effect
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 8px 25px rgba(143, 126, 252, 0.4)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(143, 126, 252, 0.2)';
            }, 200);
            
            // Show student details (could be expanded to show a modal)
            const studentName = this.closest('.leaderboard-item').querySelector('.student-details h3').textContent;
            console.log(`Clicked on ${studentName}'s profile`);
        });
    });
}

// Add real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        const onlineStudents = document.querySelectorAll('.activity-status.online');
        const randomStudent = onlineStudents[Math.floor(Math.random() * onlineStudents.length)];
        
        if (randomStudent) {
            // Simulate activity update
            const timeElement = randomStudent.closest('.activity-section').querySelector('.activity-time');
            const times = ['Just now', '1 min ago', '2 min ago', '5 min ago'];
            timeElement.textContent = times[Math.floor(Math.random() * times.length)];
            
            // Add subtle animation
            timeElement.style.color = '#8f7efc';
            setTimeout(() => {
                timeElement.style.color = '#666';
            }, 1000);
        }
    }, 5000); // Update every 5 seconds
}

// Initialize real-time updates
setTimeout(simulateRealTimeUpdates, 2000);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const searchInput = document.querySelector('.student-search');
    
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

// Export functions for potential external use
window.Leaderboard = {
    initLeaderboard,
    applyFilter,
    simulatePageChange,
    smoothScrollTo
};
