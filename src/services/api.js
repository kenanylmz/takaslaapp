import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Wi-Fi adaptörünüzün gerçek IP adresi
const API_URL = 'http://10.192.189.239:3001/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout ekleyelim
});

// Her istekte token kontrolü
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('API isteği gönderilirken hata oluştu:', error);
    return Promise.reject(error);
  },
);

// Cevapları işle - hata ayıklama için ekstra bilgi ekleyelim
api.interceptors.response.use(
  response => {
    console.log('API Yanıtı:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error(
      'API Hatası:',
      error.response?.status,
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// Auth servisleri
export const authService = {
  // Kullanıcı kaydı
  register: async (name, email, password) => {
    try {
      console.log('Kayıt isteği gönderiliyor:', {name, email});
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      console.log('Kayıt başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Kayıt hatası:', error.response?.data || error.message);
      throw error;
    }
  },

  // Kullanıcı girişi
  login: async (email, password) => {
    try {
      console.log('Giriş isteği gönderiliyor:', {email});
      const response = await api.post('/auth/login', {email, password});
      console.log('Giriş başarılı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Giriş hatası:', error.response?.data || error.message);
      throw error;
    }
  },

  // Şifre sıfırlama
  forgotPassword: async email => {
    try {
      const response = await api.post('/auth/forgot-password', {email});
      return response.data;
    } catch (error) {
      console.error(
        'Şifre sıfırlama hatası:',
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Çıkış yapma
  logout: async () => {
    try {
      // Backend'de logout endpoint varsa kullanılabilir
      // Şimdilik sadece local storage temizleme yapacağız
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw error;
    }
  },
};

// Profil servisleri
export const profileService = {
  // Profil bilgilerini getir
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Profil bilgilerini güncelle
  updateProfile: async profileData => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Profil resmi yükle
  uploadProfileImage: async imageFile => {
    const formData = new FormData();
    formData.append('profileImage', {
      uri: imageFile.uri,
      type: 'image/jpeg',
      name: 'profile-image.jpg',
    });

    const response = await api.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
