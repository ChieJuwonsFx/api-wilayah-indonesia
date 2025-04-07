const express = require('express');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', routes); 

app.listen(PORT, () => {
  console.log(`✅ API Wilayah aktif di http://localhost:${PORT}`);
});
