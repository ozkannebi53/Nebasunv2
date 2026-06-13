# NEBASUN v2 - Proje Raporu ve Açıklamalar

Bu dosya, Nebasunv2 projesinde yapılan tüm teknik güncellemeleri ve uygulama yapısını özetlemektedir.

## 🚀 Yapılan Temel Güncellemeler

### 1. Oyun Mekaniği ve WOW Tarzı Yapı
- **Kesişen Izgara (Grid):** Kelimeler artık bağımsız bloklar değil, bir çengel bulmaca gibi birbirine bağlanarak yerleşiyor.
- **Statik Seviye Veritabanı:** `data/world-data.ts` üzerinden Ülke -> İl -> Seviye (10 Seviye) yapısı kuruldu. Toplamda Türkiye, Suriye, İran ve Irak için 40 özel seviye hazırlandı.
- **Otomatik Seviye Geçişi:** Bir bölüm bittiğinde ödül ekranı çıkar ve oyuncuyu bir sonraki bölüme otomatik yönlendirir.

### 2. Ekonomi ve İpucu Sistemi
- **Altın & Elmas:** Oyun içi ekonomi sistemi kuruldu.
- **İpucu (Hint):** 50 Elmas karşılığında 10 İpucu satın alma mekanizması eklendi.
- **Profil Entegrasyonu:** Tüm bu değerler profil ekranında gerçek zamanlı takip edilebilir.

### 3. LIMA AI (Yapay Zeka)
- **Motor Değişimi:** Gemini API yerine daha stabil olan OpenAI uyumlu AI servisi (`server/_core/ai-service.ts`) entegre edildi.
- **Retry Mekanizması:** Bağlantı hatalarında 3 kez otomatik deneme (retry) özelliği eklendi.
- **UI İyileştirmesi:** AI ikonu (🦂) küçültüldü ve daha zarif bir görünüme kavuşturuldu.

### 4. Kullanıcı Arayüzü (UI)
- **Ana Ekran:** Alt navigasyon butonları (Anasayfa, Oyun, AI, Profil) geri getirildi.
- **Profil Ekranı:** Çökme hataları giderildi, Görevler ve Lig sistemi görselleştirildi.
- **Dokunma Kontrolü:** PanResponder sadece harf çemberi içinde çalışacak şekilde kilitlendi (hayalet dokunuşlar engellendi).

---

## 📂 Dosya Yapısı

- `app/index.tsx`: Ana navigasyon ve Ülke-İl seçim ekranı.
- `app/game.tsx`: Ana oyun ekranı, çember ve ızgara mantığı.
- `app/profile.tsx`: Kullanıcı istatistikleri, görevler ve mağaza.
- `app/lima.tsx`: AI sohbet ekranı.
- `data/world-data.ts`: Tüm seviye verilerinin bulunduğu veritabanı.
- `lib/game-context.tsx`: Uygulama genelindeki state yönetimi (Altın, Elmas vb.).
- `server/_core/ai-service.ts`: AI bağlantı motoru.

---

## 🛠️ Kurulum ve Çalıştırma

1. `npm install` veya `pnpm install` ile bağımlılıkları yükleyin.
2. `.env.local` dosyasına gerekli API anahtarlarını ekleyin.
3. `npx expo start` ile uygulamayı başlatın.

**Geliştirici:** Manus AI 🦂
**Tarih:** 12 Haziran 2026
