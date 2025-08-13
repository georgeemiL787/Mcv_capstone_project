using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Data;
using MCV_Capstone.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace MCV_Capstone.Services
{
    public class AccountDeletionService : IAccountDeletionService
    {
        private readonly luiz_trialContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<AccountDeletionService> _logger;

        public AccountDeletionService(
            luiz_trialContext context,
            UserManager<User> userManager,
            ILogger<AccountDeletionService> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<bool> DeleteAccountAsync(int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                _logger.LogInformation("Starting account deletion for user ID: {UserId}", userId);

                // Get user information
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    _logger.LogWarning("User not found for deletion: {UserId}", userId);
                    return false;
                }

                // Check if user is an instructor with published courses
                var publishedCourses = await _context.Courses
                    .Where(c => c.InstructorId == userId && c.IsPublished)
                    .ToListAsync();

                if (publishedCourses.Any())
                {
                    _logger.LogInformation("User {UserId} has {Count} published courses, marking as unavailable", userId, publishedCourses.Count);
                    
                    // Mark courses as instructor unavailable instead of deleting them
                    foreach (var course in publishedCourses)
                    {
                        course.InstructorId = null; // This will make the course show as "Instructor Unavailable"
                        course.IsPublished = false; // Unpublish the course
                        course.UpdatedAt = DateTime.UtcNow;
                    }
                    
                    // Save the course changes immediately
                    await _context.SaveChangesAsync();
                }

                // Delete all user-related data in the correct order to maintain referential integrity

                // 1. Delete content progress records
                var contentProgress = await _context.ContentProgress
                    .Where(cp => cp.Enrollment.StudentId == userId)
                    .ToListAsync();
                _context.ContentProgress.RemoveRange(contentProgress);
                _logger.LogInformation("Removed {Count} content progress records for user {UserId}", contentProgress.Count, userId);

                // 2. Delete module progress records
                var moduleProgress = await _context.ModuleProgress
                    .Where(mp => mp.Enrollment.StudentId == userId)
                    .ToListAsync();
                _context.ModuleProgress.RemoveRange(moduleProgress);
                _logger.LogInformation("Removed {Count} module progress records for user {UserId}", moduleProgress.Count, userId);

                // 3. Delete course reviews
                var courseReviews = await _context.CourseReviews
                    .Where(cr => cr.StudentId == userId)
                    .ToListAsync();
                _context.CourseReviews.RemoveRange(courseReviews);
                _logger.LogInformation("Removed {Count} course reviews for user {UserId}", courseReviews.Count, userId);

                // 4. Delete enrollments
                var enrollments = await _context.Enrollments
                    .Where(e => e.StudentId == userId)
                    .ToListAsync();
                _context.Enrollments.RemoveRange(enrollments);
                _logger.LogInformation("Removed {Count} enrollments for user {UserId}", enrollments.Count, userId);

                // 5. Delete courses where user is instructor (unpublished ones)
                var unpublishedCourses = await _context.Courses
                    .Where(c => c.InstructorId == userId && !c.IsPublished)
                    .ToListAsync();
                _context.Courses.RemoveRange(unpublishedCourses);
                _logger.LogInformation("Removed {Count} unpublished courses for user {UserId}", unpublishedCourses.Count, userId);

                // 6. Save changes for all the deletions above
                await _context.SaveChangesAsync();

                // 7. Finally, delete the user account using Identity
                var deleteResult = await _userManager.DeleteAsync(user);
                if (!deleteResult.Succeeded)
                {
                    var errors = string.Join(", ", deleteResult.Errors.Select(e => e.Description));
                    _logger.LogError("Failed to delete user account: {Errors}", errors);
                    await transaction.RollbackAsync();
                    return false;
                }

                _logger.LogInformation("Successfully deleted user account: {UserId}", userId);

                // Verify the user was actually deleted
                var verifyUser = await _userManager.FindByIdAsync(userId.ToString());
                if (verifyUser != null)
                {
                    _logger.LogError("User {UserId} still exists after deletion attempt", userId);
                    await transaction.RollbackAsync();
                    return false;
                }

                // Commit the transaction
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting account for user {UserId}", userId);
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<AccountDeletionSummary> GetDeletionSummaryAsync(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new AccountDeletionSummary();
                }

                var enrollments = await _context.Enrollments
                    .Where(e => e.StudentId == userId)
                    .CountAsync();

                var reviews = await _context.CourseReviews
                    .Where(cr => cr.StudentId == userId)
                    .CountAsync();

                var publishedCourses = await _context.Courses
                    .Where(c => c.InstructorId == userId && c.IsPublished)
                    .CountAsync();

                // Note: This is a simplified check. In a real application, you might have a separate subscriptions table
                var hasActiveSubscriptions = false; // Placeholder for subscription logic

                return new AccountDeletionSummary
                {
                    UserId = userId,
                    UserName = $"{user.FirstName} {user.LastName}",
                    CourseEnrollments = enrollments,
                    CourseReviews = reviews,
                    PublishedCourses = publishedCourses,
                    HasActiveSubscriptions = hasActiveSubscriptions,
                    AccountCreated = user.RegistrationDate,
                    LastLogin = user.LastLogin
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting deletion summary for user {UserId}", userId);
                return new AccountDeletionSummary();
            }
        }
    }
}
