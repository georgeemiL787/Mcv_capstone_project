namespace MCV_Capstone.Services
{
    public interface IUserAvatarService
    {
        Task<string> GetUserAvatarAsync(int userId);
        Task<string> GetCurrentUserAvatarAsync();
        string GetUserInitials(string firstName, string lastName);
    }
}
