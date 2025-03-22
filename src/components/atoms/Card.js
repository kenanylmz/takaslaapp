import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const Card = ({children, style, shadowLevel = 'medium'}) => {
  const {theme} = useTheme();

  const getShadow = () => {
    switch (shadowLevel) {
      case 'none':
        return {};
      case 'low':
        return {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        };
      case 'medium':
        return {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'high':
        return {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 5,
        };
      default:
        return {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
        getShadow(),
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
  },
});

export default Card; 