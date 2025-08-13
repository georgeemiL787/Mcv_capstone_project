using System.ComponentModel.DataAnnotations;

namespace MCV_Capstone.ViewModels
{
    public class AdminSettingsViewModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "Platform name cannot exceed 100 characters")]
        public string PlatformName { get; set; } = string.Empty;
        
        public bool MaintenanceMode { get; set; }
        
        public bool EmailNotifications { get; set; }
        
        [StringLength(500, ErrorMessage = "Maintenance message cannot exceed 500 characters")]
        public string? MaintenanceMessage { get; set; }
        
        public bool RequireEmailVerification { get; set; }
        
        public bool AllowUserRegistration { get; set; }
        
        [Range(1, 100, ErrorMessage = "Max courses per instructor must be between 1 and 100")]
        public int MaxCoursesPerInstructor { get; set; } = 10;
        
        [Range(0.01, 1.0, ErrorMessage = "Platform fee must be between 0.01 and 1.0")]
        public decimal PlatformFeePercentage { get; set; } = 0.10m;
    }
}
