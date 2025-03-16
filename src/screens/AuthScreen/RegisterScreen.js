import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
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
        Alert.alert('Hata', 'Kayıt sırasında bir sorun oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Kayıt sırasında bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Hesap Oluştur
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
          Takasla'ya üye olun
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
            placeholder="Adınız Soyadınız"
            placeholderTextColor={theme.colors.gray}
            value={name}
            onChangeText={setName}
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
      </View>
    </ScrollView>
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

export default RegisterScreen; 