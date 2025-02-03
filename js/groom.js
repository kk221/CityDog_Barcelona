// Add to groom.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Intersection Observer for lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                lazyLoadObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('.lazy-load').forEach(img => {
        lazyLoadObserver.observe(img);
    });

    // Category Filter
    const categoryFilters = document.querySelectorAll('.category-filter');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryFilters.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';
            
            // Update active state
            categoryFilters.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            blogCards.forEach((card, index) => {
                const cardCategory = card.dataset.category;
                const shouldShow = category === 'all' || cardCategory === category;
                
                card.style.setProperty('--index', index);
                card.classList.toggle('hidden', !shouldShow);
            });
        });
    });

    // Search Functionality with Debounce
    const searchInput = document.querySelector('#search-input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            
            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('p').textContent.toLowerCase();
                const matches = title.includes(query) || excerpt.includes(query);
                
                card.classList.toggle('hidden', !matches);
            });
        }, 300);
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('#newsletter-form');
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            // Replace with your API endpoint
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                showToast('🎉 Thanks for subscribing! Check your email.');
                newsletterForm.reset();
            }
        } catch (error) {
            showToast('⚠️ Something went wrong. Please try again.');
        }
    });

    // Toast Notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeInUp';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});

// Add to your CSS for toast animation:
@keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}

.animate-fadeInUp {
    animation: fadeInUp 0.3s ease-out;
}
