import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';

const ProfileScreen = () => {
  const {theme, toggleTheme, isDarkMode} = useTheme();
  const {user, logout} = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, {color: theme.colors.text}]}>
          {user?.name || 'Kullanıcı'}
        </Text>
        <Text style={[styles.email, {color: theme.colors.gray}]}>
          {user?.email || 'kullanici@mail.com'}
        </Text>
      </View>

      <View
        style={[
          styles.statsContainer,
          {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
        ]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: theme.colors.primary}]}>
            12
          </Text>
          <Text style={[styles.statLabel, {color: theme.colors.gray}]}>
            Ürünler
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: theme.colors.primary}]}>
            8
          </Text>
          <Text style={[styles.statLabel, {color: theme.colors.gray}]}>
            Takaslar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: theme.colors.primary}]}>
            4.8
          </Text>
          <Text style={[styles.statLabel, {color: theme.colors.gray}]}>
            Puan
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Hesap
        </Text>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
          ]}>
          <Text style={{color: theme.colors.text}}>Profilimi Düzenle</Text>
          <Text>➡️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
          ]}>
          <Text style={{color: theme.colors.text}}>Ürünlerim</Text>
          <Text>➡️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
          ]}>
          <Text style={{color: theme.colors.text}}>Takas Geçmişim</Text>
          <Text>➡️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Ayarlar
        </Text>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
          ]}
          onPress={toggleTheme}>
          <Text style={{color: theme.colors.text}}>
            {isDarkMode ? 'Açık Tema' : 'Koyu Tema'}
          </Text>
          <Text>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
          ]}>
          <Text style={{color: theme.colors.text}}>Bildirim Ayarları</Text>
          <Text>➡️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: theme.colors.white, borderColor: theme.colors.border},
          ]}>
          <Text style={{color: theme.colors.text}}>Dil Ayarları</Text>
          <Text>➡️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, {backgroundColor: theme.colors.danger}]}
        onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen; 