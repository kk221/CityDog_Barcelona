const fs = require('fs');
const axios = require('axios');

async function processData() {
  try {
    console.log('Fetching data...');
    const { data } = await axios.get(
      'https://opendata-ajuntament.barcelona.cat/resources/bcn/AreesGossos/arees_gossos_i_esbarjo_gossos.json'
    );

    console.log('Processing features...');
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

    // Write to CURRENT directory
    fs.writeFileSync(
      `${__dirname}/barcelona-dogparks.geojson`, 
      JSON.stringify(cleanedGeoJSON, null, 2)
    );
    
    console.log('✅ File saved to:', `${__dirname}/barcelona-dogparks.geojson`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

processData();
