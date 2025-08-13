// Admin Courses Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let currentFilters = {
        filter: 'all',
        searchTerm: '',
        categoryFilter: ''
    };

    // Initialize the page
    initializeCoursesPage();

    function initializeCoursesPage() {
        loadCourses();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('course-search');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                currentFilters.searchTerm = this.value;
                currentPage = 1;
                loadCourses();
            }, 500));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                currentFilters.searchTerm = searchInput.value;
                currentPage = 1;
                loadCourses();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                currentFilters.categoryFilter = this.value;
                currentPage = 1;
                loadCourses();
            });
        }

        // Status tabs
        const statusTabs = document.querySelectorAll('.status-tab');
        statusTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                statusTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                currentFilters.filter = this.dataset.filter;
                currentPage = 1;
                loadCourses();
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                loadCourses();
            });
        }

        // Pagination
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-number')) {
                currentPage = parseInt(e.target.dataset.page);
                loadCourses();
            } else if (e.target.id === 'prev-page') {
                if (currentPage > 1) {
                    currentPage--;
                    loadCourses();
                }
            } else if (e.target.id === 'next-page') {
                currentPage++;
                loadCourses();
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
    }

    async function loadCourses() {
        console.log('Loading courses with filters:', currentFilters, 'page:', currentPage);
        
        const coursesGrid = document.getElementById('courses-grid');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noCoursesMessage = document.getElementById('no-courses-message');
        const paginationContainer = document.getElementById('pagination-container');

        if (!coursesGrid) {
            console.error('Courses grid not found');
            return;
        }

        // Show loading
        coursesGrid.innerHTML = '';
        loadingIndicator.style.display = 'block';
        noCoursesMessage.style.display = 'none';
        paginationContainer.style.display = 'none';

        try {
            const params = new URLSearchParams({
                filter: currentFilters.filter,
                searchTerm: currentFilters.searchTerm,
                categoryFilter: currentFilters.categoryFilter,
                page: currentPage,
                pageSize: 20
            });

            const response = await fetch(`/AdminPanel/GetCourses?${params}`);
            const data = await response.json();
            
            console.log('Courses data received:', data);

            if (data.success) {
                console.log('Displaying courses:', data.data.length, 'courses');
                displayCourses(data.data);
                updatePagination(data);
                paginationContainer.style.display = 'block';
            } else {
                console.error('Failed to load courses:', data.message);
                showError('Failed to load courses: ' + data.message);
                noCoursesMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            showError('An error occurred while loading courses');
            noCoursesMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function displayCourses(courses) {
        console.log('Displaying courses function called with:', courses.length, 'courses');
        
        const coursesGrid = document.getElementById('courses-grid');
        if (!coursesGrid) {
            console.error('Courses grid not found in displayCourses');
            return;
        }

        if (courses.length === 0) {
            console.log('No courses to display, showing empty message');
            coursesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="color: var(--text-secondary); margin: 0;">No courses found matching your criteria.</p>
                </div>
            `;
            return;
        }

        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-header">
                    <h3>${course.title}</h3>
                    <span class="status-badge ${course.approvalStatus.toLowerCase()}">${course.approvalStatus}</span>
                </div>
                
                <div class="course-meta">
                    <span><strong>Instructor:</strong> ${course.instructorName}</span>
                    <span><strong>Category:</strong> ${course.category}</span>
                    <span><strong>Price:</strong> $${course.price}</span>
                    <span><strong>Students:</strong> ${course.studentCount}</span>
                    <span><strong>Rating:</strong> ${course.averageRating.toFixed(1)} (${course.reviewCount})</span>
                    <span><strong>Modules:</strong> ${course.moduleCount}</span>
                </div>
                
                <div class="course-timeline">
                    <strong>Created:</strong> ${formatDate(course.createdAt)} | 
                    <strong>Updated:</strong> ${formatDate(course.updatedAt)}
                    ${course.publishedAt ? `| <strong>Published:</strong> ${formatDate(course.publishedAt)}` : ''}
                    ${course.approvedAt ? `| <strong>Approved:</strong> ${formatDate(course.approvedAt)}` : ''}
                    ${course.rejectedAt ? `| <strong>Rejected:</strong> ${formatDate(course.rejectedAt)}` : ''}
                </div>
                
                ${course.rejectionReason ? `
                    <div class="rejection-reason">
                        <strong>Rejection Reason:</strong> ${course.rejectionReason}
                    </div>
                ` : ''}
                
                                 <div class="course-actions">
                     ${!course.isApproved && !course.isRejected ? `
                         <button class="btn btn-approve" onclick="approveCourse(${course.id})">
                             <i class="fas fa-check"></i> Approve
                         </button>
                         <button class="btn btn-reject" onclick="rejectCourse(${course.id})">
                             <i class="fas fa-times"></i> Reject
                         </button>
                     ` : ''}
                     <button class="btn btn-primary" onclick="viewCourseDetails(${course.id})">
                         <i class="fas fa-eye"></i> Details
                     </button>
                 </div>
            </div>
        `).join('');
    }

    function updatePagination(data) {
        const paginationContainer = document.getElementById('pagination-container');
        const paginationInfo = document.getElementById('pagination-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');

        if (!paginationContainer || !paginationInfo || !prevBtn || !nextBtn || !pageNumbers) return;

        // Pagination info
        paginationInfo.textContent = `Showing ${((data.currentPage - 1) * data.pageSize) + 1} to ${Math.min(data.currentPage * data.pageSize, data.totalCount)} of ${data.totalCount} courses`;

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

    // Course Actions
    window.approveCourse = async function(courseId) {
        if (!confirm('Are you sure you want to approve this course?')) return;

        try {
            console.log('Approving course:', courseId);
            
            // Find the course card and show loading state
            const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
            if (courseCard) {
                courseCard.style.opacity = '0.5';
                courseCard.style.pointerEvents = 'none';
            }
            
            const response = await fetch('/AdminPanel/ApproveCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseId })
            });

            const result = await response.json();
            console.log('Approve response:', result);
            
            if (result.success) {
                showSuccess('Course approved successfully');
                
                // Immediately update the UI to show the course is approved
                if (courseCard) {
                    // Update the status badge
                    const statusBadge = courseCard.querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.textContent = 'Approved';
                        statusBadge.className = 'status-badge approved';
                    }
                    
                    // Remove approve/reject buttons and show only details button
                    const courseActions = courseCard.querySelector('.course-actions');
                    if (courseActions) {
                        courseActions.innerHTML = `
                            <button class="btn btn-primary" onclick="viewCourseDetails(${courseId})">
                                <i class="fas fa-eye"></i> Details
                            </button>
                        `;
                    }
                    
                    // Restore the card appearance
                    courseCard.style.opacity = '1';
                    courseCard.style.pointerEvents = 'auto';
                }
                
                // Force a fresh reload of courses data to update counts and ensure consistency
                currentPage = 1; // Reset to first page
                await loadCourses(); // Wait for the load to complete
                
                // Auto-refresh after 3 seconds to ensure everything is up to date
                showSuccess('Course approved successfully! Auto-refreshing in 3 seconds...');
                
                let countdown = 3;
                const countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        showSuccess(`Course approved successfully! Auto-refreshing in ${countdown} seconds...`);
                    } else {
                        clearInterval(countdownInterval);
                        console.log('Auto-refreshing courses after 3 seconds...');
                        loadCourses();
                    }
                }, 1000);
            } else {
                showError('Failed to approve course: ' + result.message);
                
                // Restore the card appearance on error
                if (courseCard) {
                    courseCard.style.opacity = '1';
                    courseCard.style.pointerEvents = 'auto';
                }
            }
        } catch (error) {
            console.error('Error approving course:', error);
            showError('An error occurred while approving the course');
            
            // Restore the card appearance on error
            const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
            if (courseCard) {
                courseCard.style.opacity = '1';
                courseCard.style.pointerEvents = 'auto';
            }
        }
    };

    window.rejectCourse = function(courseId) {
        console.log('rejectCourse called with courseId:', courseId);
        
        const modal = document.getElementById('reject-course-modal');
        const reasonInput = document.getElementById('reject-reason');
        const confirmBtn = document.getElementById('confirm-reject');

        console.log('Modal elements found:', { 
            modal: !!modal, 
            reasonInput: !!reasonInput, 
            confirmBtn: !!confirmBtn 
        });

        if (modal && reasonInput && confirmBtn) {
            // Show the modal
            modal.style.display = 'block';
            console.log('Modal displayed');
            
            // Clear previous reason
            reasonInput.value = '';
            
            // Store the courseId for the confirm button
            confirmBtn.dataset.courseId = courseId;
            
            // Set up the confirm button click event
            confirmBtn.onclick = async function() {
                console.log('Confirm reject button clicked');
                const reason = reasonInput.value.trim();
                if (!reason) {
                    showError('Please provide a reason for rejecting this course');
                    return;
                }

                try {
                    console.log('Sending reject request for course:', courseId, 'with reason:', reason);
                    const response = await fetch('/AdminPanel/RejectCourse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ courseId, reason })
                    });

                    const result = await response.json();
                    console.log('Reject response:', result);
                    
                    if (result.success) {
                        showSuccess('Course rejected successfully');
                        closeModal('reject-course-modal');
                        
                        // Immediately update the UI to show the course is rejected
                        const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
                        if (courseCard) {
                            // Update the status badge
                            const statusBadge = courseCard.querySelector('.status-badge');
                            if (statusBadge) {
                                statusBadge.textContent = 'Rejected';
                                statusBadge.className = 'status-badge rejected';
                            }
                            
                            // Remove approve/reject buttons and show only details button
                            const courseActions = courseCard.querySelector('.course-actions');
                            if (courseActions) {
                                courseActions.innerHTML = `
                                    <button class="btn btn-primary" onclick="viewCourseDetails(${courseId})">
                                        <i class="fas fa-eye"></i> Details
                                    </button>
                                `;
                            }
                        }
                        
                        // Force a fresh reload of courses data to update counts and ensure consistency
                        currentPage = 1; // Reset to first page
                        await loadCourses(); // Wait for the load to complete
                        
                        // Auto-refresh after 3 seconds to ensure everything is up to date
                        showSuccess('Course rejected successfully! Auto-refreshing in 3 seconds...');
                        
                        let countdown = 3;
                        const countdownInterval = setInterval(() => {
                            countdown--;
                            if (countdown > 0) {
                                showSuccess(`Course rejected successfully! Auto-refreshing in ${countdown} seconds...`);
                            } else {
                                clearInterval(countdownInterval);
                                console.log('Auto-refreshing courses after 3 seconds...');
                                loadCourses();
                            }
                        }, 1000);
                    } else {
                        showError('Failed to reject course: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error rejecting course:', error);
                    showError('An error occurred while rejecting the course');
                }
            };
            
            console.log('Reject course modal setup complete');
        } else {
            console.error('Modal elements not found:', { modal, reasonInput, confirmBtn });
            showError('Modal elements not found. Please refresh the page.');
        }
    };

    window.viewCourseDetails = async function(courseId) {
        try {
            const response = await fetch(`/AdminPanel/GetCourseDetails?courseId=${courseId}`);
            const result = await response.json();
            
            if (result.success) {
                displayCourseDetails(result.data);
                document.getElementById('course-details-modal').style.display = 'block';
            } else {
                showError('Failed to load course details: ' + result.message);
            }
        } catch (error) {
            console.error('Error loading course details:', error);
            showError('An error occurred while loading course details');
        }
    };

    function displayCourseDetails(courseData) {
        const content = document.getElementById('course-details-content');
        if (!content) return;

        const course = courseData.course;
        const modules = courseData.modules;
        const reviews = courseData.reviews;
        const enrollments = courseData.enrollments;

        content.innerHTML = `
            <div class="course-details-header">
                <h3>${course.title}</h3>
                <span class="status-badge ${course.approvalStatus.toLowerCase()}">${course.approvalStatus}</span>
            </div>
            
            <div class="course-details-info">
                <p><strong>Description:</strong> ${course.description}</p>
                <p><strong>Instructor:</strong> ${course.instructorName} (${course.instructorEmail})</p>
                <p><strong>Category:</strong> ${course.category}</p>
                <p><strong>Difficulty:</strong> ${course.difficulty}</p>
                <p><strong>Price:</strong> $${course.price}</p>
                <p><strong>Duration:</strong> ${course.duration} hours</p>
                <p><strong>Students:</strong> ${course.studentCount}</p>
                <p><strong>Rating:</strong> ${course.averageRating.toFixed(1)} (${course.reviewCount} reviews)</p>
            </div>
            
            <div class="course-details-sections">
                <div class="course-section">
                    <h4>Modules (${modules.length})</h4>
                    <ul>
                        ${modules.map(module => `<li>${module.title}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="course-section">
                    <h4>Recent Reviews (${reviews.length})</h4>
                    <ul>
                        ${reviews.slice(0, 5).map(review => `<li>${review.comment} - Rating: ${review.rating}/5</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

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

    function showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.className = 'notification-message';
        messageContainer.textContent = message;
        
        // Create progress bar for countdown notifications
        if (message.includes('Auto-refreshing in')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'notification-progress';
            progressBar.style.width = '100%';
            progressBar.style.height = '3px';
            progressBar.style.background = 'rgba(255, 255, 255, 0.3)';
            progressBar.style.borderRadius = '2px';
            progressBar.style.overflow = 'hidden';
            
            const progressFill = document.createElement('div');
            progressFill.style.width = '100%';
            progressFill.style.height = '100%';
            progressFill.style.background = 'white';
            progressFill.style.transition = 'width 1s linear';
            progressFill.style.transform = 'translateX(-100%)';
            
            progressBar.appendChild(progressFill);
            notification.appendChild(messageContainer);
            notification.appendChild(progressBar);
            
            // Animate progress bar
            setTimeout(() => {
                progressFill.style.transform = 'translateX(0)';
            }, 100);
        } else {
            notification.appendChild(messageContainer);
        }
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after specified duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Modal functions
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            console.log(`Modal ${modalId} closed`);
        } else {
            console.error(`Modal ${modalId} not found`);
        }
    };

    // Initialize modals when page loads
    function initializeModals() {
        const rejectModal = document.getElementById('reject-course-modal');
        const courseDetailsModal = document.getElementById('course-details-modal');
        
        if (rejectModal) {
            console.log('Reject course modal found and initialized');
        } else {
            console.error('Reject course modal not found');
        }
        
        if (courseDetailsModal) {
            console.log('Course details modal found and initialized');
        } else {
            console.error('Course details modal not found');
        }
    }

    // Call initializeModals when the page loads
    initializeModals();
});
