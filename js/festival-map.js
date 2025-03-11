function initFestivalMap() {

// Map configuration and initialization
const mapConfig = {
    barcelona: { lat: 41.3851, lng: 2.1734 },
    zoom: 13,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

// Data for parks and gardens
const parks = [
    {
        name: "Parc del Laberint d'Horta",
        center: { lat: 41.4402, lng: 2.1476 },
        polygon: [
            { lat: 41.4395, lng: 2.1470 },
            { lat: 41.4408, lng: 2.1470 },
            { lat: 41.4408, lng: 2.1482 },
            { lat: 41.4395, lng: 2.1482 }
        ]
    },
    {
        name: "Jardins de Pedralbes",
        center: { lat: 41.3875, lng: 2.1151 },
        polygon: [
            { lat: 41.3870, lng: 2.1145 },
            { lat: 41.3880, lng: 2.1145 },
            { lat: 41.3880, lng: 2.1157 },
            { lat: 41.3870, lng: 2.1157 }
        ]
    },
    {
        name: "Parc de Cervantes",
        center: { lat: 41.3833, lng: 2.1060 },
        polygon: [
            { lat: 41.3828, lng: 2.1055 },
            { lat: 41.3838, lng: 2.1055 },
            { lat: 41.3838, lng: 2.1065 },
            { lat: 41.3828, lng: 2.1065 }
        ]
    }
];

// Data for quiet neighborhoods
const neighborhoods = [
    {
        name: "Sarrià",
        center: { lat: 41.3977, lng: 2.1230 },
        polygon: [
            { lat: 41.3970, lng: 2.1220 },
            { lat: 41.3985, lng: 2.1220 },
            { lat: 41.3985, lng: 2.1240 },
            { lat: 41.3970, lng: 2.1240 }
        ]
    },
    {
        name: "Pedralbes",
        center: { lat: 41.3897, lng: 2.1151 },
        polygon: [
            { lat: 41.3890, lng: 2.1145 },
            { lat: 41.3905, lng: 2.1145 },
            { lat: 41.3905, lng: 2.1157 },
            { lat: 41.3890, lng: 2.1157 }
        ]
    },
    {
        name: "Tres Torres",
        center: { lat: 41.3977, lng: 2.1320 },
        polygon: [
            { lat: 41.3970, lng: 2.1310 },
            { lat: 41.3985, lng: 2.1310 },
            { lat: 41.3985, lng: 2.1330 },
            { lat: 41.3970, lng: 2.1330 }
        ]
    }
];

// Style configurations
const mapStyles = {
    parks: {
        polygon: {
            strokeColor: "#228B22",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#90EE90",
            fillOpacity: 0.35
        },
        marker: '../images/markers/park-marker.png'
    },
    neighborhoods: {
        polygon: {
            strokeColor: "#4169E1",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#B0C4DE",
            fillOpacity: 0.35
        },
        marker: '../images/markers/neighborhood-marker.png'
    }
};

// Map initialization function
function initFestivalMap() {
    const map = new google.maps.Map(
        document.getElementById('festival-map'),
        {
            center: mapConfig.barcelona,
            zoom: mapConfig.zoom,
            styles: mapConfig.styles
        }
    );

    // Add parks to map
    parks.forEach(park => addAreaToMap(map, park, 'parks'));

    // Add neighborhoods to map
    neighborhoods.forEach(neighborhood => addAreaToMap(map, neighborhood, 'neighborhoods'));

    // Add legend
    addMapLegend(map);
}

// Helper function to add areas to map
function addAreaToMap(map, area, type) {
    const styles = mapStyles[type];

    // Create polygon
    const polygon = new google.maps.Polygon({
        paths: area.polygon,
        ...styles.polygon
    });
    polygon.setMap(map);

    // Create marker
    const marker = new google.maps.Marker({
        position: area.center,
        map: map,
        title: area.name,
        icon: {
            url: styles.marker,
            scaledSize: new google.maps.Size(30, 30)
        }
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-3">
                <h3 class="font-bold">${area.name}</h3>
                <p>Quiet Area - ${type === 'parks' ? 'Park & Garden' : 'Neighborhood'}</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Add legend to map
function addMapLegend(map) {
    const legend = document.createElement('div');
    legend.className = 'bg-white p-3 rounded shadow absolute bottom-4 left-4';
    legend.innerHTML = `
        <div class="text-sm">
            <div class="flex items-center mb-2">
                <div class="w-4 h-4 bg-[#90EE90] opacity-35 border border-[#228B22] mr-2"></div>
                <span>Parks & Gardens</span>
            </div>
            <div class="flex items-center">
                <div class="w-4 h-4 bg-[#B0C4DE] opacity-35 border border-[#4169E1] mr-2"></div>
                <span>Quiet Neighborhoods</span>
            </div>
        </div>
    `;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(legend);
}
