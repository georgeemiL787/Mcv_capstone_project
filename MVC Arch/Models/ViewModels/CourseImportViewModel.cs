using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace MCV_Capstone.Models.ViewModels
{
    public class CourseImportViewModel
    {
        // Basic Course Information
        [Required(ErrorMessage = "Course title is required")]
        [StringLength(255, ErrorMessage = "Course title cannot exceed 255 characters")]
        [Display(Name = "Course Title")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        [Display(Name = "Category")]
        public string Category { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Short description cannot exceed 1000 characters")]
        [Display(Name = "Short Description")]
        public string? ShortDescription { get; set; }

        [Required(ErrorMessage = "Full description is required")]
        [StringLength(5000, ErrorMessage = "Full description cannot exceed 5000 characters")]
        [Display(Name = "Full Description")]
        public string Description { get; set; } = string.Empty;

        // Pricing Information
        [Required(ErrorMessage = "Price is required")]
        [Range(0.00, 9999.99, ErrorMessage = "Price must be between $0.00 and $9,999.99")]
        [Column(TypeName = "decimal(18,2)")]
        [Display(Name = "Price ($)")]
        public decimal Price { get; set; } = 0.00m;

        [Range(0.00, 9999.99, ErrorMessage = "Discounted price must be between $0.00 and $9,999.99")]
        [Column(TypeName = "decimal(18,2)")]
        [Display(Name = "Discounted Price ($)")]
        public decimal? DiscountedPrice { get; set; }

        // Course Details
        [Required(ErrorMessage = "Duration is required")]
        [Range(1, 1440, ErrorMessage = "Duration must be between 1 and 1440 minutes (24 hours)")]
        [Display(Name = "Duration (minutes)")]
        public int Duration { get; set; } = 120;

        [Required(ErrorMessage = "Difficulty level is required")]
        [Display(Name = "Difficulty Level")]
        public string Difficulty { get; set; } = "Beginner";

        [StringLength(500, ErrorMessage = "Tags cannot exceed 500 characters")]
        [Display(Name = "Tags")]
        public string? Tags { get; set; }

        // Media URLs
        [Url(ErrorMessage = "Please enter a valid URL for the thumbnail")]
        [Display(Name = "Thumbnail URL")]
        public string? ThumbnailUrl { get; set; }

        [Url(ErrorMessage = "Please enter a valid URL for the preview video")]
        [Display(Name = "Preview Video URL")]
        public string? VideoUrl { get; set; }

        // Additional Fields for Import Workflow
        [Display(Name = "Import Notes")]
        [StringLength(1000, ErrorMessage = "Import notes cannot exceed 1000 characters")]
        public string? ImportNotes { get; set; }

        [Display(Name = "Source Platform")]
        [StringLength(100, ErrorMessage = "Source platform cannot exceed 100 characters")]
        public string? SourcePlatform { get; set; }

        [Display(Name = "Original Course ID")]
        [StringLength(100, ErrorMessage = "Original course ID cannot exceed 100 characters")]
        public string? OriginalCourseId { get; set; }

        // Validation Properties
        public bool IsValidForImport => !string.IsNullOrWhiteSpace(Title) && 
                                       !string.IsNullOrWhiteSpace(Category) && 
                                       !string.IsNullOrWhiteSpace(Description) && 
                                       Price >= 0 && Duration > 0;

        // Helper Methods
        public string GetFormattedDuration()
        {
            if (Duration < 60)
                return $"{Duration} minutes";
            
            var hours = Duration / 60;
            var minutes = Duration % 60;
            
            if (minutes == 0)
                return $"{hours} hour{(hours > 1 ? "s" : "")}";
            
            return $"{hours} hour{(hours > 1 ? "s" : "")} {minutes} minute{(minutes > 1 ? "s" : "")}";
        }

        public List<string> GetTagsList()
        {
            if (string.IsNullOrWhiteSpace(Tags))
                return new List<string>();

            return Tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                      .Select(tag => tag.Trim())
                      .Where(tag => !string.IsNullOrWhiteSpace(tag))
                      .ToList();
        }

        public string GetFormattedPrice()
        {
            return Price.ToString("C");
        }

        public string GetFormattedDiscountedPrice()
        {
            return DiscountedPrice?.ToString("C") ?? "N/A";
        }

        public bool HasDiscount => DiscountedPrice.HasValue && DiscountedPrice < Price;

        public decimal GetDiscountPercentage()
        {
            if (!HasDiscount) return 0;
            return Math.Round(((Price - DiscountedPrice!.Value) / Price) * 100, 1);
        }
    }

    // ViewModel for Import Confirmation
    public class CourseImportConfirmationViewModel
    {
        public CourseImportViewModel CourseData { get; set; } = new();
        public bool IsValid { get; set; }
        public List<string> ValidationErrors { get; set; } = new();
        public string? ImportStatus { get; set; }
        public DateTime ImportDate { get; set; } = DateTime.UtcNow;
    }

    // ViewModel for Bulk Import
    public class BulkCourseImportViewModel
    {
        [Required(ErrorMessage = "Please select a file to import")]
        [Display(Name = "Import File")]
        public IFormFile? ImportFile { get; set; }

        [Display(Name = "Import Format")]
        public string ImportFormat { get; set; } = "CSV";

        [Display(Name = "Update Existing Courses")]
        public bool UpdateExisting { get; set; } = false;

        [Display(Name = "Skip Validation")]
        public bool SkipValidation { get; set; } = false;

        [Display(Name = "Import Notes")]
        public string? ImportNotes { get; set; }

        public List<string> SupportedFormats { get; set; } = new() { "CSV", "JSON", "Excel" };
    }

    // ViewModel for Import Results
    public class CourseImportResultViewModel
    {
        public int TotalCourses { get; set; }
        public int SuccessfullyImported { get; set; }
        public int FailedImports { get; set; }
        public int UpdatedCourses { get; set; }
        public List<string> SuccessMessages { get; set; } = new();
        public List<string> ErrorMessages { get; set; } = new();
        public List<CourseImportViewModel> ImportedCourses { get; set; } = new();
        public DateTime ImportDate { get; set; } = DateTime.UtcNow;
        public TimeSpan ImportDuration { get; set; }

        public bool HasErrors => ErrorMessages.Any();
        public bool HasWarnings => FailedImports > 0;
        public bool IsSuccessful => SuccessfullyImported > 0 && !HasErrors;

        public string GetSuccessRate()
        {
            if (TotalCourses == 0) return "0%";
            var rate = (double)SuccessfullyImported / TotalCourses * 100;
            return $"{rate:F1}%";
        }
    }
}
