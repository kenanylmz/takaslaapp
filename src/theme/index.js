// Temel renkler
export const colors = {
  primary: '#4A80F0',
  secondary: '#00D1FF',
  success: '#28C76F',
  danger: '#EA5455',
  warning: '#FF9F43',
  info: '#00CFE8',
  dark: '#1E1E1E',
  light: '#F8F8F8',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8A8A8A',
  lightGray: '#D9D9D9',
};

// Font boyutları
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Boşluk (spacing) değerleri
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Kenarlık yarıçapları
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  circle: 9999,
};

// Açık tema
export const lightTheme = {
  colors: {
    ...colors,
    background: colors.light,
    text: colors.dark,
    border: colors.lightGray,
  },
  fontSizes,
  spacing,
  borderRadius,
};

// Koyu tema
export const darkTheme = {
  colors: {
    ...colors,
    background: colors.dark,
    text: colors.white,
    border: colors.gray,
  },
  fontSizes,
  spacing,
  borderRadius,
}; 