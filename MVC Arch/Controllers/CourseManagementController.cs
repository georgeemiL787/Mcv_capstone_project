using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MCV_Capstone.Models;
using MCV_Capstone.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MCV_Capstone.Services; // Added for ICourseImportService
using Microsoft.Extensions.DependencyInjection; // Added for HttpContext.RequestServices
using MCV_Capstone.Models.ViewModels; // Added for CourseImportViewModel and BulkCourseImportViewModel
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Instructor", "Admin")]
    public class CourseManagementController : Controller
    {
        private readonly luiz_trialContext _context;
        private readonly ILogger<CourseManagementController> _logger;

        public CourseManagementController(luiz_trialContext context, ILogger<CourseManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: CourseManagement
        public async Task<IActionResult> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var courses = await _context.Courses
                .Where(c => c.InstructorId.ToString() == userId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            
            return View(courses);
        }

        // GET: CourseManagement/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CourseManagement/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Title,Description,ShortDescription,Price,DiscountedPrice,ThumbnailUrl,VideoUrl,Duration,Difficulty,Category,Tags")] Course course)
        {
            _logger.LogInformation("Create course action called with model: {@CourseModel}", course);
            
            if (ModelState.IsValid)
            {
                _logger.LogInformation("Model state is valid, proceeding with course creation");
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                _logger.LogInformation("User ID from claims: {UserId}", userId);
                
                if (userId != null)
                {
                    try
                    {
                        // Set the instructor ID and other required fields
                        course.InstructorId = int.Parse(userId);
                        course.CreatedAt = DateTime.UtcNow;
                        course.IsPublished = false;
                        course.IsFeatured = false;
                        course.IsApproved = false; // New courses need admin approval

                        _logger.LogInformation("Adding course to context: {@Course}", course);
                        
                        _context.Add(course);
                        var result = await _context.SaveChangesAsync();
                        _logger.LogInformation("Course saved to database successfully. Rows affected: {RowsAffected}", result);
                        
                        TempData["SuccessMessage"] = "Course created successfully! It will be reviewed by an admin before becoming visible to students.";
                        return RedirectToAction(nameof(Index));
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error saving course to database");
                        ModelState.AddModelError("", "An error occurred while saving the course. Please try again.");
                        TempData["ErrorMessage"] = "An error occurred while creating the course. Please try again.";
                    }
                }
                else
                {
                    _logger.LogWarning("User ID not found in claims");
                    ModelState.AddModelError("", "User not authenticated.");
                    TempData["ErrorMessage"] = "User not authenticated. Please log in again.";
                }
            }
            else
            {
                _logger.LogWarning("Model state is invalid. Errors: {@ModelStateErrors}", 
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                
                // Add a more user-friendly error message
                TempData["ErrorMessage"] = "Please correct the errors in the form and try again.";
            }
            
            return View(course);
        }

        // GET: CourseManagement/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id && c.InstructorId.ToString() == userId);

            if (course == null)
            {
                return NotFound();
            }

            return View(course);
        }

        // POST: CourseManagement/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Description,ShortDescription,Price,DiscountedPrice,ThumbnailUrl,VideoUrl,Duration,Difficulty,Category,Tags,IsPublished")] Course course)
        {
            if (id != course.Id)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var existingCourse = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id && c.InstructorId.ToString() == userId);

            if (existingCourse == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // If course was rejected and is being edited, reset approval status
                    if (existingCourse.IsRejected)
                    {
                        existingCourse.IsRejected = false;
                        existingCourse.RejectionReason = null;
                        existingCourse.RejectedAt = null;
                        existingCourse.RejectedBy = null;
                        existingCourse.IsApproved = false; // Needs admin review again
                        existingCourse.IsPublished = false; // Can't be published until approved
                    }

                    existingCourse.Title = course.Title;
                    existingCourse.Description = course.Description;
                    existingCourse.ShortDescription = course.ShortDescription;
                    existingCourse.Price = course.Price;
                    existingCourse.DiscountedPrice = course.DiscountedPrice;
                    existingCourse.ThumbnailUrl = course.ThumbnailUrl;
                    existingCourse.VideoUrl = course.VideoUrl;
                    existingCourse.Duration = course.Duration;
                    existingCourse.Difficulty = course.Difficulty;
                    existingCourse.Category = course.Category;
                    existingCourse.Tags = course.Tags;
                    existingCourse.UpdatedAt = DateTime.UtcNow;

                    // Only allow publishing if course is approved
                    if (course.IsPublished && existingCourse.IsApproved && !existingCourse.IsPublished)
                    {
                        existingCourse.IsPublished = true;
                        existingCourse.PublishedAt = DateTime.UtcNow;
                    }
                    else if (!course.IsPublished && existingCourse.IsPublished)
                    {
                        existingCourse.IsPublished = false;
                        existingCourse.PublishedAt = null;
                    }

                    _context.Update(existingCourse);
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation("Course updated: {CourseTitle} by user {UserId}", course.Title, userId);
                    
                    if (existingCourse.IsRejected)
                    {
                        TempData["SuccessMessage"] = "Course updated and resubmitted for admin review!";
                    }
                    else
                    {
                        TempData["SuccessMessage"] = "Course updated successfully!";
                    }
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CourseExists(course.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(course);
        }

        // GET: CourseManagement/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id && c.InstructorId.ToString() == userId);

            if (course == null)
            {
                return NotFound();
            }

            return View(course);
        }

        // POST: CourseManagement/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id && c.InstructorId.ToString() == userId);

            if (course != null)
            {
                _context.Courses.Remove(course);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Course deleted: {CourseTitle} by user {UserId}", course.Title, userId);
                
                TempData["SuccessMessage"] = "Course deleted successfully!";
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: CourseManagement/TogglePublish/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> TogglePublish(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id && c.InstructorId.ToString() == userId);

            if (course == null)
            {
                return NotFound();
            }

            // Check if course can be published
            if (!course.IsApproved)
            {
                TempData["ErrorMessage"] = "Course must be approved by an admin before it can be published.";
                return RedirectToAction(nameof(Index));
            }

            if (course.IsRejected)
            {
                TempData["ErrorMessage"] = "Rejected courses cannot be published. Please edit and resubmit for review.";
                return RedirectToAction(nameof(Index));
            }

            course.IsPublished = !course.IsPublished;
            course.UpdatedAt = DateTime.UtcNow;

            if (course.IsPublished)
            {
                course.PublishedAt = DateTime.UtcNow;
            }
            else
            {
                course.PublishedAt = null;
            }

            _context.Update(course);
            await _context.SaveChangesAsync();

            var message = course.IsPublished ? "Course published successfully!" : "Course unpublished successfully!";
            TempData["SuccessMessage"] = message;

            return RedirectToAction(nameof(Index));
        }

        // POST: CourseManagement/ResubmitForReview/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResubmitForReview(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id && c.InstructorId.ToString() == userId);

            if (course == null)
            {
                return NotFound();
            }

            if (!course.IsRejected)
            {
                TempData["ErrorMessage"] = "Only rejected courses can be resubmitted for review.";
                return RedirectToAction(nameof(Index));
            }

            // Reset rejection status and resubmit for review
            course.IsRejected = false;
            course.RejectionReason = null;
            course.RejectedAt = null;
            course.RejectedBy = null;
            course.IsApproved = false; // Needs admin review again
            course.IsPublished = false; // Can't be published until approved
            course.UpdatedAt = DateTime.UtcNow;

            _context.Update(course);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Course resubmitted for review: {CourseTitle} by user {UserId}", course.Title, userId);
            
            TempData["SuccessMessage"] = "Course resubmitted for admin review successfully!";
            return RedirectToAction(nameof(Index));
        }

        // GET: CourseManagement/Import
        public async Task<IActionResult> Import()
        {
            ViewBag.Categories = await GetAvailableCategoriesAsync();
            ViewBag.DifficultyLevels = GetDifficultyLevelsAsync();
            return View();
        }

        // POST: CourseManagement/Import
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Import([FromForm] CourseImportViewModel model)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                {
                    TempData["ErrorMessage"] = "User not authenticated.";
                    return RedirectToAction(nameof(Index));
                }

                try
                {
                    var importService = HttpContext.RequestServices.GetRequiredService<ICourseImportService>();
                    var result = await importService.ImportCourseAsync(model, int.Parse(userId));

                    if (result.IsSuccessful)
                    {
                        TempData["SuccessMessage"] = $"Course '{model.Title}' imported successfully! It will be reviewed by an admin before becoming visible to students.";
                    }
                    else
                    {
                        TempData["ErrorMessage"] = $"Import failed: {string.Join(", ", result.ErrorMessages)}";
                    }

                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Course import failed for user {UserId}", userId);
                    TempData["ErrorMessage"] = "An error occurred during import. Please try again.";
                }
            }

            // If we get here, there was an error
            ViewBag.Categories = await GetAvailableCategoriesAsync();
            ViewBag.DifficultyLevels = GetDifficultyLevelsAsync();
            return View(model);
        }

        // GET: CourseManagement/BulkImport
        public IActionResult BulkImport()
        {
            return View();
        }

        // POST: CourseManagement/BulkImport
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BulkImport([FromForm] BulkCourseImportViewModel model)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                {
                    TempData["ErrorMessage"] = "User not authenticated.";
                    return RedirectToAction(nameof(Index));
                }

                try
                {
                    var importService = HttpContext.RequestServices.GetRequiredService<ICourseImportService>();
                    var result = await importService.BulkImportCoursesAsync(model, int.Parse(userId));

                    if (result.IsSuccessful)
                    {
                        TempData["SuccessMessage"] = $"Bulk import completed! {result.SuccessfullyImported} courses imported successfully.";
                    }
                    else
                    {
                        TempData["ErrorMessage"] = $"Bulk import completed with errors. {result.SuccessfullyImported} courses imported, {result.FailedImports} failed.";
                    }

                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Bulk course import failed for user {UserId}", userId);
                    TempData["ErrorMessage"] = "An error occurred during bulk import. Please try again.";
                }
            }

            return View(model);
        }

        private async Task<List<string>> GetAvailableCategoriesAsync()
        {
            return await _context.Courses
                .Where(c => !string.IsNullOrEmpty(c.Category))
                .Select(c => c.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        private List<string> GetDifficultyLevelsAsync()
        {
            return new List<string> { "Beginner", "Intermediate", "Advanced", "Expert" };
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.Id == id);
        }
    }
}
