using Microsoft.AspNetCore.Http;

namespace MCV_Capstone.Services
{
    public interface ISessionHelper
    {
        string? GetUserId();
        string? GetUserEmail();
        string? GetUserName();
        string? GetUserFirstName();
        string[] GetUserRoles();
        bool IsAuthenticated();
        bool HasRole(string role);
        void SetUserSession(string userId, string email, string userName, string[] roles);
        void ClearUserSession();
    }

    public class SessionHelper : ISessionHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SessionHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.Session.GetString("UserId");
        }

        public string? GetUserEmail()
        {
            return _httpContextAccessor.HttpContext?.Session.GetString("UserEmail");
        }

        public string? GetUserName()
        {
            return _httpContextAccessor.HttpContext?.Session.GetString("UserName");
        }

        public string? GetUserFirstName()
        {
            var userName = GetUserName();
            if (string.IsNullOrEmpty(userName))
                return null;
            
            // Extract first name from full name (assuming format: "FirstName LastName")
            var nameParts = userName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return nameParts.Length > 0 ? nameParts[0] : userName;
        }

        public string[] GetUserRoles()
        {
            var rolesString = _httpContextAccessor.HttpContext?.Session.GetString("UserRoles");
            if (string.IsNullOrEmpty(rolesString))
                return Array.Empty<string>();
            
            return rolesString.Split(',', StringSplitOptions.RemoveEmptyEntries);
        }

        public bool IsAuthenticated()
        {
            return !string.IsNullOrEmpty(GetUserId());
        }

        public bool HasRole(string role)
        {
            var roles = GetUserRoles();
            return roles.Contains(role, StringComparer.OrdinalIgnoreCase);
        }

        public void SetUserSession(string userId, string email, string userName, string[] roles)
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            if (session != null)
            {
                session.SetString("UserId", userId);
                session.SetString("UserEmail", email);
                session.SetString("UserName", userName);
                session.SetString("UserRoles", string.Join(",", roles));
            }
        }

        public void ClearUserSession()
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            if (session != null)
            {
                session.Clear();
            }
        }
    }
}
