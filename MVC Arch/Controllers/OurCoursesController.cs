using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Models;
using MCV_Capstone.Data;
using Microsoft.EntityFrameworkCore;

namespace MCV_Capstone.Controllers
{
    public class OurCoursesController : Controller
    {
        private readonly luiz_trialContext _context;
        private readonly ILogger<OurCoursesController> _logger;

        public OurCoursesController(luiz_trialContext context, ILogger<OurCoursesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: OurCourses - Public course catalog
        public async Task<IActionResult> Index(string? category, string? difficulty, string? searchTerm, string? sortBy, int page = 1)
        {
            var pageSize = 12;
            var query = _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsPublished && c.IsApproved); // Only show approved courses

            // Apply filters
            if (!string.IsNullOrEmpty(category) && category != "All")
            {
                query = query.Where(c => c.Category != null && c.Category == category);
            }

            if (!string.IsNullOrEmpty(difficulty) && difficulty != "All")
            {
                query = query.Where(c => c.Difficulty != null && c.Difficulty == difficulty);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(c => 
                    c.Title.ToLower().Contains(searchTerm) ||
                    c.Description.ToLower().Contains(searchTerm) ||
                    (c.ShortDescription != null && c.ShortDescription.ToLower().Contains(searchTerm)) ||
                    (c.Tags != null && c.Tags.ToLower().Contains(searchTerm)) ||
                    (c.Category != null && c.Category.ToLower().Contains(searchTerm))
                );
            }

            // Apply sorting
            query = sortBy switch
            {
                "price_low" => query.OrderBy(c => c.DiscountedPrice ?? c.Price),
                "price_high" => query.OrderByDescending(c => c.DiscountedPrice ?? c.Price),
                "newest" => query.OrderByDescending(c => c.CreatedAt),
                "popular" => query.OrderByDescending(c => c.StudentCount),
                "rating" => query.OrderByDescending(c => c.AverageRating),
                _ => query.OrderByDescending(c => c.IsFeatured).ThenByDescending(c => c.CreatedAt)
            };

            // Get total count for pagination
            var totalCourses = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCourses / pageSize);

            // Apply pagination
            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get available categories and difficulties for filters
            var categories = await _context.Courses
                .Where(c => c.IsPublished && c.IsApproved && c.Category != null)
                .Select(c => c.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            var difficulties = await _context.Courses
                .Where(c => c.IsPublished && c.IsApproved && c.Difficulty != null)
                .Select(c => c.Difficulty)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            // Featured courses for the top
            var featuredCourses = await _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsPublished && c.IsApproved && c.IsFeatured)
                .OrderByDescending(c => c.CreatedAt)
                .Take(3)
                .ToListAsync();

            ViewBag.Categories = categories;
            ViewBag.Difficulties = difficulties;
            ViewBag.FeaturedCourses = featuredCourses;
            ViewBag.CurrentCategory = category;
            ViewBag.CurrentDifficulty = difficulty;
            ViewBag.SearchTerm = searchTerm;
            ViewBag.SortBy = sortBy;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalCourses = totalCourses;

            return View(courses);
        }

        // GET: OurCourses/Details/5 - Course details page
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Modules.OrderBy(m => m.Order))
                .Include(c => c.Reviews.Where(r => r.IsVerified).OrderByDescending(r => r.CreatedAt))
                .FirstOrDefaultAsync(c => c.Id == id && c.IsPublished && c.IsApproved);

            if (course == null)
            {
                return NotFound();
            }

            // Get related courses
            var relatedCourses = await _context.Courses
                .Where(c => c.IsPublished && c.IsApproved && 
                           c.Id != id && 
                           (c.Category != null && course.Category != null && c.Category == course.Category) || 
                           (c.Difficulty != null && course.Difficulty != null && c.Difficulty == course.Difficulty))
                .OrderByDescending(c => c.IsFeatured)
                .ThenByDescending(c => c.CreatedAt)
                .Take(4)
                .ToListAsync();

            ViewBag.RelatedCourses = relatedCourses;

            return View(course);
        }

        // GET: OurCourses/Category/{category} - Courses by category
        public async Task<IActionResult> Category(string category, int page = 1)
        {
            var pageSize = 12;
            var query = _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsPublished && c.IsApproved && c.Category != null && c.Category == category);

            var totalCourses = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCourses / pageSize);

            var courses = await query
                .OrderByDescending(c => c.IsFeatured)
                .ThenByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.Category = category;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalCourses = totalCourses;

            return View("Index", courses);
        }

        // GET: OurCourses/Search - Search results
        public async Task<IActionResult> Search(string q, int page = 1)
        {
            if (string.IsNullOrEmpty(q))
            {
                return RedirectToAction(nameof(Index));
            }

            var pageSize = 12;
            var searchTerm = q.ToLower();
            
            var query = _context.Courses
                .Include(c => c.Instructor)
                .Where(c => c.IsPublished && c.IsApproved && 
                           (c.Title.ToLower().Contains(searchTerm) ||
                            c.Description.ToLower().Contains(searchTerm) ||
                            (c.ShortDescription != null && c.ShortDescription.ToLower().Contains(searchTerm)) ||
                            (c.Tags != null && c.Tags.ToLower().Contains(searchTerm)) ||
                            (c.Category != null && c.Category.ToLower().Contains(searchTerm))));

            var totalCourses = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCourses / pageSize);

            var courses = await query
                .OrderByDescending(c => c.IsFeatured)
                .ThenByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.SearchTerm = q;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalCourses = totalCourses;

            return View("Index", courses);
        }
    }
}
