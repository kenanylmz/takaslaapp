import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const SplashScreen = ({onFinish}) => {
  const {theme} = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Fade-in animasyonu
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // 3 saniye sonra onFinish callback'ini çağır
    const timer = setTimeout(() => {
      // Fade-out animasyonu
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        {backgroundColor: theme.colors.background, opacity: fadeAnim}
      ]}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, {color: theme.colors.text}]}>Takasla</Text>
      <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
        Takas yapmak hiç bu kadar kolay olmamıştı!
      </Text>
      
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingBar, {backgroundColor: theme.colors.primary}]} />
      </View>
    </Animated.View>
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
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingContainer: {
    width: 200,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 30,
  },
  loadingBar: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    // Animasyon efekti
    animation: 'loading 2s infinite',
  },
});

export default SplashScreen; 