import axios from 'axios';
import {API_URL} from '../config';
import io from 'socket.io-client';

let socket = null;

// Initialize socket connection
export const initializeSocket = token => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    auth: {token},
  });

  return socket;
};

// Get socket instance
export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket connection not initialized');
  }
  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get all conversations for current user
export const getConversations = async token => {
  try {
    const response = await axios.get(`${API_URL}/api/messages/conversations`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (token, conversationId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/messages/conversations/${conversationId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Start a new conversation with a user
export const startConversation = async (token, receiverId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/messages/conversations/start/${receiverId}`,
      {},
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (token, receiverId, content) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/messages/send`,
      {receiverId, content},
      {headers: {Authorization: `Bearer ${token}`}},
    );

    // Emit the message via socket
    if (socket) {
      socket.emit('sendMessage', {receiverId, content});
    }

    return response.data.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Send typing indicator
export const sendTypingStatus = (receiverId, isTyping = true) => {
  if (socket) {
    socket.emit(isTyping ? 'typing' : 'stopTyping', {receiverId});
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  getConversations,
  getConversationMessages,
  startConversation,
  sendMessage,
  sendTypingStatus,
};
