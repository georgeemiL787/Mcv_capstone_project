// Function to set active navigation item
function setActiveNavItem(pageName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageName) {
      item.classList.add('active');
    }
  });
}

// Function to load page content
function loadPageContent(pageName) {
  const contentArea = document.getElementById('main-content');
  
  // Set active navigation
  setActiveNavItem(pageName);
  
  // Load content based on page
  switch(pageName) {
    case 'quiz-center':
      contentArea.innerHTML = getQuizCenterContent();
      break;
    case 'upcoming-quizzes':
      contentArea.innerHTML = getUpcomingQuizzesContent();
      break;
    case 'quiz-history':
      contentArea.innerHTML = getQuizHistoryContent();
      break;
    case 'performance':
      contentArea.innerHTML = getPerformanceContent();
      break;
    case 'practice':
      contentArea.innerHTML = getPracticeContent();
      break;
    case 'settings':
      contentArea.innerHTML = getSettingsContent();
      break;
    default:
      contentArea.innerHTML = getQuizCenterContent();
  }
}

// Quiz Center Main Content
function getQuizCenterContent() {
  return `
    <div class="content-header">
      <h1>Quiz Center</h1>
      <p>Manage your quizzes, track progress, and improve your performance</p>
    </div>

    <div class="quiz-overview">
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon">
            <span class="material-symbols-outlined">schedule</span>
          </div>
          <div class="card-content">
            <h3>5</h3>
            <p>Upcoming Quizzes</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <div class="card-content">
            <h3>23</h3>
            <p>Completed Quizzes</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">
            <span class="material-symbols-outlined">trending_up</span>
          </div>
          <div class="card-content">
            <h3>87%</h3>
            <p>Average Score</p>
          </div>
        </div>
      </div>
    </div>

    <div class="quiz-sections">
      <div class="section-card">
        <div class="section-header">
          <h2>Upcoming Quizzes</h2>
          <button class="view-all-btn" onclick="loadPageContent('upcoming-quizzes')">View All</button>
        </div>
        <div class="quiz-list" id="upcoming-quizzes-list">
          <!-- Upcoming quizzes will be loaded here -->
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h2>Recent Quiz History</h2>
          <button class="view-all-btn" onclick="loadPageContent('quiz-history')">View All</button>
        </div>
        <div class="quiz-list" id="recent-history-list">
          <!-- Recent quiz history will be loaded here -->
        </div>
      </div>
    </div>
  `;
}

// Upcoming Quizzes Content
function getUpcomingQuizzesContent() {
  return `
    <div class="content-header">
      <h1>Upcoming Quizzes</h1>
      <p>Quizzes you need to complete and their deadlines</p>
    </div>

    <div class="quiz-container">
      <div class="quiz-filters">
        <select class="filter-select">
          <option value="all">All Courses</option>
          <option value="hpc">High Performance Computing</option>
          <option value="ml">Machine Learning</option>
          <option value="ai">Artificial Intelligence</option>
        </select>
        <select class="filter-select">
          <option value="all">All Status</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      <div class="quiz-list" id="upcoming-quizzes-full">
        <!-- Full upcoming quizzes list will be loaded here -->
      </div>
    </div>
  `;
}

// Quiz History Content
function getQuizHistoryContent() {
  return `
    <div class="content-header">
      <h1>Quiz History</h1>
      <p>Review your completed quizzes and performance</p>
    </div>

    <div class="quiz-container">
      <div class="quiz-filters">
        <select class="filter-select">
          <option value="all">All Courses</option>
          <option value="hpc">High Performance Computing</option>
          <option value="ml">Machine Learning</option>
          <option value="ai">Artificial Intelligence</option>
        </select>
        <select class="filter-select">
          <option value="all">All Scores</option>
          <option value="excellent">90%+</option>
          <option value="good">80-89%</option>
          <option value="average">70-79%</option>
          <option value="needs-improvement">Below 70%</option>
        </select>
      </div>

      <div class="quiz-list" id="quiz-history-full">
        <!-- Full quiz history will be loaded here -->
      </div>
    </div>
  `;
}

// Performance Content
function getPerformanceContent() {
  return `
    <div class="content-header">
      <h1>Performance Analytics</h1>
      <p>Track your learning progress and identify areas for improvement</p>
    </div>

    <div class="performance-grid">
      <div class="performance-card">
        <h3>Score Trends</h3>
        <div class="chart-placeholder">
          <span class="material-symbols-outlined">show_chart</span>
          <p>Score trend chart will be displayed here</p>
        </div>
      </div>
      <div class="performance-card">
        <h3>Course Performance</h3>
        <div class="course-stats">
          <!-- Course statistics will be loaded here -->
        </div>
      </div>
    </div>
  `;
}

// Practice Mode Content
function getPracticeContent() {
  return `
    <div class="content-header">
      <h1>Practice Mode</h1>
      <p>Practice with custom quizzes to improve your skills</p>
    </div>

    <div class="practice-options">
      <div class="practice-card">
        <h3>Create Custom Quiz</h3>
        <p>Generate a quiz based on specific topics</p>
        <button class="practice-btn">Start Practice</button>
      </div>
      <div class="practice-card">
        <h3>Weak Areas Practice</h3>
        <p>Focus on topics where you need improvement</p>
        <button class="practice-btn">Start Practice</button>
      </div>
    </div>
  `;
}

// Settings Content
function getSettingsContent() {
  return `
    <div class="content-header">
      <h1>Quiz Settings</h1>
      <p>Customize your quiz experience</p>
    </div>

    <div class="settings-section">
      <h3>Quiz Preferences</h3>
      <div class="setting-item">
        <div class="setting-info">
          <h4>Show timer</h4>
          <p>Display countdown timer during quizzes</p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" checked>
          <span class="slider"></span>
        </label>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <h4>Immediate feedback</h4>
          <p>Show correct answers immediately after each question</p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" checked>
          <span class="slider"></span>
        </label>
      </div>
    </div>
  `;
}

// Load upcoming quizzes
function loadUpcomingQuizzes() {
  const upcomingList = document.getElementById('upcoming-quizzes-list');
  const upcomingFull = document.getElementById('upcoming-quizzes-full');
  
  const upcomingQuizzes = [
    {
      id: 1,
      title: "Assignment 3 - HPC 2025",
      course: "High Performance Computing",
      dueDate: "May 22, 11:59 PM",
      status: "not-started",
      postedDate: "May 8",
      editedDate: "May 20"
    },
    {
      id: 2,
      title: "Assignment-2",
      course: "Machine Learning",
      dueDate: "May 10, 11:59 PM",
      status: "in-progress",
      postedDate: "May 5"
    },
    {
      id: 3,
      title: "Assignment 1 - HPC 2025",
      course: "High Performance Computing",
      dueDate: "Apr 22, 11:59 PM",
      status: "not-started",
      postedDate: "Apr 15"
    }
  ];

  const quizHTML = upcomingQuizzes.map(quiz => `
    <div class="quiz-item ${quiz.status}" data-quiz-id="${quiz.id}">
      <div class="quiz-header">
        <div class="quiz-icon">
          <span class="material-symbols-outlined">assignment</span>
        </div>
        <div class="quiz-info">
          <h4>${quiz.title}</h4>
          <p class="course-name">${quiz.course}</p>
        </div>
        <div class="quiz-meta">
          <span class="due-date">Due ${quiz.dueDate}</span>
          <button class="quiz-menu">
            <span class="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div class="quiz-details">
        <span class="posted-date">Posted ${quiz.postedDate}${quiz.editedDate ? ` (Edited ${quiz.editedDate})` : ''}</span>
        <span class="quiz-status">${quiz.status === 'not-started' ? 'Not Started' : 'In Progress'}</span>
      </div>
    </div>
  `).join('');

  if (upcomingList) upcomingList.innerHTML = quizHTML;
  if (upcomingFull) upcomingFull.innerHTML = quizHTML;
}

// Load recent quiz history
function loadRecentHistory() {
  const historyList = document.getElementById('recent-history-list');
  const historyFull = document.getElementById('quiz-history-full');
  
  const quizHistory = [
    {
      id: 101,
      title: "Quiz 5 - Neural Networks",
      course: "Machine Learning",
      completedDate: "May 15, 2025",
      score: 92,
      totalQuestions: 20,
      mistakes: 2,
      feedback: "Excellent work! Consider reviewing backpropagation algorithms for even better understanding.",
      reviewTopics: ["Backpropagation", "Gradient Descent"]
    },
    {
      id: 102,
      title: "Quiz 4 - Data Structures",
      course: "High Performance Computing",
      completedDate: "May 12, 2025",
      score: 78,
      totalQuestions: 15,
      mistakes: 4,
      feedback: "Good effort! Focus on understanding linked lists and tree traversal methods.",
      reviewTopics: ["Linked Lists", "Tree Traversal", "Binary Search Trees"]
    },
    {
      id: 103,
      title: "Quiz 3 - Algorithm Analysis",
      course: "High Performance Computing",
      completedDate: "May 8, 2025",
      score: 85,
      totalQuestions: 18,
      mistakes: 3,
      feedback: "Well done! Review time complexity analysis for optimization problems.",
      reviewTopics: ["Time Complexity", "Big O Notation", "Optimization Algorithms"]
    }
  ];

  const historyHTML = quizHistory.map(quiz => `
    <div class="quiz-item completed" data-quiz-id="${quiz.id}">
      <div class="quiz-header">
        <div class="quiz-icon">
          <span class="material-symbols-outlined">quiz</span>
        </div>
        <div class="quiz-info">
          <h4>${quiz.title}</h4>
          <p class="course-name">${quiz.course}</p>
        </div>
        <div class="quiz-meta">
          <span class="score">${quiz.score}%</span>
          <button class="quiz-menu">
            <span class="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div class="quiz-details">
        <span class="completed-date">Completed ${quiz.completedDate}</span>
        <span class="questions-info">${quiz.totalQuestions} questions</span>
      </div>
      <div class="quiz-feedback" style="display: none;">
        <div class="feedback-content">
          <p><strong>Feedback:</strong> ${quiz.feedback}</p>
          <p><strong>Mistakes:</strong> ${quiz.mistakes} out of ${quiz.totalQuestions} questions</p>
          <div class="review-topics">
            <strong>Review Topics:</strong>
            <div class="topic-tags">
              ${quiz.reviewTopics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (historyList) historyList.innerHTML = historyHTML;
  if (historyFull) historyFull.innerHTML = historyHTML;

  // Add hover functionality for quiz history
  addQuizHistoryHover();
}

// Add hover functionality for quiz history
function addQuizHistoryHover() {
  const quizItems = document.querySelectorAll('.quiz-item.completed');
  
  quizItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const feedback = this.querySelector('.quiz-feedback');
      if (feedback) {
        feedback.style.display = 'block';
      }
    });

    item.addEventListener('mouseleave', function() {
      const feedback = this.querySelector('.quiz-feedback');
      if (feedback) {
        feedback.style.display = 'none';
      }
    });
  });
}

// Load quiz data
function loadQuizData() {
  // Simulate loading quiz data
  setTimeout(() => {
    loadUpcomingQuizzes();
    loadRecentHistory();
  }, 100);
}

// Load initial content
document.addEventListener('DOMContentLoaded', function() {
  loadPageContent('quiz-center');
  loadQuizData();
});

// Add click event listeners to navigation
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('nav-item')) {
    e.preventDefault();
    const pageName = e.target.getAttribute('data-page');
    loadPageContent(pageName);
  }
}); 