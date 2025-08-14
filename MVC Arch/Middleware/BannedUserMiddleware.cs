using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Data;
using MCV_Capstone.Models;

namespace MCV_Capstone.Middleware
{
    public class BannedUserMiddleware
    {
        private readonly RequestDelegate _next;

        public BannedUserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, luiz_trialContext dbContext)
        {
            // Check if user is authenticated
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                {
                    // Check if user is banned by checking AccountStatus instead of BannedAccounts table
                    var user = await dbContext.Users
                        .FirstOrDefaultAsync(u => u.Id == userId);

                    if (user != null && user.AccountStatus == "Banned")
                    {
                        // User is banned, sign them out and redirect to banned page
                        await context.SignOutAsync("Cookies");
                        context.Response.Redirect("/Account/Banned");
                        return;
                    }
                }
            }

            await _next(context);
        }
    }
}
