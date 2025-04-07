// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');

// const dataPath = './data';

// const readCSV = (filename) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(path.join(dataPath, filename))
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', () => resolve(results))
//       .on('error', reject);
//   });
// };

// const getProvCode = id => id.split('.')[0];
// const getCityCode = id => id.split('.').slice(0,2).join('.');
// const getDistrictCode = id => id.split('.').slice(0,3).join('.');

// (async () => {
//   const provinces = await readCSV('provinces.csv');
//   const cities = await readCSV('cities.csv');
//   const districts = await readCSV('districts.csv');
//   const villages = await readCSV('villages.csv');

//   const outputDir = path.join(__dirname, 'json', 'provinces');
//   fs.mkdirSync(outputDir, { recursive: true });

//   for (const province of provinces) {
//     const provId = province.id;

//     const filteredCities = cities.filter(city => getProvCode(city.id) === provId);
//     const cityIds = filteredCities.map(c => c.id);

//     const filteredDistricts = districts.filter(dist => cityIds.includes(getCityCode(dist.id)));
//     const districtIds = filteredDistricts.map(d => d.id);

//     const filteredVillages = villages.filter(v => districtIds.includes(getDistrictCode(v.id)));

//     const jsonData = {
//       province,
//       cities: filteredCities,
//       districts: filteredDistricts,
//       villages: filteredVillages
//     };

//     const filePath = path.join(outputDir, `${provId}.json`);
//     fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
//     console.log(`✅ ${province.name} → ${provId}.json`);
//   }

//   console.log('🎉 Selesai export semua provinsi ke json/provinces/');
// })();

// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');
// const { Parser } = require('json2csv');

// const inputDir = './data';
// const outputDir = './data-cleaned';

// // Baca CSV
// const readCSV = (filename) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(path.join(inputDir, filename))
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', () => resolve(results))
//       .on('error', reject);
//   });
// };

// // Tulis ke CSV
// const writeCSV = (filename, data, fields) => {
//   const parser = new Parser({ fields });
//   const csv = parser.parse(data);
//   fs.mkdirSync(outputDir, { recursive: true });
//   fs.writeFileSync(path.join(outputDir, filename), csv, 'utf8');
// };

// // Fungsi ambil id parent
// const getProvCode = id => (id || '').split('.')[0];
// const getCityCode = id => (id || '').split('.').slice(0, 2).join('.');
// const getDistrictCode = id => (id || '').split('.').slice(0, 3).join('.');

// (async () => {
//   try {
//     const provincesRaw = await readCSV('provinces.csv');
//     const citiesRaw = await readCSV('cities.csv');
//     const districtsRaw = await readCSV('districts.csv');
//     const villagesRaw = await readCSV('villages.csv');

//     // Clean provinces
//     const provinces = provincesRaw.map(row => ({
//       id: row.id || row.id || '',
//       nama: row.nama || row.name || ''
//     })).filter(p => p.id && p.nama);

//     // Clean cities
//     const cities = citiesRaw.map(row => {
//       const id = row.id || row.id || '';
//       return {
//         id,
//         nama: row.nama || row.name || '',
//         id_prov: getProvCode(id)
//       };
//     }).filter(c => c.id && c.nama && c.id_prov);

//     // Clean districts
//     const districts = districtsRaw.map(row => {
//       const id = row.id || row.id || '';
//       return {
//         id,
//         nama: row.nama || row.name || '',
//         id_kab: getCityCode(id)
//       };
//     }).filter(d => d.id && d.nama && d.id_kab);

//     // Clean villages
//     const villages = villagesRaw.map(row => {
//       const id = row.id || row.id || '';
//       return {
//         id,
//         nama: row.nama || row.name || '',
//         id_kec: getDistrictCode(id)
//       };
//     }).filter(v => v.id && v.nama && v.id_kec);

//     // Tulis CSV hasil
//     writeCSV('provinces-clean.csv', provinces, ['id', 'nama']);
//     writeCSV('cities-clean.csv', cities, ['id', 'nama', 'id_prov']);
//     writeCSV('districts-clean.csv', districts, ['id', 'nama', 'id_kab']);
//     writeCSV('villages-clean.csv', villages, ['id', 'nama', 'id_kec']);

//     console.log('✅ Semua file berhasil diubah dan disimpan ke folder `data-cleaned/`');
//   } catch (err) {
//     console.error('❌ Terjadi kesalahan saat memproses:', err);
//   }
// })();


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
    console.log(`✅ ${province.nama} → ${provId}.json`);
  }

  console.log('🎉 Semua provinsi berhasil di-export ke folder json/provinces');
})();
