const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');

// @desc    Tüm ilanları getir
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({status: 'active'}).sort({
      createdAt: -1,
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    Kullanıcının kendi ilanlarını getir
// @route   GET /api/listings/mylistings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      user: req.user._id,
      status: {$ne: 'deleted'},
    }).sort({createdAt: -1});

    res.json(listings);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlan detaylarını getir
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    Yeni ilan oluştur
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const {title, category, description, city, condition} = req.body;

    // İlan oluştur
    const listing = await Listing.create({
      user: req.user._id,
      title,
      category,
      description,
      city,
      condition,
      images: req.files ? req.files.map(file => file.filename) : [],
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlan güncelle
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const {title, category, description, city, condition} = req.body;

    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    // İlanın sahibi olup olmadığını kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Bu işlem için yetkiniz yok'});
    }

    // Güncellenecek alanlar
    const updatedFields = {
      title,
      category,
      description,
      city,
      condition,
    };

    // Eğer yeni resimler eklendiyse
    if (req.files && req.files.length > 0) {
      updatedFields.images = [
        ...listing.images,
        ...req.files.map(file => file.filename),
      ];
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.json(listing);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlanı sil
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    // İlanın sahibi olup olmadığını kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Bu işlem için yetkiniz yok'});
    }

    // İlanı tamamen sil
    await Listing.findByIdAndDelete(req.params.id);

    res.json({message: 'İlan başarıyla silindi'});
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlan resmini sil
// @route   DELETE /api/listings/:id/image/:imageName
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    // İlanın sahibi olup olmadığını kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Bu işlem için yetkiniz yok'});
    }

    const imageName = req.params.imageName;

    // Resim listeden çıkarılıyor
    const updatedImages = listing.images.filter(img => img !== imageName);

    // İlan güncelleniyor
    await Listing.findByIdAndUpdate(req.params.id, {images: updatedImages});

    // Dosya sisteminden silme işlemi
    try {
      const imagePath = path.join(
        __dirname,
        '../../uploads/listings/',
        imageName,
      );
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error('Dosya silinirken hata:', err);
    }

    res.json({message: 'Resim başarıyla silindi'});
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

module.exports = {
  getListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  deleteImage,
};
