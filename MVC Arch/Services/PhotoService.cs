using MCV_Capstone.Data;
using MCV_Capstone.Models;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace MCV_Capstone.Services
{
    public interface IPhotoService
    {
        Task<PhotoViewModel?> GetPhotoAsync(int userId);
        Task<bool> UploadPhotoAsync(int userId, IFormFile photoFile);
        Task<bool> UpdatePhotoAsync(int userId, PhotoEditModel model);
        Task<bool> RemovePhotoAsync(int userId);
        Task<string> ProcessImageAsync(IFormFile photoFile, PhotoEditModel? editModel = null);
        bool ValidatePhotoFile(IFormFile photoFile, out string errorMessage);
    }

    public class PhotoService : IPhotoService
    {
        private readonly luiz_trialContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        private const int MaxFileSizeMB = 5;
        private const int MaxFileSizeBytes = MaxFileSizeMB * 1024 * 1024;

        public PhotoService(luiz_trialContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<PhotoViewModel?> GetPhotoAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            return new PhotoViewModel
            {
                User = user,
                CurrentPhotoBase64 = user.ProfilePhoto ?? string.Empty,
                HasPhoto = !string.IsNullOrEmpty(user.ProfilePhoto),
                PhotoUrl = !string.IsNullOrEmpty(user.ProfilePhoto) 
                    ? $"data:image/jpeg;base64,{user.ProfilePhoto}" 
                    : string.Empty
            };
        }

        public async Task<bool> UploadPhotoAsync(int userId, IFormFile photoFile)
        {
            if (!ValidatePhotoFile(photoFile, out string errorMessage))
                return false;

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            try
            {
                // Process and optimize the image
                var processedImageBase64 = await ProcessImageAsync(photoFile);
                
                // Update user's profile photo
                user.ProfilePhoto = processedImageBase64;
                
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdatePhotoAsync(int userId, PhotoEditModel model)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || string.IsNullOrEmpty(user.ProfilePhoto))
                return false;

            try
            {
                // Apply edits to the existing photo
                var editedPhotoBase64 = await ApplyPhotoEditsAsync(user.ProfilePhoto, model);
                
                // Update user's profile photo
                user.ProfilePhoto = editedPhotoBase64;
                
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> RemovePhotoAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            try
            {
                // Remove profile photo
                user.ProfilePhoto = null;
                
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> ProcessImageAsync(IFormFile photoFile, PhotoEditModel? editModel = null)
        {
            using var memoryStream = new MemoryStream();
            await photoFile.CopyToAsync(memoryStream);
            
            using var image = Image.FromStream(memoryStream);
            
            // Resize image to optimal dimensions (400x400 for profile photos)
            var resizedImage = ResizeImage(image, 400, 400);
            
            // Apply edits if provided
            if (editModel != null)
            {
                resizedImage = ApplyEdits(resizedImage, editModel);
            }
            
            // Convert to JPEG format and compress
            using var outputStream = new MemoryStream();
            var jpegEncoder = GetEncoder(ImageFormat.Jpeg);
            var encoderParams = new EncoderParameters(1);
            encoderParams.Param[0] = new EncoderParameter(Encoder.Quality, 85L); // 85% quality
            
            resizedImage.Save(outputStream, jpegEncoder, encoderParams);
            
            // Convert to Base64
            var imageBytes = outputStream.ToArray();
            return Convert.ToBase64String(imageBytes);
        }

        public bool ValidatePhotoFile(IFormFile photoFile, out string errorMessage)
        {
            errorMessage = string.Empty;
            
            if (photoFile == null || photoFile.Length == 0)
            {
                errorMessage = "Please select a photo file.";
                return false;
            }
            
            if (photoFile.Length > MaxFileSizeBytes)
            {
                errorMessage = $"File size must be less than {MaxFileSizeMB}MB.";
                return false;
            }
            
            var extension = Path.GetExtension(photoFile.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                errorMessage = "Only JPG, PNG, and GIF files are allowed.";
                return false;
            }
            
            return true;
        }

        private async Task<string> ApplyPhotoEditsAsync(string photoBase64, PhotoEditModel model)
        {
            var imageBytes = Convert.FromBase64String(photoBase64);
            using var inputStream = new MemoryStream(imageBytes);
            using var image = Image.FromStream(inputStream);
            
            var editedImage = ApplyEdits(image, model);
            
            using var outputStream = new MemoryStream();
            var jpegEncoder = GetEncoder(ImageFormat.Jpeg);
            var encoderParams = new EncoderParameters(1);
            encoderParams.Param[0] = new EncoderParameter(Encoder.Quality, 85L);
            
            editedImage.Save(outputStream, jpegEncoder, encoderParams);
            
            var editedBytes = outputStream.ToArray();
            return Convert.ToBase64String(editedBytes);
        }

        private Image ApplyEdits(Image image, PhotoEditModel model)
        {
            // Create a copy of the image to apply edits
            var bitmap = new Bitmap(image);
            
            // Apply brightness, contrast, and saturation
            if (Math.Abs(model.Brightness - 100) > 1 || 
                Math.Abs(model.Contrast - 100) > 1 || 
                Math.Abs(model.Saturation - 100) > 1)
            {
                bitmap = ApplyColorAdjustments(bitmap, model);
            }
            
            // Apply rotation
            if (Math.Abs(model.Rotation) > 1)
            {
                bitmap = RotateImage(bitmap, model.Rotation);
            }
            
            // Apply flips
            if (model.FlipHorizontal || model.FlipVertical)
            {
                bitmap = FlipImage(bitmap, model.FlipHorizontal, model.FlipVertical);
            }
            
            return bitmap;
        }

        private Bitmap ApplyColorAdjustments(Bitmap bitmap, PhotoEditModel model)
        {
            // Simple color adjustment implementation
            // In a production environment, you might want to use more sophisticated image processing libraries
            var adjustedBitmap = new Bitmap(bitmap.Width, bitmap.Height);
            
            for (int x = 0; x < bitmap.Width; x++)
            {
                for (int y = 0; y < bitmap.Height; y++)
                {
                    var pixel = bitmap.GetPixel(x, y);
                    
                    // Apply brightness
                    var brightness = (model.Brightness - 100) / 100.0;
                    var r = Math.Max(0, Math.Min(255, pixel.R + (brightness * 255)));
                    var g = Math.Max(0, Math.Min(255, pixel.G + (brightness * 255)));
                    var b = Math.Max(0, Math.Min(255, pixel.B + (brightness * 255)));
                    
                    // Apply contrast
                    var contrast = model.Contrast / 100.0;
                    r = Math.Max(0, Math.Min(255, ((r - 128) * contrast) + 128));
                    g = Math.Max(0, Math.Min(255, ((g - 128) * contrast) + 128));
                    b = Math.Max(0, Math.Min(255, ((b - 128) * contrast) + 128));
                    
                    adjustedBitmap.SetPixel(x, y, Color.FromArgb(pixel.A, (int)r, (int)g, (int)b));
                }
            }
            
            return adjustedBitmap;
        }

        private Bitmap RotateImage(Bitmap bitmap, double angle)
        {
            var radians = angle * Math.PI / 180.0;
            var cos = Math.Cos(radians);
            var sin = Math.Sin(radians);
            
            var rotatedWidth = (int)Math.Ceiling(Math.Abs(bitmap.Width * cos) + Math.Abs(bitmap.Height * sin));
            var rotatedHeight = (int)Math.Ceiling(Math.Abs(bitmap.Width * sin) + Math.Abs(bitmap.Height * cos));
            
            var rotatedBitmap = new Bitmap(rotatedWidth, rotatedHeight);
            var graphics = Graphics.FromImage(rotatedBitmap);
            
            graphics.TranslateTransform(rotatedWidth / 2.0f, rotatedHeight / 2.0f);
            graphics.RotateTransform((float)angle);
            graphics.TranslateTransform(-bitmap.Width / 2.0f, -bitmap.Height / 2.0f);
            
            graphics.DrawImage(bitmap, 0, 0);
            graphics.Dispose();
            
            return rotatedBitmap;
        }

        private Bitmap FlipImage(Bitmap bitmap, bool flipHorizontal, bool flipVertical)
        {
            var flippedBitmap = new Bitmap(bitmap.Width, bitmap.Height);
            var graphics = Graphics.FromImage(flippedBitmap);
            
            if (flipHorizontal && flipVertical)
            {
                graphics.ScaleTransform(-1, -1);
                graphics.TranslateTransform(-bitmap.Width, -bitmap.Height);
            }
            else if (flipHorizontal)
            {
                graphics.ScaleTransform(-1, 1);
                graphics.TranslateTransform(-bitmap.Width, 0);
            }
            else if (flipVertical)
            {
                graphics.ScaleTransform(1, -1);
                graphics.TranslateTransform(0, -bitmap.Height);
            }
            
            graphics.DrawImage(bitmap, 0, 0);
            graphics.Dispose();
            
            return flippedBitmap;
        }

        private Image ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);
            
            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);
            
            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                
                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }
            
            return destImage;
        }

        private ImageCodecInfo GetEncoder(ImageFormat format)
        {
            var codecs = ImageCodecInfo.GetImageDecoders();
            foreach (var codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null!;
        }
    }
}
