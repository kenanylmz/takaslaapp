import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';

const LoginScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {login} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        Takasla'ya Hoş Geldiniz
      </Text>
      <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
        Hesabınıza giriş yapın
      </Text>

      <View style={styles.inputContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default LoginScreen; 