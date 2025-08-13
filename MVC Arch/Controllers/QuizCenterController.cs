using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Student", "Company", "Admin")]
    public class QuizCenterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}