using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Services;
using MCV_Capstone.Data;
using Microsoft.EntityFrameworkCore;

namespace MCV_Capstone.Controllers
{
    public class CoursePreviewController : Controller
    {
        private readonly ISessionHelper _sessionHelper;
        private readonly luiz_trialContext _context;

        public CoursePreviewController(ISessionHelper sessionHelper, luiz_trialContext context)
        {
            _sessionHelper = sessionHelper;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return RedirectToAction("Login", "Account");
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return RedirectToAction("Login", "Account");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userIdInt);

            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            ViewBag.User = user;
            return View();
        }
    }
}