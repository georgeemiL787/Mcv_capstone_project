// Course Preview JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function showTab(tabId) {
    // Hide all tab panels
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Remove active class from all tab buttons
    tabButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Show target tab panel
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Add active class to clicked tab button
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      showTab(tabId);
    });
  });

  // Video functionality
  const videoContainer = document.querySelector('.video-container');
  const playBtn = document.querySelector('.play-btn');
  const videoPlaceholder = document.querySelector('.video-placeholder');

  if (playBtn) {
    playBtn.addEventListener('click', function() {
      // Simulate video playback
      console.log('Playing course introduction video...');
      
      // Replace placeholder with video player
      videoPlaceholder.innerHTML = `
        <div class="video-player">
          <div class="video-controls">
            <span class="material-symbols-outlined">play_arrow</span>
            <span class="material-symbols-outlined">volume_up</span>
            <span class="material-symbols-outlined">fullscreen</span>
          </div>
          <div class="video-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="time-display">0:00 / 2:45</span>
          </div>
        </div>
      `;
      
      // Hide play button
      this.style.display = 'none';
      
      // Simulate video progress
      let progress = 0;
      const progressFill = document.querySelector('.progress-fill');
      const timeDisplay = document.querySelector('.time-display');
      
      const progressInterval = setInterval(() => {
        progress += 1;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (timeDisplay) {
          const currentTime = Math.floor((progress / 100) * 165); // 2:45 = 165 seconds
          const minutes = Math.floor(currentTime / 60);
          const seconds = currentTime % 60;
          timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / 2:45`;
        }
        
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
    });
  }

  // Curriculum section expand/collapse
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const sectionContent = this.nextElementSibling;
      const expandIcon = this.querySelector('.material-symbols-outlined');
      
      if (sectionContent.style.display === 'none' || !sectionContent.style.display) {
        sectionContent.style.display = 'block';
        expandIcon.textContent = 'expand_less';
      } else {
        sectionContent.style.display = 'none';
        expandIcon.textContent = 'expand_more';
      }
    });
  });

  // Purchase functionality
  const enrollBtn = document.querySelector('.enroll-btn');
  const wishlistBtn = document.querySelector('.wishlist-btn');

  if (enrollBtn) {
    enrollBtn.addEventListener('click', function() {
      console.log('Enrolling in course...');
      
      // Add loading state
      const originalText = this.textContent;
      this.textContent = 'Processing...';
      this.disabled = true;
      
      // Simulate enrollment process
      setTimeout(() => {
        this.textContent = 'Enrolled!';
        this.style.background = '#10b981';
        
        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
          this.style.background = 'linear-gradient(135deg, #8f7efc, #7a6bfc)';
        }, 2000);
      }, 1500);
    });
  }

  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      console.log('Adding course to wishlist...');
      
      const heartIcon = this.querySelector('.material-symbols-outlined');
      const originalText = this.textContent;
      
      // Toggle wishlist state
      if (heartIcon.textContent === 'favorite_border') {
        heartIcon.textContent = 'favorite';
        this.textContent = 'Added to Wishlist';
        this.style.background = 'rgba(143, 126, 252, 0.1)';
      } else {
        heartIcon.textContent = 'favorite_border';
        this.textContent = originalText.replace('Added to Wishlist', 'Add to Wishlist');
        this.style.background = 'white';
      }
    });
  }

  // Related courses functionality
  const relatedCourses = document.querySelectorAll('.related-course');
  
  relatedCourses.forEach(course => {
    course.addEventListener('click', function() {
      const courseTitle = this.querySelector('h4').textContent;
      console.log(`Navigating to course: ${courseTitle}`);
      
      // Add click effect
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Rating functionality
  const stars = document.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    star.addEventListener('click', function() {
      const rating = index + 1;
      console.log(`Rating: ${rating} stars`);
      
      // Update star display
      stars.forEach((s, i) => {
        if (i <= index) {
          s.textContent = 'star';
          s.style.color = '#ffd700';
        } else {
          s.textContent = 'star_outline';
          s.style.color = '#ccc';
        }
      });
    });
    
    star.addEventListener('mouseenter', function() {
      const starIndex = Array.from(stars).indexOf(this);
      stars.forEach((s, i) => {
        if (i <= starIndex) {
          s.style.color = '#ffd700';
        }
      });
    });
    
    star.addEventListener('mouseleave', function() {
      stars.forEach(s => {
        s.style.color = '#ffd700'; // Keep filled stars gold
      });
    });
  });

  // Breadcrumb functionality
  const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
  
  breadcrumbLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.textContent;
      console.log(`Navigating to category: ${category}`);
      
      // Add click effect
      this.style.color = '#7a6bfc';
      setTimeout(() => {
        this.style.color = '#8f7efc';
      }, 200);
    });
  });

  // Course stats animation
  function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const finalValue = stat.textContent;
      const isPercentage = finalValue.includes('%');
      const isDecimal = finalValue.includes('.');
      
      let currentValue = 0;
      const targetValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
      const increment = targetValue / 50;
      
      const animate = () => {
        currentValue += increment;
        if (currentValue < targetValue) {
          if (isDecimal) {
            stat.textContent = currentValue.toFixed(1);
          } else {
            stat.textContent = Math.floor(currentValue);
          }
          requestAnimationFrame(animate);
        } else {
          stat.textContent = finalValue;
        }
      };
      
      animate();
    });
  }

  // Trigger stats animation when page loads
  setTimeout(animateStats, 500);

  // Smooth scrolling for anchor links
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

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    // Tab navigation with arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeTab = document.querySelector('.tab-btn.active');
      if (activeTab) {
        const tabs = Array.from(tabButtons);
        const currentIndex = tabs.indexOf(activeTab);
        let newIndex;
        
        if (e.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        tabs[newIndex].click();
      }
    }
    
    // Escape key to close any open modals or return to overview
    if (e.key === 'Escape') {
      showTab('overview');
    }
  });

  // Accessibility improvements
  tabButtons.forEach(button => {
    button.setAttribute('role', 'tab');
    button.setAttribute('tabindex', '0');
    
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focus management
  function manageFocus() {
    const activePanel = document.querySelector('.tab-panel.active');
    if (activePanel) {
      const firstFocusable = activePanel.querySelector('button, a, input, select, textarea');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  // Manage focus when tabs change
  const originalShowTab = showTab;
  showTab = function(tabId) {
    originalShowTab(tabId);
    setTimeout(manageFocus, 100);
  };

  // Add hover effects for interactive elements
  const interactiveElements = document.querySelectorAll('.course-card, .related-course, .review-item');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 20px rgba(143, 126, 252, 0.15)';
    });

    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 10px rgba(143, 126, 252, 0.1)';
    });
  });

  // Add loading states for buttons
  function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  }

  // Add loading state to action buttons
  const actionButtons = document.querySelectorAll('.enroll-btn, .wishlist-btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (!this.disabled) {
        addLoadingState(this);
      }
    });
  });

  // Simulate real-time updates
  function simulateUpdates() {
    // Update student count
    const studentCount = document.querySelector('.stat-item:nth-child(2) .stat-number');
    if (studentCount) {
      const currentCount = parseInt(studentCount.textContent.replace(/,/g, ''));
      const newCount = currentCount + Math.floor(Math.random() * 10);
      studentCount.textContent = newCount.toLocaleString();
    }
    
    // Update rating count
    const ratingCount = document.querySelector('.rating-count');
    if (ratingCount) {
      const currentCount = parseInt(ratingCount.textContent.match(/\d+/)[0]);
      const newCount = currentCount + Math.floor(Math.random() * 5);
      ratingCount.textContent = `(${newCount.toLocaleString()} ratings)`;
    }
  }

  // Run simulation updates every 30 seconds
  setInterval(simulateUpdates, 30000);

  // Add scroll to top functionality
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8f7efc, #7a6bfc);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(143, 126, 252, 0.3);
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  document.body.appendChild(scrollToTopBtn);
  
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Show/hide scroll to top button
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'flex';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  console.log('Course Preview initialized successfully!');
}); 