using MCV_Capstone.Data;
using MCV_Capstone.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace MCV_Capstone.Services
{
    public interface IAdminService
    {
        Task<AdminDashboardStats> GetDashboardStatsAsync();
        Task<List<AdminUserInfo>> GetUsersAsync(string searchTerm, string roleFilter, string statusFilter);
        Task<bool> UpdateUserStatusAsync(int userId, string newStatus);
        Task<bool> BanUserAsync(int userId);
        Task<List<AdminCourseInfo>> GetCoursesAsync(string filter);
        Task<bool> ApproveCourseAsync(int courseId, int adminId);
        Task<bool> RejectCourseAsync(int courseId, int adminId, string reason);
        Task<AdminAnalytics> GetAnalyticsAsync();
        Task<AdminRevenueStats> GetRevenueStatsAsync();
    }

    public class AdminService : IAdminService
    {
        private readonly luiz_trialContext _context;
        private readonly UserManager<User> _userManager;

        public AdminService(luiz_trialContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<AdminDashboardStats> GetDashboardStatsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalCourses = await _context.Courses.CountAsync();
            var pendingCourses = await _context.Courses.CountAsync(c => !c.IsApproved && !c.IsRejected);
            var totalEnrollments = await _context.Enrollments.CountAsync(e => e.Status == "Active");

            // Calculate revenue (this would integrate with your payment system)
            var totalRevenue = await _context.Courses
                .Where(c => c.IsPublished)
                .SumAsync(c => c.Price * c.Enrollments.Count(e => e.Status == "Active"));

            var recentActivity = await GetRecentActivityAsync();

            return new AdminDashboardStats
            {
                TotalUsers = totalUsers,
                TotalCourses = totalCourses,
                PendingCourses = pendingCourses,
                TotalEnrollments = totalEnrollments,
                TotalRevenue = totalRevenue,
                RecentActivity = recentActivity
            };
        }

        public async Task<List<AdminUserInfo>> GetUsersAsync(string searchTerm, string roleFilter, string statusFilter)
        {
            var query = _context.Users.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(u => 
                    (u.FirstName != null && u.FirstName.Contains(searchTerm)) || 
                    (u.LastName != null && u.LastName.Contains(searchTerm)) || 
                    (u.Email != null && u.Email.Contains(searchTerm)));
            }

            // Apply role filter
            if (!string.IsNullOrEmpty(roleFilter))
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(roleFilter);
                var userIds = usersInRole.Select(u => u.Id);
                query = query.Where(u => userIds.Contains(u.Id));
            }

            // Apply status filter
            if (!string.IsNullOrEmpty(statusFilter))
            {
                query = query.Where(u => u.AccountStatus == statusFilter);
            }

            var users = await query
                .Select(u => new AdminUserInfo
                {
                    Id = u.Id,
                    FirstName = u.FirstName ?? string.Empty,
                    LastName = u.LastName ?? string.Empty,
                    Email = u.Email ?? string.Empty,
                    AccountStatus = u.AccountStatus ?? string.Empty,
                    RegistrationDate = u.RegistrationDate,
                    LastLogin = u.LastLogin
                })
                .ToListAsync();

            // Get roles for each user
            foreach (var user in users)
            {
                var userEntity = await _userManager.FindByIdAsync(user.Id.ToString());
                if (userEntity != null)
                {
                    user.Roles = (await _userManager.GetRolesAsync(userEntity)).ToList();
                }
                else
                {
                    user.Roles = new List<string>();
                }
            }

            return users;
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, string newStatus)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            user.AccountStatus = newStatus;
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> BanUserAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            user.AccountStatus = "Banned";
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<List<AdminCourseInfo>> GetCoursesAsync(string filter)
        {
            var query = _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Modules)
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .AsQueryable();

            switch (filter.ToLower())
            {
                case "pending":
                    query = query.Where(c => !c.IsApproved && !c.IsRejected);
                    break;
                case "approved":
                    query = query.Where(c => c.IsApproved);
                    break;
                case "rejected":
                    query = query.Where(c => c.IsRejected);
                    break;
            }

            var courses = await query
                .Select(c => new AdminCourseInfo
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    Difficulty = c.Difficulty,
                    Category = c.Category,
                    IsPublished = c.IsPublished,
                    IsApproved = c.IsApproved,
                    IsRejected = c.IsRejected,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    ApprovedAt = c.ApprovedAt,
                    RejectedAt = c.RejectedAt,
                    RejectionReason = c.RejectionReason,
                    InstructorName = $"{c.Instructor.FirstName ?? "Unknown"} {c.Instructor.LastName ?? "Instructor"}",
                    InstructorEmail = c.Instructor.Email ?? "unknown@example.com",
                    Duration = c.Duration,
                    StudentCount = c.Enrollments.Count(e => e.Status == "Active"),
                    AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0,
                    ModuleCount = c.Modules.Count
                })
                .ToListAsync();

            return courses;
        }

        public async Task<bool> ApproveCourseAsync(int courseId, int adminId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return false;

            course.IsApproved = true;
            course.ApprovedAt = DateTime.UtcNow;
            course.ApprovedBy = adminId;
            course.IsRejected = false;
            course.RejectionReason = null;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectCourseAsync(int courseId, int adminId, string reason)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return false;

            course.IsApproved = false;
            course.IsRejected = true;
            course.RejectedAt = DateTime.UtcNow;
            course.RejectedBy = adminId;
            course.RejectionReason = reason;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AdminAnalytics> GetAnalyticsAsync()
        {
            // User growth over time
            var userGrowth = await _context.Users
                .GroupBy(u => new { Month = u.RegistrationDate.Month, Year = u.RegistrationDate.Year })
                .Select(g => new UserGrowthData { Period = $"{g.Key.Month}/{g.Key.Year}", Count = g.Count() })
                .OrderBy(x => x.Period)
                .ToListAsync();

            // Course performance
            var coursePerformance = await _context.Courses
                .Where(c => c.IsPublished)
                .Select(c => new CoursePerformanceData
                {
                    Title = c.Title,
                    EnrollmentCount = c.Enrollments.Count(e => e.Status == "Active"),
                    AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0
                })
                .OrderByDescending(c => c.EnrollmentCount)
                .Take(10)
                .ToListAsync();

            return new AdminAnalytics
            {
                UserGrowth = userGrowth,
                CoursePerformance = coursePerformance
            };
        }

        public async Task<AdminRevenueStats> GetRevenueStatsAsync()
        {
            var monthlyRevenue = await _context.Courses
                .Where(c => c.IsPublished && c.PublishedAt.HasValue)
                .GroupBy(c => new { Month = c.PublishedAt!.Value.Month, Year = c.PublishedAt!.Value.Year })
                .Select(g => new MonthlyRevenueData
                {
                    Period = $"{g.Key.Month}/{g.Key.Year}",
                    Revenue = g.Sum(c => c.Price * c.Enrollments.Count(e => e.Status == "Active"))
                })
                .OrderBy(x => x.Period)
                .ToListAsync();

            var totalRevenue = monthlyRevenue.Sum(x => x.Revenue);
            var totalSubscriptions = await _context.Enrollments.CountAsync(e => e.Status == "Active");

            return new AdminRevenueStats
            {
                MonthlyRevenue = monthlyRevenue,
                TotalRevenue = totalRevenue,
                TotalSubscriptions = totalSubscriptions
            };
        }

        private async Task<List<ActivityItem>> GetRecentActivityAsync()
        {
            var activities = new List<ActivityItem>();

            // Recent user registrations
            var recentUsers = await _context.Users
                .OrderByDescending(u => u.RegistrationDate)
                .Take(3)
                .Select(u => new ActivityItem
                {
                    Type = "User Registration",
                    Description = $"{u.FirstName} {u.LastName} joined the platform",
                    Timestamp = u.RegistrationDate,
                    Icon = "user"
                })
                .ToListAsync();

            activities.AddRange(recentUsers);

            // Recent course submissions
            var recentCourses = await _context.Courses
                .OrderByDescending(c => c.CreatedAt)
                .Take(3)
                .Select(c => new ActivityItem
                {
                    Type = "Course Submission",
                    Description = $"\"{c.Title}\" submitted by {c.Instructor.FirstName} {c.Instructor.LastName}",
                    Timestamp = c.CreatedAt,
                    Icon = "course"
                })
                .ToListAsync();

            activities.AddRange(recentCourses);

            return activities.OrderByDescending(a => a.Timestamp).Take(5).ToList();
        }
    }

    // Data Transfer Objects
    public class AdminDashboardStats
    {
        public int TotalUsers { get; set; }
        public int TotalCourses { get; set; }
        public int PendingCourses { get; set; }
        public int TotalEnrollments { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<ActivityItem> RecentActivity { get; set; } = new();
    }

    public class AdminUserInfo
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AccountStatus { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public List<string> Roles { get; set; } = new();
    }

    public class AdminCourseInfo
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public string? RejectionReason { get; set; }
        public string InstructorName { get; set; } = string.Empty;
        public string InstructorEmail { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int StudentCount { get; set; }
        public double AverageRating { get; set; }
        public int ModuleCount { get; set; }
    }

    public class AdminAnalytics
    {
        public List<UserGrowthData> UserGrowth { get; set; } = new();
        public List<CoursePerformanceData> CoursePerformance { get; set; } = new();
    }

    public class AdminRevenueStats
    {
        public List<MonthlyRevenueData> MonthlyRevenue { get; set; } = new();
        public decimal TotalRevenue { get; set; }
        public int TotalSubscriptions { get; set; }
    }

    public class UserGrowthData
    {
        public string Period { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class CoursePerformanceData
    {
        public string Title { get; set; } = string.Empty;
        public int EnrollmentCount { get; set; }
        public double AverageRating { get; set; }
    }

    public class MonthlyRevenueData
    {
        public string Period { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class ActivityItem
    {
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Icon { get; set; } = string.Empty;
    }
}
