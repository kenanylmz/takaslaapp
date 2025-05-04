import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';
import {
  listingService,
  getListingImageUrl,
  getProfileImageUrl,
} from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card, Button} from '../../components/atoms';

const {width} = Dimensions.get('window');

const ListingDetailScreen = ({route, navigation}) => {
  const {listingId} = route.params;
  const {theme} = useTheme();
  const {user} = useUser();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // İlan detayını getir
  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listingService.getListingById(listingId);
        setListing(data);
        
        // API'dan gelen verileri kontrol edip log'a yazdıralım (geliştirme aşamasında)
        console.log('Listing data:', data);
        console.log('User data:', data.user);
      } catch (error) {
        console.error('İlan detayı alınırken hata:', error);
        setError('İlan detayı yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetail();
  }, [listingId]);

  // İlan sahibi ile iletişim
  const handleContact = () => {
    // İlan sahibinin telefonu varsa ara, yoksa mesaj bölümüne yönlendir
    if (listing.user.phone) {
      Linking.openURL(`tel:${listing.user.phone}`);
    } else {
      // Burada mesaj bölümüne yönlendirme yapılabilir
      Alert.alert(
        'Bilgi',
        'Kullanıcı mesaj bölümünden iletişime geçebilirsiniz.',
      );
      // navigation.navigate('Chat', { userId: listing.user._id });
    }
  };

  // Geri butonu
  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, {color: theme.colors.text}]}>
          İlan detayı yükleniyor...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.errorContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Icon
          name="alert-circle-outline"
          size={60}
          color={theme.colors.danger}
        />
        <Text style={[styles.errorTitle, {color: theme.colors.danger}]}>
          Bir hata oluştu!
        </Text>
        <Text style={[styles.errorText, {color: theme.colors.text}]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleGoBack}>
          <Text style={styles.errorButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!listing) {
    return (
      <View
        style={[
          styles.errorContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Icon
          name="information-outline"
          size={60}
          color={theme.colors.warning}
        />
        <Text style={[styles.errorTitle, {color: theme.colors.warning}]}>
          İlan bulunamadı!
        </Text>
        <Text style={[styles.errorText, {color: theme.colors.text}]}>
          Aradığınız ilan mevcut değil veya kaldırılmış olabilir.
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleGoBack}>
          <Text style={styles.errorButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Geri butonu */}
      <TouchableOpacity
        style={[
          styles.backButton,
          {backgroundColor: theme.colors.white + '95'},
        ]}
        onPress={handleGoBack}>
        <Icon name="arrow-left" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resim galerisi */}
        <View style={styles.imageContainer}>
          {listing.images && listing.images.length > 0 ? (
            <>
              <Image
                source={{
                  uri: getListingImageUrl(listing.images[activeImageIndex]),
                }}
                style={styles.mainImage}
                resizeMode="cover"
              />
              {/* Küçük resimler */}
              {listing.images.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.thumbnailScroll}>
                  {listing.images.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setActiveImageIndex(index)}
                      style={[
                        styles.thumbnailContainer,
                        activeImageIndex === index && {
                          borderColor: theme.colors.primary,
                          borderWidth: 2,
                        },
                      ]}>
                      <Image
                        source={{uri: getListingImageUrl(image)}}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </>
          ) : (
            <View
              style={[
                styles.noImageContainer,
                {backgroundColor: theme.colors.lightGray},
              ]}>
              <Icon name="image-off" size={60} color={theme.colors.gray} />
              <Text style={{color: theme.colors.gray, marginTop: 10}}>
                Resim Yok
              </Text>
            </View>
          )}
        </View>

        {/* İlan bilgileri */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {listing.title}
          </Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {backgroundColor: theme.colors.primary + '20'},
              ]}>
              <Text style={[styles.badgeText, {color: theme.colors.primary}]}>
                {listing.category}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {backgroundColor: theme.colors.secondary + '20'},
              ]}>
              <Text style={[styles.badgeText, {color: theme.colors.secondary}]}>
                {listing.condition}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Icon name="map-marker" size={20} color={theme.colors.gray} />
            <Text style={[styles.locationText, {color: theme.colors.gray}]}>
              {listing.city}
            </Text>
          </View>

          <View
            style={[styles.separator, {backgroundColor: theme.colors.border}]}
          />

          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Ürün Açıklaması
          </Text>
          <Text style={[styles.description, {color: theme.colors.text}]}>
            {listing.description}
          </Text>

          <View
            style={[styles.separator, {backgroundColor: theme.colors.border}]}
          />

          {/* İlan sahibi bilgileri */}
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            İlan Sahibi
          </Text>
          <View style={styles.userContainer}>
            <Image
              source={
                listing.user?.profileImage
                  ? {uri: getProfileImageUrl(listing.user.profileImage)}
                  : require('../../assets/default-avatar.png')
              }
              style={styles.userImage}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, {color: theme.colors.text}]}>
                {listing.user?.name || 'Kullanıcı'}
              </Text>
              <Text style={[styles.userJoined, {color: theme.colors.gray}]}>
                {listing.user?.createdAt ? 
                  new Date(listing.user.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                  }) + ' tarihinden beri üye' : 
                  'Üyelik bilgisi yok'}
              </Text>
            </View>
          </View>

          {/* İlan detayları */}
          <View
            style={[styles.separator, {backgroundColor: theme.colors.border}]}
          />

          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            İlan Detayları
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, {color: theme.colors.gray}]}>
              İlan Tarihi:
            </Text>
            <Text style={[styles.detailValue, {color: theme.colors.text}]}>
              {new Date(listing.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, {color: theme.colors.gray}]}>
              İlan No:
            </Text>
            <Text style={[styles.detailValue, {color: theme.colors.text}]}>
              {listing._id.substring(listing._id.length - 8).toUpperCase()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* İletişim butonu */}
      {user && user._id !== listing.user?._id && (
        <View
          style={[
            styles.contactContainer,
            {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
            },
          ]}>
          <Button
            title="İletişime Geç"
            onPress={handleContact}
            style={styles.contactButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  thumbnailScroll: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userJoined: {
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  contactButton: {
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListingDetailScreen;
