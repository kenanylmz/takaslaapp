import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const SplashScreen = () => {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, {color: theme.colors.text}]}>Takasla</Text>
      <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
        Takas yapmak hiç bu kadar kolay olmamıştı!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SplashScreen; 