// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    setupMobileMenu();
    // Card functionality
    setupCards();
});

function setupCards() {
    const header = document.getElementById('vaccination-header');
    const content = document.getElementById('vaccination-content');
    
    if (header && content) {
        // Initially hide the content
        content.classList.add('hidden');
        
        header.addEventListener('click', function() {
            content.classList.toggle('hidden');
        });
    }
}

function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            isMenuOpen = !isMenuOpen;
            mobileMenu.classList.toggle('hidden');
            
            if (isMenuOpen) {
                mobileMenu.classList.add('slide-in');
            } else {
                mobileMenu.classList.remove('slide-in');
            }
        });

        document.addEventListener('click', function(e) {
            if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('slide-in');
                isMenuOpen = false;
            }
        });
    }
}
