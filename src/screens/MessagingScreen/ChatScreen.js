import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../contexts/AuthContext';
import {messagingStyles} from './messagingStyles';
import {
  getConversationMessages,
  sendMessage,
  getSocket,
  sendTypingStatus,
} from '../../services/messageService';
import {API_URL} from '../../config';
import {format, isToday, isYesterday, isThisYear} from 'date-fns';
import {tr} from 'date-fns/locale';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const {authState} = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const {conversationId, receiver} = route.params;
  const socket = getSocket();

  // Load initial messages
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('newMessage', handleNewMessage);

      // Listen for typing indicators
      socket.on('userTyping', handleTypingIndicator);

      // Clean up socket listeners on component unmount
      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('userTyping', handleTypingIndicator);
      };
    }
  }, [socket, receiver]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversationMessages(
        authState.token,
        conversationId,
      );
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Mesajlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = data => {
    // Only process messages from the current conversation partner
    if (data.senderId === receiver._id) {
      const newMessage = {
        _id: new Date().getTime().toString(), // Temporary ID until refresh
        content: data.content,
        createdAt: data.createdAt || new Date(),
        sender: {
          _id: data.senderId,
          name: data.senderName,
          profileImage: data.senderImage,
        },
        read: false,
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsTyping(false);
    }
  };

  const handleTypingIndicator = data => {
    if (data.senderId === receiver._id) {
      setIsTyping(data.isTyping);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage.trim();
    setInputMessage('');

    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
      sendTypingStatus(receiver._id, false);
    }

    try {
      const sentMessage = await sendMessage(
        authState.token,
        receiver._id,
        messageToSend,
      );

      // Add the message to the list
      setMessages(prevMessages => [...prevMessages, sentMessage]);

      // Scroll to bottom
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({animated: true});
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show an error toast or retry logic
    }
  };

  const handleInputChange = text => {
    setInputMessage(text);

    // Send typing indicator
    if (text.trim().length > 0) {
      sendTypingStatus(receiver._id, true);

      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Set new timeout to clear typing indicator after 3 seconds of inactivity
      const timeout = setTimeout(() => {
        sendTypingStatus(receiver._id, false);
      }, 3000);

      setTypingTimeout(timeout);
    } else {
      // If input is empty, clear typing indicator immediately
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
      sendTypingStatus(receiver._id, false);
    }
  };

  const formatMessageDate = date => {
    const messageDate = new Date(date);

    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return 'Dün ' + format(messageDate, 'HH:mm');
    } else if (isThisYear(messageDate)) {
      return format(messageDate, 'd MMM HH:mm', {locale: tr});
    } else {
      return format(messageDate, 'd MMM yyyy HH:mm', {locale: tr});
    }
  };

  const renderMessageItem = ({item, index}) => {
    const isMyMessage = item.sender._id === authState.user._id;
    const showDateHeader =
      index === 0 ||
      !isSameDay(
        new Date(item.createdAt),
        new Date(messages[index - 1].createdAt),
      );

    return (
      <>
        {showDateHeader && (
          <View style={messagingStyles.dateHeader}>
            <Text style={messagingStyles.dateHeaderText}>
              {formatDateHeader(item.createdAt)}
            </Text>
          </View>
        )}

        <View
          style={[
            messagingStyles.messageRow,
            isMyMessage
              ? messagingStyles.myMessageRow
              : messagingStyles.otherMessageRow,
          ]}>
          <View
            style={[
              messagingStyles.messageBubble,
              isMyMessage
                ? messagingStyles.myMessageBubble
                : messagingStyles.otherMessageBubble,
            ]}>
            <Text
              style={[
                messagingStyles.messageText,
                isMyMessage
                  ? messagingStyles.myMessageText
                  : messagingStyles.otherMessageText,
              ]}>
              {item.content}
            </Text>
            <Text
              style={[
                messagingStyles.messageTime,
                isMyMessage
                  ? messagingStyles.myMessageTime
                  : messagingStyles.otherMessageTime,
              ]}>
              {formatMessageDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatDateHeader = dateString => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return 'Bugün';
    } else if (isYesterday(date)) {
      return 'Dün';
    } else if (isThisYear(date)) {
      return format(date, 'd MMMM', {locale: tr});
    } else {
      return format(date, 'd MMMM yyyy', {locale: tr});
    }
  };

  const renderHeader = () => (
    <View style={messagingStyles.chatHeader}>
      <TouchableOpacity
        style={messagingStyles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={messagingStyles.backIcon} />
      </TouchableOpacity>

      <View style={messagingStyles.userInfo}>
        <Image
          source={
            receiver.profileImage
              ? {uri: `${API_URL}/uploads/profiles/${receiver.profileImage}`}
              : require('../../assets/images/default-avatar.png')
          }
          style={messagingStyles.userAvatar}
        />
        <View>
          <Text style={messagingStyles.userName}>
            {receiver.name || 'Kullanıcı'}
          </Text>
          <Text style={messagingStyles.userStatus}>
            {receiver.lastActive
              ? `Son görülme: ${formatDistanceToNow(
                  new Date(receiver.lastActive),
                  {addSuffix: true, locale: tr},
                )}`
              : 'Çevrimiçi'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={messagingStyles.chatContainer}>
        {renderHeader()}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={messagingStyles.chatContainer}>
      {renderHeader()}

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          style={messagingStyles.messagesList}
          data={messages}
          keyExtractor={item => item._id.toString()}
          renderItem={renderMessageItem}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: false})
          }
        />

        {isTyping && (
          <View style={messagingStyles.typingIndicator}>
            <Text style={messagingStyles.typingText}>
              {receiver.name || 'Kullanıcı'} yazıyor...
            </Text>
          </View>
        )}

        <View style={messagingStyles.inputContainer}>
          <TextInput
            style={messagingStyles.messageInput}
            placeholder="Mesajınızı yazın..."
            value={inputMessage}
            onChangeText={handleInputChange}
            multiline
          />
          <TouchableOpacity
            style={[
              messagingStyles.sendButton,
              !inputMessage.trim() && messagingStyles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}>
            <Icon name="send" style={messagingStyles.sendIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
