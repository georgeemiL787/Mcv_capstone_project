using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class MyCoursesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}