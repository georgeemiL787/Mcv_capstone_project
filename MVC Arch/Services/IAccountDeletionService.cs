using MCV_Capstone.Models;

namespace MCV_Capstone.Services
{
    public interface IAccountDeletionService
    {
        /// <summary>
        /// Deletes a user account and all associated data
        /// </summary>
        /// <param name="userId">The ID of the user to delete</param>
        /// <returns>True if deletion was successful, false otherwise</returns>
        Task<bool> DeleteAccountAsync(int userId);

        /// <summary>
        /// Gets a summary of what will be deleted for a user
        /// </summary>
        /// <param name="userId">The ID of the user</param>
        /// <returns>Account deletion summary</returns>
        Task<AccountDeletionSummary> GetDeletionSummaryAsync(int userId);
    }

    public class AccountDeletionSummary
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int CourseEnrollments { get; set; }
        public int CourseReviews { get; set; }
        public int PublishedCourses { get; set; }
        public bool HasActiveSubscriptions { get; set; }
        public DateTime AccountCreated { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}
