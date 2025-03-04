// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    setupMobileMenu();
    // Card functionality
    setupCards();
});

function setupCards() {
    const sections = [
        'health',
        'registration',
        'ppp',
        'parks',
        'behavior',
        'transport'
    ];
    
    sections.forEach(section => {
        const header = document.getElementById(`${section}-header`);
        const content = document.getElementById(`${section}-content`);
        
        if (header && content) {
            // Initially hide the content
            content.classList.add('hidden');
            
            header.addEventListener('click', function() {
                // Close other sections
                sections.forEach(otherSection => {
                    if (otherSection !== section) {
                        const otherContent = document.getElementById(`${otherSection}-content`);
                        if (otherContent) {
                            otherContent.classList.add('hidden');
                        }
                    }
                });
                
                // Toggle current section
                content.classList.toggle('hidden');
            });
        }
    });
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
