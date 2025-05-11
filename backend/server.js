const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// .env değişkenlerini yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // Tüm kaynaklara izin ver (geliştirme için)
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(
  cors({
    origin: '*', // Tüm kaynaklara izin ver (geliştirme için)
  }),
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Statik dosyalar için klasörler - uploads klasörünü doğru şekilde ayarlayalım
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Uploads klasörlerini oluştur
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true});
}

// Listings klasörü için uploads klasörü
const listingsUploadDir = path.join(__dirname, 'uploads/listings');
if (!fs.existsSync(listingsUploadDir)) {
  fs.mkdirSync(listingsUploadDir, {recursive: true});
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Takasla API çalışıyor');
});

// Socket.io kullanıcı bağlantı yönetimi
const userSockets = {};

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handler
io.on('connection', socket => {
  console.log(`User connected: ${socket.user._id}`);

  // Store user socket connection
  userSockets[socket.user._id] = socket.id;

  // User joins their own room
  socket.join(socket.user._id.toString());

  // Update user's last active status
  User.findByIdAndUpdate(socket.user._id, {lastActive: new Date()}).exec();

  // Handle incoming messages
  socket.on('sendMessage', async data => {
    const {receiverId, content} = data;

    // Emit to receiver if they're online
    if (userSockets[receiverId]) {
      io.to(receiverId).emit('newMessage', {
        senderId: socket.user._id,
        senderName: socket.user.name,
        senderImage: socket.user.profileImage,
        content,
        createdAt: new Date(),
      });
    }
  });

  // Handle user typing status
  socket.on('typing', data => {
    const {receiverId} = data;

    if (userSockets[receiverId]) {
      io.to(receiverId).emit('userTyping', {
        senderId: socket.user._id,
        isTyping: true,
      });
    }
  });

  socket.on('stopTyping', data => {
    const {receiverId} = data;

    if (userSockets[receiverId]) {
      io.to(receiverId).emit('userTyping', {
        senderId: socket.user._id,
        isTyping: false,
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user._id}`);
    delete userSockets[socket.user._id];

    // Update user's last active status
    User.findByIdAndUpdate(socket.user._id, {lastActive: new Date()}).exec();
  });
});

// Port ayarı
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server ${PORT} numaralı portta çalışıyor`);
});
