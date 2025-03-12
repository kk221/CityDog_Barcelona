(function() {
    // Map Data Configuration
    const MapData = {
        config: {
            barcelona: { lat: 41.3851, lng: 2.1734 },
            zoom: 13,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        },

        parks: [
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
        ],

        neighborhoods: [
            {
                name: "Sarrià",
                bounds: [
            { lat: 41.3935, lng: 2.1133 }, // SW
            { lat: 41.3935, lng: 2.1207 }, // SE
            { lat: 41.3972, lng: 2.1235 }, // E
            { lat: 41.4018, lng: 2.1235 }, // NE
            { lat: 41.4047, lng: 2.1207 }, // N
            { lat: 41.4047, lng: 2.1133 }, // NW
            { lat: 41.4018, lng: 2.1105 }, // W
            { lat: 41.3972, lng: 2.1105 }  // SW
        ]
            },
            {
                name: "Pedralbes",
                bounds: [
            { lat: 41.3847, lng: 2.1027 }, // SW
            { lat: 41.3847, lng: 2.1160 }, // SE
            { lat: 41.3935, lng: 2.1160 }, // NE
            { lat: 41.3935, lng: 2.1027 }  // NW
        ]
            },
            {
                name: "Tres Torres",
                bounds: [
            { lat: 41.3935, lng: 2.1235 }, // SW
            { lat: 41.3935, lng: 2.1368 }, // SE
            { lat: 41.4018, lng: 2.1368 }, // NE
            { lat: 41.4018, lng: 2.1235 }  // NW
        ]
            },
               {
        name: "Sant Gervasi - La Bonanova",
        bounds: [
            { lat: 41.4018, lng: 2.1235 }, // SW
            { lat: 41.4018, lng: 2.1368 }, // SE
            { lat: 41.4102, lng: 2.1368 }, // NE
            { lat: 41.4102, lng: 2.1235 }  // NW
        ]
    },
    {
        name: "Sant Gervasi - Galvany",
        bounds: [
            { lat: 41.3935, lng: 2.1368 }, // SW
            { lat: 41.3935, lng: 2.1501 }, // SE
            { lat: 41.4018, lng: 2.1501 }, // NE
            { lat: 41.4018, lng: 2.1368 }  // NW
        ]
    },
    {
        name: "Vallvidrera",
        bounds: [
            { lat: 41.4102, lng: 2.1027 }, // SW
            { lat: 41.4102, lng: 2.1235 }, // SE
            { lat: 41.4185, lng: 2.1235 }, // NE
            { lat: 41.4185, lng: 2.1027 }  // NW
        ]
    }
            
        ]
    };

    // Map Styles (will be initialized when Google Maps loads)
    let mapStyles;

    // Map Helper Functions
    const MapHelpers = {
        initializeStyles: function() {
            mapStyles = {
                parks: {
                    marker: {
                        path: 'M4.086 7.9a1.91 1.91 0 0 1-.763 2.52c-.81.285-1.782-.384-2.17-1.492a1.91 1.91 0 0 1 .762-2.521c.81-.285 1.782.384 2.171 1.492zm6.521 7.878a2.683 2.683 0 0 1-1.903-.788.996.996 0 0 0-1.408 0 2.692 2.692 0 0 1-3.807-3.807 6.377 6.377 0 0 1 9.022 0 2.692 2.692 0 0 1-1.904 4.595zM7.73 6.057c.127 1.337-.563 2.496-1.54 2.588-.977.092-1.872-.917-1.998-2.254-.127-1.336.563-2.495 1.54-2.587.977-.093 1.871.916 1.998 2.253zm.54 0c-.127 1.337.563 2.496 1.54 2.588.977.092 1.871-.917 1.998-2.254.127-1.336-.563-2.495-1.54-2.587-.977-.093-1.872.916-1.998 2.253zm3.644 1.842a1.91 1.91 0 0 0 .763 2.522c.81.284 1.782-.385 2.17-1.493a1.91 1.91 0 0 0-.762-2.521c-.81-.285-1.782.384-2.171 1.492z',
                        fillColor: "#228B22",
                        fillOpacity: 1,
                        strokeWeight: 0,
                        rotation: 0,
                        scale: 1.5,
                        anchor: new google.maps.Point(8, 8)
                    }
                },
                neighborhoods: {
                    polygon: {
                        strokeColor: "#4169E1",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#B0C4DE",
                        fillOpacity: 0.35
                    }
                }
            };
        },
// Helper Functions
function addParkToMap(map, park) {
    // Create marker with SVG icon
    const marker = new google.maps.Marker({
        position: park.center,
        map: map,
        title: park.name,
        icon: mapStyles.parks.marker
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-3">
                <h3 class="font-bold">${park.name}</h3>
                <p>Quiet Area - Park & Garden</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

function addNeighborhoodToMap(map, neighborhood) {
    // Create polygon for neighborhood
    const polygon = new google.maps.Polygon({
        paths: neighborhood.bounds,
        ...mapStyles.neighborhoods.polygon
    });
    polygon.setMap(map);

    // Add click listener to polygon
    polygon.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="p-3">
                    <h3 class="font-bold">${neighborhood.name}</h3>
                    <p>Quiet Neighborhood</p>
                </div>
            `,
            position: getPolygonCenter(neighborhood.bounds)
        });
        infoWindow.open(map);
    });
}

function getPolygonCenter(bounds) {
    // Calculate center of polygon
    let lat = 0, lng = 0;
    bounds.forEach(point => {
        lat += point.lat;
        lng += point.lng;
    });
    return {
        lat: lat / bounds.length,
        lng: lng / bounds.length
    };
}

function addMapLegend(map) {
    const legend = document.createElement('div');
    legend.className = 'bg-white p-3 rounded shadow absolute bottom-4 left-4';
    legend.innerHTML = `
        <div class="text-sm">
            <div class="flex items-center mb-2">
                <svg width="20" height="20" viewBox="0 0 16 16" class="mr-2">
                    <path d="${mapStyles.parks.marker.path}" 
                          fill="#228B22"/>
                </svg>
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

// Initialize Map
function initFestivalMap() {
    try {
        const map = new google.maps.Map(
            document.getElementById('festival-map'),
            {
                center: MapData.config.barcelona,
                zoom: MapData.config.zoom,
                styles: MapData.config.styles
            }
        );

        // Add parks with SVG markers
        MapData.parks.forEach(park => addParkToMap(map, park));
        
        // Add neighborhoods with color overlays
        MapData.neighborhoods.forEach(neighborhood => 
            addNeighborhoodToMap(map, neighborhood)
        );

        // Add legend with SVG for parks
        addMapLegend(map);

    } catch (error) {
        console.error('Error initializing map:', error);
    }
})();
