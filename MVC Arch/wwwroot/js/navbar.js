// Navbar JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar functionality
    initializeNavbar();
    
    // Check user authentication status (you can modify this based on your auth system)
    checkUserAuthStatus();
    
    // Initialize chatbot functionality
    initChatbot();
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
    // Desktop search
    const searchForm = document.getElementById('search-bar');
    const searchInput = document.getElementById('global-search-input');
    
    if (searchForm && searchInput) {
        // Handle form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
        
        // Handle Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
        
        // Handle search button click
        const searchButton = searchForm.querySelector('.search-submit-btn');
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            });
        }
    }
    
    // Mobile search
    const mobileSearchForm = document.querySelector('.mobile-search-bar form');
    const mobileSearchInput = document.querySelector('.mobile-search-input');
    
    if (mobileSearchForm && mobileSearchInput) {
        // Handle form submission
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = mobileSearchInput.value.trim();
            if (query) {
                performSearch(query);
                closeMobileMenu(); // Close mobile menu after search
            }
        });
        
        // Handle Enter key press
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query) {
                    performSearch(query);
                    closeMobileMenu(); // Close mobile menu after search
                }
            }
        });
        
        // Handle search button click
        const mobileSearchButton = mobileSearchForm.querySelector('.mobile-search-submit-btn');
        if (mobileSearchButton) {
            mobileSearchButton.addEventListener('click', function(e) {
                e.preventDefault();
                const query = mobileSearchInput.value.trim();
                if (query) {
                    performSearch(query);
                    closeMobileMenu(); // Close mobile menu after search
                }
            });
        }
    }
}

function performSearch(query) {
    // Redirect to OurCourses with search term
    const searchUrl = `/OurCourses?searchTerm=${encodeURIComponent(query)}`;
    window.location.href = searchUrl;
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

// Chatbot functionality
function initChatbot() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatInterface = document.getElementById('chat-interface');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    
    // Check if we're on login or signup pages - hide chatbot if so
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes('/account/login')) {
        if (chatbotButton) {
            chatbotButton.style.display = 'none';
        }
        return;
    }
    
    // Show chatbot for other pages
    if (chatbotButton) {
        chatbotButton.style.display = 'flex';
    }
    
    let isChatOpen = false;
    
    // Toggle chat interface
    chatbotButton.addEventListener('click', function() {
        if (!isChatOpen) {
            openChat();
        } else {
            closeChatInterface();
        }
    });

    // Close chat with close button
    closeChat.addEventListener('click', closeChatInterface);

    // Send message with send button
    sendButton.addEventListener('click', sendMessage);

    // Send message with Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (isChatOpen &&
            !chatInterface.contains(e.target) &&
            !chatbotButton.contains(e.target)) {
            closeChatInterface();
        }
    });

    function openChat() {
        isChatOpen = true;
        chatInterface.classList.add('active');
        chatInput.focus();

        // Add entrance animation
        chatbotButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            chatbotButton.style.transform = 'scale(1)';
        }, 200);
    }

    function closeChatInterface() {
        isChatOpen = false;
        chatInterface.classList.remove('active');
        chatInput.value = '';

        // Add exit animation
        chatbotButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            chatbotButton.style.transform = 'scale(1)';
        }, 200);
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        addTypingIndicator();

        try {
            // Get AI response from backend
            const botResponse = await getAIResponse(message);
            removeTypingIndicator();
            addMessage(botResponse, 'bot');
        } catch (error) {
            removeTypingIndicator();
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            console.error('Chat error:', error);
        }
    }

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'U' : 'AI';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const text = document.createElement('p');
        text.textContent = message;
        
        content.appendChild(text);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function getAIResponse(message) {
        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                return data.response;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            // Fallback response if API is not available
            return 'I apologize, but I\'m currently unable to process your request. Please try again later or contact our support team.';
        }
    }
}

