import React, {useState, useEffect, useRef} from 'react';
import styles from '../../styles/listing/exploreStyles';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';
import {
  listingService,
  getListingImageUrl,
  getProfileImageUrl,
} from '../../services/api';
import {Card} from '../../components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Kategori listesi
const CATEGORIES = [
  'Tümü',
  'Elektronik',
  'Giyim',
  'Mobilya',
  'Kitaplar',
  'Spor',
  'Oyuncak & Hobi',
  'Ev Eşyaları',
  'Diğer',
];

// Şehir listesi - Türkiye'nin 81 ili
const CITIES = [
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

const ExploreScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {user} = useUser();

  // State tanımlamaları
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // Arama parametreleri
  const searchParams = {
    category: activeCategory === 'Tümü' ? '' : activeCategory,
    search: searchQuery,
    city: selectedCity,
    page: currentPage,
    limit: 10,
  };

  // İlanları getir
  const fetchListings = async (params = searchParams, resetPage = false) => {
    try {
      setLoading(true);
      setError(null);

      // Sayfa sıfırlanacaksa
      if (resetPage) {
        params.page = 1;
        setCurrentPage(1);
      }

      const response = await listingService.searchListings(params);

      // Eğer kullanıcı oturum açtıysa ve backend kullanıcı ilanlarını filtrelemezse
      // client-side olarak da filtreleme yapalım
      if (user && response.listings) {
        const filteredListings = response.listings.filter(
          listing => listing.user._id !== user._id,
        );
        setListings(filteredListings);
      } else {
        setListings(response.listings);
      }

      setTotalPages(response.totalPages);
      setTotalListings(response.total);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('İlanlar alınırken hata:', error);
      setError('İlanlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // İlk yükleme ve sayfa değişikliklerinde ilanları getir
  useEffect(() => {
    fetchListings();

    // Sayfa fokus olduğunda yeniden getir
    const unsubscribe = navigation.addListener('focus', () => {
      fetchListings();
    });

    return unsubscribe;
  }, [navigation, currentPage]);

  // Yenileme işlemi
  const onRefresh = () => {
    setRefreshing(true);
    fetchListings(searchParams, true);
  };

  // Kategori değiştiğinde ilanları yeniden getir
  const handleCategoryChange = category => {
    setActiveCategory(category);
    fetchListings(
      {...searchParams, category: category === 'Tümü' ? '' : category},
      true,
    );
  };

  // Arama işlemi
  const handleSearch = () => {
    fetchListings({...searchParams, search: searchQuery}, true);
  };

  // Filtreleri uygula
  const applyFilters = () => {
    fetchListings({...searchParams, city: selectedCity}, true);
    setShowFilterModal(false);
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSelectedCity('');
    fetchListings({...searchParams, city: ''}, true);
    setShowFilterModal(false);
  };

  // Sayfa değiştirme
  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // İlan detayına git
  const handleListingPress = listing => {
    navigation.navigate('ListingDetail', {listingId: listing._id});
  };

  // Boş ilan durumu
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="magnify-off" size={60} color={theme.colors.gray} />
      <Text style={[styles.emptyText, {color: theme.colors.text}]}>
        İlan Bulunamadı
      </Text>
      <Text style={[styles.emptySubtext, {color: theme.colors.gray}]}>
        Arama kriterlerinize uygun ilan bulunamadı. Lütfen farklı anahtar
        kelimeler veya kategoriler deneyin.
      </Text>
    </View>
  );

  // Her bir ilan kartı
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleListingPress(item)}>
      <Card
        style={[styles.card, {backgroundColor: theme.colors.white}]}
        shadowLevel="medium">
        <View style={styles.cardHeader}>
          <Text
            style={[styles.cardTitle, {color: theme.colors.text}]}
            numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                {backgroundColor: theme.colors.primary + '20'},
              ]}>
              <Text style={[styles.badgeText, {color: theme.colors.primary}]}>
                {item.category}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={true}>
              {item.images.map((image, index) => (
                <Image
                  key={index}
                  source={{
                    uri: getListingImageUrl(image),
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.noImage,
                {backgroundColor: theme.colors.lightGray},
              ]}>
              <Text style={{color: theme.colors.gray}}>Resim yok</Text>
            </View>
          )}
          {item.images && item.images.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text
                style={
                  styles.imageCountText
                }>{`${item.images.length} Resim`}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[styles.infoText, {color: theme.colors.text}]}
            numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={16} color={theme.colors.gray} />
              <Text style={[styles.detailText, {color: theme.colors.gray}]}>
                {item.city}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="tag" size={16} color={theme.colors.gray} />
              <Text style={[styles.detailText, {color: theme.colors.gray}]}>
                {item.condition}
              </Text>
            </View>
          </View>

          {item.user && (
            <View
              style={[styles.userRow, {borderTopColor: theme.colors.border}]}>
              <Image
                source={
                  item.user.profileImage
                    ? {uri: getProfileImageUrl(item.user.profileImage)}
                    : require('../../assets/default-avatar.png')
                }
                style={styles.userImage}
              />
              <Text style={[styles.userName, {color: theme.colors.text}]}>
                {item.user.name}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  // Sayfalama bileşeni
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, {borderColor: theme.colors.border}]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <Text
            style={[
              styles.paginationText,
              {
                color:
                  currentPage === 1 ? theme.colors.gray : theme.colors.text,
              },
            ]}>
            ◀
          </Text>
        </TouchableOpacity>

        {/* Sayfa numaraları */}
        {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
          // Başlangıç sayfasını hesapla
          let startPage = Math.max(1, currentPage - 2);
          if (currentPage > totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
          }
          const page = startPage + i;
          if (page > totalPages) return null;

          return (
            <TouchableOpacity
              key={page}
              style={[
                styles.paginationButton,
                {borderColor: theme.colors.border},
                currentPage === page && [
                  styles.paginationButtonActive,
                  {backgroundColor: theme.colors.primary},
                ],
              ]}
              onPress={() => handlePageChange(page)}>
              <Text
                style={[
                  styles.paginationText,
                  {color: theme.colors.text},
                  currentPage === page && [
                    styles.paginationTextActive,
                    {color: theme.colors.white},
                  ],
                ]}>
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.paginationButton, {borderColor: theme.colors.border}]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <Text
            style={[
              styles.paginationText,
              {
                color:
                  currentPage === totalPages
                    ? theme.colors.gray
                    : theme.colors.text,
              },
            ]}>
            ▶
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Başlık */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
            Keşfet
          </Text>
          <Text style={[styles.headerSubtitle, {color: theme.colors.gray}]}>
            Diğer kullanıcıların ilanlarını keşfedin
          </Text>
        </View>
      </View>

      {/* Arama kutusu */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, {color: theme.colors.text}]}
          placeholder="İlan ara..."
          placeholderTextColor={theme.colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="magnify" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Kategoriler */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                {
                  borderColor:
                    activeCategory === category
                      ? theme.colors.primary
                      : theme.colors.border,
                  backgroundColor:
                    activeCategory === category
                      ? theme.colors.primary + '10'
                      : 'transparent',
                },
                activeCategory === category && styles.activeTab,
              ]}
              onPress={() => handleCategoryChange(category)}>
              <Text
                style={[
                  styles.categoryTabText,
                  {
                    color:
                      activeCategory === category
                        ? theme.colors.primary
                        : theme.colors.text,
                  },
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtre ve sıralama alanı */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, {borderColor: theme.colors.border}]}
          onPress={() => setShowFilterModal(true)}>
          <Icon name="filter-variant" size={18} color={theme.colors.text} />
          <Text style={[styles.filterText, {color: theme.colors.text}]}>
            Filtrele
          </Text>
        </TouchableOpacity>

        <Text style={[styles.resultsText, {color: theme.colors.gray}]}>
          {totalListings} sonuç bulundu
        </Text>
      </View>

      {/* Hata Gösterimi */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.colors.danger}]}>
            {error}
          </Text>
          <TouchableOpacity onPress={() => fetchListings(searchParams, true)}>
            <Text style={[styles.retryText, {color: theme.colors.primary}]}>
              Tekrar Dene
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* İlanlar */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, {color: theme.colors.text}]}>
            İlanlar yükleniyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderPagination}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* Filtre Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.filterModal}>
          <View
            style={[
              styles.filterModalContent,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.filterModalTitle, {color: theme.colors.text}]}>
              Filtreleme Seçenekleri
            </Text>

            <View style={styles.filterModalSection}>
              <Text
                style={[
                  styles.filterModalSectionTitle,
                  {color: theme.colors.text},
                ]}>
                Şehir
              </Text>

              <View style={styles.filterModalSection}>
                <TouchableOpacity
                  style={[
                    styles.cityPickerButton,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.white,
                    },
                  ]}
                  onPress={() => {
                    Alert.alert(
                      'Şehir Seçimi',
                      'Lütfen bir şehir seçin',
                      CITIES.map(city => ({
                        text: city,
                        onPress: () => setSelectedCity(city),
                      })).concat([
                        {
                          text: 'İptal',
                          style: 'cancel',
                        },
                      ]),
                    );
                  }}>
                  <Text
                    style={[
                      styles.cityPickerText,
                      {
                        color: selectedCity
                          ? theme.colors.text
                          : theme.colors.gray,
                      },
                    ]}>
                    {selectedCity || 'Şehir Seçin'}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={24}
                    color={theme.colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.clearButton, {borderColor: theme.colors.border}]}
                onPress={clearFilters}>
                <Text style={[styles.buttonText, {color: theme.colors.text}]}>
                  Temizle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  {backgroundColor: theme.colors.primary},
                ]}
                onPress={applyFilters}>
                <Text style={[styles.buttonText, {color: theme.colors.white}]}>
                  Uygula
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExploreScreen;
