const {GoogleGenerativeAI} = require('@google/generative-ai');
require('dotenv').config();

// Gemini API anahtarını .env dosyasından al
const apiKey = process.env.GEMINI_API_KEY;

// API anahtarı yoksa hata ver
if (!apiKey) {
  console.error('GEMINI_API_KEY .env dosyasında bulunamadı!');
}

// Gemini API'yi başlat
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Ürün bilgilerine göre takas önerileri al
 * @param {Object} listing - Ürün bilgileri
 * @returns {Promise<Array>} - Takas önerileri
 */
async function getSuggestions(listing) {
  try {
    // Gemini modeline erişim
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

    // Ürünle ilgili bilgileri hazırla - sadece metin bilgileri
    const prompt = `
      Sen bir takas uzmanısın. Aşağıdaki ürün bilgileri için 5 somut takas önerisi ver.
      
      Ürün: ${listing.title || 'Belirtilmemiş'} 
      Kategori: ${listing.category || 'Belirtilmemiş'}
      Açıklama: ${listing.description || 'Belirtilmemiş'}
      Durum: ${listing.condition || 'Belirtilmemiş'}
      
      Her önerinin sadece ürün adı ve neden takas edilmeli bilgisini ver.
      Çok kısa ve öz yanıtlar ver (her "reason" 100 karakteri geçmesin).
      
      Cevabını bu JSON formatında ver:
      [
        { "item": "Spesifik ürün adı (marka/model)", "reason": "Kısa takas nedeni (100 karakter max)" },
        ...
      ]
      
      Sadece JSON döndür, hiçbir ek açıklama ekleme.
    `;

    console.log("Gemini'ye istek gönderiliyor...");

    // Gemini'ye istek gönder
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini'den gelen yanıt:", text);

    // JSON yanıtını parse et
    try {
      // JSON formatını düzgün şekilde ayıkla
      let jsonStr = text;

      // Eğer yanıtta başka metin varsa, JSON kısmını bul
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      // JSON'ı parse et
      const suggestions = JSON.parse(jsonStr);

      // Uygun formata dönüştür
      return suggestions.map(suggestion => ({
        name: suggestion.item || suggestion.name, // item veya name alanını kontrol et
        reason: suggestion.reason,
      }));
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);

      // Basitleştirilmiş düzeltme
      return [
        {
          name: 'Samsung Galaxy S22',
          reason: 'Aynı değer segmentinde, farklı bir ekosistem.',
        },
        {
          name: 'iPad Air',
          reason: 'Farklı bir Apple cihazı, benzer fiyat aralığında.',
        },
        {
          name: 'MacBook Air',
          reason: 'Bilgisayara ihtiyacı olanlar için değerinde bir takas.',
        },
      ];
    }
  } catch (error) {
    console.error('Gemini API hatası:', error);
    return [
      {
        name: 'API Hatası',
        reason: 'Öneriler şu anda alınamıyor, lütfen daha sonra deneyin.',
      },
    ];
  }
}

module.exports = {getSuggestions};
