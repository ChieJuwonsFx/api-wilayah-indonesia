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

const getProvCode = id => id.split('.')[0];
const getCityCode = id => id.split('.').slice(0,2).join('.');
const getDistrictCode = id => id.split('.').slice(0,3).join('.');

(async () => {
  const provinces = await readCSV('provinces.csv');
  const cities = await readCSV('cities.csv');
  const districts = await readCSV('districts.csv');
  const villages = await readCSV('villages.csv');

  const outputDir = path.join(__dirname, 'json', 'provinces');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const province of provinces) {
    const provId = province.id;

    const filteredCities = cities.filter(city => getProvCode(city.id) === provId);
    const cityIds = filteredCities.map(c => c.id);

    const filteredDistricts = districts.filter(dist => cityIds.includes(getCityCode(dist.id)));
    const districtIds = filteredDistricts.map(d => d.id);

    const filteredVillages = villages.filter(v => districtIds.includes(getDistrictCode(v.id)));

    const jsonData = {
      province,
      cities: filteredCities,
      districts: filteredDistricts,
      villages: filteredVillages
    };

    const filePath = path.join(outputDir, `${province.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`✅ ${province.name} → ${province.name}.json`);
  }

  console.log('🎉 Selesai export semua provinsi ke json/provinces/');
})();
