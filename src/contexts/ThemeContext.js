import React, {createContext, useState, useContext, useEffect} from 'react';
import {lightTheme, darkTheme} from '../theme';

// Theme Context oluştur
const ThemeContext = createContext();

// Theme Provider komponenti
export const ThemeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  // Tema değiştiğinde çalışacak effect
  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{theme, isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext); 