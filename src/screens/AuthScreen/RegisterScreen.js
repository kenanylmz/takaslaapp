import React, {useState, useEffect} from 'react';
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

const RegisterScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {login} = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);

    // Örnek kayıt işlemi - gerçek bir API bağlantısı eklenecek
    try {
      // Kayıt başarılı varsayıp kullanıcıyı otomatik giriş yaptırıyoruz
      const userData = {
        id: 1,
        name,
        email,
      };

      const success = await login(userData);
      if (!success) {
        Alert.alert('Hata', 'Kayıt yapılırken bir sorun oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Kayıt yapılırken bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={[styles.scrollView, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
          
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, {color: theme.colors.primary}]}>
              ← Geri
            </Text>
          </TouchableOpacity>
          
          <Animated.View 
            style={[
              styles.headingContainer, 
              {
                opacity: fadeAnim,
                transform: [{translateY: moveAnim}]
              }
            ]}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Kayıt Ol
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
              Takas dünyasına katılmak için hesap oluşturun
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
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, {color: theme.colors.text}]}>Ad Soyad</Text>
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
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

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
                  placeholder="Şifreniz (en az 6 karakter)"
                  placeholderTextColor={theme.colors.gray}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, {color: theme.colors.text}]}>Şifre Tekrar</Text>
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
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.primary},
                  isLoading && {opacity: 0.7},
                ]}
                onPress={handleRegister}
                disabled={isLoading}>
                <Text style={styles.buttonText}>
                  {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={{color: theme.colors.gray}}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.terms}>
              <Text style={[styles.termsText, {color: theme.colors.gray}]}>
                Kayıt olarak, {' '}
                <Text style={{color: theme.colors.primary}}>Kullanım Şartları</Text> ve {' '}
                <Text style={{color: theme.colors.primary}}>Gizlilik Politikası</Text>'nı
                kabul etmiş olursunuz.
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headingContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
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
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
    marginTop: 20,
  },
  terms: {
    marginTop: 30,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RegisterScreen; 