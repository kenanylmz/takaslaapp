const User = require('../models/User');

// @desc    Kullanıcı profilini getir
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // Kullanıcı middleware tarafından req.user'a eklenir
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      rating: user.rating,
      ratingCount: user.ratingCount,
      location: user.location,
      phone: user.phone,
      createdAt: user.createdAt,
      lastActive: user.lastActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı profilini güncelle
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Kullanıcı bilgilerini güncelle
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    // Son aktif tarihini güncelle
    user.lastActive = new Date();

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      location: user.location,
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Profil resmi yükle
// @route   POST /api/profile/upload-image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir resim yükleyin' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Dosya adını kullanıcıya kaydet
    user.profileImage = req.file.filename;
    user.lastActive = new Date();
    
    await user.save();

    res.json({
      _id: user._id,
      profileImage: user.profileImage,
      message: 'Profil resmi başarıyla güncellendi'
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage
}; 