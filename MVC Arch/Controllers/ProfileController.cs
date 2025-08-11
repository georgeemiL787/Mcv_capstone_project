using Microsoft.AspNetCore.Mvc;

namespace MCV_Capstone.Controllers
{
    public class ProfileController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AccountSecurity()
        {
            return View();
        }

        public IActionResult NotificationPreferences()
        {
            return View();
        }

        public IActionResult PaymentMethods()
        {
            return View();
        }

        public IActionResult Photo()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Subscriptions()
        {
            return View();
        }
    }
}