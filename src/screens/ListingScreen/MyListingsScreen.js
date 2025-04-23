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
              uri: getListingImageUrl(item.images[0]),
            }}
            style={styles.image}
            resizeMode="cover"
            defaultSource={require('../../assets/default-listing.png')}
            onError={e =>
              console.log(
                'Resim yükleme hatası:',
                item.images[0],
                e.nativeEvent.error,
              )
            }
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

export default MyListingsScreen;
