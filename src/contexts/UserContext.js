import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User Context
const UserContext = createContext();

// User Provider komponenti
export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Uygulama başladığında kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
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
  const login = async userData => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Giriş yapılırken hata oluştu:', error);
      return false;
    }
  };

  // Çıkış yapma fonksiyonu
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{user, isLoading, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => useContext(UserContext); 