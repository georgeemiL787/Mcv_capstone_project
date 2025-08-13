using MCV_Capstone.Data;
using MCV_Capstone.Models;
using MCV_Capstone.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace MCV_Capstone.Services
{
    public interface IAdminService
    {
        Task<AdminDashboardStats> GetDashboardStatsAsync();
        Task<List<AdminUserInfo>> GetUsersAsync(string searchTerm, string roleFilter, string statusFilter, int page = 1, int pageSize = 20);
        Task<bool> UpdateUserStatusAsync(int userId, string newStatus);
        Task<bool> BanUserAsync(int userId, int adminId, string reason);
        Task<bool> UnbanUserAsync(int userId, int adminId, string? reason);
        Task<List<AdminCourseInfo>> GetCoursesAsync(string filter, string searchTerm = "", string categoryFilter = "");
        Task<bool> ApproveCourseAsync(int courseId, int adminId);
        Task<bool> RejectCourseAsync(int courseId, int adminId, string reason);
        Task<AdminAnalytics> GetAnalyticsAsync();
        Task<AdminRevenueStats> GetRevenueStatsAsync();
        Task LogAdminActionAsync(int adminId, string action, string entityType, int? entityId, string? details, string? ipAddress, string? userAgent);
        Task<CourseDetailsViewModel> GetCourseDetailsAsync(int courseId);
        Task<int> GetTotalUsersCountAsync(string searchTerm, string roleFilter, string statusFilter);
        Task<int> GetTotalCoursesCountAsync(string filter, string searchTerm, string categoryFilter);
        Task<bool> FixExistingApprovedCoursesAsync();
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
            var totalRevenue = await _context.Enrollments
                .Where(e => e.Status == "Active" && e.Course.IsPublished)
                .SumAsync(e => e.Course.Price);

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

        public async Task<List<AdminUserInfo>> GetUsersAsync(string searchTerm, string roleFilter, string statusFilter, int page = 1, int pageSize = 20)
        {
            try
            {
                // Log the method call for debugging
                Console.WriteLine($"GetUsersAsync called with: searchTerm='{searchTerm}', roleFilter='{roleFilter}', statusFilter='{statusFilter}', page={page}, pageSize={pageSize}");
                
                var query = _context.Users.AsQueryable();
                
                // Log the initial user count
                var totalUsers = await query.CountAsync();
                Console.WriteLine($"Total users in database: {totalUsers}");

                // Apply search filter
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(u => 
                        (u.FirstName != null && u.FirstName.Contains(searchTerm)) || 
                        (u.LastName != null && u.LastName.Contains(searchTerm)) || 
                        (u.Email != null && u.Email.Contains(searchTerm)));
                    var afterSearchFilter = await query.CountAsync();
                    Console.WriteLine($"Users after search filter '{searchTerm}': {afterSearchFilter}");
                }

                // Apply role filter - only if a specific role is selected
                if (!string.IsNullOrEmpty(roleFilter) && roleFilter != "All Roles")
                {
                    try
                    {
                        var usersInRole = await _userManager.GetUsersInRoleAsync(roleFilter);
                        var userIds = usersInRole.Select(u => u.Id);
                        query = query.Where(u => userIds.Contains(u.Id));
                        var afterRoleFilter = await query.CountAsync();
                        Console.WriteLine($"Users after role filter '{roleFilter}': {afterRoleFilter}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error applying role filter '{roleFilter}': {ex.Message}");
                        // If role filtering fails, continue without it
                    }
                }

                // Apply status filter - only if a specific status is selected
                if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "All Status")
                {
                    query = query.Where(u => u.AccountStatus == statusFilter);
                    var afterStatusFilter = await query.CountAsync();
                    Console.WriteLine($"Users after status filter '{statusFilter}': {afterStatusFilter}");
                }

                // Apply pagination at database level for better performance
                var users = await query
                    .OrderBy(u => u.RegistrationDate) // Add ordering for consistent pagination
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new AdminUserInfo
                    {
                        Id = u.Id,
                        FirstName = u.FirstName ?? string.Empty,
                        LastName = u.LastName ?? string.Empty,
                        Email = u.Email ?? string.Empty,
                        AccountStatus = u.AccountStatus ?? "Active", // Default to Active if null
                        RegistrationDate = u.RegistrationDate,
                        LastLogin = u.LastLogin
                    })
                    .ToListAsync();

                // Log the final result
                Console.WriteLine($"Final users returned: {users.Count}");
                
                // Get roles and ban information for each user
                foreach (var user in users)
                {
                    try
                    {
                        var userEntity = await _userManager.FindByIdAsync(user.Id.ToString());
                        if (userEntity != null)
                        {
                            var roles = await _userManager.GetRolesAsync(userEntity);
                            user.Roles = roles.ToList();
                            Console.WriteLine($"User {user.Id} ({user.Email}) has roles: {string.Join(", ", user.Roles)}");
                        }
                        else
                        {
                            user.Roles = new List<string>();
                            Console.WriteLine($"User {user.Id} not found in UserManager");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error getting roles for user {user.Id}: {ex.Message}");
                        user.Roles = new List<string>();
                    }

                    // Get ban information with proper navigation property loading
                    try
                    {
                        var banInfo = await _context.BannedAccounts
                            .Include(b => b.BannedByAdmin)
                            .Where(b => b.BannedUserId == user.Id && b.UnbannedAt == null)
                            .Select(b => new { 
                                b.Reason, 
                                b.BannedAt, 
                                AdminName = b.BannedByAdmin != null ? 
                                    (b.BannedByAdmin.FirstName + " " + b.BannedByAdmin.LastName).Trim() : 
                                    "Unknown Admin"
                            })
                            .FirstOrDefaultAsync();

                        if (banInfo != null)
                        {
                            user.IsBanned = true;
                            user.BanReason = banInfo.Reason;
                            user.BannedAt = banInfo.BannedAt;
                            user.BannedByAdmin = banInfo.AdminName;
                            Console.WriteLine($"User {user.Id} is banned: {banInfo.Reason}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error getting ban info for user {user.Id}: {ex.Message}");
                        user.IsBanned = false;
                    }
                }

                return users;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUsersAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, string newStatus)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            user.AccountStatus = newStatus;
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> BanUserAsync(int userId, int adminId, string reason)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            // Check if user is already banned
            var existingBan = await _context.BannedAccounts
                .FirstOrDefaultAsync(b => b.BannedUserId == userId && b.UnbannedAt == null);
            
            if (existingBan != null) return false; // Already banned

            // Update user status
            user.AccountStatus = "Banned";
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return false;

            // Create banned account record
            var bannedAccount = new BannedAccount
            {
                BannedUserId = userId,
                Reason = reason,
                BannedByAdminId = adminId,
                BannedAt = DateTime.UtcNow
            };

            _context.BannedAccounts.Add(bannedAccount);
            await _context.SaveChangesAsync();

            // Log the action
            await LogAdminActionAsync(adminId, "BanUser", "User", userId, $"User banned. Reason: {reason}", null, null);

            return true;
        }

        public async Task<bool> UnbanUserAsync(int userId, int adminId, string? reason)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            // Find the active ban
            var activeBan = await _context.BannedAccounts
                .FirstOrDefaultAsync(b => b.BannedUserId == userId && b.UnbannedAt == null);
            
            if (activeBan == null) return false; // Not banned

            // Update user status
            user.AccountStatus = "Active";
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return false;

            // Update ban record
            activeBan.UnbannedAt = DateTime.UtcNow;
            activeBan.UnbannedByAdminId = adminId;
            activeBan.UnbanReason = reason;

            await _context.SaveChangesAsync();

            // Log the action
            await LogAdminActionAsync(adminId, "UnbanUser", "User", userId, $"User unbanned. Reason: {reason}", null, null);

            return true;
        }

        public async Task<List<AdminCourseInfo>> GetCoursesAsync(string filter, string searchTerm = "", string categoryFilter = "")
        {
            var query = _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Modules)
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(c => 
                    c.Title.Contains(searchTerm) || 
                    c.Description.Contains(searchTerm) ||
                    (c.Instructor != null && (c.Instructor.FirstName + " " + c.Instructor.LastName).Contains(searchTerm)));
            }

            // Apply category filter
            if (!string.IsNullOrEmpty(categoryFilter))
            {
                query = query.Where(c => c.Category == categoryFilter);
            }

            // Apply status filter
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
                    ShortDescription = c.ShortDescription ?? string.Empty,
                    Price = c.Price,
                    Difficulty = c.Difficulty,
                    Category = c.Category,
                    Tags = c.Tags,
                    IsPublished = c.IsPublished,
                    IsFeatured = c.IsFeatured,
                    IsApproved = c.IsApproved,
                    IsRejected = c.IsRejected,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    PublishedAt = c.PublishedAt,
                    ApprovedAt = c.ApprovedAt,
                    RejectedAt = c.RejectedAt,
                    RejectionReason = c.RejectionReason,
                    InstructorName = c.Instructor != null ? $"{c.Instructor.FirstName ?? "Unknown"} {c.Instructor.LastName ?? "Instructor"}" : "Unknown Instructor",
                    InstructorEmail = c.Instructor != null ? c.Instructor.Email ?? "unknown@example.com" : "unknown@example.com",
                    Duration = c.Duration,
                    StudentCount = c.Enrollments.Count(e => e.Status == "Active"),
                    AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0,
                    ModuleCount = c.Modules.Count,
                    ReviewCount = c.Reviews.Count
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
            
            // Automatically publish approved courses so they appear on the public OurCourses page
            course.IsPublished = true;
            course.PublishedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            // Log the action
            await LogAdminActionAsync(adminId, "ApproveCourse", "Course", courseId, "Course approved", null, null);
            
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
            
            // Unpublish rejected courses so they don't appear on the public OurCourses page
            course.IsPublished = false;
            course.PublishedAt = null;

            await _context.SaveChangesAsync();
            
            // Log the action
            await LogAdminActionAsync(adminId, "RejectCourse", "Course", courseId, $"Course rejected. Reason: {reason}", null, null);
            
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
            var monthlyRevenue = await _context.Enrollments
                .Where(e => e.Status == "Active" && e.Course.IsPublished && e.Course.PublishedAt.HasValue)
                .GroupBy(e => new { Month = e.Course.PublishedAt!.Value.Month, Year = e.Course.PublishedAt!.Value.Year })
                .Select(g => new MonthlyRevenueData
                {
                    Period = $"{g.Key.Month}/{g.Key.Year}",
                    Revenue = g.Sum(e => e.Course.Price)
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
                .Include(c => c.Instructor)
                .OrderByDescending(c => c.CreatedAt)
                .Take(3)
                .Select(c => new ActivityItem
                {
                    Type = "Course Submission",
                    Description = $"\"{c.Title}\" submitted by {(c.Instructor != null ? c.Instructor.FirstName ?? "Unknown" : "Unknown")} {(c.Instructor != null ? c.Instructor.LastName ?? "Instructor" : "Instructor")}",
                    Timestamp = c.CreatedAt,
                    Icon = "course"
                })
                .ToListAsync();

            activities.AddRange(recentCourses);

            return activities.OrderByDescending(a => a.Timestamp).Take(5).ToList();
        }

        public async Task LogAdminActionAsync(int adminId, string action, string entityType, int? entityId, string? details, string? ipAddress, string? userAgent)
        {
            var logEntry = new AdminActionLog
            {
                AdminId = adminId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Timestamp = DateTime.UtcNow
            };

            _context.AdminActionLogs.Add(logEntry);
            await _context.SaveChangesAsync();
        }

        public async Task<CourseDetailsViewModel> GetCourseDetailsAsync(int courseId)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Modules)
                .Include(c => c.Reviews)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null) return new CourseDetailsViewModel();

            var courseInfo = new AdminCourseInfo
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                ShortDescription = course.ShortDescription ?? string.Empty,
                Price = course.Price,
                Difficulty = course.Difficulty,
                Category = course.Category,
                Tags = course.Tags,
                IsPublished = course.IsPublished,
                IsFeatured = course.IsFeatured,
                IsApproved = course.IsApproved,
                IsRejected = course.IsRejected,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                PublishedAt = course.PublishedAt,
                ApprovedAt = course.ApprovedAt,
                RejectedAt = course.RejectedAt,
                RejectionReason = course.RejectionReason,
                InstructorName = $"{course.Instructor?.FirstName ?? "Unknown"} {course.Instructor?.LastName ?? "Instructor"}",
                InstructorEmail = course.Instructor?.Email ?? "unknown@example.com",
                Duration = course.Duration,
                StudentCount = course.Enrollments?.Count(e => e.Status == "Active") ?? 0,
                AverageRating = course.Reviews?.Any() == true ? course.Reviews.Average(r => r.Rating) : 0,
                ModuleCount = course.Modules?.Count ?? 0,
                ReviewCount = course.Reviews?.Count ?? 0
            };

            return new CourseDetailsViewModel
            {
                Course = courseInfo,
                Modules = course.Modules ?? new List<CourseModule>(),
                Reviews = course.Reviews ?? new List<CourseReview>(),
                Enrollments = course.Enrollments ?? new List<Enrollment>()
            };
        }

        public async Task<int> GetTotalUsersCountAsync(string searchTerm, string roleFilter, string statusFilter)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(u => 
                    (u.FirstName != null && u.FirstName.Contains(searchTerm)) || 
                    (u.LastName != null && u.LastName.Contains(searchTerm)) || 
                    (u.Email != null && u.Email.Contains(searchTerm)));
            }

            if (!string.IsNullOrEmpty(statusFilter))
            {
                query = query.Where(u => u.AccountStatus == statusFilter);
            }

            return await query.CountAsync();
        }

        public async Task<int> GetTotalCoursesCountAsync(string filter, string searchTerm, string categoryFilter)
        {
            var query = _context.Courses.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(c => 
                    c.Title.Contains(searchTerm) || 
                    c.Description.Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(categoryFilter))
            {
                query = query.Where(c => c.Category == categoryFilter);
            }

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

            return await query.CountAsync();
        }

        // Method to fix existing approved courses that aren't published
        public async Task<bool> FixExistingApprovedCoursesAsync()
        {
            try
            {
                // Find all approved courses that aren't published
                var approvedUnpublishedCourses = await _context.Courses
                    .Where(c => c.IsApproved && !c.IsPublished)
                    .ToListAsync();

                if (approvedUnpublishedCourses.Any())
                {
                    foreach (var course in approvedUnpublishedCourses)
                    {
                        course.IsPublished = true;
                        course.PublishedAt = course.ApprovedAt ?? DateTime.UtcNow;
                    }

                    await _context.SaveChangesAsync();
                    return true;
                }

                return true; // No courses to fix
            }
            catch (Exception)
            {
                return false;
            }
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
