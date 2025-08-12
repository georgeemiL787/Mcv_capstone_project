using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class CourseModule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int Order { get; set; } // For ordering modules within a course

        public int Duration { get; set; } // Duration in minutes

        [MaxLength(50)]
        public string? ModuleType { get; set; } // Video, Reading, Quiz, Assignment

        public bool IsRequired { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        // Navigation Properties
        public List<ModuleContent> Contents { get; set; } = new();
        public List<ModuleProgress> StudentProgress { get; set; } = new();

        // Computed Properties
        [NotMapped]
        public bool IsCompleted { get; set; } // Will be set based on student progress
    }
}
