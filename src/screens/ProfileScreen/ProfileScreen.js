import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Input, Button, Card} from '../../components/atoms';

const ProfileScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {user, logout, updateProfile, uploadProfileImage} = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  // Profil düzenleme state'leri
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || 'default-avatar.png',
  );

  // Şifre değiştirme state'leri
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Lokasyon state'leri
  const [city, setCity] = useState(user?.location?.city || '');
  const [district, setDistrict] = useState(user?.location?.district || '');

  // Profil bilgilerini güncelleme
  const handleUpdateProfile = async () => {
    if (!name) {
      Alert.alert('Hata', 'İsim alanı boş olamaz');
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateProfile({
        name,
        phone,
      });

      if (success) {
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
        setEditModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Profil fotoğrafı seçme
  const handleSelectImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) return;

      if (result.assets && result.assets[0].uri) {
        setIsLoading(true);

        const imageFile = {
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          name: result.assets[0].fileName || 'photo.jpg',
        };

        const success = await uploadProfileImage(imageFile);

        if (success) {
          // API'den dönen yeni profil resmini setProfileImage ile güncelle
          // user.profileImage kullanmak yerine API yanıtındaki URL'yi kullan
          console.log('Yeni profil resmi:', user.profileImage);
          setProfileImage(user.profileImage);

          // Ekstra kontrol: Resim URL'si değişti mi?
          console.log(
            'Profil resmi state güncellemesi:',
            profileImage,
            ' -> ',
            user.profileImage,
          );

          // Resmi tekrar yüklemek için bir önbellek kırma tekniği
          const timestamp = new Date().getTime();
          setProfileImage(`${user.profileImage}?t=${timestamp}`);

          Alert.alert('Başarılı', 'Profil fotoğrafınız güncellendi');
        }
      }
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      Alert.alert('Hata', 'Profil fotoğrafı yüklenirken bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Şifre değiştirme
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    try {
      // Gerçek uygulamada API entegrasyonu yapılacak
      Alert.alert('Başarılı', 'Şifreniz güncellendi');
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Hata', 'Şifre güncellenirken bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Lokasyon güncelleme
  const handleUpdateLocation = async () => {
    if (!city || !district) {
      Alert.alert('Hata', 'Şehir ve ilçe alanları boş olamaz');
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateProfile({
        location: {
          city,
          district,
        },
      });

      if (success) {
        Alert.alert('Başarılı', 'Konum bilgileriniz güncellendi');
        setLocationModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Hata', 'Konum güncellenirken bir sorun oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış yapma
  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profil Üst Kısmı */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                profileImage && profileImage !== 'default-avatar.png'
                  ? {
                      uri: `http://10.192.189.239:3001/uploads/profiles/${profileImage}`,
                      // Önbellek sorununu önlemek için
                      cache: 'reload',
                    }
                  : require('../../assets/default-avatar.png')
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={[
                styles.editImageButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={handleSelectImage}>
              <Icon name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, {color: theme.colors.text}]}>
            {user?.name || 'Kullanıcı'}
          </Text>
          <Text style={[styles.userEmail, {color: theme.colors.gray}]}>
            {user?.email || 'email@example.com'}
          </Text>

          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>
                {user?.rating || '0.0'}
              </Text>
              <Text style={[styles.statLabel, {color: theme.colors.gray}]}>
                Puan
              </Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Icon
                    key={star}
                    name={
                      star <= Math.round(user?.rating || 0)
                        ? 'star'
                        : 'star-outline'
                    }
                    size={16}
                    color={theme.colors.warning}
                  />
                ))}
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>
                {user?.ratingCount || '0'}
              </Text>
              <Text style={[styles.statLabel, {color: theme.colors.gray}]}>
                Değerlendirme
              </Text>
            </View>
          </View>
        </View>

        {/* Profil Menü */}
        <Card style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setEditModalVisible(true)}>
            <Icon name="account-edit" size={24} color={theme.colors.primary} />
            <Text style={[styles.menuItemText, {color: theme.colors.text}]}>
              Profil Bilgilerimi Düzenle
            </Text>
            <Icon name="chevron-right" size={24} color={theme.colors.gray} />
          </TouchableOpacity>

          <View
            style={[
              styles.menuSeparator,
              {backgroundColor: theme.colors.border},
            ]}
          />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setPasswordModalVisible(true)}>
            <Icon name="lock" size={24} color={theme.colors.primary} />
            <Text style={[styles.menuItemText, {color: theme.colors.text}]}>
              Şifremi Değiştir
            </Text>
            <Icon name="chevron-right" size={24} color={theme.colors.gray} />
          </TouchableOpacity>

          <View
            style={[
              styles.menuSeparator,
              {backgroundColor: theme.colors.border},
            ]}
          />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLocationModalVisible(true)}>
            <Icon name="map-marker" size={24} color={theme.colors.primary} />
            <Text style={[styles.menuItemText, {color: theme.colors.text}]}>
              Konum Bilgilerimi Düzenle
            </Text>
            <Icon name="chevron-right" size={24} color={theme.colors.gray} />
          </TouchableOpacity>
        </Card>

        {/* İlanlarım Kısmı */}
        <Card style={styles.listingsCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
              İlanlarım
            </Text>
            <TouchableOpacity>
              <Text style={{color: theme.colors.primary}}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyListings}>
            <Icon name="tag-outline" size={48} color={theme.colors.gray} />
            <Text
              style={[styles.emptyListingsText, {color: theme.colors.gray}]}>
              Henüz ilan eklemediniz
            </Text>
            <Button
              title="İlan Ekle"
              variant="primary"
              size="small"
              style={{marginTop: 12}}
            />
          </View>
        </Card>

        {/* Çıkış Yap Butonu */}
        <Button
          title="Çıkış Yap"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>

      {/* Profil Düzenleme Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
              Profil Bilgilerini Düzenle
            </Text>

            <Input
              label="Ad Soyad"
              value={name}
              onChangeText={setName}
              placeholder="Adınız ve soyadınız"
            />

            <Input
              label="Telefon"
              value={phone}
              onChangeText={setPhone}
              placeholder="5XX XXX XX XX"
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <Button
                title="İptal"
                variant="outline"
                style={{flex: 1, marginRight: 8}}
                onPress={() => setEditModalVisible(false)}
              />
              <Button
                title="Kaydet"
                style={{flex: 1, marginLeft: 8}}
                onPress={handleUpdateProfile}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Şifre Değiştirme Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
              Şifremi Değiştir
            </Text>

            <Input
              label="Mevcut Şifre"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mevcut şifreniz"
              secureTextEntry
            />

            <Input
              label="Yeni Şifre"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Yeni şifreniz"
              secureTextEntry
            />

            <Input
              label="Yeni Şifre Tekrar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni şifrenizi tekrar girin"
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <Button
                title="İptal"
                variant="outline"
                style={{flex: 1, marginRight: 8}}
                onPress={() => setPasswordModalVisible(false)}
              />
              <Button
                title="Değiştir"
                style={{flex: 1, marginLeft: 8}}
                onPress={handleChangePassword}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Konum Düzenleme Modal */}
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
              Konum Bilgilerini Düzenle
            </Text>

            <Input
              label="Şehir"
              value={city}
              onChangeText={setCity}
              placeholder="Şehir"
            />

            <Input
              label="İlçe"
              value={district}
              onChangeText={setDistrict}
              placeholder="İlçe"
            />

            <View style={styles.modalButtons}>
              <Button
                title="İptal"
                variant="outline"
                style={{flex: 1, marginRight: 8}}
                onPress={() => setLocationModalVisible(false)}
              />
              <Button
                title="Kaydet"
                style={{flex: 1, marginLeft: 8}}
                onPress={handleUpdateLocation}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 16,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 16,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 24,
  },
  ratingStars: {
    flexDirection: 'row',
    marginTop: 4,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  menuSeparator: {
    height: 1,
    marginHorizontal: 16,
  },
  listingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyListings: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyListingsText: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default ProfileScreen;
