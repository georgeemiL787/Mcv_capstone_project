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

    // Load data for the section
    loadSectionData(sectionId);
  }

  // Add click event listeners to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      
      console.log('Navigation item clicked:', sectionId);
      
      // Handle special navigation for Users section
      if (sectionId === 'users') {
        console.log('Redirecting to Users view...');
        window.location.href = '/AdminPanel/Users';
        return;
      }
      
      showSection(sectionId);
    });
  });

  // Handle initial load based on URL hash
  function handleInitialLoad() {
    const hash = window.location.hash.substring(1);
    console.log('Initial load - hash:', hash);
    
    if (hash && document.getElementById(hash)) {
      // Don't show users section if it's in the hash, redirect to Users view
      if (hash === 'users') {
        console.log('Hash is users, redirecting to Users view...');
        window.location.href = '/AdminPanel/Users';
        return;
      }
      showSection(hash);
    } else {
      // Default to dashboard if no hash or invalid hash
      console.log('No valid hash, showing dashboard...');
      showSection('dashboard');
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    console.log('Hash changed to:', hash);
    
    if (hash && document.getElementById(hash)) {
      // Don't show users section if it's in the hash, redirect to Users view
      if (hash === 'users') {
        console.log('Hash changed to users, redirecting to Users view...');
        window.location.href = '/AdminPanel/Users';
        return;
      }
      showSection(hash);
    }
  });

  // Initialize the page
  handleInitialLoad();

  // Load data for different sections
  function loadSectionData(sectionId) {
    switch (sectionId) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'courses':
        loadCourses();
        break;
      case 'content':
        loadContent();
        break;
      case 'analytics':
        loadAnalytics();
        break;
      case 'revenue':
        loadRevenue();
        break;
    }
  }

  // Dashboard data loading
  async function loadDashboardData() {
    try {
      const response = await fetch('/AdminPanel/GetDashboardStats');
      const result = await response.json();
      
      if (result.success) {
        updateDashboardStats(result.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // Update dashboard statistics
  function updateDashboardStats(data) {
    document.getElementById('total-users').textContent = data.totalUsers.toLocaleString();
    document.getElementById('total-courses').textContent = data.totalCourses.toLocaleString();
    document.getElementById('total-revenue').textContent = `$${data.totalRevenue.toLocaleString()}`;
    document.getElementById('pending-courses').textContent = data.pendingCourses.toLocaleString();
  }

  // Load courses
  async function loadCourses(filter = 'all') {
    try {
      const response = await fetch(`/AdminPanel/GetCourses?filter=${filter}`);
      const result = await response.json();
      
      if (result.success) {
        displayCourses(result.data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  // Display courses in the grid
  function displayCourses(courses) {
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = '';

    courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      
      let statusClass, statusText, statusIcon;
      
      if (course.isRejected) {
        statusClass = 'rejected';
        statusText = 'Rejected';
        statusIcon = '❌';
      } else if (course.isApproved) {
        statusClass = 'approved';
        statusText = 'Approved';
        statusIcon = '✅';
      } else {
        statusClass = 'pending';
        statusText = 'Pending Review';
        statusIcon = '⏳';
      }
      
      card.innerHTML = `
        <div class="course-header">
          <h3>${course.title}</h3>
          <span class="status-badge ${statusClass}">${statusIcon} ${statusText}</span>
        </div>
        <p>${course.description}</p>
        <div class="course-meta">
          <span><strong>Instructor:</strong> ${course.instructorName}</span>
          <span><strong>Email:</strong> ${course.instructorEmail}</span>
          <span><strong>Duration:</strong> ${Math.round(course.duration / 60)} hours</span>
          <span><strong>Category:</strong> ${course.category}</span>
          <span><strong>Difficulty:</strong> ${course.difficulty}</span>
          <span><strong>Price:</strong> $${course.price}</span>
          <span><strong>Modules:</strong> ${course.moduleCount}</span>
          <span><strong>Students:</strong> ${course.studentCount}</span>
          <span><strong>Rating:</strong> ${course.averageRating.toFixed(1)}/5</span>
        </div>
        <div class="course-timeline">
          <small class="text-muted">
            <strong>Created:</strong> ${new Date(course.createdAt).toLocaleDateString()}
            ${course.updatedAt ? `<br><strong>Updated:</strong> ${new Date(course.updatedAt).toLocaleDateString()}` : ''}
            ${course.approvedAt ? `<br><strong>Approved:</strong> ${new Date(course.approvedAt).toLocaleDateString()}` : ''}
            ${course.rejectedAt ? `<br><strong>Rejected:</strong> ${new Date(course.rejectedAt).toLocaleDateString()}` : ''}
          </small>
        </div>
        ${course.rejectionReason ? `
          <div class="rejection-reason">
            <strong>Rejection Reason:</strong> ${course.rejectionReason}
          </div>
        ` : ''}
        <div class="course-actions">
          ${!course.isApproved && !course.isRejected ? `
            <button class="btn-success" onclick="approveCourse(${course.id})">✅ Approve</button>
            <button class="btn-danger" onclick="rejectCourse(${course.id})">❌ Reject</button>
          ` : ''}
          ${course.isRejected ? `
            <button class="btn-warning" onclick="viewCourseDetails(${course.id})">👁️ View Details</button>
          ` : ''}
          <button class="btn-secondary" onclick="viewCourse(${course.id})">📖 Preview</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Load content for moderation
  async function loadContent() {
    try {
      const response = await fetch('/AdminPanel/GetFlaggedContent');
      const result = await response.json();
      
      if (result.success) {
        displayContent(result.data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  // Display content for moderation
  function displayContent(contentList) {
    const container = document.getElementById('content-list');
    container.innerHTML = '';

    contentList.forEach(content => {
      const item = document.createElement('div');
      item.className = 'content-item';
      item.innerHTML = `
        <div class="content-info">
          <h4>${content.type}</h4>
          <p>${content.content}</p>
          <span class="content-meta">Reported ${getTimeAgo(new Date(content.reportedAt))}</span>
        </div>
        <div class="content-actions">
          <button class="btn-success" onclick="approveContent(${content.id})">Approve</button>
          <button class="btn-danger" onclick="removeContent(${content.id})">Remove</button>
          <button class="btn-warning" onclick="flagContent(${content.id})">Flag</button>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // Load analytics
  async function loadAnalytics() {
    try {
      const response = await fetch('/AdminPanel/GetAnalytics');
      const result = await response.json();
      
      if (result.success) {
        displayAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  // Display analytics
  function displayAnalytics(data) {
    const container = document.getElementById('analytics-grid');
    container.innerHTML = `
      <div class="analytics-card">
        <h3>User Growth</h3>
        <div class="chart-placeholder">
          <div class="chart-data">
            ${data.userGrowth.map(item => `<div class="chart-bar" style="height: ${Math.min(item.count * 2, 100)}%"><span>${item.count}</span></div>`).join('')}
          </div>
          <div class="chart-labels">
            ${data.userGrowth.map(item => `<span>${item.period}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="analytics-card">
        <h3>Course Performance</h3>
        <div class="chart-placeholder">
          <div class="performance-list">
            ${data.coursePerformance.map(course => `
              <div class="performance-item">
                <span class="course-name">${course.title}</span>
                <span class="enrollment-count">${course.enrollmentCount} students</span>
                <span class="rating">${course.averageRating.toFixed(1)}/5</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Load revenue data
  async function loadRevenue() {
    try {
      const response = await fetch('/AdminPanel/GetRevenueData');
      const result = await response.json();
      
      if (result.success) {
        displayRevenue(result.data);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    }
  }

  // Display revenue data
  function displayRevenue(data) {
    const container = document.getElementById('revenue-summary');
    container.innerHTML = `
      <div class="revenue-card">
        <h3>Monthly Revenue</h3>
        <p class="revenue-amount">$${data.totalRevenue.toLocaleString()}</p>
        <span class="revenue-change positive">+15% from last month</span>
      </div>
      <div class="revenue-card">
        <h3>Total Subscriptions</h3>
        <p class="revenue-amount">${data.totalSubscriptions.toLocaleString()}</p>
        <span class="revenue-change positive">+8% from last month</span>
      </div>
    `;
  }

  // Event listeners for refresh buttons
  document.getElementById('refresh-courses').addEventListener('click', () => loadCourses());
  document.getElementById('refresh-content').addEventListener('click', loadContent);

  // Course filter tabs
  document.querySelectorAll('[data-filter]').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('[data-filter]').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      loadCourses(this.dataset.filter);
    });
  });

  // Settings save
  document.getElementById('save-settings').addEventListener('click', async function() {
    const settings = {
      platformName: document.getElementById('platform-name').value,
      maintenanceMode: document.getElementById('maintenance-mode').checked,
      emailNotifications: document.getElementById('email-notifications').checked
    };

    try {
      const response = await fetch('/AdminPanel/UpdateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      const result = await response.json();
      if (result.success) {
        showNotification('Settings saved successfully!', 'success');
      } else {
        showNotification('Error saving settings: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Error saving settings', 'error');
    }
  });

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

  // Utility functions
  function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
    
    return date.toLocaleDateString();
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});

// Global functions for course actions
async function approveCourse(courseId) {
  try {
    const response = await fetch('/AdminPanel/ApproveCourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `courseId=${courseId}`
    });

    const result = await response.json();
    if (result.success) {
      showNotification('Course approved successfully!', 'success');
      loadCourses(); // Refresh the courses list
    } else {
      showNotification('Error approving course: ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Error approving course:', error);
    showNotification('Error approving course', 'error');
  }
}

async function rejectCourse(courseId) {
  // Show rejection modal
  const modal = document.getElementById('reject-course-modal');
  modal.style.display = 'block';
  
  // Store course ID for confirmation
  modal.dataset.courseId = courseId;
}

// Confirm course rejection
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('confirm-reject').addEventListener('click', async function() {
    const modal = document.getElementById('reject-course-modal');
    const courseId = modal.dataset.courseId;
    const reason = document.getElementById('rejection-reason').value;
    
    if (!reason.trim()) {
      showNotification('Please provide a rejection reason', 'error');
      return;
    }

    try {
      const response = await fetch('/AdminPanel/RejectCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `courseId=${courseId}&reason=${encodeURIComponent(reason)}`
      });

      const result = await response.json();
      if (result.success) {
        showNotification('Course rejected successfully!', 'success');
        closeModal('reject-course-modal');
        loadCourses(); // Refresh the courses list
      } else {
        showNotification('Error rejecting course: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Error rejecting course:', error);
      showNotification('Error rejecting course', 'error');
    }
  });
});

function viewCourse(courseId) {
  // Implement course view functionality
  showNotification('Course view functionality coming soon!', 'info');
}

// Content moderation functions
function approveContent(contentId) {
  showNotification('Content approved!', 'success');
}

function removeContent(contentId) {
  showNotification('Content removed!', 'success');
}

function flagContent(contentId) {
  showNotification('Content flagged!', 'info');
}

// Modal functions
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.getElementById('rejection-reason').value = '';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});

// Global notification function
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
} 