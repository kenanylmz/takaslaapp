import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';
import {Button, Card} from '../../components/atoms';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = () => {
  const {theme} = useTheme();
  const {
    user,
    updateProfile,
    uploadProfileImage,
    logout,
    isLoading,
    error,
  } = useUser();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCity(user.location?.city || '');
      setDistrict(user.location?.district || '');
    }
  }, [user]);

  // Profil resmini seçme
  const handleImagePicker = useCallback(() => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Hata', 'Resim seçilirken bir hata oluştu: ' + response.errorMessage);
        return;
      }

      try {
        setUpdateLoading(true);
        const success = await uploadProfileImage(response.assets[0]);
        
        if (success) {
          Alert.alert('Başarılı', 'Profil resminiz güncellendi');
        } else {
          setProfileError(error || 'Profil resmi yüklenirken bir sorun oluştu');
        }
      } catch (err) {
        setProfileError('Profil resmi yüklenirken beklenmeyen bir hata oluştu');
        console.error(err);
      } finally {
        setUpdateLoading(false);
      }
    });
  }, [uploadProfileImage, error]);

  // Profil bilgilerini güncelleme
  const handleUpdateProfile = useCallback(async () => {
    if (!name) {
      Alert.alert('Hata', 'İsim alanı boş olamaz');
      return;
    }

    setUpdateLoading(true);
    setProfileError('');

    try {
      const profileData = {
        name,
        phone,
        location: {
          city,
          district
        }
      };

      const success = await updateProfile(profileData);
      
      if (success) {
        setIsEditing(false);
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
      } else {
        setProfileError(error || 'Profil güncellenirken bir sorun oluştu');
      }
    } catch (err) {
      setProfileError('Profil güncellenirken beklenmeyen bir hata oluştu');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  }, [name, phone, city, district, updateProfile, error]);

  // Çıkış yapma
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  }, [logout]);

  // Profil resmi URL'i
  const getProfileImageUrl = useCallback(() => {
    if (!user || !user.profileImage) {
      return require('../../assets/default-avatar.png');
    }
    
    if (user.profileImage.startsWith('http')) {
      return { uri: user.profileImage };
    } else {
      return { uri: `http://10.0.2.2:3001/uploads/profiles/${user.profileImage}` };
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={getProfileImageUrl()}
            style={styles.profileImage}
          />
          {!updateLoading ? (
            <TouchableOpacity 
              style={[styles.editImageButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handleImagePicker}
            >
              <Text style={styles.editImageButtonText}>Değiştir</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>
        
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {user?.name || ''}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.gray }]}>
          {user?.email || ''}
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Profil Bilgileri</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={[styles.editButton, { color: theme.colors.primary }]}>
              {isEditing ? 'İptal' : 'Düzenle'}
            </Text>
          </TouchableOpacity>
        </View>

        {profileError ? (
          <Text style={{ color: theme.colors.danger, marginVertical: 10, textAlign: 'center' }}>
            {profileError}
          </Text>
        ) : null}

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>İsim</Text>
          {isEditing ? (
            <TextInput 
              value={name}
              onChangeText={setName}
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="İsminizi girin"
            />
          ) : (
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{name || 'Belirtilmemiş'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>Telefon</Text>
          {isEditing ? (
            <TextInput 
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Telefon numaranızı girin"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{phone || 'Belirtilmemiş'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>Şehir</Text>
          {isEditing ? (
            <TextInput 
              value={city}
              onChangeText={setCity}
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Şehrinizi girin"
            />
          ) : (
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{city || 'Belirtilmemiş'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.gray }]}>İlçe</Text>
          {isEditing ? (
            <TextInput 
              value={district}
              onChangeText={setDistrict}
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="İlçenizi girin"
            />
          ) : (
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{district || 'Belirtilmemiş'}</Text>
          )}
        </View>

        {isEditing && (
          <Button 
            title={updateLoading ? "Güncelleniyor..." : "Kaydet"} 
            onPress={handleUpdateProfile}
            style={styles.saveButton}
            disabled={updateLoading}
          />
        )}
      </Card>

      <Button 
        title="Çıkış Yap" 
        onPress={handleLogout}
        style={[styles.logoutButton, { backgroundColor: theme.colors.danger }]}
        textStyle={{ color: 'white' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  editImageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
  },
  infoCard: {
    padding: 15,
    marginVertical: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  saveButton: {
    marginTop: 10,
  },
  logoutButton: {
    marginBottom: 30,
  },
});

export default ProfileScreen; 