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
            { lat: 41.4018, lng: 2.1235 }, // NE
            { lat: 41.4047, lng: 2.1133 }, // NW
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

    // Helper Functions

    function initializeMapStyles() {
        return {
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
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: "#B0C4DE",
                    fillOpacity: 0.25,
                    clickable: true,
                    zIndex: 1
                }
            }
        };
    }


    function addParkToMap(map, park, styles) {
        const marker = new google.maps.Marker({
            position: park.center,
            map: map,
            title: park.name,
            icon: styles.parks.marker
        });

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

    function addNeighborhoodToMap(map, neighborhood, styles) {
        const polygon = new google.maps.Polygon({
            paths: neighborhood.bounds,
            ...styles.neighborhoods.polygon
        });
        polygon.setMap(map);

        polygon.addListener('mouseover', () => {
            polygon.setOptions({
                fillOpacity: 0.4,
                strokeOpacity: 0.8
            });
        });

        polygon.addListener('mouseout', () => {
            polygon.setOptions({
                fillOpacity: 0.25,
                strokeOpacity: 0.6
            });
        });

        polygon.addListener('click', (e) => {
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="p-3">
                        <h3 class="font-bold">${neighborhood.name}</h3>
                        <p>Quiet Neighborhood</p>
                    </div>
                `,
                position: e.latLng
            });
            infoWindow.open(map);
        });
    }

    function getPolygonCenter(bounds) {
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

    function addMapLegend(map, styles) {
        const legend = document.createElement('div');
        legend.className = 'bg-white p-3 rounded shadow absolute bottom-4 left-4';
        legend.innerHTML = `
            <div class="text-sm">
                <div class="flex items-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 16 16" class="mr-2">
                        <path d="${styles.parks.marker.path}" 
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

function initializeQuietAreaLinks(map) {
    // Get all park headings
    const parkHeadings = document.querySelectorAll('.quiet-areas h4');
    
    parkHeadings.forEach(heading => {
        const parkName = heading.textContent;
        const park = MapData.parks.find(p => p.name === parkName);
        
        if (park) {
            // Create a container for the heading and link
            const container = document.createElement('div');
            container.className = 'flex items-center gap-2';
            
            // Style the heading as a button
            heading.className = 'font-semibold text-blue-600 hover:text-blue-800 cursor-pointer';
            heading.style.cursor = 'pointer';
            
            // Add click handler to center map
            heading.addEventListener('click', () => {
                map.setCenter(park.center);
                map.setZoom(16);
                document.getElementById('festival-map').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // Create Google Maps link
            const googleLink = document.createElement('a');
            const searchQuery = encodeURIComponent(`${parkName} Barcelona`);
            googleLink.href = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
            googleLink.className = 'text-sm text-gray-500 hover:text-gray-700';
            googleLink.target = '_blank';
            googleLink.rel = 'noopener noreferrer';
            googleLink.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M14.8 2.8l-3 3v12.4l3-3V2.8zM7 4.2L4.7 2A1 1 0 003 2.8v10.4a1 1 0 00.3.7L7 17.8V4.2zM17 4.2L14.7 2A1 1 0 0013 2.8v10.4a1 1 0 00.3.7L17 17.8V4.2z"/>
                </svg>
            `;
            
            // Replace original heading with container
            heading.parentNode.insertBefore(container, heading);
            container.appendChild(heading);
            container.appendChild(googleLink);
        }
    });
}

    // Initialize Map (Google Maps callback function)
window.initFestivalMap = function() {
    try {
        mapStyles = initializeMapStyles();
        const map = new google.maps.Map(
            document.getElementById('festival-map'),
            {
                center: MapData.config.barcelona,
                zoom: MapData.config.zoom,
                styles: MapData.config.styles
            }
        );

        MapData.parks.forEach(park => addParkToMap(map, park, mapStyles));
        MapData.neighborhoods.forEach(neighborhood => 
            addNeighborhoodToMap(map, neighborhood, mapStyles)
        );
        addMapLegend(map, mapStyles);
        
         // Initialize the quiet area links
        initializeQuietAreaLinks(map);

    } catch (error) {
        console.error('Error initializing map:', error);
    }
};
})();
