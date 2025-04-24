// API ve resim yapılandırmaları için merkezi dosya
export const API_CONFIG = {
  // API temel URL
  //BASE_URL: 'http://10.0.2.2:3001', // Android Emülatör için
  // BASE_URL: 'http://localhost:3001', // iOS Simulator için
  BASE_URL: 'http://192.168.161.213:3001', // Gerçek cihaz için IP adresinizi kullanın

  // API endpoint'leri
  API_URL: '/api',

  // Tam API URL
  get FULL_API_URL() {
    return `${this.BASE_URL}${this.API_URL}`;
  },

  // Resim URL'si oluşturma fonksiyonu
  getImageUrl(path) {
    return `${this.BASE_URL}/uploads/${path}`;
  },

  // Özel resim yolları
  getListingImageUrl(imageName) {
    return this.getImageUrl(`listings/${imageName}`);
  },

  getProfileImageUrl(imageName) {
    return this.getImageUrl(`profiles/${imageName}`);
  },
};

// Varsayılan profil resmi
export const DEFAULT_PROFILE_IMAGE = require('./assets/default-avatar.png');

// Varsayılan ürün resmi
export const DEFAULT_LISTING_IMAGE = require('./assets/default-listing.png');
