using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCV_Capstone.Models
{
    public class BannedAccount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;

        [Required]
        public int BannedByAdminId { get; set; }

        [Required]
        public DateTime BannedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UnbannedAt { get; set; }

        public int? UnbannedByAdminId { get; set; }

        [MaxLength(500)]
        public string? UnbanReason { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("BannedByAdminId")]
        public User BannedByAdmin { get; set; } = null!;

        [ForeignKey("UnbannedByAdminId")]
        public User? UnbannedByAdmin { get; set; }
    }
}
