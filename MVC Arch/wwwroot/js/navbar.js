// Navbar JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar functionality
    initializeNavbar();
    
    // Check user authentication status (you can modify this based on your auth system)
    checkUserAuthStatus();
});

function initializeNavbar() {
    // Profile dropdown functionality
    const userAvatar = document.querySelector('.user-avatar');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (userAvatar && profileDropdown) {
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userAvatar.contains(event.target) && !profileDropdown.contains(event.target)) {
                closeProfileDropdown();
            }
        });
    }
    
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    if (mobileMenuToggle && mobileNavMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            openMobileMenu();
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Active navigation link highlighting
    highlightActiveNavLink();
}

function toggleProfileDropdown() {
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileDropdown) {
        if (profileDropdown.classList.contains('show')) {
            closeProfileDropdown();
        } else {
            openProfileDropdown();
        }
    }
}

function openProfileDropdown() {
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileDropdown) {
        profileDropdown.classList.add('show');
        
        // Add animation class for smooth entrance
        setTimeout(() => {
            profileDropdown.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
    }
}

function closeProfileDropdown() {
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileDropdown) {
        profileDropdown.classList.remove('show');
    }
}

function openMobileMenu() {
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavMenu) {
        mobileNavMenu.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
}

function closeMobileMenu() {
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavMenu) {
        mobileNavMenu.classList.remove('show');
        document.body.style.overflow = ''; // Restore body scroll
    }
}

function checkUserAuthStatus() {
    // This function should check if the user is logged in
    // For now, we'll simulate a logged-in state
    // In a real application, you would check your authentication system
    
    // Simulate user authentication check
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showUserProfile();
    } else {
        showGuestButtons();
    }
}

function showUserProfile() {
    const userProfileSection = document.getElementById('user-profile-section');
    const guestButtons = document.getElementById('guest-buttons');
    
    if (userProfileSection && guestButtons) {
        userProfileSection.style.display = 'flex';
        guestButtons.style.display = 'none';
    }
}

function showGuestButtons() {
    const userProfileSection = document.getElementById('user-profile-section');
    const guestButtons = document.getElementById('guest-buttons');
    
    if (userProfileSection && guestButtons) {
        userProfileSection.style.display = 'none';
        guestButtons.style.display = 'flex';
    }
}

function highlightActiveNavLink() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.split('/').pop())) {
            link.classList.add('active');
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            if (query.length > 2) {
                // Implement search functionality here
                console.log('Searching for:', query);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    // Perform search
                    performSearch(query);
                }
            }
        });
    }
}

function performSearch(query) {
    // Implement your search logic here
    console.log('Performing search for:', query);
    
    // Example: redirect to search results page
    // window.location.href = `/Search?q=${encodeURIComponent(query)}`;
}

// User authentication functions (to be integrated with your auth system)
function loginUser() {
    // Simulate user login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'John Doe');
    localStorage.setItem('userRole', 'Student');
    
    // Refresh the page or update UI
    location.reload();
}

function logoutUser() {
    // Simulate user logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    // Close dropdown
    closeProfileDropdown();
    
    // Refresh the page or update UI
    location.reload();
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Close mobile menu on window resize if it's open
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Close profile dropdown on window resize
    closeProfileDropdown();
});

// Add smooth scrolling for navigation links
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
