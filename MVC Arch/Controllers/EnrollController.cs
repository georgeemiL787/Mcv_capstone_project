using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Attributes;

namespace MCV_Capstone.Controllers
{
    [RequireRole("Student")]
    public class EnrollController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}