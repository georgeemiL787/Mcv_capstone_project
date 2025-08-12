using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MCV_Capstone.Models;
using MCV_Capstone.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MCV_Capstone.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CourseApprovalController : Controller
    {
        private readonly luiz_trialContext _context;
        private readonly ILogger<CourseApprovalController> _logger;

        public CourseApprovalController(luiz_trialContext context, ILogger<CourseApprovalController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: CourseApproval - Show pending courses for approval
        public async Task<IActionResult> Index()
        {
            var pendingCourses = await _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsPublished && !c.IsApproved)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var approvedCourses = await _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsApproved)
                .OrderByDescending(c => c.ApprovedAt)
                .Take(10)
                .ToListAsync();

            ViewBag.PendingCourses = pendingCourses;
            ViewBag.ApprovedCourses = approvedCourses;

            return View();
        }

        // POST: CourseApproval/Approve/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Approve(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            course.IsApproved = true;
            course.ApprovedAt = DateTime.UtcNow;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                course.ApprovedBy = int.Parse(userId);
            }

            _context.Update(course);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Course approved: {CourseTitle} by admin {AdminId}", course.Title, User.FindFirstValue(ClaimTypes.NameIdentifier));

            TempData["SuccessMessage"] = $"Course '{course.Title}' has been approved and is now visible to students.";
            return RedirectToAction(nameof(Index));
        }

        // POST: CourseApproval/Reject/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Reject(int id, string rejectionReason)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            course.IsPublished = false; // Unpublish the course
            course.RejectionReason = rejectionReason;
            course.RejectedAt = DateTime.UtcNow;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                course.RejectedBy = int.Parse(userId);
            }

            _context.Update(course);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Course rejected: {CourseTitle} by admin {AdminId}", course.Title, User.FindFirstValue(ClaimTypes.NameIdentifier));

            TempData["SuccessMessage"] = $"Course '{course.Title}' has been rejected and unpublished.";
            return RedirectToAction(nameof(Index));
        }

        // GET: CourseApproval/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Modules)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                return NotFound();
            }

            return View(course);
        }
    }
}
