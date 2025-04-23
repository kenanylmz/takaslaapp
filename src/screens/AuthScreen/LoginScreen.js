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
  ActivityIndicator,
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
    setLoginError('');
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
    setLoginError('');
  }, []);

  // Giriş işleyicisi
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Email ve şifre alanlarını doldurun');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Geçerli bir email adresi girin');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const success = await login(email, password);

      if (success) {
        // Başarılı giriş durumunda uyarı göster
        Alert.alert(
          'Giriş Başarılı',
          'Hoş geldiniz! Ana sayfaya yönlendiriliyorsunuz.',
          [{text: 'Tamam'}],
        );
      } else {
        setLoginError(error || 'Giriş yaparken bir sorun oluştu');
      }
    } catch (err) {
      setLoginError('Giriş yaparken beklenmeyen bir hata oluştu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, error]);

  // Kayıt olma sayfasına yönlendirme
  const goToRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  // Şifremi unuttum sayfasına yönlendirme
  const goToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  // Klavye olaylarını dinle
  useEffect(() => {
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

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Giriş animasyonu
  useEffect(() => {
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

  // Stil değişkenlerini hesapla
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: theme.colors.background,
      },
    ],
    [theme],
  );

  const inputStyle = useMemo(
    () => [
      styles.input,
      {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.white,
        color: theme.colors.text,
      },
    ],
    [theme],
  );

  const buttonStyle = useMemo(
    () => [
      styles.button,
      {
        backgroundColor: isLoading
          ? theme.colors.lightGray
          : theme.colors.primary,
      },
    ],
    [theme, isLoading],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={containerStyle}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, {color: theme.colors.primary}]}>
            Takasla
          </Text>
        </View>

        <Animated.View
          style={[
            styles.formContainer,
            {opacity: fadeAnim, transform: [{translateY: moveAnim}]},
          ]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Giriş Yap
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
            Hesabınıza giriş yaparak takasa başlayın
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: theme.colors.text}]}>
              E-posta
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="E-posta adresiniz"
              placeholderTextColor={theme.colors.gray}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: theme.colors.text}]}>
              Şifre
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="Şifreniz"
              placeholderTextColor={theme.colors.gray}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
          </View>

          <View style={{width: '100%', marginTop: 20}}>
            {loginError ? (
              <Text
                style={{
                  color: theme.colors.danger,
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                {loginError}
              </Text>
            ) : null}

            <TouchableOpacity
              style={buttonStyle}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={theme.colors.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>Giriş Yap</Text>
              )}
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
