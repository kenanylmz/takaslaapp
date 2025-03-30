import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
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
import styles from '../../styles/auth/loginStyles';

const LoginScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {login, error} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Animasyon değerleri - useMemo kullanarak render optimize et
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const moveAnim = useMemo(() => new Animated.Value(50), []);

  // Input değişim işleyicilerini optimize et
  const handleEmailChange = useCallback(text => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
  }, []);

  // Giriş işleyicisini optimize et
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const success = await login(email, password);

      if (!success) {
        setLoginError(error || 'Giriş yapılırken bir sorun oluştu');
      }
    } catch (err) {
      setLoginError('Giriş yapılırken beklenmeyen bir hata oluştu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, error]);

  // Kayıt ekranına gitme işleyicisi
  const goToRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  // Şifremi unuttum ekranına gitme işleyicisi
  const goToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  useEffect(() => {
    // Klavye gösterildiğinde/gizlendiğinde dinleyiciler
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
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

  // Stil memoization
  const containerStyle = useMemo(
    () => [styles.container, {backgroundColor: theme.colors.background}],
    [theme],
  );

  const logoContainerStyle = useMemo(
    () => [
      styles.logoContainer,
      {
        opacity: fadeAnim,
        transform: [{translateY: moveAnim}],
        display: keyboardVisible ? 'none' : 'flex',
      },
    ],
    [fadeAnim, moveAnim, keyboardVisible],
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

  const buttonStyle = useMemo(
    () => [
      styles.button,
      {backgroundColor: theme.colors.primary},
      isLoading && {opacity: 0.7},
    ],
    [theme, isLoading],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={containerStyle}>
        <Animated.View style={logoContainerStyle}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, {color: theme.colors.primary}]}>
            Takasla
          </Text>
        </Animated.View>

        <Animated.View style={formContainerStyle}>
          <View style={styles.inputContainer}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Hoş Geldiniz
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
              Hesabınıza giriş yapın
            </Text>

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

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, {color: theme.colors.text}]}>
                Şifre
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
                placeholder="Şifrenizi girin"
                placeholderTextColor={theme.colors.gray}
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={goToForgotPassword}>
                <Text style={{color: theme.colors.primary}}>
                  Şifremi Unuttum
                </Text>
              </TouchableOpacity>
            </View>

            {loginError ? (
              <Text
                style={{
                  color: theme.colors.danger,
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                {loginError}
              </Text>
            ) : null}

            <TouchableOpacity
              style={buttonStyle}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={{color: theme.colors.gray}}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={goToRegister}>
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

export default LoginScreen;
