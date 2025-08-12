using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class ContentProgress
    {
        [Key]
        public int Id { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime? CompletedAt { get; set; }

        public DateTime? LastAccessed { get; set; }

        public int TimeSpent { get; set; } = 0; // Time spent in minutes

        public int ProgressPercentage { get; set; } = 0; // 0-100

        public string? UserResponse { get; set; } // For assignments/quizzes

        public decimal? Score { get; set; } // For graded content

        public string? Feedback { get; set; } // Instructor feedback

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int ContentId { get; set; }
        public ModuleContent Content { get; set; } = null!;

        public int EnrollmentId { get; set; }
        public Enrollment Enrollment { get; set; } = null!;

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;
    }
}
