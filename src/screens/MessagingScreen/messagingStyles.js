import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const messagingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingRight: 20,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  unreadConversation: {
    backgroundColor: '#E8F5FE',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  timeStamp: {
    fontSize: 12,
    color: colors.textLight,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 30,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  unreadCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  // Chat screen styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  chatHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStatus: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageRow: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessageRow: {
    alignSelf: 'flex-end',
  },
  otherMessageRow: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    minHeight: 40,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 5,
  },
  messageText: {
    fontSize: 15,
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: '#E0E0E0',
  },
  otherMessageTime: {
    color: colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  sendIcon: {
    color: colors.white,
    fontSize: 18,
  },
  typingIndicator: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  typingText: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  dateHeader: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 12,
    color: colors.textLight,
  },
});
