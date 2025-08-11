using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class CoursePreviewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}