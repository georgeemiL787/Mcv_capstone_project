using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class LeaderboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}