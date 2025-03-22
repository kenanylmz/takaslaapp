import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

// Örnek veri
const DUMMY_ITEMS = [
  {
    id: '1',
    title: 'iPhone 12 Pro',
    description: 'Çok az kullanılmış, kutulu',
    image: 'https://via.placeholder.com/150',
    owner: 'Ali',
    location: 'İstanbul',
    category: 'Elektronik',
  },
  {
    id: '2',
    title: 'PlayStation 5',
    description: 'Sıfır, kutulu',
    image: 'https://via.placeholder.com/150',
    owner: 'Ayşe',
    location: 'Ankara',
    category: 'Oyun & Eğlence',
  },
  {
    id: '3',
    title: 'Sehpa',
    description: 'Ahşap vintage sehpa',
    image: 'https://via.placeholder.com/150',
    owner: 'Mehmet',
    location: 'İzmir',
    category: 'Ev Eşyası',
  },
  {
    id: '4',
    title: 'Bisiklet',
    description: 'Dağ bisikleti, 21 vites',
    image: 'https://via.placeholder.com/150',
    owner: 'Zeynep',
    location: 'Antalya',
    category: 'Spor',
  },
  {
    id: '5',
    title: 'Kitap Seti',
    description: '10 adet kitap, çoğu yeni',
    image: 'https://via.placeholder.com/150',
    owner: 'Can',
    location: 'Bursa',
    category: 'Kitap',
  },
];

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(DUMMY_ITEMS);
  const [filteredItems, setFilteredItems] = useState(DUMMY_ITEMS);

  useEffect(() => {
    // Basit bir arama filtresi
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: theme.colors.white}]}
      onPress={() => navigation.navigate('ItemDetail', {item})}>
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
          <Text style={{color: theme.colors.primary}}>{item.category}</Text>
          <Text style={{color: theme.colors.gray}}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Takasla</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.iconButton}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text>🔍</Text>
        <TextInput
          style={[styles.searchInput, {color: theme.colors.text}]}
          placeholder="Ne takas etmek istersiniz?"
          placeholderTextColor={theme.colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{color: theme.colors.gray, textAlign: 'center'}}>
              Eşleşen bir ürün bulunamadı.
            </Text>
          </View>
        }
      />
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
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
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default HomeScreen; 