using Microsoft.AspNetCore.Http;
using MCV_Capstone.Services;

namespace MCV_Capstone.Middleware
{
    public class SessionValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SessionValidationMiddleware> _logger;

        public SessionValidationMiddleware(RequestDelegate next, ILogger<SessionValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ISessionHelper sessionHelper)
        {
            try
            {
                // Skip session validation for static files and authentication endpoints
                if (ShouldSkipSessionValidation(context.Request.Path))
                {
                    await _next(context);
                    return;
                }

                // Check if user has a valid session
                if (sessionHelper.IsAuthenticated())
                {
                    var userId = sessionHelper.GetUserId();
                    var userEmail = sessionHelper.GetUserEmail();
                    
                    if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(userEmail))
                    {
                        // Log session activity
                        _logger.LogDebug("Valid session for user: {UserId} ({Email})", userId, userEmail);
                        
                        // Extend session if needed (implement sliding expiration logic here)
                        // This could involve updating a last activity timestamp
                    }
                    else
                    {
                        // Invalid session data, clear it
                        _logger.LogWarning("Invalid session data detected, clearing session");
                        sessionHelper.ClearUserSession();
                    }
                }

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SessionValidationMiddleware");
                await _next(context);
            }
        }

        private static bool ShouldSkipSessionValidation(PathString path)
        {
            var skipPaths = new[]
            {
                "/css/",
                "/js/",
                "/assets/",
                "/lib/",
                "/favicon.ico",
                "/Account/Login",
                "/Account/Signup",
                "/Account/Register"
            };

            return skipPaths.Any(skipPath => path.StartsWithSegments(skipPath));
        }
    }

    // Extension method for easy middleware registration
    public static class SessionValidationMiddlewareExtensions
    {
        public static IApplicationBuilder UseSessionValidation(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SessionValidationMiddleware>();
        }
    }
}
