using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class ModuleProgress
    {
        [Key]
        public int Id { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime? CompletedAt { get; set; }

        public DateTime? LastAccessed { get; set; }

        public int TimeSpent { get; set; } = 0; // Time spent in minutes

        public int ProgressPercentage { get; set; } = 0; // 0-100

        public string? Notes { get; set; } // Student notes

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int ModuleId { get; set; }
        public CourseModule Module { get; set; } = null!;

        public int EnrollmentId { get; set; }
        public Enrollment Enrollment { get; set; } = null!;

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;
    }
}
