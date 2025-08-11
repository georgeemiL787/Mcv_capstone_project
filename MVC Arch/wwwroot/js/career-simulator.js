// Career Simulator JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Navigation functionality
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');

  // Function to show content section
  function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update navigation active state
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
  }

  // Add click event listeners to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      showSection(sectionId);
    });
  });

  // Handle hash changes for direct links
  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      showSection(hash);
    } else {
      showSection('overview');
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Handle initial load
  handleHashChange();

  // Leaderboard tab functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Here you would typically load different leaderboard data
      // For now, we'll just show a console message
      const tabName = this.getAttribute('data-tab');
      console.log(`Switched to ${tabName} leaderboard`);
    });
  });

  // Button interactions
  const primaryButtons = document.querySelectorAll('.btn-primary');
  const secondaryButtons = document.querySelectorAll('.btn-secondary');

  primaryButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      
      switch(buttonText) {
        case 'Start Scenario':
          console.log('Starting scenario...');
          // Add scenario start logic here
          break;
        case 'Practice Now':
          console.log('Starting skill practice...');
          // Add skill practice logic here
          break;
        case 'Join Challenge':
          console.log('Joining challenge...');
          // Add challenge join logic here
          break;
        default:
          console.log(`Primary button clicked: ${buttonText}`);
      }
    });
  });

  secondaryButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      
      switch(buttonText) {
        case 'Preview':
          console.log('Previewing scenario...');
          // Add preview logic here
          break;
        case 'View Leaderboard':
          console.log('Viewing leaderboard...');
          // Add leaderboard view logic here
          break;
        case 'Set Reminder':
          console.log('Setting reminder...');
          // Add reminder logic here
          break;
        case 'Learn More':
          console.log('Learning more...');
          // Add learn more logic here
          break;
        case 'View Results':
          console.log('Viewing results...');
          // Add results view logic here
          break;
        case 'Replay':
          console.log('Replaying challenge...');
          // Add replay logic here
          break;
        default:
          console.log(`Secondary button clicked: ${buttonText}`);
      }
    });
  });

  // Progress circle animation
  function animateProgressCircle() {
    const progressCircle = document.querySelector('.circle-progress');
    if (progressCircle) {
      const progress = progressCircle.getAttribute('data-progress');
      const degrees = (progress / 100) * 360;
      
      // Animate the progress circle
      progressCircle.style.background = `conic-gradient(#8f7efc 0deg ${degrees}deg, #e4defe ${degrees}deg 360deg)`;
    }
  }

  // Animate progress bars
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.width = width;
      }, 500);
    });
  }

  // Initialize animations when overview section is shown
  const overviewSection = document.getElementById('overview');
  if (overviewSection) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (overviewSection.classList.contains('active')) {
            animateProgressCircle();
            animateProgressBars();
          }
        }
      });
    });

    observer.observe(overviewSection, {
      attributes: true
    });
  }

  // Simulate real-time updates
  function simulateUpdates() {
    // Update activity times
    const activityTimes = document.querySelectorAll('.activity-time');
    activityTimes.forEach(time => {
      const text = time.textContent;
      if (text.includes('ago')) {
        // This would be replaced with real-time updates
        console.log('Updating activity time:', text);
      }
    });

    // Update challenge participants
    const participantCounts = document.querySelectorAll('.challenge-meta span');
    participantCounts.forEach(span => {
      if (span.textContent.includes('Participants:')) {
        // This would be replaced with real-time updates
        console.log('Updating participant count:', span.textContent);
      }
    });
  }

  // Run simulation updates every 30 seconds
  setInterval(simulateUpdates, 30000);

  // Add hover effects for cards
  const cards = document.querySelectorAll('.scenario-card, .skill-card, .challenge-card, .stat-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 20px rgba(143, 126, 252, 0.15)';
    });

    card.addEventListener('mouseleave', function() {
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

  // Add loading state to scenario and challenge buttons
  const startButtons = document.querySelectorAll('.scenario-actions .btn-primary, .challenge-actions .btn-primary');
  startButtons.forEach(button => {
    button.addEventListener('click', function() {
      addLoadingState(this);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close any open modals or return to overview
      showSection('overview');
    }
  });

  // Accessibility improvements
  navItems.forEach(item => {
    item.setAttribute('role', 'tab');
    item.setAttribute('tabindex', '0');
    
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focus management
  function manageFocus() {
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
      const firstFocusable = activeSection.querySelector('button, a, input, select, textarea');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  // Manage focus when sections change
  const originalShowSection = showSection;
  showSection = function(sectionId) {
    originalShowSection(sectionId);
    setTimeout(manageFocus, 100);
  };

  console.log('Career Simulator initialized successfully!');
}); 