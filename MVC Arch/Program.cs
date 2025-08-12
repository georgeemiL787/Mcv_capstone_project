using MCV_Capstone.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Session;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add HttpContextAccessor for session management
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<MCV_Capstone.Services.ISessionHelper, MCV_Capstone.Services.SessionHelper>();

// Register CORS services (required before using CORS middleware)
builder.Services.AddCors();

// Add Session services
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Session timeout
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

// Database context
builder.Services.AddDbContext<luiz_trialContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Enhanced Identity configuration
builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
{
    // Password requirements
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireDigit = true;
    
    // User requirements
    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    
    // Sign-in requirements
    options.SignIn.RequireConfirmedPhoneNumber = false;
    options.SignIn.RequireConfirmedAccount = false;
    options.SignIn.RequireConfirmedEmail = false;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<luiz_trialContext>()
.AddDefaultTokenProviders();

// Enhanced Cookie Authentication
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(2); // Cookie expiration
    options.Cookie.Name = "MCV_Capstone.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Lax;
    
    // Events for custom authentication logic
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
        context.Response.Redirect(options.LoginPath);
        return Task.CompletedTask;
    };
    
    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = 403;
            return Task.CompletedTask;
        }
        context.Response.Redirect(options.AccessDeniedPath);
        return Task.CompletedTask;
    };
});

// Add Authorization policies
builder.Services.AddAuthorization(options =>
{
    // Student policy
    options.AddPolicy("StudentOnly", policy =>
        policy.RequireRole("Student"));
    
    // Instructor policy
    options.AddPolicy("InstructorOnly", policy =>
        policy.RequireRole("Instructor"));
    
    // Company policy
    options.AddPolicy("CompanyOnly", policy =>
        policy.RequireRole("Company"));
    
    // Admin policy (can be multiple roles)
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin", "Instructor"));
    
    // Authenticated users only
    options.AddPolicy("AuthenticatedUsers", policy =>
        policy.RequireAuthenticatedUser());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts(); // Enable HSTS in production
}
else
{
    app.UseDeveloperExceptionPage();
}

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    
    await next();
});

// Serve static files from the wwwroot folder
app.UseStaticFiles();

// Add CORS for development
if (app.Environment.IsDevelopment())
{
    app.UseCors(builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
}

app.UseRouting();

// Use Session before Authentication
app.UseSession();

// Use custom session validation middleware
app.UseMiddleware<MCV_Capstone.Middleware.SessionValidationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Ensure database is created and migrations are applied at startup
try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<luiz_trialContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    
    dbContext.Database.Migrate();
    
    // Seed default roles if they don't exist
    await SeedDefaultRoles(roleManager);
}
catch (Exception ex)
{
    // Log the exception but don't crash the app
    Console.WriteLine($"Database initialization error: {ex.Message}");
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

// Helper method to seed default roles
async Task SeedDefaultRoles(RoleManager<IdentityRole<int>> roleManager)
{
    string[] roles = { "Student", "Instructor", "Company", "Admin" };
    
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole<int>(role));
        }
    }
}
