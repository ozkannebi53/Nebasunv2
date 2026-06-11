# NEBASUN Tasarım Analizi

## Referans Fotoğraflardan Çıkarılan Tasarım Kuralları

### 1. Oyun Ekranı Genel Yapı
- **Üst bölüm**: Crossword grid (boş kutular, dolu kutular)
  - Boş kutular: Açık gri/beyaz, ince border
  - Dolu kutular: Seçili harfler mor/mavi renkli
  - Kelime anlamları yanında gösterilir
  
- **Alt bölüm**: Harf çemberi (büyük daire)
  - Beyaz arka plan, ince border
  - Harfler mavi/mor daireler içinde
  - Daireler bağlantı çizgileriyle birbirlerine bağlı
  - Seçili harfler renkli, seçilmeyenler gri
  - Şehir adı üstte ("UZAK", "GRİ", "KALEM")

### 2. Renk Şeması (Referanslara göre)
- **Arka plan**: Mavi gradient (açık mavi → koyu mavi)
- **Crossword kutular**: Beyaz (boş), mor/mavi (dolu)
- **Harf çemberi**: Beyaz daire, mavi/mor harfler
- **Seçili harfler**: Renkli daire (mavi/mor)
- **Seçilmemiş harfler**: Gri daire

### 3. Harf Çemberi Geometrisi
- Daire merkezi: Şehir adı yazısı
- Harfler: Dairenin etrafında eşit aralıklarla
- Bağlantı çizgileri: Seçili harfler arasında çizgi
- Sayı badge: Sağ üstte (seçili harf sayısı)

### 4. Crossword Grid
- Üst bölümde, harf çemberinin üstünde
- Satırlar halinde düzenlenmiş
- Boş kutular: Seçilebilir
- Dolu kutular: Harfler gösterilir, anlamlar yanında

### 5. Şehir Arka Planı
- Doğa manzarası (yeşil orman, su, dağ)
- Gece/gündüz teması (referanslarda gündüz ve gece var)
- Şeffaf efekt (glassmorphism)

## Uygulanacak Değişiklikler

- [ ] Oyun ekranı layout yeniden tasarla
- [ ] Crossword grid bileşeni oluştur
- [ ] Harf çemberi bileşeni yeniden tasarla (bağlantı çizgileri ekle)
- [ ] Renk şeması güncelle
- [ ] Şehir arka planları ekle
- [ ] Lima AI sohbet sistemi geliştir
- [ ] PvP kod sistemi ekle
- [ ] Giriş ekranı animasyonu oluştur
