using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class ModuleContent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; } // For text content

        [MaxLength(255)]
        public string? FileUrl { get; set; } // For file attachments

        [MaxLength(255)]
        public string? VideoUrl { get; set; } // For video content

        [MaxLength(50)]
        public string ContentType { get; set; } = "Text"; // Text, Video, File, Quiz, Assignment

        public int Order { get; set; } // For ordering content within a module

        public int Duration { get; set; } // Duration in minutes (for videos)

        public bool IsRequired { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int ModuleId { get; set; }
        public CourseModule Module { get; set; } = null!;

        // Navigation Properties
        public List<ContentProgress> StudentProgress { get; set; } = new();
    }
}
