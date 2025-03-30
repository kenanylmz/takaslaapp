const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Yetki hatası: Token yok' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Token içindeki id ile kullanıcıyı bul (password hariç)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
      }
      
      // Kullanıcının son aktif olma tarihini güncelle
      req.user.lastActive = Date.now();
      await req.user.save();
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Yetki hatası: Geçersiz token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { protect }; 