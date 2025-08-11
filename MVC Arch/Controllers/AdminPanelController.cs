using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class AdminPanelController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}