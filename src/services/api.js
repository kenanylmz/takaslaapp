import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API temel URL'i - emülatör/simülatör ortamına göre değişebilir
const API_URL = 'http://10.0.2.2:3001/api'; // Android Emülatör için
// const API_URL = 'http://localhost:3001/api'; // iOS Simülatör için
// const API_URL = 'http://192.168.1.X:3001/api'; // Gerçek cihaz için (IP adresinizi yazın)

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istekte token kontrolü
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  // Kullanıcı kaydı
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  // Kullanıcı girişi
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  // Şifre sıfırlama
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  // Çıkış yap
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return true;
  }
};

// Profil servisleri
export const profileService = {
  // Profil bilgilerini getir
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  // Profil bilgilerini güncelle
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  
  // Profil resmi yükle
  uploadProfileImage: async (imageFile) => {
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
  }
};

export default api; 