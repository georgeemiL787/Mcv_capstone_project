using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Data;
using MCV_Capstone.Models;
using System.Security.Claims;
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Instructor", "Admin")]
    public class InstructorDashboardController : Controller
    {
        private readonly luiz_trialContext _context;

        public InstructorDashboardController(luiz_trialContext context)
        {
            _context = context;
        }

        private async Task<User> GetCurrentUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                return null;

            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userIdInt);
        }

        public async Task<IActionResult> Index()
        {
            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;
            return View();
        }

        public async Task<IActionResult> Analytics()
        {
            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;
            return View();
        }

        public async Task<IActionResult> Courses()
        {
            // Get the current user's ID (assuming they're logged in as an instructor)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                // If not logged in, redirect to login
                return RedirectToAction("Login", "Account");
            }

            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;

            // Fetch courses for the current instructor
            var instructorCourses = await _context.Courses
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .Where(c => c.InstructorId.ToString() == userId)
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Price,
                    c.ThumbnailUrl,
                    c.IsPublished,
                    c.IsApproved,
                    StudentCount = c.Enrollments.Count(e => e.Status == "Active"),
                    AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0,
                    c.CreatedAt
                })
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return View(instructorCourses);
        }

        public async Task<IActionResult> Discussions()
        {
            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;
            return View();
        }

        public async Task<IActionResult> Enrollments()
        {
            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;
            return View();
        }

        public async Task<IActionResult> Revenue()
        {
            var currentUser = await GetCurrentUserAsync();
            ViewBag.User = currentUser;
            return View();
        }
    }
}