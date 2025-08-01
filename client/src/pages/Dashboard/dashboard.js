// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to switch between sections
    function switchSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked nav item
        const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
            
            // Update URL hash
            window.location.hash = sectionId;
        });
    });

    // Handle URL hash on page load
    function handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        } else {
            // Default to overview if no valid hash
            switchSection('overview');
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial load
    handleHashChange();

    // XP Progress Animation
    function animateXPProgress() {
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const targetWidth = xpFill.style.width;
            xpFill.style.width = '0%';
            
            setTimeout(() => {
                xpFill.style.width = targetWidth;
            }, 500);
        }
    }

    // Stats Counter Animation
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-info h3');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Progress Circle Animation
    function animateProgressCircle() {
        const progressCircle = document.querySelector('.circle-progress');
        if (progressCircle) {
            const progress = parseInt(progressCircle.getAttribute('data-progress'));
            const degrees = (progress / 100) * 360;
            
            progressCircle.style.background = `conic-gradient(#8f7efc 0deg ${degrees}deg, #e4defe ${degrees}deg 360deg)`;
        }
    }

    // Quick Actions Button Interactions
    function setupQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span><span>Loading...</span>';
                this.disabled = true;
                
                // Simulate action
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // Show success message
                    showNotification('Action completed successfully!', 'success');
                }, 1500);
            });
        });
    }

    // Course Card Interactions
    function setupCourseCards() {
        const continueButtons = document.querySelectorAll('.continue-btn');
        const certificateButtons = document.querySelectorAll('.certificate-btn');
        
        continueButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.innerHTML = 'Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    showNotification('Redirecting to course...', 'info');
                }, 1000);
            });
        });
        
        certificateButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.innerHTML = 'Opening...';
                this.disabled = true;
                
                setTimeout(() => {
                    showNotification('Certificate opened in new tab', 'success');
                    this.innerHTML = 'View Certificate';
                    this.disabled = false;
                }, 1000);
            });
        });
    }

    // Reminder Actions
    function setupReminderActions() {
        const reminderActions = document.querySelectorAll('.reminder-action');
        
        reminderActions.forEach(action => {
            action.addEventListener('click', function() {
                const reminderItem = this.closest('.reminder-item');
                const actionText = this.textContent;
                
                this.innerHTML = 'Processing...';
                this.disabled = true;
                
                setTimeout(() => {
                    if (actionText === 'Take Quiz') {
                        showNotification('Opening quiz...', 'info');
                    } else if (actionText === 'Start') {
                        showNotification('Starting study session...', 'info');
                    } else if (actionText === 'Submit') {
                        showNotification('Project submitted successfully!', 'success');
                        reminderItem.style.opacity = '0.5';
                    }
                    
                    this.innerHTML = actionText;
                    this.disabled = false;
                }, 1000);
            });
        });
    }

    // Achievement Card Interactions
    function setupAchievementCards() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            card.addEventListener('click', function() {
                if (this.classList.contains('earned')) {
                    showNotification('Achievement unlocked!', 'success');
                } else if (this.classList.contains('locked')) {
                    showNotification('Complete requirements to unlock this achievement', 'info');
                }
            });
        });
    }

    // Skill Node Interactions
    function setupSkillNodes() {
        const skillNodes = document.querySelectorAll('.skill-node');
        
        skillNodes.forEach(node => {
            node.addEventListener('click', function() {
                const skillName = this.querySelector('h3').textContent;
                const status = this.querySelector('p').textContent;
                
                if (status === 'Completed') {
                    showNotification(`${skillName} - Completed!`, 'success');
                } else if (status === 'In Progress') {
                    showNotification(`Continue learning ${skillName}`, 'info');
                } else if (status === 'Locked') {
                    showNotification(`Complete prerequisites to unlock ${skillName}`, 'warning');
                }
            });
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-symbols-outlined">${getNotificationIcon(type)}</span>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(143, 126, 252, 0.2);
            border: 1px solid #e4defe;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Source Sans 3', sans-serif;
            font-size: 0.9rem;
            color: #333446;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    }

    // Progress Bar Animations
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 200);
                    
                    observer.unobserve(progressBar);
                }
            });
        });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Hover Effects for Cards
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.stat-card, .course-card, .achievement-card, .insight-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 30px rgba(143, 126, 252, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 20px rgba(143, 126, 252, 0.1)';
            });
        });
    }

    // Keyboard Navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close any open modals or notifications
                const notifications = document.querySelectorAll('.notification');
                notifications.forEach(notification => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                });
            }
        });
    }

    // Auto-refresh stats (simulate real-time updates)
    function setupAutoRefresh() {
        setInterval(() => {
            const studyTimeStat = document.querySelector('.stat-card:nth-child(2) .stat-info h3');
            if (studyTimeStat) {
                const currentTime = parseInt(studyTimeStat.textContent);
                studyTimeStat.textContent = currentTime + 1;
            }
        }, 60000); // Update every minute
    }

    // Initialize all functionality
    function init() {
        // Run animations on page load
        setTimeout(() => {
            animateXPProgress();
            animateStats();
            animateProgressCircle();
            animateProgressBars();
        }, 500);

        // Setup all interactive elements
        setupQuickActions();
        setupCourseCards();
        setupReminderActions();
        setupAchievementCards();
        setupSkillNodes();
        setupHoverEffects();
        setupKeyboardNavigation();
        setupAutoRefresh();

        // Add loading animation to page
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    // Initialize when DOM is ready
    init();

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Add accessibility improvements
    document.querySelectorAll('button, .nav-item, .course-card, .achievement-card, .skill-node').forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add focus indicators for better accessibility
    document.querySelectorAll('button, .nav-item, .action-btn').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #8f7efc';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}); 