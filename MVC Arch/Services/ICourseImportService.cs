using MCV_Capstone.Models.ViewModels;
using Microsoft.AspNetCore.Http;

namespace MCV_Capstone.Services
{
    public interface ICourseImportService
    {
        /// <summary>
        /// Validates course import data
        /// </summary>
        Task<CourseImportConfirmationViewModel> ValidateCourseImportAsync(CourseImportViewModel model);

        /// <summary>
        /// Imports a single course into the database
        /// </summary>
        Task<CourseImportResultViewModel> ImportCourseAsync(CourseImportViewModel model, int instructorId);

        /// <summary>
        /// Imports multiple courses from a file
        /// </summary>
        Task<CourseImportResultViewModel> BulkImportCoursesAsync(BulkCourseImportViewModel model, int instructorId);

        /// <summary>
        /// Gets available categories for import
        /// </summary>
        Task<List<string>> GetAvailableCategoriesAsync();

        /// <summary>
        /// Gets available difficulty levels
        /// </summary>
        List<string> GetDifficultyLevelsAsync();

        /// <summary>
        /// Checks if a course with similar title already exists
        /// </summary>
        Task<bool> CourseExistsAsync(string title, int instructorId);

        /// <summary>
        /// Gets import history for an instructor
        /// </summary>
        List<CourseImportResultViewModel> GetImportHistoryAsync(int instructorId);

        /// <summary>
        /// Validates and processes CSV import
        /// </summary>
        Task<CourseImportResultViewModel> ProcessCsvImportAsync(IFormFile file, int instructorId, bool updateExisting = false);

        /// <summary>
        /// Validates and processes JSON import
        /// </summary>
        Task<CourseImportResultViewModel> ProcessJsonImportAsync(IFormFile file, int instructorId, bool updateExisting = false);

        /// <summary>
        /// Validates and processes Excel import
        /// </summary>
        Task<CourseImportResultViewModel> ProcessExcelImportAsync(IFormFile file, int instructorId, bool updateExisting = false);
    }
}
