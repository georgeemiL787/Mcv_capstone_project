using System.ComponentModel.DataAnnotations;
using MCV_Capstone.Models;

namespace MCV_Capstone.ViewModels
{
    public class AdminCourseManagementViewModel
    {
        public List<AdminCourseInfo> Courses { get; set; } = new();
        public string Filter { get; set; } = "all";
        public string SearchTerm { get; set; } = string.Empty;
        public string CategoryFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
        public int CurrentPage { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public int TotalCourses { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCourses / PageSize);
    }

    public class AdminCourseInfo
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Tags { get; set; }
        public bool IsPublished { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public string? RejectionReason { get; set; }
        public string InstructorName { get; set; } = string.Empty;
        public string InstructorEmail { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int StudentCount { get; set; }
        public double AverageRating { get; set; }
        public int ModuleCount { get; set; }
        public int ReviewCount { get; set; }
        public string ApprovalStatus => GetApprovalStatus();
        public string StatusBadgeClass => GetStatusBadgeClass();

        private string GetApprovalStatus()
        {
            if (IsApproved) return "Approved";
            if (IsRejected) return "Rejected";
            return "Pending Review";
        }

        private string GetStatusBadgeClass()
        {
            if (IsApproved) return "status-approved";
            if (IsRejected) return "status-rejected";
            return "status-pending";
        }
    }

    public class ApproveCourseViewModel
    {
        [Required]
        public int CourseId { get; set; }
    }

    public class RejectCourseViewModel
    {
        [Required]
        public int CourseId { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Rejection reason must be between 10 and 1000 characters")]
        public string Reason { get; set; } = string.Empty;
    }

    public class CourseDetailsViewModel
    {
        public AdminCourseInfo Course { get; set; } = new();
        public List<CourseModule> Modules { get; set; } = new();
        public List<CourseReview> Reviews { get; set; } = new();
        public List<Enrollment> Enrollments { get; set; } = new();
    }
}
