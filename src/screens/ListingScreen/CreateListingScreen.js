import React, {useState, useRef} from 'react';
import styles from '../../styles/listing/createListingStyles';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useTheme} from '../../contexts/ThemeContext';
import {Input, Button} from '../../components/atoms';
import {listingService} from '../../services/api';

const CATEGORIES = [
  'Elektronik',
  'Giyim',
  'Mobilya',
  'Kitap',
  'Spor',
  'Oyuncak',
  'Diğer',
];

const CONDITIONS = ['Yeni', 'Yeni Gibi', 'İyi', 'Az Kullanılmış', 'Yıpranmış'];

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

const CreateListingScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const scrollViewRef = useRef();

  // Picker bileşeni için değişkenler
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerCurrentValue, setPickerCurrentValue] = useState('');

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = 'Başlık zorunludur';
    if (!category) newErrors.category = 'Kategori zorunludur';
    if (!description) newErrors.description = 'Açıklama zorunludur';
    if (!city) newErrors.city = 'Şehir zorunludur';
    if (!condition) newErrors.condition = 'Ürün durumu zorunludur';
    if (images.length === 0) newErrors.images = 'En az bir resim ekleyin';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resim seçme
  const handleSelectImages = async () => {
    Alert.alert('Resim Ekle', 'Resim eklemek için bir yöntem seçin', [
      {
        text: 'Galeri',
        onPress: () => selectImagesFromGallery(),
      },
      {
        text: 'Kamera',
        onPress: () => takePicture(),
      },
      {
        text: 'İptal',
        style: 'cancel',
      },
    ]);
  };

  const selectImagesFromGallery = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 5 - images.length,
      quality: 0.7,
    };

    try {
      const result = await launchImageLibrary(options);

      if (!result.didCancel && result.assets) {
        const newImages = [...images];

        result.assets.forEach(asset => {
          newImages.push({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName || `image-${Date.now()}.jpg`,
          });
        });

        setImages(newImages);
        setErrors({...errors, images: undefined});
      }
    } catch (error) {
      console.error('Resim seçme hatası:', error);
      Alert.alert('Hata', 'Resimler seçilirken bir sorun oluştu.');
    }
  };

  const takePicture = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: true,
    };

    try {
      const result = await launchCamera(options);

      if (!result.didCancel && result.assets) {
        const newImages = [...images];

        result.assets.forEach(asset => {
          newImages.push({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName || `image-${Date.now()}.jpg`,
          });
        });

        setImages(newImages);
        setErrors({...errors, images: undefined});
      }
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekilirken bir sorun oluştu.');
    }
  };

  // Resim silme
  const handleRemoveImage = index => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // İlan oluşturma
  const handleCreateListing = async () => {
    if (!validateForm()) {
      // Hata varsa ScrollView'u en üste kaydır
      scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
      return;
    }

    setLoading(true);

    try {
      const listingData = {
        title,
        category,
        description,
        city,
        condition,
        images,
      };

      await listingService.createListing(listingData);

      Alert.alert('Başarılı', 'İlanınız başarıyla oluşturuldu.', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('İlan oluşturma hatası:', error);
      Alert.alert(
        'Hata',
        'İlan oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.',
      );
    } finally {
      setLoading(false);
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
        setErrors({...errors, category: undefined});
        break;
      case 'city':
        setCity(value);
        setErrors({...errors, city: undefined});
        break;
      case 'condition':
        setCondition(value);
        setErrors({...errors, condition: undefined});
        break;
      default:
        break;
    }
  };

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
          Yeni İlan Oluştur
        </Text>
        <View style={{width: 24}} /> {/* Balance the header */}
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
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

          {/* Form Bölüm 1: İlan Bilgileri */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              İlan Bilgileri
            </Text>

            {/* İlan Başlığı */}
            <Input
              label="İlan Başlığı"
              placeholder="Başlık girin (ör. iPhone 12 Pro)"
              value={title}
              onChangeText={text => {
                setTitle(text);
                setErrors({...errors, title: undefined});
              }}
              error={errors.title}
            />

            {/* Kategori */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Kategori
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  {
                    borderColor: errors.category
                      ? theme.colors.danger
                      : theme.colors.border,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                onPress={() =>
                  openPicker('category', 'Kategori Seçin', CATEGORIES, category)
                }>
                <Text
                  style={{
                    color: category ? theme.colors.text : theme.colors.gray,
                  }}>
                  {category || 'Kategori seçin'}
                </Text>
                <Icon name="chevron-down" size={20} color={theme.colors.gray} />
              </TouchableOpacity>
              {errors.category && (
                <Text style={[styles.errorText, {color: theme.colors.danger}]}>
                  {errors.category}
                </Text>
              )}
            </View>

            {/* Açıklama */}
            <Input
              label="Açıklama"
              placeholder="Ürün hakkında detaylı bilgi verin"
              value={description}
              onChangeText={text => {
                setDescription(text);
                setErrors({...errors, description: undefined});
              }}
              multiline={true}
              numberOfLines={4}
              error={errors.description}
            />
          </View>

          {/* Form Bölüm 2: Konum ve Durum */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Konum ve Durum
            </Text>

            {/* Şehir */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Şehir
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  {
                    borderColor: errors.city
                      ? theme.colors.danger
                      : theme.colors.border,
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
              {errors.city && (
                <Text style={[styles.errorText, {color: theme.colors.danger}]}>
                  {errors.city}
                </Text>
              )}
            </View>

            {/* Ürün Durumu */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Ürün Durumu
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  {
                    borderColor: errors.condition
                      ? theme.colors.danger
                      : theme.colors.border,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                onPress={() =>
                  openPicker('condition', 'Durum Seçin', CONDITIONS, condition)
                }>
                <Text
                  style={{
                    color: condition ? theme.colors.text : theme.colors.gray,
                  }}>
                  {condition || 'Durum seçin'}
                </Text>
                <Icon name="chevron-down" size={20} color={theme.colors.gray} />
              </TouchableOpacity>
              {errors.condition && (
                <Text style={[styles.errorText, {color: theme.colors.danger}]}>
                  {errors.condition}
                </Text>
              )}
            </View>
          </View>

          {/* Form Bölüm 3: Resimler */}
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
                <View key={index} style={styles.imageItem}>
                  <Image
                    source={{uri: image.uri}}
                    style={styles.imageThumbnail}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={[
                      styles.removeImageButton,
                      {backgroundColor: theme.colors.danger},
                    ]}
                    onPress={() => handleRemoveImage(index)}>
                    <Icon name="close" size={16} color="white" />
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
                      borderColor: errors.images
                        ? theme.colors.danger
                        : theme.colors.primary,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  onPress={handleSelectImages}>
                  <Icon
                    name="image-plus"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.addImageText,
                      {color: theme.colors.primary},
                    ]}>
                    {images.length === 0 ? 'Resim Ekle' : 'Daha Ekle'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {errors.images && (
              <Text style={[styles.errorText, {color: theme.colors.danger}]}>
                {errors.images}
              </Text>
            )}
          </View>

          {/* Hata varsa genel bir hata göstergesi ekleyelim */}
          {Object.keys(errors).length > 0 && (
            <View
              style={[
                styles.errorContainer,
                {backgroundColor: theme.colors.danger + '15'},
              ]}>
              <Icon name="alert-circle" size={20} color={theme.colors.danger} />
              <Text
                style={[styles.generalErrorText, {color: theme.colors.danger}]}>
                Lütfen formdaki hataları düzeltin ve tekrar deneyin.
              </Text>
            </View>
          )}

          {/* Butonlar */}
          <View style={styles.buttonContainer}>
            <Button
              title="İptal"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.button}
            />
            <Button
              title={loading ? 'Oluşturuluyor...' : 'İlanı Oluştur'}
              onPress={handleCreateListing}
              style={[styles.button, {flex: 2}]}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>

      {/* Picker modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.pickerContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, {color: theme.colors.text}]}>
                {pickerTitle}
              </Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={{color: theme.colors.danger}}>Kapat</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={pickerOptions}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    pickerCurrentValue === item && {
                      backgroundColor: theme.colors.primary + '20',
                    },
                  ]}
                  onPress={() => handleSelect(item)}>
                  <Text
                    style={[
                      styles.optionText,
                      {color: theme.colors.text},
                      pickerCurrentValue === item && {
                        color: theme.colors.primary,
                        fontWeight: 'bold',
                      },
                    ]}>
                    {item}
                  </Text>
                  {pickerCurrentValue === item && (
                    <Icon name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateListingScreen;
