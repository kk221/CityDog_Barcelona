// venues.js

let map;
let markers = [];
const apiKey = 'AIzaSyClaGtt3VGdSrvJf2Gye88y2EJYWWz_lxk';


// Curated venues list (restaurants and cafes only)
const curatedVenues = {
    'Restaurants': [
        {
            name: "Brunch & Cake",
            location: { lat: 41.3935, lng: 2.1892 },
            address: "Carrer d'Enric Granados, 19",
            district: "Eixample",
            rating: 4.5,
            description: "Popular brunch spot with a beautiful terrace. Dogs are welcome in the outdoor area.",
            website: "https://brunchandcake.com",
            phone: "+34 932 00 08 00",
            isCurated: true,
            hasOutdoorSeating: true
        },
        // Add more curated restaurants...
    ],
    'Cafes': [
        {
            name: "Satan's Coffee Corner",
            location: { lat: 41.3837, lng: 2.1699 },
            address: "Carrer de l'Arc de Sant Ramon del Call, 11",
            district: "Ciutat Vella",
            rating: 4.4,
            description: "Cozy cafe with excellent coffee and a dog-friendly terrace.",
            website: "https://satanscoffee.com",
            phone: "+34 666 22 32 73",
            isCurated: true,
            hasOutdoorSeating: true
        },
        // Add more curated cafes...
    ]
};

// Curated hotels list (for separate section)
const curatedHotels = [
    {
        name: "Hotel 1898",
        address: "La Rambla, 109",
        district: "Ciutat Vella",
        rating: 4.6,
        priceRange: "€€€€",
        petPolicy: {
            allowedSize: "Up to 20kg",
            fee: "€30/night",
            amenities: ["Pet bed", "Water bowl", "Welcome treat"]
        },
        description: "Luxury hotel in the heart of Las Ramblas, pet-friendly with special amenities.",
        image: "https://raw.githubusercontent.com/kk221/CityDog_Barcelona/main/images/hotels/hotel-1898.jpg",
        bookingUrl: "https://www.booking.com/hotel/es/1898.html?pets_accepted=1"
    },
    // Add more curated hotels...
];

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.3851, lng: 2.1734 },
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Add event listeners
    document.getElementById('category').addEventListener('change', loadVenues);
    document.getElementById('district').addEventListener('change', loadVenues);
    document.getElementById('terrace-filter')?.addEventListener('change', loadVenues);

    // Initial load of venues
    loadVenues();
    
    // Load hotels section separately
    displayHotels();
}

// Load restaurants and cafes
async function loadVenues() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const category = document.getElementById('category').value;
    const district = document.getElementById('district').value;
    const showOnlyTerrace = document.getElementById('terrace-filter')?.checked || false;

    const venueList = document.getElementById('venue-list');
    venueList.innerHTML = '<div class="p-4">Loading venues...</div>';

    // First, add curated venues
    if (curatedVenues[category]) {
        curatedVenues[category].forEach(venue => {
            if ((!district || venue.district === district) && 
                (!showOnlyTerrace || venue.hasOutdoorSeating)) {
                addVenueMarker(venue);
            }
        });
    }

    // Then, fetch from Google Places API
    const service = new google.maps.places.PlacesService(map);
    const query = `${category.toLowerCase()} Barcelona outdoor seating`;

    try {
        const results = await new Promise((resolve, reject) => {
            service.textSearch({
                query: query,
                location: new google.maps.LatLng(41.3851, 2.1734),
                radius: 5000
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        });

        // Process Google Places results
        for (const place of results) {
            if (place.rating < 4.0) continue;

            // Skip if it's already in curated list
            if (curatedVenues[category]?.some(v => v.name === place.name)) continue;

            try {
                const details = await getPlaceDetails(service, place.place_id);
                
                const hasOutdoorSeating = details.amenities?.includes('outdoor_seating') || 
                                        details.types?.includes('outdoor_seating');
                
                if (showOnlyTerrace && !hasOutdoorSeating) continue;
                
                const isInDistrict = district ? isPlaceInDistrict(details, district) : true;
                if (!isInDistrict) continue;

                addVenueMarker({...place, ...details, hasOutdoorSeating, isCurated: false});
            } catch (error) {
                console.error('Error getting place details:', error);
            }
        }

    } catch (error) {
        console.error('Error loading venues:', error);
        venueList.innerHTML = `
            <div class="p-4 text-red-600">
                Error loading venues. Please try again later.
            </div>
        `;
    }
}

// Modified marker icon function
function getMarkerIcon(category, isCurated) {
    const icons = {
        Restaurants: {
            path: 'M3.5,0l-1,5.5c-0.1464,0.805,1.7815,1.181,1.75,2L4,14c-0.0384,0.9993,1,1,1,1s1.0384-0.0007,1-1L5.75,7.5c-0.0314-0.8176,1.7334-1.1808,1.75-2L6.5,0H6l0.25,4L5.5,4.5L5.25,0h-0.5L4.5,4.5L3.75,4L4,0H3.5z M12,0c-0.7364,0-1.9642,0.6549-2.4551,1.6367C9.1358,2.3731,9,4.0182,9,5v2.5c0,0.8182,1.0909,1,1.5,1L10,14c-0.0905,0.9959,1,1,1,1s1,0,1-1V0z',
            fillColor: isCurated ? '#FFD700' : '#FF0000', // Gold for curated, Red for regular
            strokeColor: '#FFFFFF',
            strokeWeight: 1,
            fillOpacity: 1,
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        Cafes: {
            path: 'M12,5h-2V3H2v4c0.0133,2.2091,1.8149,3.9891,4.024,3.9758C7.4345,10.9673,8.7362,10.2166,9.45,9H12c1.1046,0,2-0.8954,2-2S13.1046,5,12,5z M12,8H9.86C9.9487,7.6739,9.9958,7.3379,10,7V6h2c0.5523,0,1,0.4477,1,1S12.5523,8,12,8z M10,12.5c0,0.2761-0.2239,0.5-0.5,0.5h-7C2.2239,13,2,12.7761,2,12.5S2.2239,12,2.5,12h7C9.7761,12,10,12.2239,10,12.5z',
            fillColor: isCurated ? '#FFD700' : '#0000FF', // Gold for curated, Blue for regular
            strokeColor: '#FFFFFF',
            strokeWeight: 1,
            fillOpacity: 1,
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        }
    };

    return icons[category] || icons.Restaurants; // Default to restaurant icon if category not found
}

// Display curated hotels section
function displayHotels() {
    const hotelList = document.getElementById('hotel-list');
    if (!hotelList) return;

    hotelList.innerHTML = curatedHotels.map(hotel => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-bold text-xl">${hotel.name}</h3>
                    <span class="text-gray-600">${hotel.priceRange}</span>
                </div>
                
                <p class="text-gray-600 mb-4">${hotel.description}</p>

                <div class="bg-purple-50 p-4 rounded-lg mb-4">
                    <h4 class="font-semibold mb-2">Pet Policy</h4>
                    <p class="text-sm">🐾 ${hotel.petPolicy.allowedSize}</p>
                    <p class="text-sm">💶 ${hotel.petPolicy.fee}</p>
                    <p class="text-sm">🎁 Amenities: ${hotel.petPolicy.amenities.join(', ')}</p>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        <p>📍 ${hotel.address}</p>
                        <p>⭐ ${hotel.rating}</p>
                    </div>
                    <a href="${hotel.bookingUrl}" 
                       target="_blank"
                       class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Book Now
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Helper function to get place details
function getPlaceDetails(service, placeId) {
    return new Promise((resolve, reject) => {
        service.getDetails({
            placeId: placeId,
            fields: [
                'address_components',
                'formatted_address',
                'opening_hours',
                'website',
                'formatted_phone_number',
                'photos'
            ]
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else {
                reject(status);
            }
        });
    });
}

// Helper function to check if place is in district
function isPlaceInDistrict(place, district) {
    // Barcelona districts mapping (add more as needed)
    const districtMappings = {
        'Ciutat Vella': ['Ciutat Vella', 'El Raval', 'El Gòtic', 'La Barceloneta'],
        'Eixample': ['Eixample', "L'Eixample", 'Sant Antoni', 'Dreta de l\'Eixample'],
        'Sants-Montjuïc': ['Sants', 'Montjuïc', 'Sants-Montjuïc'],
        'Les Corts': ['Les Corts'],
        'Sarrià-Sant Gervasi': ['Sarrià', 'Sant Gervasi', 'Sarrià-Sant Gervasi'],
        'Gràcia': ['Gràcia', 'Vila de Gràcia'],
        'Horta-Guinardó': ['Horta', 'Guinardó', 'Horta-Guinardó'],
        'Nou Barris': ['Nou Barris'],
        'Sant Andreu': ['Sant Andreu'],
        'Sant Martí': ['Sant Martí', 'Poblenou']
    };

    // Get the district variations to check
    const districtVariations = districtMappings[district] || [district];

    // Check address components
    return place.address_components.some(component => {
        const longName = component.long_name.toLowerCase();
        return districtVariations.some(d => 
            longName.includes(d.toLowerCase())
        );
    });
}

// Modify addToVenueList function to show curated status
function addToVenueList(venueList, place, marker, infoWindow) {
    const venueItem = document.createElement('div');
    venueItem.className = 'p-4 border-b hover:bg-gray-50 cursor-pointer';
    venueItem.innerHTML = `
        <div class="flex justify-between items-start">
            <h3 class="font-bold">${place.name}</h3>
            ${place.isCurated ? '<span class="text-yellow-500">✨</span>' : ''}
        </div>
        <p class="text-sm text-gray-600">Rating: ${place.rating} ⭐</p>
        <p class="text-sm text-gray-600">${place.isCurated ? place.address : place.formatted_address}</p>
        ${place.hasOutdoorSeating ? '<p class="text-sm text-green-600">☀️ Outdoor Seating</p>' : ''}
    `;

    venueItem.addEventListener('click', () => {
        map.panTo(place.isCurated ? 
            new google.maps.LatLng(place.location.lat, place.location.lng) : 
            place.geometry.location
        );
        map.setZoom(15);
        infoWindow.open(map, marker);
    });

    venueList.appendChild(venueItem);
}

// Modify addVenueMarker function to handle both curated and regular venues
function addVenueMarker(place) {
    const position = place.isCurated ? 
        new google.maps.LatLng(place.location.lat, place.location.lng) : 
        place.geometry.location;

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: place.name,
        icon: getMarkerIcon(place.category || document.getElementById('category').value, place.isCurated)
    });
    markers.push(marker);

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-4">
                <h3 class="font-bold text-lg">${place.name}</h3>
                ${place.isCurated ? '<p class="text-sm text-yellow-600">✨ Recommended</p>' : ''}
                <p class="text-sm">Rating: ${place.rating} ⭐</p>
                <p class="text-sm">${place.isCurated ? place.address : place.formatted_address}</p>
                ${place.hasOutdoorSeating ? '<p class="text-sm text-green-600">☀️ Outdoor Seating</p>' : ''}
                ${place.phone || place.formatted_phone_number ? 
                    `<p class="text-sm">📞 ${place.phone || place.formatted_phone_number}</p>` : ''}
                ${place.website ? 
                    `<a href="${place.website}" target="_blank" 
                        class="text-blue-600 hover:text-blue-800 text-sm">Visit Website</a>` : ''}
                ${place.description ? `<p class="text-sm mt-2">${place.description}</p>` : ''}
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    addToVenueList(document.getElementById('venue-list'), place, marker, infoWindow);
}


// Load Google Maps API
window.onload = function() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
};
