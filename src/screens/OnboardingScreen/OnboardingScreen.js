import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../../contexts/ThemeContext';

const {width, height} = Dimensions.get('window');

// Onboarding içeriği
const onboardingData = [
  {
    id: '1',
    title: 'Kullanmadığın Eşyalarını Değerlendir',
    description: 'Artık kullanmadığın eşyalarını Takasla ile değerlendirerek yeni eşyalara sahip ol.',
    image: require('../../assets/onboarding1.jpg'),
  },
  {
    id: '2',
    title: 'Güvenli Takas İmkanı',
    description: 'Takasla platformu ile güvenli ve kolay bir şekilde eşyalarını takas edebilirsin.',
    image: require('../../assets/onboarding2.jpg'),
  },
  {
    id: '3',
    title: 'Çevreci Yaklaşım',
    description: 'Takas yaparak hem ekonomik tasarruf sağla hem de çevreye katkıda bulun.',
    image: require('../../assets/onboarding3.jpg'),
  },
];

const OnboardingScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  // Onboarding tamamlandı olarak işaretleme
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Onboarding durumu kaydedilemedi:', error);
    }
  };

  // Bir sonraki slide'a geçiş
  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      completeOnboarding();
    }
  };

  // Her bir slide'ı render etme
  const renderItem = ({item}) => {
    return (
      <View style={[styles.slide, {backgroundColor: theme.colors.background}]}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {item.title}
          </Text>
          <Text style={[styles.description, {color: theme.colors.gray}]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  // Pagination göstergeleri
  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItems => {
          setCurrentIndex(viewableItems.viewableItems[0]?.index || 0);
        }}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        ref={slidesRef}
      />

      <Paginator />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.skipButton, {borderColor: theme.colors.primary}]}
          onPress={completeOnboarding}>
          <Text style={{color: theme.colors.primary}}>Geç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, {backgroundColor: theme.colors.primary}]}
          onPress={goToNextSlide}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Başla' : 'İleri'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    paddingTop: 50,
    paddingBottom: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    marginBottom: 30,
    borderRadius: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  skipButton: {
    padding: 15,
    borderWidth:.7,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 