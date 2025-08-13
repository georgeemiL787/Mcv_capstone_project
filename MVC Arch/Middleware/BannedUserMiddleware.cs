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
                    // Check if user is banned
                    var bannedAccount = await dbContext.BannedAccounts
                        .FirstOrDefaultAsync(b => b.UserId == userId && b.UnbannedAt == null);

                    if (bannedAccount != null)
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
