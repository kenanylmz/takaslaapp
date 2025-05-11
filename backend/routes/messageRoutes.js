const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  startConversation,
} = require('../controllers/messageController');

// Get all conversations for logged in user
router.get('/conversations', protect, getUserConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', protect, getConversationMessages);

// Start a new conversation with a user
router.post('/conversations/start/:receiverId', protect, startConversation);

// Send a message
router.post('/send', protect, sendMessage);

module.exports = router;
