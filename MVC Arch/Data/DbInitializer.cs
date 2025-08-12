using MCV_Capstone.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MCV_Capstone.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = serviceProvider.GetRequiredService<luiz_trialContext>();
            using var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            using var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Create roles if they don't exist
            string[] roles = { "Admin", "Instructor", "Student" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }

            // Create admin user if it doesn't exist
            var adminEmail = "admin@example.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    AccountStatus = "Active"
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Create instructor user if it doesn't exist
            var instructorEmail = "instructor@example.com";
            var instructorUser = await userManager.FindByEmailAsync(instructorEmail);
            if (instructorUser == null)
            {
                instructorUser = new User
                {
                    UserName = instructorEmail,
                    Email = instructorEmail,
                    FirstName = "John",
                    LastName = "Doe",
                    EmailConfirmed = true,
                    AccountStatus = "Active",
                    Headline = "Senior Software Developer & Instructor",
                    Biography = "Experienced software developer with 10+ years in web development. Passionate about teaching and helping others learn programming."
                };

                var result = await userManager.CreateAsync(instructorUser, "Instructor123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(instructorUser, "Instructor");
                }
            }

            // Create student user if it doesn't exist
            var studentEmail = "student@example.com";
            var studentUser = await userManager.FindByEmailAsync(studentEmail);
            if (studentUser == null)
            {
                studentUser = new User
                {
                    UserName = studentEmail,
                    Email = studentEmail,
                    FirstName = "Jane",
                    LastName = "Smith",
                    EmailConfirmed = true,
                    AccountStatus = "Active",
                    Headline = "Aspiring Developer",
                    Biography = "Learning to code and excited about the journey ahead!"
                };

                var result = await userManager.CreateAsync(studentUser, "Student123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(studentUser, "Student");
                }
            }

            // Seed sample courses if they don't exist
            if (!await context.Courses.AnyAsync())
            {
                var sampleCourses = new List<Course>
                {
                    new Course
                    {
                        Title = "Complete Web Development Bootcamp",
                        Description = "Learn web development from scratch with this comprehensive bootcamp. Cover HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and get job-ready skills.",
                        ShortDescription = "Master web development with HTML, CSS, JavaScript, React, and Node.js",
                        Price = 99.99m,
                        DiscountedPrice = 79.99m,
                        ThumbnailUrl = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
                        VideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Duration = 1200, // 20 hours
                        Difficulty = "Beginner",
                        Category = "Programming",
                        Tags = "Web Development, HTML, CSS, JavaScript, React, Node.js",
                        IsPublished = true,
                        IsApproved = true,
                        IsFeatured = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-30),
                        PublishedAt = DateTime.UtcNow.AddDays(-25),
                        ApprovedAt = DateTime.UtcNow.AddDays(-24),
                        ApprovedBy = adminUser.Id,
                        InstructorId = instructorUser.Id
                    },
                    new Course
                    {
                        Title = "Advanced JavaScript Masterclass",
                        Description = "Take your JavaScript skills to the next level. Learn advanced concepts like closures, prototypes, async programming, ES6+ features, and modern JavaScript patterns. Perfect for intermediate developers.",
                        ShortDescription = "Master advanced JavaScript concepts and modern ES6+ features",
                        Price = 69.99m,
                        ThumbnailUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                        VideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Duration = 600, // 10 hours
                        Difficulty = "Intermediate",
                        Category = "Programming",
                        Tags = "JavaScript, ES6, Advanced Programming, Web Development",
                        IsPublished = true,
                        IsApproved = true,
                        IsFeatured = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-20),
                        PublishedAt = DateTime.UtcNow.AddDays(-15),
                        ApprovedAt = DateTime.UtcNow.AddDays(-14),
                        ApprovedBy = adminUser.Id,
                        InstructorId = instructorUser.Id
                    },
                    new Course
                    {
                        Title = "UI/UX Design Fundamentals",
                        Description = "Learn the principles of user interface and user experience design. Create beautiful, functional, and user-friendly designs. Cover design thinking, wireframing, prototyping, and user research.",
                        ShortDescription = "Master UI/UX design principles and create user-friendly interfaces",
                        Price = 89.99m,
                        DiscountedPrice = 69.99m,
                        ThumbnailUrl = "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
                        VideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Duration = 900, // 15 hours
                        Difficulty = "Beginner",
                        Category = "Design",
                        Tags = "UI Design, UX Design, Design Thinking, Wireframing, Prototyping",
                        IsPublished = true,
                        IsApproved = true,
                        IsFeatured = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-15),
                        PublishedAt = DateTime.UtcNow.AddDays(-10),
                        ApprovedAt = DateTime.UtcNow.AddDays(-9),
                        ApprovedBy = adminUser.Id,
                        InstructorId = instructorUser.Id
                    },
                    new Course
                    {
                        Title = "Data Science for Beginners",
                        Description = "Introduction to data science concepts including data analysis, visualization, and basic machine learning. Learn Python, pandas, matplotlib, and scikit-learn. Perfect for beginners with no prior experience.",
                        ShortDescription = "Learn data science fundamentals with Python and popular libraries",
                        Price = 119.99m,
                        ThumbnailUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
                        VideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Duration = 1500, // 25 hours
                        Difficulty = "Beginner",
                        Category = "Programming",
                        Tags = "Data Science, Python, Machine Learning, Data Analysis, Pandas",
                        IsPublished = false, // Draft course
                        IsApproved = true, // Approved by admin
                        IsFeatured = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-5),
                        InstructorId = instructorUser.Id
                    },
                    new Course
                    {
                        Title = "Digital Marketing Strategy",
                        Description = "Comprehensive digital marketing course covering SEO, social media marketing, email marketing, content marketing, and analytics. Learn to create effective marketing campaigns and measure results.",
                        ShortDescription = "Master digital marketing strategies and grow your business online",
                        Price = 79.99m,
                        ThumbnailUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c072?w=400&h=300&fit=crop",
                        VideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Duration = 720, // 12 hours
                        Difficulty = "Beginner",
                        Category = "Marketing",
                        Tags = "Digital Marketing, SEO, Social Media, Email Marketing, Analytics",
                        IsPublished = true,
                        IsApproved = true,
                        IsFeatured = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-10),
                        PublishedAt = DateTime.UtcNow.AddDays(-7),
                        ApprovedAt = DateTime.UtcNow.AddDays(-6),
                        ApprovedBy = adminUser.Id,
                        InstructorId = instructorUser.Id
                    }
                };

                await context.Courses.AddRangeAsync(sampleCourses);
                await context.SaveChangesAsync();
            }

            // Seed sample course modules if they don't exist
            if (!await context.CourseModules.AnyAsync())
            {
                var courses = await context.Courses.ToListAsync();
                var webDevCourse = courses.FirstOrDefault(c => c.Title.Contains("Web Development"));
                
                if (webDevCourse != null)
                {
                    var modules = new List<CourseModule>
                    {
                        new CourseModule
                        {
                            Title = "Introduction to Web Development",
                            Description = "Get started with web development basics",
                            Order = 1,
                            CourseId = webDevCourse.Id
                        },
                        new CourseModule
                        {
                            Title = "HTML Fundamentals",
                            Description = "Learn HTML structure and semantic markup",
                            Order = 2,
                            CourseId = webDevCourse.Id
                        },
                        new CourseModule
                        {
                            Title = "CSS Styling",
                            Description = "Master CSS for beautiful web design",
                            Order = 3,
                            CourseId = webDevCourse.Id
                        },
                        new CourseModule
                        {
                            Title = "JavaScript Basics",
                            Description = "Learn JavaScript programming fundamentals",
                            Order = 4,
                            CourseId = webDevCourse.Id
                        }
                    };

                    await context.CourseModules.AddRangeAsync(modules);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
