import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useUser} from '../contexts/UserContext';
import {View} from 'react-native';

// Ekranlar
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
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

  // Eğer isLoading değişirse, splash ekranını göster
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 