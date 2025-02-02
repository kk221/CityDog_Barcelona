// Search functionality - Commented out for now
/*

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const breedCards = document.querySelectorAll('.breed-card');
    
    // List of PPP breed names (excluding "terrier")
    const pppBreeds = [
        'pit bull',
        'staffordshire',
        'rottweiler',
        'dogo argentino',
        'fila brasileiro',
        'tosa inu',
        'akita inu'
    ];

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        let foundMatch = false;

        // Hide all cards initially
        breedCards.forEach(card => {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.95)';
        });

        if (searchTerm.length > 2) { // Start searching after 3 characters
            pppBreeds.forEach((breed, index) => {
                if (breed.includes(searchTerm)) {
                    foundMatch = true;
                    // Show and highlight matching card
                    breedCards[index].style.opacity = '1';
                    breedCards[index].style.transform = 'scale(1.05)';
                    breedCards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            if (!foundMatch) {
                // Show "not found" popup with GIF
                showNotFoundPopup();
            }
        } else {
            // Show all cards if search term is too short
            breedCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            });
            hideNotFoundPopup();
        }
    });
});

// Add popup HTML to your page
const popupHTML = `
<div id="notFoundPopup" class="fixed inset-0 flex items-center justify-center hidden z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <img src="https://raw.githubusercontent.com/kk221/CityDog_Barcelona/main/images/ppp/not-found.gif" 
             alt="Dog not found"
             class="w-full h-48 object-cover rounded mb-4">
        <p class="text-center text-gray-700">This breed is not classified as PPP in Barcelona.</p>
        <button class="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                onclick="hideNotFoundPopup()">
            Close
        </button>
    </div>
</div>
`;

// Add this to your HTML just before </body>
document.body.insertAdjacentHTML('beforeend', popupHTML);

function showNotFoundPopup() {
    document.getElementById('notFoundPopup').classList.remove('hidden');
}

function hideNotFoundPopup() {
    document.getElementById('notFoundPopup').classList.add('hidden');
}
*/

document.addEventListener('DOMContentLoaded', function() {
    // tab switch
    const tabContainer = document.querySelector('.tab-container');
    if (!tabContainer) return;

    // event 
    tabContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('[role="tab"]');
        if (!btn || btn.getAttribute('aria-selected') === 'true') return;

        const targetTab = btn.dataset.tab;
        if (!targetTab) return;

        // switch button status
        document.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // switch content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== targetTab);
        });

        // scoll
        setTimeout(() => {
            const targetElement = document.getElementById(targetTab);
            targetElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 50);
    });

    // default to 1st tab
    const defaultTab = tabContainer.querySelector('[role="tab"][aria-selected="true"]');
    if (!defaultTab) {
        const firstTab = tabContainer.querySelector('[role="tab"]');
        if (firstTab) {
            firstTab.setAttribute('aria-selected', 'true');
            document.getElementById(firstTab.dataset.tab)?.classList.remove('hidden');
        }
    }
});

// calculator
function initCalculator() {
    const insuranceSelect = document.getElementById('insurance-select');
    const totalCost = document.querySelector('.total-cost');

    if (!insuranceSelect || !totalCost) return;

    const updatePrice = () => {
        const prices = {
            basic: { 
                price: 120,
                coverage: '€120 (Third Party Liability)',
                details: 'Covers basic legal requirements'
            },
            extended: {
                price: 180,
                coverage: '€180 (Full Coverage)',
                details: 'Includes veterinary expenses and theft protection'
            }
        };
        
        const selected = prices[insuranceSelect.value];
        totalCost.innerHTML = `
            <div class="price-display">
                <span class="text-lg font-semibold">${selected.coverage}</span>
                <div class="text-sm text-gray-500 mt-1">${selected.details}</div>
                <div class="mt-2 text-purple-600 font-bold">Total: €${selected.price}/year</div>
            </div>
        `;
    };

    insuranceSelect.addEventListener('change', updatePrice);
    updatePrice(); // default
}

document.addEventListener('DOMContentLoaded', initCalculator);


// Checklist Functionality
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercent = document.querySelector('.progress-percent');

    function updateProgress() {
        const checked = document.querySelectorAll('.checklist-item input:checked').length;
        const total = checkboxes.length;
        const percent = Math.round((checked / total) * 100);
        
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = percent;
        
        // Save state
        checkboxes.forEach((checkbox, index) => {
            localStorage.setItem(`pppChecklist-${index}`, checkbox.checked);
        });
    }

    // Load saved state
    checkboxes.forEach((checkbox, index) => {
        const isChecked = localStorage.getItem(`pppChecklist-${index}`) === 'true';
        checkbox.checked = isChecked;
        if(isChecked) checkbox.parentElement.classList.add('opacity-70');
    });

    // Update on change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            checkbox.parentElement.classList.toggle('opacity-70', checkbox.checked);
            updateProgress();
        });
    });

    // Initial update
    updateProgress();
});
