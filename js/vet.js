// js/vet.js

// Global variables
let map;
let markers = [];
const apiKey = 'AIzaSyClaGtt3VGdSrvJf2Gye88y2EJYWWz_lxk';

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.3851, lng: 2.1734 }, // Barcelona coordinates
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Add event listeners for filters
    document.getElementById('category').addEventListener('change', loadClinics);
    document.getElementById('district').addEventListener('change', loadClinics);

    // Initial load of clinics
    loadClinics();
}

// Load clinics using Places Service instead of direct API call
async function loadClinics() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const category = document.getElementById('category').value;
    const district = document.getElementById('district').value;
    const query = `${category} in ${district} Barcelona`;

    const service = new google.maps.places.PlacesService(map);
    
    service.textSearch({
        query: query,
        location: new google.maps.LatLng(41.3851, 2.1734),
        radius: 5000
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Clear existing clinic list
            const clinicList = document.getElementById('clinic-list');
            clinicList.innerHTML = '';

            // Filter and display results
            results.forEach(place => {
                if (place.rating >= 4.0) {
                    // Create marker
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                        icon: getMarkerIcon(category)
                    });
                    markers.push(marker);

                    // Add info window
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="p-2">
                                <h3 class="font-bold">${place.name}</h3>
                                <p>Rating: ${place.rating} ⭐</p>
                                <p>${place.formatted_address}</p>
                            </div>
                        `
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });

                    // Add to list
                    const clinicItem = document.createElement('div');
                    clinicItem.className = 'p-4 border-b hover:bg-gray-50 cursor-pointer';
                    clinicItem.innerHTML = `
                        <h3 class="font-bold">${place.name}</h3>
                        <p class="text-sm text-gray-600">Rating: ${place.rating} ⭐</p>
                        <p class="text-sm text-gray-600">${place.formatted_address}</p>
                    `;

                    clinicItem.addEventListener('click', () => {
                        map.panTo(place.geometry.location);
                        map.setZoom(15);
                        infoWindow.open(map, marker);
                    });

                    clinicList.appendChild(clinicItem);
                }
            });
        }
    });
}

// Get marker icon based on category
function getMarkerIcon(category) {
    const colors = {
        emergency_vet: '#FF0000',    // Red
        regular_vet: '#0000FF',      // Blue
        pet_grooming: '#FFD700'      // Yellow
    };
    
    // SVG path for a dog paw
    const pawPath = 'M 12,2 C 8.7,2 6,4.7 6,8 C 6,11.3 8.7,14 12,14 C 15.3,14 18,11.3 18,8 C 18,4.7 15.3,2 12,2 z M 8,8 C 9.1,8 10,8.9 10,10 C 10,11.1 9.1,12 8,12 C 6.9,12 6,11.1 6,10 C 6,8.9 6.9,8 8,8 z M 16,8 C 17.1,8 18,8.9 18,10 C 18,11.1 17.1,12 16,12 C 14.9,12 14,11.1 14,10 C 14,8.9 14.9,8 16,8 z M 12,11 C 13.1,11 14,11.9 14,13 C 14,14.1 13.1,15 12,15 C 10.9,15 10,14.1 10,13 C 10,11.9 10.9,11 12,11 z';

    return {
        path: pawPath,
        fillColor: colors[category] || colors.regular_vet,
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#FFFFFF',
        scale: 1.5,
        anchor: new google.maps.Point(12, 12) // Center the icon
    };
}

// Find nearest location
function findNearest() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (markers.length > 0) {
                let nearest = markers[0];
                let nearestDistance = getDistance(userLocation, nearest.getPosition());

                markers.forEach(marker => {
                    const distance = getDistance(userLocation, marker.getPosition());
                    if (distance < nearestDistance) {
                        nearest = marker;
                        nearestDistance = distance;
                    }
                });

                map.panTo(nearest.getPosition());
                map.setZoom(15);
            }
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Calculate distance between points
function getDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const lat1 = coord1.lat * Math.PI / 180;
    const lat2 = coord2.lat() * Math.PI / 180;
    const lon1 = coord1.lng * Math.PI / 180;
    const lon2 = coord2.lng() * Math.PI / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Load Google Maps API
window.onload = function() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
};
