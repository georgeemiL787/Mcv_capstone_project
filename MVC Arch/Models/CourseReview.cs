using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class CourseReview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public bool IsVerified { get; set; } = false; // Verified enrollment

        public bool IsHelpful { get; set; } = false; // Marked as helpful by other users

        public int HelpfulCount { get; set; } = 0; // Number of helpful votes

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        public int? EnrollmentId { get; set; }
        public Enrollment? Enrollment { get; set; }
    }
}
