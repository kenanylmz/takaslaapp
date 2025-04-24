import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../contexts/UserContext';
import {useTheme} from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Ekranlar
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
import ForgotPasswordScreen from '../screens/AuthScreen/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MyListingsScreen from '../screens/ListingScreen/MyListingsScreen';
import CreateListingScreen from '../screens/ListingScreen/CreateListingScreen';
import EditListingScreen from '../screens/ListingScreen/EditListingScreen';
import SuggestionResultScreen from '../screens/ListingScreen/SuggestionResultScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

// Listing Stack Navigator
const ListingStack = createStackNavigator();
const ListingNavigator = () => {
  return (
    <ListingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ListingStack.Screen name="MyListings" component={MyListingsScreen} />
      <ListingStack.Screen
        name="CreateListing"
        component={CreateListingScreen}
      />
      <ListingStack.Screen name="EditListing" component={EditListingScreen} />
      <ListingStack.Screen
        name="SuggestionResult"
        component={SuggestionResultScreen}
      />
    </ListingStack.Navigator>
  );
};

// Ana Tab Navigator
const MainNavigator = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={TemporaryDashboard}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={TemporaryDashboard}
        options={{
          tabBarLabel: 'Keşfet',
          tabBarIcon: ({color, size}) => (
            <Icon name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Listing"
        component={ListingNavigator}
        options={{
          tabBarLabel: 'İlanlarım',
          tabBarIcon: ({color, size}) => (
            <Icon name="plus-circle" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={TemporaryDashboard}
        options={{
          tabBarLabel: 'Mesajlar',
          tabBarIcon: ({color, size}) => (
            <Icon name="message-text" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({color, size}) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Ana navigasyon
const AppNavigator = () => {
  const {user, isLoading} = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Konsola çıktı ekleyelim - debugging için
  useEffect(() => {
    console.log('Navigation State:', {
      user: user ? 'logged in' : 'logged out',
      isLoading,
      showSplash,
      hasSeenOnboarding,
      isCheckingOnboarding,
    });
  }, [user, isLoading, showSplash, hasSeenOnboarding, isCheckingOnboarding]);

  // Onboarding durumunu kontrol et
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        console.log('Onboarding durumu:', value);
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

  // Splash ekranı zamanlayıcısı - sadece uygulama ilk açıldığında gösterilsin
  useEffect(() => {
    if (!isLoading && !isCheckingOnboarding) {
      const timer = setTimeout(() => {
        console.log('Splash ekranı kapatılıyor...');
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isCheckingOnboarding]);

  // Sadece uygulama ilk açıldığında splash göster
  if (showSplash && !isLoading && !isCheckingOnboarding) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Yükleme durumunda loading göster
  if (isLoading || isCheckingOnboarding) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#4A80F0" />
        <Text style={{marginTop: 10}}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
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
