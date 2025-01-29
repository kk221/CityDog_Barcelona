// Add this to your interactive.js file

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
