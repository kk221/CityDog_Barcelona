 document.addEventListener('DOMContentLoaded', function() {
    // Search functionality with debounce
    const searchInput = document.querySelector('input[type="text"]');
    let searchTimeout;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.toLowerCase();
        
        searchTimeout = setTimeout(() => {
            const articles = document.querySelectorAll('.blog-card, .featured-article');
            
            articles.forEach(article => {
                const title = article.querySelector('h2, h3').textContent.toLowerCase();
                const content = article.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                } else {
                    article.style.opacity = '0.3';
                    article.style.transform = 'translateY(10px)';
                }
            });
        }, 300);
    });

    // Category navigation with smooth transitions
    const categoryButtons = document.querySelectorAll('.category-filter');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Filter articles based on category
            filterArticles(this.dataset.category);
        });
    });

    // Newsletter subscription with enhanced UI feedback
    const newsletterForm = document.querySelector('.newsletter-section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button');
            
            if (validateEmail(emailInput.value)) {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="animate-spin">↻</span> Subscribing...';
                
                // Simulate API call
                setTimeout(() => {
                    subscribeToNewsletter(emailInput.value);
                    emailInput.value = '';
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Subscribe Now';
                }, 1500);
            } else {
                showError('Please enter a valid email address', emailInput);
            }
        });
    }

    // Enhanced utility functions
    function filterArticles(category) {
        const articles = document.querySelectorAll('.blog-card, .featured-article');
        articles.forEach(article => {
            const articleCategory = article.dataset.category;
            
            if (category === 'all' || articleCategory === category) {
                article.style.display = 'block';
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, 50);
            } else {
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    article.style.display = 'none';
                }, 300);
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    }

    function subscribeToNewsletter(email) {
        showSuccess('Thank you for subscribing! Check your email for confirmation.');
    }

    // Enhanced error and success messages
    function showError(message, element) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-2 animate-fade-in';
        errorDiv.textContent = message;
        
        // Remove any existing error messages
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        element.parentNode.appendChild(errorDiv);
        element.classList.add('border-red-500');
        
        setTimeout(() => {
            errorDiv.remove();
            element.classList.remove('border-red-500');
        }, 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                ${message}
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }

    // Enhanced lazy loading with fade-in effect
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('animate-fade-in');
                    img.addEventListener('load', () => {
                        img.classList.remove('lazy');
                    });
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});
