const {getSuggestions} = require('../services/geminiService');
const Listing = require('../models/Listing');

// @desc    Ürün için takas önerileri al
// @route   GET /api/suggestions/:id
// @access  Private
const getListingSuggestions = async (req, res) => {
  try {
    // İlan ID'sini al
    const listingId = req.params.id;
    console.log(`${listingId} ID'li ilan için takas önerisi isteniyor`);

    // İlanı veritabanından al
    const listing = await Listing.findById(listingId);

    if (!listing) {
      console.log('İlan bulunamadı:', listingId);
      return res.status(404).json({
        message: 'İlan bulunamadı',
        suggestions: [],
        success: false,
      });
    }

    // Kullanıcı ilanın sahibi mi kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      console.log('Yetkisiz erişim denemesi');
      return res.status(403).json({
        message: 'Bu işlem için yetkili değilsiniz',
        suggestions: [],
        success: false,
      });
    }

    // Gemini'den takas önerileri al
    console.log("Gemini API'ye istek gönderiliyor...");
    const suggestions = await getSuggestions(listing);
    console.log('Elde edilen takas önerileri:', suggestions);

    // Önerileri döndür
    if (!suggestions || suggestions.length === 0) {
      console.log('Öneri bulunamadı');
      return res.status(200).json({
        message: 'Takas önerisi bulunamadı',
        suggestions: [],
        success: true,
      });
    }

    return res.status(200).json({
      message: 'Takas önerileri başarıyla alındı',
      suggestions: suggestions,
      success: true,
    });
  } catch (error) {
    console.error('Öneri alma hatası:', error);
    return res.status(500).json({
      message: 'Takas önerisi alınamadı',
      error: error.message,
      suggestions: [],
      success: false,
    });
  }
};

// @desc    Yeni ilan için takas önerileri al (henüz kaydedilmemiş)
// @route   POST /api/suggestions
// @access  Private
const getNewListingSuggestions = async (req, res) => {
  try {
    console.log('Takas önerisi isteği alındı:', req.body);
    const listingData = req.body;

    // Gerekli alanların olup olmadığını kontrol et
    if (
      !listingData.title ||
      !listingData.category ||
      !listingData.description ||
      !listingData.condition
    ) {
      console.log('Eksik bilgi ile istek:', listingData);
      return res.status(400).json({
        message: 'Takas önerisi için gerekli bilgiler eksik',
        suggestions: [],
        success: false,
      });
    }

    // Gemini'den takas önerileri al
    console.log("Gemini API'ye istek gönderiliyor...");
    const suggestions = await getSuggestions(listingData);
    console.log('Elde edilen takas önerileri:', suggestions);

    // Önerileri döndür
    if (!suggestions || suggestions.length === 0) {
      console.log('Öneri bulunamadı');
      return res.status(200).json({
        message: 'Takas önerisi bulunamadı',
        suggestions: [],
        success: true,
      });
    }

    return res.status(200).json({
      message: 'Takas önerileri başarıyla alındı',
      suggestions: suggestions,
      success: true,
    });
  } catch (error) {
    console.error('Öneri alma hatası:', error);
    return res.status(500).json({
      message: 'Takas önerisi alınamadı',
      error: error.message,
      suggestions: [],
      success: false,
    });
  }
};

module.exports = {
  getListingSuggestions,
  getNewListingSuggestions,
};
