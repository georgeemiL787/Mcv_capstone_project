using MCV_Capstone.ViewModels;
using Microsoft.AspNetCore.Mvc;
using MCV_Capstone.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MCV_Capstone.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly ILogger<AccountController> logger;

        public AccountController(
            SignInManager<User> signInManager, 
            UserManager<User> userManager, 
            RoleManager<IdentityRole<int>> roleManager,
            ILogger<AccountController> logger)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.logger = logger;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        
        [AllowAnonymous]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction("Index", "Home");
            }
            
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                // Check if user exists
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    logger.LogWarning("Login attempt failed for non-existent email: {Email}", model.Email);
                    return View(model);
                }

                // Check if account is locked
                if (await userManager.IsLockedOutAsync(user))
                {
                    var lockoutEnd = await userManager.GetLockoutEndDateAsync(user);
                    var remainingTime = lockoutEnd?.UtcDateTime - DateTime.UtcNow;
                    ModelState.AddModelError(string.Empty, $"Account is locked. Please try again in {remainingTime?.Minutes} minutes.");
                    logger.LogWarning("Login attempt failed for locked account: {Email}", model.Email);
                    return View(model);
                }

                // Check if account is banned
                if (user.AccountStatus == "Banned")
                {
                    ModelState.AddModelError(string.Empty, "Your account has been banned. Please contact support for assistance.");
                    logger.LogWarning("Login attempt failed for banned account: {Email}", model.Email);
                    return View(model);
                }

                // Attempt to sign in
                var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: true);
                
                if (result.Succeeded)
                {
                    // Update last login
                    user.LastLogin = DateTime.UtcNow;
                    await userManager.UpdateAsync(user);
                    
                    // Set session data
                    HttpContext.Session.SetString("UserId", user.Id.ToString());
                    HttpContext.Session.SetString("UserEmail", user.Email ?? string.Empty);
                    HttpContext.Session.SetString("UserName", $"{user.FirstName} {user.LastName}");
                    
                    // Get user roles
                    var roles = await userManager.GetRolesAsync(user);
                    HttpContext.Session.SetString("UserRoles", string.Join(",", roles));
                    
                    logger.LogInformation("User logged in successfully: {Email}", model.Email);
                    
                    // Redirect to return URL or home page
                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    
                    // Redirect based on role
                    if (roles.Contains("Instructor"))
                    {
                        return RedirectToAction("Index", "InstructorDashboard");
                    }
                    else if (roles.Contains("Company"))
                    {
                        return RedirectToAction("Index", "UserDashboard");
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                
                if (result.IsLockedOut)
                {
                    logger.LogWarning("Account locked due to failed login attempts: {Email}", model.Email);
                    ModelState.AddModelError(string.Empty, "Account locked due to multiple failed login attempts. Please try again later.");
                    return View(model);
                }
                
                if (result.RequiresTwoFactor)
                {
                    // TODO: Implement two-factor authentication
                    ModelState.AddModelError(string.Empty, "Two-factor authentication is required.");
                    return View(model);
                }
                
                // If we got this far, something failed
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                logger.LogWarning("Login attempt failed for user: {Email}", model.Email);
                return View(model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during login for user: {Email}", model.Email);
                ModelState.AddModelError(string.Empty, "An error occurred during login. Please try again.");
                return View(model);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userEmail = User.Identity?.Name;
                
                // Clear session data
                HttpContext.Session.Clear();
                
                // Sign out
                await signInManager.SignOutAsync();
                
                logger.LogInformation("User logged out: {Email}", userEmail);
                
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during logout");
                return RedirectToAction("Index", "Home");
            }
        }

        [AllowAnonymous]
        public IActionResult Signup()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [AllowAnonymous]
        public IActionResult Banned()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(SignupViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("Signup", model);
            }
            
            try
            {
                // Check if user already exists
                var existingUser = await userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    // Check if the existing user is banned
                    if (existingUser.AccountStatus == "Banned")
                    {
                        ModelState.AddModelError(string.Empty, "This email address is associated with a banned account. Please contact support for assistance.");
                        return View("Signup", model);
                    }
                    
                    ModelState.AddModelError(string.Empty, "A user with this email already exists.");
                    return View("Signup", model);
                }
                
                // Ensure default roles exist
                await EnsureRolesExist();
                
                // Validate RoleId
                if (model.RoleId < 1 || model.RoleId > 3)
                {
                    ModelState.AddModelError("RoleId", "Invalid account type selected");
                    return View("Signup", model);
                }

                var user = new User
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    UserName = model.Email,
                    EmailConfirmed = true, // Auto-confirm email for now
                    RegistrationDate = DateTime.UtcNow,
                    AccountStatus = "Active",
                    Language = "English" // Default language
                };

                var result = await userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    // Assign role based on RoleId
                    var roleName = GetRoleName(model.RoleId);
                    if (!string.IsNullOrEmpty(roleName))
                    {
                        var roleResult = await userManager.AddToRoleAsync(user, roleName);
                        if (roleResult.Succeeded)
                        {
                            // Auto-sign in the user
                            await signInManager.SignInAsync(user, isPersistent: false);
                            
                            // Set session data
                            HttpContext.Session.SetString("UserId", user.Id.ToString());
                            HttpContext.Session.SetString("UserEmail", user.Email);
                            HttpContext.Session.SetString("UserName", $"{user.FirstName} {user.LastName}");
                            HttpContext.Session.SetString("UserRoles", roleName);
                            
                            logger.LogInformation("New user registered successfully: {Email} with role {Role}", model.Email, roleName);
                            
                            // Redirect to home page after successful registration and login
                            TempData["SuccessMessage"] = $"Welcome {user.FirstName}! Your account has been created successfully.";
                            return RedirectToAction("Index", "Home");
                        }
                        else
                        {
                            // If role assignment fails, log the error but don't fail the registration
                            foreach (var error in roleResult.Errors)
                            {
                                logger.LogWarning("Role assignment failed for user {Email}: {Error}", model.Email, error.Description);
                            }
                            
                            // Still redirect to login since user was created successfully
                            TempData["SuccessMessage"] = $"Welcome {user.FirstName}! Your account has been created successfully.";
                            return RedirectToAction("Login", "Account");
                        }
                    }
                    else
                    {
                        // Invalid role ID
                        ModelState.AddModelError("RoleId", "Invalid account type selected");
                        return View("Signup", model);
                    }
                }

                // If we got this far, something failed
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                
                logger.LogWarning("User registration failed for email: {Email}", model.Email);
                return View("Signup", model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during user registration for email: {Email}", model.Email);
                ModelState.AddModelError(string.Empty, "An error occurred during registration. Please try again.");
                return View("Signup", model);
            }
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> Profile()
        {
            try
            {
                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return NotFound();
                }

                // Get user roles
                var roles = await userManager.GetRolesAsync(user);
                
                ViewBag.UserRoles = roles;
                return View(user);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving user profile");
                return RedirectToAction("Index", "Home");
            }
        }

        [Authorize]
        public IActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return NotFound();
                }

                var result = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
                if (result.Succeeded)
                {
                    // Refresh sign-in to update security stamp
                    await signInManager.RefreshSignInAsync(user);
                    
                    TempData["SuccessMessage"] = "Password changed successfully.";
                    logger.LogInformation("Password changed successfully for user: {Email}", user.Email);
                    
                    return RedirectToAction("Profile");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return View(model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error changing password");
                ModelState.AddModelError(string.Empty, "An error occurred while changing password.");
                return View(model);
            }
        }

        private async Task EnsureRolesExist()
        {
            var roles = new[] { "Student", "Instructor", "Company" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }
        }
        
        private string GetRoleName(int roleId)
        {
            return roleId switch
            {
                1 => "Student",
                2 => "Instructor", 
                3 => "Company",
                _ => string.Empty
            };
        }
    }
}