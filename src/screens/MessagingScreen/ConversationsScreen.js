import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../contexts/AuthContext';
import {messagingStyles} from './messagingStyles';
import {getConversations} from '../../services/messageService';
import {API_URL} from '../../config';
import {formatDistanceToNow} from 'date-fns';
import {tr} from 'date-fns/locale';
import Icon from 'react-native-vector-icons/Ionicons';

const ConversationsScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {authState} = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchConversations();

    // Listen for focus event to refresh conversations when returning to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchConversations();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations(authState.token);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleConversationPress = conversation => {
    navigation.navigate('ChatScreen', {
      conversationId: conversation._id,
      receiver: conversation.participants[0],
    });
  };

  const renderConversationItem = ({item}) => {
    // Since we're only populating the other participant, we can directly use participants[0]
    const otherUser = item.participants[0];

    // If no profile image, use a default avatar
    const profileImage = otherUser?.profileImage
      ? {uri: `${API_URL}/uploads/profiles/${otherUser.profileImage}`}
      : require('../../assets/images/default-avatar.png');

    // Format timestamp
    const timestamp = item.updatedAt
      ? formatDistanceToNow(new Date(item.updatedAt), {
          addSuffix: true,
          locale: tr,
        })
      : '';

    // Get last message content or placeholder
    const lastMessageContent = item.lastMessage
      ? item.lastMessage.content
      : 'Henüz mesaj yok';

    return (
      <TouchableOpacity
        style={[
          messagingStyles.conversationItem,
          item.unreadCount > 0 && messagingStyles.unreadConversation,
        ]}
        onPress={() => handleConversationPress(item)}>
        <Image source={profileImage} style={messagingStyles.avatar} />

        <View style={messagingStyles.conversationInfo}>
          <View style={messagingStyles.nameRow}>
            <Text style={messagingStyles.userName}>
              {otherUser?.name || 'Kullanıcı'}
            </Text>
            <Text style={messagingStyles.timeStamp}>{timestamp}</Text>
          </View>

          <Text
            style={messagingStyles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail">
            {lastMessageContent}
          </Text>
        </View>

        {item.unreadCount > 0 && (
          <View style={messagingStyles.unreadBadge}>
            <Text style={messagingStyles.unreadCount}>
              {item.unreadCount > 9 ? '9+' : item.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={messagingStyles.emptyState}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={messagingStyles.emptyState}>
        <Text style={messagingStyles.emptyStateText}>
          Henüz hiç mesajınız yok. Takaslama yapmak istediğiniz kişilerle sohbet
          başlatabilirsiniz.
        </Text>
        <TouchableOpacity
          style={messagingStyles.emptyStateButton}
          onPress={() => navigation.navigate('ExploreScreen')}>
          <Text style={messagingStyles.emptyStateButtonText}>
            Ürünleri Keşfet
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={messagingStyles.container}>
      <View style={messagingStyles.header}>
        <Text style={messagingStyles.headerTitle}>Mesajlar</Text>
      </View>

      <FlatList
        style={messagingStyles.conversationList}
        data={conversations}
        keyExtractor={item => item._id}
        renderItem={renderConversationItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0000ff']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

export default ConversationsScreen;
