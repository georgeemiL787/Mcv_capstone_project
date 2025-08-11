using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class CareerSimulatorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}