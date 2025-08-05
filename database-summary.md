# Database Summary

This document outlines the database schema for the Full Courses Platform, including all tables and their attributes.

## Database Tables Overview

### 1. **Users**
Stores user information and authentication details.

```sql
- id (Primary Key, Auto-increment)
- username (Unique)
- email (Unique)
- password_hash
- first_name
- last_name
- role (admin, instructor, student)
- profile_picture_url
- bio/description
- date_of_birth
- phone_number
- address
- created_at
- updated_at
- is_active
- email_verified
- last_login
```

### 2. **Roles** (Optional - for flexible role system)
Stores available roles and their permissions.

```sql
- id (Primary Key)
- name (admin, instructor, student, moderator)
- description
- permissions (JSON or separate permissions table)
- created_at
```

### 3. **Courses**
Stores course information and metadata.

```sql
- id (Primary Key)
- title
- description
- instructor_id (Foreign Key to Users)
- category_id (Foreign Key to Categories)
- price
- duration_hours
- difficulty_level (beginner, intermediate, advanced)
- language
- thumbnail_url
- video_url
- status (draft, published, archived)
- enrollment_count
- rating_average
- total_ratings
- created_at
- updated_at
- published_at
```

### 4. **Categories**
Stores course categories and subcategories.

```sql
- id (Primary Key)
- name
- description
- parent_category_id (for subcategories)
- created_at
```

### 5. **Enrollments**
Tracks user course enrollments and progress.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- course_id (Foreign Key to Courses)
- enrollment_date
- completion_date
- progress_percentage
- status (active, completed, dropped)
- certificate_issued
- certificate_url
- last_accessed
```

### 6. **Lessons/Modules**
Stores individual lessons within courses.

```sql
- id (Primary Key)
- course_id (Foreign Key to Courses)
- title
- description
- content (text or file URL)
- video_url
- duration_minutes
- order_number
- is_free_preview
- created_at
- updated_at
```

### 7. **Quizzes/Assessments**
Stores quiz information and settings.

```sql
- id (Primary Key)
- course_id (Foreign Key to Courses)
- lesson_id (Foreign Key to Lessons, optional)
- title
- description
- time_limit_minutes
- passing_score
- max_attempts
- is_required
- created_at
```

### 8. **Quiz Questions**
Stores individual quiz questions.

```sql
- id (Primary Key)
- quiz_id (Foreign Key to Quizzes)
- question_text
- question_type (multiple_choice, true_false, essay)
- points
- order_number
- created_at
```

### 9. **Quiz Options** (for multiple choice questions)
Stores answer options for multiple choice questions.

```sql
- id (Primary Key)
- question_id (Foreign Key to Quiz Questions)
- option_text
- is_correct
- order_number
```

### 10. **Quiz Results**
Tracks user quiz attempts and scores.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- quiz_id (Foreign Key to Quizzes)
- score
- max_score
- time_taken_minutes
- attempt_number
- submitted_at
- feedback
```

### 11. **Payments/Transactions**
Stores payment and transaction records.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- course_id (Foreign Key to Courses)
- amount
- currency
- payment_method
- transaction_id (from payment gateway)
- status (pending, completed, failed, refunded)
- payment_date
- refund_date
- created_at
```

### 12. **Discussions/Comments**
Stores course discussions and comments.

```sql
- id (Primary Key)
- course_id (Foreign Key to Courses)
- user_id (Foreign Key to Users)
- parent_comment_id (for replies)
- content
- is_approved
- created_at
- updated_at
```

### 13. **Notifications**
Stores user notifications and alerts.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- type (enrollment, quiz, payment, etc.)
- title
- message
- is_read
- created_at
- sent_at
```

### 14. **User Progress** (Optional)
Tracks detailed user progress through lessons.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- lesson_id (Foreign Key to Lessons)
- watched_duration_seconds
- is_completed
- last_watched
- created_at
```

### 15. **Course Ratings/Reviews**
Stores user ratings and reviews for courses.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- course_id (Foreign Key to Courses)
- rating (1-5 stars)
- review_text
- is_approved
- created_at
- updated_at
```

### 16. **Analytics/Activity Logs** (Optional)
Tracks user activity for analytics.

```sql
- id (Primary Key)
- user_id (Foreign Key to Users)
- action_type (login, course_view, quiz_attempt, etc.)
- resource_id (course_id, quiz_id, etc.)
- ip_address
- user_agent
- created_at
```

## Entity Relationships

### Core Relationships
- **User** ⟷ **Enrollment** ⟷ **Course**
- **Course** ⟷ **Lesson/Module**
- **Course** ⟷ **Quiz**
- **User** ⟷ **Quiz Result** ⟷ **Quiz**
- **User** ⟷ **Payment**
- **Course** ⟷ **Discussion/Comment** ⟷ **User**

### Key Foreign Keys
- `users.instructor_id` → `users.id` (for instructor courses)
- `enrollments.user_id` → `users.id`
- `enrollments.course_id` → `courses.id`
- `courses.instructor_id` → `users.id`
- `lessons.course_id` → `courses.id`
- `quizzes.course_id` → `courses.id`
- `quiz_questions.quiz_id` → `quizzes.id`
- `quiz_options.question_id` → `quiz_questions.id`
- `quiz_results.user_id` → `users.id`
- `quiz_results.quiz_id` → `quizzes.id`
- `payments.user_id` → `users.id`
- `payments.course_id` → `courses.id`

## Database Technology

- **Primary Database**: SQL Server or PostgreSQL (as specified in backend requirements)
- **ORM**: Entity Framework (for .NET) or similar
- **Migrations**: Database version control and schema updates

## Notes

- All tables include `created_at` timestamps for audit trails
- Most tables include `updated_at` for tracking modifications
- Foreign key relationships ensure data integrity
- Indexes should be added on frequently queried columns (user_id, course_id, etc.)
- Consider soft deletes for important data (add `deleted_at` column)
- Implement proper constraints and validation at the database level 