const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all conversations for a user
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: 'participants',
        match: {_id: {$ne: userId}}, // Only populate the other participant
        select: 'name profileImage lastActive',
      })
      .populate({
        path: 'lastMessage',
        select: 'content createdAt read',
      })
      .sort({updatedAt: -1});

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Konuşmalar alınırken bir hata oluştu',
    });
  }
};

// Get all messages for a specific conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const {conversationId} = req.params;
    const userId = req.user.id;

    // Verify the conversation exists and the user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Konuşma bulunamadı',
      });
    }

    // Check if user is a participant in this conversation
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Bu konuşmaya erişiminiz yok',
      });
    }

    // Get all messages for this conversation
    const messages = await Message.find({
      $or: [
        {
          sender: conversation.participants[0],
          receiver: conversation.participants[1],
        },
        {
          sender: conversation.participants[1],
          receiver: conversation.participants[0],
        },
      ],
    })
      .populate('sender', 'name profileImage')
      .sort({createdAt: 1});

    // Mark unread messages as read
    await Message.updateMany(
      {
        receiver: userId,
        read: false,
        $or: [
          {sender: conversation.participants[0]},
          {sender: conversation.participants[1]},
        ],
      },
      {read: true},
    );

    // Reset unread count in conversation
    await Conversation.findByIdAndUpdate(conversationId, {unreadCount: 0});

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Mesajlar alınırken bir hata oluştu',
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {receiverId, content} = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Kendinize mesaj gönderemezsiniz',
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Alıcı kullanıcı bulunamadı',
      });
    }

    // Create message
    const message = await Message.create(
      [
        {
          sender: senderId,
          receiver: receiverId,
          content: content,
        },
      ],
      {session},
    );

    // Find existing conversation or create a new one
    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]},
    }).session(session);

    if (conversation) {
      // Update existing conversation
      conversation.lastMessage = message[0]._id;
      conversation.updatedAt = new Date();

      // Increment unread count if the message is for the other user
      conversation.unreadCount += 1;

      await conversation.save({session});
    } else {
      // Create new conversation
      conversation = await Conversation.create(
        [
          {
            participants: [senderId, receiverId],
            lastMessage: message[0]._id,
            unreadCount: 1,
          },
        ],
        {session},
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Populate sender info before sending response
    const populatedMessage = await Message.findById(message[0]._id).populate(
      'sender',
      'name profileImage',
    );

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj gönderilirken bir hata oluştu',
    });
  }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const {receiverId} = req.params;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Kendinizle konuşma başlatamazsınız',
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
      });
    }

    // Check if a conversation already exists
    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]},
    });

    if (conversation) {
      // Return existing conversation
      conversation = await Conversation.findById(conversation._id)
        .populate({
          path: 'participants',
          match: {_id: {$ne: senderId}},
          select: 'name profileImage lastActive',
        })
        .populate({
          path: 'lastMessage',
          select: 'content createdAt read',
        });

      return res.status(200).json({
        success: true,
        data: conversation,
      });
    }

    // Create new conversation with no messages yet
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      unreadCount: 0,
    });

    // Populate other participant info
    conversation = await Conversation.findById(conversation._id).populate({
      path: 'participants',
      match: {_id: {$ne: senderId}},
      select: 'name profileImage lastActive',
    });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Konuşma başlatılırken bir hata oluştu',
    });
  }
};
