using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class InstructorDashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Analytics()
        {
            return View();
        }

        public IActionResult Courses()
        {
            return View();
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