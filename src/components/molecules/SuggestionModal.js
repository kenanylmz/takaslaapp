import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SuggestionModal = ({visible, onClose, suggestions, loading, error}) => {
  const {theme} = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  // Verileri log etme
  useEffect(() => {
    console.log('Modal içindeki suggestions:', suggestions);
    console.log('Modal loading durumu:', loading);
    console.log('Modal error durumu:', error);
  }, [suggestions, loading, error]);

  // Önerilerin geçerli olup olmadığını kontrol et
  const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

  // Fade animasyonu
  useEffect(() => {
    if (!loading && hasSuggestions) {
      // Yükleme bittiğinde ve öneriler varsa, fade animasyonu başlat
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Değilse, fade'i sıfırla
      fadeAnim.setValue(0);
    }
  }, [loading, hasSuggestions, fadeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Icon
                name="lightbulb-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.title, {color: theme.colors.text}]}>
                Takas Önerileri
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[styles.loadingText, {color: theme.colors.text}]}>
                    Yapay zeka takas önerilerini hazırlıyor...
                  </Text>
                </View>

                <Image
                  source={require('../../assets/ai_suggestion.png')}
                  style={styles.loadingImage}
                  resizeMode="contain"
                />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Icon
                  name="alert-circle-outline"
                  size={48}
                  color={theme.colors.danger}
                />
                <Text style={[styles.errorText, {color: theme.colors.danger}]}>
                  {error}
                </Text>
              </View>
            ) : hasSuggestions ? (
              <Animated.View style={{flex: 1, opacity: fadeAnim}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.subtitle, {color: theme.colors.gray}]}>
                    Yapay zeka ürününüz için şu takas seçeneklerini öneriyor:
                  </Text>

                  {suggestions.map((suggestion, index) => (
                    <View
                      key={index}
                      style={[
                        styles.suggestionItem,
                        {
                          backgroundColor: theme.colors.white,
                          borderLeftColor: theme.colors.primary,
                          borderLeftWidth: 4,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.suggestionTitle,
                          {color: theme.colors.primary},
                        ]}>
                        {suggestion.name}
                      </Text>
                      <Text
                        style={[
                          styles.suggestionReason,
                          {color: theme.colors.text},
                        ]}>
                        {suggestion.reason}
                      </Text>
                    </View>
                  ))}

                  <Text style={[styles.disclaimer, {color: theme.colors.gray}]}>
                    Not: Bu öneriler yapay zeka tarafından ürün bilgilerinize
                    göre oluşturulmuştur.
                  </Text>
                </ScrollView>
              </Animated.View>
            ) : (
              <View style={styles.emptyContainer}>
                <Icon
                  name="emoticon-sad-outline"
                  size={48}
                  color={theme.colors.gray}
                />
                <Text style={[styles.emptyText, {color: theme.colors.text}]}>
                  Üzgünüz, şu anda bir öneri bulunamadı.
                </Text>
                <Text style={[styles.emptySubtext, {color: theme.colors.gray}]}>
                  Daha fazla ürün detayı ekleyerek tekrar deneyin.
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={onClose}>
            <Text style={styles.buttonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  suggestionItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  suggestionReason: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  loadingContent: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingImage: {
    width: '90%', // Karta sığdırmak için küçültüldü
    height: 140,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default SuggestionModal;
