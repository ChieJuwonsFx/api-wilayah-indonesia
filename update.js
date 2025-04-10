
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