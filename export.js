// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');

// const dataPath = './data';
// const outputPath = './json';
// const outputProvPath = path.join(outputPath, 'provinces');

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

// (async () => {
//   try {
//     const provinces = await readCSV('provinces.csv');
//     const cities = await readCSV('cities.csv');
//     const districts = await readCSV('districts.csv');
//     const villages = await readCSV('villages.csv');

//     fs.mkdirSync(outputPath, { recursive: true });
//     fs.mkdirSync(outputProvPath, { recursive: true });

//     fs.writeFileSync(
//       path.join(outputPath, 'provinces.json'),
//       JSON.stringify(provinces, null, 2),
//       'utf8'
//     );
//     console.log('✅ Berhasil generate json/provinces.json');

//     for (const province of provinces) {
//       const provId = province.id;

//       const filteredCities = cities.filter(city => city.id_prov === provId);
//       const cityIds = filteredCities.map(city => city.id);

//       const filteredDistricts = districts.filter(dist => cityIds.includes(dist.id_kab));
//       const districtIds = filteredDistricts.map(dist => dist.id);

//       const filteredVillages = villages.filter(vill => districtIds.includes(vill.id_kec));

//       const jsonData = {
//         province,
//         cities: filteredCities,
//         districts: filteredDistricts,
//         villages: filteredVillages
//       };

//       const filePath = path.join(outputProvPath, `${provId}.json`);
//       fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
//       console.log(`✅ ${province.nama} → ${provId}.json`);
//     }

//     console.log('🎉 Semua data berhasil digenerate ke folder json/');
//   } catch (err) {
//     console.error('❌ Terjadi kesalahan saat generate:', err);
//   }
// })();

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const dataPath = './data';
const outputPath = './json';
const regencyPath = path.join(outputPath, 'regencies');
const districtPath = path.join(outputPath, 'districts');
const villagePath = path.join(outputPath, 'villages');

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
  try {
    const cities = await readCSV('cities.csv');
    const districts = await readCSV('districts.csv');
    const villages = await readCSV('villages.csv');

    fs.mkdirSync(regencyPath, { recursive: true });
    fs.mkdirSync(districtPath, { recursive: true });
    fs.mkdirSync(villagePath, { recursive: true });

    // Buat regencies/{provId}.json
    const provMap = {};
    for (const city of cities) {
      if (!provMap[city.id_prov]) provMap[city.id_prov] = [];
      provMap[city.id_prov].push(city);
    }
    for (const provId in provMap) {
      const filePath = path.join(regencyPath, `${provId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(provMap[provId], null, 2), 'utf8');
      console.log(`✅ Regencies → ${provId}.json`);
    }

    // Buat districts/{kabId}.json
    const kabMap = {};
    for (const dist of districts) {
      if (!kabMap[dist.id_kab]) kabMap[dist.id_kab] = [];
      kabMap[dist.id_kab].push(dist);
    }
    for (const kabId in kabMap) {
      const filePath = path.join(districtPath, `${kabId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(kabMap[kabId], null, 2), 'utf8');
      console.log(`✅ Districts → ${kabId}.json`);
    }

    // Buat villages/{kecId}.json
    const kecMap = {};
    for (const vill of villages) {
      if (!kecMap[vill.id_kec]) kecMap[vill.id_kec] = [];
      kecMap[vill.id_kec].push(vill);
    }
    for (const kecId in kecMap) {
      const filePath = path.join(villagePath, `${kecId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(kecMap[kecId], null, 2), 'utf8');
      console.log(`✅ Villages → ${kecId}.json`);
    }

    console.log('🎉 Semua endpoint tambahan berhasil digenerate!');
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat generate:', err);
  }
})();