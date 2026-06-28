# Learning Management System

A collaborative learning-management platform built with ASP.NET Core MVC and SQL Server. The application supports role-based workflows for students, instructors, companies, and administrators.

## What it includes

- ASP.NET Core Identity authentication and role-based authorization
- Student enrollment, course discovery, progress, and dashboard workflows
- Instructor course creation, content management, and analytics
- Administrator course approval, user management, and audit workflows
- Profiles, account security, quizzes, leaderboards, and career-simulation pages
- Entity Framework Core with SQL Server migrations
- Responsive Razor views with JavaScript-enhanced interactions

## Technology

- .NET 8 and ASP.NET Core MVC
- Entity Framework Core 8
- ASP.NET Core Identity
- SQL Server
- Razor, HTML, CSS, and JavaScript

## Run locally

Requirements:

- .NET 8 SDK
- SQL Server or SQL Server Express

1. Clone the repository.
2. Set `ConnectionStrings:DefaultConnection` in `MVC Arch/appsettings.json` for your SQL Server instance.
3. Restore packages and run the application:

```powershell
dotnet restore "MVC Arch/MCV_Capstone.csproj"
dotnet run --project "MVC Arch/MCV_Capstone.csproj"
```

The application applies its Entity Framework migrations at startup and creates the Student, Instructor, Company, and Admin roles when they do not exist.

## Project context

This was developed as a team capstone during MVC architecture and web-development training. Repository history includes collaborative contributions.

## Repository note

Generated `bin`, `obj`, and Visual Studio files should not be committed. Sample or real resumes should also stay outside the repository.
