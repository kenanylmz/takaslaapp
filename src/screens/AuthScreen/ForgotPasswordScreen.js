import React, {useState, useEffect, useCallback, useMemo} from 'react';
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
import styles from '../../styles/auth/forgotPasswordStyles';

const ForgotPasswordScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Animasyon değerleri - useRef kullanarak yeniden render'ı engelle
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const moveAnim = useMemo(() => new Animated.Value(50), []);

  // Email değişim işleyicisini optimize et
  const handleEmailChange = useCallback(text => {
    setEmail(text);
  }, []);

  // Şifre sıfırlama işleyicisini optimize et
  const handleResetPassword = useCallback(() => {
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
  }, [email]);

  // Giriş sayfasına dönüş işleyicisi
  const goToLoginScreen = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  useEffect(() => {
    // Giriş animasyonu - sadece bir kere çalışacak
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

  // Stil memoization
  const containerStyle = useMemo(
    () => [styles.container, {backgroundColor: theme.colors.background}],
    [theme],
  );

  const formContainerStyle = useMemo(
    () => [
      styles.formContainer,
      {
        opacity: fadeAnim,
        transform: [{translateY: moveAnim}],
      },
    ],
    [fadeAnim, moveAnim],
  );

  const successContainerStyle = useMemo(
    () => [
      styles.successContainer,
      {
        opacity: fadeAnim,
        transform: [{translateY: moveAnim}],
      },
    ],
    [fadeAnim, moveAnim],
  );

  const buttonStyle = useMemo(
    () => [
      styles.button,
      {backgroundColor: theme.colors.primary, marginTop: 30},
    ],
    [theme],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={containerStyle}>
        <TouchableOpacity style={styles.backButton} onPress={goToLoginScreen}>
          <Text style={[styles.backButtonText, {color: theme.colors.primary}]}>
            ← Giriş Sayfasına Dön
          </Text>
        </TouchableOpacity>

        {!isEmailSent ? (
          <Animated.View style={formContainerStyle}>
            <Image
              source={require('../../assets/forgot_password.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={[styles.title, {color: theme.colors.text}]}>
              Şifrenizi mi unuttunuz?
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
              Endişelenmeyin! E-posta adresinizi girin ve size şifre sıfırlama
              bağlantısı gönderelim.
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
                  onChangeText={handleEmailChange}
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
                  {isLoading ? 'Gönderiliyor...' : 'Şifremi Sıfırla'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View style={successContainerStyle}>
            <Image
              source={require('../../assets/email_sent.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={[styles.title, {color: theme.colors.text}]}>
              E-posta Gönderildi!
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
              Şifre sıfırlama bağlantısı {email} adresine gönderildi. Lütfen
              gelen kutunuzu kontrol edin.
            </Text>

            <TouchableOpacity style={buttonStyle} onPress={goToLoginScreen}>
              <Text style={styles.buttonText}>Giriş Sayfasına Dön</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;
