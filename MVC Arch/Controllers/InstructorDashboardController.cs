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

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Analytics()
        {
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

        public IActionResult Discussions()
        {
            return View();
        }

        public IActionResult Enrollments()
        {
            return View();
        }

        public IActionResult Revenue()
        {
            return View();
        }
    }
}