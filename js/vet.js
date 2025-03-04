// js/vet.js

// Global variables for map functionality
let map;
let markers = [];
const apiKey = 'AIzaSyBxMdRQfb3TXbXm95nOPTDX7hSts-ce8ms';

// Document ready handler
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    loadScript(); // Load Google Maps script
});

// Mobile menu functionality
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

// Map initialization
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.3851, lng: 2.1734 }, // Barcelona coordinates
        zoom: 12,
    });

    loadClinics();
}

// Fetch clinics from Google Places API
async function loadClinics() {
    const category = document.getElementById('category').value;
    const district = document.getElementById('district').value;
    const query = `${category} in ${district}, Barcelona`;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        // Filter results by rating and review count
        const filteredResults = data.results.filter(place => 
            place.rating >= 4.5 && place.user_ratings_total >= 1000
        );

        // Clear existing clinic list
        const clinicList = document.getElementById('clinic-list');
        clinicList.innerHTML = '';

        // Display filtered results on the map
        filteredResults.forEach(place => {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
            });
            markers.push(marker);

            // Add clinic to the list
            const clinicItem = document.createElement('div');
            clinicItem.className = 'clinic-item';
            clinicItem.innerHTML = `
                <h3>${place.name}</h3>
                <p>Rating: ${place.rating} (${place.user_ratings_total} reviews)</p>
                <p>Address: ${place.formatted_address}</p>
            `;
            clinicList.appendChild(clinicItem);
        });
    } catch (error) {
        console.error('Error loading clinics:', error);
    }
}

// Find nearest clinics
function findNearest() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Sort clinics by distance
            markers.sort((a, b) => {
                const distanceA = getDistance(userLocation, a.getPosition());
                const distanceB = getDistance(userLocation, b.getPosition());
                return distanceA - distanceB;
            });

            if (markers.length > 0) {
                // Pan to the nearest clinic
                map.panTo(markers[0].getPosition());
                map.setZoom(14);
            }
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Calculate distance between two coordinates (Haversine formula)
function getDistance(coord1, coord2) {
    const R = 6371; // Earth radius in km
    const dLat = (coord2.lat() - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng() - coord1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * (Math.PI / 180)) *
        Math.cos(coord2.lat() * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Load Google Maps API
function loadScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
}
