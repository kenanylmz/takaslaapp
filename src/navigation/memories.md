# Navigasyon Hafızası

## Genel Yapı

- [2024-07-17] İlk navigasyon yapısı oluşturuldu. React Navigation kullanılıyor.
- [2024-07-17] Stack navigasyon ve Tab navigasyon birlikte kullanılacak şekilde yapı kuruldu.
- [2024-07-17] Ana akış: SplashScreen -> Onboarding (ilk kullanımda) -> Auth Ekranları -> Ana Ekranlar

## Auth Flow

- [2024-07-17] Auth flow için Stack Navigator kullanıldı: Login -> Register -> ForgotPassword
- [2024-07-17] Login'den Register ve ForgotPassword ekranlarına geçiş yapılabiliyor
- [2024-07-17] AsyncStorage kullanılarak kullanıcı oturumu saklanıyor
- [2024-07-18] ForgotPassword ekranı eklendi, Login ekranından erişilebilir

## Main Flow

- [2024-07-17] Ana ekranlar için Tab Navigator planlandı: Home, Trade, Profile
- [2024-07-19] Geçici olarak Home, Trade, Profile ekranları kaldırıldı
- [2024-07-19] Geçici bir Dashboard ekranı eklendi, login sonrası bu ekran gösteriliyor
- [2024-07-19] İleride ana ekranlar tekrar eklendiğinde Tab Navigator yapısına geçilecek

## Onboarding Flow

- [2024-07-18] Onboarding ekranı eklendi, kullanıcı uygulamayı ilk kez açtığında gösteriliyor
- [2024-07-18] Onboarding görüldükten sonra AsyncStorage'a kaydediliyor ve tekrar gösterilmiyor
- [2024-07-18] "Geç" butonu ile onboarding atlanabilir

## Screen Options

- [2024-07-17] Stack Navigator için headerShown: false ayarlandı, custom header kullanılacak
- [2024-07-17] Tab Navigator için custom icon ve stil ayarları yapıldı (şu an geçici olarak kaldırıldı)

## Yapılacaklar ve Planlanan Değişiklikler

- Ana ekranlar (Home, Trade, Profile) yeniden eklenecek
- Tab Navigator stil ve icon düzenlemeleri yapılacak
- Deep linking desteği eklenecek
- Animasyon geçişleri iyileştirilecek
