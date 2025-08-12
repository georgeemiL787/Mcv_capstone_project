using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class Enrollment
    {
        [Key]
        public int Id { get; set; }

        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

        public DateTime? CompletionDate { get; set; }

        public DateTime? LastAccessed { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; }

        [MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Completed, Failed, Refunded

        [MaxLength(50)]
        public string Status { get; set; } = "Active"; // Active, Completed, Cancelled, Suspended

        public int ProgressPercentage { get; set; } = 0; // 0-100

        public bool IsCompleted { get; set; } = false;

        public string? CertificateUrl { get; set; } // URL to completion certificate

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        // Navigation Properties
        public List<ModuleProgress> ModuleProgress { get; set; } = new();
        public List<ContentProgress> ContentProgress { get; set; } = new();
        public List<CourseReview> Reviews { get; set; } = new();

        // Computed Properties
        [NotMapped]
        public EnrollmentStatus EnrollmentStatus => Status switch
        {
            "Active" => EnrollmentStatus.Active,
            "Completed" => EnrollmentStatus.Completed,
            "Cancelled" => EnrollmentStatus.Cancelled,
            "Suspended" => EnrollmentStatus.Suspended,
            _ => EnrollmentStatus.Active
        };
    }

    public enum EnrollmentStatus
    {
        Active,
        Completed,
        Cancelled,
        Suspended
    }
}
