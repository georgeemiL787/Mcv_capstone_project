using System.ComponentModel.DataAnnotations;

namespace MCV_Capstone.ViewModels
{
    public class AdminUserManagementViewModel
    {
        public List<AdminUserInfo> Users { get; set; } = new();
        public string SearchTerm { get; set; } = string.Empty;
        public string RoleFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
        public int CurrentPage { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public int TotalUsers { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalUsers / PageSize);
    }

    public class AdminUserInfo
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AccountStatus { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public List<string> Roles { get; set; } = new();
        public bool IsBanned { get; set; }
        public string? BanReason { get; set; }
        public DateTime? BannedAt { get; set; }
        public string? BannedByAdmin { get; set; }
    }

    public class BanUserViewModel
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Ban reason must be between 10 and 500 characters")]
        public string Reason { get; set; } = string.Empty;
    }

    public class UnbanUserViewModel
    {
        [Required]
        public int UserId { get; set; }

        [StringLength(500, ErrorMessage = "Unban reason cannot exceed 500 characters")]
        public string? Reason { get; set; }
    }

    public class UpdateUserStatusViewModel
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public string NewStatus { get; set; } = string.Empty;
    }
}
