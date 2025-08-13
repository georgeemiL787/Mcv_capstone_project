using MCV_Capstone.Data;
using Microsoft.EntityFrameworkCore;

namespace MCV_Capstone.Services
{
    public class UserAvatarService : IUserAvatarService
    {
        private readonly luiz_trialContext _context;
        private readonly ISessionHelper _sessionHelper;

        public UserAvatarService(luiz_trialContext context, ISessionHelper sessionHelper)
        {
            _context = context;
            _sessionHelper = sessionHelper;
        }

        public async Task<string> GetUserAvatarAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return string.Empty;

            if (!string.IsNullOrEmpty(user.ProfilePhoto))
            {
                return $"data:image/jpeg;base64,{user.ProfilePhoto}";
            }

            return string.Empty;
        }

        public async Task<string> GetCurrentUserAvatarAsync()
        {
            if (!_sessionHelper.IsAuthenticated())
                return string.Empty;

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                return string.Empty;

            return await GetUserAvatarAsync(userIdInt);
        }

        public string GetUserInitials(string firstName, string lastName)
        {
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName))
                return "U";

            var firstInitial = !string.IsNullOrEmpty(firstName) ? firstName[0].ToString().ToUpper() : "";
            var lastInitial = !string.IsNullOrEmpty(lastName) ? lastName[0].ToString().ToUpper() : "";

            return firstInitial + lastInitial;
        }
    }
}
