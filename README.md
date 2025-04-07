# 🇮🇩 API Wilayah Indonesia (38 Provinsi)

Selamat datang di **API Wilayah Indonesia**, sebuah API sederhana berbasis _static JSON_ yang berisi data wilayah administratif lengkap di Indonesia mulai dari **Provinsi**, **Kabupaten/Kota**, **Kecamatan**, hingga **Desa/Kelurahan**.

Data ini telah disusun dengan struktur relasional dan mencakup total **38 provinsi terbaru** sesuai pembagian wilayah administratif Indonesia tahun 2025.

---

## 📦 Struktur Data

Semua data disediakan dalam format **JSON** yang dibagi berdasarkan:

- `/json/provinces.json` – Daftar 38 Provinsi
- `/json/provinces/{id}.json` – Data lengkap per provinsi (kabupaten, kecamatan, desa)
- Data per level wilayah memiliki ID unik dan kolom relasi eksplisit:
  - `id`
  - `nama`
  - `id_prov` (untuk kabupaten/kota)
  - `id_kab` (untuk kecamatan)
  - `id_kec` (untuk desa)

Contoh endpoint:
```
https://chiejuwonsfx.github.io/api-wilayah-indonesia/json/provinces.json
https://chiejuwonsfx.github.io/api-wilayah-indonesia/json/provinces/33.json
```

---

## 💡 Kelebihan

✅ Tidak perlu backend, cukup _fetch_ dari URL  
✅ Praktis digunakan untuk kebutuhan frontend form alamat  
✅ Bebas digunakan untuk keperluan personal maupun pembelajaran  
✅ Mengikuti struktur relasi wilayah yang rapi dan mudah diproses  

---

## 🚀 Contoh Penggunaan

Berikut contoh form interaktif menggunakan API ini:  
🔗 [Demo Form Alamat Indonesia](https://chiejuwonsfx.github.io/api-wilayah-indonesia/demo.html)

---

## 📁 Struktur Folder

```
📦 /json
 ┣ 📄 provinces.json
 ┣ 📁 provinces/
 ┃ ┣ 📄 11.json
 ┃ ┣ 📄 12.json
 ┃ ┗ ... dan seterusnya
```

---

## 🛠 Cara Menggunakan

```js
// Ambil data provinsi
fetch('https://chiejuwonsfx.github.io/api-wilayah-indonesia/json/provinces.json')
  .then(res => res.json())
  .then(data => console.log(data));

// Ambil kabupaten/kecamatan/desa dari provinsi tertentu
fetch('https://chiejuwonsfx.github.io/api-wilayah-indonesia/json/provinces/33.json')
  .then(res => res.json())
  .then(data => {
    console.log(data.cities);      // Kabupaten/Kota
    console.log(data.districts);   // Kecamatan
    console.log(data.villages);    // Desa
  });
```

---

## ⚠️ Disclaimer

Data ini diambil dan disusun ulang dari berbagai sumber terbuka dan dapat memiliki perbedaan kecil dengan versi resmi. Gunakan secara bijak dan bantu laporkan jika ada ketidaksesuaian.

---

## 👨‍💻 Dibuat Oleh

Richie Olajuwon Santoso  
📷 [Instagram](https://www.instagram.com/rchieee__)  
📧 richieolajuwons[at]gmail.com

