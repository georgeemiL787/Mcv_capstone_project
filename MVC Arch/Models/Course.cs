using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(10, ErrorMessage = "Description must be at least 10 characters long")]
        public string Description { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? ShortDescription { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Discounted price must be greater than 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountedPrice { get; set; }

        [MaxLength(255)]
        [Url(ErrorMessage = "Please enter a valid URL")]
        public string? ThumbnailUrl { get; set; }

        [MaxLength(255)]
        [Url(ErrorMessage = "Please enter a valid URL")]
        public string? VideoUrl { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Duration must be at least 1 minute")]
        public int Duration { get; set; } // Duration in minutes

        [Required]
        [MaxLength(50)]
        public string Difficulty { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = "General";

        [MaxLength(255)]
        public string? Tags { get; set; } // Comma-separated tags

        public bool IsPublished { get; set; } = false;

        public bool IsFeatured { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? PublishedAt { get; set; }

        // Approval Workflow
        public bool IsApproved { get; set; } = false;
        public bool IsRejected { get; set; } = false;
        public DateTime? ApprovedAt { get; set; }
        public int? ApprovedBy { get; set; }
        public User? Approver { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? RejectedAt { get; set; }
        public int? RejectedBy { get; set; }
        public User? Rejector { get; set; }

        // Foreign Keys
        [Required]
        public int InstructorId { get; set; }
        public User? Instructor { get; set; }

        // Navigation Properties
        public List<CourseModule> Modules { get; set; } = new();
        public List<Enrollment> Enrollments { get; set; } = new();
        public List<CourseReview> Reviews { get; set; } = new();

        // Computed Properties
        [NotMapped]
        public int StudentCount => Enrollments?.Count(e => e.Status == "Active") ?? 0;

        [NotMapped]
        public double AverageRating => Reviews?.Any() == true ? Reviews.Average(r => r.Rating) : 0;
    }
}
