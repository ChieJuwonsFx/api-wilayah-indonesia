const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const dataPath = './data';

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(dataPath, filename))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

(async () => {
  const provinces = await readCSV('provinces.csv');
  const cities = await readCSV('cities.csv');
  const districts = await readCSV('districts.csv');
  const villages = await readCSV('villages.csv');

  const outputDir = path.join(__dirname, 'json', 'provinces');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const province of provinces) {
    const provId = province.id;

    const filteredCities = cities.filter(city => city.id_prov === provId);
    const cityIds = filteredCities.map(city => city.id);

    const filteredDistricts = districts.filter(dist => cityIds.includes(dist.id_kab));
    const districtIds = filteredDistricts.map(dist => dist.id);

    const filteredVillages = villages.filter(vill => districtIds.includes(vill.id_kec));

    const jsonData = {
      province,
      cities: filteredCities,
      districts: filteredDistricts,
      villages: filteredVillages,
    };

    const filePath = path.join(outputDir, `${provId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`${province.nama} → ${provId}.json`);
  }

})();
