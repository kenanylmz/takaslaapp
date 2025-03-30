const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email formatını kontrol et
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçersiz email formatı' });
    }

    // Kullanıcının daha önce kayıtlı olup olmadığını kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email adresi zaten kayıtlı' });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password,
      createdAt: new Date(),
      lastActive: new Date()
    });

    // Başarılı yanıt döndür
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul (password dahil)
    const user = await User.findOne({ email }).select('+password');

    // Kullanıcı yoksa veya şifre eşleşmiyorsa
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Son aktif tarihini güncelle
    user.lastActive = new Date();
    await user.save();

    // Başarılı yanıt döndür
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Şifre sıfırlama
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Kullanıcıyı e-posta adresiyle bul
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Bu email adresiyle kayıtlı kullanıcı bulunamadı' });
    }

    // Gerçek uygulamada şifre sıfırlama e-postası gönderme işlemi yapılır
    // Şu an basit tutuyoruz
    
    res.status(200).json({ 
      success: true,
      message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi'
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword
}; 