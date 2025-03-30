import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../contexts/UserContext';
import {useTheme} from '../contexts/ThemeContext';

// Ekranlar
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
import ForgotPasswordScreen from '../screens/AuthScreen/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

const Stack = createStackNavigator();

// Temporary Dashboard Screen - HomeScreen, ProfileScreen, TradeScreen olmadığı için
const TemporaryDashboard = () => {
  const {theme} = useTheme();
  const {logout} = useUser();

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        Dashboard Sayfası
      </Text>
      <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
        Ana ekran, Takas ve Profil sayfaları henüz eklenmedi. Bu geçici bir
        dashboard sayfasıdır.
      </Text>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.primary}]}
        onPress={logout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

// Ana navigasyon
const AppNavigator = () => {
  const {user, isLoading} = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Onboarding durumunu kontrol et
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        if (value === 'true') {
          setHasSeenOnboarding(true);
        }
      } catch (error) {
        console.error(
          'Onboarding durumu kontrol edilirken hata oluştu:',
          error,
        );
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  // Splash ekranı zamanlayıcısı
  useEffect(() => {
    if (!isLoading && !isCheckingOnboarding) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isCheckingOnboarding]);

  if (isLoading || isCheckingOnboarding || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="Dashboard" component={TemporaryDashboard} />
        ) : (
          <>
            {!hasSeenOnboarding && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AppNavigator;
