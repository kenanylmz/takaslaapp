import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';
import styles from '../../styles/auth/registerStyles';

const RegisterScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {register, error} = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Animasyon değerleri
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const moveAnim = useMemo(() => new Animated.Value(50), []);

  // Input değişim işleyicilerini optimize et
  const handleNameChange = useCallback(text => {
    setName(text);
  }, []);

  const handleEmailChange = useCallback(text => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
  }, []);

  const handleConfirmPasswordChange = useCallback(text => {
    setConfirmPassword(text);
  }, []);

  // Kayıt işleyicisini düzenleyelim
  const handleRegister = useCallback(async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);
    setRegisterError('');

    try {
      const success = await register(name, email, password);

      if (success) {
        // Kayıt başarılı olduğunda alert göster
        Alert.alert(
          'Kayıt Başarılı',
          'Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      } else {
        setRegisterError(error || 'Kayıt olurken bir sorun oluştu');
      }
    } catch (err) {
      setRegisterError('Kayıt olurken beklenmeyen bir hata oluştu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, confirmPassword, register, error, navigation]);

  // Giriş sayfasına gitme işleyicisi
  const goToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

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
      <ScrollView
        style={containerStyle}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={formContainerStyle}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.title, {color: theme.colors.text}]}>
            Hesap Oluştur
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
            Takasla platformuna katılın
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, {color: theme.colors.text}]}>
                Ad Soyad
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
                placeholder="Adınız ve soyadınız"
                placeholderTextColor={theme.colors.gray}
                autoCapitalize="words"
                value={name}
                onChangeText={handleNameChange}
              />
            </View>

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
                placeholder="E-posta adresiniz"
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
                placeholder="Şifreniz"
                placeholderTextColor={theme.colors.gray}
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, {color: theme.colors.text}]}>
                Şifre Tekrar
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
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={theme.colors.gray}
                secureTextEntry
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
              />
            </View>

            <TouchableOpacity
              style={buttonStyle}
              onPress={handleRegister}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>

            {registerError ? (
              <Text
                style={{
                  color: theme.colors.danger,
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                {registerError}
              </Text>
            ) : null}

            <Text style={[styles.termsText, {color: theme.colors.gray}]}>
              Kayıt olarak, Takasla'nın{' '}
              <Text style={{color: theme.colors.primary}}>
                Kullanım Şartları
              </Text>{' '}
              ve{' '}
              <Text style={{color: theme.colors.primary}}>
                Gizlilik Politikası
              </Text>
              'nı kabul etmiş olursunuz.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={{color: theme.colors.gray}}>
              Zaten bir hesabınız var mı?{' '}
            </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
