import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {listingService} from '../../services/api';
import {Button, Card} from '../../components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyListingsScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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

  // Her bir ilan kartı
  const renderItem = ({item}) => (
    <Card style={styles.card}>
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
          <Image
            source={{
              uri: `http://10.192.189.239:3001/uploads/listings/${item.images[0]}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[styles.noImage, {backgroundColor: theme.colors.border}]}>
            <Icon name="image-off" size={40} color={theme.colors.gray} />
            <Text style={{color: theme.colors.gray, marginTop: 5}}>
              Resim Yok
            </Text>
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

      <View style={[styles.filterBar, {backgroundColor: theme.colors.white}]}>
        <TouchableOpacity
          style={[styles.filterButton, {borderColor: theme.colors.border}]}
          onPress={() => {
            /* filter işlevi */
          }}>
          <Icon name="filter-variant" size={16} color={theme.colors.gray} />
          <Text style={{color: theme.colors.gray, marginLeft: 4}}>
            Filtrele
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, {borderColor: theme.colors.border}]}
          onPress={() => {
            /* sort işlevi */
          }}>
          <Icon name="sort" size={16} color={theme.colors.gray} />
          <Text style={{color: theme.colors.gray, marginLeft: 4}}>Sırala</Text>
        </TouchableOpacity>
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
          data={listings}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  filterBar: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    paddingTop: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 8,
  },
  retryText: {
    fontWeight: 'bold',
  },
});

export default MyListingsScreen;
