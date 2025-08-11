using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class QuizCenterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}