import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useUser} from '../contexts/UserContext';

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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trade" component={TradeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Ana navigasyon
const AppNavigator = () => {
  const {user, isLoading} = useUser();

  if (isLoading) {
    return <SplashScreen />;
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