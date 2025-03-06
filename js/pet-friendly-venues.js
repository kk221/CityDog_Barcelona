

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
    document.getElementById('category').addEventListener('change', loadVenues);
    document.getElementById('district').addEventListener('change', loadVenues);

    // Initial load of venues
    loadVenues();
}

// Load venues using Places Service instead of direct API call
async function loadVenues() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const category = document.getElementById('category').value;
    const district = document.getElementById('district').value;
    const query = `${category} Barcelona pet-friendly`;

    const service = new google.maps.places.PlacesService(map);
    
    service.textSearch({
        query: query,
        location: new google.maps.LatLng(41.3851, 2.1734),
        radius: 5000
    }, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const venueList = document.getElementById('venue-list');
            venueList.innerHTML = '';

            // Process each result
            for (const place of results) {
                // Skip places with low ratings
                if (place.rating < 4.0) continue;

                // Get detailed place information
                try {
                    const placeDetails = await getPlaceDetails(service, place.place_id);
                    
                    // Check if place is in selected district
                    const isInDistrict = district ? isPlaceInDistrict(placeDetails, district) : true;
                    
                    if (isInDistrict) {
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
                        addToVenueList(venueList, place, marker, infoWindow);
                    }
                } catch (error) {
                    console.error('Error getting place details:', error);
                }
            }
        }
    });
}

// Helper function to get place details
function getPlaceDetails(service, placeId) {
    return new Promise((resolve, reject) => {
        service.getDetails({
            placeId: placeId,
            fields: ['address_components', 'formatted_address']
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

// Helper function to add venue to list
function addToVenueList(venueList, place, marker, infoWindow) {
    const venueItem = document.createElement('div');
    venueItem.className = 'p-4 border-b hover:bg-gray-50 cursor-pointer';
    venueItem.innerHTML = `
        <h3 class="font-bold">${place.name}</h3>
        <p class="text-sm text-gray-600">Rating: ${place.rating} ⭐</p>
        <p class="text-sm text-gray-600">${place.formatted_address}</p>
    `;

    venueItem.addEventListener('click', () => {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        infoWindow.open(map, marker);
    });

    venueList.appendChild(venueItem);
}

// Get marker icon based on category
function getMarkerIcon(category) {
    const icons = {
        Restaurants: {
            path: 'M3.5,0l-1,5.5c-0.1464,0.805,1.7815,1.181,1.75,2L4,14c-0.0384,0.9993,1,1,1,1s1.0384-0.0007,1-1L5.75,7.5&#xA;&#x9;c-0.0314-0.8176,1.7334-1.1808,1.75-2L6.5,0H6l0.25,4L5.5,4.5L5.25,0h-0.5L4.5,4.5L3.75,4L4,0H3.5z M12,0&#xA;&#x9;c-0.7364,0-1.9642,0.6549-2.4551,1.6367C9.1358,2.3731,9,4.0182,9,5v2.5c0,0.8182,1.0909,1,1.5,1L10,14c-0.0905,0.9959,1,1,1,1&#xA;&#x9;s1,0,1-1V0z',
            fillColor: '#FF0000',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        Cafes: {
               path: 'M12,5h-2V3H2v4c0.0133,2.2091,1.8149,3.9891,4.024,3.9758C7.4345,10.9673,8.7362,10.2166,9.45,9H12c1.1046,0,2-0.8954,2-2&#xA;&#x9;S13.1046,5,12,5z M12,8H9.86C9.9487,7.6739,9.9958,7.3379,10,7V6h2c0.5523,0,1,0.4477,1,1S12.5523,8,12,8z M10,12.5&#xA;&#x9;c0,0.2761-0.2239,0.5-0.5,0.5h-7C2.2239,13,2,12.7761,2,12.5S2.2239,12,2.5,12h7C9.7761,12,10,12.2239,10,12.5z',
            fillColor: '#0000FF',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        Bars: {
            // Dog Paw SVG path
            path: 'M7.5,1c-2,0-7,0.25-6.5,0.75L7,8v4&#xA;&#x9;c0,1-3,0.5-3,2h7c0-1.5-3-1-3-2V8l6-6.25C14.5,1.25,9.5,1,7.5,1z M7.5,2c2.5,0,4.75,0.25,4.75,0.25L11.5,3h-8L2.75,2.25&#xA;&#x9;C2.75,2.25,5,2,7.5,2z',
            fillColor: '#FFD700',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        }
    };

    return {
        ...icons[category] || icons.regular_vet,
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#FFFFFF'
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
