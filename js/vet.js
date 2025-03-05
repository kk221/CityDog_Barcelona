
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
    const query = `${category} Barcelona`;

    const service = new google.maps.places.PlacesService(map);
    
    service.textSearch({
        query: query,
        location: new google.maps.LatLng(41.3851, 2.1734),
        radius: 5000
    }, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const clinicList = document.getElementById('clinic-list');
            clinicList.innerHTML = '';

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
                        addToClinicList(clinicList, place, marker, infoWindow);
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

// Helper function to add clinic to list
function addToClinicList(clinicList, place, marker, infoWindow) {
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

// Get marker icon based on category
function getMarkerIcon(category) {
    const icons = {
        emergency_vet: {
            path: 'M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-3H4V8h3V5h2v3h3v2h-3v3z',
            fillColor: '#FF0000',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        regular_vet: {
               path: 'M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-3H4V8h3V5h2v3h3v2h-3v3z',
            fillColor: '#0000FF',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        pet_grooming: {
            // Dog Paw SVG path
            path: 'M4.086 7.9a1.91 1.91 0 0 1-.763 2.52c-.81.285-1.782-.384-2.17-1.492a1.91 1.91 0 0 1 .762-2.521c.81-.285 1.782.384 2.171 1.492zm6.521 7.878a2.683 2.683 0 0 1-1.903-.788.996.996 0 0 0-1.408 0 2.692 2.692 0 0 1-3.807-3.807 6.377 6.377 0 0 1 9.022 0 2.692 2.692 0 0 1-1.904 4.595zM7.73 6.057c.127 1.337-.563 2.496-1.54 2.588-.977.092-1.872-.917-1.998-2.254-.127-1.336.563-2.495 1.54-2.587.977-.093 1.871.916 1.998 2.253zm.54 0c-.127 1.337.563 2.496 1.54 2.588.977.092 1.871-.917 1.998-2.254.127-1.336-.563-2.495-1.54-2.587-.977-.093-1.872.916-1.998 2.253zm3.644 1.842a1.91 1.91 0 0 0 .763 2.522c.81.284 1.782-.385 2.17-1.493a1.91 1.91 0 0 0-.762-2.521c-.81-.285-1.782.384-2.171 1.492z',
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
