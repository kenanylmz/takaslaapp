import React, {useState, useRef} from 'react';
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

const CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Bolu',
  'Diğer',
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

  // Picker bileşeni
  const Picker = ({
    visible,
    title,
    options,
    selectedValue,
    onSelect,
    onClose,
  }) => {
    if (!visible) return null;

    return (
      <View
        style={[styles.pickerContainer, {backgroundColor: theme.colors.white}]}>
        <View style={styles.pickerHeader}>
          <Text style={[styles.pickerTitle, {color: theme.colors.text}]}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pickerOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pickerOption,
                selectedValue === option && {
                  backgroundColor: theme.colors.primary + '10',
                },
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}>
              <Text
                style={[
                  styles.pickerOptionText,
                  {
                    color:
                      selectedValue === option
                        ? theme.colors.primary
                        : theme.colors.text,
                  },
                ]}>
                {option}
              </Text>
              {selectedValue === option && (
                <Icon name="check" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          Yeni İlan Oluştur
        </Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Başlık */}
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
            onPress={() => setShowCategoryPicker(true)}>
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

        {/* Şehir */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: theme.colors.text}]}>Şehir</Text>
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
            onPress={() => setShowCityPicker(true)}>
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
            onPress={() => setShowConditionPicker(true)}>
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

        {/* Resimler */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: theme.colors.text}]}>
            Resimler (en fazla 5 adet)
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
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity
                style={[
                  styles.addImageButton,
                  {
                    borderColor: errors.images
                      ? theme.colors.danger
                      : theme.colors.border,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                onPress={handleSelectImages}>
                <Icon
                  name="camera-plus"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.addImageText, {color: theme.colors.primary}]}>
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
            style={styles.button}
            loading={loading}
          />
        </View>
      </ScrollView>

      {/* Picker modals */}
      <Picker
        visible={showCategoryPicker}
        title="Kategori Seçin"
        options={CATEGORIES}
        selectedValue={category}
        onSelect={value => {
          setCategory(value);
          setErrors({...errors, category: undefined});
        }}
        onClose={() => setShowCategoryPicker(false)}
      />

      <Picker
        visible={showCityPicker}
        title="Şehir Seçin"
        options={CITIES}
        selectedValue={city}
        onSelect={value => {
          setCity(value);
          setErrors({...errors, city: undefined});
        }}
        onClose={() => setShowCityPicker(false)}
      />

      <Picker
        visible={showConditionPicker}
        title="Ürün Durumu Seçin"
        options={CONDITIONS}
        selectedValue={condition}
        onSelect={value => {
          setCondition(value);
          setErrors({...errors, condition: undefined});
        }}
        onClose={() => setShowConditionPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imageItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
    position: 'relative',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addImageText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerOptions: {
    maxHeight: 300,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 16,
  },
});

export default CreateListingScreen;
