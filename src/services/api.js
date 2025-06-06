import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG} from '../config';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_CONFIG.FULL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout ekleyelim
});

// Config'den görüntü URL fonksiyonlarını dışa aktar
export const getImageUrl = API_CONFIG.getImageUrl.bind(API_CONFIG);
export const getListingImageUrl =
  API_CONFIG.getListingImageUrl.bind(API_CONFIG);
export const getProfileImageUrl =
  API_CONFIG.getProfileImageUrl.bind(API_CONFIG);

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

// İlan servisleri
export const listingService = {
  // Tüm ilanları getir
  getListings: async () => {
    const response = await api.get('/listings');
    return response.data;
  },

  // İlanları ara ve filtrele
  searchListings: async params => {
    const {category, search, city, page = 1, limit = 10} = params || {};
    const queryParams = new URLSearchParams();

    if (category && category !== 'Tümü')
      queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    if (city) queryParams.append('city', city);
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);

    const response = await api.get(
      `/listings/search?${queryParams.toString()}`,
    );
    return response.data;
  },

  // Kullanıcının kendi ilanlarını getir
  getMyListings: async () => {
    const response = await api.get('/listings/my/listings');
    return response.data;
  },

  // İlan detayını getir
  getListingById: async id => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  // Yeni ilan oluştur
  createListing: async listingData => {
    const formData = new FormData();

    // İlan bilgileri
    formData.append('title', listingData.title);
    formData.append('category', listingData.category);
    formData.append('description', listingData.description);
    formData.append('city', listingData.city);
    formData.append('condition', listingData.condition);

    // Resimler
    if (listingData.images && listingData.images.length > 0) {
      listingData.images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image-${index}.jpg`,
        });
      });
    }

    const response = await api.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // İlan güncelle
  updateListing: async (id, listingData) => {
    const formData = new FormData();

    // İlan bilgileri
    formData.append('title', listingData.title);
    formData.append('category', listingData.category);
    formData.append('description', listingData.description);
    formData.append('city', listingData.city);
    formData.append('condition', listingData.condition);

    // Yeni eklenen resimler
    if (listingData.newImages && listingData.newImages.length > 0) {
      listingData.newImages.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image-${index}.jpg`,
        });
      });
    }

    const response = await api.put(`/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // İlan sil
  deleteListing: async id => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  // Resim sil
  deleteImage: async (listingId, imageName) => {
    const response = await api.delete(
      `/listings/${listingId}/image/${imageName}`,
    );
    return response.data;
  },
};

// Takas önerileri için servis
export const suggestionsService = {
  // Yeni ilan için takas önerileri al
  async getNewListingSuggestions(listingData) {
    try {
      console.log('API: Takas önerisi isteği gönderiliyor:', listingData);
      const response = await api.post('/suggestions', listingData);
      console.log('API Yanıtı:', response.status, response.config.url);

      if (response.data) {
        if (response.data.success && response.data.suggestions) {
          console.log(
            'API: Takas önerileri başarıyla alındı:',
            response.data.suggestions,
          );
          return response.data.suggestions;
        } else if (response.data.suggestions) {
          // Bazen success false olsa bile suggestions gelmiş olabilir
          console.log(
            'API: Takas önerileri alındı (success olmadan):',
            response.data.suggestions,
          );
          return response.data.suggestions;
        } else {
          console.log('API: Yanıtta suggestions yok:', response.data);
          throw new Error(
            response.data?.message || 'Takas önerileri alınamadı',
          );
        }
      } else {
        console.log('API: Yanıt verisi yok');
        throw new Error('API yanıt vermedi');
      }
    } catch (error) {
      console.error('API hatası:', error.message || error);
      throw error;
    }
  },

  // Mevcut ilan için takas önerileri al
  async getListingSuggestions(listingId) {
    try {
      console.log(`API: ${listingId} ID'li ilan için takas önerisi isteniyor`);
      const response = await api.get(`/suggestions/${listingId}`);
      console.log('API Yanıtı:', response.status, response.config.url);

      if (response.data) {
        if (response.data.success && response.data.suggestions) {
          console.log(
            'API: Takas önerileri başarıyla alındı:',
            response.data.suggestions,
          );
          return response.data.suggestions;
        } else if (response.data.suggestions) {
          console.log(
            'API: Takas önerileri alındı (success olmadan):',
            response.data.suggestions,
          );
          return response.data.suggestions;
        } else {
          console.log('API: Yanıtta suggestions yok:', response.data);
          throw new Error(
            response.data?.message || 'Takas önerileri alınamadı',
          );
        }
      } else {
        console.log('API: Yanıt verisi yok');
        throw new Error('API yanıt vermedi');
      }
    } catch (error) {
      console.error('API hatası:', error.message || error);
      throw error;
    }
  },
};

export default api;
