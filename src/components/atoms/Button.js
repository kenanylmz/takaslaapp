import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const {theme} = useTheme();

  // Variant renkleri
  const getBackgroundColor = () => {
    if (disabled) {
      return theme.colors.lightGray;
    }

    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'danger':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'outline':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  // Text rengi
  const getTextColor = () => {
    if (disabled) {
      return theme.colors.gray;
    }

    if (variant === 'outline') {
      return theme.colors.primary;
    }

    return theme.colors.white;
  };

  // Buton boyutu
  const getSize = () => {
    switch (size) {
      case 'small':
        return {height: 36, paddingHorizontal: 12};
      case 'medium':
        return {height: 48, paddingHorizontal: 16};
      case 'large':
        return {height: 56, paddingHorizontal: 20};
      default:
        return {height: 48, paddingHorizontal: 16};
    }
  };

  // Font boyutu
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return theme.fontSizes.sm;
      case 'medium':
        return theme.fontSizes.md;
      case 'large':
        return theme.fontSizes.lg;
      default:
        return theme.fontSizes.md;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSize(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {color: getTextColor(), fontSize: getFontSize()},
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
  },
});

export default Button; 