import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const ForgotPasswordScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  // Animasyon değerleri
  const fadeAnim = new Animated.Value(0);
  const moveAnim = new Animated.Value(50);
  
  useEffect(() => {
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
  }, [fadeAnim, moveAnim]);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin');
      return;
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
      return;
    }

    setIsLoading(true);

    // Örnek şifre sıfırlama işlemi - gerçek bir API bağlantısı eklenecek
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, {color: theme.colors.primary}]}>
            ← Giriş Sayfasına Dön
          </Text>
        </TouchableOpacity>
        
        {!isEmailSent ? (
          <Animated.View 
            style={[
              styles.formContainer, 
              {
                opacity: fadeAnim,
                transform: [{translateY: moveAnim}]
              }
            ]}>
            <Image
              source={require('../../assets/forgot_password.jpg')}
              style={styles.image}
              resizeMode="contain"
            />
            
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Şifrenizi mi unuttunuz?
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
              Endişelenmeyin! E-posta adresinizi girin ve size şifre sıfırlama bağlantısı gönderelim.
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, {color: theme.colors.text}]}>
                  E-posta Adresi
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.white,
                      color: theme.colors.dark,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="E-posta adresinizi girin"
                  placeholderTextColor={theme.colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.primary},
                  isLoading && {opacity: 0.7},
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}>
                <Text style={styles.buttonText}>
                  {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            style={[
              styles.successContainer, 
              {
                opacity: fadeAnim,
                transform: [{translateY: moveAnim}]
              }
            ]}>
            <Image
              source={require('../../assets/email_sent.jpg')}
              style={styles.image}
              resizeMode="contain"
            />
            
            <Text style={[styles.title, {color: theme.colors.text}]}>
              E-posta Gönderildi!
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
              Şifre sıfırlama bağlantısı {email} adresine gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </Text>
            
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: theme.colors.primary, marginTop: 30},
              ]}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>
                Giriş Sayfasına Dön
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
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
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen; 