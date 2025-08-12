-- Update existing courses to be approved by default
-- This ensures they show up in the "Our Courses" view

UPDATE [Courses] 
SET [IsApproved] = 1,
    [ApprovedAt] = GETUTCDATE(),
    [ApprovedBy] = (SELECT TOP 1 [Id] FROM [AspNetUsers] WHERE [UserName] = 'admin@example.com')
WHERE [IsApproved] = 0;

-- If no admin user exists, just set IsApproved to true
UPDATE [Courses] 
SET [IsApproved] = 1
WHERE [IsApproved] = 0;
