using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MCV_Capstone.Services;

namespace MCV_Capstone.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class RequireRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _requiredRoles;

        public RequireRoleAttribute(params string[] roles)
        {
            _requiredRoles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var sessionHelper = context.HttpContext.RequestServices.GetService<ISessionHelper>();
            
            if (sessionHelper == null || !sessionHelper.IsAuthenticated())
            {
                // Redirect unauthenticated users to signup page
                context.Result = new RedirectToActionResult("Signup", "Account", new { returnUrl = context.HttpContext.Request.Path });
                return;
            }

            var userRoles = sessionHelper.GetUserRoles();
            var hasRequiredRole = _requiredRoles.Any(role => 
                userRoles.Contains(role, StringComparer.OrdinalIgnoreCase));

            if (!hasRequiredRole)
            {
                context.Result = new RedirectToActionResult("AccessDenied", "Account", null);
            }
        }
    }
}
