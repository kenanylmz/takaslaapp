import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService, profileService} from '../services/api';

// User Context
const UserContext = createContext();

// User Provider komponenti
export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Uygulama başladığında kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');

        if (userData && token) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Giriş yapma fonksiyonu
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.login(email, password);

      // Token ve kullanıcı bilgilerini sakla
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data));

      setUser(data);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || 'Giriş yapılırken bir hata oluştu',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Kayıt olma fonksiyonu
  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.register(name, email, password);

      // Token ve kullanıcı bilgilerini sakla
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data));

      setUser(data);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || 'Kayıt olurken bir hata oluştu',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Şifremi unuttum fonksiyonu
  const forgotPassword = async email => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Şifre sıfırlama işlemi başarısız oldu',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Profil güncelleme fonksiyonu
  const updateProfile = async profileData => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await profileService.updateProfile(profileData);

      // Güncellenmiş kullanıcı bilgilerini sakla
      const currentUser = {...user, ...updatedUser};
      await AsyncStorage.setItem('user', JSON.stringify(currentUser));

      setUser(currentUser);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Profil güncellenirken bir hata oluştu',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Profil resmi yükleme fonksiyonu
  const uploadProfileImage = async imageFile => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await profileService.uploadProfileImage(imageFile);

      // Güncellenmiş kullanıcı bilgilerini sakla
      const currentUser = {...user, profileImage: result.profileImage};
      await AsyncStorage.setItem('user', JSON.stringify(currentUser));

      setUser(currentUser);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Profil resmi yüklenirken bir hata oluştu',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış yapma fonksiyonu
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      return true;
    } catch (error) {
      setError('Çıkış yapılırken bir hata oluştu');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        forgotPassword,
        updateProfile,
        uploadProfileImage,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => useContext(UserContext);
