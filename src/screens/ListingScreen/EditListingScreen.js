import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useTheme} from '../../contexts/ThemeContext';
import {Button, Input} from '../../components/atoms';
import {listingService} from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Kategori seçenekleri
const categoryOptions = [
  'Elektronik',
  'Giyim',
  'Ev Eşyaları',
  'Kitaplar',
  'Spor',
  'Oyuncak & Hobi',
  'Mobilya',
  'Diğer',
];

// Şehir seçenekleri - Türkiye'nin 81 ili
const cityOptions = [
  'Adana',
  'Adıyaman',
  'Afyonkarahisar',
  'Ağrı',
  'Amasya',
  'Ankara',
  'Antalya',
  'Artvin',
  'Aydın',
  'Balıkesir',
  'Bilecik',
  'Bingöl',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Çanakkale',
  'Çankırı',
  'Çorum',
  'Denizli',
  'Diyarbakır',
  'Edirne',
  'Elazığ',
  'Erzincan',
  'Erzurum',
  'Eskişehir',
  'Gaziantep',
  'Giresun',
  'Gümüşhane',
  'Hakkari',
  'Hatay',
  'Isparta',
  'Mersin',
  'İstanbul',
  'İzmir',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kırklareli',
  'Kırşehir',
  'Kocaeli',
  'Konya',
  'Kütahya',
  'Malatya',
  'Manisa',
  'Kahramanmaraş',
  'Mardin',
  'Muğla',
  'Muş',
  'Nevşehir',
  'Niğde',
  'Ordu',
  'Rize',
  'Sakarya',
  'Samsun',
  'Siirt',
  'Sinop',
  'Sivas',
  'Tekirdağ',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Şanlıurfa',
  'Uşak',
  'Van',
  'Yozgat',
  'Zonguldak',
  'Aksaray',
  'Bayburt',
  'Karaman',
  'Kırıkkale',
  'Batman',
  'Şırnak',
  'Bartın',
  'Ardahan',
  'Iğdır',
  'Yalova',
  'Karabük',
  'Kilis',
  'Osmaniye',
  'Düzce',
];

// Ürün durumu seçenekleri
const conditionOptions = [
  'Yeni',
  'Yeni Gibi',
  'İyi',
  'Az Kullanılmış',
  'Yıpranmış',
];

const EditListingScreen = ({route, navigation}) => {
  const {theme} = useTheme();
  const {listingId} = route.params;

  // Form state'leri
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // UI state'leri
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerCurrentValue, setPickerCurrentValue] = useState('');
  const [imageActionVisible, setImageActionVisible] = useState(false);

  // İlan verilerini getir
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsFetching(true);
        const listing = await listingService.getListingById(listingId);

        // Form verilerini doldur
        setTitle(listing.title);
        setCategory(listing.category);
        setDescription(listing.description);
        setCity(listing.city);
        setCondition(listing.condition);

        // Mevcut resimleri ayarla
        if (listing.images && listing.images.length > 0) {
          const formattedImages = listing.images.map(img => ({
            uri: `http://192.168.64.217:3001/uploads/listings/${img}`,
            name: img,
            isExisting: true,
          }));
          setImages(formattedImages);
          setOriginalImages(formattedImages);
        }
      } catch (error) {
        console.error('İlan verileri alınırken hata:', error);
        setError('İlan bilgileri yüklenemedi. Lütfen tekrar deneyin.');
        Alert.alert(
          'Hata',
          'İlan bilgileri yüklenemedi. Lütfen tekrar deneyin.',
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // Form validasyonu
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen bir başlık girin');
      return false;
    }
    if (!category) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Hata', 'Lütfen bir açıklama girin');
      return false;
    }
    if (!city) {
      Alert.alert('Hata', 'Lütfen bir şehir seçin');
      return false;
    }
    if (!condition) {
      Alert.alert('Hata', 'Lütfen ürün durumunu seçin');
      return false;
    }
    return true;
  };

  // Galeriden resim seçme
  const selectImagesFromGallery = async () => {
    setImageActionVisible(false);

    const options = {
      mediaType: 'photo',
      selectionLimit: 5 - images.length, // Max 5 resim
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Hata', 'Resim seçilirken bir hata oluştu');
        return;
      }

      if (result.assets) {
        const newImagesArray = [...images];
        const newImagesForUpload = [...newImages];

        result.assets.forEach(asset => {
          // Yeni resim ekle
          newImagesArray.push({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
            isExisting: false,
          });

          // Yükleme için ayrıca ekle
          newImagesForUpload.push({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          });
        });

        setImages(newImagesArray);
        setNewImages(newImagesForUpload);
      }
    } catch (error) {
      console.error('Resim seçme hatası:', error);
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu');
    }
  };

  // Kamera ile resim çekme
  const takePicture = async () => {
    setImageActionVisible(false);

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      cameraType: 'back',
    };

    try {
      const result = await launchCamera(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Hata', 'Resim çekilirken bir hata oluştu');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Ana images dizisine ekle
        setImages([
          ...images,
          {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
            isExisting: false,
          },
        ]);

        // Yükleme için ayrıca ekle
        setNewImages([
          ...newImages,
          {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          },
        ]);
      }
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', 'Resim çekilirken bir hata oluştu');
    }
  };

  // Resim seçme modalını göster
  const handleSelectImages = () => {
    if (images.length >= 5) {
      Alert.alert('Uyarı', 'En fazla 5 resim ekleyebilirsiniz');
      return;
    }
    setImageActionVisible(true);
  };

  // Resim silme
  const handleRemoveImage = async index => {
    const imageToRemove = images[index];

    // Sunucudaki mevcut resimse API ile silme işlemi yap
    if (imageToRemove.isExisting) {
      try {
        await listingService.deleteImage(listingId, imageToRemove.name);

        // Başarılı silme sonrası state'i güncelle
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);

        // originalImages'dan da kaldır
        const updatedOriginalImages = originalImages.filter(
          img => img.name !== imageToRemove.name,
        );
        setOriginalImages(updatedOriginalImages);
      } catch (error) {
        console.error('Resim silinirken hata:', error);
        Alert.alert(
          'Hata',
          'Resim silinirken bir sorun oluştu. Lütfen tekrar deneyin.',
        );
      }
    } else {
      // Yeni eklenen resimse sadece state'ten kaldır
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);

      // newImages'dan da kaldır
      const updatedNewImages = [...newImages];
      const indexInNewImages = newImages.findIndex(
        img => img.uri === imageToRemove.uri,
      );
      if (indexInNewImages !== -1) {
        updatedNewImages.splice(indexInNewImages, 1);
        setNewImages(updatedNewImages);
      }
    }
  };

  // İlanı güncelle
  const handleUpdateListing = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const listingData = {
        title,
        category,
        description,
        city,
        condition,
        newImages,
      };

      await listingService.updateListing(listingId, listingData);

      setIsLoading(false);
      Alert.alert('Başarılı', 'İlan başarıyla güncellendi', [
        {text: 'Tamam', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('İlan güncellenirken hata:', error);
      setError('İlan güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
      Alert.alert(
        'Hata',
        'İlan güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.',
      );
    }
  };

  // Picker modalını aç
  const openPicker = (type, title, options, currentValue) => {
    setPickerType(type);
    setPickerTitle(title);
    setPickerOptions(options);
    setPickerCurrentValue(currentValue);
    setPickerVisible(true);
  };

  // Seçim değerini güncelle
  const handleSelect = value => {
    setPickerVisible(false);

    switch (pickerType) {
      case 'category':
        setCategory(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'condition':
        setCondition(value);
        break;
      default:
        break;
    }
  };

  // Picker bileşeni
  const Picker = ({
    visible,
    title,
    options,
    selectedValue,
    onSelect,
    onClose,
  }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.pickerContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, {color: theme.colors.text}]}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={{color: theme.colors.danger}}>Kapat</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedValue === item && {
                      backgroundColor: theme.colors.primary + '20',
                    },
                  ]}
                  onPress={() => onSelect(item)}>
                  <Text
                    style={[
                      styles.optionText,
                      {color: theme.colors.text},
                      selectedValue === item && {
                        color: theme.colors.primary,
                        fontWeight: 'bold',
                      },
                    ]}>
                    {item}
                  </Text>
                  {selectedValue === item && (
                    <Text style={{color: theme.colors.primary}}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  if (isFetching) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{color: theme.colors.text, marginTop: 10}}>
          İlan bilgileri yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Geri butonu ve başlık */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          İlan Düzenle
        </Text>
        <View style={{width: 24}} /> {/* Balance the header */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* İlerleme göstergesi */}
          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  {backgroundColor: theme.colors.primary},
                ]}
              />
              <Text style={{color: theme.colors.primary, fontSize: 12}}>
                Detaylar
              </Text>
            </View>
            <View
              style={[
                styles.progressLine,
                {backgroundColor: theme.colors.primary},
              ]}
            />
            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  {backgroundColor: theme.colors.primary},
                ]}
              />
              <Text style={{color: theme.colors.primary, fontSize: 12}}>
                Konum
              </Text>
            </View>
            <View
              style={[
                styles.progressLine,
                {backgroundColor: theme.colors.primary},
              ]}
            />
            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  {backgroundColor: theme.colors.primary},
                ]}
              />
              <Text style={{color: theme.colors.primary, fontSize: 12}}>
                Görseller
              </Text>
            </View>
          </View>

          {/* Form alanlar */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              İlan Bilgileri
            </Text>

            {/* İlan Başlığı */}
            <Input
              label="İlan Başlığı"
              placeholder="İlan başlığını girin"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />

            {/* Kategori - stilleri iyileştirelim */}
            <Text style={[styles.label, {color: theme.colors.text}]}>
              Kategori
            </Text>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.white,
                },
              ]}
              onPress={() =>
                openPicker(
                  'category',
                  'Kategori Seçin',
                  categoryOptions,
                  category,
                )
              }>
              <Text
                style={{
                  color: category ? theme.colors.text : theme.colors.gray,
                }}>
                {category || 'Kategori seçin'}
              </Text>
              <Icon name="chevron-down" size={20} color={theme.colors.gray} />
            </TouchableOpacity>

            {/* Açıklama */}
            <Input
              label="Açıklama"
              placeholder="İlanınızın detaylarını yazın"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{marginTop: 10}}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Konum ve Durum
            </Text>

            {/* Şehir */}
            <Text style={[styles.label, {color: theme.colors.text}]}>
              Şehir
            </Text>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.white,
                },
              ]}
              onPress={() =>
                openPicker('city', 'Şehir Seçin', cityOptions, city)
              }>
              <Text
                style={{
                  color: city ? theme.colors.text : theme.colors.gray,
                }}>
                {city || 'Şehir seçin'}
              </Text>
              <Icon name="chevron-down" size={20} color={theme.colors.gray} />
            </TouchableOpacity>

            {/* Ürün Durumu */}
            <Text
              style={[styles.label, {color: theme.colors.text, marginTop: 10}]}>
              Ürün Durumu
            </Text>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.white,
                },
              ]}
              onPress={() =>
                openPicker(
                  'condition',
                  'Ürün Durumu Seçin',
                  conditionOptions,
                  condition,
                )
              }>
              <Text
                style={{
                  color: condition ? theme.colors.text : theme.colors.gray,
                }}>
                {condition || 'Ürün durumu seçin'}
              </Text>
              <Icon name="chevron-down" size={20} color={theme.colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Resimler */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              İlan Görselleri
            </Text>

            <Text style={[styles.imageSubtitle, {color: theme.colors.gray}]}>
              En az 1, en fazla 5 resim yükleyebilirsiniz. İlk resim ana görsel
              olarak kullanılacaktır.
            </Text>

            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{uri: image.uri}} style={styles.image} />
                  <TouchableOpacity
                    style={[
                      styles.removeButton,
                      {backgroundColor: theme.colors.danger},
                    ]}
                    onPress={() => handleRemoveImage(index)}>
                    <Text style={{color: 'white', fontSize: 16}}>×</Text>
                  </TouchableOpacity>
                  {index === 0 && (
                    <View
                      style={[
                        styles.mainImageBadge,
                        {backgroundColor: theme.colors.success},
                      ]}>
                      <Text style={{color: 'white', fontSize: 10}}>
                        Ana Görsel
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              {images.length < 5 && (
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  onPress={handleSelectImages}>
                  <Icon
                    name="image-plus"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={{color: theme.colors.primary, marginTop: 4}}>
                    Resim Ekle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hata Mesajı */}
          {error ? (
            <View
              style={[
                styles.errorContainer,
                {backgroundColor: theme.colors.danger + '15'},
              ]}>
              <Icon name="alert-circle" size={20} color={theme.colors.danger} />
              <Text style={[styles.errorText, {color: theme.colors.danger}]}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Butonlar */}
          <View style={styles.buttonContainer}>
            <Button
              title="İptal"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={{flex: 1, marginRight: 10}}
            />
            <Button
              title={isLoading ? 'Güncelleniyor...' : 'Güncelle'}
              onPress={handleUpdateListing}
              loading={isLoading}
              disabled={isLoading}
              style={{flex: 2}}
            />
          </View>
        </View>
      </ScrollView>

      {/* Picker Modal */}
      <Picker
        visible={pickerVisible}
        title={pickerTitle}
        options={pickerOptions}
        selectedValue={pickerCurrentValue}
        onSelect={handleSelect}
        onClose={() => setPickerVisible(false)}
      />

      {/* Resim Seçme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageActionVisible}
        onRequestClose={() => setImageActionVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.actionContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.actionTitle, {color: theme.colors.text}]}>
              Resim Ekle
            </Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={takePicture}>
              <Text style={styles.actionButtonText}>Kamera ile Çek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: theme.colors.secondary},
              ]}
              onPress={selectImagesFromGallery}>
              <Text style={styles.actionButtonText}>Galeriden Seç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: theme.colors.lightGray},
              ]}
              onPress={() => setImageActionVisible(false)}>
              <Text style={{color: theme.colors.text}}>İptal</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  progressLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 5,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imageSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  pickerButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    margin: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    height: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    fontSize: 16,
  },
  actionContainer: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default EditListingScreen;
