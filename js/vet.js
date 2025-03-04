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

// Load clinics using Places Service
async function loadClinics() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const category = document.getElementById('category').value;
    const district = document.getElementById('district').value;
    
    const service = new google.maps.places.PlacesService(map);
    
    service.textSearch({
        query: `${category} Barcelona`,
        location: new google.maps.LatLng(41.3851, 2.1734),
        radius: 5000
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const clinicList = document.getElementById('clinic-list');
            clinicList.innerHTML = '';

            results.forEach(place => {
                // Get detailed place information for district filtering
                service.getDetails({
                    placeId: place.place_id,
                    fields: ['name', 'rating', 'formatted_address', 'geometry', 'address_components']
                }, (placeDetails, detailStatus) => {
                    if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
                        // Check if place is in selected district
                        const placeDistrict = placeDetails.address_components.find(
                            component => component.long_name.includes(district)
                        );
                        
                        if ((!district || placeDistrict) && place.rating >= 4.0) {
                            const marker = new google.maps.marker.AdvancedMarkerElement({
                                map,
                                position: place.geometry.location,
                                title: place.name,
                                content: createMarkerContent(category, place.name)
                            });
                            markers.push(marker);

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

                            addToClinicList(clinicList, place, marker, infoWindow);
                        }
                    }
                });
            });
        }
    });
}

// Get marker icon configuration
function getMarkerIcon(category) {
    const icons = {
        emergency_vet: {
            path: 'M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-3H4V8h3V5h2v3h3v2h-3v3z',
            fillColor: '#FF0000',
            scale: 1.5
        },
        regular_vet: {
            path: 'M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-3H4V8h3V5h2v3h3v2h-3v3z',
            fillColor: '#0000FF',
            scale: 1.5
        },
        pet_grooming: {
            path: 'M4.086 7.9a1.91 1.91 0 0 1-.763 2.52c-.81.285-1.782-.384-2.17-1.492a1.91 1.91 0 0 1 .762-2.521c.81-.285 1.782.384 2.171 1.492zm6.521 7.878a2.683 2.683 0 0 1-1.903-.788.996.996 0 0 0-1.408 0 2.692 2.692 0 0 1-3.807-3.807 6.377 6.377 0 0 1 9.022 0 2.692 2.692 0 0 1-1.904 4.595zM7.73 6.057c.127 1.337-.563 2.496-1.54 2.588-.977.092-1.872-.917-1.998-2.254-.127-1.336.563-2.495 1.54-2.587.977-.093 1.871.916 1.998 2.253zm.54 0c-.127 1.337.563 2.496 1.54 2.588.977.092 1.871-.917 1.998-2.254.127-1.336-.563-2.495-1.54-2.587-.977-.093-1.872.916-1.998 2.253zm3.644 1.842a1.91 1.91 0 0 0 .763 2.522c.81.284 1.782-.385 2.17-1.493a1.91 1.91 0 0 0-.762-2.521c-.81-.285-1.782.384-2.171 1.492z',
            fillColor: '#FFD700',
            scale: 1.5
        }
    };

    return icons[category] || icons.regular_vet;
}

// Create marker content with SVG
function createMarkerContent(category, title) {
    const iconConfig = getMarkerIcon(category);
    
    const container = document.createElement('div');
    container.className = 'marker-content';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 16 16');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', iconConfig.path);
    path.setAttribute('fill', iconConfig.fillColor);
    path.setAttribute('stroke', '#FFFFFF');
    path.setAttribute('stroke-width', '1');
    
    svg.appendChild(path);
    container.appendChild(svg);
    container.setAttribute('title', title);
    
    return container;
}

// Add clinic to list
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
                let nearestDistance = getDistance(userLocation, nearest.position);

                markers.forEach(marker => {
                    const distance = getDistance(userLocation, marker.position);
                    if (distance < nearestDistance) {
                        nearest = marker;
                        nearestDistance = distance;
                    }
                });

                map.panTo(nearest.position);
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
    const lat2 = coord2.lat * Math.PI / 180;
    const lon1 = coord1.lng * Math.PI / 180;
    const lon2 = coord2.lng * Math.PI / 180;

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
