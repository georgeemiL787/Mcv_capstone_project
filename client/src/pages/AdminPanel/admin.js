// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation items and content sections
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');

  // Function to show a specific section
  function showSection(sectionId) {
    // Hide all content sections
    contentSections.forEach(section => {
      section.classList.remove('active');
    });

    // Remove active class from all nav items
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Add active class to the clicked nav item
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }

    // Update URL hash
    window.location.hash = sectionId;
  }

  // Add click event listeners to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      showSection(sectionId);
    });
  });

  // Handle initial load based on URL hash
  function handleInitialLoad() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      showSection(hash);
    } else {
      // Default to dashboard if no hash or invalid hash
      showSection('dashboard');
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      showSection(hash);
    }
  });

  // Initialize the page
  handleInitialLoad();

  // Add hover effects for interactive elements
  const interactiveElements = document.querySelectorAll('.btn-small, .btn-success, .btn-danger, .btn-warning, .btn-secondary, .action-btn, .filter-tab');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-1px)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Handle form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your form submission logic here
      console.log('Form submitted:', this);
    });
  });

  // Handle search functionality
  const searchInputs = document.querySelectorAll('.search-box input');
  searchInputs.forEach(input => {
    input.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      // Add your search logic here
      console.log('Searching for:', searchTerm);
    });
  });

  // Handle filter tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Add your filter logic here
      const filterType = this.textContent.toLowerCase();
      console.log('Filtering by:', filterType);
    });
  });

  // Handle toggle switches
  const toggleSwitches = document.querySelectorAll('.toggle-switch input');
  toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const isEnabled = this.checked;
      const toolName = this.closest('.ai-tool-card')?.querySelector('h3')?.textContent || 'Setting';
      console.log(`${toolName} ${isEnabled ? 'enabled' : 'disabled'}`);
    });
  });

  // Add loading states for buttons
  const actionButtons = document.querySelectorAll('.btn-success, .btn-danger, .btn-warning, .action-btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const originalText = this.textContent;
      this.textContent = 'Processing...';
      this.disabled = true;
      
      // Simulate processing time
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 2000);
    });
  });

  // Handle user table actions
  const userActionButtons = document.querySelectorAll('.action-buttons .btn-small');
  userActionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.toLowerCase();
      const userName = this.closest('.table-row')?.querySelector('h4')?.textContent || 'User';
      
      if (action === 'ban') {
        if (confirm(`Are you sure you want to ban ${userName}?`)) {
          console.log(`Banning user: ${userName}`);
          // Add your ban logic here
        }
      } else if (action === 'view') {
        console.log(`Viewing user: ${userName}`);
        // Add your view logic here
      }
    });
  });

  // Handle course management actions
  const courseActionButtons = document.querySelectorAll('.course-actions .btn-success, .course-actions .btn-danger, .course-actions .btn-warning');
  courseActionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.toLowerCase();
      const courseName = this.closest('.course-card')?.querySelector('h3')?.textContent || 'Course';
      
      if (action === 'approve') {
        if (confirm(`Are you sure you want to approve "${courseName}"?`)) {
          console.log(`Approving course: ${courseName}`);
          // Add your approve logic here
        }
      } else if (action === 'reject') {
        if (confirm(`Are you sure you want to reject "${courseName}"?`)) {
          console.log(`Rejecting course: ${courseName}`);
          // Add your reject logic here
        }
      } else if (action === 'unpublish') {
        if (confirm(`Are you sure you want to unpublish "${courseName}"?`)) {
          console.log(`Unpublishing course: ${courseName}`);
          // Add your unpublish logic here
        }
      }
    });
  });

  // Handle content moderation actions
  const moderationButtons = document.querySelectorAll('.moderation-actions .btn-danger, .moderation-actions .btn-warning');
  moderationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.toLowerCase();
      
      if (action === 'remove') {
        if (confirm('Are you sure you want to remove this content?')) {
          console.log('Removing flagged content');
          // Add your remove logic here
        }
      } else if (action === 'warn user') {
        if (confirm('Are you sure you want to warn this user?')) {
          console.log('Warning user');
          // Add your warn logic here
        }
      }
    });
  });

  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          showSection('dashboard');
          break;
        case '2':
          e.preventDefault();
          showSection('users');
          break;
        case '3':
          e.preventDefault();
          showSection('courses');
          break;
        case '4':
          e.preventDefault();
          showSection('content');
          break;
        case '5':
          e.preventDefault();
          showSection('analytics');
          break;
        case '6':
          e.preventDefault();
          showSection('ai-tools');
          break;
        case '7':
          e.preventDefault();
          showSection('revenue');
          break;
        case '8':
          e.preventDefault();
          showSection('settings');
          break;
      }
    }
  });

  // Add tooltips for keyboard shortcuts
  const navItemsWithShortcuts = document.querySelectorAll('.nav-item');
  navItemsWithShortcuts.forEach((item, index) => {
    const shortcut = index + 1;
    item.title = `${item.textContent.trim()} (Ctrl+${shortcut})`;
  });

  // Handle responsive sidebar toggle (for mobile)
  const sidebarToggle = document.createElement('button');
  sidebarToggle.className = 'sidebar-toggle';
  sidebarToggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';
  sidebarToggle.style.cssText = `
    position: fixed;
    top: 70px;
    left: 20px;
    z-index: 1000;
    background: linear-gradient(45deg, #8f7efc, #CDC1FF);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    display: none;
    box-shadow: 0 2px 8px rgba(143, 126, 252, 0.3);
  `;

  document.body.appendChild(sidebarToggle);

  // Show/hide sidebar toggle based on screen size
  function handleResponsiveSidebar() {
    if (window.innerWidth <= 768) {
      sidebarToggle.style.display = 'block';
      document.querySelector('.admin-sidebar').style.display = 'none';
    } else {
      sidebarToggle.style.display = 'none';
      document.querySelector('.admin-sidebar').style.display = 'block';
    }
  }

  // Toggle sidebar on mobile
  sidebarToggle.addEventListener('click', function() {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar.style.display === 'none' || sidebar.style.display === '') {
      sidebar.style.display = 'block';
    } else {
      sidebar.style.display = 'none';
    }
  });

  // Handle window resize
  window.addEventListener('resize', handleResponsiveSidebar);
  handleResponsiveSidebar();

  // Add smooth scrolling for better UX
  const smoothScrollElements = document.querySelectorAll('a[href^="#"]');
  smoothScrollElements.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  console.log('Admin Panel initialized successfully!');
}); 