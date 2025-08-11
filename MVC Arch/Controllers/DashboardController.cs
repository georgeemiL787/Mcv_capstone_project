using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}