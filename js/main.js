// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            // Toggle mobile menu visibility
            navLinks.classList.toggle('hidden');
            
            // Add slide animation class
            navLinks.classList.toggle('mobile-menu-active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-button')) {
            navLinks.classList.add('hidden');
            navLinks.classList.remove('mobile-menu-active');
        }
    });

    // Handle navigation links in mobile menu
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.add('hidden');
            navLinks.classList.remove('mobile-menu-active');
        });
    });
});
