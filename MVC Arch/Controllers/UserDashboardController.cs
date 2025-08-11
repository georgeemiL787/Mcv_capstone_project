using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class UserDashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}