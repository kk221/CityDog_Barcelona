document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabContainer = document.querySelector('.tab-container');
    if (!tabContainer) return;

    // Improved tab event delegation with content organization
    tabContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;

        const targetTab = btn.dataset.tab;
        if (!targetTab) return;

        // Switch button states with better visual feedback
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active', 'bg-purple-600', 'text-white');
            b.classList.add('text-gray-600', 'hover:text-purple-600');
        });
        btn.classList.add('active', 'bg-purple-600', 'text-white');
        btn.classList.remove('text-gray-600', 'hover:text-purple-600');

        // Smooth content transition
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === targetTab) {
                content.classList.remove('hidden');
                content.classList.add('fade-in'); // Add animation class
            } else {
                content.classList.add('hidden');
                content.classList.remove('fade-in');
            }
        });

        // Smooth scroll with offset for fixed header
        const targetElement = document.getElementById(targetTab);
        if (targetElement) {
            const headerOffset = 100; // Adjust based on your header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });

    // Initialize first tab with animation
    const firstTab = tabContainer.querySelector('.tab-btn.active') || tabContainer.querySelector('.tab-btn');
    if (firstTab) {
        setTimeout(() => firstTab.click(), 100); // Slight delay for smoother initial load
    }
});

// Enhanced calculator with district-based pricing
document.addEventListener('DOMContentLoaded', function() {
    const insuranceSelect = document.getElementById('insurance-select');
    const districtSelect = document.getElementById('district-select'); // Add district select
    const totalCost = document.querySelector('.total-cost');

    if (insuranceSelect && totalCost) {
        const calculatePrice = () => {
            const basePrice = {
                basic: { price: 120, coverage: 'Third Party Liability' },
                extended: { price: 180, coverage: 'Full Coverage' }
            };

            const districtFees = {
                'Ciutat Vella': 20,
                'Eixample': 15,
                'Sants-Montjuïc': 10,
                // Add other districts as needed
            };

            const selected = basePrice[insuranceSelect.value];
            const districtFee = districtSelect ? districtFees[districtSelect.value] || 0 : 0;
            const totalPrice = selected.price + districtFee;

            totalCost.innerHTML = `
                <span class="text-lg">€${totalPrice} (${selected.coverage})</span>
                <div class="text-sm text-gray-500 mt-1">
                    Base fee: €${selected.price}
                    ${districtFee ? `<br>District fee: €${districtFee}` : ''}
                    <br>Includes mandatory insurance + certification fees
                </div>
            `;
        };

        insuranceSelect.addEventListener('change', calculatePrice);
        if (districtSelect) {
            districtSelect.addEventListener('change', calculatePrice);
        }

        // Initial calculation
        calculatePrice();
    }
});

// Add CSS for fade animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
