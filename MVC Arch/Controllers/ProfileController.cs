using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Data;
using MCV_Capstone.Services;
using MCV_Capstone.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;

namespace MCV_Capstone.Controllers
{
    public class ProfileController : Controller
    {
        private readonly luiz_trialContext _context;
        private readonly ISessionHelper _sessionHelper;
        private readonly IProfileService _profileService;
        private readonly IPhotoService _photoService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(luiz_trialContext context, ISessionHelper sessionHelper, IProfileService profileService, IPhotoService photoService, ILogger<ProfileController> logger)
        {
            _context = context;
            _sessionHelper = sessionHelper;
            _profileService = profileService;
            _photoService = photoService;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return RedirectToAction("Login", "Account");
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            // Parse the user ID to int since our User model uses int
            if (!int.TryParse(userId, out int userIdInt))
            {
                return RedirectToAction("Login", "Account");
            }

            // Update last login
            await _profileService.UpdateLastLoginAsync(userIdInt);

            // Get profile data
            var profileViewModel = await _profileService.GetProfileAsync(userIdInt);
            if (profileViewModel == null)
            {
                return RedirectToAction("Login", "Account");
            }

            return View(profileViewModel);
        }

        [HttpPost]
        public async Task<IActionResult> Index(ProfileUpdateModel model)
        {
            System.Diagnostics.Debug.WriteLine("ProfileController.Index POST method called");
            
            if (!_sessionHelper.IsAuthenticated())
            {
                return RedirectToAction("Login", "Account");
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            if (!int.TryParse(userId, out int userIdInt))
            {
                return RedirectToAction("Login", "Account");
            }
            
                        System.Diagnostics.Debug.WriteLine($"Processing profile update for user ID: {userIdInt}");
            
            // Check if model is null
            if (model == null)
            {
                System.Diagnostics.Debug.WriteLine("ProfileUpdateModel is null!");
                TempData["ErrorMessage"] = "No profile data received.";
                return RedirectToAction("Index");
            }
            
            System.Diagnostics.Debug.WriteLine($"Model received - FirstName: {model.FirstName}, LastName: {model.LastName}, Email: {model.Email}");
            
            // Validate model
            if (!ModelState.IsValid)
            {
                // Log validation errors
                System.Diagnostics.Debug.WriteLine("ModelState validation failed:");
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    System.Diagnostics.Debug.WriteLine($"Validation error: {error.ErrorMessage}");
                }
                
                // Get profile data to redisplay the form
                var profileViewModel = await _profileService.GetProfileAsync(userIdInt);
                if (profileViewModel != null)
                {
                    // Update the user data with the submitted values for redisplay
                    profileViewModel.User.FirstName = model.FirstName;
                    profileViewModel.User.LastName = model.LastName;
                    profileViewModel.User.Email = model.Email;
                    profileViewModel.User.PhoneNumber = model.Phone;
                    profileViewModel.User.Biography = model.Bio;
                    profileViewModel.User.Location = model.Location;
                    profileViewModel.User.Headline = model.Headline;
                    profileViewModel.User.Language = model.Language;
                }
                
                TempData["ErrorMessage"] = "Please fix the validation errors below.";
                return View(profileViewModel);
            }

            try
            {
                // Log the received model data for debugging
                System.Diagnostics.Debug.WriteLine($"Received profile update model:");
                System.Diagnostics.Debug.WriteLine($"FirstName: {model.FirstName}");
                System.Diagnostics.Debug.WriteLine($"LastName: {model.LastName}");
                System.Diagnostics.Debug.WriteLine($"Email: {model.Email}");
                System.Diagnostics.Debug.WriteLine($"Phone: {model.Phone}");
                System.Diagnostics.Debug.WriteLine($"Bio: {model.Bio}");
                System.Diagnostics.Debug.WriteLine($"Location: {model.Location}");
                System.Diagnostics.Debug.WriteLine($"Headline: {model.Headline}");
                System.Diagnostics.Debug.WriteLine($"Language: {model.Language}");
                
                // Log the user ID being updated
                System.Diagnostics.Debug.WriteLine($"Updating profile for user ID: {userIdInt}");
                
                // Try to update the profile
                var success = await _profileService.UpdateProfileAsync(userIdInt, model);
                
                System.Diagnostics.Debug.WriteLine($"Profile update result: {success}");
                
                if (success)
                {
                    TempData["SuccessMessage"] = "Profile updated successfully! Your changes have been saved to the database.";
                    System.Diagnostics.Debug.WriteLine("Profile update completed successfully");
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while updating your profile. The email address might already be in use.";
                    System.Diagnostics.Debug.WriteLine("Profile update failed");
                }
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                System.Diagnostics.Debug.WriteLine($"Profile update error in controller: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
                TempData["ErrorMessage"] = "An unexpected error occurred while updating your profile. Please try again.";
            }

            // Redirect back to GET to show updated data
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Photo()
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return RedirectToAction("Login", "Account");
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            if (!int.TryParse(userId, out int userIdInt))
            {
                return RedirectToAction("Login", "Account");
            }

            // Get photo data
            var photoViewModel = await _photoService.GetPhotoAsync(userIdInt);
            if (photoViewModel == null)
            {
                return RedirectToAction("Login", "Account");
            }

            return View(photoViewModel);
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhoto(IFormFile photoFile)
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return Json(new { success = false, message = "Authentication required" });
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Json(new { success = false, message = "Invalid user session" });
            }

            if (photoFile == null)
            {
                return Json(new { success = false, message = "Please select a photo file" });
            }

            // Validate and upload photo
            var success = await _photoService.UploadPhotoAsync(userIdInt, photoFile);
            
            if (success)
            {
                // Get updated photo data
                var photoViewModel = await _photoService.GetPhotoAsync(userIdInt);
                return Json(new { 
                    success = true, 
                    message = "Photo uploaded successfully!",
                    photoUrl = photoViewModel?.PhotoUrl,
                    hasPhoto = photoViewModel?.HasPhoto ?? false
                });
            }
            else
            {
                return Json(new { success = false, message = "Failed to upload photo. Please try again." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePhoto([FromBody] PhotoEditModel model)
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return Json(new { success = false, message = "Authentication required" });
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Json(new { success = false, message = "Invalid user session" });
            }

            if (model == null)
            {
                return Json(new { success = false, message = "Invalid edit data" });
            }

            // Update photo with edits
            var success = await _photoService.UpdatePhotoAsync(userIdInt, model);
            
            if (success)
            {
                // Get updated photo data
                var photoViewModel = await _photoService.GetPhotoAsync(userIdInt);
                return Json(new { 
                    success = true, 
                    message = "Photo updated successfully!",
                    photoUrl = photoViewModel?.PhotoUrl,
                    hasPhoto = photoViewModel?.HasPhoto ?? false
                });
            }
            else
            {
                return Json(new { success = false, message = "Failed to update photo. Please try again." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> RemovePhoto()
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return Json(new { success = false, message = "Authentication required" });
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Json(new { success = false, message = "Invalid user session" });
            }

            // Remove photo
            var success = await _photoService.RemovePhotoAsync(userIdInt);
            
            if (success)
            {
                return Json(new { 
                    success = true, 
                    message = "Photo removed successfully!",
                    hasPhoto = false
                });
            }
            else
            {
                return Json(new { success = false, message = "Failed to remove photo. Please try again." });
            }
        }

        public IActionResult AccountSecurity()
        {
            return View();
        }

        public IActionResult NotificationPreferences()
        {
            return View();
        }

        public IActionResult PaymentMethods()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Subscriptions()
        {
            return View();
        }

        public async Task<IActionResult> DeleteAccount()
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return RedirectToAction("Login", "Account");
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            if (!int.TryParse(userId, out int userIdInt))
            {
                return RedirectToAction("Login", "Account");
            }

            // Get profile data for the view
            var profileViewModel = await _profileService.GetProfileAsync(userIdInt);
            if (profileViewModel == null)
            {
                return RedirectToAction("Login", "Account");
            }

            return View(profileViewModel);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAccountConfirmed(string confirmationText)
        {
            if (!_sessionHelper.IsAuthenticated())
            {
                return RedirectToAction("Login", "Account");
            }

            var userId = _sessionHelper.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            if (!int.TryParse(userId, out int userIdInt))
            {
                return RedirectToAction("Login", "Account");
            }

            // Verify confirmation text
            if (string.IsNullOrEmpty(confirmationText) || confirmationText != "DELETE")
            {
                TempData["ErrorMessage"] = "Invalid confirmation. Please type DELETE exactly as shown.";
                return RedirectToAction("DeleteAccount");
            }

            try
            {
                // Get the account deletion service
                var accountDeletionService = HttpContext.RequestServices.GetRequiredService<IAccountDeletionService>();
                
                // Delete the account
                var success = await accountDeletionService.DeleteAccountAsync(userIdInt);
                
                if (success)
                {
                    // Clear the session
                    _sessionHelper.ClearUserSession();
                    
                    // Sign out the user from Identity (this clears authentication cookies)
                    await HttpContext.SignOutAsync();
                    
                    // Also sign out from any other authentication schemes
                    await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
                    await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
                    await HttpContext.SignOutAsync(IdentityConstants.TwoFactorUserIdScheme);
                    
                    // Verify the user is no longer authenticated
                    if (User.Identity?.IsAuthenticated == true)
                    {
                        _logger.LogWarning("User still appears authenticated after sign out attempt");
                    }
                    
                    TempData["SuccessMessage"] = "Your account has been successfully deleted. We're sorry to see you go.";
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while deleting your account. Please try again or contact support.";
                    return RedirectToAction("DeleteAccount");
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                System.Diagnostics.Debug.WriteLine($"Account deletion error: {ex.Message}");
                TempData["ErrorMessage"] = "An unexpected error occurred while deleting your account. Please try again or contact support.";
                return RedirectToAction("DeleteAccount");
            }
        }
        

    }
}