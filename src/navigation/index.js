import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../contexts/UserContext';
import {View} from 'react-native';

// Ekranlar
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
import ForgotPasswordScreen from '../screens/AuthScreen/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import TradeScreen from '../screens/TradeScreen/TradeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Ana tab navigasyonu
const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: 'Ana Sayfa'}} />
      <Tab.Screen name="Trade" component={TradeScreen} options={{title: 'Takaslarım'}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{title: 'Profil'}} />
    </Tab.Navigator>
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
        console.error('Onboarding durumu kontrol edilirken hata oluştu:', error);
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
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            {!hasSeenOnboarding && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 