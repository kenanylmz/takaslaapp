import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';

const LoginScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {login} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animasyon değerleri
  const fadeAnim = new Animated.Value(0);
  const moveAnim = new Animated.Value(50);
  
  useEffect(() => {
    // Klavye gösterildiğinde/gizlendiğinde dinleyiciler
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );
    
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [fadeAnim, moveAnim]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);

    // Örnek login işlemi - gerçek bir API bağlantısı eklenecek
    try {
      const userData = {
        id: 1,
        email,
        name: 'Test Kullanıcı',
      };

      const success = await login(userData);
      if (!success) {
        Alert.alert('Hata', 'Giriş yapılırken bir sorun oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Animated.View 
          style={[
            styles.logoContainer, 
            {
              opacity: fadeAnim,
              transform: [{translateY: moveAnim}],
              display: keyboardVisible ? 'none' : 'flex'
            }
          ]}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, {color: theme.colors.primary}]}>
            Takasla
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.formContainer, 
            {
              opacity: fadeAnim,
              transform: [{translateY: moveAnim}]
            }
          ]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Giriş Yap
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
            Hesabınıza erişim sağlayın
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, {color: theme.colors.text}]}>E-posta</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.white,
                    color: theme.colors.dark,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="E-posta adresiniz"
                placeholderTextColor={theme.colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, {color: theme.colors.text}]}>Şifre</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.white,
                    color: theme.colors.dark,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Şifreniz"
                placeholderTextColor={theme.colors.gray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={{color: theme.colors.primary}}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: theme.colors.primary},
                isLoading && {opacity: 0.7},
              ]}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={{color: theme.colors.gray}}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});

export default LoginScreen; 