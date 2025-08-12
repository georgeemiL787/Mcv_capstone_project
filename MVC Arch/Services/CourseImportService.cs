using MCV_Capstone.Data;
using MCV_Capstone.Models;
using MCV_Capstone.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace MCV_Capstone.Services
{
    public class CourseImportService : ICourseImportService
    {
        private readonly luiz_trialContext _context;
        private readonly ILogger<CourseImportService> _logger;

        public CourseImportService(luiz_trialContext context, ILogger<CourseImportService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public Task<CourseImportConfirmationViewModel> ValidateCourseImportAsync(CourseImportViewModel model)
        {
            var confirmation = new CourseImportConfirmationViewModel
            {
                CourseData = model,
                ImportDate = DateTime.UtcNow
            };

            var errors = new List<string>();

            // Basic validation
            if (string.IsNullOrWhiteSpace(model.Title))
                errors.Add("Course title is required");

            if (string.IsNullOrWhiteSpace(model.Category))
                errors.Add("Category is required");

            if (string.IsNullOrWhiteSpace(model.Description))
                errors.Add("Full description is required");

            if (model.Price < 0)
                errors.Add("Price cannot be negative");

            if (model.Duration <= 0)
                errors.Add("Duration must be greater than 0");

            if (model.Duration > 1440)
                errors.Add("Duration cannot exceed 24 hours (1440 minutes)");

            // URL validation
            if (!string.IsNullOrWhiteSpace(model.ThumbnailUrl) && !Uri.IsWellFormedUriString(model.ThumbnailUrl, UriKind.Absolute))
                errors.Add("Thumbnail URL must be a valid absolute URL");

            if (!string.IsNullOrWhiteSpace(model.VideoUrl) && !Uri.IsWellFormedUriString(model.VideoUrl, UriKind.Absolute))
                errors.Add("Video URL must be a valid absolute URL");

            // Discount validation
            if (model.DiscountedPrice.HasValue)
            {
                if (model.DiscountedPrice < 0)
                    errors.Add("Discounted price cannot be negative");

                if (model.DiscountedPrice >= model.Price)
                    errors.Add("Discounted price must be less than regular price");
            }

            confirmation.ValidationErrors = errors;
            confirmation.IsValid = !errors.Any();
            confirmation.ImportStatus = confirmation.IsValid ? "Ready for Import" : "Validation Failed";

            return Task.FromResult(confirmation);
        }

        public async Task<CourseImportResultViewModel> ImportCourseAsync(CourseImportViewModel model, int instructorId)
        {
            var startTime = DateTime.UtcNow;
            var result = new CourseImportResultViewModel
            {
                ImportDate = startTime,
                TotalCourses = 1
            };

            try
            {
                // Validate the model
                var validation = await ValidateCourseImportAsync(model);
                if (!validation.IsValid)
                {
                    result.FailedImports = 1;
                    result.ErrorMessages.AddRange(validation.ValidationErrors);
                    return result;
                }

                // Check if course already exists
                if (await CourseExistsAsync(model.Title, instructorId))
                {
                    result.FailedImports = 1;
                    result.ErrorMessages.Add($"Course with title '{model.Title}' already exists");
                    return result;
                }

                // Create new course
                var course = new Course
                {
                    Title = model.Title.Trim(),
                    Description = model.Description.Trim(),
                    ShortDescription = model.ShortDescription?.Trim(),
                    Price = model.Price,
                    DiscountedPrice = model.DiscountedPrice,
                    Duration = model.Duration,
                    Difficulty = model.Difficulty,
                    Category = model.Category.Trim(),
                    Tags = model.Tags?.Trim(),
                    ThumbnailUrl = model.ThumbnailUrl?.Trim(),
                    VideoUrl = model.VideoUrl?.Trim(),
                    InstructorId = instructorId,
                    CreatedAt = DateTime.UtcNow,
                    IsPublished = false,
                    IsApproved = false,
                    IsFeatured = false
                };

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                result.SuccessfullyImported = 1;
                result.SuccessMessages.Add($"Course '{model.Title}' imported successfully");
                result.ImportedCourses.Add(model);

                _logger.LogInformation("Course imported successfully: {CourseTitle} by instructor {InstructorId}", 
                    model.Title, instructorId);

                return result;
            }
            catch (Exception ex)
            {
                result.FailedImports = 1;
                result.ErrorMessages.Add($"Import failed: {ex.Message}");
                
                _logger.LogError(ex, "Course import failed for instructor {InstructorId}", instructorId);
                return result;
            }
            finally
            {
                result.ImportDuration = DateTime.UtcNow - startTime;
            }
        }

        public async Task<CourseImportResultViewModel> BulkImportCoursesAsync(BulkCourseImportViewModel model, int instructorId)
        {
            var startTime = DateTime.UtcNow;
            var result = new CourseImportResultViewModel
            {
                ImportDate = startTime
            };

            try
            {
                if (model.ImportFile == null)
                {
                    result.ErrorMessages.Add("No file provided for import");
                    return result;
                }

                switch (model.ImportFormat.ToUpper())
                {
                    case "CSV":
                        return await ProcessCsvImportAsync(model.ImportFile, instructorId, model.UpdateExisting);
                    case "JSON":
                        return await ProcessJsonImportAsync(model.ImportFile, instructorId, model.UpdateExisting);
                    case "EXCEL":
                        return await ProcessExcelImportAsync(model.ImportFile, instructorId, model.UpdateExisting);
                    default:
                        result.ErrorMessages.Add($"Unsupported import format: {model.ImportFormat}");
                        return result;
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessages.Add($"Bulk import failed: {ex.Message}");
                _logger.LogError(ex, "Bulk import failed for instructor {InstructorId}", instructorId);
                return result;
            }
            finally
            {
                result.ImportDuration = DateTime.UtcNow - startTime;
            }
        }

        public async Task<List<string>> GetAvailableCategoriesAsync()
        {
            return await _context.Courses
                .Where(c => !string.IsNullOrEmpty(c.Category))
                .Select(c => c.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        public List<string> GetDifficultyLevelsAsync()
        {
            return new List<string> { "Beginner", "Intermediate", "Advanced", "Expert" };
        }

        public async Task<bool> CourseExistsAsync(string title, int instructorId)
        {
            return await _context.Courses
                .AnyAsync(c => c.Title.ToLower() == title.ToLower() && c.InstructorId == instructorId);
        }

        public List<CourseImportResultViewModel> GetImportHistoryAsync(int instructorId)
        {
            // This would typically come from an import history table
            // For now, returning empty list
            return new List<CourseImportResultViewModel>();
        }

        public async Task<CourseImportResultViewModel> ProcessCsvImportAsync(IFormFile file, int instructorId, bool updateExisting = false)
        {
            var result = new CourseImportResultViewModel
            {
                ImportDate = DateTime.UtcNow
            };

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var csvContent = await reader.ReadToEndAsync();
                var lines = csvContent.Split('\n', StringSplitOptions.RemoveEmptyEntries);

                if (lines.Length < 2) // Header + at least one data row
                {
                    result.ErrorMessages.Add("CSV file must contain header row and at least one data row");
                    return result;
                }

                var headers = lines[0].Split(',').Select(h => h.Trim().ToLower()).ToArray();
                var dataRows = lines.Skip(1).Where(l => !string.IsNullOrWhiteSpace(l.Trim()));

                foreach (var row in dataRows)
                {
                    var values = ParseCsvRow(row);
                    if (values.Length != headers.Length)
                    {
                        result.ErrorMessages.Add($"Row has {values.Length} values but header has {headers.Length} columns");
                        continue;
                    }

                    var courseModel = CreateCourseFromCsvRow(headers, values);
                    var importResult = await ImportCourseAsync(courseModel, instructorId);

                    result.TotalCourses++;
                    result.SuccessfullyImported += importResult.SuccessfullyImported;
                    result.FailedImports += importResult.FailedImports;
                    result.SuccessMessages.AddRange(importResult.SuccessMessages);
                    result.ErrorMessages.AddRange(importResult.ErrorMessages);
                }

                return result;
            }
            catch (Exception ex)
            {
                result.ErrorMessages.Add($"CSV processing failed: {ex.Message}");
                return result;
            }
        }

        public async Task<CourseImportResultViewModel> ProcessJsonImportAsync(IFormFile file, int instructorId, bool updateExisting = false)
        {
            var result = new CourseImportResultViewModel
            {
                ImportDate = DateTime.UtcNow
            };

            try
            {
                using var stream = file.OpenReadStream();
                var jsonContent = await new StreamReader(stream).ReadToEndAsync();

                var courses = JsonSerializer.Deserialize<List<CourseImportViewModel>>(jsonContent);
                if (courses == null)
                {
                    result.ErrorMessages.Add("Invalid JSON format");
                    return result;
                }

                result.TotalCourses = courses.Count;

                foreach (var course in courses)
                {
                    var importResult = await ImportCourseAsync(course, instructorId);
                    result.SuccessfullyImported += importResult.SuccessfullyImported;
                    result.FailedImports += importResult.FailedImports;
                    result.SuccessMessages.AddRange(importResult.SuccessMessages);
                    result.ErrorMessages.AddRange(importResult.ErrorMessages);
                }

                return result;
            }
            catch (Exception ex)
            {
                result.ErrorMessages.Add($"JSON processing failed: {ex.Message}");
                return result;
            }
        }

        public Task<CourseImportResultViewModel> ProcessExcelImportAsync(IFormFile file, int instructorId, bool updateExisting = false)
        {
            var result = new CourseImportResultViewModel
            {
                ImportDate = DateTime.UtcNow
            };

            // Excel processing would require additional NuGet packages like EPPlus or ClosedXML
            // For now, returning an error message
            result.ErrorMessages.Add("Excel import is not yet implemented. Please use CSV or JSON format.");
            return Task.FromResult(result);
        }

        private string[] ParseCsvRow(string row)
        {
            var result = new List<string>();
            var current = new StringBuilder();
            bool inQuotes = false;

            for (int i = 0; i < row.Length; i++)
            {
                char c = row[i];

                if (c == '"')
                {
                    inQuotes = !inQuotes;
                }
                else if (c == ',' && !inQuotes)
                {
                    result.Add(current.ToString().Trim());
                    current.Clear();
                }
                else
                {
                    current.Append(c);
                }
            }

            result.Add(current.ToString().Trim());
            return result.ToArray();
        }

        private CourseImportViewModel CreateCourseFromCsvRow(string[] headers, string[] values)
        {
            var course = new CourseImportViewModel();

            for (int i = 0; i < headers.Length && i < values.Length; i++)
            {
                var header = headers[i];
                var value = values[i];

                switch (header)
                {
                    case "title":
                        course.Title = value;
                        break;
                    case "category":
                        course.Category = value;
                        break;
                    case "shortdescription":
                    case "short_description":
                        course.ShortDescription = value;
                        break;
                    case "description":
                        course.Description = value;
                        break;
                    case "price":
                        if (decimal.TryParse(value, out var price))
                            course.Price = price;
                        break;
                    case "discountedprice":
                    case "discounted_price":
                        if (decimal.TryParse(value, out var discountedPrice))
                            course.DiscountedPrice = discountedPrice;
                        break;
                    case "duration":
                        if (int.TryParse(value, out var duration))
                            course.Duration = duration;
                        break;
                    case "difficulty":
                        course.Difficulty = value;
                        break;
                    case "tags":
                        course.Tags = value;
                        break;
                    case "thumbnailurl":
                    case "thumbnail_url":
                        course.ThumbnailUrl = value;
                        break;
                    case "videourl":
                    case "video_url":
                        course.VideoUrl = value;
                        break;
                }
            }

            return course;
        }
    }
}
