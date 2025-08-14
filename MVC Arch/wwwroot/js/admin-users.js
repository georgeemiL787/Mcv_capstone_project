// Admin Users Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Users JavaScript loaded');
    
    let currentPage = 1;
    let currentFilters = {
        searchTerm: '',
        roleFilter: '',
        statusFilter: ''
    };

    // Initialize the page
    initializeUsersPage();

    function initializeUsersPage() {
        console.log('Initializing users page...');
        
        // Test the ban functionality
        console.log('Testing ban function availability...');
        console.log('window.banUser:', typeof window.banUser);
        console.log('window.unbanUser:', typeof window.unbanUser);
        
        loadUsers();
        setupEventListeners();
        setupModalEventListeners();
    }

    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Search functionality
        const searchInput = document.getElementById('user-search');
        const searchBtn = document.getElementById('search-btn');
        
        console.log('Search input found:', searchInput);
        console.log('Search button found:', searchBtn);
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                currentFilters.searchTerm = this.value;
                currentPage = 1;
                loadUsers();
            }, 500));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                currentFilters.searchTerm = searchInput.value;
                currentPage = 1;
                loadUsers();
            });
        }

        // Filter controls
        const roleFilter = document.getElementById('role-filter');
        const statusFilter = document.getElementById('status-filter');
        
        console.log('Role filter found:', roleFilter);
        console.log('Status filter found:', statusFilter);
        
        if (roleFilter) {
            roleFilter.addEventListener('change', function() {
                currentFilters.roleFilter = this.value;
                currentPage = 1;
                loadUsers();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                currentFilters.statusFilter = this.value;
                currentPage = 1;
                loadUsers();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        console.log('Refresh button found:', refreshBtn);
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                console.log('Refresh button clicked');
                loadUsers();
            });
        }

        // Pagination
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-number')) {
                currentPage = parseInt(e.target.dataset.page);
                loadUsers();
            } else if (e.target.id === 'prev-page') {
                if (currentPage > 1) {
                    currentPage--;
                    loadUsers();
                }
            } else if (e.target.id === 'next-page') {
                currentPage++;
                loadUsers();
            }
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Add event delegation for action buttons
        document.addEventListener('click', function(e) {
            console.log('Document clicked:', e.target.tagName, e.target.className);
            
            // Find the closest button element (handles clicks on button children like icons)
            const button = e.target.closest('.ban-user-btn, .unban-user-btn, .view-user-btn, .edit-user-btn');
            
            if (button) {
                const userId = parseInt(button.dataset.userId);
                console.log('Button clicked:', button.className, 'for user:', userId);
                
                if (button.classList.contains('ban-user-btn')) {
                    console.log('Ban button clicked for user:', userId);
                    banUser(userId);
                } else if (button.classList.contains('unban-user-btn')) {
                    console.log('Unban button clicked for user:', userId);
                    unbanUser(userId);
                } else if (button.classList.contains('view-user-btn')) {
                    console.log('View button clicked for user:', userId);
                    viewUserDetails(userId);
                } else if (button.classList.contains('edit-user-btn')) {
                    console.log('Edit button clicked for user:', userId);
                    updateUserStatus(userId);
                }
            } else {
                console.log('No action button found for click target:', e.target);
            }
        });
    }

    function setupModalEventListeners() {
        // Setup ban modal event listeners
        const confirmBanBtn = document.getElementById('confirm-ban');
        if (confirmBanBtn) {
            confirmBanBtn.addEventListener('click', handleBanConfirmation);
        }

        // Setup unban modal event listeners
        const confirmUnbanBtn = document.getElementById('confirm-unban');
        if (confirmUnbanBtn) {
            confirmUnbanBtn.addEventListener('click', handleUnbanConfirmation);
        }

        // Setup close button event listeners
        const closeButtons = document.querySelectorAll('.close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    async function loadUsers() {
        console.log('Loading users...');
        const tableBody = document.getElementById('users-table-body');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noUsersMessage = document.getElementById('no-users-message');
        const paginationContainer = document.getElementById('pagination-container');

        console.log('Table body found:', tableBody);
        console.log('Loading indicator found:', loadingIndicator);
        console.log('No users message found:', noUsersMessage);
        console.log('Pagination container found:', paginationContainer);

        if (!tableBody) {
            console.error('Table body not found!');
            return;
        }

        // Show loading
        tableBody.innerHTML = '';
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (noUsersMessage) noUsersMessage.style.display = 'none';
        if (paginationContainer) paginationContainer.style.display = 'none';

        try {
            const params = new URLSearchParams({
                searchTerm: currentFilters.searchTerm,
                roleFilter: currentFilters.statusFilter,
                statusFilter: currentFilters.statusFilter,
                page: currentPage,
                pageSize: 20
            });

            console.log('Fetching users with params:', params.toString());
            console.log('API endpoint:', `/AdminPanel/GetUsers?${params}`);
            
            const response = await fetch(`/AdminPanel/GetUsers?${params}`);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const data = await response.json();
            console.log('Users response:', data);

            if (data.success) {
                console.log('Success! Users data:', data.data);
                console.log('Number of users:', data.data.length);
                displayUsers(data.data);
                updatePagination(data);
                if (paginationContainer) paginationContainer.style.display = 'block';
            } else {
                console.error('API returned error:', data.message);
                showError('Failed to load users: ' + data.message);
                if (noUsersMessage) noUsersMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading users:', error);
            showError('An error occurred while loading users');
            if (noUsersMessage) noUsersMessage.style.display = 'block';
        } finally {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }

    function displayUsers(users) {
        console.log('displayUsers called with:', users);
        const tableBody = document.getElementById('users-table-body');
        console.log('Table body in displayUsers:', tableBody);
        
        if (!tableBody) {
            console.error('Table body not found in displayUsers!');
            return;
        }

        if (users.length === 0) {
            console.log('No users to display');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <p style="color: var(--text-secondary); margin: 0;">No users found matching your criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        console.log('Displaying users:', users.length);
        const userRows = users.map(user => {
            console.log('Processing user:', user);
            return `
                <tr>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar">${user.firstName.charAt(0).toUpperCase()}</div>
                            <div class="user-details">
                                <h4>${user.firstName} ${user.lastName}</h4>
                                <span>ID: ${user.id}</span>
                            </div>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <div class="role-badge ${user.roles[0]?.toLowerCase() || 'unknown'}">
                            ${user.roles[0] || 'No Role'}
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${user.accountStatus.toLowerCase()}">${user.accountStatus}</span>
                        ${user.isBanned ? `
                            <div class="ban-info">
                                <p class="ban-reason">Reason: ${user.banReason || 'No reason provided'}</p>
                                <p class="ban-date">Banned: ${new Date(user.bannedAt).toLocaleDateString()}</p>
                                <p class="ban-admin">By: ${user.bannedByAdmin || 'Unknown'}</p>
                            </div>
                        ` : ''}
                    </td>
                    <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
                    <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-secondary btn-sm view-user-btn" data-user-id="${user.id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                            ${user.isBanned ? 
                                `<button class="btn-primary btn-sm unban-user-btn" data-user-id="${user.id}">
                                    <i class="fas fa-unlock"></i> Unban
                                </button>` :
                                `<button class="btn-danger btn-sm ban-user-btn" data-user-id="${user.id}">
                                    <i class="fas fa-ban"></i> Ban
                                </button>`
                            }
                            <button class="btn-secondary btn-sm edit-user-btn" data-user-id="${user.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        console.log('Generated user rows:', userRows.length);
        tableBody.innerHTML = userRows.join('');
        console.log('Table body updated with users');
        
        // Debug: Check if buttons are properly generated
        const banButtons = tableBody.querySelectorAll('.ban-user-btn');
        const unbanButtons = tableBody.querySelectorAll('.unban-user-btn');
        const viewButtons = tableBody.querySelectorAll('.view-user-btn');
        const editButtons = tableBody.querySelectorAll('.edit-user-btn');
        
        console.log('Generated buttons:', {
            banButtons: banButtons.length,
            unbanButtons: unbanButtons.length,
            viewButtons: viewButtons.length,
            editButtons: editButtons.length
        });
        
        // Debug: Check first ban button if it exists
        if (banButtons.length > 0) {
            const firstBanBtn = banButtons[0];
            console.log('First ban button:', {
                className: firstBanBtn.className,
                dataset: firstBanBtn.dataset,
                innerHTML: firstBanBtn.innerHTML
            });
        }
        
        // Debug: Check first unban button if it exists
        if (unbanButtons.length > 0) {
            const firstUnbanBtn = unbanButtons[0];
            console.log('First unban button:', {
                className: firstUnbanBtn.className,
                dataset: firstUnbanBtn.dataset,
                innerHTML: firstUnbanBtn.innerHTML
            });
        }
    }

    function updatePagination(data) {
        const paginationContainer = document.getElementById('pagination-container');
        const paginationInfo = document.getElementById('pagination-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');

        if (!paginationContainer || !paginationInfo || !prevBtn || !nextBtn || !pageNumbers) return;

        // Pagination info
        const startItem = ((data.currentPage - 1) * data.pageSize) + 1;
        const endItem = Math.min(data.currentPage * data.pageSize, data.totalCount);
        paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${data.totalCount} users`;

        // Previous/Next buttons
        prevBtn.disabled = data.currentPage <= 1;
        nextBtn.disabled = data.currentPage >= data.totalPages;

        // Page numbers
        pageNumbers.innerHTML = '';
        const startPage = Math.max(1, data.currentPage - 2);
        const endPage = Math.min(data.totalPages, data.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.className = `page-number ${i === data.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            pageNumbers.appendChild(pageBtn);
        }
    }

    // User Actions
    window.banUser = function(userId) {
        console.log('=== BAN USER FUNCTION CALLED ===');
        console.log('banUser called with userId:', userId);
        
        const modal = document.getElementById('ban-user-modal');
        const reasonInput = document.getElementById('ban-reason');

        console.log('Modal element:', modal);
        console.log('Reason input element:', reasonInput);

        if (modal) {
            console.log('Modal found, displaying it...');
            modal.style.display = 'block';
            reasonInput.value = '';
            
            // Store the userId in the modal for the confirmation handler
            modal.dataset.userId = userId;
        } else {
            console.error('Ban modal not found!');
        }
    };

    window.unbanUser = function(userId) {
        console.log('=== UNBAN USER FUNCTION CALLED ===');
        console.log('unbanUser called with userId:', userId);
        
        const modal = document.getElementById('unban-user-modal');
        const reasonInput = document.getElementById('unban-reason');

        console.log('Unban modal element:', modal);
        console.log('Unban reason input element:', reasonInput);

        if (modal) {
            console.log('Unban modal found, displaying it...');
            modal.style.display = 'block';
            reasonInput.value = '';
            
            // Store the userId in the modal for the confirmation handler
            modal.dataset.userId = userId;
        } else {
            console.error('Unban modal not found!');
        }
    };

    // Handle ban confirmation
    async function handleBanConfirmation() {
        const modal = document.getElementById('ban-user-modal');
        const reasonInput = document.getElementById('ban-reason');
        const userId = parseInt(modal.dataset.userId);

        if (!userId) {
            showError('User ID not found');
            return;
        }

        const reason = reasonInput.value.trim();
        if (!reason) {
            showError('Please provide a reason for banning this user');
            return;
        }

        try {
            console.log('Sending ban request for user:', userId, 'with reason:', reason);
            const response = await fetch('/AdminPanel/BanUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, reason })
            });

            const result = await response.json();
            console.log('Ban response:', result);
            
            if (result.success) {
                showSuccess('User banned successfully');
                closeModal('ban-user-modal');
                loadUsers(); // Refresh the users list
                
                // Redirect back to admin panel users section
                setTimeout(() => {
                    window.location.href = '/AdminPanel#users';
                }, 1500);
            } else {
                showError('Failed to ban user: ' + result.message);
            }
        } catch (error) {
            console.error('Error banning user:', error);
            showError('An error occurred while banning the user');
        }
    }

    // Handle unban confirmation
    async function handleUnbanConfirmation() {
        const modal = document.getElementById('unban-user-modal');
        const reasonInput = document.getElementById('unban-reason');
        const userId = parseInt(modal.dataset.userId);

        if (!userId) {
            showError('User ID not found');
            return;
        }

        const reason = reasonInput.value.trim();

        try {
            console.log('Sending unban request for user:', userId, 'with reason:', reason);
            const response = await fetch('/AdminPanel/UnbanUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, reason })
            });

            const result = await response.json();
            console.log('Unban response:', result);
            
            if (result.success) {
                showSuccess('User unbanned successfully');
                closeModal('unban-user-modal');
                loadUsers(); // Refresh the users list
                
                // Redirect back to admin panel users section
                setTimeout(() => {
                    window.location.href = '/AdminPanel#users';
                }, 1500);
            } else {
                showError('Failed to unban user: ' + result.message);
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            showError('An error occurred while unbanning the user');
        }
    }

    window.updateUserStatus = function(userId) {
        const newStatus = prompt('Enter new status (Active, Inactive, Banned):');
        if (!newStatus) return;

        const validStatuses = ['Active', 'Inactive', 'Banned'];
        if (!validStatuses.includes(newStatus)) {
            showError('Invalid status. Please use: Active, Inactive, or Banned');
            return;
        }

        updateUserStatusAsync(userId, newStatus);
    };

    async function updateUserStatusAsync(userId, newStatus) {
        try {
            const response = await fetch('/AdminPanel/UpdateUserStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newStatus })
            });

            const result = await response.json();
            if (result.success) {
                showSuccess('User status updated successfully');
                loadUsers();
            } else {
                showError('Failed to update user status: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            showError('An error occurred while updating user status');
        }
    }

    window.viewUserDetails = function(userId) {
        // This would open a modal with detailed user information
        // For now, just show an alert
        showNotification(`Viewing details for user ID: ${userId}`, 'info');
    };

    // Utility Functions
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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

    // Notification Functions
    function showSuccess(message) {
        showNotification(message, 'success');
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Modal functions
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };

    
});
