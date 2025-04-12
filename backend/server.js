const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// .env değişkenlerini yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*', // Tüm kaynaklara izin ver (geliştirme için)
  }),
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Statik dosyalar için klasörler - uploads klasörünü doğru şekilde ayarlayalım
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Uploads klasörlerini oluştur
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true});
}

// Listings klasörü için uploads klasörü
const listingsUploadDir = path.join(__dirname, 'uploads/listings');
if (!fs.existsSync(listingsUploadDir)) {
  fs.mkdirSync(listingsUploadDir, {recursive: true});
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Takasla API çalışıyor');
});

// Port ayarı
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} numaralı portta çalışıyor`);
});
