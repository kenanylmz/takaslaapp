import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

// Örnek veri
const DUMMY_TRADES = [
  {
    id: '1',
    title: 'iPhone 12 Pro',
    description: 'Takas teklifini değerlendiriyor',
    image: 'https://via.placeholder.com/150',
    owner: 'Ali',
    status: 'pending',
    date: '2024-07-15',
  },
  {
    id: '2',
    title: 'PlayStation 5',
    description: 'Takas teklifinizi kabul etti',
    image: 'https://via.placeholder.com/150',
    owner: 'Ayşe',
    status: 'accepted',
    date: '2024-07-10',
  },
  {
    id: '3',
    title: 'Sehpa',
    description: 'Takas teklifinizi reddetti',
    image: 'https://via.placeholder.com/150',
    owner: 'Mehmet',
    status: 'rejected',
    date: '2024-07-05',
  },
  {
    id: '4',
    title: 'Bisiklet',
    description: 'Takas tamamlandı',
    image: 'https://via.placeholder.com/150',
    owner: 'Zeynep',
    status: 'completed',
    date: '2024-06-30',
  },
];

// Kullanıcının takas teklifi yapabileceği ürünler
const MY_ITEMS = [
  {
    id: '1',
    title: 'Samsung Galaxy S22',
    description: 'Telefonum, mükemmel durumda',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    title: 'Kindle Paperwhite',
    description: 'E-kitap okuyucu, az kullanılmış',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    title: 'Nintendo Switch',
    description: 'Oyun konsolu, kutulu',
    image: 'https://via.placeholder.com/150',
  },
];

const TradeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState('active');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [message, setMessage] = useState('');

  const handleOpenTradeModal = trade => {
    setSelectedTrade({
      ...trade,
      selectedItemId: null,
    });
    setMessage('');
    setModalVisible(true);
  };

  const handleSendOffer = () => {
    if (!selectedTrade.selectedItemId) {
      alert('Lütfen bir ürün seçin');
      return;
    }

    // API çağrısı yapılacak
    console.log(
      `Takas teklifi gönderildi: Ürün ${selectedTrade.id} için ${selectedTrade.selectedItemId} ile teklif`,
    );
    alert('Takas teklifiniz gönderildi!');
    setModalVisible(false);
  };

  const renderTradeItem = ({item}) => {
    let statusColor;
    let statusText;

    switch (item.status) {
      case 'pending':
        statusColor = theme.colors.warning;
        statusText = 'Beklemede';
        break;
      case 'accepted':
        statusColor = theme.colors.success;
        statusText = 'Kabul Edildi';
        break;
      case 'rejected':
        statusColor = theme.colors.danger;
        statusText = 'Reddedildi';
        break;
      case 'completed':
        statusColor = theme.colors.info;
        statusText = 'Tamamlandı';
        break;
      default:
        statusColor = theme.colors.gray;
        statusText = 'Bilinmiyor';
    }

    return (
      <TouchableOpacity
        style={[styles.card, {backgroundColor: theme.colors.white}]}
        onPress={() => handleOpenTradeModal(item)}>
        <Image source={{uri: item.image}} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
            {item.title}
          </Text>
          <Text
            style={[styles.cardDescription, {color: theme.colors.gray}]}
            numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={{color: theme.colors.gray}}>{item.date}</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: statusColor + '20', borderColor: statusColor},
              ]}>
              <Text style={{color: statusColor}}>{statusText}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMyItem = item => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.myItemCard,
        {
          backgroundColor: theme.colors.white,
          borderColor:
            selectedTrade?.selectedItemId === item.id
              ? theme.colors.primary
              : theme.colors.border,
        },
      ]}
      onPress={() => {
        setSelectedTrade({
          ...selectedTrade,
          selectedItemId: item.id,
        });
      }}>
      <Image source={{uri: item.image}} style={styles.myItemImage} />
      <View style={styles.myItemContent}>
        <Text style={[styles.myItemTitle, {color: theme.colors.text}]}>
          {item.title}
        </Text>
        <Text
          style={[styles.myItemDescription, {color: theme.colors.gray}]}
          numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <View
        style={[
          styles.radioOuter,
          {
            borderColor:
              selectedTrade?.selectedItemId === item.id
                ? theme.colors.primary
                : theme.colors.border,
          },
        ]}>
        {selectedTrade?.selectedItemId === item.id && (
          <View
            style={[
              styles.radioInner,
              {backgroundColor: theme.colors.primary},
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredTrades = DUMMY_TRADES.filter(trade => {
    if (activeTab === 'active') {
      return ['pending', 'accepted'].includes(trade.status);
    } else if (activeTab === 'history') {
      return ['completed', 'rejected'].includes(trade.status);
    }
    return true;
  });

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Takaslarım
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('active')}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'active'
                    ? theme.colors.primary
                    : theme.colors.gray,
              },
            ]}>
            Aktif Takaslar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'history' && {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'history'
                    ? theme.colors.primary
                    : theme.colors.gray,
              },
            ]}>
            Geçmiş
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTrades}
        renderItem={renderTradeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{color: theme.colors.gray, textAlign: 'center'}}>
              {activeTab === 'active'
                ? 'Aktif takas teklifiniz bulunmuyor.'
                : 'Geçmiş takas teklifiniz bulunmuyor.'}
            </Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
              Takas Teklifi
            </Text>

            {selectedTrade && (
              <>
                <View style={styles.selectedItemContainer}>
                  <Image
                    source={{uri: selectedTrade.image}}
                    style={styles.selectedItemImage}
                  />
                  <View style={styles.selectedItemDetails}>
                    <Text
                      style={[
                        styles.selectedItemTitle,
                        {color: theme.colors.text},
                      ]}>
                      {selectedTrade.title}
                    </Text>
                    <Text
                      style={[
                        styles.selectedItemOwner,
                        {color: theme.colors.gray},
                      ]}>
                      {selectedTrade.owner} adlı kullanıcıya ait
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.sectionTitle,
                    {color: theme.colors.text, marginTop: 20},
                  ]}>
                  Teklif etmek istediğiniz ürün:
                </Text>
                <ScrollView style={styles.myItemsContainer}>
                  {MY_ITEMS.map(item => renderMyItem(item))}
                </ScrollView>

                <Text
                  style={[
                    styles.sectionTitle,
                    {color: theme.colors.text, marginTop: 15},
                  ]}>
                  Ek mesaj:
                </Text>
                <TextInput
                  style={[
                    styles.messageInput,
                    {
                      backgroundColor: theme.colors.white,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="Mesajınız (opsiyonel)"
                  placeholderTextColor={theme.colors.gray}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      {backgroundColor: theme.colors.gray},
                    ]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      {backgroundColor: theme.colors.primary},
                    ]}
                    onPress={handleSendOffer}>
                    <Text style={styles.modalButtonText}>Teklif Gönder</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  selectedItemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  selectedItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedItemOwner: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  myItemsContainer: {
    maxHeight: 200,
  },
  myItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  myItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  myItemContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  myItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  myItemDescription: {
    fontSize: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TradeScreen; 