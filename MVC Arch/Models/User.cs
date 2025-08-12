using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace MCV_Capstone.Models
{
    public class User : IdentityUser<int>
    {
        [Required]
        [MaxLength(255)]
        public override string? Email { get; set; }

        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Headline { get; set; }

        public string? Biography { get; set; }

        [MaxLength(50)]
        public string? Language { get; set; }= "English";

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(50)]
        public string AccountStatus { get; set; } = "Active";

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        public DateTime? LastLogin { get; set; }

        // Store as Base64 string or byte[] (I'll explain in a moment)
        public string? ProfilePhoto { get; set; }

        public string? Preferences { get; set; }
    }
}
