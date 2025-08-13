using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Data;
using MCV_Capstone.Models;
using MCV_Capstone.Services;
using System.Security.Claims;
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Admin")]
    public class AdminPanelController : Controller
    {
            private readonly IAdminService _adminService;
    private readonly UserManager<User> _userManager;

    public AdminPanelController(
        IAdminService adminService,
        UserManager<User> userManager)
    {
        _adminService = adminService;
        _userManager = userManager;
    }

        public async Task<IActionResult> Index()
        {
            var dashboardData = await _adminService.GetDashboardStatsAsync();
            return View(dashboardData);
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

        // User Management
        [HttpGet]
        public async Task<IActionResult> GetUsers(string searchTerm = "", string roleFilter = "", string statusFilter = "")
        {
            try
            {
                var users = await _adminService.GetUsersAsync(searchTerm, roleFilter, statusFilter);
                return Json(new { success = true, data = users });
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
        public async Task<IActionResult> BanUser(int userId)
        {
            try
            {
                var success = await _adminService.BanUserAsync(userId);
                if (success)
                {
                    return Json(new { success = true, message = "User banned successfully" });
                }
                return Json(new { success = false, message = "User not found" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Course Management
        [HttpGet]
        public async Task<IActionResult> GetCourses(string filter = "all")
        {
            try
            {
                var courses = await _adminService.GetCoursesAsync(filter);
                return Json(new { success = true, data = courses });
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

        // Test action for admin access
        [HttpGet]
        public IActionResult Test()
        {
            return Json(new { 
                success = true, 
                message = "Admin access confirmed!", 
                user = User.Identity?.Name,
                roles = User.Claims.Where(c => c.Type == System.Security.Claims.ClaimTypes.Role).Select(c => c.Value).ToList()
            });
        }
    }

    // View Models
    public class AdminSettingsViewModel
    {
        public string PlatformName { get; set; } = string.Empty;
        public bool MaintenanceMode { get; set; }
        public bool EmailNotifications { get; set; }
    }
}