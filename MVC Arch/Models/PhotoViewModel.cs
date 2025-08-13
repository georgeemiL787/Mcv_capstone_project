using System.ComponentModel.DataAnnotations;

namespace MCV_Capstone.Models
{
    public class PhotoViewModel
    {
        public User User { get; set; } = new User();
        public string CurrentPhotoBase64 { get; set; } = string.Empty;
        public bool HasPhoto { get; set; }
        public string PhotoUrl { get; set; } = string.Empty;
    }

    public class PhotoUploadModel
    {
        [Required(ErrorMessage = "Photo file is required")]
        public IFormFile PhotoFile { get; set; } = null!;
    }

    public class PhotoEditModel
    {
        public string PhotoBase64 { get; set; } = string.Empty;
        public double Brightness { get; set; } = 100;
        public double Contrast { get; set; } = 100;
        public double Saturation { get; set; } = 100;
        public double Rotation { get; set; } = 0;
        public bool FlipHorizontal { get; set; } = false;
        public bool FlipVertical { get; set; } = false;
    }
}
