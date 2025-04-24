import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {suggestionsService} from '../../services/api';

const {width} = Dimensions.get('window');

const SuggestionResultScreen = ({route, navigation}) => {
  const {theme} = useTheme();
  const {listingData} = route.params || {};

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Önerileri al
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        console.log('Öneri ekranı: Veri alınıyor...', listingData);

        if (!listingData) {
          throw new Error('Ürün bilgisi bulunamadı');
        }

        const result = await suggestionsService.getNewListingSuggestions(
          listingData,
        );
        console.log('Öneri ekranı: Alınan veriler:', result);

        if (Array.isArray(result) && result.length > 0) {
          setSuggestions(result);
        } else {
          throw new Error('Öneri bulunamadı');
        }
      } catch (err) {
        console.error('Öneri hatası:', err);
        setError(err.message || 'Takas önerileri alınamadı');
      } finally {
        setLoading(false);

        // Animasyonları başlat
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    fetchSuggestions();
  }, [listingData]);

  // Loading gösterimi
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
            Takas Önerileri
          </Text>
          <View style={{width: 40}} />
        </View>

        <View style={styles.loadingContainer}>
          <Image
            source={require('../../assets/ai_suggestion.png')}
            style={styles.loadingImage}
            resizeMode="contain"
          />
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loader}
          />
          <Text style={[styles.loadingText, {color: theme.colors.text}]}>
            Yapay zeka takas önerilerinizi hazırlıyor...
          </Text>
          <Text style={[styles.loadingSubText, {color: theme.colors.gray}]}>
            Bu işlem biraz zaman alabilir
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hata gösterimi
  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
            Takas Önerileri
          </Text>
          <View style={{width: 40}} />
        </View>

        <View style={styles.errorContainer}>
          <Icon
            name="alert-circle-outline"
            size={80}
            color={theme.colors.danger}
          />
          <Text style={[styles.errorTitle, {color: theme.colors.danger}]}>
            Oops! Bir sorun oluştu
          </Text>
          <Text style={[styles.errorMessage, {color: theme.colors.text}]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          Takas Önerileri
        </Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <Animated.View
          style={[
            styles.contentContainer,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          <View style={styles.productInfoBox}>
            <Icon
              name="swap-horizontal"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={[styles.productInfoText, {color: theme.colors.text}]}>
              <Text style={{fontWeight: 'bold'}}>{listingData?.title}</Text>{' '}
              için yapay zeka takas önerileriniz:
            </Text>
          </View>

          {suggestions.map((suggestion, index) => (
            <Animated.View
              key={index}
              style={[
                styles.suggestionCard,
                {
                  backgroundColor: theme.colors.white,
                  borderLeftColor: theme.colors.primary,
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardNumberContainer}>
                  <Text style={styles.cardNumber}>{index + 1}</Text>
                </View>
                <Text style={[styles.cardTitle, {color: theme.colors.primary}]}>
                  {suggestion.name}
                </Text>
              </View>
              <View style={styles.separator} />
              <Text
                style={[styles.cardDescription, {color: theme.colors.text}]}>
                {suggestion.reason}
              </Text>
            </Animated.View>
          ))}

          <View style={styles.disclaimerContainer}>
            <Icon
              name="information-outline"
              size={16}
              color={theme.colors.gray}
            />
            <Text style={[styles.disclaimer, {color: theme.colors.gray}]}>
              Bu öneriler yapay zeka tarafından ürün bilgilerinize göre
              oluşturulmuştur.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  productInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  productInfoText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  suggestionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(74, 128, 240, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A80F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 6,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingImage: {
    width: width * 0.7,
    height: width * 0.5,
    marginBottom: 20,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuggestionResultScreen;
