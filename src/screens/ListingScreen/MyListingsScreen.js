import React, {useState, useEffect} from 'react';
import styles from '../../styles/listing/myListingsStyles';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {listingService, getListingImageUrl} from '../../services/api';
import {Button, Card} from '../../components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyListingsScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // İlanları getir
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listingService.getMyListings();
      setListings(data);
    } catch (error) {
      console.error('İlanlar alınırken hata:', error);
      setError('İlanlarınız yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Sayfa yüklendiğinde ilanları getir
  useEffect(() => {
    fetchListings();

    // Sayfa fokus olduğunda yeniden getir (navigasyondan dönüldüğünde)
    const unsubscribe = navigation.addListener('focus', () => {
      fetchListings();
    });

    return unsubscribe;
  }, [navigation]);

  // Yenileme işlemi
  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  // İlan silme işlemi
  const handleDeleteListing = (id, title) => {
    Alert.alert(
      'İlanı Sil',
      `"${title}" ilanını silmek istediğinize emin misiniz?`,
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await listingService.deleteListing(id);
              // Listeden kaldır
              setListings(listings.filter(listing => listing._id !== id));
              Alert.alert('Başarılı', 'İlan başarıyla silindi.');
            } catch (error) {
              Alert.alert('Hata', 'İlan silinirken bir hata oluştu.');
            }
          },
        },
      ],
    );
  };

  // İlan düzenleme işlemi
  const handleEditListing = listing => {
    navigation.navigate('EditListing', {listing});
  };

  // Boş ilan durumu
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="package-variant" size={60} color={theme.colors.gray} />
      <Text style={[styles.emptyText, {color: theme.colors.text}]}>
        Henüz ilanınız bulunmuyor
      </Text>
      <Text style={[styles.emptySubtext, {color: theme.colors.gray}]}>
        Kullanmadığınız eşyalarınızı takas etmek için hemen ilan ekleyin
      </Text>
      <Button
        title="Yeni İlan Ekle"
        onPress={() => navigation.navigate('CreateListing')}
        style={{marginTop: 20}}
      />
    </View>
  );

  // Filtreleme fonksiyonu
  const filterListings = data => {
    if (activeFilter === 'all') return data;
    return data.filter(item => item.status === activeFilter);
  };

  // Sıralama fonksiyonu
  const sortListings = data => {
    if (sortBy === 'newest') {
      return [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    } else {
      return [...data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    }
  };

  // Görüntülenecek ilanları işle (filtreleme ve sıralama)
  const processedListings = sortListings(filterListings(listings));

  // Filtrele ve Sırala barına tıklama işleyicileri
  const handleFilterChange = filter => {
    setActiveFilter(filter);
  };

  const handleSortChange = sort => {
    setSortBy(sort);
  };

  // Her bir ilan kartı
  const renderItem = ({item}) => (
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
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'active'
                    ? theme.colors.success + '20'
                    : item.status === 'inactive'
                    ? theme.colors.warning + '20'
                    : theme.colors.danger + '20',
              },
            ]}>
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    item.status === 'active'
                      ? theme.colors.success
                      : item.status === 'inactive'
                      ? theme.colors.warning
                      : theme.colors.danger,
                },
              ]}>
              {item.status === 'active'
                ? 'Aktif'
                : item.status === 'inactive'
                ? 'Pasif'
                : item.status === 'traded'
                ? 'Takas Edildi'
                : 'Silindi'}
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
            style={[styles.noImage, {backgroundColor: theme.colors.lightGray}]}>
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.editButton, {backgroundColor: theme.colors.secondary}]}
          onPress={() =>
            navigation.navigate('EditListing', {listingId: item._id})
          }>
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {backgroundColor: theme.colors.danger + '10'},
          ]}
          onPress={() => handleDeleteListing(item._id, item.title)}>
          <Icon name="delete" size={20} color={theme.colors.danger} />
          <Text style={[styles.actionButtonText, {color: theme.colors.danger}]}>
            Sil
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
            İlanlarım
          </Text>
          <Text style={[styles.headerSubtitle, {color: theme.colors.gray}]}>
            {listings.length} aktif ilan
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 6,
            },
          ]}
          onPress={() => navigation.navigate('CreateListing')}>
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Yeni İlan</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.filterContainer, {backgroundColor: theme.colors.white}]}>
        <View style={styles.filterTabsContainer}>
          <Text style={[styles.filterSectionTitle, {color: theme.colors.gray}]}>
            Durum:
          </Text>
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'all' && [
                  styles.activeTab,
                  {borderColor: theme.colors.primary},
                ],
              ]}
              onPress={() => handleFilterChange('all')}>
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      activeFilter === 'all'
                        ? theme.colors.primary
                        : theme.colors.gray,
                  },
                ]}>
                Tümü
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'active' && [
                  styles.activeTab,
                  {borderColor: theme.colors.primary},
                ],
              ]}
              onPress={() => handleFilterChange('active')}>
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      activeFilter === 'active'
                        ? theme.colors.primary
                        : theme.colors.gray,
                  },
                ]}>
                Aktif
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'inactive' && [
                  styles.activeTab,
                  {borderColor: theme.colors.primary},
                ],
              ]}
              onPress={() => handleFilterChange('inactive')}>
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      activeFilter === 'inactive'
                        ? theme.colors.primary
                        : theme.colors.gray,
                  },
                ]}>
                Pasif
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sortContainer}>
          <Text style={[styles.filterSectionTitle, {color: theme.colors.gray}]}>
            Sıralama:
          </Text>
          <View style={styles.sortOptionsRow}>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === 'newest' && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => handleSortChange('newest')}>
              <Icon
                name="sort-calendar-descending"
                size={16}
                color={
                  sortBy === 'newest' ? theme.colors.white : theme.colors.gray
                }
              />
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color:
                      sortBy === 'newest'
                        ? theme.colors.white
                        : theme.colors.gray,
                  },
                ]}>
                En Yeni
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === 'oldest' && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => handleSortChange('oldest')}>
              <Icon
                name="sort-calendar-ascending"
                size={16}
                color={
                  sortBy === 'oldest' ? theme.colors.white : theme.colors.gray
                }
              />
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color:
                      sortBy === 'oldest'
                        ? theme.colors.white
                        : theme.colors.gray,
                  },
                ]}>
                En Eski
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.colors.danger}]}>
            {error}
          </Text>
          <TouchableOpacity onPress={fetchListings}>
            <Text style={[styles.retryText, {color: theme.colors.primary}]}>
              Tekrar Dene
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, {color: theme.colors.text}]}>
            İlanlarınız yükleniyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={processedListings}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
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
    </View>
  );
};

export default MyListingsScreen;
