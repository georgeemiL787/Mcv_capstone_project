using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Student", "Company", "Admin")]
    public class CareerSimulatorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}