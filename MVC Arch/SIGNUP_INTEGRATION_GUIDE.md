# Signup Integration Guide

## Overview
This document explains how the Signup functionality is implemented using the MVC architecture pattern, ensuring all components are properly synchronized.

## Component Synchronization

### 1. **SignupViewModel** ↔ **Signup.cshtml**
All form fields in the view are bound to properties in the ViewModel:

| View Field | ViewModel Property | Validation | Type |
|------------|-------------------|------------|------|
| `FirstName` | `FirstName` | Required, MaxLength(100) | string |
| `LastName` | `LastName` | Required, MaxLength(100) | string |
| `Email` | `Email` | Required, Email format | string |
| `RoleId` | `RoleId` | Required, Radio buttons (1,2,3) | int |
| `Password` | `Password` | Required, MinLength(8) | string |
| `ConfirmPassword` | `ConfirmPassword` | Required, Compare with Password | string |
| `AcceptTerms` | `AcceptTerms` | Required, Must be true | bool |

### 2. **SignupViewModel** ↔ **AccountController.Register()**
The controller receives the ViewModel and maps it to the User entity:

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Register(SignupViewModel model)
{
    // Model validation is automatic via ASP.NET Core
    if (!ModelState.IsValid)
    {
        return View("Signup", model);
    }

    var user = new User
    {
        FirstName = model.FirstName,        // Direct mapping
        LastName = model.LastName,          // Direct mapping
        Email = model.Email,                // Direct mapping
        UserName = model.Email,             // Email as username
        RegistrationDate = DateTime.UtcNow, // Auto-generated
        AccountStatus = "Active"            // Default value
    };

    // Create user and assign role
    var result = await userManager.CreateAsync(user, model.Password);
    if (result.Succeeded)
    {
        string roleName = GetRoleName(model.RoleId); // Role mapping
        await userManager.AddToRoleAsync(user, roleName);
        await signInManager.SignInAsync(user, isPersistent: false);
        return RedirectToAction("Index", "Home");
    }
}
```

### 3. **Role Mapping System**
The RoleId from the form is mapped to actual role names:

```csharp
private string GetRoleName(int roleId)
{
    return roleId switch
    {
        1 => "Student",     // Radio button value="1"
        2 => "Instructor",  // Radio button value="2"
        3 => "Company",     // Radio button value="3"
        _ => "Student"      // Default fallback
    };
}
```

### 4. **Form Submission Flow**

1. **User fills out form** → All fields are bound to ViewModel properties
2. **Form submission** → POST to `/Account/Register`
3. **Server-side validation** → ASP.NET Core validates ViewModel annotations
4. **Controller processing** → Creates User entity and saves to database
5. **Role assignment** → User is assigned appropriate role based on selection
6. **Auto-login** → User is automatically signed in
7. **Redirect** → User is redirected to Home page

## Database Integration

### User Entity Properties
The User entity inherits from `IdentityUser<int>` and includes:

- **Identity Properties**: Id, UserName, Email, PasswordHash (handled by ASP.NET Identity)
- **Custom Properties**: FirstName, LastName, Headline, Biography, Language, Location, AccountStatus, RegistrationDate, LastLogin, ProfilePhoto, Preferences

### Database Operations
1. **User Creation**: `userManager.CreateAsync(user, password)`
2. **Role Assignment**: `userManager.AddToRoleAsync(user, roleName)`
3. **Auto-login**: `signInManager.SignInAsync(user, isPersistent: false)`

## Security Features

### 1. **Anti-Forgery Token**
```html
@Html.AntiForgeryToken()
```
Prevents CSRF attacks by validating the token on form submission.

### 2. **Model Validation**
- Server-side validation using Data Annotations
- Client-side validation using jQuery validation
- Real-time field validation on blur events

### 3. **Password Security**
- Minimum 8 characters required
- Password confirmation validation
- Secure hashing via ASP.NET Identity

## Client-Side Enhancements

### 1. **Real-time Validation**
- Fields are validated as users type
- Visual feedback with CSS classes (`is-valid`, `is-invalid`)
- Prevents form submission with invalid data

### 2. **User Experience**
- Submit button is disabled during submission
- Loading state indication ("Creating Account...")
- Role selection visual feedback
- Social login button placeholders

### 3. **Form Handling**
```javascript
$('.signup-form').on('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
        return false;
    }
    
    // Disable submit button to prevent double submission
    $('#submitBtn').prop('disabled', true).text('Creating Account...');
});
```

## Error Handling

### 1. **Validation Errors**
- Displayed above the form
- Individual field validation messages
- ModelState validation summary

### 2. **Identity Errors**
- Password complexity requirements
- Email uniqueness validation
- Role assignment errors

### 3. **User Feedback**
- Clear error messages
- Field highlighting for invalid inputs
- Success redirect after registration

## Testing the Integration

### 1. **Valid Registration**
- Fill all required fields
- Select a role (Student/Instructor/Company)
- Accept terms and conditions
- Submit form
- Should redirect to Home page

### 2. **Validation Testing**
- Try submitting empty form
- Test email format validation
- Test password confirmation mismatch
- Test without accepting terms
- Test without selecting role

### 3. **Database Verification**
- Check Users table for new user
- Verify role assignment in AspNetUserRoles table
- Confirm RegistrationDate is set
- Verify AccountStatus is "Active"

## Troubleshooting

### Common Issues

1. **Role Assignment Fails**
   - Ensure roles exist in database
   - Check RoleManager is properly injected
   - Verify role names match exactly

2. **Validation Not Working**
   - Check _ValidationScriptsPartial is included
   - Verify jQuery is loaded
   - Check browser console for JavaScript errors

3. **Form Not Submitting**
   - Verify anti-forgery token
   - Check form action and method attributes
   - Ensure all required fields are filled

4. **Database Errors**
   - Check connection string
   - Verify Entity Framework migrations
   - Check User entity configuration

## Next Steps

1. **Implement Email Confirmation**
2. **Add Social Login (Google/Facebook)**
3. **Create Email Templates**
4. **Add User Profile Completion**
5. **Implement Email Verification**
6. **Add Two-Factor Authentication**
