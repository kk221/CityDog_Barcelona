let map;
let markers = [];
let kmlLayer;

function initDogParksMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('dogParksMap'), {
        center: { lat: 41.3851, lng: 2.1734 }, // Barcelona center
        zoom: 13,
        styles: [
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#e5f5e0' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#447530' }]
            }
        ]
    });

    // Load KML data
    loadKmlLayer();

    // Initialize filters
    initializeFilters();

    // Initialize search
    initializeSearch();
}

function loadKmlLayer() {
    if (kmlLayer) {
        kmlLayer.setMap(null);
    }

    kmlLayer = new google.maps.KmlLayer({
        url: 'https://raw.githubusercontent.com/kk221/CityDog_Barcelona/main/maps/barcelona-dog-parks.kml',
        suppressInfoWindows: false,
        preserveViewport: false,
        map: map
    });

    kmlLayer.addListener('click', handleMarkerClick);
}

function initializeFilters() {
    const viewType = document.getElementById('view-type');
    const filterType = document.getElementById('filter-type');

    viewType.addEventListener('change', () => {
        updateMapView(viewType.value);
    });

    filterType.addEventListener('change', () => {
        filterMarkers(filterType.value);
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('park-search');
    const searchBox = new google.maps.places.SearchBox(searchInput);

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (place.geometry && place.geometry.location) {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function handleMarkerClick(event) {
    const content = event.featureData.infoWindowHtml;
    const enhancedContent = enhanceInfoWindow(content);
    
    const infoWindow = new google.maps.InfoWindow({
        content: enhancedContent,
        maxWidth: 300
    });
    
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

// Add more helper functions as needed
