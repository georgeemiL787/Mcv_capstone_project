using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class EnrollController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}