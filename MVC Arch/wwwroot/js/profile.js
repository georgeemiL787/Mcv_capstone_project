// Profile page scrolling and layout management
document.addEventListener('DOMContentLoaded', () => {
  // Add class to body to prevent scrolling
  document.body.classList.add('profile-page-active');
  document.documentElement.classList.add('profile-page-active');
  
  // Ensure only the profile-content scrolls
  const profileContent = document.querySelector('.profile-content');
  const profileLayout = document.querySelector('.profile-layout');
  
  if (profileContent && profileLayout) {
    // Remove any existing scrollbars from other elements
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Ensure profile-content is the only scrollable element
    profileContent.style.overflowY = 'auto';
    profileContent.style.overflowX = 'hidden';
    
    // Prevent profile-layout from scrolling
    profileLayout.style.overflow = 'hidden';
    
    // Handle sidebar scrolling separately if needed
    const profileSidebar = document.querySelector('.profile-sidebar');
    if (profileSidebar) {
      profileSidebar.style.overflowY = 'auto';
      profileSidebar.style.overflowX = 'hidden';
    }
  }
  
  // Clean up when leaving the page
  window.addEventListener('beforeunload', () => {
    document.body.classList.remove('profile-page-active');
    document.documentElement.classList.remove('profile-page-active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });
});



