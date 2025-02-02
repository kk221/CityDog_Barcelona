// process-dogparks.js
const fs = require('fs');
const axios = require('axios');

async function processData() {
  try {
    // 1. Fetch official data
    const { data } = await axios.get(
      'https://opendata-ajuntament.barcelona.cat/resources/bcn/AreesGossos/arees_gossos_i_esbarjo_gossos.json'
    );

    // 2. Standardize GeoJSON structure
    const cleanedGeoJSON = {
      type: "FeatureCollection",
      features: data.features.map(feature => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1]
          ]
        },
        properties: {
          name: feature.properties.nom,
          type: feature.properties.tipus,
          district: feature.properties.districte,
          schedule: feature.properties.horari,
          size: feature.properties.superficie_metres_quadrats,
          address: feature.properties.adreca_completa
        }
      }))
    };

    // 3. Save to file
    fs.writeFileSync('barcelona-dogparks.geojson', JSON.stringify(cleanedGeoJSON));
    console.log('GeoJSON file created successfully!');

  } catch (error) {
    console.error('Error processing data:', error);
  }
}

processData();

