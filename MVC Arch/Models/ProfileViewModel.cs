using System.ComponentModel.DataAnnotations;

namespace MCV_Capstone.Models
{
    public class ProfileViewModel
    {
        public User User { get; set; } = new User();
        public int CoursesCompleted { get; set; }
        public string MemberSince { get; set; } = string.Empty;
        public string LastLogin { get; set; } = string.Empty;
    }

    public class ProfileUpdateModel
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        [RegularExpression(@"^[\+]?[0-9][\d\s\-\(\)]{0,15}$", ErrorMessage = "Please enter a valid phone number")]
        public string? Phone { get; set; }

        [StringLength(1000, ErrorMessage = "Bio cannot exceed 1000 characters")]
        public string? Bio { get; set; }

        [StringLength(100, ErrorMessage = "Location cannot exceed 100 characters")]
        public string? Location { get; set; }

        [StringLength(255, ErrorMessage = "Headline cannot exceed 255 characters")]
        public string? Headline { get; set; }

        [StringLength(50, ErrorMessage = "Language cannot exceed 50 characters")]
        public string? Language { get; set; }
    }
}
