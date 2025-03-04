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
    const icons = {
        emergency_vet: {
            path: 'M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-3H4V8h3V5h2v3h3v2h-3v3z',
            fillColor: '#FF0000',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        regular_vet: {
            path: ' M508.849,94.437L417.564,3.15c-4.201-4.2-11.013-4.201-15.215,0c-4.201,4.201-4.201,11.013,0,15.215l19.017,19.017
				L383.33,75.418l-47.924-47.924c-4.202-4.201-11.012-4.201-15.215,0c-4.201,4.201-4.201,11.013,0,15.214l21.3,21.3
				L143.706,261.794c-2.017,2.017-3.151,4.754-3.151,7.607c0,2.853,1.134,5.59,3.151,7.607l22.821,22.821l-41.839,41.839
				c-4.201,4.201-4.201,11.013,0,15.215l7.607,7.607l-96.601,96.601c-4.201,4.201-4.201,11.013,0,15.214
				c2.101,2.101,4.854,3.151,7.607,3.151s5.507-1.051,7.607-3.151l96.6-96.601l7.607,7.607c2.101,2.101,4.854,3.151,7.607,3.151
				c2.753,0,5.507-1.05,7.607-3.151l41.839-41.839l22.822,22.821c2.1,2.101,4.854,3.151,7.607,3.151s5.507-1.05,7.607-3.151
				l197.786-197.786l21.3,21.3c2.101,2.101,4.854,3.151,7.607,3.151c2.753,0,5.506-1.051,7.607-3.151
				c4.201-4.201,4.201-11.013,0-15.214l-47.925-47.925l38.034-38.035l19.018,19.018c2.101,2.101,4.854,3.151,7.607,3.151
				c2.753,0,5.507-1.051,7.607-3.151C513.05,105.45,513.05,98.638,508.849,94.437z M162.724,364.489l-15.214-15.214l34.232-34.232
				l15.214,15.214L162.724,364.489z M413.759,174.311l-26.879-26.878c-4.202-4.201-11.012-4.201-15.215,0
				c-4.201,4.201-4.201,11.013,0,15.214l26.879,26.878l-19.017,19.017l-26.878-26.878c-4.202-4.201-11.012-4.201-15.215,0
				c-4.201,4.201-4.201,11.013,0,15.214l26.878,26.878l-19.017,19.018l-26.879-26.878c-4.202-4.201-11.012-4.201-15.215,0
				c-4.201,4.201-4.201,11.013,0,15.214l26.879,26.878l-19.017,19.017l-26.878-26.878c-4.202-4.201-11.012-4.201-15.215,0
				c-4.201,4.201-4.201,11.013,0,15.214l26.879,26.88l-19.017,19.017l-26.878-26.878c-4.201-4.201-11.013-4.201-15.215,0
				c-4.201,4.201-4.201,11.013,0,15.215l26.878,26.878l-19.017,19.017l-76.072-76.071L356.706,79.222l76.072,76.071L413.759,174.311
				z M421.367,113.454l-22.821-22.821l38.034-38.035l22.821,22.821L421.367,113.454z M4.227,492.558l-1.076,1.076c-4.201,4.201-4.201,11.013,0,15.215C5.253,510.95,8.006,512,10.759,512
				s5.507-1.05,7.607-3.151l1.076-1.076c4.201-4.201,4.201-11.013,0-15.215C15.24,488.357,8.428,488.357,4.227,492.558z',
            fillColor: '#0000FF',
            scale: 1.5,
            anchor: new google.maps.Point(8, 8)
        },
        pet_grooming: {
            // Brush SVG path
            path: 'M478.147,33.845C450.619,6.318,410.494-4.984,365.162,2.029c-44.032,6.809-87.948,30.226-123.66,65.938 c-53.187,53.188-78.281,124.995-63.929,182.936c3.284,13.257-1.533,27.721-12.273,36.848 c-34.23,29.089-74.018,53.718-118.258,73.2c-10.356,4.561-19.472,11.204-27.095,19.744 c-26.206,29.356-26.623,73.969-0.972,103.771c14.54,16.892,34.755,26.652,56.921,27.48c0.974,0.036,1.948,0.054,2.918,0.054 c20.838,0,41.036-8.325,55.809-23.098c6.795-6.794,12.228-14.647,16.146-23.343c20.006-44.399,44.785-84.329,73.649-118.68 c9.082-10.81,23.576-15.674,36.917-12.398c57.888,14.218,129.6-10.901,182.69-63.989c35.712-35.712,59.129-79.628,65.938-123.661 C516.973,101.499,505.674,61.374,478.147,33.845z M428.028,254.494c-47.614,47.614-110.922,70.388-161.297,58.017 c-21.645-5.316-45.05,2.462-59.632,19.815c-30.202,35.943-56.094,77.642-76.954,123.938c-2.789,6.191-6.665,11.789-11.517,16.64 c-11.026,11.026-26.293,17.013-41.886,16.434c-15.808-0.59-30.233-7.563-40.62-19.631c-18.277-21.235-17.975-53.025,0.702-73.948 c5.454-6.11,11.961-10.857,19.337-14.105c46.243-20.365,87.891-46.159,123.789-76.666c17.226-14.639,24.912-38.004,19.583-59.525 c-12.487-50.408,10.266-113.8,57.966-161.5c40.046-40.047,89.693-61.391,133.035-61.391c27.904,0,53.202,8.857,71.615,27.271 C509.165,96.858,493.859,188.664,428.028,254.494z',
            fillColor: '#FFD700',
            scale: 1.2,
            anchor: new google.maps.Point(8, 10)
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
