document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    let searchTimeout;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Implement search logic here
            console.log('Searching for:', e.target.value);
        }, 500);
    });

    // Category navigation
    const categoryButtons = document.querySelectorAll('nav button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter articles based on category
            filterArticles(this.textContent.toLowerCase());
        });
    });

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Validate email
            if (validateEmail(email)) {
                subscribeToNewsletter(email);
            } else {
                showError('Please enter a valid email address');
            }
        });
    }

    // Utility functions
    function filterArticles(category) {
        const articles = document.querySelectorAll('.blog-card');
        articles.forEach(article => {
            const articleCategory = article.dataset.category;
            if (category === 'all topics' || articleCategory === category) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function subscribeToNewsletter(email) {
        // Implement newsletter subscription logic here
        console.log('Subscribing email:', email);
        showSuccess('Thank you for subscribing!');
    }

    function showError(message) {
        // Implement error message display
        alert(message); // Replace with better UI feedback
    }

    function showSuccess(message) {
        // Implement success message display
        alert(message); // Replace with better UI feedback
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});
