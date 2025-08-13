using MCV_Capstone.Data;
using MCV_Capstone.Models;
using Microsoft.EntityFrameworkCore;

namespace MCV_Capstone.Services
{
    public interface IProfileService
    {
        Task<ProfileViewModel?> GetProfileAsync(int userId);
        Task<bool> UpdateProfileAsync(int userId, ProfileUpdateModel model);
        Task<int> GetCoursesCompletedAsync(int userId);
        Task<bool> UpdateLastLoginAsync(int userId);
    }

    public class ProfileService : IProfileService
    {
        private readonly luiz_trialContext _context;

        public ProfileService(luiz_trialContext context)
        {
            _context = context;
        }

        public async Task<ProfileViewModel?> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            var coursesCompleted = await GetCoursesCompletedAsync(userId);

            return new ProfileViewModel
            {
                User = user,
                CoursesCompleted = coursesCompleted,
                MemberSince = user.RegistrationDate.ToString("MMMM yyyy"),
                LastLogin = user.LastLogin?.ToString("MMMM dd, yyyy 'at' h:mm tt") ?? "Never"
            };
        }

        public async Task<bool> UpdateProfileAsync(int userId, ProfileUpdateModel model)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"ProfileService.UpdateProfileAsync called for user ID: {userId}");
                
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    System.Diagnostics.Debug.WriteLine($"User not found for ID: {userId}");
                    return false;
                }
                
                System.Diagnostics.Debug.WriteLine($"Found user: {user.Email} (ID: {user.Id})");

                // Check if email is already taken by another user
                if (model.Email != user.Email)
                {
                    var emailExists = await _context.Users
                        .AnyAsync(u => u.Email == model.Email && u.Id != userId);
                    
                    if (emailExists)
                        return false;
                }

                // Log current values before update
                System.Diagnostics.Debug.WriteLine("Current user values before update:");
                System.Diagnostics.Debug.WriteLine($"FirstName: {user.FirstName}");
                System.Diagnostics.Debug.WriteLine($"LastName: {user.LastName}");
                System.Diagnostics.Debug.WriteLine($"Email: {user.Email}");
                System.Diagnostics.Debug.WriteLine($"PhoneNumber: {user.PhoneNumber}");
                System.Diagnostics.Debug.WriteLine($"Biography: {user.Biography}");
                System.Diagnostics.Debug.WriteLine($"Location: {user.Location}");
                System.Diagnostics.Debug.WriteLine($"Headline: {user.Headline}");
                System.Diagnostics.Debug.WriteLine($"Language: {user.Language}");

                // Update user properties
                user.FirstName = model.FirstName?.Trim();
                user.LastName = model.LastName?.Trim();
                user.Email = model.Email?.Trim();
                user.PhoneNumber = model.Phone?.Trim();
                user.Biography = model.Bio?.Trim();
                user.Location = model.Location?.Trim();
                user.Headline = model.Headline?.Trim();
                user.Language = model.Language?.Trim();

                // Log new values after assignment
                System.Diagnostics.Debug.WriteLine("New user values after assignment:");
                System.Diagnostics.Debug.WriteLine($"FirstName: {user.FirstName}");
                System.Diagnostics.Debug.WriteLine($"LastName: {user.LastName}");
                System.Diagnostics.Debug.WriteLine($"Email: {user.Email}");
                System.Diagnostics.Debug.WriteLine($"PhoneNumber: {user.PhoneNumber}");
                System.Diagnostics.Debug.WriteLine($"Biography: {user.Biography}");
                System.Diagnostics.Debug.WriteLine($"Location: {user.Location}");
                System.Diagnostics.Debug.WriteLine($"Headline: {user.Headline}");
                System.Diagnostics.Debug.WriteLine($"Language: {user.Language}");

                // Mark the entity as modified
                _context.Entry(user).State = EntityState.Modified;
                
                // Debug: Check what Entity Framework thinks has changed
                var entry = _context.Entry(user);
                System.Diagnostics.Debug.WriteLine($"Entity state: {entry.State}");
                
                // Check which properties are marked as modified
                foreach (var property in entry.Properties)
                {
                    if (property.IsModified)
                    {
                        System.Diagnostics.Debug.WriteLine($"Property {property.Metadata.Name} is modified:");
                        System.Diagnostics.Debug.WriteLine($"  Original: {property.OriginalValue}");
                        System.Diagnostics.Debug.WriteLine($"  Current: {property.CurrentValue}");
                    }
                }
                
                // Save changes to database
                System.Diagnostics.Debug.WriteLine("About to call SaveChangesAsync...");
                var result = await _context.SaveChangesAsync();
                
                System.Diagnostics.Debug.WriteLine($"SaveChanges result: {result} rows affected");
                
                // Verify the update by checking the database
                if (result > 0)
                {
                    System.Diagnostics.Debug.WriteLine("SaveChanges successful, reloading user to verify...");
                    // Reload the user from database to verify changes
                    await _context.Entry(user).ReloadAsync();
                    
                    System.Diagnostics.Debug.WriteLine($"Verification after update:");
                    System.Diagnostics.Debug.WriteLine($"FirstName: {user.FirstName}");
                    System.Diagnostics.Debug.WriteLine($"LastName: {user.LastName}");
                    System.Diagnostics.Debug.WriteLine($"Email: {user.Email}");
                    System.Diagnostics.Debug.WriteLine($"PhoneNumber: {user.PhoneNumber}");
                    System.Diagnostics.Debug.WriteLine($"Biography: {user.Biography}");
                    System.Diagnostics.Debug.WriteLine($"Location: {user.Location}");
                    System.Diagnostics.Debug.WriteLine($"Headline: {user.Headline}");
                    System.Diagnostics.Debug.WriteLine($"Language: {user.Language}");
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("SaveChanges returned 0 rows affected - no changes were saved");
                }
                
                return result > 0;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                System.Diagnostics.Debug.WriteLine($"Profile update error: {ex.Message}");
                return false;
            }
        }

        public async Task<int> GetCoursesCompletedAsync(int userId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == userId)
                .CountAsync();
        }

        public async Task<bool> UpdateLastLoginAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            // Update last login time if it's been more than 1 hour since last update
            if (user.LastLogin == null || DateTime.UtcNow.Subtract(user.LastLogin.Value).TotalHours > 1)
            {
                user.LastLogin = DateTime.UtcNow;
                try
                {
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return true;
                }
                catch
                {
                    return false;
                }
            }

            return true;
        }
        

    }
}
