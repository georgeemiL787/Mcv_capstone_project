using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}