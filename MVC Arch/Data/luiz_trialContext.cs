using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace MCV_Capstone.Data
{
    public class luiz_trialContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public luiz_trialContext(DbContextOptions<luiz_trialContext> options) : base(options) { }

        // Course-related DbSets
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseModule> CourseModules { get; set; }
        public DbSet<ModuleContent> ModuleContents { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<ModuleProgress> ModuleProgress { get; set; }
        public DbSet<ContentProgress> ContentProgress { get; set; }
        public DbSet<CourseReview> CourseReviews { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships
            builder.Entity<Course>()
                .HasOne(c => c.Instructor)
                .WithMany()
                .HasForeignKey(c => c.InstructorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CourseModule>()
                .HasOne(m => m.Course)
                .WithMany(c => c.Modules)
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ModuleContent>()
                .HasOne(c => c.Module)
                .WithMany(m => m.Contents)
                .HasForeignKey(c => c.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany()
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ModuleProgress>()
                .HasOne(p => p.Module)
                .WithMany(m => m.StudentProgress)
                .HasForeignKey(p => p.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ModuleProgress>()
                .HasOne(p => p.Enrollment)
                .WithMany(e => e.ModuleProgress)
                .HasForeignKey(p => p.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ContentProgress>()
                .HasOne(p => p.Content)
                .WithMany(c => c.StudentProgress)
                .HasForeignKey(p => p.ContentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ContentProgress>()
                .HasOne(p => p.Enrollment)
                .WithMany(e => e.ContentProgress)
                .HasForeignKey(p => p.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CourseReview>()
                .HasOne(r => r.Course)
                .WithMany(c => c.Reviews)
                .HasForeignKey(r => r.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CourseReview>()
                .HasOne(r => r.Student)
                .WithMany()
                .HasForeignKey(r => r.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Course approval relationships
            builder.Entity<Course>()
                .HasOne(c => c.Approver)
                .WithMany()
                .HasForeignKey(c => c.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Course>()
                .HasOne(c => c.Rejector)
                .WithMany()
                .HasForeignKey(c => c.RejectedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure indexes for better performance
            builder.Entity<Course>()
                .HasIndex(c => c.InstructorId);

            builder.Entity<Course>()
                .HasIndex(c => c.Category);

            builder.Entity<Course>()
                .HasIndex(c => c.IsPublished);

            builder.Entity<Enrollment>()
                .HasIndex(e => new { e.CourseId, e.StudentId })
                .IsUnique();

            builder.Entity<Enrollment>()
                .HasIndex(e => e.StudentId);

            builder.Entity<ModuleProgress>()
                .HasIndex(p => new { p.ModuleId, p.EnrollmentId })
                .IsUnique();

            builder.Entity<ContentProgress>()
                .HasIndex(p => new { p.ContentId, p.EnrollmentId })
                .IsUnique();

            // Configure decimal precision for Score property
            builder.Entity<ContentProgress>()
                .Property(p => p.Score)
                .HasPrecision(5, 2); // 5 total digits, 2 decimal places
        }
    }
}