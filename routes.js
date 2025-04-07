const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();

const cache = {
  provinces: null,
  cities: null,
  districts: null,
  villages: null
};

function readCsv(filePath, cacheKey) {
  return new Promise((resolve, reject) => {
    if (cache[cacheKey]) {
      return resolve(cache[cacheKey]); 
    }

    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        cache[cacheKey] = results; 
        resolve(results);
      })
      .on('error', (err) => reject(err));
  });
}

// GET /api/provinces
router.get('/provinces', async (req, res) => {
  const data = await readCsv('./data/provinces.csv', 'provinces');
  res.json(data);
});

// GET /api/provinces/:provinceCode/cities
router.get('/provinces/:provinceCode/cities', async (req, res) => {
  const data = await readCsv('./data/cities.csv', 'cities');
  const filtered = data.filter(c => c.province_code === req.params.provinceCode);
  res.json(filtered);
});

// GET /api/cities/:cityCode/districts
router.get('/cities/:cityCode/districts', async (req, res) => {
  const data = await readCsv('./data/districts.csv', 'districts');
  const filtered = data.filter(d => d.city_code === req.params.cityCode);
  res.json(filtered);
});

// GET /api/districts/:districtCode/villages
router.get('/districts/:districtCode/villages', async (req, res) => {
  const data = await readCsv('./data/villages.csv', 'villages');
  const filtered = data.filter(v => v.district_code === req.params.districtCode);
  res.json(filtered);
});

// GET /api/cache/clear
router.get('/cache/clear', (req, res) => {
    cache.provinces = null;
    cache.cities = null;
    cache.districts = null;
    cache.villages = null;
    res.json({ message: 'Cache cleared!' });
  });
  

module.exports = router;
