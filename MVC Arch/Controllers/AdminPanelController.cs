using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Data;
using MCV_Capstone.Models;
using MCV_Capstone.Services;
using MCV_Capstone.ViewModels;
using System.Security.Claims;
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Admin")]
    public class AdminPanelController : Controller
    {
        private readonly IAdminService _adminService;
        private readonly UserManager<User> _userManager;
        private readonly luiz_trialContext _context;

        public AdminPanelController(
            IAdminService adminService,
            UserManager<User> userManager,
            luiz_trialContext context)
        {
            _adminService = adminService;
            _userManager = userManager;
            _context = context;
        }

        private async Task<User?> GetCurrentUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                return null;

            return await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userIdInt);
        }

        public async Task<IActionResult> Index()
        {
            var dashboardData = await _adminService.GetDashboardStatsAsync();
            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;
            return View(dashboardData);
        }

        // Users Management View
        public async Task<IActionResult> Users()
        {
            try
            {
                Console.WriteLine("Users action called in AdminPanelController");
                var currentUser = await GetCurrentUserAsync();
                ViewBag.User = currentUser;
                
                var viewModel = new AdminUserManagementViewModel
                {
                    SearchTerm = "",
                    RoleFilter = "",
                    StatusFilter = "",
                    CurrentPage = 1,
                    PageSize = 20
                };
                
                Console.WriteLine("Returning Users view");
                return View(viewModel);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Users action: {ex.Message}");
                throw;
            }
        }

        // Dashboard data API endpoint
        [HttpGet]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _adminService.GetDashboardStatsAsync();
                return Json(new { success = true, data = stats });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Test endpoint for debugging
        [HttpGet]
        public async Task<IActionResult> Test()
        {
            try
            {
                var userCount = await _adminService.GetTotalUsersCountAsync("", "", "");
                return Json(new { 
                    success = true, 
                    message = "Admin service is working", 
                    userCount = userCount 
                });
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = ex.Message, 
                    stackTrace = ex.StackTrace 
                });
            }
        }

        // Fix existing approved courses that aren't published
        [HttpPost]
        public async Task<IActionResult> FixApprovedCourses()
        {
            try
            {
                var result = await _adminService.FixExistingApprovedCoursesAsync();
                if (result)
                {
                    return Json(new { 
                        success = true, 
                        message = "Successfully fixed existing approved courses. They should now appear on the OurCourses page." 
                    });
                }
                else
                {
                    return Json(new { 
                        success = false, 
                        message = "Failed to fix existing approved courses." 
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = ex.Message 
                });
            }
        }

        // Debug endpoint to check course statuses
        [HttpGet]
        public async Task<IActionResult> DebugCourseStatuses()
        {
            try
            {
                var courses = await _context.Courses
                    .Select(c => new { 
                        c.Id, 
                        c.Title, 
                        c.IsApproved, 
                        c.IsPublished, 
                        c.IsRejected,
                        c.ApprovedAt,
                        c.PublishedAt
                    })
                    .ToListAsync();

                return Json(new { 
                    success = true, 
                    data = courses,
                    message = $"Found {courses.Count} courses in database"
                });
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = ex.Message 
                });
            }
        }

        // Debug endpoint to check users directly
        [HttpGet]
        public async Task<IActionResult> DebugUsers()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var sampleUsers = await _context.Users
                    .Take(5)
                    .Select(u => new { 
                        u.Id, 
                        u.FirstName, 
                        u.LastName, 
                        u.Email, 
                        u.AccountStatus,
                        u.RegistrationDate
                    })
                    .ToListAsync();

                return Json(new { 
                    success = true, 
                    totalUsers = totalUsers,
                    sampleUsers = sampleUsers,
                    message = $"Found {totalUsers} users in database"
                });
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // User Management
        [HttpGet]
        public async Task<IActionResult> GetUsers(string searchTerm = "", string roleFilter = "", string statusFilter = "", int page = 1, int pageSize = 20)
        {
            try
            {
                var users = await _adminService.GetUsersAsync(searchTerm, roleFilter, statusFilter, page, pageSize);
                var totalCount = await _adminService.GetTotalUsersCountAsync(searchTerm, roleFilter, statusFilter);
                
                return Json(new { 
                    success = true, 
                    data = users,
                    totalCount = totalCount,
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateUserStatus(int userId, string newStatus)
        {
            try
            {
                var success = await _adminService.UpdateUserStatusAsync(userId, newStatus);
                if (success)
                {
                    return Json(new { success = true, message = "User status updated successfully" });
                }
                return Json(new { success = false, message = "User not found" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> BanUser([FromBody] BanUserViewModel model)
        {
            try
            {
                var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                var success = await _adminService.BanUserAsync(model.UserId, adminId, model.Reason);
                if (success)
                {
                    return Json(new { success = true, message = "User banned successfully" });
                }
                return Json(new { success = false, message = "User not found or already banned" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UnbanUser([FromBody] UnbanUserViewModel model)
        {
            try
            {
                var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                var success = await _adminService.UnbanUserAsync(model.UserId, adminId, model.Reason);
                if (success)
                {
                    return Json(new { success = true, message = "User unbanned successfully" });
                }
                return Json(new { success = false, message = "User not found or not banned" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Course Management
        [HttpGet]
        public async Task<IActionResult> GetCourses(string filter = "all", string searchTerm = "", string categoryFilter = "", int page = 1, int pageSize = 20)
        {
            try
            {
                var courses = await _adminService.GetCoursesAsync(filter, searchTerm, categoryFilter);
                var totalCount = await _adminService.GetTotalCoursesCountAsync(filter, searchTerm, categoryFilter);
                
                // Apply pagination
                var pagedCourses = courses.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                
                return Json(new { 
                    success = true, 
                    data = pagedCourses,
                    totalCount = totalCount,
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCourseDetails(int courseId)
        {
            try
            {
                var courseDetails = await _adminService.GetCourseDetailsAsync(courseId);
                if (courseDetails.Course.Id == 0)
                {
                    return Json(new { success = false, message = "Course not found" });
                }
                return Json(new { success = true, data = courseDetails });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ApproveCourse(int courseId)
        {
            try
            {
                var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                var success = await _adminService.ApproveCourseAsync(courseId, adminId);
                if (success)
                {
                    return Json(new { success = true, message = "Course approved successfully" });
                }
                return Json(new { success = false, message = "Course not found" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> RejectCourse(int courseId, string reason)
        {
            try
            {
                var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
                var success = await _adminService.RejectCourseAsync(courseId, adminId, reason);
                if (success)
                {
                    return Json(new { success = true, message = "Course rejected successfully" });
                }
                return Json(new { success = false, message = "Course not found" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Content Moderation
        [HttpGet]
        public IActionResult GetFlaggedContent()
        {
            try
            {
                // This would integrate with your content moderation system
                // For now, returning sample data
                var flaggedContent = new List<object>
                {
                    new { Id = 1, Type = "Comment", Content = "Sample flagged comment", Status = "Flagged", ReportedAt = DateTime.UtcNow.AddHours(-1) }
                };

                return Json(new { success = true, data = flaggedContent });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Analytics
        [HttpGet]
        public async Task<IActionResult> GetAnalytics()
        {
            try
            {
                var analytics = await _adminService.GetAnalyticsAsync();
                return Json(new { success = true, data = analytics });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Revenue Reports
        [HttpGet]
        public async Task<IActionResult> GetRevenueData()
        {
            try
            {
                var revenueData = await _adminService.GetRevenueStatsAsync();
                return Json(new { success = true, data = revenueData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Settings
        [HttpPost]
        public IActionResult UpdateSettings([FromBody] AdminSettingsViewModel settings)
        {
            try
            {
                // This would update your application settings
                // For now, just return success
                return Json(new { success = true, message = "Settings updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}